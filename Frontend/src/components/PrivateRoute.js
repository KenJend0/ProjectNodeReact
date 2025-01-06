import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    const isTokenValid = () => {
        if (!token) return false;

        try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return exp > now; // Vérifie si le token n'est pas expiré
        } catch (err) {
            console.error('Invalid token:', err.message);
            return false;
        }
    };

    return isTokenValid() ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
};

export default PrivateRoute;
