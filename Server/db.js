import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./highscores.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS highscores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration_ms INTEGER NOT NULL,
      guesses_json TEXT NOT NULL,
      word_length INTEGER NOT NULL,
      allow_duplicates INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export function saveHighscore({ name, durationMs, guesses, wordLength, allowDuplicates }) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO highscores (name, duration_ms, guesses_json, word_length, allow_duplicates)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        durationMs,
        JSON.stringify(guesses),
        wordLength,
        allowDuplicates ? 1 : 0
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

export function getHighscores() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM highscores
      ORDER BY duration_ms ASC, created_at ASC
      `,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const result = rows.map((row) => ({
            ...row,
            guesses: JSON.parse(row.guesses_json)
          }));
          resolve(result);
        }
      }
    );
  });
}