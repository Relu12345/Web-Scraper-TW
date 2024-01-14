import React, {useState, useEffect} from 'react'
import { BsFillMoonStarsFill } from 'react-icons/bs'
import { getUserInfoFromToken } from '../API/verifyToken'
import { getFavoritesItems } from '../API/manageFavorites'


export const Favorites = () => {
  const user = getUserInfoFromToken()?.sub?.username

  useEffect(() => {
    handleFavorites()
  })

  const handleFavorites = async () => {
    if (!user)
      return

    const response = await getFavoritesItems(user)

    if (response.ok) {
      console.log(await response.text())
    }
    

  }

  return (
    <div className='h-screen text-xl dark:bg-slate-800 dark:text-white'>
      <div className='pt-24 flex'>
        <BsFillMoonStarsFill className='text-xl mt-1 dark:text-white'/>
        <h1 className='ml-2 font-bold'>Favorites</h1>
      </div>
    </div>
  )
}
