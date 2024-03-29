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
        <div className='bg-gray-100 w-full flex flex-col items-center justify-center h-screen dark:bg-gray-800 slow-change'>
            <div className='flex w-2/3 bg-gray-50 rounded-lg shadow-lg dark:bg-slate-800 slow-change'>
                <img
                    src={LoginImage}
                    alt="Login Page"
                    className='hidden xl:block w-2/6'
                />

                <div className='w-5/6 xl:w-2/4 rounded-md mx-auto xl:mt-20 mb-14 dark:text-white'>
                    <h1 className='text-center font-medium font-sans text-xl mb-4'>Log In</h1>
                    <LoginForm handleAuth={handlePageDisplay}/>
                </div>
            </div>
        </div>
    )
}

export default Login