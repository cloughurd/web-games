/* ==========================================================
       7. GAME 5: 4 IN A ROW (CONNECT 4)
       ========================================================== */
    const connectGame = {
      stageEl: document.getElementById('connect-stage'),
      viewportEl: document.getElementById('connect-game'),
      dropRowEl: document.getElementById('connect-drop-row'),
      boardEl: document.getElementById('connect-board'),
      turnIconEl: document.getElementById('turn-icon'),
      turnTextEl: document.getElementById('turn-text'),
      scoreP1El: document.getElementById('score-p1'),
      scoreP2El: document.getElementById('score-p2'),
      btnRestart: document.getElementById('connect-restart-btn'),
      btnUpper: document.getElementById('connect-toggle-upper'),
      btnLower: document.getElementById('connect-toggle-lower'),
      btnNumbers: document.getElementById('connect-toggle-numbers'),

      includeUpper: true,
      includeLower: true,
      includeNumbers: false,

      cols: 7,
      rows: 6,
      board: [],
      columnChars: [],
      currentPlayer: 1, // 1 = Yellow, 2 = Red
      scores: { 1: 0, 2: 0 },
      isGameOver: false,

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
          if (state.currentGame === 'connect') {
            this.assignInitialChars();
            this.renderDropButtons();
          }
        };

        this.btnUpper.addEventListener('click', () => toggleType('upper'));
        this.btnLower.addEventListener('click', () => toggleType('lower'));
        this.btnNumbers.addEventListener('click', () => toggleType('numbers'));
        this.btnRestart.addEventListener('click', () => this.start());
      },

      start() {
        this.isGameOver = false;
        this.currentPlayer = 1;
        this.initBoard();
        this.assignInitialChars();
        this.renderDropButtons();
        this.renderBoard();
        this.updateTurnUI();
      },

      stop() {
        if (this.stageEl) this.stageEl.classList.remove('turn-p1', 'turn-p2');
        if (this.viewportEl) this.viewportEl.classList.remove('turn-p1', 'turn-p2');
        document.body.classList.remove('connect-turn-p1', 'connect-turn-p2');
      },

      getPool() {
        const pool = [];
        if (this.includeUpper) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (this.includeLower) pool.push(...'abcdefghijklmnopqrstuvwxyz');
        if (this.includeNumbers) pool.push(...'0123456789');
        if (pool.length === 0) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return pool;
      },

      getFreshChar(usedList) {
        const pool = this.getPool();
        const available = pool.filter(ch => !usedList.some(u => u.toLowerCase() === ch.toLowerCase()));
        if (available.length > 0) {
          return available[Math.floor(Math.random() * available.length)];
        }
        return pool[Math.floor(Math.random() * pool.length)];
      },

      assignInitialChars() {
        this.columnChars = [];
        for (let c = 0; c < this.cols; c++) {
          const ch = this.getFreshChar(this.columnChars);
          this.columnChars.push(ch);
        }
      },

      initBoard() {
        this.board = [];
        for (let r = 0; r < this.rows; r++) {
          this.board.push(new Array(this.cols).fill(0));
        }
      },

      renderDropButtons() {
        this.dropRowEl.innerHTML = '';
        for (let c = 0; c < this.cols; c++) {
          const btn = document.createElement('button');
          btn.className = 'drop-btn';
          btn.dataset.col = c;

          const isColFull = (this.board[0][c] !== 0);
          if (isColFull) {
            btn.disabled = true;
            btn.innerHTML = `<span>🔒</span>`;
          } else {
            btn.innerHTML = `<span>${this.columnChars[c]}</span><span class="drop-arrow">↓</span>`;
          }

          btn.addEventListener('click', () => {
            this.handleColumnDrop(c);
          });

          this.dropRowEl.appendChild(btn);
        }
      },

      renderBoard() {
        this.boardEl.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            const slot = document.createElement('div');
            slot.className = 'board-slot';
            slot.dataset.row = r;
            slot.dataset.col = c;

            const val = this.board[r][c];
            if (val === 1) {
              const piece = document.createElement('div');
              piece.className = 'piece piece-yellow';
              slot.appendChild(piece);
            } else if (val === 2) {
              const piece = document.createElement('div');
              piece.className = 'piece piece-red';
              slot.appendChild(piece);
            }

            slot.addEventListener('click', () => {
              this.handleColumnDrop(c);
            });

            this.boardEl.appendChild(slot);
          }
        }
      },

      updateTurnUI() {
        if (this.currentPlayer === 1) {
          this.turnIconEl.textContent = '🟡';
          this.turnTextEl.textContent = "Player 1's Turn (Yellow)";
          this.turnTextEl.className = 'turn-p1';

          if (this.stageEl) {
            this.stageEl.classList.remove('turn-p2');
            this.stageEl.classList.add('turn-p1');
          }
          if (this.viewportEl) {
            this.viewportEl.classList.remove('turn-p2');
            this.viewportEl.classList.add('turn-p1');
          }
          document.body.classList.remove('connect-turn-p2');
          document.body.classList.add('connect-turn-p1');
        } else {
          this.turnIconEl.textContent = '🔴';
          this.turnTextEl.textContent = "Player 2's Turn (Red)";
          this.turnTextEl.className = 'turn-p2';

          if (this.stageEl) {
            this.stageEl.classList.remove('turn-p1');
            this.stageEl.classList.add('turn-p2');
          }
          if (this.viewportEl) {
            this.viewportEl.classList.remove('turn-p1');
            this.viewportEl.classList.add('turn-p2');
          }
          document.body.classList.remove('connect-turn-p1');
          document.body.classList.add('connect-turn-p2');
        }
      },

      handleColumnDrop(col) {
        if (this.isGameOver) return;
        if (this.board[0][col] !== 0) return;

        let targetRow = -1;
        for (let r = this.rows - 1; r >= 0; r--) {
          if (this.board[r][col] === 0) {
            targetRow = r;
            break;
          }
        }
        if (targetRow === -1) return;

        this.board[targetRow][col] = this.currentPlayer;
        sound.playDrop();

        const winCombo = this.checkWin();
        if (winCombo) {
          this.renderBoard();
          this.highlightWinningPieces(winCombo);
          this.handleWin(this.currentPlayer);
          return;
        }

        const isTie = this.board[0].every(val => val !== 0);
        if (isTie) {
          this.renderBoard();
          this.isGameOver = true;
          if (this.stageEl) this.stageEl.classList.remove('turn-p1', 'turn-p2');
          if (this.viewportEl) this.viewportEl.classList.remove('turn-p1', 'turn-p2');
          document.body.classList.remove('connect-turn-p1', 'connect-turn-p2');
          showBanner("It's a Tie! 🤝");
          return;
        }

        // Change the selected column's letter!
        const newChar = this.getFreshChar(this.columnChars.filter((_, idx) => idx !== col));
        this.columnChars[col] = newChar;

        this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
        this.renderDropButtons();
        this.renderBoard();
        this.updateTurnUI();
      },

      checkWin() {
        const b = this.board;
        // Horizontal
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols - 3; c++) {
            const p = b[r][c];
            if (p !== 0 && p === b[r][c+1] && p === b[r][c+2] && p === b[r][c+3]) {
              return [[r,c], [r,c+1], [r,c+2], [r,c+3]];
            }
          }
        }
        // Vertical
        for (let r = 0; r < this.rows - 3; r++) {
          for (let c = 0; c < this.cols; c++) {
            const p = b[r][c];
            if (p !== 0 && p === b[r+1][c] && p === b[r+2][c] && p === b[r+3][c]) {
              return [[r,c], [r+1,c], [r+2,c], [r+3,c]];
            }
          }
        }
        // Diagonal (\)
        for (let r = 0; r < this.rows - 3; r++) {
          for (let c = 0; c < this.cols - 3; c++) {
            const p = b[r][c];
            if (p !== 0 && p === b[r+1][c+1] && p === b[r+2][c+2] && p === b[r+3][c+3]) {
              return [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]];
            }
          }
        }
        // Diagonal (/)
        for (let r = 3; r < this.rows; r++) {
          for (let c = 0; c < this.cols - 3; c++) {
            const p = b[r][c];
            if (p !== 0 && p === b[r-1][c+1] && p === b[r-2][c+2] && p === b[r-3][c+3]) {
              return [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]];
            }
          }
        }
        return null;
      },

      highlightWinningPieces(combo) {
        combo.forEach(([r, c]) => {
          const slot = this.boardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
          if (slot) {
            const piece = slot.querySelector('.piece');
            if (piece) piece.classList.add('piece-winning');
          }
        });
      },

      handleWin(winner) {
        this.isGameOver = true;
        this.scores[winner]++;
        this.scoreP1El.textContent = this.scores[1];
        this.scoreP2El.textContent = this.scores[2];

        // Maintain the winner's shaded background for celebration
        if (winner === 1) {
          if (this.stageEl) { this.stageEl.classList.remove('turn-p2'); this.stageEl.classList.add('turn-p1'); }
          if (this.viewportEl) { this.viewportEl.classList.remove('turn-p2'); this.viewportEl.classList.add('turn-p1'); }
          document.body.classList.remove('connect-turn-p2');
          document.body.classList.add('connect-turn-p1');
        } else {
          if (this.stageEl) { this.stageEl.classList.remove('turn-p1'); this.stageEl.classList.add('turn-p2'); }
          if (this.viewportEl) { this.viewportEl.classList.remove('turn-p1'); this.viewportEl.classList.add('turn-p2'); }
          document.body.classList.remove('connect-turn-p1');
          document.body.classList.add('connect-turn-p2');
        }

        sound.playFanfare();
        const winnerName = (winner === 1) ? "Yellow" : "Red";
        const icon = (winner === 1) ? "🟡" : "🔴";
        sound.speak(`${winnerName} got 4 in a row! Fantastic!`);
        showBanner(`${icon} ${winnerName} Wins! 🎉 ⭐+5`);
        updateStars(5);

        const btns = this.dropRowEl.querySelectorAll('.drop-btn');
        btns.forEach(b => b.disabled = true);
      },

      handleKeyPress(key) {
        if (!key || key.length !== 1 || this.isGameOver) return;
        const keyLower = key.toLowerCase();
        const colIdx = this.columnChars.findIndex(ch => ch.toLowerCase() === keyLower);
        if (colIdx !== -1) {
          this.handleColumnDrop(colIdx);
        }
      }
    };
    connectGame.init();
