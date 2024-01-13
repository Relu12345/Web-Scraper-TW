import React, {useState} from 'react'
import { getUserInfoFromToken } from "../API/verifyToken"

interface Props {
    handleLogout: () => void
}


export const Profile :React.FC<Props> = ({handleLogout}) => {
    const result = getUserInfoFromToken()?.sub  
    const email = (result as any).email
    const user = (result as any).username
    
    const halfLength = Math.floor(user.length / 2);

    const firstHalf = user.slice(0, halfLength); 
    const secondHalf = user.slice(halfLength);

    const splitUser = [firstHalf, secondHalf];
    const iconUser = splitUser[0][0].toUpperCase() + splitUser[1][0].toUpperCase()

    const [isOpen, setIsOpen] = useState(false)
    
  return (
    <div className="relative inline-block">
        <span
            onClick={() => setIsOpen(!isOpen) } 
            className="bg-blue-400 px-2.5 py-2 font-bold text-blue-800 rounded-full border border-gray-500 mt-2 cursor-pointer dark:text-indigo-900"
        >
            {iconUser}
        </span>

        {isOpen && (
        <div className="absolute right-0 mt-4 p-2 w-48 bg-white border rounded-md shadow-lg z-10 shadow-lg dark:bg-slate-700 dark:text-white dark:border-slate-700">
            {/* Dropdown content goes here */}
            <div className='p-2 font-medium text-sm hover:bg-blue-400 hover:text-white hover:rounded-md hover:dark:bg-blue-600'>{user}</div>
            <div className='p-2 font-medium text-sm hover:bg-blue-400 hover:text-white hover:rounded-md hover:dark:bg-blue-600'>{email}</div>
            <hr className='my-2 border-1 border-gray-900 dark:border-white'/>
            <div
                onClick={handleLogout} 
                className='cursor-pointer p-2 font-medium text-sm hover:bg-blue-400 hover:text-white hover:rounded-md hover:dark:bg-blue-600'
            >
                Sign out
            </div>
        </div>
      )}
    </div>
  )
}
