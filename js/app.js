/* ==========================================================
   2. APP STATE & GLOBAL UI
   ========================================================== */
const state = {
  stars: parseInt(localStorage.getItem('kid_arcade_stars') || '0', 10),
  currentGame: null // 'bubbles', 'math', 'suds', 'map', 'connect', 'phonics', 'caterpillar', 'sight', or null (menu)
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
  phonicsGame: document.getElementById('phonics-game'),
  caterpillarGame: document.getElementById('caterpillar-game'),
  sightGame: document.getElementById('sight-game'),
  puzzleMenu: document.getElementById('puzzle-menu'),
  sudokuGame: document.getElementById('sudoku-game'),
  modeToggle: document.getElementById('mode-toggle'),
  modeIcon: document.getElementById('mode-icon'),
  modeLabel: document.getElementById('mode-label'),
  brandIcon: document.getElementById('brand-icon'),
  brandText: document.getElementById('brand-text'),
  feedbackBanner: document.getElementById('feedback-banner')
};

const PUZZLE_VIEWS = ['puzzles', 'sudoku'];
function isPuzzleView(view) {
  return PUZZLE_VIEWS.includes(view);
}

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
  phonicsGame.stop();
  caterpillarGame.stop();
  sightGame.stop();
  sudokuGame.stop();

  state.currentGame = game;
  dom.menuScreen.style.display = 'none';
  dom.bubblesGame.style.display = 'none';
  dom.mathGame.style.display = 'none';
  dom.sudsGame.style.display = 'none';
  dom.mapGame.style.display = 'none';
  dom.connectGame.style.display = 'none';
  dom.phonicsGame.style.display = 'none';
  dom.caterpillarGame.style.display = 'none';
  dom.sightGame.style.display = 'none';
  dom.puzzleMenu.style.display = 'none';
  dom.sudokuGame.style.display = 'none';

  updateModeUI(isPuzzleView(game));

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
  } else if (game === 'phonics') {
    dom.phonicsGame.style.display = 'flex';
    phonicsGame.start();
  } else if (game === 'caterpillar') {
    dom.caterpillarGame.style.display = 'flex';
    caterpillarGame.start();
  } else if (game === 'sight') {
    dom.sightGame.style.display = 'flex';
    sightGame.start();
  } else if (game === 'puzzles') {
    dom.puzzleMenu.style.display = 'flex';
    renderPuzzleMenu();
  } else if (game === 'sudoku') {
    dom.sudokuGame.style.display = 'flex';
    sudokuGame.start();
  } else {
    dom.menuScreen.style.display = 'flex';
  }
}

/* ---------- Kids Arcade <-> Puzzle Room mode ---------- */
function updateModeUI(puzzleMode) {
  document.body.classList.toggle('puzzle-mode', puzzleMode);
  dom.brandIcon.textContent = puzzleMode ? '🧩' : '🎈';
  dom.brandText.textContent = puzzleMode ? 'Puzzle Room' : 'Kids Arcade';
  dom.modeIcon.textContent = puzzleMode ? '🎈' : '🧩';
  dom.modeLabel.textContent = puzzleMode ? 'Kids Arcade' : 'Puzzles';
  dom.modeToggle.title = puzzleMode ? 'Back to the Kids Arcade' : 'Switch to Puzzle Games';
  document.title = puzzleMode ? 'Puzzle Room' : 'Kids Fun Learning Arcade';

  // Keep a bookmarkable URL for grown-ups (#puzzles), without cluttering history
  const hash = puzzleMode ? `#${state.currentGame}` : '';
  if (location.hash !== hash) {
    history.replaceState(null, '', location.pathname + location.search + hash);
  }
}

function renderPuzzleMenu() {
  const today = SudokuEngine.todayKey();
  const s = sudokuGame.getStatus(today);
  const dayName = SudokuEngine.keyToDate(today).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  document.getElementById('sudoku-card-desc').textContent = `${dayName} · ${s.label}`;
  const statusEl = document.getElementById('sudoku-card-status');
  const btn = document.getElementById('sudoku-card-btn');
  if (s.completed) {
    statusEl.textContent = `✅ Solved in ${sudokuGame.formatTime(s.elapsed)}`;
    statusEl.className = 'sudoku-card-status done';
    btn.textContent = 'View Puzzle';
  } else if (s.started) {
    statusEl.textContent = `⏱️ In progress · ${sudokuGame.formatTime(s.elapsed)}`;
    statusEl.className = 'sudoku-card-status started';
    btn.textContent = 'Continue';
  } else {
    statusEl.textContent = '';
    statusEl.className = 'sudoku-card-status';
    btn.textContent = "Play Today's Puzzle";
  }
}

dom.modeToggle.addEventListener('click', () => {
  switchView(isPuzzleView(state.currentGame) ? null : 'puzzles');
});

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
document.getElementById('select-phonics').addEventListener('click', () => switchView('phonics'));
document.getElementById('select-caterpillar').addEventListener('click', () => switchView('caterpillar'));
document.getElementById('select-sight').addEventListener('click', () => switchView('sight'));

document.getElementById('back-from-bubbles').addEventListener('click', () => switchView(null));
document.getElementById('back-from-math').addEventListener('click', () => switchView(null));
document.getElementById('back-from-suds').addEventListener('click', () => switchView(null));
document.getElementById('back-from-map').addEventListener('click', () => switchView(null));
document.getElementById('back-from-connect').addEventListener('click', () => switchView(null));
document.getElementById('back-from-phonics').addEventListener('click', () => switchView(null));
document.getElementById('back-from-caterpillar').addEventListener('click', () => switchView(null));
document.getElementById('back-from-sight').addEventListener('click', () => switchView(null));
dom.brandHome.addEventListener('click', () => switchView(isPuzzleView(state.currentGame) ? 'puzzles' : null));

// Puzzle Room navigation
document.getElementById('select-sudoku').addEventListener('click', () => switchView('sudoku'));
document.getElementById('back-from-sudoku').addEventListener('click', () => switchView('puzzles'));


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
  } else if (state.currentGame === 'phonics') {
    phonicsGame.handleKeyPress(e.key);
  } else if (state.currentGame === 'caterpillar') {
    caterpillarGame.handleKeyPress(e.key);
  } else if (state.currentGame === 'sudoku') {
    sudokuGame.handleKeyDown(e);
  }
});

// Kids Arcade is the default; #puzzles or #sudoku deep-links straight to the Puzzle Room
if (location.hash === '#sudoku') {
  switchView('sudoku');
} else if (location.hash === '#puzzles') {
  switchView('puzzles');
}
