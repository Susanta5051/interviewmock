import { Response } from "express";
import Session from "../models/Session";
import Question from "../models/Question";
import { AuthenticatedRequest } from "../middlewares/authMiddlewares"; 

interface CreateSessionBody {
  role: string;
  experience: string;
  topicsToFocus: string[];
  description?: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}


export const createSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Received request body:", req.body);
    const { role, experience, topicsToFocus, description, questions } = req.body as CreateSessionBody;
    
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }
    
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getMySessions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");
      
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getSessionById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    
    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const deleteSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    if (session.user.toString() !== req.user.id) {
      res.status(401).json({ message: "Not authorized to delete this session" });
      return;
    }

    await Question.deleteMany({ session: session._id });

    await session.deleteOne();

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
