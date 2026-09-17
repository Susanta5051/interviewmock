import React, { Activity, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import avatar from "../../assets/avatar_icon.png";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store.ts';
import { clearUser, setUser } from '../../redux/userSlice.ts';
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { API_PATHS } from '../../utils/apiPaths.ts';
import axios from 'axios';
import toast from 'react-hot-toast';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000" as string;
axios.defaults.withCredentials = true;

const ProfileInfoCard = () => {
    const [showProfile , setShowProfile] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const user: any = useSelector((state:RootState) => state.users.user);
    if (!user) {
        return null;
    }
    const navigate = useNavigate();

    const handleImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files)return
        const formData = new FormData()
        formData.append("image",e.target.files[0])
        try{
            const response = await axios.post(backendUrl+API_PATHS.AUTH.UPDATE_PROFILE ,
                 formData ,
                  {
                    headers :
                    {"Content-Type" : 'multipart/form-data'}
                }
            )
            console.log(response)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            dispatch(setUser(response.data.user));
            setShowProfile(false)
        }catch(error:any){
            toast.error(error.response?.data?.message)
            console.log(error)
        }
    }

    const handelLogout = async () => {
        try{
            const response = await axios.get(backendUrl+API_PATHS.AUTH.LOGOUT);
            localStorage.removeItem("user")
            dispatch(clearUser());
        
            navigate("/");
        }catch(error:any){
            console.log(error)
        }
        
    };

    return (
        user && (
    <div className="flex items-center">
        {showProfile && 
            <div className='absolute flex justify-center items-center h-screen w-screen left-0 bottom-0 text-center bg-transparent  '>
            <div className='absolute' >
                <div className='relative -top-30 -left-30 cursor-pointer' >
                    <div onClick={()=>setShowProfile(false)}><RxCross2 /></div>
                </div>
            </div>


            <div className='absolute'>
                <div className='relative -top-30 left-30 cursor-pointer'>
                    <form>
                        <input type='file' accept='image/*' className='hidden' id='profile' onChange={(e)=>handleImageChange(e)}></input>
                        <label htmlFor='profile'><MdOutlineEdit /></label>
                    </form>
                </div>
            </div>


            <div className='bg-gray-100 p-10'>
                <img src={user.profileImageUrl || avatar} alt='' className='h-50 object-cover rounded-full w-50'></img>
            </div>
        </div>
        }
        <div onClick={()=>setShowProfile(true)}>
            <img
            src={user.profileImageUrl || avatar}
            alt=""
            className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
            />
        </div>

            <div>

            <div
                className="text-[15px] text-black font-bold leading-3"
            >
                {user.name || ""}
                </div>
                <button
                    className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
                    onClick={handelLogout}
                    >
                        Logout
                    </button>
                    </div>
                    </div>
        )
    )
}

export default ProfileInfoCard