/* ==========================================================
       4. GAME 2: NUMBER MATCH & ADDITION
       ========================================================== */
    const mathGame = {
      num1El: document.getElementById('math-num1'),
      num2El: document.getElementById('math-num2'),
      targetEl: document.getElementById('math-target'),
      aidGroupA: document.getElementById('aid-group-a'),
      aidGroupB: document.getElementById('aid-group-b'),
      keyBtns: document.querySelectorAll('.key-btn'),
      currentSum: 0,
      emojis: ['🍎', '⭐', '🎈', '🐶', '🍓', '🍪', '🌸', '🍭'],

      init() {
        this.keyBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-key'), 10);
            this.checkAnswer(val);
          });
        });
      },

      start() {
        this.generateProblem();
      },

      stop() {
        // cleanup if needed
      },

      generateProblem() {
        // Addition with sum <= 9 so it's a single keypress (0-9)
        // Ensure child learns combinations like 2+3, 1+4, 4+4, etc.
        const sum = Math.floor(Math.random() * 8) + 2; // Sum between 2 and 9
        const a = Math.floor(Math.random() * (sum - 1)) + 1; // 1 to sum-1
        const b = sum - a;

        this.currentSum = sum;
        this.num1El.textContent = a;
        this.num2El.textContent = b;
        this.targetEl.textContent = '?';
        this.targetEl.style.color = '#3b82f6';

        // Pick a cute visual emoji counter
        const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];

        // Render visual aids
        this.aidGroupA.innerHTML = '';
        for (let i = 0; i < a; i++) {
          const span = document.createElement('span');
          span.className = 'aid-item';
          span.textContent = emoji;
          this.aidGroupA.appendChild(span);
        }

        this.aidGroupB.innerHTML = '';
        for (let i = 0; i < b; i++) {
          const span = document.createElement('span');
          span.className = 'aid-item';
          span.textContent = emoji;
          this.aidGroupB.appendChild(span);
        }

        // Sound prompt / cue
        sound.playNewProblem();
        sound.speak(`What is ${a} plus ${b}?`);
      },

      checkAnswer(val) {
        if (val === this.currentSum) {
          // Success!
          this.targetEl.textContent = val;
          this.targetEl.style.color = '#10b981';
          sound.playSuccess();
          sound.speak(`${val}! Wonderful!`);
          showBanner(`${val}! Super Job! ⭐`);
          updateStars(2);

          // Delay before next question
          setTimeout(() => {
            if (state.currentGame === 'math') {
              this.generateProblem();
            }
          }, 1400);
        } else {
          // Gentle wiggle feedback with soft boop
          this.targetEl.style.color = '#ef4444';
          sound.playBoop();
          sound.speak("Try again!");
          setTimeout(() => {
            this.targetEl.textContent = '?';
            this.targetEl.style.color = '#3b82f6';
          }, 600);
        }
      },

      handleKeyPress(key) {
        if (key >= '0' && key <= '9') {
          this.checkAnswer(parseInt(key, 10));
        }
      }
    };
    mathGame.init();
