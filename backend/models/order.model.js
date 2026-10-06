import mongoose from "mongoose";

const statuses = ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
                    default: "",
                },
                image: {
                    type: String,
                    default: "",
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                color: {
                    type: String,
                    default: "",
                },
                size: {
                    type: String,
                    default: "",
                },
            }
        ],
        shippingAddress: {
            fullName: { type: String, default: "" },
            phone: { type: String, default: "" },
            street: { type: String, default: "" },
            suburb: { type: String, default: "" },
            city: { type: String, default: "" },
            province: { type: String, default: "" },
            postalCode: { type: String, default: "" },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        // start of paymentReference (was stripeSessionId)
        paymentReference: {
            type: String,
            required: true,
        },
        // end of paymentReference (was stripeSessionId)
        status: {
            type: String,
            enum: statuses,
            default: "pending",
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: statuses,
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;