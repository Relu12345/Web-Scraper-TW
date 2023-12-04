import React from "react"
import { 
    BsFillHouseDoorFill, 
    BsClockFill,
    BsFillMoonStarsFill 
} from "react-icons/bs"

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
        "title": "Favotites",
        "icon": <BsFillMoonStarsFill />,
    }
]

const Sidebar: React.FC<sidebarProps> = ({isVisible}) => {
    return (
        <aside>
            <div className="px-4 flex h-screen flex-col justify-between">
                {/*Sidebar content */}
                {isVisible ? (
                    <ul className="text-xl">
                        {/* Show both the icons and the text of each elem. from sidebarElements */}
                        {sidebarElements.map((elem:sidebarElem) => {
                            return (
                                <li key={elem.id} className="flex items-center py-2 hover:bg-blue-100 hover:text-blue-700 hover:rounded-md">
                                    <span className="pl-2">{elem.icon}</span>
                                    <p className="text-gray-800 font-semibold pl-2">{elem.title}</p>
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
                
                <div className="flex mb-5 justify-end ">
                    <span className="bg-blue-300 px-2 py-1 font-bold text-blue-800 rounded-md mt-2">
                        AC
                    </span>
                    <div className={`${isVisible? "hidden lg:block" : "hidden"} ml-2 mt-1 `}>
                        <h6>Aurel-Ionut Coruian</h6>
                        <h6 className="text-sm">
                            aurel.coruian02@e-uvt.ro
                        </h6>
                    </div>
                </div>
                
            </div>
        </aside>
    )
}

export default Sidebar