import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: null,
    loading: null,
    checkingAuth: true,

    // start of signup
    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post("/auth/signup", {
                name,
                email,
                password,
            });

            set({ user: res.data.user, loading: false });
            toast.success("Account created! Check your email to verify your address.")
        } catch (error) {
            set({ loading: false });

            toast.error(
                error.response?.data?.message || "An error occurred, please try again"
            );
        }
    },
    // end of signup

    // start of login
    login: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", {
                email,
                password,
            });

            set({ user: res.data.user, loading: false });
        } catch (error) {
            set({ loading: false });

            toast.error(
                error.response?.data?.message || "An error occurred, please try again"
            );
        }
    },
    // end of login

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},
    // start of checkAuth
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },
    // end of checkAuth

    // start of refreshToken
    refreshToken: async () => {
        const response = await axios.post("/auth/refresh-token");
        return response.data;
    },
    // end of refreshToken
}));

// start of axios interceptor for token refresh
let refreshPromise = null;

const auth_urls = [
    "/auth/login",
    "/auth/signup",
    "/auth/logout",
    "/auth/refresh-token",
];

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const is_auth_url = auth_urls.some((url) => originalRequest?.url?.includes(url));

		if (error.response?.status === 401 && !originalRequest._retry && !is_auth_url) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
// end of axios interceptor for token refresh