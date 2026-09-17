import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
    user: Types.ObjectId;
    role: string;
    experience: string;
    topicsToFocus: string;
    description?: string;
    questions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema: Schema<ISession> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, required: true },
        experience: { type: String, required: true },
        topicsToFocus: { type: String, required: true },
        description: { type: String },
        questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    },
    { timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
