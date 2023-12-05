import React, {useState} from 'react'
import './index.css'
import Login from './Authentication/Login'
import {Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { Register } from './Authentication/Register'
import { PrivateRoutes } from './utils/PrivateRoutes'


const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [isDark, setIsDark] = useState('light')

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  const handleDarkMode = () => {
    setDarkMode(!darkMode)

    if (darkMode === true) {
      localStorage.theme = 'light'
    } else {
      localStorage.theme = 'dark'
    }
  }

  return (
    <div className={`App ${darkMode && "dark"}`} >
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home handleTheme={handleDarkMode}/>} path='/' />
          </Route>
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
        </Routes>
    </div>  
  );
}

export default App
