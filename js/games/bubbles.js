/* ==========================================================
       3. GAME 1: LETTER & NUMBER BUBBLES
       ========================================================== */
    const bubbleGame = {
      stage: document.getElementById('bubble-stage'),
      btnUpper: document.getElementById('toggle-upper'),
      btnLower: document.getElementById('toggle-lower'),
      btnNumbers: document.getElementById('toggle-numbers'),
      speedToggle: document.getElementById('speed-toggle'),

      includeUpper: true,
      includeLower: true, // Mixed case enabled by default
      includeNumbers: false, // Can be toggled on/off

      speedIndex: 1, // Default Normal speed
      speeds: [
        { label: 'Speed: Gentle', fallSpeed: 0.38, spawnInterval: 3600, maxBubbles: 4 },
        { label: 'Speed: Normal', fallSpeed: 1.1, spawnInterval: 1900, maxBubbles: 6 },
        { label: 'Speed: Fast', fallSpeed: 2.0, spawnInterval: 1200, maxBubbles: 8 }
      ],
      bubbles: [],
      animationId: null,
      spawnTimer: null,
      colors: [
        'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
        'linear-gradient(135deg, #42e695 0%, #3bb2b8 100%)',
        'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      ],

      init() {
        const toggleType = (type) => {
          const activeCount = (this.includeUpper ? 1 : 0) + (this.includeLower ? 1 : 0) + (this.includeNumbers ? 1 : 0);

          if (type === 'upper') {
            if (this.includeUpper && activeCount <= 1) return; // Keep at least one active
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
        };

        this.btnUpper.addEventListener('click', () => toggleType('upper'));
        this.btnLower.addEventListener('click', () => toggleType('lower'));
        this.btnNumbers.addEventListener('click', () => toggleType('numbers'));

        this.speedToggle.addEventListener('click', () => {
          this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
          this.speedToggle.textContent = this.speeds[this.speedIndex].label;
          if (state.currentGame === 'bubbles') {
            this.resetSpawnTimer();
          }
        });
      },

      start() {
        this.clearBubbles();
        this.resetSpawnTimer();
        this.spawnBubble();
        this.loop = this.loop.bind(this);
        this.lastTime = performance.now();
        this.animationId = requestAnimationFrame(this.loop);
      },

      stop() {
        cancelAnimationFrame(this.animationId);
        clearInterval(this.spawnTimer);
        this.clearBubbles();
      },

      clearBubbles() {
        this.bubbles.forEach(b => b.el.remove());
        this.bubbles = [];
      },

      resetSpawnTimer() {
        clearInterval(this.spawnTimer);
        const currentSpeed = this.speeds[this.speedIndex];
        this.spawnTimer = setInterval(() => {
          if (this.bubbles.length < (currentSpeed.maxBubbles || 6)) {
            this.spawnBubble();
          }
        }, currentSpeed.spawnInterval);
      },

      getPool() {
        const pool = [];
        if (this.includeUpper) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (this.includeLower) pool.push(...'abcdefghijklmnopqrstuvwxyz');
        if (this.includeNumbers) pool.push(...'0123456789');
        if (pool.length === 0) pool.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return pool;
      },

      getRandomItem() {
        const pool = this.getPool();
        return pool[Math.floor(Math.random() * pool.length)];
      },

      spawnBubble() {
        const stageRect = this.stage.getBoundingClientRect();
        if (stageRect.width === 0) return;

        const char = this.getRandomItem();
        const el = document.createElement('div');
        el.className = 'bubble';
        el.textContent = char;

        const colorBg = this.colors[Math.floor(Math.random() * this.colors.length)];
        el.style.background = colorBg;

        // Position: X within bounds (margin 60px)
        const minX = 60;
        const maxX = stageRect.width - 60;
        const x = minX + Math.random() * (maxX - minX);
        const y = -50; // start slightly above

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        const bubbleObj = {
          el,
          letter: char,
          x,
          y,
          popped: false
        };

        // Click or touch to pop
        el.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.popBubble(bubbleObj);
        });

        this.stage.appendChild(el);
        this.bubbles.push(bubbleObj);
      },

      loop(time) {
        const dt = (time - this.lastTime) / 16.66; // normalize to 60fps
        this.lastTime = time;

        const stageHeight = this.stage.clientHeight;
        const fallRate = this.speeds[this.speedIndex].fallSpeed * dt;

        for (let i = this.bubbles.length - 1; i >= 0; i--) {
          const b = this.bubbles[i];
          if (b.popped) continue;

          b.y += fallRate;
          b.el.style.top = `${b.y}px`;

          // If reached bottom, gracefully fade out
          if (b.y > stageHeight - 40) {
            b.el.style.opacity = '0';
            b.el.style.transition = 'opacity 0.4s';
            setTimeout(() => b.el.remove(), 400);
            this.bubbles.splice(i, 1);
          }
        }

        if (state.currentGame === 'bubbles') {
          this.animationId = requestAnimationFrame(this.loop);
        }
      },

      popBubble(bubbleObj) {
        if (bubbleObj.popped) return;
        bubbleObj.popped = true;

        sound.playPop();
        // If single letter, speak uppercase so speech synthesis doesn't say 'uh' for 'a'
        const speechText = isNaN(bubbleObj.letter) ? bubbleObj.letter.toUpperCase() : bubbleObj.letter;
        sound.speak(speechText);
        updateStars(1);

        // Visual sparkle explosion
        this.spawnSparkles(bubbleObj.x, bubbleObj.y);

        bubbleObj.el.classList.add('bubble-burst');
        setTimeout(() => {
          bubbleObj.el.remove();
          const idx = this.bubbles.indexOf(bubbleObj);
          if (idx !== -1) this.bubbles.splice(idx, 1);
        }, 300);
      },

      spawnSparkles(x, y) {
        const icons = ['✨', '⭐', '💫', '🎉'];
        for (let i = 0; i < 6; i++) {
          const spark = document.createElement('div');
          spark.className = 'bubble-sparkle';
          spark.textContent = icons[Math.floor(Math.random() * icons.length)];
          spark.style.left = `${x}px`;
          spark.style.top = `${y}px`;

          const angle = (Math.PI * 2 * i) / 6;
          const dist = 50 + Math.random() * 30;
          spark.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          spark.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

          this.stage.appendChild(spark);
          setTimeout(() => spark.remove(), 550);
        }
      },

      handleKeyPress(key) {
        if (!key || key.length !== 1) return;
        const pressedChar = key.toLowerCase();
        // Find matching bubble with the lowest Y (closest to bottom)
        const match = this.bubbles
          .filter(b => !b.popped && b.letter.toLowerCase() === pressedChar)
          .sort((a, b) => b.y - a.y)[0];

        if (match) {
          this.popBubble(match);
        }
      }
    };
    bubbleGame.init();
