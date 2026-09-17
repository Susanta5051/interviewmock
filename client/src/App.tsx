import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {  useDispatch } from "react-redux";
import LandingPage from "./pages/LandingPage.tsx";
import Dashboard from "./pages/Home/DashBoard.tsx";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep.tsx";
import UserProvider from "./context/UserContext.tsx";

import  {type AppDispatch } from "./redux/store.ts";
import { setUser } from "./redux/userSlice.ts";

export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || ("http://localhost:3000" as string);

const App = () => {

  const dispatch = useDispatch<AppDispatch>()

  if(localStorage.getItem("user") ) {
    const data = localStorage.getItem("user");
    if(data){
      const userData = JSON.parse(data);
      dispatch(setUser(userData));  
    }
  
}
  return (
    <UserProvider>
      <div className="bg-linear-to-r from-blue-500 to-red-500">
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
