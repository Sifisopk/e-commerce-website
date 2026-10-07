import crypto from "crypto";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import PendingCheckout from "../models/pendingCheckout.model.js";
import { initializeTransaction, verifyTransaction } from "../lib/paystack.js";
import { generateOrderNumber } from "../lib/orderNumber.js";

//resend email imports
import { sendOrderEmails } from "../lib/email.js";

// start of feature flag
const COUPONS_ENABLED = process.env.ENABLE_COUPONS === "true";
// end of feature flag

// start of address validation
const PROVINCES = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
];

const cleanShippingAddress = (input) => {
    if(!input || typeof input !== "object"){
        return { error: "Please provide your delivery address" };
    }

    const clean = (value, max) => String(value ?? "").trim().slice(0, max);

    const address = {
        fullName: clean(input.fullName, 60),
        phone: clean(input.phone, 20),
        street: clean(input.street, 100),
        suburb: clean(input.suburb, 50),
        city: clean(input.city, 50),
        province: clean(input.province, 20),
        postalCode: clean(input.postalCode, 10),
    };

    if(!address.fullName || !address.phone || !address.street || !address.suburb || !address.city){
        return { error: "Please fill in all delivery address fields" };
    }
    if(!PROVINCES.includes(address.province)){
        return { error: "Please choose a valid province" };
    }
    if(!/^\d{4}$/.test(address.postalCode)){
        return { error: "Postal code must be 4 digits" };
    }
    if(address.phone.replace(/\D/g, "").length < 10){
        return { error: "Please enter a valid phone number" };
    }

    return { address };
};
// end of address validation

//create checkout session (Paystack)
export const createCheckoutSession = async (req,res) => {
    try{
        const {products, couponCode, shippingAddress} = req.body;

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({message: "Invalid or No products provided"});
        }

        const { address, error: addressError } = cleanShippingAddress(shippingAddress);
        if(addressError){
            return res.status(400).json({message: addressError});
        }

        // start of totals in rands
        let totalAmount = 0;
        products.forEach(product => {
            totalAmount += product.price * product.quantity;
        });

        let coupon = null;
        if(COUPONS_ENABLED && couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
            if(coupon){
                totalAmount -= totalAmount * (coupon.discountPercentage / 100);
            }
        }
        totalAmount = Math.round(totalAmount * 100) / 100; // keep to the cent
        // end of totals in rands

        // start of pending checkout + Paystack reference
        const reference = `SFB_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

        await PendingCheckout.create({
            reference,
            user: req.user._id,
            products: products.map((p) => ({
                id: p._id,
                quantity: p.quantity,
                price: p.price,
                color: p.color || "",
                size: p.size || "",
            })),
            shippingAddress: address,
            couponCode: coupon ? coupon.code : "",
            totalAmount,
        });

        const paystackResponse = await initializeTransaction({
            email: req.user.email,
            amount: Math.round(totalAmount * 100), // Paystack wants cents
            reference,
            callback_url: `${process.env.CLIENT_URL}/purchase-success`,
            metadata: {
                userId: req.user._id.toString(),
            },
        });
        // end of pending checkout + Paystack reference

        res.status(200).json({
            reference,
            totalAmount,
            url: paystackResponse.data.authorization_url,
        });

    } catch (error){
        console.log("Error creating checkout session", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//checkout success route (Paystack verify)
export const checkoutSuccess = async (req,res) => {
    try{
        const {reference} = req.body;

        if(!reference){
            return res.status(400).json({message: "Missing payment reference"});
        }

        // start of duplicate guard
        const existingOrder = await Order.findOne({ paymentReference: reference });
        if(existingOrder){
            return res.status(200).json({
                success: true,
                message: "Order already processed",
                orderId: existingOrder._id,
                orderNumber: existingOrder.orderNumber || existingOrder._id.toString().slice(-6).toUpperCase(),
            });
        }
        // end of duplicate guard

        const verification = await verifyTransaction(reference);

        if(verification.data.status !== "success"){
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        const pendingCheckout = await PendingCheckout.findOne({ reference });
        if(!pendingCheckout){
            return res.status(404).json({message: "We couldn't find this checkout. Please contact support."});
        }

        // start of make sure this logged-in user owns this checkout
        if(String(pendingCheckout.user) !== String(req.user._id)){
            return res.status(403).json({message: "This checkout does not belong to your account"});
        }
        // end of make sure this logged-in user owns this checkout

        // start of amount actually charged must match what we expected
        const paidAmount = verification.data.amount / 100;
        if(Math.abs(paidAmount - pendingCheckout.totalAmount) > 0.01){
            console.log("Amount mismatch on verify", paidAmount, pendingCheckout.totalAmount);
            return res.status(400).json({message: "Payment amount mismatch. Please contact support."});
        }
        // end of amount actually charged must match what we expected

        if(pendingCheckout.couponCode){
            await Coupon.findOneAndUpdate({
                code: pendingCheckout.couponCode,
                userId: pendingCheckout.user
            },
            {
                isActive: false
            });
        }

        // start of snapshot product details
        const productDocs = await Product.find({ _id: { $in: pendingCheckout.products.map((p) => p.id) } }).select("name images");
        const productMap = new Map(productDocs.map((p) => [p._id.toString(), p]));
        // end of snapshot product details

        const orderNumber = await generateOrderNumber();

        const newOrder = new Order({
            orderNumber,
            user: pendingCheckout.user,
            products: pendingCheckout.products.map(product => {
                const productDoc = productMap.get(String(product.id));
                return {
                    product: product.id,
                    name: productDoc?.name || "",
                    image: productDoc?.images?.[0] || "",
                    quantity: product.quantity,
                    price: product.price,
                    color: product.color || "",
                    size: product.size || "",
                };
            }),
            shippingAddress: pendingCheckout.shippingAddress,
            totalAmount: pendingCheckout.totalAmount,
            paymentReference: reference,
            status: "pending",
            statusHistory: [{ status: "pending" }],
        });

        await newOrder.save();

        // start of send order emails
           await sendOrderEmails({
       order: newOrder,
       customer: { name: req.user.name, email: req.user.email },
   });

        // start of gift coupon, only now that payment is confirmed
        if(COUPONS_ENABLED && pendingCheckout.totalAmount >= 200){
            await createNewCoupon(pendingCheckout.user);
        }
        // end of gift coupon, only now that payment is confirmed

        req.user.cartItems = [];
        await req.user.save();

        await PendingCheckout.findByIdAndDelete(pendingCheckout._id);

        res.status(200).json({
            success: true,
            message : "Payment successful, order created successfully and coupon deactivated if used",
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber,
        });
    }
    catch (error){
        console.log("Error confirming checkout", error.message);
        res.status(500).json({message: "Error processing successful checkout", error: error.message});
    }
}

//create new coupon
async function createNewCoupon(userId){
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });

    await newCoupon.save();

    return newCoupon;
}