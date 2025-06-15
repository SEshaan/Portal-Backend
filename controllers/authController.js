import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  let { name, regId, email, password } = req.body;

  regId = regId.toUpperCase();

  const regIdPattern = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;
  if (regIdPattern.test(regId) == false) {
    return res.status(400).json({ error: "Invalid registration ID format" });
  }

  try {
    const existingUser = await User.findOne({ regId });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already registered with this ID" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      regId,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  let { regId, password } = req.body;
  regId = regId.toUpperCase();
  try {
    const user = await User.findOne({ regId });

    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // had to be in milliseconds sooooo.... :hehe:
      })
      .status(200)
      .json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
