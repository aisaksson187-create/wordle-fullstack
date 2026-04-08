export function getFeedback(secretWord, guess) {
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