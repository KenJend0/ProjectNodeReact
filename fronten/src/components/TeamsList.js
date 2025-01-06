import React, { useEffect, useState } from 'react';
import teamService from '../services/teamService';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/TeamsList.css';

const TeamsList = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');

    const fetchTeams = async () => {
        try {
            const data = await teamService.getTeams();
            setTeams(data);
        } catch (err) {
            console.error('Error fetching teams:', err.message);
            setError('Failed to fetch teams.');
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const columns = [
        { headerName: 'Team Name', field: 'name', sortable: true, filter: true },
        { headerName: 'Coach ID', field: 'coach_id', sortable: true, filter: true },
    ];

    return (
        <div className="teams-list">
            <h2>Teams</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    rowData={teams}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
};

export default TeamsList;
