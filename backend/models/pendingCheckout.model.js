import mongoose from "mongoose";

const pendingCheckoutSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            id: String, // product id as a string snapshot, not a live ref
            quantity: Number,
            price: Number,
            color: { type: String, default: "" },
            size: { type: String, default: "" },
        }
    ],
    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        suburb: String,
        city: String,
        province: String,
        postalCode: String,
    },
    couponCode: {
        type: String,
        default: "",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    // start of auto-expire abandoned checkouts after 2 hours
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7200,
    },
    // end of auto-expire abandoned checkouts after 2 hours
});

const PendingCheckout = mongoose.model("PendingCheckout", pendingCheckoutSchema);

export default PendingCheckout;