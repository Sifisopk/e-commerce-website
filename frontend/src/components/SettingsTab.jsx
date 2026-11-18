import { useState } from "react";
import { useSettingsStore } from "../stores/useSettingsStore";
import HeroForm from "./HeroForm";

const MAX_LENGTH = 160; // keep in step with the backend limit

const AnnouncementForm = ({ announcement }) => {
	const { saveAnnouncement } = useSettingsStore();
	const [text, setText] = useState(announcement.text);
	const [enabled, setEnabled] = useState(announcement.enabled);
	const [saving, setSaving] = useState(false);

	const cleanText = text.trim();
	const isChanged = cleanText !== announcement.text || enabled !== announcement.enabled;
	const showsBar = enabled && cleanText;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		await saveAnnouncement({ text: cleanText, enabled });
		setSaving(false);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/* start of switch */}
			<div className='flex items-center justify-between gap-4'>
				<div>
					<p className='font-semibold text-ink'>Show the announcement bar</p>
					<p className='text-sm text-muted'>The thin black bar at the very top of every page.</p>
				</div>
				<button
					type='button'
					role='switch'
					aria-checked={enabled}
					aria-label='Show the announcement bar'
					onClick={() => setEnabled((value) => !value)}
					className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
						enabled ? "bg-brand" : "bg-gray-300"
					}`}
				>
					<span
						className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
							enabled ? "translate-x-6" : "translate-x-1"
						}`}
					/>
				</button>
			</div>
			{/* end of switch */}

			{/* start of text */}
			<div>
				<label htmlFor='announcementText' className='mb-1.5 block text-[13px] font-semibold text-ink'>
					Message
				</label>
				<input
					id='announcementText'
					type='text'
					value={text}
					maxLength={MAX_LENGTH}
					onChange={(e) => setText(e.target.value)}
					placeholder='e.g. Free delivery on orders over R500'
					className='block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
				/>
				<p className='mt-1.5 text-right text-xs text-muted'>
					{text.length}/{MAX_LENGTH}
				</p>
			</div>
			{/* end of text */}

			{/* start of live preview */}
			<div>
				<p className='mb-1.5 text-[13px] font-semibold text-ink'>Preview</p>
				<div className='overflow-hidden rounded-lg border border-line'>
					<div
						className={`px-4 py-2.5 text-center text-xs font-medium sm:text-[13px] ${
							showsBar ? "bg-ink text-white" : "bg-surface text-muted"
						}`}
					>
						{showsBar ? cleanText : "The bar is hidden"}
					</div>
				</div>
			</div>
			{/* end of live preview */}

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

const Skeleton = () => (
	<div className='animate-pulse space-y-4'>
		<div className='h-10 rounded-lg bg-line' />
		<div className='h-11 rounded-lg bg-line' />
		<div className='h-12 rounded-lg bg-line' />
	</div>
);

const cardClass = "rounded-2xl border border-line bg-white p-5 sm:p-8";
const headingClass = "mb-1 font-display text-2xl font-bold text-ink";

const SettingsTab = () => {
	const { announcement, loaded } = useSettingsStore();

	return (
		<div className='mx-auto max-w-2xl space-y-6'>
			<div className={cardClass}>
				<h2 className={headingClass}>Homepage hero</h2>
				<p className='mb-6 text-sm text-muted'>The big headline, text, button and photo at the top of the homepage.</p>
				{loaded ? <HeroForm /> : <Skeleton />}
			</div>

			<div className={cardClass}>
				<h2 className={`${headingClass} mb-6`}>Announcement bar</h2>
				{loaded ? <AnnouncementForm announcement={announcement} /> : <Skeleton />}
			</div>
		</div>
	);
};

export default SettingsTab;
