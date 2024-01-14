import React, {useState, useRef, useEffect} from 'react'
import './index.css'
import Login from './Authentication/Login'
import {Routes, Route} from 'react-router-dom'
import { Layout } from './pages/Layout'
import { Register } from './Authentication/Register'
import { PrivateRoutes } from './utils/PrivateRoutes'
import { History } from './pages/History'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'
import toast, {Toaster} from 'react-hot-toast'

interface ResponseMessageText {
  authors: Array<string>,
  title: string,
  url: string
}


const App  = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchedElement, setSearchedElement] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [research, setResearch] = useState<string | null>(null)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  const handleSidebarStatus = (value: boolean) => {
    setIsSidebarOpen(value)
  }

  const handleDarkMode = () => {
    setDarkMode(!darkMode)

    if (darkMode === true) {
      localStorage.theme = 'light'
    } else {
      localStorage.theme = 'dark'
    }
  }

  const modifySearchElement = (element: string) => {
    setSearchedElement(element)
  } 

  const handleSidebarResearch = (value: string | null) => {
    setResearch(value)
  }

  const notifySuccess = () => {
    toast('Item removed successfuly!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#22c55e',
          color: '#fff'
        }
    })  
  }

  const notifyError = () => {
    toast('Item removed successfuly!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#dc2626',
          color: '#fff'
        }
    })  
  }


  const handleConfirmationDialog = (value: boolean) =>  {
    setIsConfirmationDialogOpen(value)
    if (value === true)
      notifySuccess()
    else
      notifyError()
}

  return (
    <div className={`App ${darkMode && "dark"}`} >
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Layout 
                handleTheme={handleDarkMode} 
                searchElement={searchedElement}
                handleSidebarState={handleSidebarStatus}
                handleSidebarResearch={handleSidebarResearch}
                handleConfirmationDialog={handleConfirmationDialog}
            />} path='/' >
              <Route element={<Home 
                searchElement={modifySearchElement} 
                isResearched={research}
              /> } path='' />
              <Route element={<History 
                handleConfirmationDialog={handleConfirmationDialog}
                handleResearch={handleSidebarResearch}
              />
              } path="history" />
              <Route element={<Favorites />} path="favorites" />
            </Route>
            
          </Route>
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
        </Routes>
        <Toaster />
    </div>  
  )
}

export default App
