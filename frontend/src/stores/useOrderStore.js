import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,

    // start of fetchAllOrders (admin)
    fetchAllOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/orders");
            set({ orders: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        }
    },
    // end of fetchAllOrders (admin)

    // start of updateOrderStatus (admin)
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await axios.patch(`/orders/${orderId}/status`, { status });
            set((prevState) => ({
                orders: prevState.orders.map((order) =>
                    order._id === orderId ? response.data : order
                ),
            }));
            toast.success("Order status updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    },
    // end of updateOrderStatus (admin)
}));