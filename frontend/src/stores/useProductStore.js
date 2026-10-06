import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    currentProduct: null,
    loading: false,

    setProducts: (products) => {
        set({ products });
    },

    // start of createProduct
    createProduct: async (productData) => {
        set({ loading: true });

        try {
            const res = await axios.post("/products", productData);

            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
            return res.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create product or file size too large,max size is 10MB"
            );
            set({ loading: false });
            throw error;
        }
    },
    // end of createProduct

    updateProduct: async (productId, productData) => {
        set({ loading: true });
        try {
            const res = await axios.put(`/products/${productId}`, productData);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === productId ? res.data : product
                ),
                loading: false,
            }));
            return res.data;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to update product");
            throw error;
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });

        try {
            const response = await axios.get("/products");

            set({
                products: response.data,
                loading: false,
            });
        } catch (error) {
            set({
                error: "Failed to fetch products",
                loading: false,
            });

            toast.error(
                error.response?.data?.error || "Failed to fetch products"
            );
        }
    },
    fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
    fetchProductById: async (productId) => {
        set({ loading: true, currentProduct: null });
        try {
            const response = await axios.get(`/products/${productId}`);
            set({ currentProduct: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to load product");
        }
    },
    deleteProduct: async (productId) => {
            set({ loading: true });
            try {
                await axios.delete(`/products/${productId}`);
                set((prevProducts) => ({
                    products: prevProducts.products.filter((product) => product._id !== productId),
                    loading: false,
                }));
            } catch (error) {
                set({ loading: false });
                toast.error(error.response?.data?.error || "Failed to delete product");
            }
        },
    toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
        const response = await axios.patch(`/products/${productId}`);
        set((prevProducts) => ({
            products: prevProducts.products.map((product) =>
                product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
            ),
            loading: false,
        }));
    } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.error || "Failed to update product");
    }
},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));