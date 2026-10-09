import express from "express";
import {
    login, logout, signup, refreshToken, getProfile,
    forgotPassword, resetPassword, verifyEmail, resendVerification,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// start of auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protectRoute, resendVerification);
// end of auth routes

export default router;
