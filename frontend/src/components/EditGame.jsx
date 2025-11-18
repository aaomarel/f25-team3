import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

const EditGame = () => {
    const navigate = useNavigate();
    const { matchId } = useParams();
    const [matchData, setMatchData] = useState({
        title: '',
        description: '',
        sport: '',
        location: '',
        date: '',
        time: '',
        playerLimit: ''
    });
    const [loading, setLoading] = useState(true);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        // Fetch existing match data
        fetch(`http://localhost:8080/api/matches/${matchId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Match not found');
                }
                return response.json();
            })
            .then(data => {
                // Strip seconds from time for the time input (HH:mm:ss -> HH:mm)
                const timeWithoutSeconds = data.time ? data.time.substring(0, 5) : '';
                
                setMatchData({
                    title: data.title || '',
                    description: data.description || '',
                    sport: data.sport || '',
                    location: data.location || '',
                    date: data.date || '',
                    time: timeWithoutSeconds,
                    playerLimit: data.playerLimit || ''
                });
                
                // Set available times based on sport and location
                const sportLocations = locations[data.sport] || [];
                const selectedLocation = sportLocations.find(loc => loc.name === data.location);
                if (selectedLocation) {
                    setAvailableTimes(selectedLocation.times);
                }
                
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching match:', error);
                alert('Error loading match data');
                navigate('/my-games');
            });
    }, [matchId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMatchData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add seconds to time if not present (HH:mm -> HH:mm:ss)
        const timeWithSeconds = matchData.time.length === 5 ? `${matchData.time}:00` : matchData.time;

        const updatePayload = {
            title: matchData.title,
            description: matchData.description,
            sport: matchData.sport,
            location: matchData.location,
            date: matchData.date,
            time: timeWithSeconds,
            playerLimit: parseInt(matchData.playerLimit, 10)
        };

        fetch(`http://localhost:8080/api/matches/${matchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Server error:', text);
                    throw new Error(`Error updating match: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Match updated successfully!');
            navigate('/my-games');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message || 'Error updating match');
        });
    };

    if (loading) {
        return (
            <main>
                <h2>✏️ Edit Game</h2>
                <div className="empty-state">
                    <p>Loading match data...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <h2>✏️ Edit Game</h2>

            <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input 
                            type="text" 
                            name="title" 
                            value={matchData.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>

                    <label>
                        Description:
                        <textarea 
                            name="description" 
                            value={matchData.description} 
                            onChange={handleChange}
                            rows="3"
                        />
                    </label>

                    <label>
                        Sport:
                        <select 
                            name="sport" 
                            value={matchData.sport} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select a sport</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Baseball">Baseball</option>
                        </select>
                    </label>

                    <label>
                        Location:
                        <input 
                            type="text" 
                            name="location" 
                            value={matchData.location} 
                            onChange={handleChange} 
                            required 
                        />
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
                        <select 
                            name="time" 
                            value={matchData.time} 
                            onChange={handleChange} 
                            required
                        >
                            {availableTimes.map(time => {
                                const displayTime = time.substring(0, 5); // Strip seconds for display
                                return (
                                    <option key={time} value={displayTime}>
                                        {displayTime}
                                    </option>
                                );
                            })}
                        </select>
                    </label>

                    <label>
                        Player Limit:
                        <input 
                            type="number" 
                            name="playerLimit" 
                            value={matchData.playerLimit} 
                            onChange={handleChange} 
                            min="2" 
                            required 
                        />
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn">Update Match</button>
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={() => navigate('/my-games')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
        </main>
    );
};

export default EditGame;
