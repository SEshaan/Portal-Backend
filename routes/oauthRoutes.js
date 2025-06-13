import express from "express";
import {verify} from "../controllers/gOAuthcontroller.js";
import User from "../models/User.js"; // Assuming you have a User model defined
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/callback",async (req, res) => {
    const userData = await verify(req.body.credential);
    const existingUser = await User.findOne({ regId: userData.family_name });
    if (existingUser) {
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { //everyone knows where i picked this from ggs
              expiresIn: "3d",
            });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // had to be in milliseconds sooooo.... :hehe:
            })
            .status(200)
            .json({ message: "Login successful"});
    } else {
        // User does not exist, create a new one
        const newUser = new User({
            regId: userData.family_name,
            email: userData.email,
            name: userData.name.replace(userData.family_name, "").trim(),
            password: randomUUID(), // random password
        });
        await newUser.save();
    }
});


export default router;