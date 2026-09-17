import React, { useContext } from "react"; 
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

const DashboardLayout = ({ children }:{children: React.ReactNode}) => { 
    const user = useSelector((state:RootState) => state.users.user);
    // const {user} = useContext<any> (UserContext); 
    if(!user)return null
    return ( 
    <div className="">
    <Navbar />
        {user && <div>{children}</div>}
 </div>
  );
};
export default DashboardLayout;