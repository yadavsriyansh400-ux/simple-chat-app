import express from "express";
import protect from "../middleware/authMiddleware.js";
import { searchUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/search", protect, searchUser);

export default router;