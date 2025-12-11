import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import ConfirmModal from './ConfirmModal';

const MyGames = () => {
    const navigate = useNavigate();
    const [createdMatches, setCreatedMatches] = useState([]);
    const [joinedMatches, setJoinedMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('created');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(null);
    const [showPastGames, setShowPastGames] = useState(false);
    const [hiddenGames, setHiddenGames] = useState(() => {
        const saved = localStorage.getItem('hiddenGames');
        return saved ? JSON.parse(saved) : [];
    });

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            setNotification({ message: 'You must be logged in to view your games', type: 'warning' });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        fetchCreatedMatches(user.id);
        fetchJoinedMatches(user.id);
    }, [navigate]);

    const fetchCreatedMatches = (userId) => {
        setLoading(true);
        fetch(`http://localhost:8080/api/matches/created-by/${userId}`)
            .then(response => response.json())
            .then(data => {
                setCreatedMatches(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching created matches:', error);
                setLoading(false);
            });
    };

    const fetchJoinedMatches = (userId) => {
        fetch(`http://localhost:8080/api/matches/player/${userId}`)
            .then(response => response.json())
            .then(data => setJoinedMatches(data))
            .catch(error => console.error('Error fetching joined matches:', error));
    };

    const handleCancelMatch = (matchId) => {
        setConfirmModal({
            message: 'Are you sure you want to cancel this match?',
            onConfirm: () => {
                setConfirmModal(null);
                fetch(`http://localhost:8080/api/matches/${matchId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        setNotification({ message: 'Match cancelled successfully', type: 'success' });
                        const user = JSON.parse(localStorage.getItem('user'));
                        fetchCreatedMatches(user.id);
                    } else {
                        setNotification({ message: 'Error cancelling match', type: 'error' });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setNotification({ message: 'Error cancelling match', type: 'error' });
                });
            }
        });
    };

    const handleLeaveMatch = (matchId) => {
        setConfirmModal({
            message: 'Are you sure you want to leave this match?',
            onConfirm: () => {
                setConfirmModal(null);
                const user = JSON.parse(localStorage.getItem('user'));
                fetch(`http://localhost:8080/api/matches/${matchId}/leave?userId=${user.id}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        setNotification({ message: 'Left match successfully', type: 'success' });
                        fetchJoinedMatches(user.id);
                    } else {
                        setNotification({ message: 'Error leaving match', type: 'error' });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setNotification({ message: 'Error leaving match', type: 'error' });
                });
            }
        });
    };

    const isGamePast = (match) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const gameDate = new Date(match.date);
        return gameDate < today || match.status === 'CANCELLED' || match.status === 'COMPLETED';
    };

    const hideGame = (matchId) => {
        const newHiddenGames = [...hiddenGames, matchId];
        setHiddenGames(newHiddenGames);
        localStorage.setItem('hiddenGames', JSON.stringify(newHiddenGames));
        setNotification({ message: 'Game hidden from view', type: 'success' });
    };

    const unhideAllGames = () => {
        setHiddenGames([]);
        localStorage.removeItem('hiddenGames');
        setNotification({ message: 'All hidden games restored', type: 'success' });
    };

    const filterMatches = (matches) => {
        return matches.filter(match => {
            // Always hide games that are in hiddenGames array
            if (hiddenGames.includes(match.id)) return false;
            // If showPastGames is false, hide past/cancelled/completed games
            if (!showPastGames && isGamePast(match)) return false;
            return true;
        });
    };

    const filteredCreatedMatches = filterMatches(createdMatches);
    const filteredJoinedMatches = filterMatches(joinedMatches);
    const hiddenCount = createdMatches.filter(m => hiddenGames.includes(m.id)).length + 
                        joinedMatches.filter(m => hiddenGames.includes(m.id)).length;

    return (
        <main>
            <h2>My Games</h2>

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

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={showPastGames} 
                        onChange={(e) => setShowPastGames(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                    />
                    Show past & cancelled games
                </label>
                {hiddenCount > 0 && (
                    <button
                        onClick={unhideAllGames}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#757575',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        Restore {hiddenCount} hidden game{hiddenCount > 1 ? 's' : ''}
                    </button>
                )}
            </div>

            <section>
                {loading ? (
                    <LoadingSpinner />
                ) : activeTab === 'created' && (
                    filteredCreatedMatches.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>+</div>
                            <p>{createdMatches.length === 0 ? "You haven't created any games yet." : "No games to show with current filters."}</p>
                            {createdMatches.length === 0 && <p><a href="/create">Create one now!</a></p>}
                        </div>
                    ) : (
                        filteredCreatedMatches.map(match => (
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
                                <p><strong>Time:</strong> {formatTime(match.time)}</p>
                                <p><strong>Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>
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
                                        onClick={() => navigate(`/edit/${match.id}`)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#FF9800',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleCancelMatch(match.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel Match
                                    </button>
                                    <button 
                                        onClick={() => hideGame(match.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#9e9e9e',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        title="Hide this game from your list"
                                    >
                                        Hide
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                )}

                {!loading && activeTab === 'joined' && (
                    filteredJoinedMatches.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>↗</div>
                            <p>{joinedMatches.length === 0 ? "You haven't joined any games yet." : "No games to show with current filters."}</p>
                            {joinedMatches.length === 0 && <p><a href="/browse">Browse games!</a></p>}
                        </div>
                    ) : (
                        filteredJoinedMatches.map(match => (
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
                                <p><strong>Time:</strong> {formatTime(match.time)}</p>
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
                                        onClick={() => handleLeaveMatch(match.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Leave Match
                                    </button>
                                    <button 
                                        onClick={() => hideGame(match.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#9e9e9e',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        title="Hide this game from your list"
                                    >
                                        Hide
                                    </button>
                                </div>
                            </div>
                        ))
                    )
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
                            <p><strong>Time:</strong> {formatTime(selectedMatch.time)}</p>
                            <p><strong>Players:</strong> {selectedMatch.playersJoined || 0} / {selectedMatch.playerLimit}</p>
                            {selectedMatch.description && (
                                <p><strong>Description:</strong> {selectedMatch.description}</p>
                            )}
                            <p><strong>Status:</strong> {selectedMatch.status}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                            {activeTab === 'created' ? (
                                <>
                                    <button 
                                        onClick={() => {
                                            setSelectedMatch(null);
                                            navigate(`/edit/${selectedMatch.id}`);
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#2196F3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedMatch(null);
                                            handleCancelMatch(selectedMatch.id);
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Cancel Match
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setSelectedMatch(null);
                                        handleLeaveMatch(selectedMatch.id);
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        flex: 1
                                    }}
                                >
                                    Leave Match
                                </button>
                            )}
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

            {confirmModal && (
                <ConfirmModal
                    message={confirmModal.message}
                    onConfirm={confirmModal.onConfirm}
                    onCancel={() => setConfirmModal(null)}
                />
            )}
        </main>
    );
};

export default MyGames;
