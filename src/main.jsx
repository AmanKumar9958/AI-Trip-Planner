import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Page/Login.jsx'
import Signup from './Page/Signup.jsx'
import Header from './components/custom/Header.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import path from 'path';

const router=createBrowserRouter(
  [
    {
      path: '/',
      element: <App/>
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    }
  ]
)

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Header />
    <RouterProvider router={router} />
  </StrictMode>
)
