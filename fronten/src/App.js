import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ManagerDashboard from './pages/ManagerDashboard';
import CoachDashboard from './pages/CoachDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import PrivateRoute from './components/PrivateRoute';
import { decodeToken, isAuthenticated } from './utils/auth';

const App = () => {
    const getDashboardRoute = () => {
        if (!isAuthenticated()) return '/login';

        const user = decodeToken();
        switch (user.role) {
            case 'manager':
                return '/manager-dashboard';
            case 'coach':
                return '/coach-dashboard';
            case 'player':
                return '/player-dashboard';
            default:
                return '/login';
        }
    };

    return (
        <Router>
            <Routes>
                {/* Route publique */}
                <Route path="/login" element={<LoginPage />} />

                {/* Routes privées */}
                <Route element={<PrivateRoute />}>
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/coach-dashboard" element={<CoachDashboard />} />
                    <Route path="/player-dashboard" element={<PlayerDashboard />} />
                </Route>

                {/* Redirection vers le tableau de bord correspondant */}
                <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
