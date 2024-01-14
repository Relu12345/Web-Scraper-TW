import React, {useState, useEffect, useRef} from 'react'
import Results from '../Components/Results'
import { FaHouseChimney, FaMagnifyingGlass } from "react-icons/fa6"
import Logo from '../Images/logo_transparent-1.svg'
import WhiteLogo from '../Images/white-logo.png'
import LoadingScreen from '../utils/LoadingScreen'
import { searchText } from '../API/searchText'
import { VscSettings } from "react-icons/vsc"
import { Filters } from '../Components/Filters'

interface Props {
  searchElement: (element: string) => void
  isResearched: string | null
}

interface ResponseMessage {
  message: string
  text: ResponseMessageText[]
}

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string,
  source: string
}

const currentAge = new Date().getFullYear()

export const Home: React.FC<Props> = ({searchElement, isResearched}) => {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [displayFilters, setDisplayFilters] = useState(false)
  const [searchData, setSearchData] = useState<ResponseMessageText[]>([])
  const inputToSend = useRef<HTMLInputElement | null>(null)
  const [itemsDisplayed, setItemsDisplayed] = useState(0)
  const [ageFilter, setAgeFilter] = useState({
    from: 1900,
    to: currentAge
  })

  useEffect(() => {
    if (isResearched) {
      setSearchInput(isResearched)
      handleSendData()
      setSearchInput('')
    }
  }, [isResearched, searchInput])

  const handleAgeFilter = (from: number, to: number) => {
    setAgeFilter({from, to})
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendData()
    }
  }

  const handleSendData = async () => {
    if (searchInput.length > 0) {
      setLoading(true)
      console.log(ageFilter)
      const result = await searchText({text:searchInput, date: {from: ageFilter.from, to: ageFilter.to}})
      
      if (result) {
        const data: ResponseMessage = await result.json()
        setSearchData(data.text)
        searchElement(searchInput)
        //searchElement(inputToSend.current?.value || '')
        setLoading(false)
      }
      
    }
  }

  const handleItemsDisplayed = (value: number) => {
    setItemsDisplayed(value)
  }

    return (
       loading ? 
        <LoadingScreen />
      :
      <div
        onClick={() => setDisplayFilters(false)} 
        className={`block overflow-y-auto h-screen mt-0 dark:bg-slate-800`}>
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
            <div className='fiexed items-center justify-center md:text-center mt-6'>
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
                    mx-auto w-8/12 lg:w-10/12  border-2 border-gray-400 bg-white py-2.5 
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

            <Results 
              searchedData={searchData} 
              onDisplay={handleItemsDisplayed}
            />

            {
              displayFilters &&
                <Filters 
                  open={displayFilters} 
                  onClose={() => setDisplayFilters(false)}
                  setAge={handleAgeFilter}
                />
            }
            
        </div>
    )
}
