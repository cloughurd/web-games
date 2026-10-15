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

const TREAT_CANDIES = [
  { name: 'Chocolate Bar', emoji: '🍫' },
  { name: 'Swirly Lollipop', emoji: '🍭' },
  { name: 'Candy Corn', emoji: '🍬' },
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
    this.candyEmojiEl.textContent = this.currentCandy.emoji;
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
