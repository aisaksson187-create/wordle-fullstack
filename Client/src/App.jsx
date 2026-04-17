import { Routes, Route, Link } from "react-router-dom";
import GamePage from "./pages/GamePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="page">
      <nav className="top-nav">
        <Link to="/" className="nav-link">Spela</Link>
        <Link to="/about" className="nav-link">Om projektet</Link>
        <a href="/highscores" className="nav-link">Highscores</a>
      </nav>

      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}