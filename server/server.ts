import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import questionRoutes from "./routes/questionRoutes";
import { protect } from "./middlewares/authMiddlewares";
import { generateInterviewQuestions, generateConceptExplaination } from "./controllers/aiController";

dotenv.config();

const app: Application = express();

app.use(
    cors({
        origin: ["http://localhost:5173" , process.env.VITE_FRONTEND_URL as string], 
        credentials: true,
    }) 
);
app.use(cookieParser());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplaination);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
