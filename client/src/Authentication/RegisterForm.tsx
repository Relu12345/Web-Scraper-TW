import React, {useState} from 'react'
import { registerUser } from '../API/registerUser';
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa"
import { useNavigate } from 'react-router'
import { setTokenInCookies } from '../API/verifyToken';

interface Props {
    handleAuth: (value: boolean) => void
}

export const RegisterForm: React.FC<Props> = ({handleAuth}) => {
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        setError(null)
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        try {
            const response = await registerUser(username, email, password)

            if (response && response.ok) {
                const data = JSON.parse(await response.text())
                console.log(data.error)
                if (data.error === 'Username already exists') {
                    setError("Username already exists")
                    return
                } else if (data.error === 'Email already exists') {
                    setError("Email already exists")
                    return
                } else {
                    setTokenInCookies(data.token)
                    handleAuth(true)
                }
            }
            else {
                setError("User registration failed")
                console.log("User registration failed")
                return
            }
        } catch (error) {
            setError("Server error: " + error)
            console.error("Failed at sending user registration to the server", error)
            return
        }

    }

  return (
    <form onSubmit={handleSubmit}>
             <label 
                htmlFor="username"
                className='text-lg font-medium font-mono'
            >
                Username
                <div className='block'>
                    <FaUserAlt className='text-xl absolute mt-2 ml-2 text-gray-400 dark:text-gray-600'/>
                    <input 
                        type="text" 
                        name="username"
                        required
                        autoComplete="off"
                        className='block border-gray-300 font-semibold text-sm w-full border-2 rounded-md my-2 py-2 pl-10 dark:text-black'
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
            </label>

            <label 
                htmlFor="email"
                className='text-lg font-medium font-mono'
            >
                Email
                <div className='block'>
                    <FaEnvelope className='text-xl absolute mt-2 ml-2 text-gray-400 dark:text-gray-600'/>
                    <input 
                        type="email" 
                        name="email"
                        required
                        autoComplete="off"
                        className='block border-gray-300 font-semibold text-sm w-full border-2 rounded-md my-2 py-2 pl-10 dark:text-black'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
            </label>

            <label 
                htmlFor="password"
                className='text-lg font-medium font-mono'
                >
                Password
                <div className='flex'>
                    <FaLock className='text-xl absolute mt-4 ml-2 text-gray-400 dark:text-gray-600'/>
                    <input 
                        type="password"
                        name="password"
                        required
                        className={`block font-semibold text-sm w-full border-2 border-gray-300 rounded-md my-2 py-2 pl-10 dark:text-black`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
            </label>

            <label 
                htmlFor="confirm_password"
                className='text-lg font-medium font-mono'
                >
                Confirm Password
                <div className='flex'>
                    <FaLock className='text-xl absolute mt-4 ml-2 text-gray-400 dark:text-gray-600'/>
                    <input 
                        type="password"
                        name="confirm_password"
                        required
                        className={`block font-semibold text-sm w-full border-2 border-gray-300 rounded-md my-2 py-2 pl-10 dark:text-black`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
            </label>

            <button
                type='submit'
                className='w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-md py-2 my-4'
            >   
                Create Account
            </button>
            
            {error && <span className='block mb-2 text-red-600 font-medium text-lg text-center'>{error}</span>}

            <div className='flex inline-flex items-center justify-center'>
                <h1 className='text-md font-medium mr-2'>Already a user?</h1>
                <span 
                    className='font-medium text-blue-500 cursor-pointer'
                    onClick={() => navigate("/login")}
                >
                    Sign in
                </span>
            </div>

            
        </form>

  )
}
