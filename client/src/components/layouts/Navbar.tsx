
import ProfileInfoCard from "../cards/ProfileInfoCard.tsx";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.jpg'

const Navbar= () => {
    return (
        <div className=" bg-gray-50 border boredr-bborder-gray-200/50 backdrop-blur-[2px] py-2.5 px-4  sticky top-0 z-30">
            <div className="container mx-auto flex items-center justify-between gap-5">
                <Link to="/dashboard">
                    <h2 className="text-lg md:text-xl font-medium text-black leading-5">
                         <img src={logo} alt="" className=" h-10 sm:h-15"></img>
                    </h2>
                </Link>

            <ProfileInfoCard />
        </div>
    </div>
)
}

export default Navbar