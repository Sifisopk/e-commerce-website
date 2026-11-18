import { useState } from "react";
import { Upload, Loader, X } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";

const inputClass =
	"block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink";

const emptyProduct = {
	name: "",
	description: "",
	price: "",
	category: "",
	images: [],
	colors: "",
	sizes: "",
};

const toList = (text) =>
	text
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

// One form for BOTH creating and editing a product.
// onSubmit receives the finished product data (colors and sizes already turned into lists).
const ProductForm = ({
	initialValues = emptyProduct,
	onSubmit,
	loading,
	icon: SubmitIcon,
	submitLabel,
	loadingLabel = "Saving...",
}) => {
	const [form, setForm] = useState(initialValues);
	const { categories } = useCategoryStore();

	const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

	// start of images
	const handleImageChange = (e) => {
		Array.from(e.target.files).forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setForm((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
			};
			reader.readAsDataURL(file); // base64
		});
		e.target.value = ""; // lets you pick the same file again
	};

	const removeImage = (index) => {
		setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
	};
	// end of images

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ ...form, colors: toList(form.colors), sizes: toList(form.sizes) });
	};

	// categories come from Dashboard > Categories; an old product's category stays selectable
	const options = categories.map((c) => ({ value: c.slug, label: c.name }));
	const knownCategory = !form.category || options.some((c) => c.value === form.category);
	const categoryOptions = knownCategory ? options : [...options, { value: form.category, label: form.category }];

	return (
		<form onSubmit={handleSubmit} className='space-y-5'>
			<div>
				<label htmlFor='name' className={labelClass}>
					Product name
				</label>
				<input
					id='name'
					type='text'
					value={form.name}
					onChange={(e) => setField("name", e.target.value)}
					className={inputClass}
					required
				/>
			</div>

			<div>
				<label htmlFor='description' className={labelClass}>
					Description
				</label>
				<textarea
					id='description'
					rows='4'
					value={form.description}
					onChange={(e) => setField("description", e.target.value)}
					className='block w-full rounded-lg border border-[#D9D6D2] bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
					required
				/>
			</div>

			<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
				<div>
					<label htmlFor='price' className={labelClass}>
						Price (R)
					</label>
					<input
						id='price'
						type='number'
						step='0.01'
						min='0'
						value={form.price}
						onChange={(e) => setField("price", e.target.value)}
						className={inputClass}
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className={labelClass}>
						Category
					</label>
					<select
						id='category'
						value={form.category}
						onChange={(e) => setField("category", e.target.value)}
						className={inputClass}
						required
					>
						<option value=''>Select a category</option>
						{categoryOptions.map((category) => (
							<option key={category.value} value={category.value}>
								{category.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor='colors' className={labelClass}>
						Colours (comma separated)
					</label>
					<input
						id='colors'
						type='text'
						value={form.colors}
						onChange={(e) => setField("colors", e.target.value)}
						placeholder='e.g. Black, Grey, White'
						className={inputClass}
					/>
				</div>

				<div>
					<label htmlFor='sizes' className={labelClass}>
						Sizes (comma separated)
					</label>
					<input
						id='sizes'
						type='text'
						value={form.sizes}
						onChange={(e) => setField("sizes", e.target.value)}
						placeholder='e.g. S, M, L, XL'
						className={inputClass}
					/>
				</div>
			</div>

			{/* start of photos */}
			<div>
				<span className={labelClass}>Photos</span>
				<p className='mb-3 text-xs text-muted'>The first photo is the cover shown on product cards.</p>

				<input id='images' type='file' className='sr-only' accept='image/*' multiple onChange={handleImageChange} />
				<label
					htmlFor='images'
					className='flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[#D9D6D2] bg-surface px-4 py-6 text-sm text-muted transition-colors hover:border-ink'
				>
					<Upload className='h-5 w-5' />
					<span className='font-medium text-ink'>Upload photos</span>
					<span className='text-xs'>You can select more than one</span>
				</label>

				{form.images.length > 0 && (
					<div className='mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4'>
						{form.images.map((img, index) => (
							<div key={index} className='relative aspect-square'>
								<img src={img} alt={`Photo ${index + 1}`} className='h-full w-full rounded-lg border border-line object-cover' />
								{index === 0 && (
									<span className='absolute bottom-1 left-1 rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white'>
										Cover
									</span>
								)}
								<button
									type='button'
									onClick={() => removeImage(index)}
									aria-label={`Remove photo ${index + 1}`}
									className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-brand'
								>
									<X className='h-3.5 w-3.5' />
								</button>
							</div>
						))}
					</div>
				)}
			</div>
			{/* end of photos */}

			<div>
				<button
					type='submit'
					disabled={loading || form.images.length === 0}
					className='flex h-12 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							{loadingLabel}
						</>
					) : (
						<>
							{SubmitIcon && <SubmitIcon className='mr-2 h-5 w-5' />}
							{submitLabel}
						</>
					)}
				</button>
				{form.images.length === 0 && (
					<p className='mt-2 text-center text-xs text-muted'>Add at least one photo to continue.</p>
				)}
			</div>
		</form>
	);
};

export default ProductForm;
