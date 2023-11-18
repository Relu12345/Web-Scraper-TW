import React, {useState} from "react"
import {BsStack, BsCloudMoonFill, BsFullscreenExit   } from 'react-icons/bs/'
import { searchText } from "../API/searchText"

interface NavbarProps {
    toggleSidebar: () => void;
  }

const Navbar: React.FC<NavbarProps> = ({toggleSidebar}) => {

    const [searchInput, setSearchInput] = useState<string>('')

    const handleKeyDown = (event:  React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSendData();
        }
    }

    const handleSendData = async () => {
        const result = await searchText(searchInput)
        
        if (result)
            console.log("Text sent successfully!")
        else
            console.log("Error sending text")
    }

    return (
        <nav className="bg-white shadow-lg p-4">
            <div className="flex justify-between">
                {/* Logo */}
                <div className="text-xl xl:text-2xl font-bold text-gray-800 flex">
                    <span className="mr-3 mt-1 text-black cursor-pointer" onClick={toggleSidebar}>
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
                <div className="space-x-4 text-xl mt-2 mr-2">
                    <BsCloudMoonFill />
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar