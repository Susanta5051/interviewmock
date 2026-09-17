import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";
import { AuthenticatedRequest } from "../middlewares/authMiddlewares.ts";
import uploadOnCloudinary from "../utils/cloudinary.ts";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const isProduction = process.env.NODE_ENV === "production";

const generateToken = (userId: any): string => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  
  return token;
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Registering user with data:",req.body);
    const { name, email, password, profileImageUrl } = req.body as RegisterBody;
    
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success:false , message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl || null,
    })
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }); 

    // console.log("User registered successfully:", user);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id);

      res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction ? "none" : "lax",
      maxAge: 24*60*60*1000, 
    }); 

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Fetching user profile for user:", req.user);
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateImage = async(req: AuthenticatedRequest, res: Response) => { 
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" }); 
    } 
    
    const url = await uploadOnCloudinary(req.file as Express.Multer.File);

    const user = await User.findByIdAndUpdate(req.user?._id, {$set : { profileImageUrl:url }} , {new:true}).select('-password')
    
    return res.status(200).json({success:true , user}); 
};

