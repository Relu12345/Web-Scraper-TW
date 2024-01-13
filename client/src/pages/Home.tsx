import React, {useState, useEffect, useRef} from 'react'
import Results from '../Components/Results'
import { FaHouseChimney, FaMagnifyingGlass } from "react-icons/fa6"
import { IoSettings } from "react-icons/io5"
import Logo from '../Images/logo_transparent-1.svg'
import WhiteLogo from '../Images/white-logo.png'
import LoadingScreen from '../utils/LoadingScreen'
import { searchText } from '../API/searchText'
import { VscSettings } from "react-icons/vsc"
import { Filters } from '../Components/Filters'

interface Props {
  searchElement: (element: string) => void
  sidebarState : boolean
}

interface ResponseMessage {
  message: string
  text: ResponseMessageText[]
}

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string
}



export const Home: React.FC<Props> = ({searchElement, sidebarState}) => {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [displayFilters, setDisplayFilters] = useState(false)
  const [searchData, setSearchData] = useState<ResponseMessageText[]>([])
  const inputToSend = useRef<HTMLInputElement | null>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
     //console.log('Enter key pressed')
      handleSendData()
    }
  }

  const handleSendData = async () => {

    if (searchInput.length > 0) {
      setLoading(true)
      searchElement(inputToSend.current?.value || '')
      console.log('Sending data ', searchInput)
      searchElement(searchInput)
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
      <div
        onClick={() => setDisplayFilters(false)} 
        className='block h-screen'>
            <div className='flex text-xl pt-24 font-bold dark:text-white'>
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
            <div className='fiexed  items-center justify-center md:text-center mt-6'>
              <div className='relative w-full'>
                <input 
                  type="text"
                  id="text"
                  placeholder='Search for your favorite scientific paper...'
                  autoComplete='off'
                  value={searchInput}
                  onKeyDown={handleKeyDown}
                  ref={inputToSend}
                  onChange={(event) => {setSearchInput(event.target.value)}}
                  className={`
                    ${sidebarState ? 'w-1/2 lg:w-1/2 xl:w-7/12 2xl:w-10/12 ml-0 lg:ml-24 2xl:ml-0' : 'w-1/2 lg:w-10/12'}  border-2 border-gray-400 bg-white py-2.5 
                    rounded-md px-2 focus:outline-none focus:border-black 
                    dark:bg-slate-900 dark:border-gray-400 
                    focus:dark:border-gray-200 dark:placeholder-gray-400 
                    dark:text-white slow-change
                  `}
                />
                <button 
                  onClick={(e) =>{ e.stopPropagation(); setDisplayFilters(!displayFilters)}}
                  data-testid="toggle-button"
                  className='relative mx-2 text-xl text-white p-3.5 top-1 rounded-md bg-gray-600 dark:bg-slate-600 '>
                  <VscSettings />
                </button>

                <button 
                  onClick={handleSendData}
                  className='w-1/12 h-full py-4  bg-blue-600 dark:bg-blue-700 rounded-md'
                >
                  <FaMagnifyingGlass className='flex mx-auto text-white ' />
                </button>
              </div>
              
            </div>

            <Results searchedData={searchData} />

            {
              displayFilters &&
                <Filters 
                  open={displayFilters} 
                  onClose={() => setDisplayFilters(false)}
                />
            }
            
        </div>
    )
}
