
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.tsx";

import { API_PATHS } from "../../utils/apiPaths.ts";
import axios from "axios";
import {backendUrl} from '../../App.tsx'
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store.ts";
import { setUser } from "../../redux/userSlice.ts";
axios.defaults.withCredentials = true;

const Signup = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<string>> }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>()
  const [error, setError] = useState("");

  const navigate = useNavigate();


const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!password) {
      setError("Please enter the password");
      return; 
    }
    
    setError("");
    try {
  const response = await axios.post(backendUrl + API_PATHS.AUTH.REGISTER, {
    name: fullName,
    email, 
    password, 
  });


  if (response.data.success) {
  dispatch(setUser(response.data.user))
  navigate("/dashboard");
  }

 } catch (error:any) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  
  return <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
    <h3 className="text-lg font-semibold text-black">Create an Account</h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-6">
      Join us today by entering your details below.
      </p>
      
      <form onSubmit={handleSignUp}>

        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
          label="Full Name"
          placeholder="John"
          type="text"
          />
          
          <Input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
          />

          <Input
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
          />
          </div>
          
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          
          <button type="submit" className="btn-primary">
            SIGN UP
            </button>
            
            <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{" "}
            <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
            >
              Login
              </button>
              </p>
            </form>
          </div>
          
        };

export default Signup;