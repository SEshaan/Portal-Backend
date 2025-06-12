import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
app.use(cookieParser()); 


app.use(
  cors({
    //TODO : Plug it to the frontend
    origin: "http://localhost:3000", // guys this is going to be the frontend port btw 
    credentials: true, 
  })
);

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

app.use("/api/team", teamRoutes);