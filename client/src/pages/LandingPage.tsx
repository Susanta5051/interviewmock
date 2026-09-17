/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
// import  APP_FEATURES  from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal.tsx";
import Login from "../pages/Auth/Login.tsx";
import SignUp from "../pages/Auth/SignUp.tsx";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.tsx";
import ProfileInfoCard from "../components/cards/ProfileInfoCard.tsx";
import axios from "axios";
import { API_PATHS } from "../utils/apiPaths.ts";
import type { AppDispatch, RootState } from "../redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../redux/userSlice.ts";
import APP_FEATURES from "../utils/data.ts";
import HERO_IMG from '../assets/banner.png'
import logo from '../assets/logo.jpg'
const backendUrl =
  import.meta.env.VITE_BACKEND_URL || ("http://localhost:3000" as string);
axios.defaults.withCredentials = true;

const LandingPage = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const { updateUser, setLoading } = useContext<any>(UserContext);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          backendUrl + API_PATHS.AUTH.GET_PROFILE
        );
        console.log("User authenticated", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(setUser(response.data));
      } catch (error) {
        console.error("User not authenticated", error);
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="min-h-screen">
      <div className="w-full min-h-full">
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

        <div className="container mx-auto  pb-10 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-16 pt-3 px-2 pb-3  bg-white">
            <div className="text-xl text-black font-bold">
              <img src={logo} alt="" className=" h-10 sm:h-15"></img>
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer "
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}

          <div className="flex flex-col md:flex-row items-center px-5">
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-8">
              <div className="flex items-center justify-left mb-2">
                <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery your ultimate interview toolkit is
                here.
              </p>

              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={() => handleCTA()}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-full relative ">
        {/* <div>
          <section className="flex items-center justify-center -mt-36">
            <img
            src={HERO_IMG}
            alt="Hero Image"
            className="w-[80vw] rounded-lg"
          />
          </section>
        </div> */}

        <div className="w-full min-h-full  ">
          <div className="container mx-auto px-4 pt-10 pb-20">
            <section className="mt-5">
              <h2 className="text-4xl font-medium text-center mb-12">
                Features That Make You Shine
              </h2>

              {/* <div className="flex flex-col items-center gap-8">
                First 3 cards
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature: any) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
                Remaining 2 cards
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {APP_FEATURES.slice(3).map((feature: any) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div> */}
            </section>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAuthModal}
        title={currentPage === "login" ? "Login" : "Sign Up"}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage == "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
