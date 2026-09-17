
import ProfileInfoCard from "../cards/ProfileInfoCard.tsx";
import { Link } from "react-router-dom";

const Navbar= () => {
    return (
        <div className="h-16 bg-gray-50 border boredr-bborder-gray-200/50 backdrop-blur-[2px] py-2.5 px-4  sticky top-0 z-30">
            <div className="container mx-auto flex items-center justify-between gap-5">
                <Link to="/dashboard">
                    <h2 className="text-lg md:text-xl font-medium text-black leading-5">
                         QnA.ai
                    </h2>
                </Link>

            <ProfileInfoCard />
        </div>
    </div>
)
}

export default Navbar