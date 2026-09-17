import mongoose from "mongoose";
import express from 'express'

/**
 * Establishes a connection to the MongoDB database.
 * Terminated process with code 1 if connection fails.
 */
const connectDB = async (): Promise<void> => {
  try {
    // Explicitly cast the MONGO_URI as a string to prevent configuration type errors
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error("Error connecting to MongoDB", err.message || err);
    process.exit(1);
  }
};

export default connectDB;
