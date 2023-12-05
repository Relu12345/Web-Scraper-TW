import React, {useState} from "react"
import { getUserInfoFromToken } from "../API/verifyToken"
import { 
    BsFillHouseDoorFill, 
    BsClockFill,
    BsFillMoonStarsFill 
} from "react-icons/bs"
import { split } from "postcss/lib/list"

interface sidebarElem {
    id: number,
    title: string,
    icon: JSX.Element,
}

interface sidebarProps {
    isVisible: boolean,
}

const sidebarElements = [
    {
        id: 0,
        "title": "Home",
        "icon": <BsFillHouseDoorFill />,
    },
    {
        id: 1,
        "title": "History",
        "icon": <BsClockFill />,
    },
    {
        id: 2,
        "title": "Favorites",
        "icon": <BsFillMoonStarsFill />,
    }
]


const Sidebar: React.FC<sidebarProps> = ({isVisible}) => {
    const result = getUserInfoFromToken()?.sub  
    const email = (result as any).email
    const user = (result as any).username
    
    const halfLength = Math.floor(user.length / 2);

    const firstHalf = user.slice(0, halfLength); 
    const secondHalf = user.slice(halfLength);

    const splitUser = [firstHalf, secondHalf];
    const iconUser = splitUser[0][0].toUpperCase() + splitUser[1][0].toUpperCase();
    
    return (
        <aside>
            <div className="px-4 flex h-screen flex-col justify-between dark:bg-gray-900">
                {/*Sidebar content */}
                {isVisible ? (
                    <ul className="text-xl">
                        {/* Show both the icons and the text of each elem. from sidebarElements */}
                        {sidebarElements.map((elem:sidebarElem) => {
                            return (
                                <li key={elem.id} className="flex items-center hover:bg-blue-100 hover:text-blue-700 hover:rounded-md dark:text-white hover:dark:text-black hover:dark:bg-white slow-change">
                                    <span className="pl-2">{elem.icon}</span>
                                    <span className="w-full h-full py-2 text-gray-800 font-semibold pl-2 dark:text-white slow-change hover:dark:text-black slow-change">{elem.title}</span>
                                </li>
                            )
                        })}
                    </ul>
                    
                ) : (
                    <div className="text-xl">
                        {/* Display only the icons if isVisible is false*/}
                        {sidebarElements.map((elem:sidebarElem) => {
                        return (
                            <div key={elem.title} className="flex items-center py-3 hover:bg-blue-100 hover:text-blue-700 hover:rounded-md">
                                <span className="px-2">{elem.icon}</span>
                            </div>
                        )
                    })}
                    </div>
                )}
                
                <div className="flex mb-5  ">
                    <span className="bg-blue-300 px-2 py-1 font-bold text-blue-800 rounded-md mt-2">
                        {iconUser}
                    </span>
                    <div className={`${isVisible? "hidden lg:block" : "hidden"} ml-2 mt-1 dark:text-white`}>
                        <h6>{user}</h6>
                        <h6 className="text-sm">
                            {email}
                        </h6>
                    </div>
                </div>
                
            </div>
        </aside>
    )
}

export default Sidebar