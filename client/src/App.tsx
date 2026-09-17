import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage.tsx";
import Dashboard from "./pages/Home/DashBoard.tsx";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep.tsx";
import UserProvider from "./context/UserContext.tsx";
import Protected from "./pages/Auth/Protected.tsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL ||
  ("http://localhost:3000" as string);



const App = () => {

  


  
  return (
    <UserProvider>
      <div className="bg-linear-to-r from-blue-500 to-red-500">
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={<Protected ><Dashboard /></Protected>} />
            <Route
              path="/interview-prep/:sessionId"
              element={<Protected ><InterviewPrep /></Protected>}
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
