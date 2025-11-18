import React, { useState, useEffect } from 'react';

const BrowseGames = () => {
    const [matches, setMatches] = useState([]);
    const [sportFilter, setSportFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [joiningId, setJoiningId] = useState(null); 

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        fetch('http://localhost:8080/api/matches')
            .then(response => response.json())
            .then(data => setMatches(data))
            .catch(error => console.error('Error fetching matches:', error));
    };

   
    const joinGame = async (matchId) => {
        setJoiningId(matchId);
        try {
            const response = await fetch(`http://localhost:8080/api/matches/${matchId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to join game');
            }

            // Refresh match list so UI updates with new playersJoined count
            fetchMatches();
        } catch (error) {
            console.error('Error joining game:', error);
            alert('Could not join the game. It may be full.');
        } finally {
            setJoiningId(null);
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
                                <p><strong>👥 Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>

                                
                                <button
                                    disabled={isFull || joiningId === match.id}
                                    onClick={() => joinGame(match.id)}
                                    className={isFull ? "btn-disabled" : "btn-join"}
                                >
                                    {isFull 
                                        ? "Game Full" 
                                        : joiningId === match.id 
                                            ? "Joining..." 
                                            : "Join Game"}
                                </button>
                            </div>
                        );
                    })
                )}
            </section>
        </main>
    );
};

export default BrowseGames;
