import React, {useState, useEffect} from 'react'
import LoginImage from '../Images/LoginImage.svg'
import LoginForm from './LoginForm'
import { useNavigate } from 'react-router'
import { isUserAuth } from '../API/verifyToken'

const Login = () => {
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
        setIsAuth(value)
    }
    return (
        <div className='bg-gray-100 w-full flex items-center justify-center h-screen'>
           <div className='flex w-2/3 bg-gray-50  rounded-lg shadow-lg'>            
           <img 
                    src={LoginImage} 
                    alt="Login Page Image"
                    className='hidden xl:block w-3/6'
                />

                <div className='w-full xl:w-3/4 rounded-md m-14'>
                    <h1 className='text-center font-medium font-sans text-xl mb-4'>Log In</h1>
                    <LoginForm handleAuth={handlePageDisplay}/>   
                </div>
            </div>
        </div>
    )
}

export default Login