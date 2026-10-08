/* ==========================================================
   GAME 8: SIGHT WORD SAFARI (MOUSE-CLICK LISTENING)
   ========================================================== */
const SIGHT_WORDS = [
  'the', 'to', 'and', 'a', 'I', 'you', 'it', 'in', 'said', 'for',
  'up', 'look', 'is', 'go', 'we', 'little', 'down', 'can', 'see',
  'not', 'one', 'my', 'me', 'big', 'come', 'blue', 'red', 'where',
  'jump', 'away', 'here', 'help', 'make', 'yellow', 'two', 'play',
  'run', 'find', 'three'
];

const CARD_THEMES = [
  { border: '#f43f5e', bgHover: '#fff1f2' },
  { border: '#0284c7', bgHover: '#f0f9ff' },
  { border: '#d97706', bgHover: '#fffbeb' },
  { border: '#7c3aed', bgHover: '#f5f3ff' }
];

const sightGame = {
  gridEl: document.getElementById('sight-grid'),
  btnSpeak: document.getElementById('sight-speak-btn'),
  btnNext: document.getElementById('sight-next-btn'),

  targetWord: '',
  options: [],
  isResolved: false,

  init() {
    this.repeatBtn = document.getElementById('sight-repeat-btn');
    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', () => this.speakTarget());
    }
    if (this.btnSpeak) {
      this.btnSpeak.addEventListener('click', () => this.speakTarget());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextRound());
    }
  },

  start() {
    this.nextRound();
  },

  stop() {},

  nextRound() {
    this.isResolved = false;

    // Pick 1 target word
    const idx = Math.floor(Math.random() * SIGHT_WORDS.length);
    this.targetWord = SIGHT_WORDS[idx];

    // Pick 3 distinct distractors
    const pool = SIGHT_WORDS.filter(w => w.toLowerCase() !== this.targetWord.toLowerCase());
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);

    this.options = [this.targetWord, ...distractors].sort(() => Math.random() - 0.5);

    this.render();
    // Speak prompt after brief render delay
    setTimeout(() => this.speakTarget(), 200);
  },

  speakTarget() {
    if (!this.targetWord) return;
    sound.speak(`Can you find the word: ${this.targetWord}?`, true);
  },

  render() {
    this.gridEl.innerHTML = '';

    this.options.forEach((word, idx) => {
      const card = document.createElement('div');
      card.className = 'sight-word-card';
      card.textContent = word;
      card.dataset.word = word;

      // Color accent
      const theme = CARD_THEMES[idx % CARD_THEMES.length];
      card.style.borderColor = theme.border;

      card.addEventListener('click', () => this.handleCardClick(word, card));
      this.gridEl.appendChild(card);
    });
  },

  handleCardClick(clickedWord, cardEl) {
    if (this.isResolved) return;

    if (clickedWord.toLowerCase() === this.targetWord.toLowerCase()) {
      this.isResolved = true;
      cardEl.classList.add('card-correct');

      sound.playSuccess();
      sound.speak(`Yes! That is "${this.targetWord}"!`, true);
      showBanner(`⭐ Found "${this.targetWord}"! +2`);
      updateStars(2);

      // Disable clicking
      const cards = this.gridEl.querySelectorAll('.sight-word-card');
      cards.forEach(c => c.style.pointerEvents = 'none');

      // Next round after celebration
      setTimeout(() => {
        if (state.currentGame === 'sight') {
          this.nextRound();
        }
      }, 1600);
    } else {
      sound.playBoop();
      cardEl.classList.add('card-wrong');
      setTimeout(() => cardEl.classList.remove('card-wrong'), 450);

      sound.speak(`That is "${clickedWord}". Can you find "${this.targetWord}"?`, true);
    }
  }
};
sightGame.init();
