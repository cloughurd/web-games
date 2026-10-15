/* ==========================================================
   GAME 9: PUMPKIN CARVER (JACK-O'-LANTERN)
   ========================================================== */
const PUMPKIN_FACES = [
  {
    name: 'Classic Jack',
    subtitle: 'Classic Halloween Jack-o\'-Lantern! 🎃',
    features: [
      { id: 'eye-left', label: 'Left Eye', d: 'M 135 150 L 165 195 L 105 195 Z', bx: 135, by: 180 },
      { id: 'eye-right', label: 'Right Eye', d: 'M 265 150 L 295 195 L 235 195 Z', bx: 265, by: 180 },
      { id: 'nose', label: 'Nose', d: 'M 200 230 L 216 200 L 184 200 Z', bx: 200, by: 212 },
      { id: 'mouth', label: 'Smile', d: 'M 105 245 Q 200 325 295 245 Q 262 268 245 255 L 245 272 Q 200 295 155 272 L 155 255 Q 138 268 105 245 Z', bx: 200, by: 278 }
    ]
  },
  {
    name: 'Star Eyes',
    subtitle: 'Magical Star-Eyed Pumpkin! ⭐',
    features: [
      // 5-pointed star left
      { id: 'eye-left', label: 'Star Eye', d: 'M 135 145 L 142 165 L 163 166 L 146 179 L 153 199 L 135 186 L 117 199 L 124 179 L 107 166 L 128 165 Z', bx: 135, by: 172 },
      // 5-pointed star right
      { id: 'eye-right', label: 'Star Eye', d: 'M 265 145 L 272 165 L 293 166 L 276 179 L 283 199 L 265 186 L 247 199 L 254 179 L 237 166 L 258 165 Z', bx: 265, by: 172 },
      // Cute heart nose
      { id: 'nose', label: 'Heart Nose', d: 'M 200 228 C 185 210, 180 196, 192 196 C 198 196, 200 202, 200 202 C 200 202, 202 196, 208 196 C 220 196, 215 210, 200 228 Z', bx: 200, by: 210 },
      // Wide crescent smile with two teeth
      { id: 'mouth', label: 'Happy Smile', d: 'M 115 250 Q 200 320 285 250 Q 248 266 230 256 L 230 270 Q 200 292 170 270 L 170 256 Q 152 266 115 250 Z', bx: 200, by: 282 }
    ]
  },
  {
    name: 'Cute Kitty',
    subtitle: 'Adorable Kitty Pumpkin! 🐱',
    features: [
      // Slanted almond cat eye left
      { id: 'eye-left', label: 'Cat Eye', d: 'M 108 178 Q 135 152 162 178 Q 135 200 108 178 Z', bx: 135, by: 178 },
      // Slanted almond cat eye right
      { id: 'eye-right', label: 'Cat Eye', d: 'M 238 178 Q 265 152 292 178 Q 265 200 238 178 Z', bx: 265, by: 178 },
      // Little triangle nose
      { id: 'nose', label: 'Kitty Nose', d: 'M 188 206 L 212 206 L 200 222 Z', bx: 200, by: 212 },
      // Cat "w" smile
      { id: 'mouth', label: 'Kitty Smile', d: 'M 130 252 Q 165 285 200 256 Q 235 285 270 252 Q 235 272 200 246 Q 165 272 130 252 Z', bx: 200, by: 265 }
    ]
  },
  {
    name: 'Silly Monster',
    subtitle: 'Winking Silly Monster! 🤪',
    features: [
      // Big round surprised eye left
      { id: 'eye-left', label: 'Big Eye', d: 'M 135 150 A 25 25 0 1 0 135 200 A 25 25 0 1 0 135 150 Z', bx: 135, by: 175 },
      // Winking slash eye right
      { id: 'eye-right', label: 'Wink Eye', d: 'M 240 178 L 290 162 L 290 174 L 240 190 Z', bx: 265, by: 176 },
      // Diamond nose
      { id: 'nose', label: 'Diamond Nose', d: 'M 200 200 L 214 214 L 200 228 L 186 214 Z', bx: 200, by: 214 },
      // Zigzag monster teeth
      { id: 'mouth', label: 'Zigzag Teeth', d: 'M 115 256 L 140 274 L 165 256 L 190 276 L 215 256 L 240 276 L 265 256 L 285 270 Q 200 325 115 256 Z', bx: 200, by: 284 }
    ]
  },
  {
    name: 'Vampire Jack',
    subtitle: 'Spooky Vampire Jack with Fangs! 🧛',
    features: [
      // Bat wing eye left
      { id: 'eye-left', label: 'Bat Eye', d: 'M 110 162 Q 135 150 160 172 Q 140 192 110 162 Z', bx: 135, by: 172 },
      // Bat wing eye right
      { id: 'eye-right', label: 'Bat Eye', d: 'M 290 162 Q 265 150 240 172 Q 260 192 290 162 Z', bx: 265, by: 172 },
      // Triangle nose
      { id: 'nose', label: 'Bat Nose', d: 'M 200 228 L 215 202 L 185 202 Z', bx: 200, by: 214 },
      // Mouth with 2 vampire fangs
      { id: 'mouth', label: 'Fang Smile', d: 'M 115 248 Q 200 325 285 248 Q 260 262 250 252 L 244 280 L 235 255 Q 200 270 165 255 L 156 280 L 150 252 Q 140 262 115 248 Z', bx: 200, by: 284 }
    ]
  }
];

