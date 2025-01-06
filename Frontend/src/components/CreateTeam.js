import React, { useState } from 'react';
import teamService from '../services/teamService';

const CreateTeam = () => {
    const [teamName, setTeamName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (teamName.trim().length < 3) {
            setError('Team name must be at least 3 characters long.');
            setMessage('');
            return;
        }

        try {
            const response = await teamService.createTeam({ name: teamName });
            setMessage(`Team "${response.data.name}" created successfully!`);
            setError('');
            setTeamName('');
        } catch (err) {
            console.error('Error creating team:', err.message);
            setError('Failed to create team. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="create-team">
            <h2>Create a New Team</h2>
            <form onSubmit={handleSubmit} className="create-team-form">
                <div className="form-group">
                    <label htmlFor="team-name">Team Name:</label>
                    <input
                        id="team-name"
                        type="text"
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create Team</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateTeam;
