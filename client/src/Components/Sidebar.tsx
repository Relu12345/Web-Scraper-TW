import React, { useEffect, useState} from "react"
import { useNavigate } from "react-router"
import Typewriter from '../utils/Typewriter'
import { useWindowSize } from "../utils/useWindowSize"
import { IoMdClose } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { DeleteDialog } from "./DeleteDialog"
import {textFormat} from '../utils/textFormat'
import {getHistory} from '../API/getHistory'
import { getUserInfoFromToken } from "../API/verifyToken"

interface historyObj {
    date: Date,
    query: string
}

interface sidebarProps {
    isVisible: boolean,
    latestSearch: string | null
    onClose: (value: boolean) => void
    handleSidebarResearch: (value: string | null) => void
    handleConfirmationDialog: (value: boolean) => void
}

const Sidebar: React.FC<sidebarProps> = ({isVisible, latestSearch, onClose, handleSidebarResearch, handleConfirmationDialog}) => {
    const navigate=useNavigate()
    const user = getUserInfoFromToken()?.sub 
    const windowSize = useWindowSize()
    const windowHeight = Math.floor((windowSize.height / 100) * 2 - 4)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [previousItem, setPreviousItem] = useState('')
    const [sidebarHistory, setSidebarHistory] = useState<string[]>([])
    const [visibleHistory, setVisibleHistory] = useState<string[]>([])
    const [firstHistoryFetch, setFirstHistoryFetch] = useState(true)
    const [fullObject, setFullObject] = useState<historyObj | null>(null)
    const [fullSearchObjects, setFullSearchObjects] = useState<historyObj[]>([])

    useEffect(() => {
        if (firstHistoryFetch) {
            fetchHistory()
            setFirstHistoryFetch(false)
        }
        if (latestSearch && latestSearch != previousItem) {
            fetchHistory()
            setPreviousItem(latestSearch)
        }
        setTimeout(() => {}, 1500)
    }, [sidebarHistory, latestSearch, firstHistoryFetch])

    useEffect(() => {
        const maxElements = Math.min(windowHeight, sidebarHistory.length)
        setVisibleHistory(sidebarHistory.slice(0, maxElements))

    },[windowHeight, sidebarHistory])

    const fetchHistory = async () => {
        const result = await getHistory(user?.username)

        if (result) {
            const data = JSON.parse(await result.text())
            
            let historyData: string[] = []
            setFullSearchObjects(data.history.reverse())
           // console.log(data.history)
            for (let elem of data.history) {
                historyData.push(textFormat(elem.query))
            }
            //console.log(historyData)
            setSidebarHistory(historyData)
        }
    }

    const handleFirstFetch = (value: boolean) => {
        setFirstHistoryFetch(true)
    }
    
    return (
        <aside 
            onClick={(e) => e.stopPropagation()}
            className={`w-full transition-all duration-300`}>
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
                                flex justify-end text-end mt-2 text-gray-800 
                                text-lg lg:text-xl px-1 pb-0 pt-2 rounded-md hover:bg-gray-200
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
                            {visibleHistory.map((elem, id) => {
                               return (
                                    <div 
                                        key={id + elem}
                                        onClick={(e) => {e.stopPropagation(); handleSidebarResearch(fullSearchObjects[id].query); navigate("/");  onClose(true)}}
                                        className={`
                                            flex justify-between p-2 font-semibold text-md `
                                        }
                                    >
                                        <h1 className="cursor-pointer pl-2 py-1 hover:bg-gray-200 w-full hover:rounded-md dark:hover:bg-gray-600 dark:text-white">
                                            {
                                                id === 0 ?
                                                <Typewriter text={elem} delay={100} />
                                                :
                                                <span className="animate-fadeIn">{elem}</span>
                                            }
                                        </h1>

                                        <button 
                                            onClick={(e) => {e.stopPropagation(); setIsDeleteOpen(true); setFullObject(fullSearchObjects[id])}}
                                            className={`
                                                flex mt-1 ml-4 pt-1.5 mr-1 px-2 justify-end rounded-xl hover:bg-gray-300
                                                text-gray-800 hover:text-red-500 hover:dark:text-red-600 
                                                hover:dark:bg-slate-700 dark:text-white`
                                            }
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                )
                            })}
                        </ul>
                        {
                            visibleHistory.length === windowHeight  &&
                            <div className="flex my-6 ">
                                <hr className="flex w-1/4 mr-1 mt-2.5 border-gray-400" />
                                <button 
                                    onClick={() => {navigate('/history');onClose(false)}}
                                    className="text-sm font-semibold dark:text-white mx-1"
                                >
                                        Show more
                                </button>
                                <hr className="flex w-1/4 ml-1 mt-2.5 border-gray-400"/>
                            </div>
                        }
                    </div>
                    }

                    {
                        isDeleteOpen &&
                        <DeleteDialog 
                            text={"Are you sure you want to delte this item from history ?"}
                            isOpen={isDeleteOpen}
                            onClose={() => setIsDeleteOpen(false)}
                            item={fullObject}
                            username={user?.username}
                            handleFetch={handleFirstFetch}
                            handleConfirmationDialog={handleConfirmationDialog}
                        />
                    }
                
            </div>
        </aside>
    )
}

export default Sidebar