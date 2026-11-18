import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { isDataImage, uploadImage, destroyImage } from "../lib/imageUpload.js";

const MAX_NAME_LENGTH = 40;

// start of default categories
// created automatically the first time categories are loaded, so the shop never starts empty
const DEFAULT_CATEGORIES = [
    { name: "Sweatpants", slug: "sweatpants", image: "/sweatpant.jpeg", sortOrder: 0 },
    { name: "T-shirts", slug: "t-shirts", image: "/t-shirt.jpeg", sortOrder: 1 },
    { name: "Hoodies", slug: "hoodies", image: "/hoodie.jpeg", sortOrder: 2 },
    { name: "Skullcap", slug: "skullcap", image: "/beanie.jpeg", sortOrder: 3 },
];
// end of default categories

const slugify = (name) =>
    name
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// returns { name } or { error }
const readName = (value) => {
    if(typeof value !== "string"){
        return { error: "Please enter a category name" };
    }
    const name = value.trim();
    if(!name){
        return { error: "Please enter a category name" };
    }
    if(name.length > MAX_NAME_LENGTH){
        return { error: `Category name must be ${MAX_NAME_LENGTH} characters or fewer` };
    }
    return { name };
};

const publicShape = (category) => ({
    _id: category._id,
    name: category.name,
    slug: category.slug,
    image: category.image,
});

// start of getCategories (anyone)
export const getCategories = async (req,res) => {
    try{
        if((await Category.countDocuments()) === 0){
            try{
                await Category.insertMany(DEFAULT_CATEGORIES, { ordered: false });
            }
            catch (seedError){
                // two visitors can seed at the same moment; the duplicate is harmless
                if(seedError.code !== 11000) throw seedError;
            }
        }

        const categories = await Category.find().sort({ sortOrder: 1, createdAt: 1 });
        res.json(categories.map(publicShape));
    }
    catch (error){
        console.log("Error getting categories", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of getCategories (anyone)

// start of createCategory (admin)
export const createCategory = async (req,res) => {
    try{
        const { name, error: nameError } = readName(req.body.name);
        if(nameError){
            return res.status(400).json({message: nameError});
        }

        if(!isDataImage(req.body.image)){
            return res.status(400).json({message: "Please add a photo for this category"});
        }

        const slug = slugify(name);
        if(!slug){
            return res.status(400).json({message: "Please use letters or numbers in the category name"});
        }

        if(await Category.exists({ slug })){
            return res.status(409).json({message: "A category with this name already exists"});
        }

        const image = await uploadImage(req.body.image, "categories");

        const last = await Category.findOne().sort({ sortOrder: -1 });
        const category = await Category.create({
            name,
            slug,
            image,
            sortOrder: last ? last.sortOrder + 1 : 0,
        });

        res.status(201).json(publicShape(category));
    }
    catch (error){
        console.log("Error creating category", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of createCategory (admin)

// start of updateCategory (admin)
export const updateCategory = async (req,res) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }

        const { name, image } = req.body;
        let oldImage = null;

        if(name !== undefined){
            const { name: cleanName, error: nameError } = readName(name);
            if(nameError){
                return res.status(400).json({message: nameError});
            }
            category.name = cleanName; // the slug stays the same on purpose
        }

        if(image !== undefined){
            if(!isDataImage(image)){
                return res.status(400).json({message: "Please choose a valid photo"});
            }
            oldImage = category.image;
            category.image = await uploadImage(image, "categories");
        }

        await category.save();
        if(oldImage) await destroyImage(oldImage, "categories");

        res.json(publicShape(category));
    }
    catch (error){
        console.log("Error updating category", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of updateCategory (admin)

// start of deleteCategory (admin)
export const deleteCategory = async (req,res) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }

        // never leave products pointing at a category that no longer exists
        const productCount = await Product.countDocuments({ category: category.slug });
        if(productCount > 0){
            return res.status(409).json({
                message: `${productCount} product${productCount === 1 ? "" : "s"} still use this category. Move or delete ${productCount === 1 ? "it" : "them"} first.`
            });
        }

        await Category.findByIdAndDelete(category._id);
        await destroyImage(category.image, "categories");

        res.json({message: "Category deleted successfully"});
    }
    catch (error){
        console.log("Error deleting category", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of deleteCategory (admin)
