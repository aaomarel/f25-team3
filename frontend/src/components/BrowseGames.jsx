import React, { useState, useEffect } from 'react';

const BrowseGames = () => {
    const [matches, setMatches] = useState([]);
    const [sportFilter, setSportFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        fetch('http://localhost:8080/api/matches')
            .then(response => response.json())
            .then(data => setMatches(data))
            .catch(error => console.error('Error fetching matches:', error));
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
                    filteredMatches.map(match => (
                        <div key={match.id} className="game-card">
                            <h3>{match.sport === 'Basketball' ? '🏀' : '⚽'} {match.sport} Game</h3>
                            <p><strong>📍 Location:</strong> {match.location}</p>
                            <p><strong>📅 Date:</strong> {match.date}</p>
                            <p><strong>⏰ Time:</strong> {match.time}</p>
                            <p><strong>👥 Players:</strong> {match.playersJoined || 0} / {match.playerLimit}</p>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
};

export default BrowseGames;
