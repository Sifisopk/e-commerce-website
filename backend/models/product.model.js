import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            min:0,
            required: true
        },
        // start of images
        images: {
            type: [String],
            required: [true, "Please provide at least one image"],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "Please provide at least one image",
            },
        },
        // end of images
        colors: {
            type: [String],
            default: []
        },
        sizes: {
            type: [String],
            default: []
        },
        category: {
            type: String,
            required: true
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;