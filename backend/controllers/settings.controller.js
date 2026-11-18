import SiteSettings, {
    DEFAULT_ANNOUNCEMENT_TEXT,
    MAX_ANNOUNCEMENT_LENGTH,
    DEFAULT_HERO,
    HERO_LIMITS,
} from "../models/siteSettings.model.js";
import { isDataImage, uploadImage, destroyImage } from "../lib/imageUpload.js";

// only what the storefront is allowed to see
const publicShape = (settings) => ({
    announcement: {
        text: settings.announcementText,
        enabled: settings.announcementEnabled,
    },
    hero: {
        eyebrow: settings.heroEyebrow,
        title: settings.heroTitle,
        text: settings.heroText,
        primaryLabel: settings.heroPrimaryLabel,
        primaryLink: settings.heroPrimaryLink,
        image: settings.heroImage,
    },
});

// the settings record is created the first time it is needed
const getOrCreateSettings = () =>
    SiteSettings.findOneAndUpdate(
        { key: "main" },
        {
            $setOnInsert: {
                announcementText: DEFAULT_ANNOUNCEMENT_TEXT,
                announcementEnabled: true,
                heroEyebrow: DEFAULT_HERO.eyebrow,
                heroTitle: DEFAULT_HERO.title,
                heroText: DEFAULT_HERO.text,
                heroPrimaryLabel: DEFAULT_HERO.primaryLabel,
                heroPrimaryLink: DEFAULT_HERO.primaryLink,
                heroImage: DEFAULT_HERO.image,
            },
        },
        { upsert: true, new: true }
    );

// start of getPublicSettings (anyone)
export const getPublicSettings = async (req,res) => {
    try{
        const settings = await getOrCreateSettings();
        res.json(publicShape(settings));
    }
    catch (error){
        console.log("Error getting settings", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of getPublicSettings (anyone)

// start of updateSettings (admin: announcement bar)
export const updateSettings = async (req,res) => {
    try{
        const { announcementText, announcementEnabled } = req.body;
        const update = {};

        if(announcementText !== undefined){
            if(typeof announcementText !== "string"){
                return res.status(400).json({message: "Announcement text must be text"});
            }
            const text = announcementText.trim();
            if(text.length > MAX_ANNOUNCEMENT_LENGTH){
                return res.status(400).json({message: `Announcement must be ${MAX_ANNOUNCEMENT_LENGTH} characters or fewer`});
            }
            update.announcementText = text;
        }

        if(announcementEnabled !== undefined){
            if(typeof announcementEnabled !== "boolean"){
                return res.status(400).json({message: "Announcement switch must be true or false"});
            }
            update.announcementEnabled = announcementEnabled;
        }

        if(Object.keys(update).length === 0){
            return res.status(400).json({message: "Nothing to update"});
        }

        await getOrCreateSettings();
        const settings = await SiteSettings.findOneAndUpdate(
            { key: "main" },
            { $set: update },
            { new: true, runValidators: true }
        );

        res.json(publicShape(settings));
    }
    catch (error){
        console.log("Error updating settings", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of updateSettings (admin: announcement bar)

// start of updateHero (admin: homepage hero)
const HERO_TEXT_FIELDS = [
    { key: "eyebrow", column: "heroEyebrow", label: "Small heading", required: false },
    { key: "title", column: "heroTitle", label: "Headline", required: true },
    { key: "text", column: "heroText", label: "Paragraph", required: false },
    { key: "primaryLabel", column: "heroPrimaryLabel", label: "Button text", required: false },
];

// an on-site path only (/category/hoodies), never another website
const INTERNAL_LINK = /^\/(?!\/)[A-Za-z0-9\-._~\/?#=&%]*$/;

export const updateHero = async (req,res) => {
    try{
        const update = {};

        for(const field of HERO_TEXT_FIELDS){
            const value = req.body[field.key];
            if(value === undefined) continue;

            if(typeof value !== "string"){
                return res.status(400).json({message: `${field.label} must be text`});
            }
            const text = value.trim();
            if(field.required && !text){
                return res.status(400).json({message: `${field.label} can't be empty`});
            }
            if(text.length > HERO_LIMITS[field.key]){
                return res.status(400).json({message: `${field.label} must be ${HERO_LIMITS[field.key]} characters or fewer`});
            }
            update[field.column] = text;
        }

        if(req.body.primaryLink !== undefined){
            const link = typeof req.body.primaryLink === "string" ? req.body.primaryLink.trim() : "";
            if(!INTERNAL_LINK.test(link) || link.length > HERO_LIMITS.primaryLink){
                return res.status(400).json({message: "Please choose a valid button link"});
            }
            update.heroPrimaryLink = link;
        }

        const current = await getOrCreateSettings();
        let oldImage = null;

        if(req.body.image !== undefined){
            if(!isDataImage(req.body.image)){
                return res.status(400).json({message: "Please choose a valid photo"});
            }
            oldImage = current.heroImage;
            update.heroImage = await uploadImage(req.body.image, "site");
        }

        if(Object.keys(update).length === 0){
            return res.status(400).json({message: "Nothing to update"});
        }

        const settings = await SiteSettings.findOneAndUpdate(
            { key: "main" },
            { $set: update },
            { new: true, runValidators: true }
        );

        if(oldImage) await destroyImage(oldImage, "site");

        res.json(publicShape(settings));
    }
    catch (error){
        console.log("Error updating hero", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of updateHero (admin: homepage hero)
