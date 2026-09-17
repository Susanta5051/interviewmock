import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddlewares.ts";
import Question from "../models/Question.ts";
import Session from "../models/Session.ts";

interface AddQuestionsBody {
  sessionId: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface UpdateNoteBody {
  note?: string;
}


export const addQuestionsToSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, questions } = req.body as AddQuestionsBody;
    
    if (!sessionId || !questions || !Array.isArray(questions)) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id as any));
    await session.save();

    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const togglePinQuestion = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      res.status(404).json({ success: false, message: "Question not found" });
      return;
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateQuestionNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { note } = req.body as UpdateNoteBody;
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ success: false, message: "Question not found" });
      return;
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
