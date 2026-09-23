import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productsRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();




const app = express();
const PORT = process.env.PORT || 5000;

const__dirname = path.resolve();

app.use(express.json({limit:"10mb"})); // allows parsing of JSON data in the request body
app.use(cookieParser()); // allows parsing of cookies in the request headers

// Simple CORS middleware for development - allow localhost frontend origins
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin.startsWith('http://localhost')) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.use("/api/auth", authRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () =>{
    console.log("Server is running on http://localhost:" + PORT);

    connectDB();
});
