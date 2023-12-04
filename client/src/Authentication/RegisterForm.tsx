import React, {useState} from 'react'
import { registerUser } from '../API/registerUser';
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";

export const RegisterForm = () => {
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        const response = await registerUser(username, email, password)

        if (response && response.ok) {
            console.log("User registration successful")
        }
        else
            console.log("User registration failed")

    }

  return (
    <form onSubmit={handleSubmit}>
        <label 
            className='text-lg font-medium font-sans'
            htmlFor="username"
        >
            Username
            <div>
                <FaUserAlt 
                    className='absolute'
                />
                <input 
                    type='text'
                    required
                    autoComplete='off'
                    name='username'
                    className='my-4 rounded-md border border-gray-600 w-full'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
        </label>

        <label 
            className='text-lg font-medium font-sans'
            htmlFor="email"
        >
            Email
            <div>
                <FaEnvelope 
                    className='absolute'
                />
                <input 
                    type='email'
                    required
                    name='email'
                    autoComplete='off'
                    className='my-4 rounded-md border border-gray-600 w-full'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        </label>

        <label 
            className='text-lg font-medium font-sans'
            htmlFor="password"
        >
            Password
            <div>
                <FaLock 
                    className='absolute'
                />
                <input 
                    type='password'
                    required
                    name='password'
                    className='my-4 rounded-md border border-gray-600 w-full'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </label>

        <button className='w-full bg-gray-600 text-lg text-white font-medium rounded-md'>
            Register
        </button>
    </form>
  )
}
