import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestion extends Document {
    session: Types.ObjectId;
    question: string;
    answer: string;
    note?: string; 
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema: Schema<IQuestion> = new Schema(
    {
        session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        note: { type: String },
        isPinned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
