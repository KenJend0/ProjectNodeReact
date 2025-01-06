import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import scheduleService from '../services/scheduleService';
import { jwtDecode } from 'jwt-decode'; // Fixé: import direct
import '../styles/ScheduleCalendar.css';

const ScheduleCalendar = ({ isCoach = false }) => {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [newSchedule, setNewSchedule] = useState({
        event_type: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    const clearMessages = () => {
        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
    };

    const fetchSchedules = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            const decodedToken = jwtDecode(token);
            const teamId = decodedToken.team_id;

            const schedulesData = await scheduleService.getSchedules(teamId);
            console.log('Données des événements :', schedulesData);

            if (Array.isArray(schedulesData)) {
                const formattedEvents = schedulesData.map((schedule) => ({
                    id: schedule.id,
                    title: `${schedule.event_type}: ${schedule.description}`,
                    start: new Date(`${schedule.event_date.slice(0, 10)}T${schedule.start_time}`),
                    end: new Date(`${schedule.event_date.slice(0, 10)}T${schedule.end_time}`),
                    location: schedule.location,
                }));
                setEvents(formattedEvents);
                console.log('Événements formatés pour le calendrier :', formattedEvents);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des événements :', err.message);
            setError('Impossible de charger les événements.');
            clearMessages();
        }
    }, []);

    const handleAddSchedule = async () => {
        if (!newSchedule.event_type || !newSchedule.event_date || !newSchedule.start_time || !newSchedule.end_time || !newSchedule.location) {
            setError('Tous les champs sont requis.');
            clearMessages();
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const teamId = decodedToken.team_id;

            await scheduleService.addSchedule({ ...newSchedule, team_id: teamId });
            setSuccess('Événement ajouté avec succès !');
            setNewSchedule({
                event_type: '',
                event_date: '',
                start_time: '',
                end_time: '',
                location: '',
                description: '',
            });
            fetchSchedules();
            clearMessages();
        } catch (err) {
            console.error('Erreur lors de l’ajout de l’événement :', err.message);
            setError('Impossible d’ajouter l’événement.');
            clearMessages();
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    return (
        <div className="schedule-calendar">
            <h3>Calendrier des événements</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, marginBottom: 20 }}
                views={['month', 'week', 'day', 'agenda']}
                view={currentView}
                date={currentDate}
                onView={(view) => setCurrentView(view)}
                onNavigate={(date) => setCurrentDate(date)}
            />

            {/* Formulaire pour ajouter un événement, visible uniquement pour les coachs */}
            {isCoach && (
                <div>
                    <h4>Ajouter un événement</h4>
                    <form className="schedule-form">
                        <label htmlFor="event-type">Type d'événement :</label>
                        <input
                            id="event-type"
                            type="text"
                            value={newSchedule.event_type}
                            onChange={(e) => setNewSchedule({ ...newSchedule, event_type: e.target.value })}
                            required
                        />
                        <label htmlFor="event-date">Date de l'événement :</label>
                        <input
                            id="event-date"
                            type="date"
                            value={newSchedule.event_date}
                            onChange={(e) => setNewSchedule({ ...newSchedule, event_date: e.target.value })}
                            required
                        />
                        <label htmlFor="start-time">Heure de début :</label>
                        <input
                            id="start-time"
                            type="time"
                            value={newSchedule.start_time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                            required
                        />
                        <label htmlFor="end-time">Heure de fin :</label>
                        <input
                            id="end-time"
                            type="time"
                            value={newSchedule.end_time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                            required
                        />
                        <label htmlFor="location">Lieu :</label>
                        <input
                            id="location"
                            type="text"
                            value={newSchedule.location}
                            onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                            required
                        />
                        <label htmlFor="description">Description :</label>
                        <textarea
                            id="description"
                            value={newSchedule.description}
                            onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                        />
                        <button type="button" onClick={handleAddSchedule}>
                            Ajouter
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ScheduleCalendar;
