import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import BrowseGames from './components/BrowseGames';
import CreateGame from './components/CreateGame';
import EditGame from './components/EditGame';
import MyGames from './components/MyGames';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseGames />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/edit/:matchId" element={<EditGame />} />
        <Route path="/my-games" element={<MyGames />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
