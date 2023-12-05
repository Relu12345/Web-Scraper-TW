import React, {useState} from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import Results from '../Components/Results'
import LoadingScreen from '../utils/LoadingScreen'

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string
}

interface Props {
  handleTheme: () => void
}

export const Home: React.FC<Props> = ({handleTheme}) => {

    //sidebar toggle functionality
    const [isToggleStateSidebar, setToggleStateSidebar] = useState<boolean>(true)
    //gettin the search result from the navbar
    const [searchData, setSearchData] = useState<ResponseMessageText[]>([])
    const [loading, setLoading] = useState<boolean>(false)
  
    const toggleStateSidebar = () => {
      setToggleStateSidebar(!isToggleStateSidebar)
    }
  
    const updateSearchData = (newData: ResponseMessageText[]): void => {
      setSearchData(newData)
    }

    const handleLoading = (value: boolean) =>{
      setLoading(value)
    }
  
    const callbackFunctions = {
      toggleSidebar: toggleStateSidebar,
      onUpdateData: updateSearchData,
      handleTheme: handleTheme,
      handleLoading: handleLoading
    }

    return (
      <div className='w-full'>
        {/* Pass the function to the navbar component in order to change the state of the sidebar*/}
        
        <Navbar {...callbackFunctions}/>
        <div className='flex dark:bg-slate-800 slow-change'>
          <div className={`${isToggleStateSidebar? ' w-min md:w-2/6 md:w-60' : 'w-min'} flex relative bg-white shadow-md dark:bg-gray-900 slow-change`}>
          <Sidebar isVisible={isToggleStateSidebar} />
          </div>
          <div className='flex-1 ml-1 lg:ml-8 dark:bg-slate-800'>
          { 
            loading? <LoadingScreen /> :           
            <Results searchedData={searchData} />
          }
          </div>
        </div>
      </div>
    )
}
