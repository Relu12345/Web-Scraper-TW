import React from 'react'
import LoginImage from '../Images/LoginImage.svg'
import LoginForm from './LoginForm'
const Login = () => {
    return (
        <div className='bg-gray-100 w-full'>
            <div className='flex mx-auto justify-center w-3/4 justify-center items-center h-screen'>
                <div className='hidden lg:block bg-blue-500 w-2/4  rounded-l-lg p-2'>
                    <h1 className='text-white font-bold m-2  text-lg'>
                        <span className='text-black'>
                            Web 
                        </span>
                            Scraper
                    </h1>


                    <div>
                        <img src={LoginImage} alt='Login Image' className='mt-5'/>
                    </div>
                </div>
                <div className='bg-white w-2/4 rounded-md  lg:rounded-r-md py-24'>
                    <h1 className='text-lg lg:text-2xl font-bold text-center text-blue-800 p-4'>Log In</h1>

                    <p className='text-black text-center text-md mx-2 font-semibold mb-5'>
                        Welcome back! Log in to your account and continue your adeventure!
                    </p>

                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login