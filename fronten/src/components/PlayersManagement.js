import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import playerService from '../services/playerService';
import {jwtDecode} from 'jwt-decode';

// Enregistrement des modules nécessaires
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const PlayersManagement = () => {
    const [rowData, setRowData] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: '', email: '', position: '' });
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const columnDefs = [
        { headerName: 'Name', field: 'name', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Position', field: 'position', sortable: true, filter: true },
        {
            headerName: 'Actions',
            field: 'id',
            cellRendererFramework: (params) => (
                <div>
                    <button
                        onClick={() => handleEditPlayer(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Update
                    </button>
                    <button onClick={() => handleDeletePlayer(params.value)}>Delete</button>
                </div>
            ),
        },
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,
    };

    const fetchPlayers = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const teamId = decodedToken.team_id;

            const response = await playerService.getPlayers(teamId);
            setRowData(response);
        } catch (err) {
            console.error('Error fetching players:', err.message);
            setError('Failed to fetch players.');
        }
    };

    const handleAddPlayer = async () => {
        if (!newPlayer.name || !newPlayer.email || !newPlayer.position) {
            setError('All fields are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const teamId = decodedToken.team_id;

            await playerService.createPlayer({ ...newPlayer, team_id: teamId });
            setSuccess('Player added successfully!');
            setNewPlayer({ name: '', email: '', position: '' });
            fetchPlayers();
        } catch (err) {
            console.error('Error adding player:', err.message);
            setError('Failed to add player.');
        }
    };

    const handleEditPlayer = (player) => {
        setEditingPlayer({ ...player });
    };

    const handleUpdatePlayer = async () => {
        if (!editingPlayer.name || !editingPlayer.email || !editingPlayer.position) {
            setError('All fields are required.');
            return;
        }

        try {
            await playerService.updatePlayer(editingPlayer.id, editingPlayer);
            setSuccess('Player updated successfully!');
            setEditingPlayer(null);
            fetchPlayers();
        } catch (err) {
            console.error('Error updating player:', err.message);
            setError('Failed to update player.');
        }
    };

    const handleDeletePlayer = async (playerId) => {
        try {
            await playerService.deletePlayer(playerId);
            setSuccess('Player deleted successfully!');
            fetchPlayers();
        } catch (err) {
            console.error('Error deleting player:', err.message);
            setError('Failed to delete player.');
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <div style={{ maxWidth: '80%', margin: 'auto' }}>
            <h3>Players Management</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* Formulaire pour ajouter un joueur */}
            <div style={{ marginBottom: 20 }}>
                <h4>Add New Player</h4>
                <input
                    type="text"
                    placeholder="Name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newPlayer.email}
                    onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                />
                <button onClick={handleAddPlayer}>Add Player</button>
            </div>

            {/* Formulaire pour modifier un joueur */}
            {editingPlayer && (
                <div style={{ marginBottom: 20 }}>
                    <h4>Edit Player</h4>
                    <input
                        type="text"
                        placeholder="Name"
                        value={editingPlayer.name}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editingPlayer.email}
                        onChange={(e) =>
                            setEditingPlayer({ ...editingPlayer, email: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Position"
                        value={editingPlayer.position}
                        onChange={(e) =>
                            setEditingPlayer({ ...editingPlayer, position: e.target.value })
                        }
                    />
                    <button onClick={handleUpdatePlayer} style={{ marginRight: '5px' }}>
                        Save
                    </button>
                    <button onClick={() => setEditingPlayer(null)}>Cancel</button>
                </div>
            )}

            {/* Tableau AG Grid */}
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>
    );
};

export default PlayersManagement;
