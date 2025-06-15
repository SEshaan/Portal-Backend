import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

// post /api/auth/register
router.post("/register", register);
//pls test ts with smtg 🙏

// post /api/auth/login   test ts pls
router.post("/login", login);
router.post('/logout', logout)
export default router;
