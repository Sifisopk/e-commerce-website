import mongoose from "mongoose";

// start of defaults
export const DEFAULT_ANNOUNCEMENT_TEXT = "Track your order anytime with your order number";
export const MAX_ANNOUNCEMENT_LENGTH = 160;

// what the homepage hero says until the admin changes it
export const DEFAULT_HERO = {
    eyebrow: "New season",
    title: "Wear it loud.",
    text: "Quality fashion, delivered to you. Shop the latest sweatpants, t-shirts, hoodies and skullcaps.",
    primaryLabel: "Shop hoodies",
    primaryLink: "/category/hoodies",
    image: "/hoodie.jpeg",
};
export const HERO_LIMITS = { eyebrow: 30, title: 60, text: 240, primaryLabel: 30, primaryLink: 100 };
// end of defaults

// ONE record holds the shop-wide settings (the "key" keeps it to a single document).
// More settings (delivery threshold, support details...) can be added as fields later.
const siteSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "main"
        },
        announcementText: {
            type: String,
            trim: true,
            maxlength: MAX_ANNOUNCEMENT_LENGTH,
            default: DEFAULT_ANNOUNCEMENT_TEXT
        },
        announcementEnabled: {
            type: Boolean,
            default: true
        },
        // start of homepage hero
        heroEyebrow: { type: String, trim: true, maxlength: HERO_LIMITS.eyebrow, default: DEFAULT_HERO.eyebrow },
        heroTitle: { type: String, trim: true, maxlength: HERO_LIMITS.title, default: DEFAULT_HERO.title },
        heroText: { type: String, trim: true, maxlength: HERO_LIMITS.text, default: DEFAULT_HERO.text },
        heroPrimaryLabel: { type: String, trim: true, maxlength: HERO_LIMITS.primaryLabel, default: DEFAULT_HERO.primaryLabel },
        heroPrimaryLink: { type: String, trim: true, maxlength: HERO_LIMITS.primaryLink, default: DEFAULT_HERO.primaryLink },
        heroImage: { type: String, default: DEFAULT_HERO.image },
        // end of homepage hero
    },
    {
        timestamps: true
    }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
