/**
 * HER & Mark-LIII Holographic Voice Assistant Modal
 * Inspired by FatihMakes/Mark-LIII Voice Interface.
 * Features:
 * - Real-Time Glowing Holographic Orb & Sound Wave Visualizer
 * - Hands-Free "Hey HER" / "Hey Jarvis" Wake-Word Engine
 * - Natural Voice Synthesis (TTS) & Web Speech Recognition (STT)
 * - Live Transcripts & Direct App Action Feedback
 * - Quick Voice Command Chips
 */
import { voiceAssistant } from '../services/voice-service.js';
import { openAIAssistantModal } from './ai-assistant-modal.js';

let animationFrameId = null;

export function openVoiceAssistantModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const config = voiceAssistant.config;
  const isSpeechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const modalHtml = `
    <div class="modal-overlay voice-modal-overlay" id="voice-modal-overlay" style="display: flex; align-items: center; justify-content: center; backdrop-filter: blur(16px); background: rgba(14, 5, 8, 0.85); z-index: 10000; position: fixed; inset: 0; animation: fadeIn 0.3s ease;">
      <div class="voice-modal-dialog" style="max-width: 720px; width: 92vw; height: 88vh; max-height: 740px; background: linear-gradient(180deg, rgba(35, 12, 18, 0.95), rgba(18, 6, 9, 0.98)); border: 1.5px solid rgba(224, 138, 149, 0.3); border-radius: var(--radius-xl); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(224, 138, 149, 0.15); display: flex; flex-direction: column; overflow: hidden; position: relative;">
        
        <!-- Ambient Glowing Background Grid -->
        <div style="position: absolute; inset: 0; background-image: radial-gradient(rgba(224, 138, 149, 0.08) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; opacity: 0.6;"></div>

        <!-- Top Header Bar -->
        <div style="padding: 1rem 1.4rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(224, 138, 149, 0.15); position: relative; z-index: 2; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 0.7rem;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; box-shadow: 0 0 16px rgba(224, 138, 149, 0.4);">
              🎙️
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin: 0; font-weight: 700;">
                  HER Voice Assistant
                </h3>
                <span style="font-size: 0.68rem; padding: 0.15rem 0.55rem; border-radius: 12px; background: rgba(224, 138, 149, 0.2); color: var(--color-rose); font-weight: 600; border: 1px solid rgba(224, 138, 149, 0.35);">
                  Mark-LIII Engine
                </span>
              </div>
              <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0.1rem 0 0 0;">
                Live hands-free voice control & real-time audio reasoning.
              </p>
            </div>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button class="btn-ghost" id="voice-switch-to-text-btn" title="Switch to Text Chat" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: rgba(224, 138, 149, 0.08);">
              💬 Text Mode
            </button>
            <button class="modal-close-btn" id="close-voice-modal-btn" style="position: static; font-size: 1.5rem; line-height: 1; padding: 0.3rem 0.6rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>
        </div>

        <!-- Center Stage: Scrollable Body -->
        <div class="voice-scroll-area" id="voice-scroll-area" style="flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 1.2rem 1.4rem; position: relative; z-index: 2; scrollbar-width: thin;">
          
          <!-- State Indicator Pill -->
          <div id="voice-status-pill" style="margin-bottom: 1.1rem; padding: 0.32rem 0.95rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(224, 138, 149, 0.15); border: 1px solid rgba(224, 138, 149, 0.3); color: var(--color-rose); transition: all 0.3s ease; flex-shrink: 0;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #4ADE80; display: inline-block; animation: pulse 1.5s infinite;"></span>
            <span id="voice-status-text">Ready · Say "Hey HER" or click Mic</span>
          </div>

          <!-- Canvas Audio Visualizer -->
          <div class="voice-orb-container" style="position: relative; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <canvas id="voice-orb-canvas" width="180" height="180" style="position: absolute; inset: 0; width: 100%; height: 100%;"></canvas>
            
            <!-- Center Interactive Mic Orb -->
            <button id="voice-orb-btn" style="width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #E08A95, #6B1D2A 80%); border: 2.5px solid rgba(255, 255, 255, 0.6); box-shadow: 0 0 30px rgba(224, 138, 149, 0.6), inset 0 0 16px rgba(255, 255, 255, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #FFF; transition: all 0.25s ease; position: relative; z-index: 5;">
              <span id="voice-orb-icon">🎙️</span>
            </button>
          </div>

          <!-- Live Transcript Captions & Answers (Scrollable Box) -->
          <div id="voice-transcript-box" class="voice-transcript-box" style="margin-top: 1.2rem; min-height: 70px; max-height: 230px; max-width: 600px; width: 100%; background: rgba(14, 5, 8, 0.75); border: 1px solid rgba(224, 138, 149, 0.25); border-radius: var(--radius-lg); padding: 1rem 1.3rem; text-align: left; display: block; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; backdrop-filter: blur(10px); flex-shrink: 0; box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.4);">
            <div id="voice-transcript-text" style="margin: 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.55; white-space: pre-wrap; word-break: break-word;">
              Tap the mic or say "Hey HER" to speak...
            </div>
          </div>

          <!-- Quick Voice Command Suggestions -->
          <div style="margin-top: 1rem; display: flex; gap: 0.45rem; flex-wrap: wrap; justify-content: center; max-width: 600px; flex-shrink: 0; padding-bottom: 0.5rem;">
            <button class="voice-cmd-chip" data-cmd="What tasks did I complete today and what is pending?">📋 Tasks Status</button>
            <button class="voice-cmd-chip" data-cmd="Which lifestyle experiences haven't I marked yet?">☕ Unmarked Experiences</button>
            <button class="voice-cmd-chip" data-cmd="Did I keep my promise to myself today?">💎 Promise Status</button>
            <button class="voice-cmd-chip" data-cmd="Mark Machine Learning deep study as done">✅ Mark Study Done</button>
            <button class="voice-cmd-chip" data-cmd="Give me a quick 3-point summary of my 90-day goals">🎯 Goals Summary</button>
          </div>
        </div>

        <!-- Bottom Controls & Voice Customizer -->
        <div style="padding: 0.8rem 1.4rem; background: rgba(14, 5, 8, 0.95); border-top: 1px solid rgba(224, 138, 149, 0.15); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; position: relative; z-index: 2; flex-shrink: 0;">
          
          <!-- Wake Word & Auto-Speak Toggles -->
          <div style="display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="voice-wakeword-toggle" ${config.wakeWordEnabled ? 'checked' : ''} style="accent-color: var(--color-rose);">
              <span>⚡ "Hey HER" Wake Word</span>
            </label>

            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="voice-autospeak-toggle" ${config.autoSpeak ? 'checked' : ''} style="accent-color: var(--color-rose);">
              <span>🔊 Voice Reply (TTS)</span>
            </label>

            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="voice-sounds-toggle" ${config.soundEffects ? 'checked' : ''} style="accent-color: var(--color-rose);">
              <span>🎵 Sci-Fi Chimes</span>
            </label>
          </div>

          <!-- Speed & Voice Selector -->
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <select id="voice-rate-select" class="form-input" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; background: var(--bg-card); width: auto;">
              <option value="0.9" ${config.rate === 0.9 ? 'selected' : ''}>0.9x Calm</option>
              <option value="1.0" ${config.rate === 1.0 ? 'selected' : ''}>1.0x Normal</option>
              <option value="1.05" ${config.rate === 1.05 ? 'selected' : ''}>1.05x Natural</option>
              <option value="1.2" ${config.rate === 1.2 ? 'selected' : ''}>1.2x Quick</option>
            </select>

            <button class="btn-secondary" id="voice-stop-audio-btn" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;">
              ⏹️ Stop Speech
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  // DOM Elements
  const overlay = document.getElementById('voice-modal-overlay');
  const closeBtn = document.getElementById('close-voice-modal-btn');
  const switchToTextBtn = document.getElementById('voice-switch-to-text-btn');
  const orbBtn = document.getElementById('voice-orb-btn');
  const orbIcon = document.getElementById('voice-orb-icon');
  const statusPill = document.getElementById('voice-status-pill');
  const statusText = document.getElementById('voice-status-text');
  const transcriptText = document.getElementById('voice-transcript-text');
  const wakeWordToggle = document.getElementById('voice-wakeword-toggle');
  const autoSpeakToggle = document.getElementById('voice-autospeak-toggle');
  const soundsToggle = document.getElementById('voice-sounds-toggle');
  const rateSelect = document.getElementById('voice-rate-select');
  const stopAudioBtn = document.getElementById('voice-stop-audio-btn');
  const canvas = document.getElementById('voice-orb-canvas');
  const cmdChips = document.querySelectorAll('.voice-cmd-chip');

  // Canvas visualizer setup
  const ctx = canvas ? canvas.getContext('2d') : null;
  let pulseRadius = 60;
  let pulseAngle = 0;

  function renderVisualizer() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const freq = voiceAssistant.getAudioFrequencyData(); // 0 to 255
    const isSpeaking = voiceAssistant.isSpeaking;
    const isListening = voiceAssistant.isListening;
    const isThinking = voiceAssistant.isThinking;

    pulseAngle += 0.04;
    const basePulse = Math.sin(pulseAngle) * 4;
    const freqBoost = (freq / 255) * 22;
    const activeRadius = 52 + basePulse + freqBoost;

    // 1. Outer Glow Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, activeRadius + 18, 0, Math.PI * 2);
    ctx.strokeStyle = isSpeaking 
      ? 'rgba(244, 63, 94, 0.4)' 
      : (isListening ? 'rgba(74, 222, 128, 0.4)' : (isThinking ? 'rgba(168, 85, 247, 0.4)' : 'rgba(224, 138, 149, 0.2)'));
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Middle Ripples
    ctx.beginPath();
    ctx.arc(centerX, centerY, activeRadius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = isSpeaking 
      ? 'rgba(244, 63, 94, 0.65)' 
      : (isListening ? 'rgba(74, 222, 128, 0.65)' : (isThinking ? 'rgba(168, 85, 247, 0.65)' : 'rgba(224, 138, 149, 0.35)'));
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Audio Frequency Waveform Orbit Points
    const numPoints = 20;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 + pulseAngle;
      const dist = activeRadius + 12 + Math.sin(angle * 4 + pulseAngle) * (3 + freqBoost * 0.4);
      const px = centerX + Math.cos(angle) * dist;
      const py = centerY + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isSpeaking ? '#F43F5E' : (isListening ? '#4ADE80' : '#E08A95');
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(renderVisualizer);
  }

  // Start Visualizer Loop
  renderVisualizer();

  const transcriptBox = document.getElementById('voice-transcript-box');
  const scrollArea = document.getElementById('voice-scroll-area');

  // Voice Event Listener
  const unsubscribe = voiceAssistant.subscribe((service, event) => {
    if (!statusText || !transcriptText) return;

    if (event.type === 'status') {
      if (event.status === 'listening') {
        statusPill.style.borderColor = 'rgba(74, 222, 128, 0.5)';
        statusPill.style.color = '#4ADE80';
        statusText.innerText = '🎙️ Listening... Speak now';
        orbIcon.innerText = '🔊';
      } else {
        statusPill.style.borderColor = 'rgba(224, 138, 149, 0.3)';
        statusPill.style.color = 'var(--color-rose)';
        statusText.innerText = service.config.wakeWordEnabled ? '⚡ Ready · Say "Hey HER"' : 'Ready · Click Mic';
        orbIcon.innerText = '🎙️';
      }
    }

    if (event.type === 'transcript') {
      transcriptText.innerText = `"${event.text}"`;
      transcriptText.style.color = '#FFFFFF';
      transcriptText.style.fontStyle = 'normal';
      if (transcriptBox) transcriptBox.scrollTop = transcriptBox.scrollHeight;
    }

    if (event.type === 'thinking_start') {
      statusPill.style.borderColor = 'rgba(168, 85, 247, 0.5)';
      statusPill.style.color = '#C084FC';
      statusText.innerText = '🧠 Thinking & Consulting App State...';
      orbIcon.innerText = '⚡';
    }

    if (event.type === 'speaking_start') {
      statusPill.style.borderColor = 'rgba(244, 63, 94, 0.5)';
      statusPill.style.color = '#FB7185';
      statusText.innerText = '🔊 Speaking... (Click Orb to stop)';
      orbIcon.innerText = '⏹️';
    }

    if (event.type === 'speaking_end') {
      statusPill.style.borderColor = 'rgba(74, 222, 128, 0.4)';
      statusPill.style.color = '#4ADE80';
      statusText.innerText = service.config.wakeWordEnabled ? '🎙️ Listening... Say "Hey HER"' : 'Ready · Click Mic';
      orbIcon.innerText = '🎙️';
    }

    if (event.type === 'response') {
      const cleanReply = (event.reply || '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[*#_~`]/g, '')
        .trim();
      transcriptText.innerText = cleanReply || 'Response complete.';
      transcriptText.style.color = '#FDE68A';
      transcriptText.style.fontStyle = 'normal';
      if (transcriptBox) transcriptBox.scrollTop = 0;
    }

    if (event.type === 'error') {
      statusText.innerText = `⚠️ ${event.error}`;
      statusPill.style.color = '#F87171';
    }
  });

  // Start Voice Session on launch
  voiceAssistant.startSession();

  // Orb Button Click (Toggle Listening / Speaking)
  orbBtn.addEventListener('click', () => {
    if (voiceAssistant.isSpeaking) {
      voiceAssistant.stopSpeaking();
    } else if (voiceAssistant.isListening) {
      voiceAssistant.stopListening();
    } else {
      voiceAssistant.startListening();
    }
  });

  // Quick Command Chips
  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) {
        transcriptText.innerText = `"${cmd}"`;
        voiceAssistant.handleVoiceQuery(cmd);
      }
    });
  });

  // Settings Toggles
  wakeWordToggle.addEventListener('change', (e) => {
    voiceAssistant.saveConfig({ wakeWordEnabled: e.target.checked });
  });

  autoSpeakToggle.addEventListener('change', (e) => {
    voiceAssistant.saveConfig({ autoSpeak: e.target.checked });
  });

  soundsToggle.addEventListener('change', (e) => {
    voiceAssistant.saveConfig({ soundEffects: e.target.checked });
  });

  rateSelect.addEventListener('change', (e) => {
    voiceAssistant.saveConfig({ rate: parseFloat(e.target.value) });
  });

  stopAudioBtn.addEventListener('click', () => {
    voiceAssistant.stopSpeaking();
  });

  // Switch to Text Chat Modal
  switchToTextBtn.addEventListener('click', () => {
    closeModal();
    openAIAssistantModal();
  });

  // Close Modal Handler: Immediately silence speech and close mic session
  const closeModal = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    unsubscribe();
    voiceAssistant.closeSession();
    container.innerHTML = '';
  };

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  closeBtn.addEventListener('click', closeModal);
}
