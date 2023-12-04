import React, {useState, useEffect} from 'react'
import { RegisterForm } from './RegisterForm'
import RegisterImage from '../Images/RegisterImage.svg'
import { isUserAuth } from '../API/verifyToken'
import { useNavigate } from 'react-router'

export const Register = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const redirect = () => {
        setIsAuth(isUserAuth())

        if (isAuth)
            navigate("/")
    }

    redirect()
})

const handlePageDisplay = (value: boolean) => {
    //setIsAuth(value)
}

  return (
    <div className='bg-gray-100 w-full flex items-center justify-center h-screen'>
           <div className='flex w-2/3 bg-gray-50  rounded-lg shadow-lg'>            
           <img 
                    src={RegisterImage} 
                    alt="Login Page Image"
                    className='hidden xl:block w-3/6'
                />

                <div className='w-full xl:w-3/4 rounded-md m-14'>
                    <h1 className='text-center font-medium font-sans text-xl mb-4'>Log In</h1>
                    <RegisterForm handleAuth={handlePageDisplay}/>   
                </div>
            </div>
        </div>
  )
}
