import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useCategoryStore = create((set) => ({
    categories: [],
    loaded: false,

    // start of fetchCategories (everyone)
    fetchCategories: async () => {
        try {
            const res = await axios.get("/categories");
            set({ categories: res.data, loaded: true });
        } catch (error) {
            set({ loaded: true });
        }
    },
    // end of fetchCategories (everyone)

    // start of createCategory (admin)
    createCategory: async ({ name, image }) => {
        try {
            const res = await axios.post("/categories", { name, image });
            set((prevState) => ({ categories: [...prevState.categories, res.data] }));
            toast.success("Category added");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
            return false;
        }
    },
    // end of createCategory (admin)

    // start of updateCategory (admin)
    updateCategory: async (categoryId, changes) => {
        try {
            const res = await axios.put(`/categories/${categoryId}`, changes);
            set((prevState) => ({
                categories: prevState.categories.map((category) =>
                    category._id === categoryId ? res.data : category
                ),
            }));
            toast.success("Category updated");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category");
            return false;
        }
    },
    // end of updateCategory (admin)

    // start of deleteCategory (admin)
    deleteCategory: async (categoryId) => {
        try {
            await axios.delete(`/categories/${categoryId}`);
            set((prevState) => ({
                categories: prevState.categories.filter((category) => category._id !== categoryId),
            }));
            toast.success("Category deleted");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete category");
            return false;
        }
    },
    // end of deleteCategory (admin)
}));
