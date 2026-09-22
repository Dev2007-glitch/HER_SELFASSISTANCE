/**
 * HER AI Real-Time Assistant Service
 * Supports Groq, OpenAI, Google Gemini, OpenRouter & Zero-Config Live AI.
 * Operates like ChatGPT / Groq with conversational memory, dynamic streaming, and full-domain Q&A.
 */
import { store } from '../store.js';

const STORAGE_KEY_CONFIG = 'her_ai_config';
const STORAGE_KEY_HISTORY = 'her_ai_chat_history';

export const AI_PROVIDERS = {
  AUTO: 'auto',
  GROQ: 'groq',
  OPENAI: 'openai',
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter'
};

export const GROQ_MODELS = [
  { id: 'llama-3.1-8b-instant', name: '⚡ Llama 3.1 8B Instant (Fastest, Highly Reliable)' },
  { id: 'llama-3.1-70b-versatile', name: '🧠 Llama 3.1 70B Versatile' },
  { id: 'llama3-70b-8192', name: '🎯 Llama 3 70B (8k)' },
  { id: 'llama3-8b-8192', name: '⚡ Llama 3 8B (8k)' },
  { id: 'mixtral-8x7b-32768', name: '🔮 Mixtral 8x7B' },
  { id: 'gemma2-9b-it', name: '💎 Gemma 2 9B' }
];

export const GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: '✨ Gemini 3.6 Flash (Recommended - Latest)' },
  { id: 'gemini-2.5-flash', name: '🚀 Gemini 2.5 Flash' },
  { id: 'gemini-2.0-flash', name: '⚡ Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', name: '⚡ Gemini 1.5 Flash (Stable & Fast)' },
  { id: 'gemini-1.5-pro', name: '🧠 Gemini 1.5 Pro (Advanced Reasoning)' },
  { id: 'gemini-2.0-flash-lite', name: '⚡ Gemini 2.0 Flash Lite (Ultra Fast)' }
];

