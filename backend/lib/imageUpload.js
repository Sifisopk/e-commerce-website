import cloudinary from "./cloudinary.js";

// only accept real images sent as a data URL (what the admin forms send)
export const isDataImage = (value) => typeof value === "string" && value.startsWith("data:image/");

export const uploadImage = async (dataUrl, folder) => {
    const result = await cloudinary.uploader.upload(dataUrl, { folder });
    return result.secure_url;
};

// removes an old Cloudinary photo. Local files like /hoodie.jpeg are left alone.
export const destroyImage = async (url, folder) => {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return;
    try {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    }
    catch (error){
        console.log("Error deleting image from cloudinary", error.message);
    }
};
