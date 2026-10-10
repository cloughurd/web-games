# 🎈 Kids Learning Arcade

A fast, friendly, and 100% client-side educational game collection designed for young kids learning their letters, numbers, and keyboard keys.

Playable on any modern computer, iPad, or tablet with zero setup or build tools required.

---

## 🎮 Games Included

1. **🫧 Bubble Pop**
   - Pop falling bubbles containing letters or numbers before they reach the ground.
   - Independent toggles for uppercase (`ABC`), lowercase (`abc`), and digits (`123`).
   - Gentle, Normal, and Fast speed settings.
2. **🔢 Number Match**
   - Early addition problems (sums $\le 9$) with visual counting emoji helpers (apples, stars, cookies, puppies).
   - Press the key on the keyboard or tap the large on-screen keypad.
3. **🧼 Soap Scrub**
   - Clear foamy soap suds off cute illustrations (Dino, Rocket, Puppy, Clownfish) by matching letters and numbers.
   - Includes a **`📷 My Photo`** button so parents can load family or pet photos to wash!
4. **🏰 Castle Quest**
   - Choose a character (🐰 Bunny, 🦊 Fox, 🦄 Unicorn, 👑 Knight) and hop across adjacent glowing tiles to reach the castle while collecting jewels along the trail.
5. **🔴🟡 4 in a Row (Two-Player Connect 4)**
   - Turn-based multiplayer on the same keyboard.
   - Letters control column drops, with letters dynamically rotating after each move.
   - Dynamic player-turn background shading (sunny yellow ↔ coral red) makes turns instantly clear at a glance.
6. **🦁 Animal Phonics**
   - Find the starting letter for friendly animals (🐶 Dog, 🦁 Lion, 🐻 Bear, 🐸 Frog, etc.).
   - Spoken audio prompt + on-screen letter buttons and keyboard input.
7. **🐛 Spelling Caterpillar**
   - Spell simple 3-letter words (CAT, DOG, SUN, PIG, BUS, BUG, etc.) to grow the caterpillar.
   - Watch the caterpillar transform into a flying butterfly upon completion!
8. **👀 Sight Words**
   - Listen to the word spoken aloud and click the matching card with the mouse.
   - Designed to practice mouse coordination, listening, and early word recognition.

---

## 🧩 Puzzle Room (For Grown-Ups & Family Races)

Click the **`🧩 Puzzles`** button in the header (or navigate directly to `#puzzles` / `#sudoku`) to enter the grown-up puzzle mode:

- **🔢 Daily Sudoku:**
  - One shared, deterministic puzzle per calendar day so two players can race on separate devices on the exact same board.
  - Progressive weekday difficulty curve (Easy on Monday $\rightarrow$ Expert on Saturday).
  - Built-in timer with pause support.
  - On-screen touch keypad (digits disappear when all 9 are placed) + full keyboard support (1–9, arrows, backspace).
  - Pencil notes mode (`N` or Shift+number) with auto-candidate cleanup across rows, columns, and 3x3 boxes when a number is placed.
  - Auto-Notes generator, Undo/Redo (`Ctrl+Z` / `Ctrl+Y`), error/mistake highlighter, and a one-tap **Share Time** button to copy your race results!

---

## 🔊 Sound System
- **🎵 FX Only (Default):** Cute Web Audio-synthesized bubble pops, squeaks, boings, clinks, and fanfare chimes without robotic voice output.
- **🔊 Voice & FX:** Speaks letter names and numbers aloud.
- **🔇 Muted:** Silent play mode.

---

## 🛠️ Tech Architecture
- **Vanilla HTML5, CSS3, & Modern JavaScript**
- **Web Audio API** real-time sound synthesis (no external MP3 asset downloads required)
- **Zero build steps:** Works immediately out of the box with GitHub Pages
