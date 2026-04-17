import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { getFeedback } from "./game.js";
import { getRandomWord } from "./words.js";
import { saveHighscore, getHighscores } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../client/dist");

const app = express();
const PORT = 5080;


app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(clientDistPath));

const games = new Map();

function createGameId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hej från servern!" });
});

app.post("/api/game/start", (req, res) => {

  const { wordLength, allowDuplicates } = req.body;

  if (!wordLength || wordLength < 3 || wordLength > 10) {
    return res.status(400).json({ error: "Ogiltig ordlängd" });
  }

  const secretWord = getRandomWord(wordLength, allowDuplicates);

  if (!secretWord) {
    return res.status(400).json({ error: "Det finns inga ord som matchar de inställningarna" });
  }

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
  game.finishedAt = Date.now();
}

  res.json({
    guess: cleanGuess,
    feedback,
    guesses: game.guesses,
    won
  });
});

app.post("/api/highscores", async (req, res) => {
  const { gameId, name } = req.body;

  if (!gameId || !name) {
    return res.status(400).json({ error: "gameId och name krävs" });
  }

  const game = games.get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Spelet hittades inte" });
  }

  if (!game.isOver) {
    return res.status(400).json({ error: "Spelet är inte klart ännu" });
  }

  const cleanName = name.trim();

  if (!cleanName) {
    return res.status(400).json({ error: "Namn får inte vara tomt" });
  }

  const durationMs = game.finishedAt - game.startedAt;

  try {
    await saveHighscore({
      name: cleanName,
      durationMs,
      guesses: game.guesses.map((item) => item.guess),
      wordLength: game.wordLength,
      allowDuplicates: game.allowDuplicates
    });

    res.json({ message: "Highscore sparad" });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte spara highscore" });
  }
});

app.get("/api/highscores", async (req, res) => {
  try {
    const highscores = await getHighscores();
    res.json(highscores);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta highscores" });
  }
});

app.get("/highscores", async (req, res) => {
  try {
    const highscores = await getHighscores();
    res.render("highscores", { highscores });
  } catch (error) {
    res.status(500).send("Kunde inte hämta highscores");
  }
});

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
});