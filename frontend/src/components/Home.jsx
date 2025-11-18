import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <section className="hero">
        <h2>Find Sports Games Near You</h2>
        <p>Join local games and compete with friends. Connect with your community through sports!</p>
        <Link to="/login" className="cta">Login to Get Started</Link>
      </section>
    </main>
  );
};

export default Home;
