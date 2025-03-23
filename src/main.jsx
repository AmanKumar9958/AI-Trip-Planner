import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PlanTrip from './Page/PlanTrip.jsx';
import Header from './components/custom/Header.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './Context/AuthContext.jsx';
import AllTrips from './Page/AllTrips.jsx';
import ViewTrip from './Page/viewTrip/ViewTrip.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <App />
      </>
    ),
  },
  {
    path: '/plantrip',
    element: (
      <>
        <Header />
        <PlanTrip />
      </>
    ),
  },
  {
    path: '/viewtrip/:tripid',
    element: (
      <>
        <Header />
        <ViewTrip />  
      </>
    ),
  },
  {
    path: '/AllTrips',
    element: (
      <>
        <Header />
        <AllTrips />
      </>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);