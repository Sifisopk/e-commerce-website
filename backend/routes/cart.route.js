import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuatity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/",protectRoute, addToCart);
router.delete("/",protectRoute, removeAllFromCart);
router.put("/",protectRoute, updateQuatity);

export default router; 