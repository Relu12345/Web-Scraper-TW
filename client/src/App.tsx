import React, {useState} from 'react';
import './index.css'
import Login from './Authentication/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { Register } from './Authentication/Register'
import { PrivateRoutes } from './utils/PrivateRoutes';

const App = () => {
  return (
    <div className='App'>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path='/' />
          </Route>
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
        </Routes>
    </div>  
  );
}

export default App
