import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Login from './Page/Login.jsx';
import Signup from './Page/Signup.jsx';
import PlanTrip from './Page/PlanTrip.jsx';
import Header from './components/custom/Header.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'sonner';

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
      element: (
        <>
          <Header />
          <Signup />
        </>
      )
    },
    {
      path: '/plantrip',
      element: (
        <>
          <Header />
          <PlanTrip />
        </>
      )
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router}>
      <Header />
    </RouterProvider>
  </StrictMode>
);
