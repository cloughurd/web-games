/* ==========================================================
   GAME 10: TRICK-OR-TREAT!
   ========================================================== */
const TREAT_CHARACTERS = [
  { name: 'Spooky Boo', emoji: '👻', greeting: 'Boo! Happy Halloween!' },
  { name: 'Midnight the Cat', emoji: '🐈‍⬛', greeting: 'Meow! Trick or treat!' },
  { name: 'Wendy the Witch', emoji: '🧙‍♀️', greeting: 'Hocus pocus! Sweet treats for you!' },
  { name: 'Skelly the Skeleton', emoji: '💀', greeting: 'Rattle and roll! Happy Halloween!' },
  { name: 'Barnaby the Bat', emoji: '🦇', greeting: 'Flap flap! Sweet candy for you!' },
  { name: 'Miles the Mummy', emoji: '🧟', greeting: 'Wraps and treats! Happy Halloween!' },
  { name: 'Pumpkin Pup', emoji: '🐶', greeting: 'Woof! Trick or treat!' },
  { name: 'Oliver the Owl', emoji: '🦉', greeting: 'Hoo hoo! Have a yummy treat!' }
];

const CANDY_CORN_SVG = `<svg viewBox="0 0 36 36" width="36" height="36" style="display:inline-block; vertical-align:middle; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));"><defs><clipPath id="cc-shape"><path d="M 18 3 C 20 3 21.2 6 22.5 10 L 29 26.5 C 30.5 30 28.5 33 25 33 L 11 33 C 7.5 33 5.5 30 7 26.5 L 13.5 10 C 14.8 6 16 3 18 3 Z"/></clipPath></defs><g clip-path="url(#cc-shape)"><rect x="0" y="22" width="36" height="14" fill="#fbbf24"/><rect x="0" y="11" width="36" height="12" fill="#f97316"/><rect x="0" y="0" width="36" height="12" fill="#ffffff"/></g></svg>`;

const TREAT_CANDIES = [
  { name: 'Chocolate Bar', emoji: '🍫' },
  { name: 'Swirly Lollipop', emoji: '🍭' },
  { name: 'Chewy Taffy', emoji: '🍬' },
  { name: 'Candy Corn', emoji: '🌽', svg: CANDY_CORN_SVG },
  { name: 'Spooky Donut', emoji: '🍩' },
  { name: 'Monster Cupcake', emoji: '🧁' },
  { name: 'Bat Cookie', emoji: '🍪' }
];

const treatGame = {
  stageEl: document.getElementById('treat-stage'),
  titleEl: document.getElementById('treat-title'),
  subtitleEl: document.getElementById('treat-subtitle'),
  doorLeafEl: document.getElementById('treat-door-leaf'),
  knockerLetterEl: document.getElementById('treat-knocker-letter'),
  visitorEmojiEl: document.getElementById('treat-visitor-emoji'),
  candyCardEl: document.getElementById('treat-candy-card'),
  candyEmojiEl: document.getElementById('treat-candy-emoji'),
  targetBadgeEl: document.getElementById('treat-target-badge'),
  candyCountEl: document.getElementById('treat-candy-count'),

  step: 'knock', // 'knock' or 'treat'
  knockKey: 'K',
  treatKey: 'T',
  currentCharacter: null,
  currentCandy: null,
  candyCount: 0,
  isTransitioning: false,

  init() {
    if (this.doorLeafEl) {
      this.doorLeafEl.addEventListener('click', () => {
        if (this.step === 'knock') {
          this.handleAction(this.knockKey);
        }
      });
    }

    if (this.candyCardEl) {
      this.candyCardEl.addEventListener('click', () => {
        if (this.step === 'treat') {
          this.handleAction(this.treatKey);
        }
      });
    }
  },

  start() {
    this.candyCount = 0;
    this.updateCandyUI();
    this.setupKnock();
  },

  stop() {},

  updateCandyUI() {
    if (this.candyCountEl) {
      this.candyCountEl.textContent = this.candyCount;
    }
  },

  getRandomLetter(exclude = null) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => c !== exclude);
    return letters[Math.floor(Math.random() * letters.length)];
  },

  setupKnock() {
    this.isTransitioning = false;
    this.step = 'knock';
    this.doorLeafEl.classList.remove('open');

    this.knockKey = this.getRandomLetter();
    this.knockerLetterEl.textContent = this.knockKey;

    this.titleEl.textContent = 'Knock on the Door! 🚪';
    this.subtitleEl.textContent = `Press or tap the letter [ ${this.knockKey} ] to knock!`;

    sound.speak(`Knock on the door! Find letter ${this.knockKey}!`, true);
  },

  setupTreat() {
    this.step = 'treat';
    this.doorLeafEl.classList.add('open');

    // Pick random character and treat
    this.currentCharacter = TREAT_CHARACTERS[Math.floor(Math.random() * TREAT_CHARACTERS.length)];
    this.currentCandy = TREAT_CANDIES[Math.floor(Math.random() * TREAT_CANDIES.length)];

    this.treatKey = this.getRandomLetter(this.knockKey);

    this.visitorEmojiEl.textContent = this.currentCharacter.emoji;
    if (this.currentCandy.svg) {
      this.candyEmojiEl.innerHTML = this.currentCandy.svg;
    } else {
      this.candyEmojiEl.textContent = this.currentCandy.emoji;
    }
    this.targetBadgeEl.textContent = this.treatKey;

    this.titleEl.textContent = 'Trick or Treat! 🍬';
    this.subtitleEl.textContent = `${this.currentCharacter.name} has a ${this.currentCandy.name}! Press [ ${this.treatKey} ]!`;

    sound.speak(`${this.currentCharacter.greeting} Press letter ${this.treatKey} to collect your ${this.currentCandy.name}!`, true);
  },

  handleAction(key) {
    if (!key || this.isTransitioning) return;

    if (this.step === 'knock') {
      if (key.toUpperCase() === this.knockKey.toUpperCase()) {
        this.isTransitioning = true;
        sound.playDoorKnock();
        sound.speak(this.knockKey, true);

        setTimeout(() => {
          this.setupTreat();
          this.isTransitioning = false;
        }, 550);
      } else {
        sound.playBoop();
      }
    } else if (this.step === 'treat') {
      if (key.toUpperCase() === this.treatKey.toUpperCase()) {
        this.isTransitioning = true;
        this.candyCount++;
        this.updateCandyUI();

        sound.playCandyDrop();
        sound.speak(`Yummy ${this.currentCandy.name}! Happy Halloween!`, true);
        showBanner(`🍬 +1 Treat! ⭐`);
        updateStars(1);

        // Advance to next door
        setTimeout(() => {
          if (state.currentGame === 'treat') {
            this.setupKnock();
          }
        }, 2100);
      } else {
        sound.playBoop();
      }
    }
  },

  handleKeyPress(key) {
    if (!key || key.length !== 1 || this.isTransitioning) return;
    this.handleAction(key);
  }
};

treatGame.init();
