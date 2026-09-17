import express, { Router } from "express";
import { 
    createSession, 
    getSessionById, 
    getMySessions, 
    deleteSession 
} from "../controllers/sessionController.ts";
import { protect } from "../middlewares/authMiddlewares.ts";

const router: Router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

export default router;
