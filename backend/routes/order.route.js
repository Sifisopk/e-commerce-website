import express from "express";
import { getAllOrders, updateOrderStatus, getMyOrders, trackOrder } from "../controllers/order.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllOrders);
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);
router.get("/mine", protectRoute, getMyOrders);
router.post("/track", trackOrder);

export default router;