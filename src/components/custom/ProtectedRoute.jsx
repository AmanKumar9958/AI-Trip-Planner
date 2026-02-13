import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Optional: Show a toast to explain why they were redirected
        // Since we are rendering Navigate immediately, we might want to do this in useEffect or just let them be redirected.
        // But render phase side effects are bad.
        // Let's just redirect.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
