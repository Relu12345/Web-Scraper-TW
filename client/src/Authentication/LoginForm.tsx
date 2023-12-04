import React, {useState} from 'react'
import { loginUser } from '../API/loginUser'
import { FaLock, FaEnvelope } from 'react-icons/fa'

const LoginForm : React.FC = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const response = await loginUser(email, password)

        if (response && response.ok)
            console.log(await response.text())

    }

    return (
        <form onSubmit={handleSubmit}>
            <label 
                htmlFor="email"
                className='text-lg font-medium font-mono'
            >
                Email
                <div className='block'>
                    <FaEnvelope className='text-xl absolute mt-2 ml-2 text-gray-400'/>
                    <input 
                        type="text" 
                        name="email"
                        required
                        autoComplete="off"
                        className='block border-gray-300 font-semibold text-sm w-full border-2 rounded-md my-2 py-2 pl-10'
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
                    <FaLock className='text-xl absolute mt-4 ml-2 text-gray-400'/>
                    <input 
                        type="password"
                        name="password"
                        required
                        className={`block font-semibold text-sm w-full border-2 border-gray-300 rounded-md my-2 py-2 pl-10 `}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
            </label>

            <button
                type='submit'
                className='w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-md py-2 my-4'
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