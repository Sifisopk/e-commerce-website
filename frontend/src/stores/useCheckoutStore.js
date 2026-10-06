import { create } from "zustand";

const emptyAddress = {
    fullName: "",
    phone: "",
    street: "",
    suburb: "",
    city: "",
    province: "",
    postalCode: "",
};

export const useCheckoutStore = create((set, get) => ({
    shippingAddress: emptyAddress,

    // start of setShippingField
    setShippingField: (field, value) => {
        set((state) => ({
            shippingAddress: { ...state.shippingAddress, [field]: value },
        }));
    },
    // end of setShippingField

    resetShippingAddress: () => {
        set({ shippingAddress: emptyAddress });
    },

    // start of getAddressError
    getAddressError: () => {
        const { fullName, phone, street, suburb, city, province, postalCode } = get().shippingAddress;

        if (!fullName.trim() || !phone.trim() || !street.trim() || !suburb.trim() || !city.trim() || !province) {
            return "Please fill in your delivery address";
        }
        if (phone.replace(/\D/g, "").length < 10) {
            return "Please enter a valid phone number";
        }
        if (!/^\d{4}$/.test(postalCode.trim())) {
            return "Postal code must be 4 digits";
        }
        return null;
    },
    // end of getAddressError
}));