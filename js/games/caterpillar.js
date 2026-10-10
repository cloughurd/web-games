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
  { word: 'BEE', emoji: '🐝', hint: 'Bee' },
  { word: 'BAT', emoji: '🦇', hint: 'Bat' },
  { word: 'CAR', emoji: '🚗', hint: 'Car' },
  { word: 'COW', emoji: '🐮', hint: 'Cow' },
  { word: 'HEN', emoji: '🐔', hint: 'Hen' },
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
  '#10b981', // emerald
  '#ec4899', // pink
  '#3b82f6', // blue
  '#84cc16'  // lime
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

    // Storybook Caterpillar Head (Rich SVG with curved purple antennas, big eyes, rosy cheeks, feet)
    const head = document.createElement('div');
    head.className = 'caterpillar-head';
    head.title = 'Click me!';
    head.innerHTML = `
      <svg class="caterpillar-head-svg" viewBox="0 0 110 120" width="96" height="105" aria-label="Caterpillar Head">
        <defs>
          <radialGradient id="catHeadGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ff6b6b"/>
            <stop offset="45%" stop-color="#ef4444"/>
            <stop offset="85%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </radialGradient>
          <linearGradient id="catAntennaGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#581c87"/>
            <stop offset="100%" stop-color="#9333ea"/>
          </linearGradient>
          <radialGradient id="catEyeGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="55%" stop-color="#84cc16"/>
            <stop offset="100%" stop-color="#365314"/>
          </radialGradient>
          <filter id="catSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0f172a" flood-opacity="0.2"/>
          </filter>
        </defs>

        <g class="cat-antennas">
          <g class="cat-antenna-group cat-antenna-left">
            <path d="M 42,42 C 34,22 18,12 12,18" fill="none" stroke="url(#catAntennaGrad)" stroke-width="5" stroke-linecap="round"/>
            <circle cx="11" cy="18" r="8" fill="#a855f7" stroke="#6b21a8" stroke-width="2"/>
            <circle cx="8" cy="15" r="2.5" fill="#f3e8ff"/>
          </g>
          <g class="cat-antenna-group cat-antenna-right">
            <path d="M 68,42 C 76,22 92,12 98,18" fill="none" stroke="url(#catAntennaGrad)" stroke-width="5" stroke-linecap="round"/>
            <circle cx="99" cy="18" r="8" fill="#a855f7" stroke="#6b21a8" stroke-width="2"/>
            <circle cx="96" cy="15" r="2.5" fill="#f3e8ff"/>
          </g>
        </g>

        <g class="cat-head-feet">
          <ellipse cx="38" cy="112" rx="7" ry="5" fill="#831843" stroke="#500724" stroke-width="1.5"/>
          <ellipse cx="72" cy="112" rx="7" ry="5" fill="#831843" stroke="#500724" stroke-width="1.5"/>
        </g>

        <ellipse cx="55" cy="74" rx="44" ry="40" fill="url(#catHeadGrad)" stroke="#7f1d1d" stroke-width="3.5" filter="url(#catSoftShadow)"/>
        <ellipse cx="40" cy="50" rx="16" ry="9" fill="#ffffff" opacity="0.32" transform="rotate(-28 40 50)"/>

        <ellipse cx="28" cy="84" rx="8" ry="5" fill="#f43f5e" opacity="0.5"/>
        <ellipse cx="82" cy="84" rx="8" ry="5" fill="#f43f5e" opacity="0.5"/>

        <g class="cat-eye cat-eye-left">
          <ellipse cx="41" cy="66" rx="11" ry="15" fill="url(#catEyeGrad)" stroke="#1e3a1e" stroke-width="2"/>
          <ellipse cx="43" cy="66" rx="6.5" ry="9.5" fill="#15803d"/>
          <circle cx="44" cy="66" r="4.5" fill="#09090b"/>
          <circle cx="41" cy="61" r="3" fill="#ffffff"/>
          <circle cx="46" cy="70" r="1.5" fill="#ffffff"/>
        </g>

        <g class="cat-eye cat-eye-right">
          <ellipse cx="69" cy="66" rx="11" ry="15" fill="url(#catEyeGrad)" stroke="#1e3a1e" stroke-width="2"/>
          <ellipse cx="71" cy="66" rx="6.5" ry="9.5" fill="#15803d"/>
          <circle cx="72" cy="66" r="4.5" fill="#09090b"/>
          <circle cx="69" cy="61" r="3" fill="#ffffff"/>
          <circle cx="74" cy="70" r="1.5" fill="#ffffff"/>
        </g>

        <ellipse cx="55" cy="80" rx="4" ry="2.8" fill="#991b1b"/>
        <path d="M 43,87 Q 55,100 67,87" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 49,92 Q 55,98 61,92 Z" fill="#fb7185"/>
      </svg>
    `;
    head.addEventListener('click', () => {
      sound.playHop();
      sound.speak('Nom nom nom!', true);
    });
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
      }

      const circle = document.createElement('div');
      circle.className = 'caterpillar-segment-circle';
      circle.textContent = (i === 0) ? letter : '?';
      seg.appendChild(circle);

      const feet = document.createElement('div');
      feet.className = 'cat-segment-feet';
      feet.innerHTML = `<span class="cat-foot cat-foot-left"></span><span class="cat-foot cat-foot-right"></span>`;
      seg.appendChild(feet);

      this.trackEl.appendChild(seg);
    });

    // Cute tail segment at the end
    const tail = document.createElement('div');
    tail.className = 'caterpillar-tail';
    tail.innerHTML = `
      <div class="cat-tail-circle"></div>
      <div class="cat-segment-feet">
        <span class="cat-foot cat-foot-left"></span>
        <span class="cat-foot cat-foot-right"></span>
      </div>
    `;
    this.trackEl.appendChild(tail);

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
      // Say the letter name out loud
      sound.speak(targetChar.toUpperCase(), true);

      const seg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
      if (seg) {
        seg.classList.remove('active-seg');
        seg.classList.add('filled-seg');
        const circle = seg.querySelector('.caterpillar-segment-circle');
        if (circle) {
          circle.textContent = targetChar;
          circle.style.backgroundColor = SEGMENT_COLORS[this.currentIndex % SEGMENT_COLORS.length];
        }
      }

      this.currentIndex++;

      if (this.currentIndex >= this.currentWordObj.word.length) {
        // Word complete! Short delay so the final phoneme is heard before fanfare
        setTimeout(() => {
          if (state.currentGame === 'caterpillar') {
            this.handleComplete();
          }
        }, 550);
      } else {
        // Activate next segment
        const nextSeg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
        if (nextSeg) {
          nextSeg.classList.add('active-seg');
          const nextCircle = nextSeg.querySelector('.caterpillar-segment-circle');
          if (nextCircle) {
            nextCircle.textContent = this.currentWordObj.word[this.currentIndex];
          }
        }
      }
    } else {
      // Gentle boop
      sound.playBoop();
      const currentSeg = this.trackEl.querySelector(`.caterpillar-segment[data-idx="${this.currentIndex}"]`);
      if (currentSeg) {
        currentSeg.classList.add('seg-wobble');
        setTimeout(() => currentSeg.classList.remove('seg-wobble'), 300);
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
    }, 2400);
  }
};

caterpillarGame.init();
