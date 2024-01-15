import React, {useState, useEffect} from 'react'
import { BsFillMoonStarsFill } from 'react-icons/bs'
import { getUserInfoFromToken } from '../API/verifyToken'
import { getFavoritesItems } from '../API/manageFavorites'
import Results from '../Components/Results'
import LoadingScreen from '../utils/LoadingScreen'

interface MessageText {
  title: string,
  source: string[],
  authors: string[],
  url: string
}

export const Favorites = () => {
  const user = getUserInfoFromToken()?.sub?.username
  const [firstFetch, setFirstFetch] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [favoritesList, setFavoritesList] = useState<MessageText[]>([])

  useEffect(() => {
    if (firstFetch) {
      handleFavorites()
      setFirstFetch(false)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [favoritesList])

  const handleFavorites = async () => {
    if (!user)
      return

    const response = await getFavoritesItems(user)

    if (response) {
      setFavoritesList(await response.favourites)
    }
  }

  return (
    isLoading ? <LoadingScreen /> :
    <div className='h-screen text-xl dark:bg-slate-800 dark:text-white overflow-y-auto'>
      <div className='pt-24 block '>
        <div className='flex'>
          <BsFillMoonStarsFill className='text-xl mt-1 dark:text-white'/>
          <h1 className='ml-2 font-bold'>Favorites</h1>
        </div>

        <div className='mx-auto my-6'>
          <Results 
            searchedData={favoritesList}
          />
        </div>
      </div>
    </div>
  )
}
