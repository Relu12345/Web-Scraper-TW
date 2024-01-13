import React from 'react'
import { 
  BsClockFill
} from "react-icons/bs"

export const History = () => {
  return (
    <div className='h-screen text-xl dark:bg-slate-800 dark:text-white'>
      <div className='flex pt-24'>
        <BsClockFill className='mt-1 dark:text-white'/>
        <h1 className='ml-2 font-bold'>History</h1>
      </div>
    </div>
  )
}
