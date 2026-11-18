import { useState } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import { readFileAsDataUrl } from "../lib/readFileAsDataUrl";

// keep in step with the limits in the backend settings model
const LIMITS = { eyebrow: 30, title: 60, text: 240, primaryLabel: 30 };

const inputClass =
	"block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink";

const HeroForm = () => {
	const { hero, saveHero } = useSettingsStore();
	const { categories } = useCategoryStore();

	const [form, setForm] = useState({
		eyebrow: hero.eyebrow,
		title: hero.title,
		text: hero.text,
		primaryLabel: hero.primaryLabel,
		primaryLink: hero.primaryLink,
	});
	const [newImage, setNewImage] = useState(null);
	const [saving, setSaving] = useState(false);

	const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

	// start of button link choices (categories, plus whatever is saved now)
	const linkOptions = categories.map((c) => ({ value: `/category/${c.slug}`, label: `${c.name} category` }));
	if (!linkOptions.some((o) => o.value === form.primaryLink)) {
		linkOptions.push({ value: form.primaryLink, label: form.primaryLink });
	}
	// end of button link choices

	// start of work out what changed
	const changes = {};
	["eyebrow", "title", "text", "primaryLabel", "primaryLink"].forEach((key) => {
		if (form[key].trim() !== hero[key]) changes[key] = form[key].trim();
	});
	if (newImage) changes.image = newImage;
	const isChanged = Object.keys(changes).length > 0;
	// end of work out what changed

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		e.target.value = "";
		if (!file) return;
		try {
			setNewImage(await readFileAsDataUrl(file));
		} catch (error) {
			toast.error("Couldn't read that photo. Please try another one.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		const ok = await saveHero(changes);
		if (ok) setNewImage(null);
		setSaving(false);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-5'>
			<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
				<div>
					<label htmlFor='heroEyebrow' className={labelClass}>
						Small heading
					</label>
					<input
						id='heroEyebrow'
						type='text'
						maxLength={LIMITS.eyebrow}
						value={form.eyebrow}
						onChange={(e) => setField("eyebrow", e.target.value)}
						placeholder='e.g. New season'
						className={inputClass}
					/>
				</div>

				<div>
					<label htmlFor='heroTitle' className={labelClass}>
						Headline
					</label>
					<input
						id='heroTitle'
						type='text'
						required
						maxLength={LIMITS.title}
						value={form.title}
						onChange={(e) => setField("title", e.target.value)}
						className={inputClass}
					/>
				</div>
			</div>

			<div>
				<label htmlFor='heroText' className={labelClass}>
					Paragraph
				</label>
				<textarea
					id='heroText'
					rows='3'
					maxLength={LIMITS.text}
					value={form.text}
					onChange={(e) => setField("text", e.target.value)}
					className='block w-full rounded-lg border border-[#D9D6D2] bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
				/>
				<p className='mt-1.5 text-right text-xs text-muted'>
					{form.text.length}/{LIMITS.text}
				</p>
			</div>

			<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
				<div>
					<label htmlFor='heroButtonText' className={labelClass}>
						Button text
					</label>
					<input
						id='heroButtonText'
						type='text'
						maxLength={LIMITS.primaryLabel}
						value={form.primaryLabel}
						onChange={(e) => setField("primaryLabel", e.target.value)}
						placeholder='e.g. Shop hoodies'
						className={inputClass}
					/>
					<p className='mt-1.5 text-xs text-muted'>Leave empty to hide the button.</p>
				</div>

				<div>
					<label htmlFor='heroButtonLink' className={labelClass}>
						Button goes to
					</label>
					<select
						id='heroButtonLink'
						value={form.primaryLink}
						onChange={(e) => setField("primaryLink", e.target.value)}
						className={inputClass}
					>
						{linkOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* start of hero photo */}
			<div>
				<span className={labelClass}>Photo</span>
				<div className='flex items-center gap-4'>
					<div className='h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface'>
						{(newImage || hero.image) && (
							<img src={newImage || hero.image} alt='Homepage hero' className='h-full w-full object-cover' />
						)}
					</div>
					<div>
						<input id='heroImage' type='file' accept='image/*' className='sr-only' onChange={handleImageChange} />
						<label
							htmlFor='heroImage'
							className='inline-flex cursor-pointer items-center rounded-lg border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
						>
							<Upload className='mr-2 h-4 w-4' />
							{newImage ? "Choose a different photo" : "Change photo"}
						</label>
						<p className='mt-2 text-xs text-muted'>
							Shown as a square on the homepage. {newImage && "New photo ready. Save to use it."}
						</p>
					</div>
				</div>
			</div>
			{/* end of hero photo */}

			<button
				type='submit'
				disabled={!isChanged || saving}
				className='flex h-12 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50'
			>
				{saving ? "Saving..." : "Save changes"}
			</button>
		</form>
	);
};

export default HeroForm;
