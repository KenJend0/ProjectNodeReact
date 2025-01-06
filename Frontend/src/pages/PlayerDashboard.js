import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleCalendar from '../components/ScheduleCalendar';
import Messages from '../components/Messages';
import PlayerStats from '../components/PlayerStats';
import '../styles/PlayerDashboard.css';

const PlayerDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('schedule');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="player-dashboard">
            <header className="dashboard-header">
                <h1>Player Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            <div className="tab-navigation">
                <button
                    onClick={() => setSelectedTab('schedule')}
                    className={selectedTab === 'schedule' ? 'active-tab' : ''}
                >
                    Schedule
                </button>
                <button
                    onClick={() => setSelectedTab('messages')}
                    className={selectedTab === 'messages' ? 'active-tab' : ''}
                >
                    Messages
                </button>
                <button
                    onClick={() => setSelectedTab('stats')}
                    className={selectedTab === 'stats' ? 'active-tab' : ''}
                >
                    My Stats
                </button>
            </div>

            <div className="tab-content">
                {selectedTab === 'schedule' && <ScheduleCalendar isCoach={false}/>}
                {selectedTab === 'messages' && <Messages userRole="player" />}
                {selectedTab === 'stats' && <PlayerStats />}
            </div>
        </div>
    );
};

export default PlayerDashboard;
