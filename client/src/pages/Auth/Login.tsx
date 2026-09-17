
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.tsx";
// import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths.ts";
import axios from "axios";
import {backendUrl} from '../../App.tsx'
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store.ts";
import { setUser } from "../../redux/userSlice.ts";
axios.defaults.withCredentials= true

const Login = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
    
  const navigate = useNavigate(); 
  
  // Handle Login Form Submit
  const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    
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
      const response = await axios.post(backendUrl+API_PATHS.AUTH.LOGIN, {
            email,
            password,
        },);
        console.log(response)
        if (response.data.success){
          dispatch(setUser(response.data.user))
          navigate('/dashboard');
        }
      } catch (error: any) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  
  return(
  <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
    <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-6">
      Please enter your details to log in
      </p>
      
      <form onSubmit={handleLogin}>
        <Input
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        label= "Email Address"
        placeholder="john@example.com"
        type="text"
        />
        
        <Input
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        label="Password"
        placeholder="Min 8 Characters"
        type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
            </button>
          </p>
        </form>
    </div>
  );
};

export default Login;
