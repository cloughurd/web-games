/* ==========================================================
       2. APP STATE & GLOBAL UI
       ========================================================== */
    const state = {
      stars: parseInt(localStorage.getItem('kid_arcade_stars') || '0', 10),
      currentGame: null // 'bubbles', 'math', or null (menu)
    };

    const dom = {
      starCount: document.getElementById('star-count'),
      audioToggle: document.getElementById('audio-toggle'),
      audioIcon: document.getElementById('audio-icon'),
      audioLabel: document.getElementById('audio-label'),
      fullscreenToggle: document.getElementById('fullscreen-toggle'),
      brandHome: document.getElementById('brand-home'),
      menuScreen: document.getElementById('menu-screen'),
      bubblesGame: document.getElementById('bubbles-game'),
      mathGame: document.getElementById('math-game'),
      sudsGame: document.getElementById('suds-game'),
      mapGame: document.getElementById('map-game'),
      connectGame: document.getElementById('connect-game'),
      feedbackBanner: document.getElementById('feedback-banner')
    };

    function updateAudioButtonUI() {
      const current = SOUND_MODES.find(m => m.id === sound.mode) || SOUND_MODES[0];
      dom.audioIcon.textContent = current.icon;
      dom.audioLabel.textContent = current.label;
      dom.audioToggle.title = current.title;
    }
    updateAudioButtonUI();

    function updateStars(increment = 0) {
      state.stars += increment;
      dom.starCount.textContent = state.stars;
      localStorage.setItem('kid_arcade_stars', state.stars);
    }
    updateStars(0);

    function showBanner(message = "Great Job! ⭐") {
      dom.feedbackBanner.textContent = message;
      dom.feedbackBanner.classList.add('show');
      setTimeout(() => {
        dom.feedbackBanner.classList.remove('show');
      }, 700);
    }

    function switchView(game) {
      // Clean up any running games first
      bubbleGame.stop();
      mathGame.stop();
      sudsGame.stop();
      mapGame.stop();
      connectGame.stop();

      state.currentGame = game;
      dom.menuScreen.style.display = 'none';
      dom.bubblesGame.style.display = 'none';
      dom.mathGame.style.display = 'none';
      dom.sudsGame.style.display = 'none';
      dom.mapGame.style.display = 'none';
      dom.connectGame.style.display = 'none';

      if (game === 'bubbles') {
        dom.bubblesGame.style.display = 'flex';
        bubbleGame.start();
      } else if (game === 'math') {
        dom.mathGame.style.display = 'flex';
        mathGame.start();
      } else if (game === 'suds') {
        dom.sudsGame.style.display = 'flex';
        sudsGame.start();
      } else if (game === 'map') {
        dom.mapGame.style.display = 'flex';
        mapGame.start();
      } else if (game === 'connect') {
        dom.connectGame.style.display = 'flex';
        connectGame.start();
      } else {
        dom.menuScreen.style.display = 'flex';
      }
    }

    // Audio toggle cycles: FX Only -> Voice & FX -> Muted -> FX Only
    dom.audioToggle.addEventListener('click', () => {
      const idx = SOUND_MODES.findIndex(m => m.id === sound.mode);
      const nextMode = SOUND_MODES[(idx + 1) % SOUND_MODES.length].id;
      sound.setMode(nextMode);
      updateAudioButtonUI();
      if (nextMode === 'fx' || nextMode === 'voice') {
        sound.playPop(); // preview feedback
      }
    });

    // Fullscreen toggle
    dom.fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Navigation buttons
    document.getElementById('select-bubbles').addEventListener('click', () => switchView('bubbles'));
    document.getElementById('select-math').addEventListener('click', () => switchView('math'));
    document.getElementById('select-suds').addEventListener('click', () => switchView('suds'));
    document.getElementById('select-map').addEventListener('click', () => switchView('map'));
    document.getElementById('select-connect').addEventListener('click', () => switchView('connect'));
    document.getElementById('back-from-bubbles').addEventListener('click', () => switchView(null));
    document.getElementById('back-from-math').addEventListener('click', () => switchView(null));
    document.getElementById('back-from-suds').addEventListener('click', () => switchView(null));
    document.getElementById('back-from-map').addEventListener('click', () => switchView(null));
    document.getElementById('back-from-connect').addEventListener('click', () => switchView(null));
    dom.brandHome.addEventListener('click', () => switchView(null));


    /* ==========================================================
       8. UNIVERSAL KEYBOARD LISTENER
       ========================================================== */
    window.addEventListener('keydown', (e) => {
      // Prevent browser default on space or arrow keys if pressed
      if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }

      if (state.currentGame === 'bubbles') {
        bubbleGame.handleKeyPress(e.key);
      } else if (state.currentGame === 'math') {
        mathGame.handleKeyPress(e.key);
      } else if (state.currentGame === 'suds') {
        sudsGame.handleKeyPress(e.key);
      } else if (state.currentGame === 'map') {
        mapGame.handleKeyPress(e.key);
      } else if (state.currentGame === 'connect') {
        connectGame.handleKeyPress(e.key);
      }
    });
