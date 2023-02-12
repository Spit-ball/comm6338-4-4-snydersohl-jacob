var words = [
  'bananas',
  'grapes',
  'carousel',
  'milkshake',
  'javascript',
  'limousine',
  'chocolate',
  'programming',
  'meatloaf',
  'ukulele',
  'mango'
]

// declare variables here
let wins = 0;
let losses = 0;
let remainingGuesses = 10;
let incorrectLetters = [];
let prevWord = ""

// create the initial random word and replace it with underscores for displaying.
let wordToGuess = words[Math.floor(Math.random() * words.length)];
let replacedWord = wordToGuess.replace(/[a-z]/gi, "_");

// send to DOM.
document.getElementById("remaining-guesses").innerHTML = remainingGuesses;
document.getElementById("word-to-guess").innerHTML = replacedWord;

console.log(wordToGuess);
console.log(replacedWord);

// detect key release and trigger events.
document.body.onkeyup = function (event) {
  let userLetter = event.key.toLowerCase();
  if (/^[a-z]$/i.test(userLetter)) {
    if (wordToGuess.includes(userLetter)) {
      for (let i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === userLetter) {
          let wordArray = replacedWord.split('');
          wordArray[i] = userLetter;
          replacedWord = wordArray.join('');
        }
      }
      document.getElementById('word-to-guess').innerHTML = replacedWord; // send the replaced word to the DOM each time an included letter is pressed.
      if (replacedWord === wordToGuess) {
        wins++
        document.getElementById('wins').innerHTML = wins;
        prevWord = wordToGuess;
        wordToGuess = words[Math.floor(Math.random() * words.length)];
        replacedWord = wordToGuess.replace(/[a-z]/gi, "_");
        document.getElementById('word-to-guess').innerHTML = replacedWord;
        document.getElementById('previous-word').innerHTML = prevWord;
        remainingGuesses = 10;
        document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
        incorrectLetters = [];
        document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
      }

    } else if (incorrectLetters.includes(userLetter)) {
      // this checks to see if the userLetter is included in incorrectLetters and does nothing if so. Prevents adding duplicate incorrect letters
    }
    else {
      incorrectLetters.push(userLetter); // send the user letter to the array
      remainingGuesses--;
      document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
      document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
      if (remainingGuesses === 0) {
        losses++;
        document.getElementById('losses').innerHTML = losses;
        prevWord = wordToGuess;
        wordToGuess = words[Math.floor(Math.random() * words.length)];
        replacedWord = wordToGuess.replace(/[a-z]/gi, "_");
        document.getElementById('word-to-guess').innerHTML = replacedWord;
        document.getElementById('previous-word').innerHTML = prevWord;
        remainingGuesses = 10;
        incorrectLetters = [];
        document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
        document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
      }
    }
  }
}
