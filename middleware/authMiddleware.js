import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ error: "Access denied. Not logged in." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

export const requireLeader = async (req, res, next) => {
  if (!req.user?.isLeader) {
    return res.status(403).json({ error: "Access denied. Leaders only." });
  }
  next();
};
