/* eslint-disable no-unused-vars */

import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuCross, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader.tsx";
import { toast } from "react-hot-toast";
import RoleInfoHeader from "./Components/RoleInfoHeader.tsx";
import { API_PATHS } from '../../utils/apiPaths.ts';
import Drawer from '../../components/Drawer.tsx';
import SkeletonLoader from '../../components/Loader/SkeletonLoader.tsx';
import AIResponsePreview from './Components/AIResponsePreview.tsx';
import axios from 'axios'
import DashboardLayout from '../../components/layouts/DashBoardLayout.tsx';
import QuestionCard from '../../components/cards/QuestionCard.tsx';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000" as string;
axios.defaults.withCredentials = true;



const InterviewPrep = () => { 
  const navigate = useNavigate()
  const { sessionId } = useParams();
  if(!sessionId) {
    toast.error("Session ID is missing in the URL");
    return null; 
  }

  const [sessionData, setSessionData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false); 
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axios.get( 
        backendUrl + API_PATHS.SESSION.GET_ONE(sessionId) 
      );

      if (response.data && response.data.session) {  
        setSessionData(response.data.session);
      }
} catch (error) {
  console.error("Error:", error);
  }
};

  const generateConceptExplanation = async (question:string) => {
    try{
      setErrorMsg("");
      setExplanation(null)

      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axios.post(
        backendUrl + API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if(response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null)
      setErrorMsg("Failed to generate explanation, Try again later" );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleQuestionPinStatus = async (questionId:string) => {
    try {
      const response = await axios.post( 
        backendUrl + API_PATHS.QUESTION.PIN(questionId) 
      );

      if (response.data && response.data.question) {  
        fetchSessionDetailsById();
      }
} catch (error) {
  console.error("Error:", error);
  }
};

  const uploadMoreQuestions = async () => {
    try{
      setIsUpdateLoader(true);

      const aiResponse = await axios.post(
        backendUrl + API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10, 
        }
);
      const generatedQuestions = aiResponse.data;
      
      const response = await axios.post(
        backendUrl +  API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions, 
        }
      );
      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error:any) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally{
      setIsUpdateLoader(false);
    }
    
  
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }

    return () => {};
  }, []);
    return ( 
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
          ? moment(sessionData.updatedAt).format("Do MMM YYYY")
          : ""
        }
        />

        <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
          <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
  
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7": "md:col-span-8"
            } `}
          >

        <AnimatePresence>
          {sessionData?.questions?.map((data:any, index:number) => {
            return (
              <motion.div
                key={data._id || index}
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1,
                  damping: 15,
              }}
              layout 
              layoutId={`question-${data._id || index}`} 
              >
                <>
                <QuestionCard
                question={data?.question}
                answer={data?.answer}
                onLearnMore={() =>
                  generateConceptExplanation(data.question)
                }
                isPinned={data?.isPinned}
                onTogglePin={() => toggleQuestionPinStatus(data._id)}
              />

              {!isLoading &&
                sessionData?.questions?.length == index + 1 && (
                  <div className="flex items-center justify-center mt-5">
                    <button
                      className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                      disabled={isLoading || isUpdateLoader}
                      onClick={uploadMoreQuestions}
                    >
                      {isUpdateLoader ? (
                        <SpinnerLoader />
                      ) : (
                      
                      <LuListCollapse className="text-lg" />
                      )}{""}
                      Load More
                    </button>
                  </div>
                )}
                </>
              </motion.div>
            );
          })}
          </AnimatePresence>
          </div>
          </div>

          <div>
            
            <Drawer
            isOpen= {openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
              )}
              </Drawer>
          </div>
          </div>
        </DashboardLayout> 
  )
}

export default InterviewPrep
