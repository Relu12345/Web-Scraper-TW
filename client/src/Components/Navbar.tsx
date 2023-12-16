import React from "react"
import {BsStack, BsMoonStars} from 'react-icons/bs/'
import {removeTokenFromCookies} from '../API/verifyToken'
import { useNavigate } from "react-router"
import { Profile } from "./Profile"
import { FaSun } from "react-icons/fa";


interface NavbarProps {
    toggleSidebar: () => void;
    handleTheme: () => void
    handleLoading: (value: boolean) => void
  }


const Navbar: React.FC<NavbarProps> = (props) => {
    const navigate = useNavigate()

    const LogoutUser = () => {
        try {
            removeTokenFromCookies()
            navigate("/login")
        } catch (error) {   
            console.error("Failed to logout user", error)
        }
    }

    return (
        <nav className=" bg-white shadow-lg p-4 dark:bg-gray-900 slow-change">
            <div className="flex justify-between">
                {/* Logo */}
                <div className="text-xl xl:text-2xl font-bold text-gray-800 flex dark:text-white">
                    <span className="mr-3 mt-1 text-black dark:text-white cursor-pointer" onClick={props.toggleSidebar}>
                        <BsStack />
                    </span>
                    FetchFlow
                </div>

                {/* Navigation Links */}
                
                <div className="flex space-x-4 text-xl mt-2 ">
                   <div 
                        onClick={props.handleTheme}
                        className="cursor-pointer w-20 h-10 -mt-1 relative rounded-full border-2 border-gray-500 bg-white dark:border-white dark:bg-slate-800">
                        <span className={` w-2/5 h-4/5 absolute rounded-full ml-2 my-1 bg-slate-800 dark:bg-white dark:ml-10 transition-all duration-500`}>
                            {localStorage.theme === "dark" ? <BsMoonStars className="mt-1 mx-1.5"/> : <FaSun className="mt-1 mx-1.5 text-white"/>}
                        </span>
                   </div>
                
                    <Profile handleLogout={LogoutUser}/>
                </div>
            </div>
        </nav>
    )
}

export default Navbar