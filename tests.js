const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  // "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true

  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  String.prototype.includesLetters = function(letters) {
    return letters.split("").every((letter) => this.includes(letter))
  }

  describe("Word Guess Assignment", function () {
    const wordToGuess = document.getElementById('word-to-guess')
    const remainingGuessDisplay = document.getElementById('remaining-guesses')
    const incorrectLettersDisplay = document.getElementById('incorrect-letters')
    const previousWord = document.getElementById('previous-word')
    const winDisplay = document.getElementById('wins')
    const lossDisplay = document.getElementById('losses')
    const pressKey = letter => body.dispatchEvent(new KeyboardEvent('keyup', { key: letter }))
    afterEach(() => {
      sinon.restore()
    })
    after(() => {
      testBtn.disabled = false
      testBtn.textContent = 'Close Tests'
    })
    describe('Initial Setup', () => {
      it('Should have words defined', () => {
        expect(words).to.exist
        expect(words).to.deep.eq([
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
        ])
      })
      it('Should display one underscore for each letter of current word', () => {
        expect(wordToGuess.textContent).to.eq('_______')
      })
      it('Should display 10 guesses at game start', () => {
        expect(remainingGuessDisplay.textContent).to.eq('10')
      })
      it('Should not display any previous word at game start', () => {
        expect(previousWord.textContent).to.eq('')
      })
      it('Should not display any incorrect letters at game start', () => {
        expect(incorrectLettersDisplay.textContent).to.eq('')
      })
      it('Should display 0 wins at game start', () => {
        expect(winDisplay.textContent).to.eq('0')
      })
      it('Should display 0 losses at game start', () => {
        expect(lossDisplay.textContent).to.eq('0')
      })
    })
    describe('Playing against the word "bananas" and winning', () => {
      it('Should count "b" as a correct guess', () => {
        pressKey('b')
        expect(wordToGuess.textContent).to.eq('b______')
        expect(remainingGuessDisplay.textContent).to.eq('10')
        expect(incorrectLettersDisplay.textContent.includes('b')).to.be.false
      })
      it('Should count "i" as an incorrect guess', () => {
        pressKey('i')
        expect(wordToGuess.textContent).to.eq('b______')
        expect(incorrectLettersDisplay.textContent.includes('i')).to.be.true
        expect(incorrectLettersDisplay.textContent.includes('b')).to.be.false
        expect(remainingGuessDisplay.textContent).to.eq('9')
      })
      it('Solving the word should increase wins and reset the game with the next word', () => {
        sinon.stub(Math, 'random').returns(0.43)
        expect(incorrectLettersDisplay.textContent.includes('i')).to.be.true
        expect(remainingGuessDisplay.textContent).to.eq('9')
        pressKey('a')
        expect(incorrectLettersDisplay.textContent.includes('b')).to.be.false
        expect(incorrectLettersDisplay.textContent.includes('a')).to.be.false
        expect(remainingGuessDisplay.textContent).to.eq('9')
        expect(wordToGuess.textContent).to.eq('ba_a_a_')
        pressKey('n')
        expect(incorrectLettersDisplay.textContent.includes('b')).to.be.false
        expect(incorrectLettersDisplay.textContent.includes('a')).to.be.false
        expect(incorrectLettersDisplay.textContent.includes('n')).to.be.false
        expect(remainingGuessDisplay.textContent).to.eq('9')
        expect(wordToGuess.textContent).to.eq('banana_')
        pressKey('s')
        expect(winDisplay.textContent).to.eq('1')
        expect(lossDisplay.textContent).to.eq('0')
        expect(incorrectLettersDisplay.textContent).to.eq('')
        expect(remainingGuessDisplay.textContent).to.eq('10')
        expect(wordToGuess.textContent).to.eq('__________')
      })
    })
    describe('Playing against the word "javascript" and winning', () => {
      it('should display previous word "bananas"', () => {
        expect(previousWord.textContent).to.eq('bananas')
      })
      it('Should count 3 incorrect guesses', () => {
        pressKey('x')
        expect(remainingGuessDisplay.textContent).to.eq('9')
        expect(incorrectLettersDisplay.textContent.includes('x')).to.be.true
        expect(wordToGuess.textContent).to.eq('__________')
        pressKey('y')
        expect(remainingGuessDisplay.textContent).to.eq('8')
        expect(incorrectLettersDisplay.textContent.includesLetters('xy')).to.be.true
        expect(wordToGuess.textContent).to.eq('__________')
        pressKey('z')
        expect(remainingGuessDisplay.textContent).to.eq('7')
        expect(wordToGuess.textContent).to.eq('__________')
        expect(incorrectLettersDisplay.textContent.includesLetters('xyz')).to.be.true
      })
      it('Should count 3 correct guesses', () => {
        pressKey('j')
        expect(wordToGuess.textContent).to.eq('j_________')
        pressKey('a')
        expect(wordToGuess.textContent).to.eq('ja_a______')
        pressKey('v')
        expect(wordToGuess.textContent).to.eq('java______')
        expect(remainingGuessDisplay.textContent).to.eq('7')
      })
      it('Solving the word should increase wins and reset the game with the next word', () => {
        sinon.stub(Math, 'random').returns(0.99)
        expect(wordToGuess.textContent).to.eq('java______')
        expect(incorrectLettersDisplay.textContent.includesLetters('xyz')).to.be.true
        expect(remainingGuessDisplay.textContent).to.eq('7')
        pressKey('s')
        expect(wordToGuess.textContent).to.eq('javas_____')
        pressKey('c')
        expect(wordToGuess.textContent).to.eq('javasc____')
        pressKey('r')
        expect(wordToGuess.textContent).to.eq('javascr___')
        pressKey('i')
        expect(wordToGuess.textContent).to.eq('javascri__')
        pressKey('p')
        expect(wordToGuess.textContent).to.eq('javascrip_')
        pressKey('t')
        expect(wordToGuess.textContent).to.eq('_____')
        expect(winDisplay.textContent).to.eq('2')
        expect(lossDisplay.textContent).to.eq('0')
        expect(incorrectLettersDisplay.textContent).to.eq('')
        expect(remainingGuessDisplay.textContent).to.eq('10')
      })
    })
    describe('Playing against the word "mango" and losing', () => {
      it('should display previous word "javascript"', () => {
        expect(previousWord.textContent).to.eq('javascript')
      })
      it('Should count 3 incorrect guesses', () => {
        pressKey('x')
        expect(remainingGuessDisplay.textContent).to.eq('9')
        expect(incorrectLettersDisplay.textContent.includes('x')).to.be.true
        expect(wordToGuess.textContent).to.eq('_____')
        pressKey('y')
        expect(remainingGuessDisplay.textContent).to.eq('8')
        expect(incorrectLettersDisplay.textContent.includesLetters('xy')).to.be.true
        expect(wordToGuess.textContent).to.eq('_____')
        pressKey('z')
        expect(remainingGuessDisplay.textContent).to.eq('7')
        expect(wordToGuess.textContent).to.eq('_____')
        expect(incorrectLettersDisplay.textContent.includesLetters('xyz')).to.be.true
      })
      it('Should count a mix of 4 correct and 7 incorrect guesses correctly', () => {
        pressKey('m')
        expect(remainingGuessDisplay.textContent).to.eq('7')
        expect(wordToGuess.textContent).to.eq('m____')
        expect(incorrectLettersDisplay.textContent.includesLetters('xyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includes('m')).to.be.false

        pressKey('w')
        expect(remainingGuessDisplay.textContent).to.eq('6')
        expect(wordToGuess.textContent).to.eq('m____')
        expect(incorrectLettersDisplay.textContent.includesLetters('wxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includes('m')).to.be.false

        pressKey('a')
        expect(remainingGuessDisplay.textContent).to.eq('6')
        expect(wordToGuess.textContent).to.eq('ma___')
        expect(incorrectLettersDisplay.textContent.includesLetters('wxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('ma')).to.be.false

        pressKey('v')
        expect(remainingGuessDisplay.textContent).to.eq('5')
        expect(wordToGuess.textContent).to.eq('ma___')
        expect(incorrectLettersDisplay.textContent.includesLetters('vwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('ma')).to.be.false

        pressKey('u')
        expect(remainingGuessDisplay.textContent).to.eq('4')
        expect(wordToGuess.textContent).to.eq('ma___')
        expect(incorrectLettersDisplay.textContent.includesLetters('uvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('ma')).to.be.false

        pressKey('n')
        expect(remainingGuessDisplay.textContent).to.eq('4')
        expect(wordToGuess.textContent).to.eq('man__')
        expect(incorrectLettersDisplay.textContent.includesLetters('uvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('man')).to.be.false

        pressKey('t')
        expect(remainingGuessDisplay.textContent).to.eq('3')
        expect(wordToGuess.textContent).to.eq('man__')
        expect(incorrectLettersDisplay.textContent.includesLetters('tuvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('man')).to.be.false

        pressKey('s')
        expect(remainingGuessDisplay.textContent).to.eq('2')
        expect(wordToGuess.textContent).to.eq('man__')
        expect(incorrectLettersDisplay.textContent.includesLetters('stuvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('man')).to.be.false

        pressKey('g')
        expect(remainingGuessDisplay.textContent).to.eq('2')
        expect(wordToGuess.textContent).to.eq('mang_')
        expect(incorrectLettersDisplay.textContent.includesLetters('stuvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('mang')).to.be.false

        pressKey('r')
        expect(remainingGuessDisplay.textContent).to.eq('1')
        expect(wordToGuess.textContent).to.eq('mang_')
        expect(incorrectLettersDisplay.textContent.includesLetters('rstuvwxyz')).to.be.true
        expect(incorrectLettersDisplay.textContent.includesLetters('mang')).to.be.false

        pressKey('q')
        expect(remainingGuessDisplay.textContent).to.eq('10')
        expect(winDisplay.textContent).to.eq('2')
        expect(lossDisplay.textContent).to.eq('1')
      })
    })
  });

  mocha.run();
}