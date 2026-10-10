/* ==========================================================
   SUDOKU ENGINE — deterministic daily puzzle generator
   ----------------------------------------------------------
   Every device generates the exact same puzzle for a given
   date key ("YYYY-MM-DD"), so two people can race on the same
   board without any server. Only integer math + a seeded PRNG
   is used, so results are identical across browsers.

   NOTE: Changing anything that affects generation (seed string,
   difficulty targets, removal order) changes every daily puzzle.
   Bump GENERATOR_VERSION if you do, so saved progress is reset.
   ========================================================== */
const SudokuEngine = (() => {
  const GENERATOR_VERSION = 1;

  const DIFFICULTIES = {
    easy:   { label: 'Easy',   targetGivens: 38, singlesOnly: true },
    medium: { label: 'Medium', targetGivens: 30, singlesOnly: true },
    hard:   { label: 'Hard',   targetGivens: 26, requireAdvanced: true },
    expert: { label: 'Expert', targetGivens: 17, requireAdvanced: true, extraPass: true } // strip as many as possible
  };

  // Difficulty ramps through the week (Sun..Sat), newspaper-style.
  const WEEKDAY_DIFFICULTY = ['medium', 'easy', 'easy', 'medium', 'hard', 'hard', 'expert'];

  // ---------- Board geometry ----------
  const ROW = new Array(81), COL = new Array(81), BOX = new Array(81);
  for (let i = 0; i < 81; i++) {
    ROW[i] = Math.floor(i / 9);
    COL[i] = i % 9;
    BOX[i] = Math.floor(ROW[i] / 3) * 3 + Math.floor(COL[i] / 3);
  }

  const UNITS = [];
  for (let r = 0; r < 9; r++) UNITS.push([...Array(9)].map((_, c) => r * 9 + c));
  for (let c = 0; c < 9; c++) UNITS.push([...Array(9)].map((_, r) => r * 9 + c));
  for (let b = 0; b < 9; b++) {
    const br = Math.floor(b / 3) * 3, bc = (b % 3) * 3;
    const unit = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) unit.push((br + r) * 9 + bc + c);
    UNITS.push(unit);
  }

  const PEERS = [];
  const IS_PEER = new Uint8Array(81 * 81);
  for (let i = 0; i < 81; i++) {
    const peers = [];
    for (let j = 0; j < 81; j++) {
      if (i !== j && (ROW[i] === ROW[j] || COL[i] === COL[j] || BOX[i] === BOX[j])) {
        peers.push(j);
        IS_PEER[i * 81 + j] = 1;
      }
    }
    PEERS.push(peers);
  }

  const ALL = 0x3FE; // bits 1..9

  function popcount(m) {
    let n = 0;
    while (m) { m &= m - 1; n++; }
    return n;
  }

  // ---------- Seeded randomness ----------
  function hashString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // ---------- Mask helpers ----------
  function buildMasks(grid) {
    const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
    for (let i = 0; i < 81; i++) {
      const v = grid[i];
      if (!v) continue;
      const bit = 1 << v;
      if ((rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]) & bit) return null; // conflict
      rows[ROW[i]] |= bit; cols[COL[i]] |= bit; boxes[BOX[i]] |= bit;
    }
    return { rows, cols, boxes };
  }

  /** Candidate bitmask for cell i given current values (ignores the cell's own value). */
  function candidatesFor(grid, i) {
    let used = 0;
    const peers = PEERS[i];
    for (let k = 0; k < peers.length; k++) {
      const v = grid[peers[k]];
      if (v) used |= 1 << v;
    }
    return ALL & ~used;
  }

  // ---------- Full solution generator ----------
  function generateSolution(rng) {
    const grid = new Array(81).fill(0);
    const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);

    function fill(pos) {
      if (pos === 81) return true;
      const r = ROW[pos], c = COL[pos], b = BOX[pos];
      const used = rows[r] | cols[c] | boxes[b];
      const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
      for (let k = 0; k < 9; k++) {
        const d = digits[k], bit = 1 << d;
        if (used & bit) continue;
        grid[pos] = d; rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
        if (fill(pos + 1)) return true;
        rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit; grid[pos] = 0;
      }
      return false;
    }

    fill(0);
    return grid;
  }

  // ---------- Solution counter (stops at `limit`) ----------
  function countSolutions(input, limit = 2) {
    const g = input.slice();
    const m = buildMasks(g);
    if (!m) return 0;
    const { rows, cols, boxes } = m;
    let count = 0;

    function search() {
      let best = -1, bestMask = 0, bestCount = 10;
      for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const mask = ALL & ~(rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]);
        const n = popcount(mask);
        if (n === 0) return; // dead end
        if (n < bestCount) {
          best = i; bestMask = mask; bestCount = n;
          if (n === 1) break;
        }
      }
      if (best === -1) { count++; return; }
      const r = ROW[best], c = COL[best], b = BOX[best];
      for (let d = 1; d <= 9; d++) {
        const bit = 1 << d;
        if (!(bestMask & bit)) continue;
        g[best] = d; rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
        search();
        rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit; g[best] = 0;
        if (count >= limit) return;
      }
    }

    search();
    return count;
  }

  // ---------- Human-style solver: naked + hidden singles only ----------
  function solvableBySingles(input) {
    const g = input.slice();
    const m = buildMasks(g);
    if (!m) return false;
    const { rows, cols, boxes } = m;
    const cand = i => ALL & ~(rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]);
    const place = (i, d) => {
      const bit = 1 << d;
      g[i] = d; rows[ROW[i]] |= bit; cols[COL[i]] |= bit; boxes[BOX[i]] |= bit;
    };

    let progress = true;
    while (progress) {
      progress = false;

      // Naked singles
      for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const mask = cand(i);
        if (mask === 0) return false;
        if ((mask & (mask - 1)) === 0) {
          place(i, 31 - Math.clz32(mask));
          progress = true;
        }
      }

      // Hidden singles
      for (let u = 0; u < 27; u++) {
        const unit = UNITS[u];
        for (let d = 1; d <= 9; d++) {
          const bit = 1 << d;
          let spot = -1, n = 0, present = false;
          for (let k = 0; k < 9; k++) {
            const i = unit[k];
            if (g[i] === d) { present = true; break; }
            if (!g[i] && (cand(i) & bit)) { n++; spot = i; }
          }
          if (present) continue;
          if (n === 0) return false;
          if (n === 1) { place(spot, d); progress = true; }
        }
      }
    }

    for (let i = 0; i < 81; i++) if (!g[i]) return false;
    return true;
  }

  // ---------- Date helpers ----------
  const pad2 = n => String(n).padStart(2, '0');
  function dateToKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
  function keyToDate(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function todayKey() { return dateToKey(new Date()); }
  function shiftKey(key, days) {
    const d = keyToDate(key);
    d.setDate(d.getDate() + days);
    return dateToKey(d);
  }
  function difficultyForKey(key) {
    return WEEKDAY_DIFFICULTY[keyToDate(key).getDay()];
  }

  // ---------- Daily puzzle ----------
  const cache = new Map();

  function carve(solution, cfg, rng) {
    const puzzle = solution.slice();
    const isOk = () => cfg.singlesOnly ? solvableBySingles(puzzle) : countSolutions(puzzle, 2) === 1;

    // Remove cells in 180°-symmetric pairs for a classic look
    const order = shuffle([...Array(41).keys()], rng);
    let givens = 81;
    for (let k = 0; k < order.length; k++) {
      if (givens <= cfg.targetGivens) break;
      const a = order[k], b = 80 - a;
      const savedA = puzzle[a], savedB = puzzle[b];
      puzzle[a] = 0; puzzle[b] = 0;
      if (isOk()) {
        givens -= a === b ? 1 : 2;
      } else {
        puzzle[a] = savedA; puzzle[b] = savedB;
      }
    }

    // Expert: keep stripping individual clues (breaks symmetry, but much tougher)
    if (cfg.extraPass) {
      const singles = shuffle([...Array(81).keys()], rng);
      for (let k = 0; k < singles.length; k++) {
        if (givens <= cfg.targetGivens) break;
        const i = singles[k];
        if (!puzzle[i]) continue;
        const saved = puzzle[i];
        puzzle[i] = 0;
        if (isOk()) givens--; else puzzle[i] = saved;
      }
    }

    return { puzzle, givens };
  }

  function generateDaily(dateKey) {
    if (cache.has(dateKey)) return cache.get(dateKey);

    const difficulty = difficultyForKey(dateKey);
    const cfg = DIFFICULTIES[difficulty];
    const rng = mulberry32(hashString(`daily-sudoku-v${GENERATOR_VERSION}-${dateKey}`));

    // Hard/Expert must need more than naked/hidden singles; retry (deterministically) until they do.
    let solution, carved;
    for (let attempt = 0; attempt < 25; attempt++) {
      solution = generateSolution(rng);
      carved = carve(solution, cfg, rng);
      if (!cfg.requireAdvanced || !solvableBySingles(carved.puzzle)) break;
    }

    const result = {
      dateKey, difficulty, label: cfg.label,
      puzzle: carved.puzzle, solution, givens: carved.givens
    };
    cache.set(dateKey, result);
    return result;
  }

  return {
    GENERATOR_VERSION,
    DIFFICULTIES,
    ROW, COL, BOX, UNITS, PEERS, IS_PEER,
    candidatesFor,
    countSolutions,
    solvableBySingles,
    generateDaily,
    difficultyForKey,
    todayKey,
    shiftKey,
    keyToDate,
    dateToKey
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SudokuEngine;
}
