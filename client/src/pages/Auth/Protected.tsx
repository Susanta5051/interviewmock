import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { type AppDispatch, type RootState } from "../../redux/store.ts"; 
import { setUser } from "../../redux/userSlice.ts"; 
import { useDispatch, useSelector } from "react-redux"; 
import toast from "react-hot-toast"; 

const Protected = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state:RootState)=>state.users.user)
  const userString = localStorage.getItem("user");
  useEffect(() => {
    if(!user && !userString){
        toast.error("Please Login Before Preparing!");
        navigate("/");
    }
    else
    if (!user && userString) {
      try {
        const userData = JSON.parse(userString);
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        toast.error("Session invalid. Please login again.");
        navigate("/");
      }
    } 
  }, [user, userString, navigate, dispatch]);

  return userString ? <>{children}</> : null;
};

export default Protected;
