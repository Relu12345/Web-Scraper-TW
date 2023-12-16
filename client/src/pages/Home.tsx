import React, {useState} from 'react'
import Results from '../Components/Results'
import { FaHouseChimney, FaMagnifyingGlass } from "react-icons/fa6"
import Logo from '../Images/logo_transparent-1.svg'
import WhiteLogo from '../Images/white-logo.png'
import LoadingScreen from '../utils/LoadingScreen'
import { searchText } from '../API/searchText'

interface ResponseMessage {
  message: string
  text: ResponseMessageText[]
}

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string
}



export const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState<ResponseMessageText[]>([])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed')
      handleSendData()
    }
  }

  const handleSendData = async () => {
    if (searchInput.length > 0) {
      setLoading(true)
      console.log('Sending data ', searchInput)
      const result = await searchText(searchInput)

      if (result) {
        const data: ResponseMessage = await result.json()
        setSearchData(data.text)
        setLoading(false)
      }
    }
  }
  
    return (
       loading ? 
        <LoadingScreen />
      :
      <div className='block mt-4'>
            <div className='flex text-xl font-bold dark:text-white'>
              <FaHouseChimney className='mt-1'/>
              <h1 className='mx-2'>Home</h1>
            </div>

            
            {searchData.length === 0 &&
            <div>
              {
                localStorage.theme === 'dark' ?
                <img src={WhiteLogo} className='flex w-1/3 2xl:w-1/4 items-center justify-center mx-auto' alt="White logo" /> :
                <img src={Logo} className='flex w-1/3 2xl:w-1/4 items-center justify-center mx-auto' alt="Logo" /> 
              }
              
              <h1 className='w-1/2 text-sm lg:text-lg mx-auto text-center font-semibold dark:text-white'>Revolutionize Your Research Journey: FetchFlow - Empowering Minds, Unveiling Potential</h1>
            </div> 
              
            }
            {/* Search bar */}
            <div className='flex mx-auto items-center justify-center text-center mt-6 relative'>
              <input 
                type="text"
                id="text"
                placeholder='Search for your favorite scientific paper...'
                autoComplete='off'
                value={searchInput}
                onKeyDown={handleKeyDown}
                onChange={(event) => setSearchInput(event.target.value)}
                className='w-10/12 border-2 border-gray-600 bg-white py-2.5 rounded-md px-2 focus:outline-none focus:border-gray-800 dark:bg-slate-900 dark:border-gray-400 focus:dark:border-gray-200 dark:placeholder-gray-400 dark:text-white slow-change'
              />
              <button 
                onClick={handleSendData}
                className='w-1/12 top-0 end-0 h-full py-4 bg-blue-600 dark:bg-blue-700 rounded-md mx-1'
              >
                <FaMagnifyingGlass className='flex mx-auto text-white ' />
              </button>
            </div>

            <Results searchedData={searchData} />
        </div>
    )
}
