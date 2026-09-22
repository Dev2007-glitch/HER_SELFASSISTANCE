/**
 * HER & Mark-LIII Autonomous Voice Assistant Service
 * Inspired by FatihMakes/Mark-LIII Voice Architecture.
 * 
 * Features:
 * - Real-Time Speech Recognition (STT) with Silence-Detection Turn-Taking
 * - Anti-Self-Hearing Mic Isolation (never records its own spoken voice)
 * - "Hey HER" / "Hey Jarvis" Local Hands-Free Wake-Word Engine
 * - Natural Voice Synthesis (TTS) with Persona selection, rate, and pitch tuning
 * - Web Audio API Synthesized Chimes (Wake, Start, Done, Error)
 * - Real-Time Microphone Frequency Analyser for Glowing Holographic Audio Orb
 * - App Action Dispatcher (direct live store mutations & instant voice answers)
 */
import { store } from '../store.js';
import { sendChatMessage } from './ai-service.js';

const STORAGE_KEY_VOICE = 'her_voice_settings_v1';

export const DEFAULT_VOICE_CONFIG = {
  enabled: true,
  autoSpeak: true,
  wakeWordEnabled: true,
  wakeWord: 'hey her', // 'hey her' | 'hey jarvis'
  voiceURI: '',
  rate: 1.05,
  pitch: 1.0,
  volume: 1.0,
  instantAck: false, // Turned off to avoid redundant speech overlapping
  soundEffects: true
};

