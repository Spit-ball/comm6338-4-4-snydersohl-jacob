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
document.onkeyup = function (event) {
  let userLetter = event.key
  if (wordToGuess.includes(userLetter)) { // if the wordToGuess includes the pressed key...
    for (let i = 0; i < wordToGuess.length; i++) { // iterate through the entire length of the word
      if (wordToGuess[i] === userLetter) { // if the current index of the wordToGuess is equal to the pressed letter...
        let wordArray = replacedWord.split('');
        wordArray[i] = userLetter;
        replacedWord = wordArray.join('');
      }
    }
    document.getElementById('word-to-guess').innerHTML = replacedWord; // send the replaced word to the DOM each time an included letter is pressed.
    if (replacedWord === wordToGuess) { // if the replaced word, during the previous loop, is finally equal to the wordToGuess... do the following.
      wins++ // increment wins
      document.getElementById('wins').innerHTML = wins;
      prevWord = wordToGuess; // send word to prevWord var.
      wordToGuess = words[Math.floor(Math.random() * words.length)]; // generate new random word
      replacedWord = wordToGuess.replace(/[a-z]/gi, "_"); // replace it again with underscores
      document.getElementById('word-to-guess').innerHTML = replacedWord; // send to DOM
      document.getElementById('previous-word').innerHTML = prevWord;
      remainingGuesses = 10; // reset guess count
      document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
      incorrectLetters = []; // empty the character array
      document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
    }

  } else if (incorrectLetters.includes(userLetter)) {
    // this checks to see if the userLetter is included in incorrectLetters and does nothing if so. Prevents adding duplicate incorrect letters
  }
  else { // if the wordToGuess doesn't include the userLetter, basically, do this
    incorrectLetters.push(userLetter); // send the user letter to the array
    remainingGuesses--; // lose a guess
    document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
    document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
    if (remainingGuesses === 0) { // if, during this cycle, your guesses reach 0...
      losses++; // increment losses
      document.getElementById('losses').innerHTML = losses;
      prevWord = wordToGuess; // again, send wordToGuess to prevWord to display
      wordToGuess = words[Math.floor(Math.random() * words.length)]; // regen word...
      replacedWord = wordToGuess.replace(/[a-z]/gi, "_"); // replace word
      document.getElementById('word-to-guess').innerHTML = replacedWord;
      document.getElementById('previous-word').innerHTML = prevWord;
      remainingGuesses = 10; // reset guesses
      incorrectLetters = []; // empty
      document.getElementById('remaining-guesses').innerHTML = remainingGuesses;
      document.getElementById('incorrect-letters').innerHTML = incorrectLetters;
    }
  }
}
