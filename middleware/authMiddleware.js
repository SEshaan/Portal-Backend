// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Auth middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token; // fallback to cookie

    if (!token) {
      return res.status(401).json({ message: "Access denied. Not logged in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message); // helpful for dev
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Admin check
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Leader check
const requireLeader = (req, res, next) => {
  if (!req.user?.isLeader) {
    return res.status(403).json({ message: "Access denied. Leaders only." });
  }
  next();
};

export { protect, requireAdmin, requireLeader };
