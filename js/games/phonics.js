/* ==========================================================
   GAME 6: ANIMAL PHONICS (FIRST LETTER MATCH)
   ========================================================== */
const PHONICS_ITEMS = [
  // A
  { char: 'A', name: 'Alligator', emoji: '🐊' },
  { char: 'A', name: 'Alpaca', emoji: '🦙' },
  { char: 'A', name: 'Ant', emoji: '🐜' },
  // B
  { char: 'B', name: 'Bear', emoji: '🐻' },
  { char: 'B', name: 'Bee', emoji: '🐝' },
  { char: 'B', name: 'Butterfly', emoji: '🦋' },
  { char: 'B', name: 'Beaver', emoji: '🦫' },
  // C
  { char: 'C', name: 'Cat', emoji: '🐱' },
  { char: 'C', name: 'Cow', emoji: '🐮' },
  { char: 'C', name: 'Crab', emoji: '🦀' },
  { char: 'C', name: 'Camel', emoji: '🐪' },
  // D
  { char: 'D', name: 'Dog', emoji: '🐶' },
  { char: 'D', name: 'Duck', emoji: '🦆' },
  { char: 'D', name: 'Dolphin', emoji: '🐬' },
  { char: 'D', name: 'Dinosaur', emoji: '🦖' },
  { char: 'D', name: 'Deer', emoji: '🦌' },
  // E
  { char: 'E', name: 'Elephant', emoji: '🐘' },
  { char: 'E', name: 'Eagle', emoji: '🦅' },
  // F
  { char: 'F', name: 'Frog', emoji: '🐸' },
  { char: 'F', name: 'Flamingo', emoji: '🦩' },
  { char: 'F', name: 'Fox', emoji: '🦊' },
  { char: 'F', name: 'Fish', emoji: '🐟' },
  // G
  { char: 'G', name: 'Giraffe', emoji: '🦒' },
  { char: 'G', name: 'Gorilla', emoji: '🦍' },
  { char: 'G', name: 'Goat', emoji: '🐐' },
  // H
  { char: 'H', name: 'Horse', emoji: '🐴' },
  { char: 'H', name: 'Hippo', emoji: '🦛' },
  { char: 'H', name: 'Hedgehog', emoji: '🦔' },
  { char: 'H', name: 'Hamster', emoji: '🐹' },
  // I
  { char: 'I', name: 'Iguana', emoji: '🦎' },
  // J
  { char: 'J', name: 'Jaguar', emoji: '🐆' },
  { char: 'J', name: 'Jellyfish', emoji: '🪼' },
  // K
  { char: 'K', name: 'Kangaroo', emoji: '🦘' },
  { char: 'K', name: 'Koala', emoji: '🐨' },
  // L
  { char: 'L', name: 'Lion', emoji: '🦁' },
  { char: 'L', name: 'Leopard', emoji: '🐆' },
  { char: 'L', name: 'Llama', emoji: '🦙' },
  { char: 'L', name: 'Lobster', emoji: '🦞' },
  // M
  { char: 'M', name: 'Monkey', emoji: '🐵' },
  { char: 'M', name: 'Mouse', emoji: '🐭' },
  { char: 'M', name: 'Moose', emoji: '🫎' },
  // N
  { char: 'N', name: 'Narwhal', emoji: '🐳' },
  // O
  { char: 'O', name: 'Owl', emoji: '🦉' },
  { char: 'O', name: 'Octopus', emoji: '🐙' },
  { char: 'O', name: 'Otter', emoji: '🦦' },
  { char: 'O', name: 'Ostrich', emoji: '🦤' },
  // P
  { char: 'P', name: 'Panda', emoji: '🐼' },
  { char: 'P', name: 'Penguin', emoji: '🐧' },
  { char: 'P', name: 'Pig', emoji: '🐷' },
  { char: 'P', name: 'Parrot', emoji: '🦜' },
  // Q
  { char: 'Q', name: 'Quail', emoji: '🐦' },
  // R
  { char: 'R', name: 'Rabbit', emoji: '🐰' },
  { char: 'R', name: 'Raccoon', emoji: '🦝' },
  { char: 'R', name: 'Rhino', emoji: '🦏' },
  // S
  { char: 'S', name: 'Shark', emoji: '🦈' },
  { char: 'S', name: 'Sheep', emoji: '🐑' },
  { char: 'S', name: 'Sloth', emoji: '🦥' },
  { char: 'S', name: 'Snake', emoji: '🐍' },
  // T
  { char: 'T', name: 'Tiger', emoji: '🐯' },
  { char: 'T', name: 'Turtle', emoji: '🐢' },
  { char: 'T', name: 'Toucan', emoji: '🦜' },
  // U
  { char: 'U', name: 'Unicorn', emoji: '🦄' },
  // V
  { char: 'V', name: 'Vulture', emoji: '🦅' },
  // W
  { char: 'W', name: 'Whale', emoji: '🐳' },
  { char: 'W', name: 'Walrus', emoji: '🦭' },
  { char: 'W', name: 'Wolf', emoji: '🐺' },
  // X
  { char: 'X', name: 'X-ray Fish', emoji: '🐟' },
  // Y
  { char: 'Y', name: 'Yak', emoji: '🐂' },
  // Z
  { char: 'Z', name: 'Zebra', emoji: '🦓' }
];

