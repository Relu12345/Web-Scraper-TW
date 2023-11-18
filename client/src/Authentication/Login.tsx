import React from 'react'
import LoginImage from '../Images/LoginImage.svg'
const Login = () => {
    return (
        <div className='bg-gray-100 w-full'>
            <div className='flex mx-auto justify-center w-2/3 justify-center items-center h-screen'>
                <div className='hidden lg:block bg-blue-500 w-1/3 rounded-l-md p-2'>
                    <h1 className='text-white font-bold m-2 text-lg'>
                        <span className='text-black'>
                            Web 
                        </span>
                            Scraper
                    </h1>

                    <p className='text-white text-md mx-2 font-semibold mb-5'>
                        Welcome back! Log in to your account and continue your adeventure!
                    </p>

                    <div>
                        <img src={LoginImage} alt='Login Image' />
                    </div>
                </div>
                <div className='bg-white w-1/3 rounded-md  lg:rounded-r-md'>
                    <h1>hello</h1>
                </div>
            </div>
        </div>
    )
}

export default Login