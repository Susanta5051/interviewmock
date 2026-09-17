import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, {type IUser } from "../models/User.ts";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies.token;
    if (token ) {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      
      req.user = await User.findById(decoded.id).select("-password"); 
      
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error: any) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};
