import React, {useState} from "react"
import {BsStack, BsMoonStars} from 'react-icons/bs/'
import {removeTokenFromCookies} from '../API/verifyToken'
import { searchText } from "../API/searchText"
import { useNavigate } from "react-router"
import { Profile } from "./Profile"
import { FaSun } from "react-icons/fa";



interface ResponseMessage {
    message: string
    text: ResponseMessageText[]
}

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

interface NavbarProps {
    toggleSidebar: () => void;
    onUpdateData: (newData: ResponseMessageText[]) => void
    handleTheme: () => void
    handleLoading: (value: boolean) => void
  }

let responseText: ResponseMessageText[] = []

const Navbar: React.FC<NavbarProps> = (props) => {
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState<string>('')
    
    //Store the search result

    const handleKeyDown = (event:  React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            handleSendData();
            props.handleLoading(true)
        }
    }

    const handleSendData = async () => {
        console.log('Sending data:', searchInput);
        const result = await searchText(searchInput)
        
        
        if (result) {
            //pass the response data to the onUpdateData callback function
            const data: ResponseMessage = await result.json()
            responseText = data.text
            props.onUpdateData(responseText)
            props.handleLoading(false)
        }
        else
            console.log("Error sending text")
    }


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
                    Web Scraper
                </div>

                {/* Search Bar */}
                <div className="hidden relative md:inline-block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className=" md:w-4/5 lg:w-full xl:w-80 border-2 border-gray-300 bg-gray-100 h-10 px-5 pr-10 rounded-full focus:outline-none focus:border-gray-500 dark:bg-gray-400 dark:border-gray-400 focus:dark:border-white dark:placeholder-gray-800 slow-change"
                        onChange={(event) => setSearchInput(event.target.value)}
                        value={searchInput}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Navigation Links */}
                
                <div className="flex space-x-4 text-xl mt-2 ">
                   <div 
                        onClick={props.handleTheme}
                        className="cursor-pointer w-20 h-10 -mt-1 relative rounded-full border-2 border-gray-500 bg-white dark:border-white dark:bg-slate-800">
                        <span className={` w-2/5 h-4/5 absolute rounded-full ml-2 my-1 bg-slate-800 dark:bg-white dark:ml-10 transition-all duration-500`}>
                            {localStorage.theme === "dark" ? <FaSun className="mt-1 mx-1.5"/> : <BsMoonStars className="mt-1 mx-1.5 text-white"/>}
                        </span>
                   </div>
                
                    <Profile handleLogout={LogoutUser}/>
                </div>
            </div>
        </nav>
    )
}

export default Navbar