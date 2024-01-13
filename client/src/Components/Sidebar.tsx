import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import Typewriter from '../utils/Typewriter'
import { IoMdClose } from "react-icons/io"
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

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

interface sidebarProps {
    isVisible: boolean,
    //latestSearch: ResponseMessageText
    latestSearch: string | null
    onClose: (value: boolean) => void
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

const Sidebar: React.FC<sidebarProps> = ({isVisible, latestSearch, onClose}) => {
    const navigate=useNavigate()
    const [sidebarHistory, setSidebarHistory] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'])
    const [newSearch, setNewSearch] = useState(false)

    useEffect(() => {
        if (latestSearch) {
            setNewSearch(true)
            setSidebarHistory(verifyLength(sidebarHistory))
            setSidebarHistory(prevHistory => [latestSearch, ...prevHistory])
            setTimeout(() => {}, 1500)
        }
    }, [latestSearch])

    const verifyLength = (list: string[]) => {
        if (list.length === 20)
            return removeItem(list, 19, 1)
        return list
    }

    const removeItem = (list: string[], from: number, to: number)  => {
        const updateList = [...list]
        updateList.splice(from, to)
        return updateList
    }
    
    return (
        <aside className="w-full">
            <div className="px-4 flex ">
                {/*Sidebar content */}
                {isVisible &&
                    <div className="block my-4 w-full">
                        <div className="flex justify-between">
                            <h1 className="p-2 font-bold text-lg dark:text-white">
                                Search History
                            </h1>

                        <button
                            onClick={() => onClose(false)}
                            className={`
                                flex justify-end text-end mt-3 text-gray-800 
                                text-lg lg:text-xl p-1 rounded-md hover:bg-gray-200
                                hover:dark:bg-gray-100 hover:dark:text-black 
                                dark:text-white
                            `}
                        >
                            <IoMdClose />
                        </button>
                        </div>
                        <hr className="w-full border my-3 border-black dark:border-white"/>

                        <ul className="text-xl w-full">
                            {/* Show both the icons and the text of each elem. from sidebarElements */}
                            {sidebarHistory.map((elem, id) => {
                                return (
                                    <div 
                                        key={id + elem}
                                        className={`
                                            p-2 font-semibold text-md cursor-pointer hover:bg-gray-200 
                                            hover:rounded-md dark:hover:bg-gray-600 dark:text-white`
                                        }
                                    >
                                        <h1>
                                            {
                                                id === 0 && newSearch?
                                                <Typewriter text={elem} delay={100} />
                                                :
                                                <span className="animate-fadeIn">{elem}</span>
                                            }
                                        </h1>
                                    </div>
                                )
                            })}
                        </ul>
                        {
                            sidebarHistory.length === 20 &&
                            <div className="flex my-3 ">
                                <hr className="flex w-1/4 mr-1 mt-2.5 border-gray-400" />
                                <button 
                                    onClick={() => navigate('/history')}
                                    className="text-sm font-semibold dark:text-white mx-1"
                                >
                                        Show more
                                </button>
                                <hr className="flex w-1/4 ml-1 mt-2.5 border-gray-400"/>
                            </div>
                        }
                    </div>
                    
                    }
                
                
                
            </div>
        </aside>
    )
}

export default Sidebar