const carverGame = {
  stageEl: document.getElementById('carver-stage'),
  titleEl: document.getElementById('carver-title'),
  subtitleEl: document.getElementById('carver-subtitle'),
  featuresGroupEl: document.getElementById('carver-features-group'),
  keypadEl: document.getElementById('carver-keypad'),
  actionsBarEl: document.getElementById('carver-actions-bar'),
  nextBtn: document.getElementById('carver-next-btn'),

  currentFaceIndex: 0,
  currentFace: null,
  activeLetters: [], // [{ featureId, letter, carved: false }]
  candleTheme: 'candle-gold',
  isComplete: false,

  init() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextPumpkin());
    }

    // Glow theme switchers
    const themeBtns = this.stageEl.querySelectorAll('.carver-theme-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCandleTheme(btn.dataset.theme);
      });
    });
  },

  start() {
    this.nextPumpkin();
  },

  stop() {},

  setCandleTheme(theme) {
    this.candleTheme = theme;
    this.stageEl.classList.remove('candle-gold', 'candle-purple', 'candle-green', 'candle-cyan');
    this.stageEl.classList.add(theme);
    if (this.isComplete) {
      sound.playCarve();
    }
  },

  nextPumpkin() {
    this.isComplete = false;
    this.stageEl.classList.remove('lit-up');
    this.setCandleTheme('candle-gold');
    this.actionsBarEl.classList.remove('show');

    // Pick face
    this.currentFace = PUMPKIN_FACES[this.currentFaceIndex % PUMPKIN_FACES.length];
    this.currentFaceIndex++;

    this.titleEl.textContent = `Carve: ${this.currentFace.name}`;
    this.subtitleEl.textContent = this.currentFace.subtitle;

    // Pick distinct letters for each feature
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = alphabet.sort(() => Math.random() - 0.5);

    this.activeLetters = this.currentFace.features.map((feat, idx) => ({
      featureId: feat.id,
      label: feat.label,
      d: feat.d,
      bx: feat.bx,
      by: feat.by,
      letter: shuffled[idx],
      carved: false
    }));

    this.render();
    sound.speak(`Let's carve a ${this.currentFace.name}! Press a letter to carve!`, true);
  },

  render() {
    if (!this.currentFace || !this.featuresGroupEl) return;
    this.featuresGroupEl.innerHTML = '';

    // Render each carving feature on the pumpkin SVG
    this.activeLetters.forEach((item, idx) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.dataset.id = item.featureId;
      g.dataset.letter = item.letter;

      // The cut path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', item.d);

      if (item.carved) {
        path.setAttribute('class', 'carve-shape-carved');
      } else {
        path.setAttribute('class', 'carve-shape-uncarved' + (idx === this.getNextUncarvedIndex() ? ' carve-shape-active' : ''));
        path.addEventListener('click', () => this.carvePiece(item.letter));
      }
      g.appendChild(path);

      // If uncarved, render circular letter badge in the center
      if (!item.carved) {
        const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badgeG.setAttribute('class', 'carve-badge');
        badgeG.setAttribute('transform', `translate(${item.bx}, ${item.by})`);
        badgeG.addEventListener('click', () => this.carvePiece(item.letter));

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '17');
        circle.setAttribute('class', 'carve-badge-circle');
        badgeG.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'carve-badge-text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.textContent = item.letter;
        badgeG.appendChild(text);

        g.appendChild(badgeG);
      }

      this.featuresGroupEl.appendChild(g);
    });

    // Render touch keypad below
    this.renderKeypad();
  },

  renderKeypad() {
    this.keypadEl.innerHTML = '';
    this.activeLetters.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'carver-key-btn' + (item.carved ? ' carved-done' : '');
      btn.textContent = item.letter;
      btn.title = `Carve ${item.label} (${item.letter})`;
      if (!item.carved) {
        btn.addEventListener('click', () => this.carvePiece(item.letter));
      }
      this.keypadEl.appendChild(btn);
    });
  },

  getNextUncarvedIndex() {
    return this.activeLetters.findIndex(i => !i.carved);
  },

  carvePiece(key) {
    if (!key || this.isComplete) return;
    const target = this.activeLetters.find(i => !i.carved && i.letter.toUpperCase() === key.toUpperCase());

    if (target) {
      target.carved = true;
      sound.playCarve();
      sound.speak(target.letter, true);

      this.render();

      // Check if all features carved!
      if (this.activeLetters.every(i => i.carved)) {
        this.handleComplete();
      }
    } else {
      // Gentle boop on unmatched key
      sound.playBoop();
    }
  },

  handleKeyPress(key) {
    if (!key || key.length !== 1 || this.isComplete) return;
    this.carvePiece(key);
  },

  handleComplete() {
    this.isComplete = true;

    // Light up candle!
    setTimeout(() => {
      this.stageEl.classList.add('lit-up');
      sound.playCandleGlow();
      sound.playFanfare();
      sound.speak('Happy Halloween! What a beautiful Jack-o\'-Lantern!', true);
      showBanner('🎃 Happy Halloween! +3 ⭐');
      updateStars(3);

      this.actionsBarEl.classList.add('show');
    }, 450);
  }
};

carverGame.init();
