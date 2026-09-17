import express, { Router } from "express";
import { 
    togglePinQuestion, 
    updateQuestionNote, 
    addQuestionsToSession 
} from "../controllers/questionController.ts";
import { protect } from "../middlewares/authMiddlewares.ts";

const router: Router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

export default router;
