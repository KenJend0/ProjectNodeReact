import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teamService from '../services/teamService';
import AddCoach from '../components/AddCoach';
import Messages from '../components/Messages';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [error, setError] = useState('');
    const [selectedTab, setSelectedTab] = useState('teams');
    const [coach, setCoach] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await teamService.getTeams();
                setTeams(data);
            } catch (err) {
                console.error('Error fetching teams:', err.message);
                setError('Failed to load teams.');
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            const fetchCoach = async () => {
                try {
                    const coachData = await teamService.getCoach(selectedTeam);
                    setCoach(coachData);
                } catch (err) {
                    console.error('Error fetching coach:', err.message);
                    setCoach(null);
                }
            };

            fetchCoach();
        }
    }, [selectedTeam]);

    return (
        <div className="manager-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <h2>Manager Dashboard</h2>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            {/* Tabs Navigation */}
            <div className="tab-navigation">
                <button
                    onClick={() => setSelectedTab('teams')}
                    className={selectedTab === 'teams' ? 'active-tab' : ''}
                >
                    Teams
                </button>
                <button
                    onClick={() => setSelectedTab('messages')}
                    className={selectedTab === 'messages' ? 'active-tab' : ''}
                >
                    Messages
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Tab Content */}
            <div className="tab-content">
                {selectedTab === 'teams' && (
                    <div className="teams-management">
                        <h3>Manage Teams</h3>
                        {/* Team Selector */}
                        <div className="team-selector-container">
                            <label htmlFor="team-selector">Select a Team:</label>
                            <select
                                id="team-selector"
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                value={selectedTeam}
                                className="team-selector"
                            >
                                <option value="">-- Select a Team --</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Current Coach */}
                        {selectedTeam && (
                            <div className="current-coach">
                                <h4>Current Coach</h4>
                                {coach ? (
                                    <p>
                                        <strong>Name:</strong> {coach.name} <br />
                                        <strong>Email:</strong> {coach.email}
                                    </p>
                                ) : (
                                    <p>No coach assigned to this team.</p>
                                )}
                            </div>
                        )}

                        {/* Add Coach */}
                        {selectedTeam && <AddCoach teamId={selectedTeam} />}
                    </div>
                )}

                {selectedTab === 'messages' && (
                    <div className="messages-section">
                        <Messages userRole="manager" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
