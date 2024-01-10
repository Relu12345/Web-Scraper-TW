import React from 'react'
import { BsFillMoonStarsFill } from 'react-icons/bs'
export const Favorites = () => {
  return (
    <div className='h-screen text-xl dark:bg-slate-800 dark:text-white'>
      <div className='mt-4 flex'>
        <BsFillMoonStarsFill className='text-xl mt-1 dark:text-white'/>
        <h1 className='ml-2 font-bold'>Favorites</h1>
      </div>
    </div>
  )
}
