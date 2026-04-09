import { Routes, Route, Link } from "react-router-dom";
import GamePage from "./pages/GamePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Spela</Link>
        <Link to="/about" style={{ marginRight: "1rem" }}>Om projektet</Link>
        <a href="http://localhost:5080/highscores">Highscores</a>
      </nav>

      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}