const phonicsGame = {
  emojiEl: document.getElementById('phonics-emoji'),
  slotEl: document.getElementById('phonics-slot'),
  restWordEl: document.getElementById('phonics-rest-word'),
  optionsRowEl: document.getElementById('phonics-options-row'),
  btnSpeak: document.getElementById('phonics-speak-btn'),
  btnNext: document.getElementById('phonics-next-btn'),

  currentItem: null,
  options: [],
  isResolved: false,

  init() {
    if (this.btnSpeak) {
      this.btnSpeak.addEventListener('click', () => this.speakPrompt());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextWord());
    }
  },

  start() {
    this.nextWord();
  },

  stop() {},

  nextWord() {
    this.isResolved = false;

    // Pick a random animal item, avoiding repeating the same animal immediately
    let nextItem;
    do {
      const idx = Math.floor(Math.random() * PHONICS_ITEMS.length);
      nextItem = PHONICS_ITEMS[idx];
    } while (PHONICS_ITEMS.length > 1 && this.currentItem && nextItem.name === this.currentItem.name);
    this.currentItem = nextItem;

    // Build 4 options (1 correct + 3 random distinct letters)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => c !== this.currentItem.char);
    const distractors = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
    this.options = [this.currentItem.char, ...distractors].sort(() => Math.random() - 0.5);

    this.render();
    this.speakPrompt();
  },

  speakPrompt() {
    if (!this.currentItem) return;
    sound.speak(`What letter does ${this.currentItem.name} start with?`, true);
  },

  render() {
    if (!this.currentItem) return;
    this.emojiEl.textContent = this.currentItem.emoji;
    this.slotEl.textContent = '?';
    this.slotEl.className = 'phonics-slot';

    // The rest of the word letters without extra spaces (CSS handles letter-spacing)
    const rest = this.currentItem.name.slice(1).toUpperCase();
    this.restWordEl.textContent = rest;

    // Responsive scaling class based on word length so words never wrap to a 2nd row
    const wordDisplay = this.slotEl.parentElement;
    if (wordDisplay) {
      wordDisplay.classList.remove('length-short', 'length-medium', 'length-long', 'length-xl');
      const totalLen = this.currentItem.name.length;
      if (totalLen <= 4) {
        wordDisplay.classList.add('length-short');
      } else if (totalLen <= 6) {
        wordDisplay.classList.add('length-medium');
      } else if (totalLen <= 8) {
        wordDisplay.classList.add('length-long');
      } else {
        wordDisplay.classList.add('length-xl');
      }
    }

    this.optionsRowEl.innerHTML = '';
    this.options.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'phonics-btn';
      btn.textContent = letter;
      btn.dataset.letter = letter;

      btn.addEventListener('click', () => this.handleGuess(letter, btn));
      this.optionsRowEl.appendChild(btn);
    });
  },

  handleGuess(letter, btnEl) {
    if (this.isResolved || !this.currentItem) return;

    if (letter.toUpperCase() === this.currentItem.char.toUpperCase()) {
      this.isResolved = true;
      this.slotEl.textContent = this.currentItem.char;
      this.slotEl.classList.add('filled');

      sound.playSuccess();
      sound.speak(`${this.currentItem.char} is for ${this.currentItem.name}!`, true);
      showBanner(`⭐ Great Job! +2`);
      updateStars(2);

      // Disable buttons
      const btns = this.optionsRowEl.querySelectorAll('.phonics-btn');
      btns.forEach(b => b.disabled = true);

      // Advance after a brief celebration
      setTimeout(() => {
        if (state.currentGame === 'phonics') {
          this.nextWord();
        }
      }, 1900);
    } else {
      sound.playBoop();
      if (btnEl) {
        btnEl.classList.add('wrong-shake');
        setTimeout(() => btnEl.classList.remove('wrong-shake'), 450);
      }
      sound.speak(`That is ${letter}. Find ${this.currentItem.char} for ${this.currentItem.name}!`, true);
    }
  },

  handleKeyPress(key) {
    if (!key || key.length !== 1 || this.isResolved) return;
    const btn = Array.from(this.optionsRowEl.querySelectorAll('.phonics-btn'))
      .find(b => b.dataset.letter.toLowerCase() === key.toLowerCase());
    this.handleGuess(key.toUpperCase(), btn);
  }
};

phonicsGame.init();
