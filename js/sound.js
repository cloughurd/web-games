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

      speak(text) {
        if (!this.isVoiceEnabled() || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.bestVoice) {
          utterance.voice = this.bestVoice;
        }
        utterance.rate = 0.92;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }
    }

    const sound = new SoundEngine();
