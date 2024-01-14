import React, {useEffect, useState} from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import LoadingScreen from '../utils/LoadingScreen'

interface Props {
    handleTheme: () => void
    searchElement: string | null
    handleSidebarState : (value: boolean) => void
    handleSidebarResearch: (value: string | null) => void
}

export const Layout: React.FC<Props> = ({handleTheme, searchElement, handleSidebarState, handleSidebarResearch}) => {
    const [loading, setLoading] = useState(false) 
    //sidebar toggle functionality
    const [isToggleStateSidebar, setIsToggleStateSidebar] = useState<boolean>(false)
    //Close profile description 
    const [isToggleProfile, setIsToggleProfile] = useState(false)

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


    const handleSidebarToggle = (value: boolean) => {
        setIsToggleStateSidebar(value)
    }
  
    const callbackFunctions = {
      toggleSidebar: toggleStateSidebar,
      handleTheme: handleTheme,
      handleLoading: handleLoading,
      displayProfile: isToggleProfile,
      handleProfileToggle: handleProfileToggle
    }

    return (
        <div 
            onClick={() => handleProfileToggle(false)}
            className='w-full h-full bg-gray-50 dark:bg-slate-800'
        >
            <Navbar {...callbackFunctions} />
            <div 
                className='h-full bg-gray-50 dark:bg-slate-800'
            >                
                <div className={`
                        ${isToggleStateSidebar ? 
                        "fixed top-0 h-full w-2/4  md:w-2/5 lg:w-1/4 bg-white shadow-md dark:bg-gray-900 slow-change z-50 opacity-100" : 'opacity-0'} 
                        transition-all duration-300`
                    }
                >
                    <Sidebar 
                        isVisible={isToggleStateSidebar} 
                        latestSearch={searchElement}
                        onClose={closeSidebar}
                        handleSidebarResearch={handleSidebarResearch}
                    />
                </div>
                <div 
                    onClick={() => handleSidebarToggle(false)}
                    className={`mx-6  bg-gray-50 dark:bg-slate-800`}
                >
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
