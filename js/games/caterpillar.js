/* ==========================================================
   GAME 7: SPELLING CATERPILLAR
   ========================================================== */
const CATERPILLAR_WORDS = [
  { word: 'CAT', emoji: '🐱', hint: 'Cat' },
  { word: 'DOG', emoji: '🐶', hint: 'Dog' },
  { word: 'SUN', emoji: '☀️', hint: 'Sun' },
  { word: 'PIG', emoji: '🐷', hint: 'Pig' },
  { word: 'BUS', emoji: '🚌', hint: 'Bus' },
  { word: 'HAT', emoji: '🎩', hint: 'Hat' },
  { word: 'FOX', emoji: '🦊', hint: 'Fox' },
  { word: 'CUP', emoji: '☕', hint: 'Cup' },
  { word: 'BUG', emoji: '🐛', hint: 'Bug' },
  { word: 'BOX', emoji: '📦', hint: 'Box' },
  { word: 'FISH', emoji: '🐟', hint: 'Fish' },
  { word: 'FROG', emoji: '🐸', hint: 'Frog' },
  { word: 'STAR', emoji: '⭐', hint: 'Star' },
  { word: 'DUCK', emoji: '🦆', hint: 'Duck' }
];

const SEGMENT_COLORS = [
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#10b981'  // emerald
];

const caterpillarGame = {
  emojiEl: document.getElementById('cat-item-emoji'),
  promptEl: document.getElementById('cat-prompt-text'),
  trackEl: document.getElementById('cat-track'),
  keypadEl: document.getElementById('cat-keypad'),
  btnSpeak: document.getElementById('cat-speak-btn'),
  btnNext: document.getElementById('cat-next-btn'),

  currentWordObj: null,
  currentIndex: 0,
  isFinished: false,

  init() {
    if (this.btnSpeak) {
      this.btnSpeak.addEventListener('click', () => this.speakWord());
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
    this.isFinished = false;
    this.currentIndex = 0;
    const idx = Math.floor(Math.random() * CATERPILLAR_WORDS.length);
    this.currentWordObj = CATERPILLAR_WORDS[idx];

    this.render();
    this.speakWord();
  },

  speakWord() {
    if (!this.currentWordObj) return;
    sound.speak(`Spell the word: ${this.currentWordObj.hint}!`, true);
  },

  render() {
    if (!this.currentWordObj) return;
    this.emojiEl.textContent = this.currentWordObj.emoji;
    this.promptEl.textContent = `Spell: ${this.currentWordObj.word}`;

    // Render caterpillar track
    this.trackEl.innerHTML = '';

    // Head
    const head = document.createElement('div');
    head.className = 'caterpillar-head';
    head.innerHTML = `
      <div class="caterpillar-antenna"><span>🌿</span><span>🌿</span></div>
      <div class="caterpillar-face">😊</div>
    `;
    this.trackEl.appendChild(head);

    // Segments for each letter
    const letters = this.currentWordObj.word.split('');
    letters.forEach((letter, i) => {
      const seg = document.createElement('div');
      seg.className = 'caterpillar-segment';
      seg.dataset.idx = i;
      seg.dataset.letter = letter;

      if (i === 0) {
        seg.classList.add('active-seg');
        seg.textContent = letter; // helper shows what to type
      } else {
        seg.textContent = '?';
      }

      this.trackEl.appendChild(seg);
    });

    // Render keypad helper below
    this.renderKeypad();
  },

  renderKeypad() {
    this.keypadEl.innerHTML = '';
    const wordLetters = this.currentWordObj.word.split('');
    // Add a few distractors
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => !wordLetters.includes(c));
    const extra = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
    const keys = [...new Set([...wordLetters, ...extra])].sort();

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'cat-key-btn';
      btn.textContent = k;
      btn.addEventListener('click', () => this.handleKeyPress(k));
      this.keypadEl.appendChild(btn);
    });
  },

  handleKeyPress(key) {
    if (!key || key.length !== 1 || this.isFinished || !this.currentWordObj) return;
    const targetChar = this.currentWordObj.word[this.currentIndex];

    if (key.toUpperCase() === targetChar.toUpperCase()) {
      // Correct letter!
      sound.playPop();

      const seg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
      if (seg) {
        seg.classList.remove('active-seg');
        seg.classList.add('filled-seg');
        seg.textContent = targetChar;
        seg.style.backgroundColor = SEGMENT_COLORS[this.currentIndex % SEGMENT_COLORS.length];
      }

      this.currentIndex++;

      if (this.currentIndex >= this.currentWordObj.word.length) {
        // Word complete!
        this.handleComplete();
      } else {
        // Activate next segment
        const nextSeg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
        if (nextSeg) {
          nextSeg.classList.add('active-seg');
          nextSeg.textContent = this.currentWordObj.word[this.currentIndex];
        }
      }
    } else {
      // Gentle boop
      sound.playBoop();
      const currentSeg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
      if (currentSeg) {
        currentSeg.style.transform = 'scale(0.95)';
        setTimeout(() => currentSeg.style.transform = '', 200);
      }
    }
  },

  handleComplete() {
    this.isFinished = true;
    sound.playFlutter();
    sound.playFanfare();
    sound.speak(`You spelled ${this.currentWordObj.hint}! Fantastic!`, true);
    showBanner(`🦋 Beautiful! +3 ⭐`);
    updateStars(3);

    // Butterfly animation
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly-fly';
    butterfly.textContent = '🦋';
    this.trackEl.appendChild(butterfly);

    setTimeout(() => {
      if (state.currentGame === 'caterpillar') {
        this.nextWord();
      }
    }, 2200);
  }
};
caterpillarGame.init();
