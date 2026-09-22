/**
 * HER Real-Time AI Assistant & Coach Modal
 * ChatGPT / Groq-like conversational interface with streaming responses,
 * multi-model support, full markdown formatting, and persistent history.
 */
import { store } from '../store.js';
import {
  getAIConfig,
  saveAIConfig,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  sendChatMessage,
  testAIConnection,
  GROQ_MODELS,
  GEMINI_MODELS,
  AI_PROVIDERS
} from '../services/ai-service.js';
import { voiceAssistant } from '../services/voice-service.js';
import { openVoiceAssistantModal } from './voice-assistant-modal.js';

let isGenerating = false;
let isChatMicActive = false;

export function openAIAssistantModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const config = getAIConfig();
  const history = getChatHistory();

  const getProviderBadge = (cfg) => {
    if (cfg.geminiKey && cfg.geminiKey.length > 10) return '✨ Google Gemini';
    if (cfg.groqKey && cfg.groqKey.startsWith('gsk_')) return '⚡ Groq (Llama 3.1)';
    if (cfg.openaiKey && cfg.openaiKey.startsWith('sk-')) return '🟢 OpenAI (ChatGPT)';
    if (cfg.provider === 'gemini') return '✨ Google Gemini';
    if (cfg.provider === 'groq') return '⚡ Groq';
    if (cfg.provider === 'openai') return '🟢 OpenAI';
    return '🌐 Auto Gateway';
  };

  const modalHtml = `
    <div class="modal-overlay" id="ai-modal-overlay">
      <div class="modal-dialog ai-chat-dialog" style="max-width: 840px; width: 95vw; height: 88vh; max-height: 880px; display: flex; flex-direction: column; padding: 0; overflow: hidden; border: 1.5px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur); border-radius: var(--radius-xl); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);">
        
        <!-- Top Header Bar -->
        <div class="ai-chat-header" style="padding: 1.1rem 1.4rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); background: rgba(54, 19, 21, 0.25);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 0 16px rgba(224, 138, 149, 0.35); border: 1px solid rgba(255, 255, 255, 0.2);">
              ✨
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-primary); margin: 0; font-weight: 700;">
                  HER AI Assistant
                </h3>
                <span id="ai-engine-badge" style="font-size: 0.74rem; padding: 0.2rem 0.65rem; border-radius: 20px; background: rgba(125, 143, 123, 0.2); color: var(--color-sage); border: 1px solid rgba(125, 143, 123, 0.35); font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                  <span style="width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; display: inline-block; animation: pulse 1.8s infinite;"></span>
                  ${getProviderBadge(config)}
                </span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.1rem 0 0 0;">
                ChatGPT, Gemini, Groq & Mark-LIII Voice companion with real-time app awareness.
              </p>
            </div>
          </div>

          <!-- Action Controls -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button class="btn-primary" id="ai-launch-voice-mode-btn" title="Open Mark-LIII Holographic Voice Assistant" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); border: 1px solid rgba(255,255,255,0.25);">
              <span>🎙️</span>
              <span>Voice Mode</span>
            </button>
            <button class="btn-ghost" id="ai-toggle-settings-btn" title="Model & API Key Settings" style="padding: 0.45rem 0.8rem; font-size: 0.82rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: rgba(224, 138, 149, 0.1);">
              ⚙️ AI Settings
            </button>
            <button class="btn-ghost" id="ai-clear-chat-btn" title="Clear Conversation" style="padding: 0.45rem 0.8rem; font-size: 0.82rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              🧹 New Chat
            </button>
            <button class="modal-close-btn" id="close-ai-modal" style="position: static; font-size: 1.5rem; line-height: 1; padding: 0.3rem 0.6rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>
        </div>

        <!-- Collapsible Settings Panel -->
        <div id="ai-settings-drawer" style="display: none; padding: 1.2rem 1.4rem; background: var(--bg-card-subtle); border-bottom: 1px solid var(--border-color); animation: fadeIn 0.25s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--text-primary); margin: 0;">
                ⚡ AI Provider & Key Settings
              </h4>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.1rem 0 0 0;">
                Keys are saved instantly to your browser storage.
              </p>
            </div>
            <div id="ai-test-result" style="font-size: 0.8rem; font-weight: 600; color: var(--color-sage);"></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.9rem; margin-bottom: 0.9rem;">
            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">Active Provider</label>
              <select id="ai-provider-select" class="form-input" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
                <option value="auto" ${config.provider === 'auto' ? 'selected' : ''}>✨ Auto-Detect Provider</option>
                <option value="gemini" ${config.provider === 'gemini' ? 'selected' : ''}>✨ Google Gemini (3.6 / 2.5 / Flash)</option>
                <option value="groq" ${config.provider === 'groq' ? 'selected' : ''}>⚡ Groq (Ultra-Fast Llama 3.1 8B/70B)</option>
                <option value="openai" ${config.provider === 'openai' ? 'selected' : ''}>🧠 OpenAI (ChatGPT / GPT-4o-mini)</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">Gemini Model</label>
              <select id="ai-gemini-model-select" class="form-input" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
                ${GEMINI_MODELS.map(m => `
                  <option value="${m.id}" ${config.geminiModel === m.id ? 'selected' : ''}>${m.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">Groq Model</label>
              <select id="ai-groq-model-select" class="form-input" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
                ${GROQ_MODELS.map(m => `
                  <option value="${m.id}" ${config.groqModel === m.id ? 'selected' : ''}>${m.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                Gemini API Key <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--color-rose); font-weight: 400; margin-left: 0.4rem; text-decoration: underline;">(Free AI Studio)</a>
              </label>
              <input type="password" id="ai-gemini-key-input" class="form-input" placeholder="AQ... or AIza..." value="${config.geminiKey || ''}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                Groq API Key <a href="https://console.groq.com/keys" target="_blank" style="color: var(--color-rose); font-weight: 400; margin-left: 0.4rem; text-decoration: underline;">(Free Key: 30 req/min)</a>
              </label>
              <input type="password" id="ai-groq-key-input" class="form-input" placeholder="gsk_..." value="${config.groqKey || ''}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                OpenAI API Key <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--color-rose); font-weight: 400; margin-left: 0.4rem; text-decoration: underline;">(OpenAI Keys)</a>
              </label>
              <input type="password" id="ai-openai-key-input" class="form-input" placeholder="sk-proj-..." value="${config.openaiKey || ''}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid var(--border-subtle); padding-top: 0.8rem;">
            <div style="font-size: 0.76rem; color: var(--text-muted);">
              💡 <em>Keys auto-save instantly. Click Test Connection to verify:</em>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-secondary" id="ai-test-key-btn" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">
                🧪 Test Connection
              </button>
              <button class="btn-primary" id="ai-save-settings-btn" style="padding: 0.4rem 1rem; font-size: 0.8rem;">
                ✓ Save & Close
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Starter Pills -->
        <div class="ai-quick-pills" style="padding: 0.6rem 1.4rem; background: rgba(35, 14, 15, 0.15); border-bottom: 1px solid var(--border-subtle); display: flex; gap: 0.5rem; overflow-x: auto; white-space: nowrap;">
          <span style="font-size: 0.76rem; color: var(--text-muted); align-self: center; font-weight: 600;">Ask HER About Your App:</span>
          <button class="ai-pill-btn" data-prompt="What work and tasks did I complete today, and what is still pending?">📋 Tasks Completed vs Pending</button>
          <button class="ai-pill-btn" data-prompt="Which lifestyle micro-experiences have I experienced vs which ones are still unmarked?">☕ Marked vs Unmarked Experiences</button>
          <button class="ai-pill-btn" data-prompt="Did I keep my promise to myself today and how is my presence score?">💎 Daily Promise & Presence</button>
          <button class="ai-pill-btn" data-prompt="Review my 90-day goals and tell me my milestone progress.">🎯 90-Day Goals Review</button>
          <button class="ai-pill-btn" data-prompt="How is my habit consistency and morning/evening routine adherence?">✨ Habits & Routine Status</button>
        </div>

        <!-- Chat Messages Area -->
        <div id="ai-chat-messages" style="flex: 1; overflow-y: auto; padding: 1.4rem; display: flex; flex-direction: column; gap: 1.2rem; scroll-behavior: smooth;">
          <!-- Messages will be dynamically rendered here -->
        </div>

        <!-- Chat Input Footer -->
        <div class="ai-chat-footer" style="padding: 1rem 1.4rem; border-top: 1px solid var(--border-color); background: rgba(54, 19, 21, 0.2); display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; gap: 0.6rem; align-items: flex-end; position: relative;">
            <textarea id="ai-chat-input" class="form-textarea" placeholder="Ask HER AI anything... (e.g., questions, code, daily scheduling, life guidance, writing, science)" rows="2" style="flex: 1; resize: none; min-height: 52px; max-height: 160px; padding: 0.75rem 1rem; border-radius: var(--radius-lg); font-size: 0.92rem; line-height: 1.45; background: var(--bg-card); border: 1.5px solid var(--border-color); color: var(--text-primary);"></textarea>
            
            <button class="icon-btn" id="ai-mic-input-btn" title="Speak message (Speech-to-Text)" style="height: 52px; width: 52px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; background: rgba(224, 138, 149, 0.15); border: 1.5px solid var(--border-color); color: var(--color-rose); cursor: pointer; flex-shrink: 0; font-size: 1.25rem; transition: all 0.2s ease;">
              <span id="ai-mic-btn-icon">🎙️</span>
            </button>

            <button class="btn-primary" id="ai-send-msg-btn" style="height: 52px; padding: 0 1.4rem; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 600; font-size: 0.92rem; flex-shrink: 0;">
              <span>Send</span>
              <span style="font-size: 1.1rem;">➔</span>
            </button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); padding: 0 0.2rem;">
            <span>Press <kbd style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.35rem; border-radius: 4px; border: 1px solid var(--border-subtle);">Enter</kbd> to send, or tap <kbd style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.35rem; border-radius: 4px; border: 1px solid var(--border-subtle);">🎙️ Mic</kbd> to speak</span>
            <span id="ai-status-indicator" style="color: var(--color-sage);">● Ready</span>
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  const overlay = document.getElementById('ai-modal-overlay');
  const closeBtn = document.getElementById('close-ai-modal');
  const messagesContainer = document.getElementById('ai-chat-messages');
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-msg-btn');
  const micInputBtn = document.getElementById('ai-mic-input-btn');
  const micBtnIcon = document.getElementById('ai-mic-btn-icon');
  const clearBtn = document.getElementById('ai-clear-chat-btn');
  const toggleSettingsBtn = document.getElementById('ai-toggle-settings-btn');
  const launchVoiceModeBtn = document.getElementById('ai-launch-voice-mode-btn');
  const settingsDrawer = document.getElementById('ai-settings-drawer');
  const saveSettingsBtn = document.getElementById('ai-save-settings-btn');
  const testKeyBtn = document.getElementById('ai-test-key-btn');
  const testResultEl = document.getElementById('ai-test-result');
  const providerSelect = document.getElementById('ai-provider-select');
  const geminiModelSelect = document.getElementById('ai-gemini-model-select');
  const groqModelSelect = document.getElementById('ai-groq-model-select');
  const groqKeyInput = document.getElementById('ai-groq-key-input');
  const openaiKeyInput = document.getElementById('ai-openai-key-input');
  const geminiKeyInput = document.getElementById('ai-gemini-key-input');
  const engineBadge = document.getElementById('ai-engine-badge');
  const pills = document.querySelectorAll('.ai-pill-btn');

  // Helper to sync and save settings
  const syncSettings = () => {
    const cur = getAIConfig();
    cur.provider = providerSelect.value;
    cur.groqModel = groqModelSelect.value;
    if (geminiModelSelect) cur.geminiModel = geminiModelSelect.value;
    cur.groqKey = groqKeyInput.value.trim();
    cur.openaiKey = openaiKeyInput.value.trim();
    cur.geminiKey = geminiKeyInput.value.trim();

    if (cur.geminiKey && cur.geminiKey.length > 10 && cur.provider === 'auto') {
      cur.provider = 'gemini';
      providerSelect.value = 'gemini';
    } else if (cur.groqKey && cur.groqKey.startsWith('gsk_') && cur.provider === 'auto') {
      cur.provider = 'groq';
      providerSelect.value = 'groq';
    } else if (cur.openaiKey && cur.openaiKey.startsWith('sk-') && cur.provider === 'auto') {
      cur.provider = 'openai';
      providerSelect.value = 'openai';
    }

    saveAIConfig(cur);
    if (engineBadge) {
      engineBadge.innerHTML = `
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; display: inline-block; animation: pulse 1.8s infinite;"></span>
        ${getProviderBadge(cur)}
      `;
    }
  };

  // Auto-save on inputs
  [openaiKeyInput, groqKeyInput, geminiKeyInput, providerSelect, groqModelSelect, geminiModelSelect].filter(Boolean).forEach(input => {
    input.addEventListener('input', syncSettings);
    input.addEventListener('change', syncSettings);
  });

  // Close handlers
  const closeModal = () => { 
    voiceAssistant.closeSession();
    if (isChatMicActive && chatRecognition) {
      try { chatRecognition.abort(); } catch {}
      isChatMicActive = false;
    }
    container.innerHTML = ''; 
  };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  closeBtn.addEventListener('click', closeModal);

  // Launch Holographic Voice Mode Modal
  if (launchVoiceModeBtn) {
    launchVoiceModeBtn.addEventListener('click', () => {
      closeModal();
      openVoiceAssistantModal();
    });
  }

  // Mic Button Speech-to-Text Input Handler
  let chatRecognition = null;
  if (micInputBtn) {
    micInputBtn.addEventListener('click', () => {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      if (isChatMicActive && chatRecognition) {
        chatRecognition.stop();
        isChatMicActive = false;
        micBtnIcon.innerText = '🎙️';
        micInputBtn.style.background = 'rgba(224, 138, 149, 0.15)';
        micInputBtn.style.borderColor = 'var(--border-color)';
        return;
      }

      try {
        chatRecognition = new SpeechRec();
        chatRecognition.continuous = false;
        chatRecognition.interimResults = true;
        chatRecognition.lang = 'en-US';

        chatRecognition.onstart = () => {
          isChatMicActive = true;
          micBtnIcon.innerText = '🔴';
          micInputBtn.style.background = 'rgba(244, 63, 94, 0.3)';
          micInputBtn.style.borderColor = '#F43F5E';
          const status = document.getElementById('ai-status-indicator');
          if (status) status.innerText = '🎙️ Listening to your voice...';
          voiceAssistant.playChime('start');
        };

        chatRecognition.onresult = (e) => {
          let finalTranscript = '';
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
              finalTranscript += e.results[i][0].transcript;
            } else {
              chatInput.value = e.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            chatInput.value = finalTranscript;
          }
        };

        chatRecognition.onend = () => {
          isChatMicActive = false;
          micBtnIcon.innerText = '🎙️';
          micInputBtn.style.background = 'rgba(224, 138, 149, 0.15)';
          micInputBtn.style.borderColor = 'var(--border-color)';
          const status = document.getElementById('ai-status-indicator');
          if (status) status.innerText = `● Ready (${getProviderBadge(getAIConfig())})`;
          if (chatInput.value.trim().length > 1) {
            sendMessage();
          }
        };

        chatRecognition.onerror = (e) => {
          isChatMicActive = false;
          micBtnIcon.innerText = '🎙️';
          micInputBtn.style.background = 'rgba(224, 138, 149, 0.15)';
          micInputBtn.style.borderColor = 'var(--border-color)';
        };

        chatRecognition.start();
      } catch (err) {
        console.warn('Chat mic error:', err);
      }
    });
  }

  // Toggle Settings Drawer
  toggleSettingsBtn.addEventListener('click', () => {
    const isHidden = settingsDrawer.style.display === 'none';
    settingsDrawer.style.display = isHidden ? 'block' : 'none';
    if (!isHidden) testResultEl.innerHTML = '';
  });

  // Save Settings Button
  saveSettingsBtn.addEventListener('click', () => {
    syncSettings();
    settingsDrawer.style.display = 'none';
    const status = document.getElementById('ai-status-indicator');
    if (status) status.innerText = `● Saved (${getProviderBadge(getAIConfig())})`;
  });

  // Test Connection Button
  testKeyBtn.addEventListener('click', async () => {
    syncSettings();
    const cur = getAIConfig();
    testResultEl.innerHTML = '<span style="color: var(--color-rose);">⏳ Testing connection...</span>';
    testKeyBtn.disabled = true;

    try {
      const activeKey = cur.geminiKey || cur.groqKey || cur.openaiKey || '';
      const activeProvider = cur.provider !== 'auto' ? cur.provider : (cur.geminiKey ? 'gemini' : (cur.groqKey ? 'groq' : 'openai'));
      const chosenModel = activeProvider === 'gemini' ? cur.geminiModel : (activeProvider === 'groq' ? cur.groqModel : cur.openaiModel);
      const res = await testAIConnection(activeProvider, activeKey, chosenModel);
      testResultEl.innerHTML = `<span style="color: #4ADE80;">✓ ${res}</span>`;
    } catch (err) {
      testResultEl.innerHTML = `<span style="color: #F87171;">⚠️ ${err.message}</span>`;
    } finally {
      testKeyBtn.disabled = false;
    }
  });

  // Render initial history
  renderMessages(history, messagesContainer);

  // Clear Chat Handler
  clearBtn.addEventListener('click', () => {
    if (confirm('Start a fresh conversation? This will clear current chat history.')) {
      const freshHistory = clearChatHistory();
      renderMessages(freshHistory, messagesContainer);
    }
  });

  // Quick Starter Pills
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.dataset.prompt;
      if (prompt && !isGenerating) {
        chatInput.value = prompt;
        sendMessage();
      }
    });
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
  });

  // Send message on Enter (without Shift)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', () => sendMessage());

  // Focus input automatically
  setTimeout(() => chatInput.focus(), 100);

  // Send message function
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isGenerating) return;

    // Reset input
    chatInput.value = '';
    chatInput.style.height = '52px';

    const currentHistory = getChatHistory();
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    currentHistory.push(userMsg);
    saveChatHistory(currentHistory);
    renderMessages(currentHistory, messagesContainer);

    // Placeholder Assistant message for streaming
    const assistantMsgIndex = currentHistory.length;
    const assistantMsg = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };
    currentHistory.push(assistantMsg);

    isGenerating = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>Thinking...</span>';
    const status = document.getElementById('ai-status-indicator');
    if (status) status.innerText = '✨ HER AI is generating response...';

    // Append streaming message bubble
    const streamingBubble = appendStreamingBubble(messagesContainer);
    scrollToBottom(messagesContainer);

    try {
      const fullResponse = await sendChatMessage(currentHistory.slice(0, -1), (chunk) => {
        assistantMsg.content = chunk;
        updateStreamingBubble(streamingBubble, chunk);
        scrollToBottom(messagesContainer);
      });

      assistantMsg.content = fullResponse;
      currentHistory[assistantMsgIndex].content = fullResponse;
      saveChatHistory(currentHistory);
      renderMessages(currentHistory, messagesContainer);

      // Auto-speak reply if enabled
      if (voiceAssistant.config.autoSpeak && fullResponse) {
        voiceAssistant.speak(fullResponse);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      assistantMsg.content = `I apologize, I encountered a temporary issue: ${err.message}`;
      currentHistory[assistantMsgIndex].content = assistantMsg.content;
      saveChatHistory(currentHistory);
      renderMessages(currentHistory, messagesContainer);
    } finally {
      isGenerating = false;
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>Send</span> <span>➔</span>';
      if (status) status.innerText = `● Ready (${getProviderBadge(getAIConfig())})`;
      chatInput.focus();
    }
  }
}

/**
 * Renders full chat history into the container
 */
function renderMessages(history, container) {
  if (!container) return;

  container.innerHTML = history.map((msg, index) => {
    const isUser = msg.role === 'user';
    const formattedHtml = formatMarkdown(msg.content);

    return `
      <div class="ai-msg-row ${isUser ? 'user-row' : 'ai-row'}" style="display: flex; gap: 0.8rem; align-items: flex-start; justify-content: ${isUser ? 'flex-end' : 'flex-start'};">
        ${!isUser ? `
          <div class="ai-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(224, 138, 149, 0.25); border: 1px solid rgba(255, 255, 255, 0.15);">
            ✨
          </div>
        ` : ''}

        <div class="ai-msg-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}" style="max-width: ${isUser ? '80%' : '88%'}; padding: ${isUser ? '0.8rem 1.1rem' : '1.1rem 1.3rem'}; border-radius: ${isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; background: ${isUser ? 'linear-gradient(135deg, var(--color-burgundy), #4A1B1D)' : 'var(--bg-card-subtle)'}; border: 1px solid ${isUser ? 'rgba(224, 138, 149, 0.35)' : 'var(--border-color)'}; color: ${isUser ? '#FFFFFF' : 'var(--text-primary)'}; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); font-size: 0.92rem; line-height: 1.6; word-break: break-word;">
          <div class="msg-content markdown-body">${formattedHtml}</div>
          
          ${!isUser && msg.content ? `
            <div style="margin-top: 0.6rem; display: flex; justify-content: flex-end; gap: 0.5rem; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem;">
              <button class="ai-speak-btn btn-ghost" data-msg-idx="${index}" style="font-size: 0.74rem; padding: 0.2rem 0.6rem; border-radius: 4px; color: var(--color-rose); display: inline-flex; align-items: center; gap: 0.3rem;">
                🔊 Read Aloud
              </button>
              <button class="ai-copy-btn btn-ghost" data-msg-idx="${index}" style="font-size: 0.74rem; padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--text-muted);">
                📋 Copy
              </button>
            </div>
          ` : ''}
        </div>

        ${isUser ? `
          <div class="user-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-rose); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 700; flex-shrink: 0; box-shadow: 0 4px 12px rgba(224, 138, 149, 0.35);">
            ${(store.state.user?.name || 'D')[0].toUpperCase()}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Attach copy listeners
  container.querySelectorAll('.ai-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.msgIdx;
      const content = history[idx]?.content || '';
      if (content) {
        navigator.clipboard.writeText(content);
        btn.innerText = '✓ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy'; }, 2000);
      }
    });
  });

  // Attach speak listeners
  container.querySelectorAll('.ai-speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.msgIdx;
      const content = history[idx]?.content || '';
      if (content) {
        if (voiceAssistant.isSpeaking) {
          voiceAssistant.stopSpeaking();
          btn.innerText = '🔊 Read Aloud';
        } else {
          btn.innerText = '⏹️ Stop Speech';
          voiceAssistant.speak(content).then(() => {
            btn.innerText = '🔊 Read Aloud';
          });
        }
      }
    });
  });

  scrollToBottom(container);
}

function appendStreamingBubble(container) {
  const row = document.createElement('div');
  row.className = 'ai-msg-row ai-row streaming-row';
  row.style.cssText = 'display: flex; gap: 0.8rem; align-items: flex-start; justify-content: flex-start;';
  
  row.innerHTML = `
    <div class="ai-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(224, 138, 149, 0.25);">
      ✨
    </div>
    <div class="ai-msg-bubble assistant-bubble" style="max-width: 88%; padding: 1.1rem 1.3rem; border-radius: 16px 16px 16px 4px; background: var(--bg-card-subtle); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.92rem; line-height: 1.6;">
      <div class="msg-content markdown-body">
        <span class="ai-typing-indicator" style="display: inline-flex; gap: 4px; align-items: center;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-rose); animation: pulse 0.8s infinite;"></span>
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-rose); animation: pulse 0.8s infinite 0.2s;"></span>
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-rose); animation: pulse 0.8s infinite 0.4s;"></span>
        </span>
      </div>
    </div>
  `;
  container.appendChild(row);
  return row;
}

function updateStreamingBubble(rowElement, rawText) {
  const contentEl = rowElement.querySelector('.msg-content');
  if (contentEl) {
    contentEl.innerHTML = formatMarkdown(rawText);
  }
}

function scrollToBottom(container) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Fast, safe Markdown formatter for headers, bold, italics, code blocks, lists & quotes
 */
function formatMarkdown(text) {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="code-block" style="background: rgba(15, 6, 8, 0.85); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.9rem; overflow-x: auto; margin: 0.7rem 0; font-family: 'Fira Code', monospace; font-size: 0.84rem; color: #F0C4C9;"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(224, 138, 149, 0.15); color: var(--color-rose); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.88em;">$1</code>');

  // Headers (###, ##, #)
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); margin: 0.9rem 0 0.4rem 0; font-weight: 700;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--text-primary); margin: 1rem 0 0.5rem 0; font-weight: 700;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin: 1.1rem 0 0.6rem 0; font-weight: 700;">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--color-rose); padding-left: 0.8rem; margin: 0.6rem 0; color: var(--text-secondary); font-style: italic;">$1</blockquote>');

  // Unordered list items (- or *)
  html = html.replace(/^[\-\*] (.*$)/gim, '<li style="margin-bottom: 0.3rem;">$1</li>');

  // Convert consecutive <li> into <ul>
  html = html.replace(/(<li.*<\/li>)/s, '<ul style="padding-left: 1.3rem; margin: 0.5rem 0;">$1</ul>');

  // Paragraph line breaks
  html = html.replace(/\n\n/g, '<div style="height: 0.6rem;"></div>');
  html = html.replace(/\n/g, '<br>');

  return html;
}
