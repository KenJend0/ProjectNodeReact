import React, { useState, useEffect } from 'react';
import playersService from '../services/playersService';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import '../styles/PlayerStats.css';

// Initialisation du module d'accessibilité
if (typeof HighchartsAccessibility === 'function') {
    HighchartsAccessibility(Highcharts);
}

const PlayerStats = () => {
    const [stats, setStats] = useState({ goals: 0, matches: 0, position: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token not found');

                const playerId = JSON.parse(atob(token.split('.')[1])).id;
                const data = await playersService.getPlayerStats(playerId);

                if (data) {
                    setStats(data);
                } else {
                    setError('No statistics available.');
                }
            } catch (err) {
                console.error('Error fetching stats:', err.message);
                setError('Failed to fetch player stats.');
            }
        };

        fetchStats();
    }, []);

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Player Statistics',
        },
        xAxis: {
            categories: ['Goals', 'Matches'],
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count',
            },
        },
        series: [
            {
                name: 'Statistics',
                data: [stats.goals, stats.matches],
                color: '#007bff',
            },
        ],
        accessibility: {
            enabled: true,
        },
    };

    return (
        <div className="player-stats">
            <h2>My Stats</h2>
            {error && <p className="error-message">{error}</p>}
            <HighchartsReact highcharts={Highcharts} options={options} />
            <ul>
                <li><strong>Position:</strong> {stats.position || 'N/A'}</li>
            </ul>
        </div>
    );
};

export default PlayerStats;
