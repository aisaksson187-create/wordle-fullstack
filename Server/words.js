import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "words.txt");

const words = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0)
  .filter((word) => /^[a-z]+$/.test(word));

function hasUniqueLetters(word) {
  return new Set(word).size === word.length;
}

export function getRandomWord(wordLength, allowDuplicates) {
  const filteredWords = words.filter((word) => {
    if (word.length !== wordLength) {
      return false;
    }

    if (!allowDuplicates && !hasUniqueLetters(word)) {
      return false;
    }

    return true;
  });

  if (filteredWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}