import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;


app.use(express.json()); 
app.use(cookieParser()); 


// app.use(
//   cors({
//     //TODO : Plug it to the frontend
//     origin: "http://localhost:3000", // guys this is going to be the frontend port btw 
//     credentials: true, 
//   })
// );

app.use("/api/auth", authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "test.html"));
});

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

app.use("/google",oauthRoutes);