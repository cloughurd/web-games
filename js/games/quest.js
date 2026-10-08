/* ==========================================================
       6. GAME 4: CASTLE QUEST (MAP ADVENTURE)
       ========================================================== */
    const mapGame = {
      gridEl: document.getElementById('quest-grid'),
      distanceEl: document.getElementById('map-distance'),
      btnUpper: document.getElementById('map-toggle-upper'),
      btnLower: document.getElementById('map-toggle-lower'),
      btnNumbers: document.getElementById('map-toggle-numbers'),
      btnNew: document.getElementById('map-new-btn'),
      charBtns: document.querySelectorAll('.char-pick-btn'),

      includeUpper: true,
      includeLower: true,
      includeNumbers: false,

      selectedChar: '🐰',
      cols: 6,
      rows: 4,
      currentRow: 3,
      currentCol: 0,
      stepsTaken: 0,
      tiles: [],
      collectibles: ['💎', '🍎', '⭐', '🍓'],

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
          if (state.currentGame === 'map') {
            this.start();
          }
        };

        this.btnUpper.addEventListener('click', () => toggleType('upper'));
        this.btnLower.addEventListener('click', () => toggleType('lower'));
        this.btnNumbers.addEventListener('click', () => toggleType('numbers'));

        this.btnNew.addEventListener('click', () => this.start());

        this.charBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            this.charBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.selectedChar = btn.getAttribute('data-char');
            this.renderCharacter();
          });
        });
      },

      start() {
        this.currentRow = 3;
        this.currentCol = 0;
        this.stepsTaken = 0;
        this.distanceEl.textContent = `Steps: 0`;
        this.buildMap();
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

      buildMap() {
        this.gridEl.innerHTML = '';
        this.tiles = [];

        const pool = [...this.getPool()];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        let charIdx = 0;
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            const isStart = (r === 3 && c === 0);
            const isCastle = (r === 0 && c === 5);

            const char = pool[charIdx % pool.length];
            charIdx++;

            const tileEl = document.createElement('div');
            tileEl.className = 'quest-tile';

            let item = null;
            if (!isStart && !isCastle && Math.random() < 0.28) {
              item = this.collectibles[Math.floor(Math.random() * this.collectibles.length)];
            }

            if (isStart) tileEl.classList.add('tile-start');
            if (isCastle) tileEl.classList.add('tile-castle');

            const letterEl = document.createElement('span');
            letterEl.className = 'quest-letter';
            letterEl.textContent = char;
            tileEl.appendChild(letterEl);

            if (item) {
              const itemEl = document.createElement('span');
              itemEl.className = 'tile-item';
              itemEl.textContent = item;
              tileEl.appendChild(itemEl);
            }

            const tileObj = {
              row: r,
              col: c,
              char: char,
              item: item,
              isStart,
              isCastle,
              el: tileEl
            };

            tileEl.addEventListener('click', () => {
              if (this.isAdjacent(tileObj.row, tileObj.col)) {
                this.moveToTile(tileObj);
              }
            });

            this.gridEl.appendChild(tileEl);
            this.tiles.push(tileObj);
          }
        }

        this.updateAdjacentHighlights();
        this.renderCharacter();
      },

      isAdjacent(r, c) {
        const dRow = Math.abs(r - this.currentRow);
        const dCol = Math.abs(c - this.currentCol);
        return (dRow + dCol === 1);
      },

      getAdjacentTiles() {
        return this.tiles.filter(t => this.isAdjacent(t.row, t.col));
      },

      updateAdjacentHighlights() {
        this.tiles.forEach(t => {
          if (this.isAdjacent(t.row, t.col)) {
            t.el.classList.add('tile-adjacent');
          } else {
            t.el.classList.remove('tile-adjacent');
          }
        });
      },

      renderCharacter() {
        const oldSprite = this.gridEl.querySelector('.char-sprite');
        if (oldSprite) oldSprite.remove();

        const currentTile = this.tiles.find(t => t.row === this.currentRow && t.col === this.currentCol);
        if (currentTile) {
          const sprite = document.createElement('div');
          sprite.className = 'char-sprite';
          sprite.textContent = this.selectedChar;
          currentTile.el.appendChild(sprite);
        }
      },

      moveToTile(tileObj) {
        const prevTile = this.tiles.find(t => t.row === this.currentRow && t.col === this.currentCol);
        if (prevTile) {
          prevTile.el.classList.add('tile-visited');
        }

        this.currentRow = tileObj.row;
        this.currentCol = tileObj.col;
        this.stepsTaken++;
        this.distanceEl.textContent = `Steps: ${this.stepsTaken}`;

        sound.playHop();
        const speechText = isNaN(tileObj.char) ? tileObj.char.toUpperCase() : tileObj.char;
        sound.speak(speechText);
        updateStars(1);

        if (tileObj.item) {
          sound.playGem();
          showBanner(`${tileObj.item} Collected! ⭐+1`);
          updateStars(1);
          const itemEl = tileObj.el.querySelector('.tile-item');
          if (itemEl) itemEl.remove();
          tileObj.item = null;
        }

        this.renderCharacter();
        this.updateAdjacentHighlights();

        if (tileObj.isCastle) {
          this.onCastleReached(tileObj);
        }
      },

      onCastleReached(tileObj) {
        tileObj.el.style.transform = 'scale(1.15)';
        sound.playFanfare();
        sound.speak("You reached the Royal Castle! Hooray!");
        showBanner("Castle Reached! 🏰 ⭐+5");
        updateStars(5);

        setTimeout(() => {
          if (state.currentGame === 'map') {
            this.start();
          }
        }, 3800);
      },

      handleKeyPress(key) {
        if (!key || key.length !== 1) return;
        const keyLower = key.toLowerCase();
        const neighbors = this.getAdjacentTiles();
        const match = neighbors.find(t => t.char.toLowerCase() === keyLower);
        if (match) {
          this.moveToTile(match);
        }
      }
    };
    mapGame.init();
