import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req,res) => {
    try{
        const products = await Product.find(); //find all products
        res.json(products);
    }
    catch (error){
        console.log("Error getting all products", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//get single product by id route
export const getProductById = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        res.json(product);
    }
    catch (error){
        console.log("Error getting product by id", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//get featured products route
export const getfeaturedProducts = async (req,res) => {
    try{
     let featuredProducts = await redis.get("featured_Products");
     if(featuredProducts){
        return res.json(JSON.parse(featuredProducts));
     }
    featuredProducts = await Product.find({isFeatured: true}).lean();

    if(!featuredProducts){
        return res.status(404).json({message: "No featured products found"});
    }

    await redis.set("featured_Products", JSON.stringify(featuredProducts));
    return res.json(featuredProducts);
    }
    catch (error){
        console.log("Error getting featured products", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//create product route
export const createProduct = async (req,res) => {
    try{
        const {name, description, price, images, category, colors, sizes} = req.body;

        if(!Array.isArray(images) || images.length === 0){
            return res.status(400).json({message: "Please provide at least one image"});
        }

        // start of multi-image upload
        const uploadedImages = await Promise.all(
            images.map((image) => cloudinary.uploader.upload(image, {folder: "products"}))
        );
        // end of multi-image upload

        const product = await Product.create({
            name,
            description,
            price,
            images: uploadedImages.map((img) => img.secure_url),
            category,
            colors: Array.isArray(colors) ? colors : [],
            sizes: Array.isArray(sizes) ? sizes : [],
        });

        res.status(201).json(product);
    }
    catch (error){
        console.log("Error creating product", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

// start of updateProduct
//update product route
export const updateProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        const {name, description, price, category, colors, sizes, images} = req.body;

        if(name !== undefined) product.name = name;
        if(description !== undefined) product.description = description;
        if(price !== undefined) product.price = price;
        if(category !== undefined) product.category = category;
        if(colors !== undefined) product.colors = colors;
        if(sizes !== undefined) product.sizes = sizes;

        // images array may mix existing Cloudinary URLs (kept) and new base64 data (to upload)
        if(Array.isArray(images) && images.length > 0){
            const newImages = images.filter((img) => img.startsWith("data:"));
            const existingImages = images.filter((img) => !img.startsWith("data:"));

            let uploadedUrls = [];
            if(newImages.length > 0){
                const uploaded = await Promise.all(
                    newImages.map((image) => cloudinary.uploader.upload(image, {folder: "products"}))
                );
                uploadedUrls = uploaded.map((img) => img.secure_url);
            }

            product.images = [...existingImages, ...uploadedUrls];
        }

        const updatedProduct = await product.save();
        await updateFaturedProductCache();
        res.json(updatedProduct);
    }
    catch (error){
        console.log("Error updating product", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of updateProduct

// delete product route
// delete product route
export const deleteProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        if(product.images && product.images.length > 0){
            for(const imageUrl of product.images){
                const publicId = imageUrl.split("/").pop().split(".")[0];
                try{
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                }
                catch (error){
                    console.log("Error deleting image from cloudinary", error.message);
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        // start of cache refresh
        if(product.isFeatured){
            await updateFaturedProductCache();
        }
        // end of cache refresh

        res.json({message: "Product deleted successfully"});
    }
    catch (error){
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}


// get recommended products route
export const getRecommendedProducts = async (req,res) => {
    try{
        const Products = await Product.aggregate([
            {$sample: {size: 4}},
            {$project:{
                _id:1,
                name:1,
                description:1,
                images:1,
                price:1,
                colors:1,
                sizes:1,
            }}
        ]);
        res.json(Products);
    }
    catch (error){
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//get products by category route
export const getProductsByCategory = async (req,res) => {
    try{
        const {category} = req.params;
        const products = await Product.find({category}).lean();
        res.json(products);
    }
    catch (error){
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//toggle featured product route
export const toggleFeaturedProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFaturedProductCache();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message: "Product not found"});
        }
    }
    catch (error){
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

async function updateFaturedProductCache(){
    try{
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_Products", JSON.stringify(featuredProducts));
    }
    catch (error){
        console.log("Error updating featured product cache", error.message);
    }
}