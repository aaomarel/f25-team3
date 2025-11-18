import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <main>
      <h2>🏆 Dashboard</h2>
      <section className="features">
        <Link to="/browse" className="feature feature-link">  
          <h3>🔍 Find Games</h3>
          <p>Discover basketball and soccer games happening in your area. Filter by sport, location, and time.</p>
        </Link>
        <Link to="/create" className="feature feature-link">
          <h3>🎯 Host Events</h3>
          <p>Create and manage your own sporting events. Set locations, times, and player limits.</p>
        </Link>
        <Link to="/my-games" className="feature feature-link">
          <h3>📋 My Games</h3>
          <p>View and manage games you've created or joined. Edit details and track participants.</p>
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;
