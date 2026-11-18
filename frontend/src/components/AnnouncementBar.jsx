import { useSettingsStore } from "../stores/useSettingsStore";

// The text and on/off switch are edited by the admin in Dashboard > Settings.
const AnnouncementBar = () => {
	const { announcement, loaded } = useSettingsStore();

	if (!loaded || !announcement.enabled || !announcement.text) return null;

	return (
		<div className='bg-ink px-4 py-2.5 text-center text-xs font-medium text-white sm:text-[13px]'>
			{announcement.text}
		</div>
	);
};

export default AnnouncementBar;
