import { useState } from "react";
import { Pencil, Trash, Upload, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCategoryStore } from "../stores/useCategoryStore";
import { readFileAsDataUrl } from "../lib/readFileAsDataUrl";

const MAX_NAME = 40; // keep in step with the backend limit

const inputClass =
	"block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

// reads the chosen photo and hands it back; shows a message if it can't be read
const pickPhoto = async (e, onPicked) => {
	const file = e.target.files[0];
	e.target.value = "";
	if (!file) return;
	try {
		onPicked(await readFileAsDataUrl(file));
	} catch (error) {
		toast.error("Couldn't read that photo. Please try another one.");
	}
};

// start of add form
const AddCategoryForm = () => {
	const { createCategory } = useCategoryStore();
	const [name, setName] = useState("");
	const [image, setImage] = useState(null);
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		const ok = await createCategory({ name: name.trim(), image });
		if (ok) {
			setName("");
			setImage(null);
		}
		setSaving(false);
	};

	return (
		<form onSubmit={handleSubmit} className='mb-8 rounded-2xl border border-line bg-white p-5 sm:p-6'>
			<h2 className='mb-4 font-display text-xl font-bold text-ink'>Add a category</h2>

			<div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
				<div className='flex-1'>
					<label htmlFor='newCategoryName' className='mb-1.5 block text-[13px] font-semibold text-ink'>
						Name
					</label>
					<input
						id='newCategoryName'
						type='text'
						required
						maxLength={MAX_NAME}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='e.g. Jackets'
						className={inputClass}
					/>
				</div>

				<div>
					<input
						id='newCategoryPhoto'
						type='file'
						accept='image/*'
						className='sr-only'
						onChange={(e) => pickPhoto(e, setImage)}
					/>
					<label
						htmlFor='newCategoryPhoto'
						className='flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#D9D6D2] bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-ink'
					>
						{image ? (
							<img src={image} alt='' className='mr-2 h-7 w-7 rounded object-cover' />
						) : (
							<Upload className='mr-2 h-4 w-4' />
						)}
						{image ? "Change photo" : "Add photo"}
					</label>
				</div>

				<button
					type='submit'
					disabled={saving || !name.trim() || !image}
					className='flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50'
				>
					<Plus className='mr-1.5 h-4 w-4' />
					{saving ? "Adding..." : "Add"}
				</button>
			</div>
			<p className='mt-3 text-xs text-muted'>
				The photo is shown on the homepage tile. A portrait photo works best.
			</p>
		</form>
	);
};
// end of add form

// start of one row (view, or edit in place)
const CategoryRow = ({ category }) => {
	const { updateCategory, deleteCategory } = useCategoryStore();
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(category.name);
	const [newImage, setNewImage] = useState(null);
	const [saving, setSaving] = useState(false);

	const cancelEdit = () => {
		setEditing(false);
		setName(category.name);
		setNewImage(null);
	};

	const handleSave = async () => {
		const changes = {};
		if (name.trim() !== category.name) changes.name = name.trim();
		if (newImage) changes.image = newImage;

		if (Object.keys(changes).length === 0) {
			cancelEdit();
			return;
		}

		setSaving(true);
		const ok = await updateCategory(category._id, changes);
		setSaving(false);
		if (ok) {
			setEditing(false);
			setNewImage(null);
		}
	};

	const handleDelete = () => {
		if (window.confirm(`Delete "${category.name}"? This cannot be undone.`)) {
			deleteCategory(category._id);
		}
	};

	return (
		<li className='flex items-center gap-3 p-3 sm:gap-4 sm:p-4'>
			<img
				src={newImage || category.image}
				alt={category.name}
				className='h-[70px] w-14 shrink-0 rounded-lg bg-surface object-cover'
			/>

			{editing ? (
				<div className='min-w-0 flex-1 space-y-2'>
					<input
						type='text'
						aria-label='Category name'
						maxLength={MAX_NAME}
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={inputClass}
					/>
					<div className='flex flex-wrap items-center gap-2'>
						<input
							id={`photo-${category._id}`}
							type='file'
							accept='image/*'
							className='sr-only'
							onChange={(e) => pickPhoto(e, setNewImage)}
						/>
						<label
							htmlFor={`photo-${category._id}`}
							className='inline-flex cursor-pointer items-center rounded-lg border border-[#D9D6D2] px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink'
						>
							<Upload className='mr-1.5 h-4 w-4' />
							{newImage ? "Choose a different photo" : "Change photo"}
						</label>
						<button
							type='button'
							onClick={handleSave}
							disabled={saving || !name.trim()}
							className='rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50'
						>
							{saving ? "Saving..." : "Save"}
						</button>
						<button
							type='button'
							onClick={cancelEdit}
							className='rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink'
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<>
					<div className='min-w-0 flex-1'>
						<p className='truncate font-semibold text-ink'>{category.name}</p>
						<p className='truncate text-sm text-muted'>/category/{category.slug}</p>
					</div>
					<button
						type='button'
						onClick={() => setEditing(true)}
						aria-label={`Edit ${category.name}`}
						className='flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand'
					>
						<Pencil className='h-5 w-5' />
					</button>
					<button
						type='button'
						onClick={handleDelete}
						aria-label={`Delete ${category.name}`}
						className='flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand'
					>
						<Trash className='h-5 w-5' />
					</button>
				</>
			)}
		</li>
	);
};
// end of one row

const CategoriesTab = () => {
	const { categories, loaded } = useCategoryStore();

	return (
		<div className='mx-auto max-w-3xl'>
			<AddCategoryForm />

			{!loaded ? (
				<div className='animate-pulse space-y-3'>
					{[...Array(3)].map((_, i) => (
						<div key={i} className='h-24 rounded-xl border border-line bg-surface' />
					))}
				</div>
			) : categories.length === 0 ? (
				<p className='text-center text-muted'>No categories yet. Add your first one above.</p>
			) : (
				<ul className='divide-y divide-line overflow-hidden rounded-xl border border-line bg-white'>
					{categories.map((category) => (
						<CategoryRow key={category._id} category={category} />
					))}
				</ul>
			)}

			<p className='mt-4 text-xs text-muted'>
				A category can only be deleted once no products use it. Renaming keeps its link and its products.
			</p>
		</div>
	);
};

export default CategoriesTab;
