import React from 'react';
import TeamsList from '../components/TeamsList';
import CreateTeam from '../components/CreateTeam';

const Dashboard = () => {
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <CreateTeam />
            <TeamsList />
        </div>
    );
};

export default Dashboard;
