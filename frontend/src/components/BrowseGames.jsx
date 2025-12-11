import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';

const BrowseGames = () => {
    const [matches, setMatches] = useState([]);
    const [sportFilter, setSportFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/matches')
            .then(response => response.json())
            .then(data => {
                setMatches(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
                setLoading(false);
            });
    };

    const handleJoinMatch = (matchId) => {
        if (!currentUserId) {
            setNotification({ message: 'Please log in to join a match', type: 'warning' });
            return;
        }

        fetch(`http://localhost:8080/api/matches/${matchId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentUserId })
        })
            .then(response => {
                if (response.ok) {
                    setNotification({ message: 'Successfully joined the match!', type: 'success' });
                    fetchMatches();
                } else {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to join match');
                    });
                }
            })
            .catch(error => {
                console.error('Error joining match:', error);
                setNotification({ message: 'Error joining match: ' + error.message, type: 'error' });
            });
    };

    const filteredMatches = matches.filter(match => {
        const matchesSport = sportFilter === 'All' || match.sport === sportFilter;
        const matchesSearch = searchTerm === '' || 
            match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (match.sport && match.sport.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSport && matchesSearch;
    });

    return (
        <main>
            <h2>Available Games</h2>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="sport-filter">Filter by Sport:</label>
                    <select id="sport-filter" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
                        <option>All</option>
                        <option>Basketball</option>
                        <option>Soccer</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="search-input">Search:</label>
                    <input 
                        id="search-input"
                        type="search" 
                        placeholder="Search by location or sport..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <section>
                {loading ? (
                    <LoadingSpinner />
                ) : filteredMatches.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>⊘</div>
                        <p>No games available matching your criteria.</p>
                        <p><a href="/create">Create one to get started!</a></p>
                    </div>
                ) : (
                    filteredMatches.map(match => (
                        <div key={match.id} className="game-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3>{match.sport} Game</h3>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    backgroundColor: match.status === 'SCHEDULED' ? '#e8f5e9' : match.status === 'STARTED' ? '#fff3e0' : '#ffebee',
                                    color: match.status === 'SCHEDULED' ? '#2e7d32' : match.status === 'STARTED' ? '#ef6c00' : '#c62828'
                                }}>
                                    {match.status}
                                </span>
                            </div>
                            <p><strong>Location:</strong> {match.location}</p>
                            <p><strong>Date:</strong> {match.date}</p>
                            <p><strong>Time:</strong> {match.time}</p>
                            <p><strong>Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>
                            {match.creatorName && <p><strong>Hosted by:</strong> {match.creatorName}</p>}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    onClick={() => setSelectedMatch(match)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Details
                                </button>
                                <button 
                                    onClick={() => handleJoinMatch(match.id)}
                                    disabled={match.playersJoined >= match.playerLimit}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: match.playersJoined >= match.playerLimit ? '#ccc' : '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: match.playersJoined >= match.playerLimit ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {match.playersJoined >= match.playerLimit ? 'Full' : 'Join Game'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {selectedMatch && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }} onClick={() => setSelectedMatch(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedMatch.title || `${selectedMatch.sport} Game`}</h2>
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Sport:</strong> {selectedMatch.sport}</p>
                            <p><strong>Location:</strong> {selectedMatch.location}</p>
                            <p><strong>Date:</strong> {selectedMatch.date}</p>
                            <p><strong>Time:</strong> {selectedMatch.time}</p>
                            <p><strong>Players:</strong> {selectedMatch.playersJoined || 0} / {selectedMatch.playerLimit}</p>
                            {selectedMatch.description && (
                                <p><strong>Description:</strong> {selectedMatch.description}</p>
                            )}
                            <p><strong>Status:</strong> {selectedMatch.status}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                            <button 
                                onClick={() => {
                                    handleJoinMatch(selectedMatch.id);
                                    setSelectedMatch(null);
                                }}
                                disabled={selectedMatch.playersJoined >= selectedMatch.playerLimit}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: selectedMatch.playersJoined >= selectedMatch.playerLimit ? '#ccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: selectedMatch.playersJoined >= selectedMatch.playerLimit ? 'not-allowed' : 'pointer',
                                    flex: 1
                                }}
                            >
                                {selectedMatch.playersJoined >= selectedMatch.playerLimit ? 'Full' : 'Join Game'}
                            </button>
                            <button 
                                onClick={() => setSelectedMatch(null)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default BrowseGames;
