/* ==========================================================
   GAME 6: ANIMAL PHONICS (FIRST LETTER MATCH)
   ========================================================== */
const PHONICS_ITEMS = [
  { char: 'A', name: 'Apple', emoji: '🍎', rest: 'P P L E' },
  { char: 'B', name: 'Bear', emoji: '🐻', rest: 'E A R' },
  { char: 'C', name: 'Cat', emoji: '🐱', rest: 'A T' },
  { char: 'D', name: 'Dog', emoji: '🐶', rest: 'O G' },
  { char: 'E', name: 'Elephant', emoji: '🐘', rest: 'L E P H A N T' },
  { char: 'F', name: 'Frog', emoji: '🐸', rest: 'R O G' },
  { char: 'G', name: 'Giraffe', emoji: '🦒', rest: 'I R A F F E' },
  { char: 'H', name: 'Horse', emoji: '🐴', rest: 'O R S E' },
  { char: 'I', name: 'Iguana', emoji: '🦎', rest: 'G U A N A' },
  { char: 'J', name: 'Jellyfish', emoji: '🪼', rest: 'E L L Y' },
  { char: 'K', name: 'Kangaroo', emoji: '🦘', rest: 'A N G A R O O' },
  { char: 'L', name: 'Lion', emoji: '🦁', rest: 'I O N' },
  { char: 'M', name: 'Monkey', emoji: '🐵', rest: 'O N K E Y' },
  { char: 'O', name: 'Owl', emoji: '🦉', rest: 'W L' },
  { char: 'P', name: 'Panda', emoji: '🐼', rest: 'A N D A' },
  { char: 'R', name: 'Rabbit', emoji: '🐰', rest: 'A B B I T' },
  { char: 'S', name: 'Star', emoji: '⭐', rest: 'T A R' },
  { char: 'T', name: 'Tiger', emoji: '🐯', rest: 'I G E R' },
  { char: 'U', name: 'Unicorn', emoji: '🦄', rest: 'N I C O R N' },
  { char: 'W', name: 'Whale', emoji: '🐳', rest: 'H A L E' },
  { char: 'Z', name: 'Zebra', emoji: '🦓', rest: 'E B R A' }
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
    // Pick a random animal item
    const idx = Math.floor(Math.random() * PHONICS_ITEMS.length);
    this.currentItem = PHONICS_ITEMS[idx];

    // Build 4 options (1 correct + 3 random distinct letters)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => c !== this.currentItem.char);
    // Shuffle alphabet
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
    this.restWordEl.textContent = this.currentItem.rest;

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
    if (this.isResolved) return;

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
      }, 1800);
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
