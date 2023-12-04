import React, {useState} from "react"
import {BsStack, BsCloudMoonFill } from 'react-icons/bs/'
import { searchText } from "../API/searchText"
import { ImExit } from "react-icons/im"
import {removeTokenFromCookies} from '../API/verifyToken'
import { useNavigate } from "react-router"

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
        <nav className="bg-white shadow-lg p-4 ">
            <div className="flex justify-between">
                {/* Logo */}
                <div className="text-xl xl:text-2xl font-bold text-gray-800 flex">
                    <span className="mr-3 mt-1 text-black cursor-pointer" onClick={props.toggleSidebar}>
                        <BsStack />
                    </span>
                    Web Scraper
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border-2 border-gray-300 bg-gray-100 h-10 w-4/5 lg:w-full xl:w-80 px-5 pr-10 rounded-full focus:outline-none focus:border-gray-500"
                        onChange={(event) => setSearchInput(event.target.value)}
                        value={searchInput}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Navigation Links */}
                <div className="space-x-4 text-xl mt-2 flex">
                    <BsCloudMoonFill className="mx-2"/>
                    <ImExit 
                        className="mt-1 cursor-pointer"
                        onClick={LogoutUser}
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar