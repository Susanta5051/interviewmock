import React, {createContext, useState,  } from "react";
type UserContextType = {
    user: any;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    updateUser: (userData: any) => void;
    clearUser: () => void;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] =  useState(null);
    const [loading, setLoading] = useState(true); // New state to track loading

    const updateUser = (userData: any) => {
        setUser (userData);
        localStorage.setItem("user", JSON.stringify(userData)); 
        setLoading (false);
    };
    
    const clearUser = () => {
        setUser(null); 
        localStorage.removeItem("user");
    };
    
    return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser,setLoading }}> 
    {children}
    </UserContext.Provider>
    );
};

export default UserProvider;