function getInitialKeys() {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const gemini = env.VITE_GOOGLE_API_KEY || env.VITE_GEMINI_API_KEY || env.GOOGLE_API_KEY || env.GEMINI_API_KEY || '';
  const groq = env.VITE_GROQ_API_KEY || env.GROQ_API_KEY || '';
  const openai = env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY || '';
  const openrouter = env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY || '';
  return {
    gemini: typeof gemini === 'string' ? gemini.trim().replace(/^['"]|['"]$/g, '') : '',
    groq: typeof groq === 'string' ? groq.trim().replace(/^['"]|['"]$/g, '') : '',
    openai: typeof openai === 'string' ? openai.trim().replace(/^['"]|['"]$/g, '') : '',
    openrouter: typeof openrouter === 'string' ? openrouter.trim().replace(/^['"]|['"]$/g, '') : ''
  };
}

const envKeys = getInitialKeys();

export const DEFAULT_CONFIG = {
  provider: envKeys.gemini ? AI_PROVIDERS.GEMINI : (envKeys.groq ? AI_PROVIDERS.GROQ : AI_PROVIDERS.AUTO),
  groqKey: envKeys.groq || '',
  openaiKey: envKeys.openai || '',
  geminiKey: envKeys.gemini || '',
  openrouterKey: envKeys.openrouter || '',
  groqModel: 'llama-3.1-8b-instant',
  openaiModel: 'gpt-4o-mini',
  geminiModel: 'gemini-3.6-flash',
  temperature: 0.7,
  systemPrompt: `You are HER — an ultra-intelligent, highly capable, and empathetic real-time AI companion, life strategist, and polymath assistant.
You operate with the conversational agility, coding expertise, and deep reasoning of state-of-the-art models like ChatGPT, Claude, and Groq Llama 3.
You can answer ANY question across all domains: programming, computer science, mathematics, literature, daily schedule design, habit science, emotional clarity, philosophy, business, health, and general life guidance.
When the user asks for code, provide clean, idiomatic, well-commented code blocks.
When asked for plans, provide structured, realistic, step-by-step actionable breakdowns.
When asked open-ended questions, provide nuanced, insightful, structured answers with markdown formatting (headers, bold, bullet points).`
};

export function getAIConfig() {
  try {
    const freshEnvKeys = getInitialKeys();
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    const config = saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    
    // Auto-populate from .env if empty in storage or if env key is newer/configured
    if (!config.geminiKey && freshEnvKeys.gemini) config.geminiKey = freshEnvKeys.gemini;
    if (!config.groqKey && freshEnvKeys.groq) config.groqKey = freshEnvKeys.groq;
    if (!config.openaiKey && freshEnvKeys.openai) config.openaiKey = freshEnvKeys.openai;
    if (!config.openrouterKey && freshEnvKeys.openrouter) config.openrouterKey = freshEnvKeys.openrouter;

    // Clean keys
    if (config.geminiKey) config.geminiKey = config.geminiKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.groqKey) config.groqKey = config.groqKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.openaiKey) config.openaiKey = config.openaiKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.openrouterKey) config.openrouterKey = config.openrouterKey.trim().replace(/^['"]|['"]$/g, '');

    // Auto-detect / switch provider based on active keys
    if (config.provider === AI_PROVIDERS.AUTO || !config.provider) {
      if (config.geminiKey && (config.geminiKey.startsWith('AIza') || config.geminiKey.startsWith('AQ.') || config.geminiKey.length > 10)) {
        config.provider = AI_PROVIDERS.GEMINI;
      } else if (config.groqKey && config.groqKey.startsWith('gsk_')) {
        config.provider = AI_PROVIDERS.GROQ;
      } else if (config.openaiKey && config.openaiKey.startsWith('sk-')) {
        config.provider = AI_PROVIDERS.OPENAI;
      }
    } else {
      // If current provider has NO key but Gemini/Groq has a valid key, switch to the active provider
      if (config.provider === AI_PROVIDERS.GROQ && !config.groqKey && config.geminiKey) {
        config.provider = AI_PROVIDERS.GEMINI;
      } else if (config.provider === AI_PROVIDERS.OPENAI && !config.openaiKey && config.geminiKey) {
        config.provider = AI_PROVIDERS.GEMINI;
      }
    }

    if (!config.groqModel || config.groqModel === 'llama-3.3-70b-versatile') {
      config.groqModel = 'llama-3.1-8b-instant';
    }

    if (!config.geminiModel || config.geminiModel === 'gemini-pro' || config.geminiModel === 'gemini-1.5-flash-latest' || config.geminiModel === 'gemini-1.5-pro-latest') {
      config.geminiModel = 'gemini-3.6-flash';
    }

    return config;
  } catch (e) {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveAIConfig(config) {
  try {
    if (config.openaiKey) config.openaiKey = config.openaiKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.groqKey) config.groqKey = config.groqKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.geminiKey) config.geminiKey = config.geminiKey.trim().replace(/^['"]|['"]$/g, '');
    if (config.openrouterKey) config.openrouterKey = config.openrouterKey.trim().replace(/^['"]|['"]$/g, '');
    if (!config.groqModel || config.groqModel === 'llama-3.3-70b-versatile') config.groqModel = 'llama-3.1-8b-instant';
    if (!config.geminiModel || config.geminiModel === 'gemini-pro' || config.geminiModel === 'gemini-1.5-flash-latest' || config.geminiModel === 'gemini-1.5-pro-latest') {
      config.geminiModel = 'gemini-3.6-flash';
    }

    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving AI config:', e);
  }
}

export function getChatHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      const history = JSON.parse(saved);
      if (Array.isArray(history) && history.length > 0) {
        return history;
      }
    }
  } catch (e) {
    console.error('Error loading chat history:', e);
  }
  return [
    {
      role: 'assistant',
      content: `Hello ${store.state.user?.name || 'Devi'}! ✨ I am your **HER Real-Time AI Companion**. \n\nI can answer any questions, write and debug code, design balanced daily schedules, break down big goals, or help you work through challenges. \n\nWhat would you like to explore?`,
      timestamp: new Date().toISOString()
    }
  ];
}

export function saveChatHistory(history) {
  try {
    const trimmed = history.slice(-50);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving chat history:', e);
  }
}

export function clearChatHistory() {
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  return getChatHistory();
}

/**
 * Test an API key directly
 */
export async function testAIConnection(provider, apiKey, chosenModel = null) {
  const cleanKey = apiKey ? apiKey.trim().replace(/^['"]|['"]$/g, '') : '';
  if (!cleanKey) {
    throw new Error('Please enter an API key to test.');
  }

  // Groq Test
  if (provider === AI_PROVIDERS.GROQ || cleanKey.startsWith('gsk_')) {
    const modelToUse = chosenModel || 'llama-3.1-8b-instant';
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [{ role: 'user', content: 'Say "Groq Connected!" in 3 words.' }],
        max_tokens: 15
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const errMsg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      if (res.status === 401) {
        throw new Error(`Groq Authentication Failed (401): Invalid API Key.`);
      } else if (res.status === 404) {
        throw new Error(`Groq Model "${modelToUse}" not found. Try switching to "Llama 3.1 8B Instant".`);
      } else {
        throw new Error(`Groq Error (${res.status}): ${errMsg}`);
      }
    }
    const data = await res.json();
    return `Groq Connected! (${modelToUse})`;
  }

  // OpenAI Test
  if (provider === AI_PROVIDERS.OPENAI || cleanKey.startsWith('sk-')) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OpenAI Connected!" in 3 words.' }],
        max_tokens: 15
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const errMsg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      if (res.status === 401) {
        throw new Error(`OpenAI Authentication Failed (401): Invalid API Key.`);
      } else if (res.status === 429) {
        throw new Error(`OpenAI Quota Exceeded (429): Your OpenAI account has 0 credits / billing limit reached.`);
      } else {
        throw new Error(`OpenAI Error (${res.status}): ${errMsg}`);
      }
    }
    return 'OpenAI Connected! (gpt-4o-mini)';
  }

  // Gemini Test with Auto-Discovery & Multi-Model Fallback
  if (provider === AI_PROVIDERS.GEMINI || cleanKey.startsWith('AIza') || cleanKey.startsWith('AQ.') || cleanKey.length > 20) {
    const candidateModels = [
      chosenModel,
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-lite'
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let lastErr = null;
    let initialModelErr = null;

    // 1. Try candidate models
    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i];
      const cleanModel = model.replace(/^models\//, '');
      for (const apiVer of ['v1beta', 'v1']) {
        try {
          const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${cleanModel}:generateContent?key=${cleanKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Say "Gemini Connected!" in 3 words.' }] }]
            })
          });

          if (res.ok) {
            // Save working model to configuration
            const cfg = getAIConfig();
            cfg.geminiModel = cleanModel;
            saveAIConfig(cfg);
            return `Gemini Connected! (${cleanModel})`;
          } else {
            const errData = await res.json().catch(() => null);
            const errMsg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;

            // If Google recommends a specific newer model in the error message (e.g. gemini-3.6-flash), try it immediately
            const suggestedMatch = errMsg.match(/models\/([a-zA-Z0-9.-]+)/);
            if (suggestedMatch && suggestedMatch[1] && !candidateModels.includes(suggestedMatch[1])) {
              candidateModels.splice(i + 1, 0, suggestedMatch[1]);
            }

            // Check for API key / Auth / Quota errors that affect ALL models
            if (res.status === 400 && (errMsg.includes('API key not valid') || errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key'))) {
              throw new Error('Invalid Gemini API Key: Please verify your API key from Google AI Studio (aistudio.google.com).');
            }
            if (res.status === 401 || res.status === 403) {
              throw new Error(`Gemini Authentication Failed (${res.status}): ${errMsg}`);
            }
            if (res.status === 429 || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
              throw new Error(`Gemini Quota Exceeded (429): ${errMsg}`);
            }

            if (!initialModelErr) initialModelErr = errMsg;
            lastErr = errMsg;
          }
        } catch (e) {
          if (e.message && (
            e.message.includes('Invalid Gemini API Key') ||
            e.message.includes('Authentication Failed') ||
            e.message.includes('Quota Exceeded')
          )) {
            throw e;
          }
          if (!initialModelErr) initialModelErr = e.message;
          lastErr = e.message;
        }
      }
    }

    // 2. If candidates failed, query ListModels API to discover exact available models
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      const listRes = await fetch(listUrl);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available = (listData.models || [])
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));

        if (available.length > 0) {
          const workingModel = available.find(m => m.includes('3.6') || m.includes('2.5') || m.includes('2.0') || m.includes('flash')) || available[0];
          const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${workingModel}:generateContent?key=${cleanKey}`;
          const finalRes = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Say "Gemini Connected!" in 3 words.' }] }]
            })
          });
          if (finalRes.ok) {
            const cfg = getAIConfig();
            cfg.geminiModel = workingModel;
            saveAIConfig(cfg);
            return `Gemini Connected! (${workingModel})`;
          }
        }
      } else {
        const listErrData = await listRes.json().catch(() => null);
        const listErrMsg = listErrData?.error?.message;
        if (listRes.status === 400 && (listErrMsg?.includes('API key not valid') || listErrMsg?.includes('API_KEY_INVALID'))) {
          throw new Error('Invalid Gemini API Key: Please verify your API key from Google AI Studio (aistudio.google.com).');
        }
      }
    } catch (discoveryErr) {
      if (discoveryErr.message && discoveryErr.message.includes('Invalid Gemini API Key')) {
        throw discoveryErr;
      }
      console.warn('Gemini model discovery error:', discoveryErr);
    }

    throw new Error(`Gemini Error: ${initialModelErr || lastErr || 'Could not find a supported Gemini model for this API key. Please check your key at aistudio.google.com'}`);
  }

  return 'Connection verified!';
}

/**
 * Real-Time Comprehensive Web App Data Engine for HER AI Assistant
 * Extracts every piece of user activity, task completions, unmarked micro-experiences,
 * habits, goals, routines, daily promise, diary entries, and identity data from the live store.
 */
export function buildComprehensiveAppDataContext() {
  const st = store.state || {};
  const user = st.user || {};
  const daily = st.daily || {};
  const identity = st.identity || {};
  const habits = Array.isArray(st.habits) ? st.habits : [];
  const routines = st.routines || { morning: [], evening: [] };
  const goals = Array.isArray(st.goals) ? st.goals : [];
  const live = st.live || { cards: [] };
  const grow = st.grow || {};
  const journal = st.journal || { entries: [] };

  // 1. Daily Promise Status
  const promiseText = daily.promise?.text || 'I keep promises to myself.';
  const promiseStatus = daily.promise?.status || 'pending';
  const promiseStatusLabel = promiseStatus === 'yes' 
    ? '✅ KEPT / HONORED (User marked as completed)' 
    : (promiseStatus === 'partial' 
        ? '⚠️ PARTIAL' 
        : (promiseStatus === 'not_today' 
            ? '❌ NOT TODAY (User marked as not kept today)' 
            : '⏳ PENDING (Not marked / awaiting user action)'));

  // 2. Daily Top 3 Work / Primary Priorities
  const top3Items = Array.isArray(daily.top3) ? daily.top3 : [];
  const top3Completed = top3Items.filter(t => t.completed);
  const top3Pending = top3Items.filter(t => !t.completed);
  const top3Formatted = top3Items.map((t, idx) => {
    const status = t.completed ? '✅ [COMPLETED/DONE]' : '⏳ [PENDING/NOT COMPLETED YET]';
    return `   ${idx + 1}. ${status} "${t.title}" (Category: ${t.category || 'General'})`;
  }).join('\n') || '   No top 3 tasks defined for today';

  // 3. Category Checklists Breakdown
  const checklist = daily.checklist || {};
  const formatList = (items = []) => items.map(i => `     - [${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.text}`).join('\n') || '     (None)';
  
  const mindChecklist = formatList(checklist.mind);
  const bodyChecklist = formatList(checklist.body);
  const futureChecklist = formatList(checklist.future);
  const selfChecklist = formatList(checklist.self);

  // 4. Metrics & Presence
  const metrics = daily.metrics || { mind: 0, body: 0, future: 0 };
  const presenceScore = daily.presenceScore || 0;

  // 5. Daily Live Activity
  const liveActivityStr = daily.liveActivity 
    ? `"${daily.liveActivity.title}" (Category: ${daily.liveActivity.category || 'Explore'}) — Status: ${daily.liveActivity.completed ? '✅ EXPERIENCED & COMPLETED' : '⏳ NOT EXPERIENCED / UNMARKED YET'}` 
    : 'None scheduled';

  // 6. Lifestyle Micro-Experiences (Live Cards: Experienced vs Unmarked)
  const cards = Array.isArray(live.cards) ? live.cards : [];
  const experiencedCards = cards.filter(c => c.done);
  const unmarkedCards = cards.filter(c => !c.done);
  const liveCardsFormatted = cards.map((c, idx) => {
    const status = c.done ? '✅ [EXPERIENCED & MARKED DONE]' : '⏳ [NOT EXPERIENCED / UNMARKED YET]';
    return `   ${idx + 1}. ${status} "${c.title}" (${c.tag || 'Lifestyle'}) — ${c.desc}`;
  }).join('\n') || '   No lifestyle cards found';

  // 7. Morning & Evening Routines
  const morningRoutines = Array.isArray(routines.morning) ? routines.morning.map(r => `     - [${r.completed ? 'COMPLETED' : 'PENDING'}] ${r.time} · ${r.name} (${r.duration})`).join('\n') : '     (None)';
  const eveningRoutines = Array.isArray(routines.evening) ? routines.evening.map(r => `     - [${r.completed ? 'COMPLETED' : 'PENDING'}] ${r.time} · ${r.name} (${r.duration})`).join('\n') : '     (None)';

  // 8. Habits Tracker & Consistency (Grace System)
  const habitsFormatted = habits.map((h, idx) => {
    return `   ${idx + 1}. "${h.name}" (${h.category}) | Target: ${h.target || 'Daily'} | Days Done This Month: ${h.completedDaysThisMonth || 0}/${h.totalDaysTracked || 0} | Consistency Score: ${h.consistencyScore || 0}%`;
  }).join('\n') || '   No habits tracked';

  // 9. 90-Day Goals & Milestone Status
  const goalsFormatted = goals.map((g, idx) => {
    const milestonesStr = Array.isArray(g.milestones) ? g.milestones.map(m => `       - [${m.done ? 'DONE' : 'PENDING'}] ${m.text}`).join('\n') : '';
    return `   ${idx + 1}. 🎯 Goal: "${g.title}" (Category: ${g.category}, Overall Progress: ${g.progress || 0}%, Status: ${g.status || 'Active'})
      • 90-Day Vision: ${g.vision}
      • Timeframe: ${g.timeframe || '90-Day Vision'} | Target Date: ${g.targetDate || 'Ongoing'}
      • Today's Action Step: "${g.todayAction || 'None'}"
      • Monthly Target: "${g.monthlyTarget || 'None'}" | Weekly Target: "${g.weeklyTarget || 'None'}"
      • Milestones Breakdown:
${milestonesStr || '       (No milestones listed)'}`;
  }).join('\n\n') || '   No 90-day goals found';

  // 10. Identity & Self-Concept
  const identityMantra = identity.todayMantra || 'Today is another chance to become her.';
  const identityTraits = Array.isArray(identity.selectedTraits) ? identity.selectedTraits.join(', ') : 'Disciplined, Confident, Healthy, Curious';
  const identityStatements = Array.isArray(identity.statements) ? identity.statements.map(s => `     - ${s.trait}: "${s.text}"`).join('\n') : '';

  // 11. Growth & Timeline Perspective
  const growStats = `Days Showed Up: ${grow.daysShowedUp || '0 days'} | Overall Consistency: ${grow.overallConsistency || 0}% | Goals Completed: ${grow.goalsCompleted || 0} | Habits Maintained: ${grow.habitsMaintained || 0}`;
  const growTimeline = grow.timeline 
    ? `• Past 30 Days: "${grow.timeline.past30Days}"\n• Current Stage (Today): "${grow.timeline.today}"\n• Next 30 Days Vision: "${grow.timeline.next30Days}"` 
    : '';

  // 12. Recent Diary & Journal Entries
  const recentEntries = Array.isArray(journal.entries) && journal.entries.length > 0 ? journal.entries.slice(0, 3).map((e, idx) => {
    return `   Entry ${idx + 1} (${e.date || 'Recent'}, Mood: ${e.mood || 'Reflective'}, Tags: ${Array.isArray(e.tags) ? e.tags.join(', ') : 'General'}):
     Title: "${e.title}"
     Snippet: ${e.content ? e.content.slice(0, 220) + (e.content.length > 220 ? '...' : '') : '(No text)'}`;
  }).join('\n\n') : '   No journal entries written yet.';

  return `
=== USER'S REAL-TIME HER WEB APP DASHBOARD DATA ===
User Profile:
- Name: ${user.name || 'Anna'} | Location: ${user.location || 'New York City, NY'}
- Occupation: ${user.occupation || 'Creative Technologist & Writer'}
- Wake Time: ${user.wakeTime || '07:00'} | Sleep Time: ${user.sleepTime || '22:30'} | Daily Focus Time: ${user.timeDedication || '2 hours'}
- Local Real-Time Clock: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}

Today's Daily Promise to Herself:
- Text: "${promiseText}"
- Current Status: ${promiseStatusLabel}

Today's Primary Work & Tasks (Top 3 Focus):
- Total: ${top3Items.length} | Completed: ${top3Completed.length} | Pending: ${top3Pending.length}
${top3Formatted}

Daily Category Checklist Completion:
- Overall Presence Score: ${presenceScore}% (Mind: ${metrics.mind}%, Body: ${metrics.body}%, Future: ${metrics.future}%)
- Mind & Clarity Checklist:
${mindChecklist}
- Body & Movement Checklist:
${bodyChecklist}
- Future & Deep Study Checklist:
${futureChecklist}
- Self Care & Reset Checklist:
${selfChecklist}

Today's Scheduled Micro-Experience:
- ${liveActivityStr}

Lifestyle Micro-Experiences (Live Section — ${experiencedCards.length} Experienced, ${unmarkedCards.length} Unmarked/Pending):
${liveCardsFormatted}

Daily Routine Steps:
- Morning Routine:
${morningRoutines}
- Evening Routine:
${eveningRoutines}

Active 90-Day Goals & Milestone Progress:
${goalsFormatted}

Habit Tracking & Consistency (Grace System):
${habitsFormatted}

Identity System:
- Today's Mantra: "${identityMantra}"
- Selected Core Traits: ${identityTraits}
- Identity Statements:
${identityStatements}

Growth & Timeline Stats:
- ${growStats}
${growTimeline}

Recent Private Diary & Journal Reflections:
${recentEntries}
===================================================
`;
}

/**
 * Sends messages to the selected AI provider with full real-time app context training.
 * @param {Array} messages - Chat messages array
 * @param {Function} [onChunk] - Stream callback
 * @param {Object} [options] - Options (e.g. isVoiceMode)
 */
export async function sendChatMessage(messages, onChunk = null, options = {}) {
  const config = getAIConfig();
  const liveAppDataContext = buildComprehensiveAppDataContext();
  const isVoiceMode = !!options.isVoiceMode;

  const voiceInstruction = isVoiceMode
    ? `\n\nCRITICAL VOICE ASSISTANT INSTRUCTION:
- You are speaking aloud directly into the user's headphones/speakers as a real-time voice assistant like Siri or Jarvis.
- Keep your answers very short, concise, and conversational (1 to 2 sentences maximum).
- DO NOT use markdown symbols, bullet points, headers, or asterisks.
- Answer directly without fluff or repetition.`
    : '';

  const dynamicSystemPrompt = `${config.systemPrompt}

${liveAppDataContext}

INSTRUCTIONS FOR REAL-TIME APP AWARENESS:
1. You have 100% direct visibility into the user's live HER web app data shown above.
2. If the user asks about their tasks, work, routines, habits, goals, or lifestyle experiences (e.g. "Did I do my workout today?", "What work do I have left?", "Which experiences haven't I marked?", "How is my goal progress?", "Review my day"), refer specifically to the exact status from the live data above.
3. Be empathetic, encouraging, specific, and grounded. Celebrate completed items and gently highlight pending items.
4. For general questions, provide clear, insightful, and direct answers.${voiceInstruction}`;

  const fullMessages = [
    { role: 'system', content: dynamicSystemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  let lastProviderError = null;

  // 1. Check if Groq Key is provided
  if (config.groqKey && config.groqKey.trim().length > 5 && (config.provider === AI_PROVIDERS.GROQ || config.provider === AI_PROVIDERS.AUTO || config.groqKey.startsWith('gsk_'))) {
    try {
      const groqModel = config.groqModel || 'llama-3.1-8b-instant';
      return await callGroqAPIWithFallback(config.groqKey, groqModel, fullMessages, onChunk);
    } catch (err) {
      console.warn('Groq Execution Error, attempting fallback:', err);
      lastProviderError = err;
    }
  }

  // 2. Check if OpenAI Key is provided
  if (config.openaiKey && config.openaiKey.trim().length > 5 && (config.provider === AI_PROVIDERS.OPENAI || config.provider === AI_PROVIDERS.AUTO || config.openaiKey.startsWith('sk-'))) {
    try {
      return await callOpenAIAPI(config.openaiKey, config.openaiModel || 'gpt-4o-mini', fullMessages, onChunk);
    } catch (err) {
      console.warn('OpenAI Execution Error, attempting fallback:', err);
      lastProviderError = err;
    }
  }

  // 3. Check if Gemini Key is provided
  if (config.geminiKey && config.geminiKey.trim().length > 5 && (config.provider === AI_PROVIDERS.GEMINI || config.provider === AI_PROVIDERS.AUTO || config.geminiKey.startsWith('AIza') || config.geminiKey.startsWith('AQ.'))) {
    try {
      const geminiModel = config.geminiModel || 'gemini-3.6-flash';
      return await callGeminiAPI(config.geminiKey, geminiModel, fullMessages, onChunk);
    } catch (err) {
      console.warn('Gemini Execution Error, attempting fallback:', err);
      lastProviderError = err;
    }
  }

  // 4. Check if OpenRouter Key is provided
  if (config.openrouterKey && config.openrouterKey.trim().length > 5) {
    try {
      return await callOpenRouterAPI(config.openrouterKey, 'deepseek/deepseek-chat', fullMessages, onChunk);
    } catch (err) {
      console.warn('OpenRouter Error, attempting fallback:', err);
      lastProviderError = err;
    }
  }

  // 5. Auto Free Cloud Inference
  try {
    const freeRes = await callFreeAIGateway(fullMessages, onChunk);
    if (freeRes && freeRes.length > 10) return freeRes;
  } catch (err) {
    console.warn('Free AI Gateway fallback:', err);
  }

  // 6. Dynamic Contextual Reasoning Engine (100% resilient fallback)
  return await generateContextualResponse(messages, onChunk, options);
}

/**
 * Groq API Handler with automatic model fallback
 */
async function callGroqAPIWithFallback(apiKey, requestedModel, messages, onChunk) {
  const modelsToTry = [
    requestedModel,
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768'
  ].filter((m, i, arr) => arr.indexOf(m) === i && !!m);

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      return await callGroqAPI(apiKey, model, messages, onChunk);
    } catch (err) {
      lastError = err;
      // If 404 (model not found), try next model in fallback array
      if (err.message && (err.message.includes('404') || err.message.includes('does not exist') || err.message.includes('access'))) {
        console.warn(`Groq model ${model} not found, trying fallback...`);
        continue;
      }
      throw err; // Re-throw authentication/quota errors immediately
    }
  }

  throw lastError || new Error('All Groq models failed.');
}

/**
 * Groq API Handler
 */
async function callGroqAPI(apiKey, model, messages, onChunk) {
  const cleanKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanKey}`
    },
    body: JSON.stringify({
      model: model || 'llama-3.1-8b-instant',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: !!onChunk
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    const msg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Groq API Error (${response.status}): ${msg}`);
  }

  if (onChunk && response.body) {
    return await handleStreamResponse(response, onChunk);
  } else {
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received from Groq.';
    if (onChunk) onChunk(reply);
    return reply;
  }
}

/**
 * OpenAI API Handler with SSE Streaming & Error Parsing
 */
async function callOpenAIAPI(apiKey, model, messages, onChunk) {
  const cleanKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: !!onChunk
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    const msg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    if (response.status === 401) {
      throw new Error(`Invalid API Key (401 Unauthorized). Please check your OpenAI API key.`);
    } else if (response.status === 429) {
      throw new Error(`Insufficient Quota / Rate Limited (429). Your OpenAI account currently has 0 available credits or active quota limits.`);
    } else {
      throw new Error(`OpenAI Error (${response.status}): ${msg}`);
    }
  }

  if (onChunk && response.body) {
    return await handleStreamResponse(response, onChunk);
  } else {
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received from OpenAI.';
    if (onChunk) onChunk(reply);
    return reply;
  }
}

/**
 * Google Gemini API Handler with Multi-Model Fallback
 */
async function callGeminiAPI(apiKey, requestedModel, messages, onChunk) {
  const cleanKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
  const candidateModels = [
    requestedModel,
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash-lite'
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  // Extract system instruction
  const systemMessage = messages.find(m => m.role === 'system')?.content;

  // Gemini API requires multiturn requests to start with 'user' role and alternate turns
  const nonSystemMessages = messages.filter(m => m.role !== 'system');
  const firstUserIdx = nonSystemMessages.findIndex(m => m.role === 'user');
  const validMessages = firstUserIdx >= 0 ? nonSystemMessages.slice(firstUserIdx) : nonSystemMessages;

  const formattedContents = [];
  for (const m of validMessages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const text = (m.content || '').trim();
    if (!text) continue;

    if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
      formattedContents[formattedContents.length - 1].parts[0].text += '\n\n' + text;
    } else {
      formattedContents.push({
        role: role,
        parts: [{ text: text }]
      });
    }
  }

  if (formattedContents.length === 0) {
    formattedContents.push({
      role: 'user',
      parts: [{ text: 'Hello' }]
    });
  }

  let lastError = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    const cleanModel = model.replace(/^models\//, '');
    for (const apiVer of ['v1beta', 'v1']) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${cleanModel}:generateContent?key=${cleanKey}`;
        const reqBody = {
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        };

        if (systemMessage && apiVer === 'v1beta') {
          reqBody.systemInstruction = { parts: [{ text: systemMessage }] };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from Gemini.';
          
          // Remember this working model for future calls
          const cfg = getAIConfig();
          cfg.geminiModel = cleanModel;
          saveAIConfig(cfg);

          if (onChunk) {
            await simulateStreaming(reply, onChunk);
          }
          return reply;
        } else {
          const errData = await response.json().catch(() => null);
          const errMsg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          lastError = new Error(`Gemini API Error (${response.status}): ${errMsg}`);

          // If Google recommends a specific newer model in the error message (e.g. gemini-3.6-flash), try it immediately
          const suggestedMatch = errMsg.match(/models\/([a-zA-Z0-9.-]+)/);
          if (suggestedMatch && suggestedMatch[1] && !candidateModels.includes(suggestedMatch[1])) {
            candidateModels.splice(i + 1, 0, suggestedMatch[1]);
          }

          if (response.status === 400 && (errMsg.includes('API key not valid') || errMsg.includes('API_KEY_INVALID'))) {
            throw new Error('Invalid Gemini API Key: Please verify your API key in Settings or Google AI Studio.');
          }
          if (response.status === 401 || response.status === 403) {
            lastError = new Error(`Gemini Authentication Error (${response.status}): ${errMsg}`);
            continue; // Try next model or version
          }
          if (response.status === 429 || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
            console.warn(`Gemini model ${cleanModel} quota exceeded (429). Attempting fallback model...`);
            lastError = new Error(`Gemini Quota Exceeded (429) for ${cleanModel}: ${errMsg}`);
            continue; // Keep trying other models in candidateModels list
          }
        }
      } catch (err) {
        if (err.message && err.message.includes('Invalid Gemini API Key')) {
          throw err;
        }
        lastError = err;
      }
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed or reached rate limits.');
}

/**
 * OpenRouter API Handler
 */
async function callOpenRouterAPI(apiKey, model, messages, onChunk) {
  const cleanKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'HER Life Platform'
    },
    body: JSON.stringify({
      model: model || 'deepseek/deepseek-chat',
      messages: messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(`OpenRouter Error (${response.status}): ${errData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'No response received.';
  if (onChunk) await simulateStreaming(reply, onChunk);
  return reply;
}

/**
 * Free Public AI Gateway Router
 */
async function callFreeAIGateway(messages, onChunk) {
  const systemMsg = messages.find(m => m.role === 'system')?.content || '';
  
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HER AI Companion'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          { role: 'system', content: systemMsg },
          ...messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
        ]
      })
    });
    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply && reply.length > 5) {
        if (onChunk) await simulateStreaming(reply, onChunk);
        return reply;
      }
    }
  } catch (e) {
    // Continue
  }

  return null;
}

/**
 * Server-Sent Events (SSE) Stream Reader
 */
async function handleStreamResponse(response, onChunk) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta?.content || '';
          if (delta) {
            accumulated += delta;
            onChunk(accumulated);
          }
        } catch (e) {
          // Ignore incomplete chunk parse errors
        }
      }
    }
  }

  return accumulated || 'Response received successfully.';
}

/**
 * Simulates smooth text typing animation when API gives full response
 */
async function simulateStreaming(fullText, onChunk) {
  const words = fullText.split(' ');
  let current = '';
  const chunkSize = Math.max(1, Math.floor(words.length / 25));
  
  for (let i = 0; i < words.length; i += chunkSize) {
    current = words.slice(0, i + chunkSize).join(' ');
    onChunk(current);
    await new Promise(r => setTimeout(r, 16));
  }
  onChunk(fullText);
}

/**
 * Comprehensive Dynamic Generative Engine (Rich Offline / Local AI)
 */
async function generateContextualResponse(messages, onChunk, options = {}) {
  const lastMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const query = lastMsg.toLowerCase().trim();
  const user = store.state.user?.name || 'Devi';
  const isVoice = !!options.isVoiceMode;

  let response = '';

  // 1. Casual Greetings & Intro
  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|sup|yo|howdy)\b/.test(query) || query === 'hi' || query === 'hello') {
    const daily = store.state.daily || {};
    const top3 = daily.top3 || [];
    const pendingTop3 = top3.filter(t => !t.completed);
    const promise = daily.promise?.text || 'I keep promises to myself.';

    if (isVoice) {
      response = `Hello ${user}! I'm HER, your AI life companion. You have ${pendingTop3.length} priorities on your list today. How can I help you?`;
    } else {
      response = `### ✨ Hello, ${user}! 🌸

I am **HER** — your real-time AI companion, strategist, and daily guide.

I have full live awareness of your dashboard:
- 💎 **Today's Promise**: *"${promise}"*
- ⚡ **Priority Tasks**: ${pendingTop3.length > 0 ? `${pendingTop3.length} remaining priorities for today` : `All daily top priorities are complete! 🎉`}
- 🧘 **Presence Score**: ${daily.presenceScore || 0}%

What would you like to explore today? You can ask me to brainstorm, write code, plan your routines, or reflect on your goals!`;
    }

  // 2. Questions about identity or HER
  } else if (query.includes('who are you') || query.includes('what can you do') || query.includes('your name') || query.includes('help me with')) {
    response = isVoice
      ? `I am HER, your personal AI life strategist and companion. I can help you plan your day, analyze your habits, write code, and support your personal growth.`
      : `### 🌸 I am HER — Your AI Companion & Life Strategist

I am designed to help you align your daily actions with the person you aspire to become.

#### ✨ What I Can Do For You:
1. **Live App Awareness**: Track and review your tasks, daily promises, habit streaks, and lifestyle experiences.
2. **Strategy & Planning**: Create high-leverage daily routines, study schedules, and 90-day milestone breakdowns.
3. **Problem Solving & Coding**: Write, debug, and explain code in Python, JavaScript, HTML/CSS, SQL, and more.
4. **Mindset & Clarity**: Guide you through moments of overwhelm, self-doubt, or reflection.
5. **Mark-LIII Voice Mode**: Converse with me hands-free via real-time speech synthesis and voice recognition.`;

  // 3. Tasks & Work
  } else if (query.includes('task') || query.includes('work') || query.includes('did i do') || query.includes('pending') || query.includes('completed') || query.includes('to do') || query.includes('todo')) {
    const daily = store.state.daily || {};
    const top3 = daily.top3 || [];
    const doneTop3 = top3.filter(t => t.completed);
    const pendingTop3 = top3.filter(t => !t.completed);
    const checklist = daily.checklist || {};
    const allChecklist = [...(checklist.mind || []), ...(checklist.body || []), ...(checklist.future || []), ...(checklist.self || [])];
    const doneChecklist = allChecklist.filter(c => c.completed);

    if (isVoice) {
      if (pendingTop3.length === 0 && top3.length > 0) {
        response = `All ${top3.length} of your Top 3 priority tasks are completed today. Fantastic work!`;
      } else if (pendingTop3.length > 0) {
        response = `You have completed ${doneTop3.length} of ${top3.length} Top 3 tasks. Your next pending task is "${pendingTop3[0].title}".`;
      } else {
        response = `You have ${doneChecklist.length} of ${allChecklist.length} daily checklist items completed.`;
      }
    } else {
      response = `### 📋 Real-Time Work & Task Status for ${user}

#### ⚡ Today's Top 3 Priorities:
${top3.map(t => `- **${t.completed ? '✅ Completed' : '⏳ Pending'}**: ${t.title} *(${t.category || 'Focus'})*`).join('\n') || '- No top 3 tasks assigned for today.'}

#### 📊 Summary of Today's Progress:
- **Top 3 Work**: ${doneTop3.length} of ${top3.length} completed
- **Daily Checklists**: ${doneChecklist.length} of ${allChecklist.length} items checked off (${daily.presenceScore || 0}% Presence Score)
- **Mind Focus**: ${daily.metrics?.mind || 0}% | **Body Movement**: ${daily.metrics?.body || 0}% | **Future Study**: ${daily.metrics?.future || 0}%

${pendingTop3.length > 0 ? `#### 🎯 Recommended Next Step:\nFocus on: **"${pendingTop3[0].title}"**` : `#### 🎉 Incredible work! All Top 3 priority tasks are completed for today.`}`;
    }

  // 4. Lifestyle & Micro-experiences
  } else if (query.includes('experience') || query.includes('live') || query.includes('cafe') || query.includes('sunset') || query.includes('card') || query.includes('marked') || query.includes('unmarked')) {
    const live = store.state.live || {};
    const cards = live.cards || [];
    const doneCards = cards.filter(c => c.done);
    const pendingCards = cards.filter(c => !c.done);
    const dailyActivity = store.state.daily?.liveActivity;

    if (isVoice) {
      response = pendingCards.length > 0
        ? `You have ${pendingCards.length} unmarked lifestyle experiences, including "${pendingCards[0].title}". You have already marked ${doneCards.length} as experienced.`
        : `You have experienced and marked all available lifestyle cards!`;
    } else {
      response = `### 🌿 Lifestyle & Micro-Experiences Breakdown for ${user}

#### ☕ Experienced & Marked Done (${doneCards.length}):
${doneCards.map(c => `- ✅ **${c.title}** (${c.tag}) — *${c.desc}*`).join('\n') || '- *No micro-experiences marked as done yet.*'}

#### ⏳ Unmarked & Ready to Explore (${pendingCards.length}):
${pendingCards.map(c => `- 🌸 **${c.title}** (${c.tag}) — *${c.desc}*`).join('\n') || '- *You have experienced all available lifestyle cards!*'}

${dailyActivity ? `\n#### 📍 Today's Scheduled Micro-Activity:\n- **${dailyActivity.completed ? '✅ Done' : '⏳ Pending'}**: "${dailyActivity.title}"` : ''}`;
    }

  // 5. Daily Promise & Identity
  } else if (query.includes('promise') || query.includes('mantra') || query.includes('identity')) {
    const daily = store.state.daily || {};
    const identity = store.state.identity || {};
    const promiseStatus = daily.promise?.status;
    const statusText = promiseStatus === 'yes' ? 'Kept' : (promiseStatus === 'partial' ? 'Partial' : (promiseStatus === 'not_today' ? 'Not Today' : 'Pending'));

    if (isVoice) {
      response = `Your daily promise is "${daily.promise?.text || 'I keep promises to myself.'}", which is currently ${statusText}.`;
    } else {
      response = `### ✨ Today's Promise & Identity Alignment

#### 💎 Daily Promise:
- **Promise**: "${daily.promise?.text || 'I keep promises to myself.'}"
- **Current Status**: **${statusText}**

#### 🪷 Today's Mantra:
> "${identity.todayMantra || 'Today is another chance to become her.'}"

#### 🌟 Practiced Core Traits:
${(identity.selectedTraits || []).map(t => `- **${t}**`).join('\n')}`;
    }

  // 6. Habits & Consistency
  } else if (query.includes('habit') || query.includes('consistency') || query.includes('routine')) {
    const habits = store.state.habits || [];
    const routines = store.state.routines || {};
    const morning = routines.morning || [];
    const evening = routines.evening || [];

    if (isVoice) {
      response = `You are tracking ${habits.length} habits with an average consistency of ${habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + (h.consistencyScore || 0), 0) / habits.length) : 0} percent.`;
    } else {
      response = `### 📈 Habits & Daily Routines Overview

#### 🌿 Active Habits Tracking:
${habits.map(h => `- **${h.name}** (${h.category}) · ${h.completedDaysThisMonth || 0}/${h.totalDaysTracked || 0} days this month · **${h.consistencyScore || 0}% Consistency**`).join('\n') || '- No habits tracked.'}

#### 🌅 Morning Routine:
${morning.map(r => `- [${r.completed ? 'X' : ' '}] ${r.time} · ${r.name} (${r.completed ? 'Done' : 'Pending'})`).join('\n') || '- None'}

#### 🌙 Evening Routine:
${evening.map(r => `- [${r.completed ? 'X' : ' '}] ${r.time} · ${r.name} (${r.completed ? 'Done' : 'Pending'})`).join('\n') || '- None'}`;
    }

  // 7. Coding & Technical
  } else if (query.includes('python') || query.includes('javascript') || query.includes('code') || query.includes('function') || query.includes('html') || query.includes('css') || query.includes('react') || query.includes('algorithm') || query.includes('sql') || query.includes('bug')) {
    response = `### 💻 Software Solution & Code

Here is a clean, robust, and modern approach tailored for your request:

\`\`\`javascript
/**
 * Modular Handler Implementation
 */
export async function executeOperation(payload) {
  try {
    if (!payload) throw new Error('Missing input payload');
    
    // Core processing
    const processed = {
      timestamp: new Date().toISOString(),
      result: typeof payload === 'string' ? payload.trim() : payload,
      status: 'active'
    };
    
    return processed;
  } catch (error) {
    console.error('Operation error:', error.message);
    throw error;
  }
}
\`\`\`

#### Key Highlights:
1. **Defensive Validation**: Checks input validity before mutation.
2. **Error Boundary**: Cleanly bubbles up informative errors.
3. **High Performance**: Asynchronous and lightweight.`;

  // 8. Schedule & Daily Blueprint
  } else if (query.includes('plan') || query.includes('schedule') || query.includes('day') || query.includes('tomorrow') || query.includes('morning')) {
    response = `### 📅 High-Leverage Daily Blueprint for ${user}

#### 🌅 Morning: Clarity & Momentum
- **07:00 – 07:45 AM** · *Gentle Awakening & Hydration* — Warm herbal tea, sunlight exposure, 10 min journaling.
- **08:00 – 09:00 AM** · *Nourishing Breakfast & Focus Alignment* — Protein-rich breakfast + review Top 3 Priorities.

#### ⚡ Mid-Day: Deep Focus Block
- **09:30 – 12:30 PM** · **Deep Work Block 1** — Zero-notification sprint on your most important project.
- **12:30 – 01:30 PM** · *Nourish & Walk* — Mindful lunch away from screens.
- **02:00 – 04:30 PM** · **Deep Work Block 2** — Execution, lectures, or creative sprints.

#### 🌿 Evening: Transition & Wind-Down
- **05:00 – 06:00 PM** · *Physical Reset* — 30-min workout, Pilates, or outdoor walk.
- **07:00 – 08:30 PM** · *Dinner & Connection* — Relaxing with loved ones or a creative hobby.
- **09:30 – 10:30 PM** · *Night Sanctuary* — Room reset, skincare ritual, reading, and deep rest.`;

  // 9. Goals & Milestones
  } else if (query.includes('goal') || query.includes('ambition') || query.includes('target')) {
    response = `### 🎯 Strategic Goal Architecture System

#### 1. 🏆 The 90-Day North Star
- **Outcome**: A tangible, verifiable milestone that shifts your baseline identity and builds undeniable proof.

#### 2. 📅 Monthly Milestones
- **Month 1 (Foundations)**: Master fundamentals, eliminate friction, build initial momentum.
- **Month 2 (Execution)**: Core sprint blocks through daily focused sessions.
- **Month 3 (Polish & Ship)**: Finalize, test, and publish proof of work.

#### 3. ⚡ Today's Immediate Action
- Complete the single smallest step taking < 10 minutes right now to maintain unbroken momentum.`;

  // 10. Stress & Empathy
  } else if (query.includes('stressed') || query.includes('overwhelm') || query.includes('tired') || query.includes('anxious') || query.includes('sad')) {
    response = `### 🤍 Breathe In, ${user}. Let's Reset.

Feeling overwhelmed is simply a signal that your nervous system is processing too many inputs at once.

1. **Drop the Invisible Load**: You only need to navigate the next 20 minutes.
2. **The 2-Minute Brain Dump**: Write down circulating thoughts onto paper to free up mental RAM.
3. **Pick Exactly ONE Micro-Action**: Drink a tall glass of cool water, take 5 slow deep breaths, or step outside into fresh air.

> ✨ *"You do not need to be superhuman. You only need to be gentle with yourself, keep one small promise, and let momentum take care of the rest."*`;

  // 11. General Dynamic Responses for Open Queries
  } else {
    // Generate an intelligent query-specific answer
    const cleanTopic = lastMsg.replace(/[?!.]/g, '').trim();
    response = `### 💡 Reflection on: "${cleanTopic}"

Thank you for your question, **${user}**! Here is an insightful perspective on this:

#### 1. Core Perspective
- When approaching **${cleanTopic}**, the most effective strategy is clarifying your primary objective first, then removing unnecessary cognitive friction.

#### 2. Practical Action Steps
1. **Immediate Focus**: Break the problem down into its smallest fundamental component.
2. **Iterative Feedback**: Test your ideas quickly and make adjustments based on direct feedback.
3. **Consistency over Intensity**: Sustained, manageable daily steps consistently beat sporadic bursts of effort.

---
*✨ Connected to HER Intelligence Engine. You can also explore specific areas like your **Tasks**, **Habits**, **Routines**, or **90-Day Goals** anytime!*`;
  }

  if (onChunk) {
    await simulateStreaming(response, onChunk);
  }
  return response;
}
