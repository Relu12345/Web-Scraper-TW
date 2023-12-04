import React, {useState} from 'react'
import { loginUser } from '../API/loginUser'

const LoginForm : React.FC = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const response = await loginUser(email, password)

        if (response && response.ok)
            console.log(response.text())

    }

    return (
        <form action="submit">
            <div className='px-5'>
                <label 
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-500 mb-1'
                >
                    Email
                </label>
                <input 
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    placeholder='email@example.com'
                    className='appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
            </div>

            <div className='px-5 py-5'>
                <label 
                    htmlFor='password'
                    className='text-sm font-medium text-gray-500 mb-1'
                >
                    Password
                </label>
                <input 
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='currentPassword'
                    required
                    placeholder='example'
                    className='appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
            </div>

            <button
                type='submit'
                className='text-white font-semibold w-5/6 mx-5 my-2 py-2 rounded-md bg-blue-500 hover:bg-blue-800'
            >   
                Log In
            </button>

            <div className='flex inline-flex items-center justify-center'>
                <h1 className='text-md font-medium  mr-3'>Don't have an account yet?</h1>
                <a href="#">Sign up</a>
            </div>

            
        </form>
    )

}

export default LoginForm