import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const locations = {
  'Basketball': [
    { name: 'Outdoor Courts 1', times: ['18:00:00', '19:00:00', '20:00:00'] },
    { name: 'Outdoor Courts 2', times: ['19:00:00', '20:00:00', '21:00:00'] },
    { name: 'Outdoor Courts 3', times: ['18:00:00', '21:00:00'] },
    { name: 'Kaplan Upstairs Court 1', times: ['18:00:00', '19:00:00'] },
    { name: 'Kaplan Upstairs Court 2', times: ['20:00:00', '21:00:00'] },
    { name: 'Kaplan Upstairs Court 3', times: ['18:00:00', '20:00:00'] },
    { name: 'Kaplan Downstairs Court 1', times: ['19:00:00', '21:00:00'] }
  ],
  'Soccer': [
    { name: 'Rec Field', times: ['18:00:00', '19:00:00', '20:00:00', '21:00:00'] },
    { name: 'Indoor Kaplan Court 1', times: ['19:00:00', '20:00:00'] },
    { name: 'Indoor Kaplan Court 2', times: ['18:00:00', '21:00:00'] }
  ]
};

const playerLimits = {
  'Basketball': [4, 6, 8, 10],
  'Soccer': [4, 6, 8, 10, 12, 14]
};

const CreateGame = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [matchData, setMatchData] = useState({
        sport: 'Basketball',
        location: '',
        date: '',
        time: '',
        playerLimit: ''
    });
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        const sportLocations = locations[matchData.sport] || [];
        if (sportLocations.length > 0) {
            setMatchData(prev => ({
                ...prev,
                location: sportLocations[0].name,
                time: sportLocations[0].times[0]
            }));
            setAvailableTimes(sportLocations[0].times);
        }

        const limits = playerLimits[matchData.sport] || [];
        if (limits.length > 0) {
            setMatchData(prev => ({
                ...prev,
                playerLimit: limits[0]
            }));
        }
    }, [matchData.sport]);

    useEffect(() => {
        const sportLocations = locations[matchData.sport] || [];
        const selectedLocation = sportLocations.find(loc => loc.name === matchData.location);
        if (selectedLocation) {
            setAvailableTimes(selectedLocation.times);
            setMatchData(prev => ({
                ...prev,
                time: selectedLocation.times[0]
            }));
        }
    }, [matchData.location, matchData.sport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMatchData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const date = new Date(matchData.date);
        const day = date.getUTCDay();
        if (day === 0 || day === 6) {
            setNotification({ message: 'Please select a weekday (Monday-Friday).', type: 'warning' });
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            setNotification({ message: 'You must be logged in to create a game', type: 'warning' });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const requestData = { 
            ...matchData, 
            creatorId: user.id,
            playerLimit: parseInt(matchData.playerLimit, 10) 
        };

        fetch('http://localhost:8080/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Error creating game');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Match created:', data);
            alert('Game created successfully!');
            navigate('/browse');
        })
        .catch((error) => {
            console.error('Full error object:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            alert(error.message || 'Error creating game');
        });
    };

    const sportLocations = locations[matchData.sport] || [];
    const limits = playerLimits[matchData.sport] || [];

    return (
        <main>
            <h2>🎯 Create New Game</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Sport:
                    <select name="sport" value={matchData.sport} onChange={handleChange}>
                        <option value="Basketball">Basketball</option>
                        <option value="Soccer">Soccer</option>
                    </select>
                </label>

                <label>
                    Location:
                    <select name="location" value={matchData.location} onChange={handleChange}>
                        {sportLocations.map(loc => (
                            <option key={loc.name} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Date:
                    <input 
                        type="date" 
                        name="date" 
                        value={matchData.date}
                        onChange={handleChange}
                        required 
                    />
                </label>

                <label>
                    Time:
                    <select name="time" value={matchData.time} onChange={handleChange}>
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Player Slots:
                    <select name="playerLimit" value={matchData.playerLimit} onChange={handleChange}>
                        {limits.map(num => (
                            <option key={num} value={num}>{num} players</option>
                        ))}
                    </select>
                </label>

                <button type="submit">Create Game</button>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </main>
    );
};

export default CreateGame;
