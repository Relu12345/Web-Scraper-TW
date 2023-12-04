import React, {useState} from 'react';
import './index.css'
import Sidebar from './Components/Sidebar'
import Login from './Authentication/Login'
import Navbar from './Components/Navbar'
import Results from './Components/Results'

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string
}

const ss = [
  {
    authors: ['A1', 'A2', 'A3'],
    title: 'Title 1',
    url: 'asdfdasfsfsfdas'
  },
  {
    authors: ['A4', 'A5', 'A6'],
    title: 'Title 2',
    url: "asfdasdfdsafdasfsadfdsa"
  }
]

const App = () => {

  //sidebar toggle functionality
  const [isToggleStateSidebar, setToggleStateSidebar] = useState<boolean>(true)
  //gettin the search result from the navbar
  const [searchData, setSearchData] = useState<ResponseMessageText[]>([])

  const toggleStateSidebar = () => {
    setToggleStateSidebar(!isToggleStateSidebar)
  }

  const updateSearchData = (newData: ResponseMessageText[]): void => {
    setSearchData(newData)
  }

  const callbackFunctions = {
    toggleSidebar: toggleStateSidebar,
    onUpdateData: updateSearchData
  }

  return (
    <div className="flex flex-col">
      {/* Pass the function to the navbar component in order to change the state of the sidebar*/}
      <Navbar {...callbackFunctions}/>
      <div className='flex'>
        <div className={`${isToggleStateSidebar? ' w-min md:w-2/6 md:w-60' : 'w-min'} h-screen relative bg-white shadow-md `}>
        <Sidebar isVisible={isToggleStateSidebar} />
        </div>
        <div className='flex-1 ml-8'>
        <Results searchedData={searchData}/>
        </div>
      </div>
      
    </div>
  );
}

export default App
