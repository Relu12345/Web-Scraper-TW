import React from "react"
import { 
    BsFillHouseDoorFill, 
    BsClockFill,
    BsFillMoonStarsFill 
} from "react-icons/bs"

interface sidebarElem {
    title: string,
    icon: JSX.Element,
}

interface sidebarProps {
    isVisible: boolean,
}

const sidebarElements = [
    {
        "title": "Home",
        "icon": <BsFillHouseDoorFill />,
    },
    {
        "title": "History",
        "icon": <BsClockFill />,
    },
    {
        "title": "Favotites",
        "icon": <BsFillMoonStarsFill />,
    }
]

const Sidebar: React.FC<sidebarProps> = ({isVisible}) => {
    return (
        <aside 
            className={`fixed h-screen bg-white shadow-md transition-transform ${
            isVisible ? 'translate-x-0 w-min md:w-1/6 lg:w-60' : 'translate-x-0 w-min'
      }`}
        >
            <div className="p-4 flex flex-col h-full justify-between">
                {/*Sidebar content */}
                {isVisible ? (
                    <div className="text-xl">
                        {/* Show both the icons and the text of each elem. from sidebarElements */}
                        {sidebarElements.map((elem:sidebarElem) => {
                            return (
                                <li key={elem.title} className="flex items-center py-2 hover:bg-blue-100 hover:text-blue-700 hover:rounded-md">
                                    <span className="pl-2">{elem.icon}</span>
                                    <p className="text-gray-800 font-semibold pl-2">{elem.title}</p>
                                </li>
                            )
                        })}
                        
                    </div>
                    
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
                <div className="flex mb-20 ">
                    <span className="bg-blue-300 px-2 py-1 font-bold text-blue-800 rounded-md mt-2">
                        HC
                    </span>
                    <div className={`${isVisible? "hidden lg:block" : "hidden"} ml-2 mt-1 `}>
                        <h6>Horatiu Crisan</h6>
                        <h6 className="text-sm">
                            horatiu.crisan01@e-uvt.ro
                        </h6>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar