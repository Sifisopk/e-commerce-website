import mongoose from "mongoose";

// "slug" is what products store in their "category" field and what the URL uses
// (/category/hoodies). It is created from the name once and never changes, so renaming
// a category never breaks products or links.
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 40
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
