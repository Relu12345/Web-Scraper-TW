import React, {useState} from 'react'
import { loginUser } from '../API/loginUser'
import { FaLock, FaEnvelope } from 'react-icons/fa'
import { setTokenInCookies } from '../API/verifyToken'
import { useNavigate } from 'react-router'

interface Props {
    handleAuth: (value:boolean) => void
}

const LoginForm : React.FC<Props> = ({handleAuth}) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        const response = await loginUser(email, password)
        console.log("raspuns: ",response)

        if (response && response.ok) {
            // parse the result from string to JSON
            const data = JSON.parse(await response.text()) 
            if (data.result !== 'No result found') {
                try {
                    //setTokenInCookies(data.token)
                    console.log("daca rasp ok: ", data)
                   // handleAuth(true)
                } catch (error) {
                    setError("Failed to login to the server!")
                    console.error("Faild to send jwt token to the server", error)
                    handleAuth(false)
                }
            } else {
                setError("Invalid informations!")
                handleAuth(false)
                return
            }
        }
        else {
            setError("Failed to send information to the server!")
            return
        }

    }

    return (
        <form onSubmit={handleSubmit}>
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

            <button
                type='submit'
                className='w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-md py-2 my-4'
            >   
                Log In
            </button>
                
            {error && <span className='block mb-2 text-red-600 font-medium text-lg text-center'>{error}</span>}

            <div className='flex inline-flex items-center justify-center'>
                <h1 className='text-md font-medium mr-2'>Don't have an account yet?</h1>
                <span 
                    className='font-medium text-blue-500 cursor-pointer'
                    onClick={() => navigate("/register")}
                >
                    Sign up
                </span>
            </div>

            
        </form>
    )

}

export default LoginForm