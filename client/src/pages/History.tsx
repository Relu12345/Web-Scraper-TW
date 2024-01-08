import React from 'react'
import { 
  BsClockFill
} from "react-icons/bs"

export const History = () => {
  return (
    <div className='h-screen text-lg dark:bg-slate-800 dark:text-white'>
      <div className='mt-4 flex'>
        <BsClockFill className='text-xl mt-1 dark:text-white'/>
        <h1 className='ml-2 text-lg font-bold'>History</h1>
      </div>
    </div>
  )
}
