import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PlanTrip from './Page/PlanTrip.jsx';
import Header from './components/custom/Header.jsx';
import ScrollToTop from './components/custom/ScrollToTop.jsx';
import ProtectedRoute from './components/custom/ProtectedRoute.jsx'; // Import the wrapper
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './Context/AuthContext.jsx';
import Trip from './Page/viewTrip/Trip.jsx';
import MyTrips from './Page/MyTrips.jsx';

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/plantrip',
        element: (
          <ProtectedRoute>
            <PlanTrip />
          </ProtectedRoute>
        ),
      },
      {
        path: '/trip/:tripid', // Keeping this public for sharing purposes
        element: <Trip />,
      },
      {
        path: '/MyTrips',
        element: (
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
);