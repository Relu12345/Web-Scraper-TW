import React, {MutableRefObject, useEffect, useState} from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import LoadingScreen from '../utils/LoadingScreen'

interface Props {
    handleTheme: () => void
    searchElement: string | null
    handleSidebarState : (value: boolean) => void
}

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

export const Layout: React.FC<Props> = ({handleTheme, searchElement, handleSidebarState}) => {
    const [loading, setLoading] = useState(false) 
    //sidebar toggle functionality
    const [isToggleStateSidebar, setIsToggleStateSidebar] = useState<boolean>(false)
    //gettin the search result from the navbar
    //const [searchData, setSearchData] = useState<ResponseMessageText[]>([])
    //Close profile description 
    const [isToggleProfile, setIsToggleProfile] = useState(true)

    useEffect(() => {
        handleSidebarState(isToggleStateSidebar)
    }, [isToggleStateSidebar])


    const toggleStateSidebar = () => {
        setIsToggleStateSidebar(!isToggleStateSidebar)
    }

    const closeSidebar = (value: boolean) => {
        setIsToggleStateSidebar(false)
    }
  

    const handleLoading = (value: boolean) =>{
      setLoading(value)
    }

    const handleProfileToggle = (value: boolean) => {
        setIsToggleProfile(value)
    }

  
    const callbackFunctions = {
      toggleSidebar: toggleStateSidebar,
      handleTheme: handleTheme,
      handleLoading: handleLoading,
      displayProfile: isToggleProfile
    }

    return (
        <div 
            
            className='w-full'
        >
            <Navbar {...callbackFunctions} />
            <div 
                onClick={() => setIsToggleProfile(false)}
                className='flex dark:bg-slate-800 slow-change'
            >                
                <div className={`
                        ${isToggleStateSidebar ? 
                        "fixed top-0 h-full  w-2/6 md:w-2/6 md:w-60 bg-white shadow-md dark:bg-gray-900 slow-change z-50 opacity-100" : 'opacity-0'} 
                        transition-all duration-300`
                    }
                >
                    <Sidebar 
                        isVisible={isToggleStateSidebar} 
                        latestSearch={searchElement}
                        onClose={closeSidebar}
                    />
                </div>
                <div className='flex-1 dark:bg-slate-800'>
                    {
                        loading ?
                        <LoadingScreen /> :
                        <Outlet />
                    }
                </div>
            </div>
        </div>
  )
}
