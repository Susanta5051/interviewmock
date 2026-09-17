import express, { Router, type Request, type Response } from "express";
import { registerUser, loginUser, getUserProfile, updateImage } from "../controllers/authController.ts";
import { protect } from "../middlewares/authMiddlewares.ts";
import upload from "../middlewares/uploadMiddlewares.ts";

const router: Router = express.Router();

// Auth Routes
router.post("/register", registerUser); 
router.post("/login", loginUser); 
router.get("/profile", protect, getUserProfile);
router.get("/logout",  (req:Request , res:Response) =>{
    try{
    res.clearCookie('token', {
    httpOnly: true,
    secure: true,    
    sameSite: 'none',   
  });

  return res.status(200).json({ message: "Logged out successfully" });
  }catch(error){
    console.log(error)
    return res.status(500).json({ message: "Logout failed" });
  }
});

// Upload Route
router.post("/update", upload.single("image"),protect, updateImage)

export default router;
