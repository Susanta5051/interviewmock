import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { AuthenticatedRequest } from "../middlewares/authMiddlewares"; 
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts"; 
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });


interface GenerateQuestionsBody {
  role: string;
  experience: string;
  topicsToFocus: string | string[];
  numberOfQuestions: number;
}

interface GenerateExplanationBody {
  question: string;
}


export const generateInterviewQuestions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Received request body:", req.body);
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body as GenerateQuestionsBody;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    // console.log("Prompt sent to AI:", prompt);
    console.log("Prompt sent to AI:");
    

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      },
    });


    const rawText = response.text;
    
    if (!rawText) {
      res.status(500).json({ message: "AI returned an empty response" });
      return;
    }

    // Clean Markdown block markup securely
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```\$/, "")        // remove ending ```
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error: any) {
    console.error( error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};


export const generateConceptExplaination = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.body as GenerateExplanationBody;

    if (!question) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const prompt = conceptExplainPrompt(question);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      },
    });

    const rawText = response.text;
    
    if (!rawText) {
      res.status(500).json({ message: "AI returned an empty response" });
      return;
    }

    // Clean Markdown block markup securely
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```\$/, "")        // remove ending ```
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};
