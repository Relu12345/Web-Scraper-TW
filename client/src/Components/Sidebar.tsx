import React from "react"
import { useNavigate } from "react-router"

import { 
    BsFillHouseDoorFill, 
    BsClockFill,
    BsFillMoonStarsFill 
} from "react-icons/bs"


interface sidebarElem {
    id: number,
    title: string,
    icon: JSX.Element,
    route: string
}

interface sidebarProps {
    isVisible: boolean,
}

const sidebarElements = [
    {
        id: 0,
        "title": "Home",
        "icon": <BsFillHouseDoorFill />,
        "route" : "/"
    },
    {
        id: 1,
        "title": "History",
        "icon": <BsClockFill />,
        "route": "/history"
    },
    {
        id: 2,
        "title": "Favorites",
        "icon": <BsFillMoonStarsFill />,
        "route": "/favorites"
    }
]


const Sidebar: React.FC<sidebarProps> = ({isVisible}) => {
    const navigate=useNavigate()
    
    return (
        <aside className="h-screen w-full">
            <div className="px-4 flex ">
                {/*Sidebar content */}
                {isVisible ? (
                    <ul className="text-xl w-full">
                        {/* Show both the icons and the text of each elem. from sidebarElements */}
                        {sidebarElements.map((elem:sidebarElem) => {
                            return (
                                <li 
                                    key={elem.id} 
                                    onClick={() => navigate(elem.route)}
                                    className="cursor-pointer flex items-center hover:bg-blue-100 hover:text-blue-700 hover:rounded-md dark:text-white hover:dark:text-black hover:dark:bg-white">
                                    <span className="pl-2 ">{elem.icon}</span>
                                    <span className="w-full h-full py-2 text-gray-800 font-semibold pl-2 dark:text-white hover:dark:text-black">{elem.title}</span>
                                </li>
                            )
                        })}
                    </ul>
                    
                ) : (
                    <div className="text-xl">
                        {/* Display only the icons if isVisible is false*/}
                        {sidebarElements.map((elem:sidebarElem) => {
                        return (
                            <div
                                onClick={() => navigate(elem.route)} 
                                key={elem.title} className="cursor-pointer flex items-center py-3 hover:bg-blue-100 hover:text-blue-700 hover:rounded-md dark:text-white hover:dark:bg-white hover:dark:text-black ">
                                <span className="px-2">{elem.icon}</span>
                            </div>
                        )
                    })}
                    </div>
                )}
                
                
                
            </div>
        </aside>
    )
}

export default Sidebar