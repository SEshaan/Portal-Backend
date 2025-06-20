import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();
import User from "../models/User.js";
// post /api/auth/register
router.post("/register", register);
//pls test ts with smtg 🙏

// post /api/auth/login   test ts pls
router.post("/login", login);
router.post('/logout', logout)

router.get("/me", requireAuth, async (req, res) => {
  
    if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json(req.user);
});
export default router;
