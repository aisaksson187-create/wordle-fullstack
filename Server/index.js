import express from "express";
import cors from "cors";

const app = express();
const PORT = 5080;

app.use(cors());
app.use(express.json());

const games = new Map();

function createGameId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getFeedback(secretWord, guess) {
  const result = [];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretWord[i]) {
      result.push("correct");
    } else if (secretWord.includes(guess[i])) {
      result.push("misplaced");
    } else {
      result.push("incorrect");
    }
  }

  return result;
}

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hej från servern!" });
});

app.post("/api/game/start", (req, res) => {
  const { wordLength, allowDuplicates } = req.body;

  if (!wordLength || wordLength < 3 || wordLength > 10) {
    return res.status(400).json({ error: "Ogiltig ordlängd" });
  }

  let secretWord = "apple";

  if (wordLength === 4) secretWord = "book";
  if (wordLength === 5) secretWord = "apple";
  if (wordLength === 6) secretWord = "planet";

  const gameId = createGameId();

  games.set(gameId, {
    secretWord,
    wordLength,
    allowDuplicates,
    guesses: [],
    startedAt: Date.now(),
    isOver: false
  });

  res.json({
    message: "Spelet startat",
    gameId,
    wordLength,
    allowDuplicates
  });
});

app.post("/api/game/guess", (req, res) => {
  const { gameId, guess } = req.body;

  if (!gameId || !guess) {
    return res.status(400).json({ error: "gameId och guess krävs" });
  }

  const game = games.get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Spelet hittades inte" });
  }

  if (game.isOver) {
    return res.status(400).json({ error: "Spelet är redan slut" });
  }

  const cleanGuess = guess.toLowerCase().trim();

  if (cleanGuess.length !== game.wordLength) {
    return res.status(400).json({ error: `Ordet måste vara ${game.wordLength} bokstäver långt` });
  }

  const feedback = getFeedback(game.secretWord, cleanGuess);

  game.guesses.push({
    guess: cleanGuess,
    feedback
  });

  const won = cleanGuess === game.secretWord;

  if (won) {
    game.isOver = true;
  }

  res.json({
    guess: cleanGuess,
    feedback,
    guesses: game.guesses,
    won
  });
});

app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
});