class VoiceService {
  constructor() {
    this.config = this.loadConfig();
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isThinking = false;
    this.isSessionActive = false;
    this.activeQueryId = 0;
    this.audioCtx = null;
    this.analyser = null;
    this.micStream = null;
    this.dataArray = null;
    this.listeners = [];
    this.availableVoices = [];

    this.currentTranscript = '';
    this.silenceTimer = null;
    this.speechBufferTimer = null;

    this.initSpeechRecognition();
    this.initVoices();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICE);
      return saved ? { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_VOICE_CONFIG };
    } catch {
      return { ...DEFAULT_VOICE_CONFIG };
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify(this.config));
    } catch (e) {
      console.error('Error saving voice config:', e);
    }
    this.notify({ type: 'config_updated', config: this.config });
  }

  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices() || [];
      this.notify({ type: 'voices_updated' });
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getBestVoice() {
    if (!this.availableVoices || this.availableVoices.length === 0) {
      this.availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    }

    if (this.config.voiceURI) {
      const chosen = this.availableVoices.find(v => v.voiceURI === this.config.voiceURI);
      if (chosen) return chosen;
    }

    // Prefer high-quality, natural-sounding English voices
    const preferredVoices = [
      'Google UK English Female',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Samantha',
      'Karen',
      'Google US English',
      'Victoria',
      'en-US',
      'en-GB'
    ];

    for (const name of preferredVoices) {
      const match = this.availableVoices.find(v => v.name.includes(name) || v.lang.includes(name));
      if (match) return match;
    }

    return this.availableVoices.find(v => v.lang.startsWith('en')) || this.availableVoices[0] || null;
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('SpeechRecognition API not supported on this browser.');
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notify({ type: 'status', status: 'listening' });
    };

    this.recognition.onresult = (event) => {
      // 🛡️ ANTI-SELF-HEARING: Ignore all mic input if assistant is currently speaking or thinking
      if (this.isSpeaking || this.isThinking) {
        return;
      }

      let interim = '';
      let latestFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          latestFinal += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const activeWords = (latestFinal || interim).trim();
      if (!activeWords) return;

      this.currentTranscript = (this.currentTranscript ? this.currentTranscript + ' ' : '') + (latestFinal || interim).trim();

      // De-duplicate repeated adjacent words
      const displayWords = (interim || activeWords).trim();
      this.notify({ type: 'transcript', text: displayWords, isInterim: !latestFinal });

      // Immediate Stop/Cancel trigger
      const lower = displayWords.toLowerCase();
      if (lower === 'stop' || lower === 'cancel' || lower === 'be quiet' || lower === 'shut up') {
        this.stopSpeaking();
        this.currentTranscript = '';
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.notify({ type: 'transcript', text: 'Stopped.' });
        return;
      }

      // Wake-Word Detection
      if (this.config.wakeWordEnabled && !this.isWakeWordActive) {
        const wakeWords = ['hey her', 'hey jarvis', 'ok her', 'ok jarvis', 'hi her', 'jarvis', 'her assistant'];
        const matched = wakeWords.some(w => lower.includes(w));

        if (matched) {
          this.isWakeWordActive = true;
          this.playChime('wake');
          this.notify({ type: 'wake', message: 'Wake Word Detected! Listening...' });
          this.currentTranscript = lower.replace(/^(hey|hi|ok)?\s*(her|jarvis)\s*[,.]?\s*/i, '').trim();
        }
      }

      // ⏱️ Silence-Detection Turn-Taking:
      // Wait for 1.1s after the user stops speaking before querying AI
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      this.silenceTimer = setTimeout(() => {
        const queryToProcess = this.currentTranscript.trim();
        if (queryToProcess.length > 1 && !this.isSpeaking && !this.isThinking) {
          this.currentTranscript = '';
          this.finalizeUserTurn(queryToProcess);
        }
      }, 1100);
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('Speech recognition error:', event.error);
      this.notify({ type: 'error', error: event.error });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      // Auto-restart ONLY if session is actively open AND not speaking/thinking
      if (this.isSessionActive && !this.isSpeaking && !this.isThinking && this.config.enabled) {
        setTimeout(() => {
          if (this.isSessionActive && !this.isSpeaking && !this.isThinking) {
            try {
              this.recognition.start();
            } catch {}
          }
        }, 300);
      }
      this.notify({ type: 'status', status: 'idle' });
    };
  }

  /**
   * Finalizes the user's spoken turn, pauses mic, and routes the query
   */
  async finalizeUserTurn(rawQuery) {
    if (!this.isSessionActive || this.isThinking || this.isSpeaking) return;

    let cleanQuery = rawQuery.replace(/^(hey|hi|ok)?\s*(her|jarvis)\s*[,.]?\s*/i, '').trim();
    if (!cleanQuery) return;

    // Pause mic recognition while processing & speaking
    this.stopRecognitionOnly();
    this.isThinking = true;
    this.notify({ type: 'thinking_start', prompt: cleanQuery });

    await this.handleVoiceQuery(cleanQuery);
  }

  /**
   * Starts a full voice session (called when modal opens)
   */
  async startSession() {
    this.isSessionActive = true;
    this.activeQueryId++;
    await this.startListening();
  }

  /**
   * Immediately closes the session, stops all speech/mic, and aborts pending queries
   */
  closeSession() {
    this.isSessionActive = false;
    this.activeQueryId++; // Invalidate any pending in-flight AI queries

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.speechBufferTimer) {
      clearTimeout(this.speechBufferTimer);
      this.speechBufferTimer = null;
    }

    this.stopSpeaking();
    this.stopRecognitionOnly();

    // Abort speech recognition
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
    }

    // Release mic stream tracks
    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach(track => track.stop());
      } catch {}
      this.micStream = null;
    }

    this.isListening = false;
    this.isSpeaking = false;
    this.isThinking = false;
    this.currentTranscript = '';
    this.isWakeWordActive = false;
    this.notify({ type: 'status', status: 'idle' });
  }

  async startListening() {
    if (!this.isSessionActive) return;

    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    await this.initAudioContext();

    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (this.recognition && !this.isListening && !this.isSpeaking && this.isSessionActive) {
      try {
        this.recognition.start();
        this.playChime('start');
      } catch (e) {
        // Already active
      }
    }
  }

  stopRecognitionOnly() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
  }

  stopListening() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.currentTranscript = '';
    this.stopRecognitionOnly();
    this.isWakeWordActive = false;
    this.notify({ type: 'status', status: 'idle' });
  }

  async initAudioContext() {
    if (this.audioCtx && this.analyser) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = this.audioCtx.createMediaStreamSource(this.micStream);
        source.connect(this.analyser);
      }
    } catch (e) {
      console.warn('Audio Context / Mic visualizer permission:', e);
    }
  }

  getAudioFrequencyData() {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return sum / this.dataArray.length; // Average volume level (0 - 255)
  }

  /**
   * Generates Mark-LIII style sci-fi synthesized audio chimes with Web Audio API
   */
  playChime(type = 'wake') {
    if (!this.config.soundEffects) return;

    try {
      const ctx = this.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'wake') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'done') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio chime error ignored
    }
  }

  /**
   * Text-to-Speech Voice Synthesis with strict Anti-Self-Hearing protection
   */
  speak(text) {
    return new Promise((resolve) => {
      if (!this.isSessionActive || typeof window === 'undefined' || !window.speechSynthesis) {
        this.isSpeaking = false;
        resolve();
        return;
      }

      if (!text || text.trim().length === 0) {
        this.isSpeaking = false;
        resolve();
        return;
      }

      // Mute recognition completely during speech
      this.stopRecognitionOnly();
      this.isSpeaking = true;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      // Clean markdown characters and emojis for natural, concise voice reading
      const cleaned = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*#_~>]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[-•]\s/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\n+/g, '. ')
        .trim();

      window.speechSynthesis.cancel();

      if (!this.isSessionActive) {
        this.isSpeaking = false;
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      const voice = this.getBestVoice();
      if (voice) utterance.voice = voice;

      utterance.rate = this.config.rate || 1.05;
      utterance.pitch = this.config.pitch || 1.0;
      utterance.volume = this.config.volume || 1.0;

      utterance.onstart = () => {
        if (!this.isSessionActive) {
          window.speechSynthesis.cancel();
          this.isSpeaking = false;
          return;
        }
        this.isSpeaking = true;
        this.notify({ type: 'speaking_start', text: cleaned });
      };

      const finishSpeaking = () => {
        this.isSpeaking = false;
        this.notify({ type: 'speaking_end' });

        // Buffer quiet delay before re-enabling mic listening to prevent echo
        if (this.speechBufferTimer) clearTimeout(this.speechBufferTimer);
        this.speechBufferTimer = setTimeout(() => {
          if (this.isSessionActive && !this.isSpeaking && !this.isThinking && this.config.enabled) {
            this.startListening();
          }
        }, 450);

        resolve();
      };

      utterance.onend = finishSpeaking;
      utterance.onerror = finishSpeaking;

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.speechBufferTimer) clearTimeout(this.speechBufferTimer);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.isThinking = false;
    this.notify({ type: 'speaking_end' });
  }

  /**
   * Core Voice Action Dispatcher & Live App Execution
   */
  async handleVoiceQuery(userPrompt) {
    if (!this.isSessionActive || !userPrompt || userPrompt.trim().length === 0) {
      this.isThinking = false;
      if (this.isSessionActive) this.startListening();
      return;
    }

    const currentQueryId = ++this.activeQueryId;

    // 1. Direct App Command Interceptor (Mark task, keep promise, check habits)
    const directAction = this.executeDirectAppAction(userPrompt);
    if (directAction) {
      if (!this.isSessionActive || currentQueryId !== this.activeQueryId) return;

      this.isThinking = false;
      this.playChime('done');
      this.notify({
        type: 'response',
        prompt: userPrompt,
        reply: directAction.markdown || directAction.speech,
        actionExecuted: true
      });

      if (this.config.autoSpeak && this.isSessionActive) {
        await this.speak(directAction.speech);
      } else if (this.isSessionActive) {
        this.startListening();
      }
      return;
    }

    // 2. Complex AI Model Query with Real-Time Web App Context (in isVoiceMode)
    try {
      const reply = await sendChatMessage([{ role: 'user', content: userPrompt }], null, { isVoiceMode: true });

      // Check if session was closed or a newer query started while awaiting AI response
      if (!this.isSessionActive || currentQueryId !== this.activeQueryId) {
        this.isThinking = false;
        return;
      }

      this.isThinking = false;
      this.playChime('done');

      this.notify({
        type: 'response',
        prompt: userPrompt,
        reply
      });

      if (this.config.autoSpeak && reply && this.isSessionActive) {
        await this.speak(reply);
      } else if (this.isSessionActive) {
        this.startListening();
      }
    } catch (err) {
      if (!this.isSessionActive || currentQueryId !== this.activeQueryId) {
        this.isThinking = false;
        return;
      }

      this.isThinking = false;
      this.playChime('error');
      const errMsg = `I could not complete that: ${err.message}`;
      this.notify({ type: 'error', error: err.message });
      if (this.config.autoSpeak && this.isSessionActive) {
        await this.speak(errMsg);
      } else if (this.isSessionActive) {
        this.startListening();
      }
    }
  }

  /**
   * Voice Command Router for Direct Store Mutations and Instant Answers
   */
  executeDirectAppAction(prompt) {
    const p = prompt.toLowerCase();
    const state = store.state;

    // A. "Mark [task] as done" / "Complete [task]"
    if (p.includes('mark') || p.includes('complete') || p.includes('finish') || p.includes('done')) {
      // 1. Check Top 3
      const top3 = state.daily?.top3 || [];
      for (const t of top3) {
        const titleWords = t.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matches = titleWords.some(w => p.includes(w));
        if (matches) {
          t.completed = true;
          store.saveState();
          return {
            speech: `Marked "${t.title}" as done on your dashboard.`,
            markdown: `### ✅ Task Completed by Voice\n\n**"${t.title}"** marked as **Done** on your Daily Dashboard.`
          };
        }
      }

      // 2. Check Daily Checklists
      const checklist = state.daily?.checklist || {};
      const allChecklist = [
        ...(checklist.mind || []),
        ...(checklist.body || []),
        ...(checklist.future || []),
        ...(checklist.self || [])
      ];

      for (const c of allChecklist) {
        const words = c.text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        if (words.some(w => p.includes(w))) {
          c.completed = true;
          store.recalculateMetrics();
          store.saveState();
          return {
            speech: `Checked off "${c.text}" from your daily checklist.`,
            markdown: `### ✅ Checklist Item Completed\n\n**"${c.text}"** marked completed. Presence Score updated to **${state.daily?.presenceScore || 0}%**.`
          };
        }
      }

      // 3. Mark Promise as Kept
      if (p.includes('promise')) {
        if (state.daily?.promise) {
          state.daily.promise.status = 'yes';
          store.saveState();
          return {
            speech: `Marked your daily promise "${state.daily.promise.text}" as kept today.`,
            markdown: `### 💎 Daily Promise Honored\n\nYour promise **"${state.daily.promise.text}"** has been marked **Kept**.`
          };
        }
      }
    }

    // B. "Did I keep my promise?" / "Promise status"
    if (p.includes('promise')) {
      const promise = state.daily?.promise;
      const isKept = promise?.status === 'yes';
      const text = promise?.text || 'I keep promises to myself.';
      return {
        speech: isKept 
          ? `Yes, you kept your daily promise "${text}" today!` 
          : `Your promise "${text}" is currently pending. Say "mark promise done" when ready.`,
        markdown: `### 💎 Promise Status\n- **Promise**: "${text}"\n- **Status**: **${isKept ? '✅ Kept' : '⏳ Pending'}**`
      };
    }

    // C. "What tasks did I complete?" / "What is pending?"
    if (p.includes('what tasks') || p.includes('task status') || p.includes('tasks status') || p.includes('what work')) {
      const top3 = state.daily?.top3 || [];
      const done = top3.filter(t => t.completed);
      const pending = top3.filter(t => !t.completed);

      if (pending.length === 0 && top3.length > 0) {
        return {
          speech: `All ${top3.length} of your Top 3 tasks are finished today. Great work!`,
          markdown: `### 📋 Tasks Status\nAll **${top3.length}** Top 3 priorities are completed today.`
        };
      }

      const pendingNames = pending.map(t => t.title).join(', ');
      return {
        speech: `You have completed ${done.length} of ${top3.length} tasks. Pending: ${pendingNames}.`,
        markdown: `### 📋 Tasks Status\n- Completed: **${done.length}/${top3.length}**\n- Pending: **${pendingNames}**`
      };
    }

    // D. "Unmarked experiences" / "lifestyle experiences"
    if (p.includes('unmarked') || p.includes('experience') || p.includes('lifestyle')) {
      const cards = state.live?.cards || [];
      const pending = cards.filter(c => !c.done);
      const done = cards.filter(c => c.done);

      if (pending.length > 0) {
        return {
          speech: `You have ${pending.length} unmarked lifestyle cards, including "${pending[0].title}".`,
          markdown: `### ☕ Unmarked Experiences\n- Unmarked: **${pending.length}** cards (e.g. *${pending[0].title}*)\n- Completed: **${done.length}** cards.`
        };
      }
      return {
        speech: `You have experienced all available lifestyle cards!`,
        markdown: `### ☕ Experiences Status\nAll lifestyle cards are marked as experienced.`
      };
    }

    // E. Greetings / Identity
    if (p === 'hello' || p === 'hi' || p === 'hey' || p.includes('who are you')) {
      return {
        speech: `Hello! I am HER, your Mark-LIII voice assistant. How can I help you today?`,
        markdown: `### ✨ HER Voice Assistant\nReady to help you manage tasks, review your routines, and answer questions.`
      };
    }

    return null;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(data = {}) {
    this.listeners.forEach(fn => fn(this, data));
  }
}

export const voiceAssistant = new VoiceService();
