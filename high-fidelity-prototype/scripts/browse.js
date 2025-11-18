document.addEventListener('DOMContentLoaded', function() {
    const gameListContainer = document.querySelector('.game-list');

    async function fetchAndDisplayMatches() {
        try {
            // Fetch matches from the backend API
            const response = await fetch('http://localhost:8080/api/matches');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const matches = await response.json();

            // Clear any placeholder content
            gameListContainer.innerHTML = '';

            if (matches.length === 0) {
                gameListContainer.innerHTML = '<p>No available games at the moment. Check back later!</p>';
                return;
            }

            // Create and append a card for each match
            matches.forEach(match => {
                const card = document.createElement('div');
                card.className = 'game-card';

                // Format date and time for better display
                const matchDate = new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const matchTime = new Date(`1970-01-01T${match.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                card.innerHTML = `
                    <h3>${match.title}</h3>
                    <p><strong>Sport:</strong> ${match.sport}</p>
                    <p><strong>Location:</strong> ${match.location}</p>
                    <p><strong>When:</strong> ${matchDate} at ${matchTime}</p>
                    <p><strong>Players:</strong> ${match.playersJoined} / ${match.playerLimit}</p>
                    <p><strong>Status:</strong> <span class="status-${match.status.toLowerCase()}">${match.status}</span></p>
                    <button class="join-button" data-match-id="${match.id}">Join Game</button>
                `;
                gameListContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error fetching matches:', error);
            gameListContainer.innerHTML = '<p class="error">Could not load games. Please try again later.</p>';
        }
    }

    fetchAndDisplayMatches();
});
