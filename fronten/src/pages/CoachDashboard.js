import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayersManagement from '../components/PlayersManagement';
import ScheduleCalendar from '../components/ScheduleCalendar';
import Messages from '../components/Messages';
import '../styles/CoachDashboard.css';

const CoachDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('players');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('team_id');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="coach-dashboard">
            <header className="dashboard-header">
                <h1>Coach Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            <div className="tab-navigation">
                <button
                    onClick={() => setSelectedTab('players')}
                    className={selectedTab === 'players' ? 'active-tab' : ''}
                >
                    Players
                </button>
                <button
                    onClick={() => setSelectedTab('schedules')}
                    className={selectedTab === 'schedules' ? 'active-tab' : ''}
                >
                    Schedules
                </button>
                <button
                    onClick={() => setSelectedTab('messages')}
                    className={selectedTab === 'messages' ? 'active-tab' : ''}
                >
                    Messages
                </button>
            </div>

            <div className="tab-content">
                {selectedTab === 'players' && <PlayersManagement />}
                {selectedTab === 'schedules' && <ScheduleCalendar isCoach={true}/>}
                {selectedTab === 'messages' && <Messages userRole="coach" />}
            </div>
        </div>
    );
};

export default CoachDashboard;
