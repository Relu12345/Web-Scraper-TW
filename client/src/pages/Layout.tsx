import React, {useState} from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import LoadingScreen from '../utils/LoadingScreen'

interface Props {
    handleTheme: () => void
}

interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

export const Layout: React.FC<Props> = ({handleTheme}) => {
    const [loading, setLoading] = useState(false) 
    //sidebar toggle functionality
    const [isToggleStateSidebar, setToggleStateSidebar] = useState<boolean>(true)
    //gettin the search result from the navbar
    const [searchData, setSearchData] = useState<ResponseMessageText[]>([])
  
    const toggleStateSidebar = () => {
      setToggleStateSidebar(!isToggleStateSidebar)
    }
  

    const handleLoading = (value: boolean) =>{
      setLoading(value)
    }
  
    const callbackFunctions = {
      toggleSidebar: toggleStateSidebar,
      handleTheme: handleTheme,
      handleLoading: handleLoading
    }
    return (
        <div className='w-full'>
            <Navbar {...callbackFunctions} />
            <div className='flex dark:bg-slate-800 slow-change'>
                <div className={`${isToggleStateSidebar? ' w-min md:w-2/6 md:w-60' : 'w-min'} flex relative bg-white shadow-md dark:bg-gray-900 slow-change`}>
                    <Sidebar isVisible={isToggleStateSidebar} />
                </div>
                <div className='flex-1 ml-1 lg:ml-8 dark:bg-slate-800'>
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
