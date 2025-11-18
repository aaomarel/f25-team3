import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyGames = () => {
    const navigate = useNavigate();
    const [createdMatches, setCreatedMatches] = useState([]);
    const [joinedMatches, setJoinedMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('created');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('You must be logged in to view your games');
            navigate('/login');
            return;
        }

        fetchCreatedMatches(user.id);
        fetchJoinedMatches(user.id);
    }, [navigate]);

    const fetchCreatedMatches = (userId) => {
        fetch(`http://localhost:8080/api/matches/created-by/${userId}`)
            .then(response => response.json())
            .then(data => setCreatedMatches(data))
            .catch(error => console.error('Error fetching created matches:', error));
    };

    const fetchJoinedMatches = (userId) => {
        fetch(`http://localhost:8080/api/matches/player/${userId}`)
            .then(response => response.json())
            .then(data => setJoinedMatches(data))
            .catch(error => console.error('Error fetching joined matches:', error));
    };

    const handleCancelMatch = (matchId) => {
        if (!window.confirm('Are you sure you want to cancel this match?')) {
            return;
        }

        fetch(`http://localhost:8080/api/matches/${matchId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Match cancelled successfully');
                const user = JSON.parse(localStorage.getItem('user'));
                fetchCreatedMatches(user.id);
            } else {
                alert('Error cancelling match');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error cancelling match');
        });
    };

    const handleLeaveMatch = (matchId) => {
        if (!window.confirm('Are you sure you want to leave this match?')) {
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        fetch(`http://localhost:8080/api/matches/${matchId}/leave?userId=${user.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Left match successfully');
                fetchJoinedMatches(user.id);
            } else {
                alert('Error leaving match');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error leaving match');
        });
    };

    return (
        <main>
            <h2>📋 My Games</h2>

            <div className="tab-buttons">
                <button 
                    className={activeTab === 'created' ? 'active' : ''}
                    onClick={() => setActiveTab('created')}
                >
                    Games I Created
                </button>
                <button 
                    className={activeTab === 'joined' ? 'active' : ''}
                    onClick={() => setActiveTab('joined')}
                >
                    Games I Joined
                </button>
            </div>

            <section>
                {activeTab === 'created' && (
                    createdMatches.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't created any games yet.</p>
                            <p><a href="/create">Create one now!</a></p>
                        </div>
                    ) : (
                        createdMatches.map(match => (
                            <div key={match.id} className="game-card">
                                <h3>{match.sport === 'Basketball' ? '🏀' : '⚽'} {match.sport} Game</h3>
                                <p><strong>📍 Location:</strong> {match.location}</p>
                                <p><strong>📅 Date:</strong> {match.date}</p>
                                <p><strong>⏰ Time:</strong> {match.time}</p>
                                <p><strong>📊 Status:</strong> {match.status}</p>
                                <p><strong>👥 Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-secondary" onClick={() => navigate(`/edit/${match.id}`)}>✏️ Edit</button>
                                    <button className="btn" onClick={() => handleCancelMatch(match.id)}>❌ Cancel Match</button>
                                </div>
                            </div>
                        ))
                    )
                )}

                {activeTab === 'joined' && (
                    joinedMatches.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't joined any games yet.</p>
                            <p><a href="/browse">Browse games!</a></p>
                        </div>
                    ) : (
                        joinedMatches.map(match => (
                            <div key={match.id} className="game-card">
                                <h3>{match.sport === 'Basketball' ? '🏀' : '⚽'} {match.sport} Game</h3>
                                <p><strong>📍 Location:</strong> {match.location}</p>
                                <p><strong>📅 Date:</strong> {match.date}</p>
                                <p><strong>⏰ Time:</strong> {match.time}</p>
                                <p><strong>📊 Status:</strong> {match.status}</p>
                                <p><strong>👥 Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>
                                <button className="btn" onClick={() => handleLeaveMatch(match.id)}>🚪 Leave Match</button>
                            </div>
                        ))
                    )
                )}
            </section>
        </main>
    );
};

export default MyGames;
