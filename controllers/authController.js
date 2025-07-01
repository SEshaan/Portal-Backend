import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  let { name, regId, email, password } = req.body;

  regId = regId.toUpperCase();

  const regIdPattern = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;
  if (!regIdPattern.test(regId)) {
    return res.status(400).json({ message: "Invalid registration ID format" });
  }

  try {
    const existingUser = await User.findOne({ regId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered with this ID" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      regId,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Send token as cookie and user info in response
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          regId: user.regId,
          email: user.email,
          isAdmin: user.isAdmin,
          isLeader: user.isLeader,
          teamId: user.teamId,
        },
      });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};


export const login = async (req, res) => {
  try {
    let { regId, password } = req.body;
    regId = regId.toUpperCase();

    const user = await User.findOne({ regId });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          regId: user.regId,
          email: user.email,
          isAdmin: user.isAdmin,
          isLeader: user.isLeader,
          teamId: user.teamId,
        },
      });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};


export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
