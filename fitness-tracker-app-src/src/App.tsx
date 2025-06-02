import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Diet from './pages/Diet';
import Exercises from './pages/Exercises';
import Goals from './pages/Goals';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="logo">
              <h1>Fitness Tracker</h1>
            </div>
            <nav className="main-nav">
              <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/diet">Dieta</Link></li>
                <li><Link to="/exercises">Exercícios</Link></li>
                <li><Link to="/goals">Metas</Link></li>
                <li><Link to="/progress">Progresso</Link></li>
                <li><Link to="/profile">Perfil</Link></li>
              </ul>
            </nav>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diet" element={<Diet />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} Fitness Tracker App</p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
