/* ==========================================================
   PUZZLE: DAILY SUDOKU (UI + game state)
   Depends on SudokuEngine (js/puzzles/sudoku-engine.js)
   ========================================================== */
const sudokuGame = (() => {
  const E = SudokuEngine;
  const STORAGE_PREFIX = `daily_sudoku_v${E.GENERATOR_VERSION}_`;
  const MAX_UNDO = 500;

  const $ = id => document.getElementById(id);

  const game = {
    el: {
      board: $('sudoku-board'),
      boardWrap: $('sudoku-board-wrap'),
      pad: $('sudoku-pad'),
      timer: $('sudoku-timer'),
      pauseBtn: $('sudoku-pause-btn'),
      pauseOverlay: $('sudoku-pause-overlay'),
      resumeBtn: $('sudoku-resume-btn'),
      winOverlay: $('sudoku-win-overlay'),
      winTime: $('sudoku-win-time'),
      winSub: $('sudoku-win-sub'),
      shareBtn: $('sudoku-share-btn'),
      winCloseBtn: $('sudoku-win-close'),
      dateLabel: $('sudoku-date-label'),
      prevDay: $('sudoku-prev-day'),
      nextDay: $('sudoku-next-day'),
      diffBadge: $('sudoku-diff-badge'),
      undoBtn: $('sudoku-undo-btn'),
      redoBtn: $('sudoku-redo-btn'),
      eraseBtn: $('sudoku-erase-btn'),
      notesBtn: $('sudoku-notes-btn'),
      autoNotesBtn: $('sudoku-autonotes-btn'),
      mistakesBtn: $('sudoku-mistakes-btn'),
      toast: $('sudoku-toast')
    },

    cells: [],
    padButtons: [],

    data: null,          // { dateKey, difficulty, label, puzzle, solution, givens }
    values: [],          // 81 ints (0 = empty)
    notes: [],           // 81 bitmasks (bit d = candidate d)
    selected: -1,
    notesMode: false,
    showMistakes: localStorage.getItem('daily_sudoku_show_mistakes') === '1',
    paused: false,
    completed: false,
    active: false,       // is the sudoku view visible?

    elapsedBase: 0,
    runStart: null,
    timerId: null,
    saveTick: 0,

    undoStack: [],
    redoStack: [],

    /* ---------------- Setup ---------------- */
    init() {
      this.buildBoard();
      this.buildPad();

      const el = this.el;
      el.undoBtn.addEventListener('click', () => this.undo());
      el.redoBtn.addEventListener('click', () => this.redo());
      el.eraseBtn.addEventListener('click', () => this.erase());
      el.notesBtn.addEventListener('click', () => this.toggleNotesMode());
      el.autoNotesBtn.addEventListener('click', () => this.autoNotes());
      el.mistakesBtn.addEventListener('click', () => this.toggleMistakes());
      el.pauseBtn.addEventListener('click', () => this.togglePause());
      el.resumeBtn.addEventListener('click', () => this.setPaused(false));
      el.shareBtn.addEventListener('click', () => this.share());
      el.winCloseBtn.addEventListener('click', () => el.winOverlay.classList.remove('show'));
      el.prevDay.addEventListener('click', () => this.changeDay(-1));
      el.nextDay.addEventListener('click', () => this.changeDay(1));

      // Auto-pause when the tab is hidden, and always persist progress
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.active && !this.completed) {
          this.setPaused(true);
        }
        this.save();
      });
      window.addEventListener('pagehide', () => this.save());
    },

    buildBoard() {
      const board = this.el.board;
      board.innerHTML = '';
      for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        const r = E.ROW[i], c = E.COL[i];
        if (c === 2 || c === 5) cell.classList.add('box-right');
        if (r === 2 || r === 5) cell.classList.add('box-bottom');

        const value = document.createElement('span');
        value.className = 'cell-value';
        cell.appendChild(value);

        const notes = document.createElement('div');
        notes.className = 'cell-notes';
        const noteSpans = [];
        for (let d = 1; d <= 9; d++) {
          const s = document.createElement('span');
          notes.appendChild(s);
          noteSpans.push(s);
        }
        cell.appendChild(notes);

        cell.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.select(i);
        });

        board.appendChild(cell);
        this.cells.push({ cell, value, noteSpans });
      }
    },

    buildPad() {
      const pad = this.el.pad;
      pad.innerHTML = '';
      for (let d = 1; d <= 9; d++) {
        const btn = document.createElement('button');
        btn.className = 'sudoku-pad-btn';
        btn.innerHTML = `<span class="pad-digit">${d}</span><span class="pad-left"></span>`;
        btn.addEventListener('click', () => this.inputDigit(d, false));
        pad.appendChild(btn);
        this.padButtons.push(btn);
      }
    },

    /* ---------------- Lifecycle ---------------- */
    start(dateKey) {
      this.active = true;
      this.load(dateKey || E.todayKey());
    },

    stop() {
      if (!this.active) return;
      this.active = false;
      this.stopTimer();
      this.save();
    },

    load(dateKey) {
      if (this.data) {
        this.stopTimer();
        this.save();
      }

      this.data = E.generateDaily(dateKey);
      this.values = this.data.puzzle.slice();
      this.notes = new Array(81).fill(0);
      this.elapsedBase = 0;
      this.completed = false;
      this.paused = false;
      this.undoStack = [];
      this.redoStack = [];
      this.selected = -1;

      const saved = this.readSave(dateKey);
      if (saved && saved.puzzle === this.data.puzzle.join('')) {
        this.values = saved.values.split('').map(Number);
        this.notes = saved.notes.slice(0, 81);
        this.elapsedBase = saved.elapsed || 0;
        this.completed = !!saved.completed;
      }

      this.el.winOverlay.classList.remove('show');
      this.el.pauseOverlay.classList.remove('show');
      this.el.board.classList.remove('paused');
      this.el.pauseBtn.textContent = '⏸';
      this.render();
      this.renderTimer();

      if (this.completed) {
        this.showWin(false);
      } else {
        this.startTimer();
      }
    },

    changeDay(delta) {
      const next = E.shiftKey(this.data.dateKey, delta);
      if (next > E.todayKey()) return; // no peeking at future puzzles
      this.load(next);
    },

    /* ---------------- Persistence ---------------- */
    storageKey(dateKey) { return STORAGE_PREFIX + dateKey; },

    readSave(dateKey) {
      try {
        return JSON.parse(localStorage.getItem(this.storageKey(dateKey)) || 'null');
      } catch (_) {
        return null;
      }
    },

    save() {
      if (!this.data) return;
      const touched = this.completed || this.getElapsed() > 0 ||
        this.values.some((v, i) => v !== this.data.puzzle[i]) || this.notes.some(n => n);
      if (!touched) return;
      localStorage.setItem(this.storageKey(this.data.dateKey), JSON.stringify({
        puzzle: this.data.puzzle.join(''),
        values: this.values.join(''),
        notes: this.notes,
        elapsed: Math.round(this.getElapsed()),
        completed: this.completed
      }));
    },

    /** Status for the puzzle menu card, without generating the puzzle. */
    getStatus(dateKey) {
      const saved = this.readSave(dateKey);
      const difficulty = E.difficultyForKey(dateKey);
      return {
        label: E.DIFFICULTIES[difficulty].label,
        difficulty,
        started: !!saved,
        completed: !!(saved && saved.completed),
        elapsed: saved ? saved.elapsed || 0 : 0
      };
    },

    /* ---------------- Timer ---------------- */
    getElapsed() {
      return this.elapsedBase + (this.runStart ? Date.now() - this.runStart : 0);
    },

    startTimer() {
      if (this.runStart || this.completed || this.paused || !this.active) return;
      this.runStart = Date.now();
      clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.renderTimer();
        if (++this.saveTick % 20 === 0) this.save(); // every ~5s
      }, 250);
    },

    stopTimer() {
      if (this.runStart) {
        this.elapsedBase = this.getElapsed();
        this.runStart = null;
      }
      clearInterval(this.timerId);
      this.timerId = null;
      this.renderTimer();
    },

    formatTime(ms) {
      const total = Math.floor(ms / 1000);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      const ss = String(s).padStart(2, '0');
      return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
    },

    renderTimer() {
      this.el.timer.textContent = this.formatTime(this.getElapsed());
    },

    togglePause() {
      if (this.completed) return;
      this.setPaused(!this.paused);
    },

    setPaused(paused) {
      if (this.completed || !this.data) return;
      this.paused = paused;
      if (paused) this.stopTimer(); else this.startTimer();
      this.el.pauseOverlay.classList.toggle('show', paused);
      this.el.board.classList.toggle('paused', paused);
      this.el.pauseBtn.textContent = paused ? '▶' : '⏸';
      this.el.pauseBtn.title = paused ? 'Resume (P)' : 'Pause (P)';
      this.save();
    },

    /* ---------------- Editing ---------------- */
    canEdit(i) {
      return i >= 0 && !this.completed && !this.paused && this.data.puzzle[i] === 0;
    },

    snapshot() {
      return { values: this.values.slice(), notes: this.notes.slice() };
    },

    pushUndo() {
      this.undoStack.push(this.snapshot());
      if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
      this.redoStack = [];
    },

    select(i) {
      if (this.paused) return;
      this.selected = i;
      this.render();
    },

    moveSelection(dr, dc) {
      if (this.selected < 0) { this.select(0); return; }
      const r = (E.ROW[this.selected] + dr + 9) % 9;
      const c = (E.COL[this.selected] + dc + 9) % 9;
      this.select(r * 9 + c);
    },

    /** asNote: true forces note entry, false uses the current notes mode; shift inverts. */
    inputDigit(d, invertMode) {
      const i = this.selected;
      if (!this.canEdit(i)) return;
      const asNote = this.notesMode !== !!invertMode;
      if (asNote) this.toggleNote(i, d);
      else this.placeValue(i, d);
    },

    placeValue(i, d) {
      this.pushUndo();
      if (this.values[i] === d) {
        this.values[i] = 0; // tapping the same digit again clears it
      } else {
        this.values[i] = d;
        this.notes[i] = 0;
        // Clean this digit out of notes in the same row, column and box
        const bit = 1 << d;
        const peers = E.PEERS[i];
        for (let k = 0; k < peers.length; k++) this.notes[peers[k]] &= ~bit;
      }
      this.afterChange();
    },

    toggleNote(i, d) {
      if (this.values[i] !== 0) return;
      this.pushUndo();
      this.notes[i] ^= (1 << d);
      this.afterChange();
    },

    erase() {
      const i = this.selected;
      if (!this.canEdit(i)) return;
      if (!this.values[i] && !this.notes[i]) return;
      this.pushUndo();
      if (this.values[i]) this.values[i] = 0;
      else this.notes[i] = 0;
      this.afterChange();
    },

    autoNotes() {
      if (this.completed || this.paused) return;
      this.pushUndo();
      for (let i = 0; i < 81; i++) {
        this.notes[i] = this.values[i] ? 0 : E.candidatesFor(this.values, i);
      }
      this.afterChange();
      this.toast('Filled in all candidates');
    },

    undo() {
      if (!this.undoStack.length || this.completed || this.paused) return;
      this.redoStack.push(this.snapshot());
      const s = this.undoStack.pop();
      this.values = s.values; this.notes = s.notes;
      this.afterChange();
    },

    redo() {
      if (!this.redoStack.length || this.completed || this.paused) return;
      this.undoStack.push(this.snapshot());
      const s = this.redoStack.pop();
      this.values = s.values; this.notes = s.notes;
      this.afterChange();
    },

    toggleNotesMode() {
      this.notesMode = !this.notesMode;
      this.render();
    },

    toggleMistakes() {
      this.showMistakes = !this.showMistakes;
      localStorage.setItem('daily_sudoku_show_mistakes', this.showMistakes ? '1' : '0');
      this.render();
    },

    afterChange() {
      this.render();
      this.save();
      this.checkComplete();
    },

    checkComplete() {
      if (this.completed) return;
      const sol = this.data.solution;
      let filled = true, correct = true;
      for (let i = 0; i < 81; i++) {
        if (!this.values[i]) { filled = false; correct = false; break; }
        if (this.values[i] !== sol[i]) correct = false;
      }
      if (correct) {
        this.completed = true;
        this.stopTimer();
        this.selected = -1;
        this.save();
        this.render();
        if (typeof sound !== 'undefined') sound.playFanfare();
        this.showWin(true);
      } else if (filled) {
        this.toast('Board is full, but something isn\u2019t right yet');
      }
    },

    /* ---------------- Win & share ---------------- */
    prettyDate(dateKey, withYear) {
      return E.keyToDate(dateKey).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {})
      });
    },

    showWin(fresh) {
      const t = this.formatTime(this.getElapsed());
      this.el.winTime.textContent = t;
      this.el.winSub.textContent = `${this.prettyDate(this.data.dateKey)} · ${this.data.label}`;
      this.el.winOverlay.classList.add('show');
      this.el.winOverlay.classList.toggle('fresh', !!fresh);
    },

    shareText() {
      return `🧩 Daily Sudoku — ${this.prettyDate(this.data.dateKey, true)} (${this.data.label})\n⏱️ Solved in ${this.formatTime(this.getElapsed())}`;
    },

    async share() {
      const text = this.shareText();
      try {
        if (navigator.share && matchMedia('(hover: none)').matches) {
          await navigator.share({ text });
          return;
        }
        await navigator.clipboard.writeText(text);
        this.toast('Result copied — paste it to your opponent!');
      } catch (_) {
        this.toast(text);
      }
    },

    toast(msg) {
      const t = this.el.toast;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    },

    /* ---------------- Rendering ---------------- */
    render() {
      if (!this.data) return;
      const { puzzle, solution } = this.data;
      const values = this.values;
      const sel = this.selected;
      const selVal = sel >= 0 ? values[sel] : 0;

      // Rule conflicts (same digit twice in a row/col/box)
      const conflict = new Uint8Array(81);
      for (let u = 0; u < 27; u++) {
        const unit = E.UNITS[u];
        const seen = {};
        for (let k = 0; k < 9; k++) {
          const v = values[unit[k]];
          if (!v) continue;
          (seen[v] ||= []).push(unit[k]);
        }
        for (const v in seen) if (seen[v].length > 1) seen[v].forEach(i => { conflict[i] = 1; });
      }

      const counts = new Array(10).fill(0);
      for (let i = 0; i < 81; i++) counts[values[i]]++;

      for (let i = 0; i < 81; i++) {
        const { cell, value, noteSpans } = this.cells[i];
        const v = values[i];
        const given = puzzle[i] !== 0;
        const isPeer = sel >= 0 && E.IS_PEER[sel * 81 + i] === 1;
        const wrong = !given && v && this.showMistakes && v !== solution[i];

        cell.classList.toggle('given', given);
        cell.classList.toggle('user', !given && v !== 0);
        cell.classList.toggle('selected', i === sel);
        cell.classList.toggle('peer', isPeer);
        cell.classList.toggle('same', selVal !== 0 && v === selVal && i !== sel);
        cell.classList.toggle('conflict', conflict[i] === 1 && !given);
        cell.classList.toggle('conflict-given', conflict[i] === 1 && given);
        cell.classList.toggle('wrong', !!wrong);

        value.textContent = v || '';
        const n = v ? 0 : this.notes[i];
        for (let d = 1; d <= 9; d++) {
          const span = noteSpans[d - 1];
          const on = (n >> d) & 1;
          span.textContent = on ? d : '';
          span.classList.toggle('note-hl', !!on && d === selVal);
        }
      }

      for (let d = 1; d <= 9; d++) {
        const btn = this.padButtons[d - 1];
        const left = 9 - counts[d];
        btn.classList.toggle('done', left <= 0);
        btn.querySelector('.pad-left').textContent = left > 0 ? left : '';
        btn.classList.toggle('notes-mode', this.notesMode);
      }

      const el = this.el;
      el.notesBtn.classList.toggle('active', this.notesMode);
      el.notesBtn.querySelector('.ctrl-state').textContent = this.notesMode ? 'ON' : 'OFF';
      el.mistakesBtn.classList.toggle('active', this.showMistakes);
      el.mistakesBtn.querySelector('.ctrl-state').textContent = this.showMistakes ? 'ON' : 'OFF';
      el.undoBtn.disabled = !this.undoStack.length || this.completed;
      el.redoBtn.disabled = !this.redoStack.length || this.completed;

      const isToday = this.data.dateKey === E.todayKey();
      el.dateLabel.textContent = isToday ? `Today · ${this.prettyDate(this.data.dateKey)}` : this.prettyDate(this.data.dateKey, true);
      el.nextDay.disabled = isToday;
      el.diffBadge.textContent = this.data.label;
      el.diffBadge.className = `sudoku-diff-badge diff-${this.data.difficulty}`;
    },

    /* ---------------- Keyboard ---------------- */
    handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'z') { e.preventDefault(); if (e.shiftKey) this.redo(); else this.undo(); }
        else if (k === 'y') { e.preventDefault(); this.redo(); }
        return;
      }
      if (e.altKey) return;

      const m = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
      if (m) {
        e.preventDefault();
        const d = Number(m[1]);
        if (d === 0) this.erase();
        else this.inputDigit(d, e.shiftKey);
        return;
      }

      switch (e.key) {
        case 'ArrowUp': this.moveSelection(-1, 0); break;
        case 'ArrowDown': this.moveSelection(1, 0); break;
        case 'ArrowLeft': this.moveSelection(0, -1); break;
        case 'ArrowRight': this.moveSelection(0, 1); break;
        case 'Backspace':
        case 'Delete': e.preventDefault(); this.erase(); break;
        case 'n': case 'N': this.toggleNotesMode(); break;
        case 'p': case 'P': this.togglePause(); break;
        case 'Escape': this.select(-1); break;
      }
    }
  };

  game.init();
  return game;
})();
