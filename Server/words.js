const words = [
  "book",
  "tree",
  "game",
  "milk",
  "fish",
  "apple",
  "grape",
  "chair",
  "planet",
  "winter",
  "school",
  "market"
];

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