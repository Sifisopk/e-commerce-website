import express from "express";
import { getPublicSettings, updateSettings, updateHero } from "../controllers/settings.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPublicSettings);
router.put("/", protectRoute, adminRoute, updateSettings);
router.put("/hero", protectRoute, adminRoute, updateHero);

export default router;
