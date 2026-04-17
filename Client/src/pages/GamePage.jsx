import { useState } from "react";

export default function GamePage() {
  const [wordLength, setWordLength] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [gameId, setGameId] = useState("");
  const [message, setMessage] = useState("");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [won, setWon] = useState(false);
  const [name, setName] = useState("");

  async function startGame(e) {
    e.preventDefault();

    const response = await fetch("/api/game/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wordLength,
        allowDuplicates
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Något gick fel");
      return;
    }

    setGameId(data.gameId);
    setMessage(data.message);
    setGuesses([]);
    setGuess("");
    setWon(false);
    setName("");
  }

  async function submitGuess(e) {
    e.preventDefault();

    const response = await fetch("/api/game/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameId,
        guess
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Något gick fel");
      return;
    }

    setGuesses(data.guesses);
    setGuess("");

    if (data.won) {
      setWon(true);
      setMessage("Du vann!");
    } else {
      setMessage("Fortsätt gissa");
    }
  }

  async function saveHighscore(e) {
    e.preventDefault();

    const response = await fetch("/api/highscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameId,
        name
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Kunde inte spara highscore");
      return;
    }

    setMessage(data.message);
    setName("");
  }

  function getColor(status) {
    if (status === "correct") return "green";
    if (status === "misplaced") return "gold";
    return "tomato";
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Wordle</h1>

      <p>
        <a href="/highscores">Visa highscores</a>
      </p>

      <form onSubmit={startGame} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Antal bokstäver:
            <input
              type="number"
              min="3"
              max="10"
              value={wordLength}
              onChange={(e) => setWordLength(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            Tillåt upprepade bokstäver
          </label>
        </div>

        <button type="submit">Starta spel</button>
      </form>

      {gameId && (
        <form onSubmit={submitGuess} style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={`Skriv ett ord med ${wordLength} bokstäver`}
            maxLength={wordLength}
            disabled={won}
          />
          <button type="submit" disabled={won || !guess}>
            Gissa
          </button>
        </form>
      )}

      {message && <p>{message}</p>}

      <div>
        {guesses.map((item, guessIndex) => (
          <div key={guessIndex} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            {item.guess.split("").map((letter, index) => (
              <span
                key={index}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getColor(item.feedback[index]),
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>

      {won && (
        <form onSubmit={saveHighscore} style={{ marginTop: "2rem" }}>
          <h2>Du vann! Spara din highscore</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skriv ditt namn"
          />
          <button type="submit" disabled={!name}>
            Spara highscore
          </button>
        </form>
      )}
    </div>
  );
}