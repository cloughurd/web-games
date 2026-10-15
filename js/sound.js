/* ==========================================================
       1. SOUND EFFECTS & SPEECH SYNTHESIS ENGINE (Web Audio API)
       ========================================================== */
    const SOUND_MODES = [
      { id: 'fx', icon: '🎵', label: 'FX Only', title: 'Sound: Effects Only (Bubbles, Chimes, No Voice)' },
      { id: 'voice', icon: '🔊', label: 'Voice & FX', title: 'Sound: Voice & Effects' },
      { id: 'off', icon: '🔇', label: 'Muted', title: 'Sound: Muted (Silent)' }
    ];

    class SoundEngine {
      constructor() {
        this.ctx = null;
        // Default to 'fx' (Sound effects only: bubbles popping, chimes, no robotic voice)
        this.mode = localStorage.getItem('kid_arcade_sound_mode') || 'fx';
        this.bestVoice = null;

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const updateVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
              this.bestVoice = voices.find(v => v.lang.startsWith('en') && 
                (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Aria'))) 
                || voices.find(v => v.lang.startsWith('en')) 
                || voices[0];
            }
          };
          updateVoices();
          window.speechSynthesis.onvoiceschanged = updateVoices;
        }
      }

      initContext() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      isFxEnabled() {
        return this.mode === 'fx' || this.mode === 'voice';
      }

      isVoiceEnabled() {
        return this.mode === 'voice';
      }

      setMode(mode) {
        this.mode = mode;
        localStorage.setItem('kid_arcade_sound_mode', mode);
      }

      playPop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      }

      playSuccess() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Friendly celebratory chime arpeggio: C5, E5, G5, C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + idx * 0.07;
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.28, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(start);
          osc.stop(start + 0.26);
        });
      }

      playNewProblem() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Soft cheerful 2-note bell: F5, A5
        const notes = [698.46, 880.00];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + idx * 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(start);
          osc.stop(start + 0.21);
        });
      }

      playBoop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Warm, gentle non-punishing thud
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
      }

      playSqueak() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Bubbly squeaky clean wash sound
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.11);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      }

      playFanfare() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Big celebratory victory fanfare: C5, E5, G5, C6, E6
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + idx * 0.09;
          const duration = idx === notes.length - 1 ? 0.6 : 0.28;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.32, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });
      }

      playHop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Cute cartoon boing / hop sound
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
      }

      playGem() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // High crystal chime for collectibles
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1174.66, now);
        osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.06);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      }

      playDrop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;

        // Satisfying mechanical clink/drop sound for Connect 4 piece
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
      }

      playBoop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }

      playFlutter() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 880, 1046.50, 1318.51];
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + i * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      }

      playCarve() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Crisp wooden/pumpkin pulp slice tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);

        // Crisp pop
        const pop = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        pop.type = 'sine';
        pop.frequency.setValueAtTime(820, now);
        pop.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
        popGain.gain.setValueAtTime(0.25, now);
        popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        pop.connect(popGain);
        popGain.connect(this.ctx.destination);
        pop.start(now);
        pop.stop(now + 0.05);
      }

      playCandleGlow() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [392.00, 493.88, 587.33, 783.99, 987.77];
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.6);
        });
      }

      playDoorKnock() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [0, 0.14].forEach(offset => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + offset;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, start);
          osc.frequency.exponentialRampToValueAtTime(65, start + 0.08);
          gain.gain.setValueAtTime(0.45, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.08);
        });
      }

      playCandyDrop() {
        if (!this.isFxEnabled()) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [659.25, 880, 1174.66];
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + i * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.23);
        });
      }

      speak(text, force = false) {
        if (this.mode === 'off' || !('speechSynthesis' in window)) return;
        if (!force && !this.isVoiceEnabled()) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.bestVoice) {
          utterance.voice = this.bestVoice;
        }
        utterance.rate = 0.90;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }
    }

    const sound = new SoundEngine();
