import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({

    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

		getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},

		applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},


		removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},
	
    	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
      get().calculateTotals(); 
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
	},

	// start of addToCart with color/size
	addToCart: async (product, options = {}) => {
		const { quantity = 1, color = "", size = "" } = options;
		try {
			await axios.post("/cart", { productId: product._id, quantity, color, size });
			toast.success("Product added to cart");
			await get().getCartItems();
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},
	// end of addToCart with color/size

  // start of removeFromCart by cart line id
  removeFromCart: async (cartItemId) => {
    try {
        await axios.delete(`/cart`, { data: { cartItemId } });
        await get().getCartItems();
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
    }
  },
  // end of removeFromCart by cart line id

//update quantity of a specific cart line
updateQuantity: async (cartItemId, quantity) => {
		try {
			if (quantity === 0) {
				await get().removeFromCart(cartItemId);
				return;
			}
			await axios.put(`/cart`, { cartItemId, quantity });
			await get().getCartItems();
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

//calculate total of cart items
  calculateTotals: () => {
		const { cart, coupon, isCouponApplied } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		// start of only discount when coupon is applied
		if (coupon && isCouponApplied) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}
		// end of only discount when coupon is applied

		set({ subtotal, total });
	},

}));




export default useCartStore