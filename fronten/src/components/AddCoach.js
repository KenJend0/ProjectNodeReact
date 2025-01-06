import React, { useState } from 'react';
import axios from 'axios';

const AddCoach = ({ teamId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    const handleAddCoach = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!name || !email) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/api/coachs',
                { name, email, team_id: teamId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Response from backend:', response.data);
            setSuccess('Coach added successfully!');
            setTempPassword(response.data.temporaryPassword);
            setError('');
            setName('');
            setEmail('');
        } catch (err) {
            console.error('Error adding coach:', err.message);
            setError(err.response?.data?.error || 'Failed to add coach. Please try again.');
            setSuccess('');
            setTempPassword('');
        }
    };

    return (
        <div className="add-coach">
            <h3>Add a Coach</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {tempPassword && (
                <p className="temp-password">
                    Temporary Password: <strong>{tempPassword}</strong>
                </p>
            )}
            <form onSubmit={handleAddCoach} className="add-coach-form">
                <div className="form-group">
                    <label htmlFor="coach-name">Coach Name :</label>
                    <input
                        id="coach-name"
                        type="text"
                        placeholder="Enter coach's name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="coach-email">Coach Email :</label>
                    <input
                        id="coach-email"
                        type="email"
                        placeholder="Enter coach's email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Coach</button>
            </form>
        </div>
    );
};

export default AddCoach;
