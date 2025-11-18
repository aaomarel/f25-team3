import React, { useState, useEffect } from 'react';

const BrowseGames = () => {
    const [matches, setMatches] = useState([]);
    const [sportFilter, setSportFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null); // For join/leave loading state

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        fetch('http://localhost:8080/api/matches')
            .then(response => response.json())
            .then(data => setMatches(data))
            .catch(error => console.error('Error fetching matches:', error));
    };

    // ⭐ JOIN GAME
    const joinGame = async (matchId) => {
        setProcessingId(matchId);
        try {
            const response = await fetch(`http://localhost:8080/api/matches/${matchId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error("Failed to join game");
            }

            fetchMatches(); // refresh
        } catch (err) {
            console.error(err);
            alert("Could not join game.");
        } finally {
            setProcessingId(null);
        }
    };

    // ⭐ LEAVE GAME
    const leaveGame = async (matchId) => {
        setProcessingId(matchId);
        try {
            const response = await fetch(`http://localhost:8080/api/matches/${matchId}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error("Failed to leave game");
            }

            fetchMatches(); // refresh
        } catch (err) {
            console.error(err);
            alert("Could not leave game.");
        } finally {
            setProcessingId(null);
        }
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
            <h2>🔍 Available Games</h2>

            <div className="filters-container">
                <div className="filter-group">
                    <label>Filter by Sport:</label>
                    <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
                        <option>All</option>
                        <option>Basketball</option>
                        <option>Soccer</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Search:</label>
                    <input 
                        type="search" 
                        placeholder="Search by location or sport..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <section>
                {filteredMatches.length === 0 ? (
                    <div className="empty-state">
                        <p>No games available matching your criteria.</p>
                        <p><a href="/create">Create one to get started!</a></p>
                    </div>
                ) : (
                    filteredMatches.map(match => {
                        const isFull = match.playersJoined >= match.playerLimit;

                        return (
                            <div key={match.id} className="game-card">
                                <h3>{match.sport === 'Basketball' ? '🏀' : '⚽'} {match.sport} Game</h3>
                                <p><strong>📍 Location:</strong> {match.location}</p>
                                <p><strong>📅 Date:</strong> {match.date}</p>
                                <p><strong>⏰ Time:</strong> {match.time}</p>
                                <p><strong>👥 Players:</strong> {match.playersJoined} / {match.playerLimit}</p>

                                {/* ⭐ BUTTON TOGGLE: JOIN OR LEAVE */}
                                {match.joined ? (
                                    <button
                                        disabled={processingId === match.id}
                                        onClick={() => leaveGame(match.id)}
                                        className="btn-leave"
                                    >
                                        {processingId === match.id ? "Leaving..." : "Leave Game"}
                                    </button>
                                ) : (
                                    <button
                                        disabled={isFull || processingId === match.id}
                                        onClick={() => joinGame(match.id)}
                                        className="btn-join"
                                    >
                                        {isFull
                                            ? "Game Full"
                                            : processingId === match.id
                                                ? "Joining..."
                                                : "Join Game"}
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </section>
        </main>
    );
};

export default BrowseGames;
