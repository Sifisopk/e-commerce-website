import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useSettingsStore = create((set) => ({
    announcement: { text: "", enabled: false },
    hero: { eyebrow: "", title: "", text: "", primaryLabel: "", primaryLink: "/", image: "" },
    loaded: false,

    // start of fetchSettings (everyone)
    fetchSettings: async () => {
        try {
            const res = await axios.get("/settings");
            set({ announcement: res.data.announcement, hero: res.data.hero, loaded: true });
        } catch (error) {
            // no bar is better than a broken page
            set({ loaded: true });
        }
    },
    // end of fetchSettings (everyone)

    // start of saveAnnouncement (admin)
    saveAnnouncement: async ({ text, enabled }) => {
        try {
            const res = await axios.put("/settings", {
                announcementText: text,
                announcementEnabled: enabled,
            });
            set({ announcement: res.data.announcement });
            toast.success("Announcement saved");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save announcement");
            return false;
        }
    },
    // end of saveAnnouncement (admin)

    // start of saveHero (admin)
    saveHero: async (changes) => {
        try {
            const res = await axios.put("/settings/hero", changes);
            set({ hero: res.data.hero });
            toast.success("Homepage updated");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update the homepage");
            return false;
        }
    },
    // end of saveHero (admin)
}));
