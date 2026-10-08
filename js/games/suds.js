/* ==========================================================
       5. GAME 3: SOAP SCRUB (MYSTERY PICTURE REVEAL)
       ========================================================== */
    const sudsGame = {
      gridEl: document.getElementById('suds-grid'),
      pictureEl: document.getElementById('suds-picture'),
      picContainer: document.getElementById('suds-picture-container'),
      progressEl: document.getElementById('suds-progress'),
      titleEl: document.getElementById('suds-picture-title'),
      btnUpper: document.getElementById('suds-toggle-upper'),
      btnLower: document.getElementById('suds-toggle-lower'),
      btnNumbers: document.getElementById('suds-toggle-numbers'),
      btnNext: document.getElementById('suds-next-btn'),
      btnCustom: document.getElementById('suds-custom-btn'),
      fileInput: document.getElementById('suds-file-input'),

      includeUpper: true,
      includeLower: true,
      includeNumbers: false,

      currentPicIndex: 0,
      customImageSrc: null,
      tiles: [],
      clearedCount: 0,
      totalTiles: 12, // 4 cols x 3 rows

      pictures: [
        {
          title: "Friendly Dino 🦕",
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#fef08a"/></linearGradient>
    <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#22c55e"/></linearGradient>
    <linearGradient id="dinoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#skyGrad)"/>
  <circle cx="340" cy="60" r="36" fill="#facc15"/>
  <circle cx="340" cy="60" r="44" fill="#fef08a" opacity="0.4"/>
  <path d="M50 70 q15 -20 35 0 q20 -15 35 5 q15 15 0 25 h-70 z" fill="#ffffff" opacity="0.9"/>
  <path d="M190 90 q12 -16 28 0 q16 -12 28 4 q12 12 0 20 h-56 z" fill="#ffffff" opacity="0.8"/>
  <ellipse cx="120" cy="310" rx="190" ry="100" fill="#4ade80"/>
  <ellipse cx="320" cy="320" rx="210" ry="110" fill="url(#hillGrad)"/>
  <path d="M120 220 C80 230 60 190 40 180 C60 210 90 240 140 235 Z" fill="url(#dinoGrad)"/>
  <ellipse cx="200" cy="210" rx="65" ry="48" fill="url(#dinoGrad)"/>
  <path d="M235 200 C255 180 260 130 250 100 C250 85 275 80 285 95 C295 105 285 125 275 140 C265 170 255 205 245 220 Z" fill="url(#dinoGrad)"/>
  <circle cx="270" cy="100" r="5" fill="#1e293b"/>
  <circle cx="272" cy="98" r="1.5" fill="#ffffff"/>
  <path d="M272 110 Q280 114 285 108" stroke="#064e3b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="265" cy="112" r="5" fill="#f472b6" opacity="0.6"/>
  <circle cx="180" cy="195" r="9" fill="#fde047" opacity="0.9"/>
  <circle cx="215" cy="190" r="7" fill="#fde047" opacity="0.9"/>
  <circle cx="195" cy="225" r="8" fill="#fde047" opacity="0.9"/>
  <circle cx="248" cy="135" r="5" fill="#fde047" opacity="0.9"/>
  <rect x="160" y="235" width="22" height="38" rx="10" fill="#059669"/>
  <rect x="215" y="235" width="22" height="38" rx="10" fill="#059669"/>
  <circle cx="310" cy="265" r="7" fill="#ec4899"/>
  <circle cx="310" cy="265" r="3" fill="#facc15"/>
</svg>`
        },
        {
          title: "Space Astronaut 🚀",
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="spaceGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="60%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/></linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#spaceGrad)"/>
  <circle cx="50" cy="40" r="2" fill="#fff"/><circle cx="120" cy="80" r="1.5" fill="#fff"/><circle cx="85" cy="170" r="2.5" fill="#fde047"/><circle cx="350" cy="40" r="2" fill="#fff"/><circle cx="280" cy="110" r="2" fill="#fde047"/><circle cx="330" cy="240" r="1.5" fill="#fff"/><circle cx="70" cy="260" r="2" fill="#fff"/>
  <polygon points="170,30 174,38 182,42 174,46 170,54 166,46 158,42 166,38" fill="#fef08a"/>
  <polygon points="320,160 323,166 330,169 323,172 320,178 317,172 310,169 317,166" fill="#fef08a"/>
  <ellipse cx="60" cy="100" rx="26" ry="14" fill="#fb923c" transform="rotate(-20 60 100)"/>
  <circle cx="60" cy="100" r="16" fill="#f97316"/>
  <ellipse cx="60" cy="100" rx="26" ry="5" fill="none" stroke="#fed7aa" stroke-width="4" transform="rotate(-20 60 100)"/>
  <circle cx="340" cy="230" r="35" fill="#38bdf8"/>
  <path d="M320 220 q10 -15 25 -5 q10 15 2 20 z" fill="#4ade80"/>
  <polygon points="180,220 220,220 200,275" fill="#f97316"/>
  <polygon points="188,220 212,220 200,255" fill="#facc15"/>
  <polygon points="160,215 180,180 180,220" fill="#ef4444"/>
  <polygon points="240,215 220,180 220,220" fill="#ef4444"/>
  <path d="M180,180 C180,90 200,60 200,60 C200,60 220,90 220,180 Z" fill="#f8fafc"/>
  <polygon points="180,110 200,60 220,110" fill="#ef4444"/>
  <circle cx="200" cy="135" r="18" fill="#38bdf8" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="200" cy="136" r="10" fill="#b45309"/>
  <circle cx="193" cy="128" r="3.5" fill="#b45309"/><circle cx="207" cy="128" r="3.5" fill="#b45309"/>
  <circle cx="198" cy="134" r="1.5" fill="#fff"/><circle cx="202" cy="134" r="1.5" fill="#fff"/>
  <ellipse cx="200" cy="139" rx="3.5" ry="2" fill="#fde68a"/><circle cx="200" cy="138.5" r="1" fill="#451a03"/>
</svg>`
        },
        {
          title: "Happy Puppy 🐶",
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyPup" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#skyPup)"/>
  <ellipse cx="80" cy="260" rx="180" ry="150" fill="none" stroke="#f87171" stroke-width="8" opacity="0.6"/>
  <ellipse cx="80" cy="260" rx="172" ry="142" fill="none" stroke="#fbbf24" stroke-width="8" opacity="0.6"/>
  <ellipse cx="80" cy="260" rx="164" ry="134" fill="none" stroke="#34d399" stroke-width="8" opacity="0.6"/>
  <ellipse cx="80" cy="260" rx="156" ry="126" fill="none" stroke="#60a5fa" stroke-width="8" opacity="0.6"/>
  <ellipse cx="200" cy="320" rx="260" ry="100" fill="#4ade80"/>
  <ellipse cx="200" cy="205" rx="46" ry="42" fill="#d97706"/>
  <ellipse cx="175" cy="245" rx="14" ry="10" fill="#fef3c7"/>
  <ellipse cx="225" cy="245" rx="14" ry="10" fill="#fef3c7"/>
  <rect x="180" y="166" width="40" height="8" rx="4" fill="#ef4444"/>
  <circle cx="200" cy="176" r="5" fill="#facc15"/>
  <circle cx="200" cy="125" r="42" fill="#f59e0b"/>
  <ellipse cx="155" cy="125" rx="14" ry="28" fill="#b45309" transform="rotate(-15 155 125)"/>
  <ellipse cx="245" cy="125" rx="14" ry="28" fill="#b45309" transform="rotate(15 245 125)"/>
  <circle cx="185" cy="118" r="6" fill="#1e293b"/><circle cx="187" cy="116" r="2" fill="#ffffff"/>
  <circle cx="215" cy="118" r="6" fill="#1e293b"/><circle cx="217" cy="116" r="2" fill="#ffffff"/>
  <ellipse cx="200" cy="138" rx="18" ry="12" fill="#fef3c7"/><ellipse cx="200" cy="132" rx="7" ry="5" fill="#1e293b"/>
  <path d="M194 140 Q200 146 206 140" stroke="#1e293b" stroke-width="2.5" fill="none"/>
  <path d="M198 143 Q200 152 205 148" fill="#f43f5e"/>
  <circle cx="280" cy="235" r="15" fill="#a3e635"/>
  <path d="M270 230 Q280 235 275 248" stroke="#ffffff" stroke-width="2.5" fill="none"/>
</svg>`
        },
        {
          title: "Ocean Clownfish 🐠",
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#seaGrad)"/>
  <polygon points="50,0 80,0 140,300 90,300" fill="#ffffff" opacity="0.08"/>
  <polygon points="200,0 240,0 310,300 250,300" fill="#ffffff" opacity="0.08"/>
  <path d="M0 260 Q100 245 200 260 T400 250 L400 300 L0 300 Z" fill="#fde047"/>
  <path d="M30 270 Q45 210 25 160 Q40 210 35 270" stroke="#22c55e" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M55 270 Q70 190 60 140 Q75 190 65 270" stroke="#16a34a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M340 270 Q325 210 345 150 Q330 210 345 270" stroke="#ec4899" stroke-width="12" fill="none" stroke-linecap="round"/>
  <polygon points="120,265 124,275 134,275 126,282 129,291 120,285 112,291 115,282 107,275 117,275" fill="#f97316"/>
  <circle cx="160" cy="140" r="8" fill="rgba(255,255,255,0.4)" stroke="#fff" stroke-width="1.5"/>
  <circle cx="168" cy="90" r="5" fill="rgba(255,255,255,0.4)" stroke="#fff" stroke-width="1.5"/>
  <circle cx="280" cy="70" r="10" fill="rgba(255,255,255,0.4)" stroke="#fff" stroke-width="1.5"/>
  <polygon points="120,150 90,130 95,170" fill="#f97316"/>
  <polygon points="105,150 90,135 95,165" fill="#ffffff"/>
  <ellipse cx="170" cy="150" rx="42" ry="28" fill="#f97316"/>
  <path d="M155 124 C160 140 160 160 155 176" stroke="#ffffff" stroke-width="9" fill="none"/>
  <path d="M185 125 C190 140 190 160 185 175" stroke="#ffffff" stroke-width="7" fill="none"/>
  <ellipse cx="165" cy="162" rx="10" ry="7" fill="#ea580c" transform="rotate(-20 165 162)"/>
  <circle cx="198" cy="144" r="6" fill="#1e293b"/><circle cx="200" cy="142" r="2" fill="#ffffff"/>
  <path d="M206 153 Q210 156 205 160" stroke="#7c2d12" stroke-width="2" fill="none"/>
</svg>`
        }
      ],

      init() {
        const toggleType = (type) => {
          const activeCount = (this.includeUpper ? 1 : 0) + (this.includeLower ? 1 : 0) + (this.includeNumbers ? 1 : 0);
          if (type === 'upper') {
            if (this.includeUpper && activeCount <= 1) return;
            this.includeUpper = !this.includeUpper;
            this.btnUpper.classList.toggle('active', this.includeUpper);
          } else if (type === 'lower') {
            if (this.includeLower && activeCount <= 1) return;
            this.includeLower = !this.includeLower;
            this.btnLower.classList.toggle('active', this.includeLower);
          } else if (type === 'numbers') {
            if (this.includeNumbers && activeCount <= 1) return;
            this.includeNumbers = !this.includeNumbers;
            this.btnNumbers.classList.toggle('active', this.includeNumbers);
          }
          if (state.currentGame === 'suds') {
            this.loadRound();
          }
        };

        this.btnUpper.addEventListener('click', () => toggleType('upper'));
        this.btnLower.addEventListener('click', () => toggleType('lower'));
        this.btnNumbers.addEventListener('click', () => toggleType('numbers'));

        this.btnNext.addEventListener('click', () => {
          this.customImageSrc = null;
          this.currentPicIndex = (this.currentPicIndex + 1) % this.pictures.length;
          this.loadRound();
        });

        this.btnCustom.addEventListener('click', () => {
          this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            this.customImageSrc = URL.createObjectURL(file);
            this.loadRound();
          }
        });
      },

      start() {
        this.loadRound();
      },

      stop() {},

      getPool() {
        const pool = [];
        if (this.includeUpper) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (this.includeLower) pool.push(...'abcdefghijklmnopqrstuvwxyz');
        if (this.includeNumbers) pool.push(...'0123456789');
        if (pool.length === 0) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return pool;
      },

      loadRound() {
        this.picContainer.classList.remove('celebrate-glow');
        this.clearedCount = 0;
        this.tiles = [];
        this.gridEl.innerHTML = '';

        if (this.customImageSrc) {
          this.titleEl.textContent = "My Family Photo 📸";
          this.pictureEl.innerHTML = `<img src="${this.customImageSrc}" alt="Custom Photo">`;
        } else {
          const pic = this.pictures[this.currentPicIndex];
          this.titleEl.textContent = pic.title;
          this.pictureEl.innerHTML = pic.svg;
        }

        const pool = [...this.getPool()];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const chosenChars = [];
        for (let i = 0; i < this.totalTiles; i++) {
          chosenChars.push(pool[i % pool.length]);
        }

        for (let i = 0; i < this.totalTiles; i++) {
          const char = chosenChars[i];
          const tileEl = document.createElement('div');
          tileEl.className = 'suds-tile';
          tileEl.textContent = char;

          const tileObj = {
            el: tileEl,
            char: char,
            cleared: false
          };

          tileEl.addEventListener('click', () => {
            this.clearTile(tileObj);
          });

          this.gridEl.appendChild(tileEl);
          this.tiles.push(tileObj);
        }

        this.updateProgress();
      },

      updateProgress() {
        this.progressEl.textContent = `${this.clearedCount} / ${this.totalTiles} washed`;
      },

      clearTile(tileObj) {
        if (tileObj.cleared) return;
        tileObj.cleared = true;
        this.clearedCount++;

        tileObj.el.classList.add('cleared');
        sound.playSqueak();

        const speechText = isNaN(tileObj.char) ? tileObj.char.toUpperCase() : tileObj.char;
        sound.speak(speechText);

        updateStars(1);
        this.spawnSudsParticles(tileObj.el);
        this.updateProgress();

        if (this.clearedCount >= this.totalTiles) {
          this.onComplete();
        }
      },

      spawnSudsParticles(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const stageRect = this.gridEl.getBoundingClientRect();
        const startX = rect.left - stageRect.left + rect.width / 2;
        const startY = rect.top - stageRect.top + rect.height / 2;

        const sudsIcons = ['🫧', '✨', '💧', '🌟'];
        for (let i = 0; i < 5; i++) {
          const spark = document.createElement('div');
          spark.className = 'suds-splash';
          spark.textContent = sudsIcons[Math.floor(Math.random() * sudsIcons.length)];
          spark.style.left = `${startX}px`;
          spark.style.top = `${startY}px`;

          const angle = (Math.PI * 2 * i) / 5;
          const dist = 30 + Math.random() * 25;
          spark.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          spark.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

          this.gridEl.appendChild(spark);
          setTimeout(() => spark.remove(), 550);
        }
      },

      onComplete() {
        this.picContainer.classList.add('celebrate-glow');
        sound.playFanfare();
        sound.speak("Sparkling clean! Great job!");
        showBanner("Picture Cleaned! 🎉 ⭐+5");
        updateStars(5);

        setTimeout(() => {
          if (state.currentGame === 'suds' && this.clearedCount >= this.totalTiles) {
            this.currentPicIndex = (this.currentPicIndex + 1) % this.pictures.length;
            this.customImageSrc = null;
            this.loadRound();
          }
        }, 3600);
      },

      handleKeyPress(key) {
        if (!key || key.length !== 1) return;
        const keyLower = key.toLowerCase();
        const match = this.tiles.find(t => !t.cleared && t.char.toLowerCase() === keyLower);
        if (match) {
          this.clearTile(match);
        }
      }
    };
    sudsGame.init();
