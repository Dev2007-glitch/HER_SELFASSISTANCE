/**
 * View: DIARY & JOURNAL — PRIVATE REFLECTION SANCTUARY (PRD Section 18)
 * Authentic, luxury interactive personal diary with freeform writing,
 * lined-page aesthetics, mood selector, prompt insertion, and entry archive.
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import confetti from 'canvas-confetti';

export function renderJournalView(container) {
  const state = store.state;
  const entries = state.journal.entries || [];
  const prompts = state.journal.prompts || [];

  const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);
  const now = new Date();
  const currentDateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const currentTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const moods = [
    { label: '✨ Inspired', color: '#F08C42' },
    { label: '🕊️ Peaceful', color: '#E08A95' },
    { label: '🌿 Grounded', color: '#8A9880' },
    { label: '⚡ Disciplined', color: '#E08A95' },
    { label: '💭 Reflective', color: '#BBA395' },
    { label: '🌧️ Vulnerable', color: '#9F5154' }
  ];

  container.innerHTML = `
    <div class="view-journal">
      
      <!-- Diary Hero Header -->
      <div class="hero-editorial-card" style="margin-bottom: 2rem;">
        <span class="hero-tagline">✦ PRIVATE PERSONAL DIARY · THE BOOK OF BECOMING</span>
        <h1 class="hero-greeting" style="font-size: 3.1rem;">Dear Diary,</h1>
        <p class="hero-message">“Write honestly. Your private sanctuary where raw thoughts turn into quiet strength and lasting self-trust.”</p>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.4rem; flex-wrap: wrap; align-items: center;">
          <div class="card-tag" style="background: rgba(224, 138, 149, 0.16); color: var(--color-rose); font-size: 0.78rem;">
            📖 ${entries.length} Diary Entries
          </div>
          <div class="card-tag" style="background: rgba(240, 140, 66, 0.16); color: var(--color-amber); font-size: 0.78rem;">
            ✍️ ${totalWords} Words Written
          </div>
          <div class="card-tag" style="background: rgba(255, 255, 255, 0.08); color: var(--text-muted); font-size: 0.78rem;">
            🔒 100% Encrypted & Stored Locally
          </div>
        </div>
      </div>

      <!-- Tab Switcher: Write New Entry | My Diary Book | Guided Prompts -->
      <div class="diary-tab-bar" style="display: flex; gap: 0.65rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem; flex-wrap: wrap;">
        <button class="promise-btn selected-yes diary-tab-btn active" data-tab="write" id="tab-write-btn">
          ✍️ Write Diary Entry
        </button>
        <button class="promise-btn diary-tab-btn" data-tab="archive" id="tab-archive-btn">
          📚 My Diary Book (${entries.length})
        </button>
        <button class="promise-btn diary-tab-btn" data-tab="prompts" id="tab-prompts-btn">
          💡 Guided Prompts & Inspiration
        </button>
      </div>

      <!-- =========================================================================
           TAB 1: WRITE NEW DIARY ENTRY (Interactive Notebook Sheet)
           ========================================================================= -->
      <div id="diary-panel-write" class="diary-panel active">
        <div class="her-card diary-notebook-card" style="padding: 2.4rem; position: relative;">
          
          <!-- Lined Page Top Meta -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1.2rem; margin-bottom: 1.6rem; flex-wrap: wrap; gap: 0.8rem;">
            <div>
              <span style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: var(--text-primary); display: block;">
                ${currentDateStr}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                ${currentTimeStr} • NYC Ambient Atmosphere
              </span>
            </div>

            <!-- Quick Template Inserter -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--color-rose);">Template:</span>
              <select id="diary-template-select" class="diary-select-pill">
                <option value="">Blank Page</option>
                <option value="stream">🌿 Freeform Stream</option>
                <option value="morning">☀️ Morning Intention</option>
                <option value="evening">🌙 Evening Reflection</option>
                <option value="identity">⚡ Identity Check-in</option>
              </select>
            </div>
          </div>

          <!-- Diary Title Input -->
          <div style="margin-bottom: 1.4rem;">
            <input type="text" id="diary-entry-title" class="diary-title-input" placeholder="Title your diary entry... (e.g. Midnight breakthroughs over the skyline)" autocomplete="off">
          </div>

          <!-- Mood Selector -->
          <div style="margin-bottom: 1.4rem;">
            <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-secondary); display: block; margin-bottom: 0.6rem;">
              How does your heart feel right now?
            </label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="diary-mood-list">
              ${moods.map((m, idx) => `
                <button class="diary-mood-chip ${idx === 0 ? 'active' : ''}" data-mood="${m.label}">
                  ${m.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Diary Lined Paper Textarea -->
          <div style="position: relative; margin-bottom: 1.4rem;">
            <textarea id="diary-entry-content" class="diary-lined-textarea" placeholder="Dear Diary,&#10;&#10;Today, my mind is sitting with...&#10;&#10;What felt genuine was..."></textarea>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem; font-size: 0.78rem; color: var(--text-muted);">
              <span id="diary-live-word-count">0 words</span>
              <span>Autosaved locally</span>
            </div>
          </div>

          <!-- Diary Tags & Footer Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.4rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">Tags:</span>
              <input type="text" id="diary-entry-tags" class="diary-tag-input" placeholder="e.g. Discipline, Reflection, Peace" value="Discipline, Peace">
            </div>

            <div style="display: flex; gap: 0.8rem;">
              <button class="btn-secondary" id="diary-clear-btn" style="padding: 0.65rem 1.2rem; font-size: 0.86rem;">
                Clear
              </button>
              <button class="btn-primary" id="diary-save-btn" style="padding: 0.7rem 1.8rem; font-size: 0.9rem;">
                <span>💾 Save into Diary</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- =========================================================================
           TAB 2: MY DIARY BOOK (Archive of Past Diary Entries)
           ========================================================================= -->
      <div id="diary-panel-archive" class="diary-panel" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.4rem;">
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary);">
            Your Diary Archive
          </h3>
          <button class="btn-primary" id="diary-new-entry-shortcut-btn" style="font-size: 0.84rem; padding: 0.5rem 1.1rem;">
            + New Page
          </button>
        </div>

        ${entries.length === 0 ? `
          <div class="her-card" style="text-align: center; padding: 3rem 1.5rem;">
            <span style="font-size: 2.5rem; margin-bottom: 0.6rem; display: block;">📖</span>
            <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.4rem;">Your Diary is Waiting</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 400px; margin: 0 auto 1.4rem;">
              You haven't written any entries yet. Click below to write your first entry today.
            </p>
            <button class="btn-primary" id="diary-empty-start-btn">Write First Page</button>
          </div>
        ` : `
          <div class="diary-entries-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.4rem;">
            ${entries.map(e => `
              <div class="her-card diary-entry-card" data-entry-id="${e.id}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                    <span class="card-tag" style="background: rgba(224, 138, 149, 0.16); color: var(--color-rose);">
                      ${e.mood || '✨ Inspired'}
                    </span>
                    <span style="font-size: 0.76rem; color: var(--text-muted);">${e.time || ''}</span>
                  </div>

                  <h4 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; line-height: 1.25;">
                    ${e.title}
                  </h4>

                  <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                    📅 ${e.date}
                  </p>

                  <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1.2rem;">
                    ${e.content.replace(/\n/g, ' ')}
                  </p>
                </div>

                <div style="border-top: 1px dashed var(--border-color); padding-top: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.75rem; color: var(--color-amber);">
                    ✦ ${e.wordCount || 0} words
                  </span>
                  
                  <div style="display: flex; gap: 0.4rem; align-items: center;">
                    <button class="btn-ghost diary-read-btn" data-id="${e.id}" style="padding: 0.2rem 0.6rem; font-size: 0.8rem;">
                      Read Page ➔
                    </button>
                    <button class="btn-ghost diary-edit-btn" data-id="${e.id}" style="padding: 0.2rem 0.6rem; font-size: 0.8rem; color: var(--color-rose); font-weight: 600;" title="Edit Diary Entry">
                      ✏️ Edit
                    </button>
                    <button class="btn-ghost diary-delete-btn" data-id="${e.id}" style="color: var(--color-rose-dark); padding: 0.2rem 0.4rem; font-size: 0.8rem;" title="Delete Entry">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- =========================================================================
           TAB 3: GUIDED PROMPTS & INSPIRATION
           ========================================================================= -->
      <div id="diary-panel-prompts" class="diary-panel" style="display: none;">
        <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 1.4rem;">
          Guided Diary Templates
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.4rem;">
          ${prompts.map(p => `
            <div class="her-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: var(--color-rose); margin-bottom: 0.6rem;">
                  ${p.title}
                </h4>
                <pre style="font-family: var(--font-sans); font-size: 0.84rem; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.6; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.2rem;">${p.template}</pre>
              </div>
              <button class="btn-primary use-prompt-btn" data-template="${encodeURIComponent(p.template)}" data-title="${encodeURIComponent(p.title)}" style="font-size: 0.85rem; width: 100%;">
                Use This Template ➔
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  attachDiaryListeners(container);
}

function attachDiaryListeners(container) {
  // Tab Switching
  const tabBtns = container.querySelectorAll('.diary-tab-btn');
  const panels = container.querySelectorAll('.diary-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('selected-yes', 'active'));
      btn.classList.add('selected-yes', 'active');

      const targetTab = btn.dataset.tab;
      panels.forEach(p => p.style.display = 'none');
      const targetPanel = container.querySelector(`#diary-panel-${targetTab}`);
      if (targetPanel) targetPanel.style.display = 'block';
    });
  });

  // Shortcut & Empty buttons
  container.querySelector('#diary-new-entry-shortcut-btn')?.addEventListener('click', () => {
    container.querySelector('#tab-write-btn')?.click();
  });
  container.querySelector('#diary-empty-start-btn')?.addEventListener('click', () => {
    container.querySelector('#tab-write-btn')?.click();
  });

  // Mood selector chip listener
  let selectedMood = '✨ Inspired';
  container.querySelectorAll('.diary-mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.diary-mood-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedMood = chip.dataset.mood;
    });
  });

  // Live word counter
  const contentArea = container.querySelector('#diary-entry-content');
  const liveCount = container.querySelector('#diary-live-word-count');
  if (contentArea && liveCount) {
    contentArea.addEventListener('input', () => {
      const words = contentArea.value.trim().split(/\s+/).filter(Boolean).length;
      liveCount.textContent = `${words} words`;
    });
  }

  // Template select dropdown
  const templateSelect = container.querySelector('#diary-template-select');
  if (templateSelect && contentArea) {
    templateSelect.addEventListener('change', () => {
      const val = templateSelect.value;
      const prompts = store.state.journal.prompts || [];
      if (val === 'stream' && prompts[0]) contentArea.value = prompts[0].template;
      if (val === 'morning' && prompts[1]) contentArea.value = prompts[1].template;
      if (val === 'evening' && prompts[2]) contentArea.value = prompts[2].template;
      if (val === 'identity' && prompts[3]) contentArea.value = prompts[3].template;
      contentArea.dispatchEvent(new Event('input'));
    });
  }

  // Use Prompt from Tab 3
  container.querySelectorAll('.use-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const template = decodeURIComponent(btn.dataset.template);
      const title = decodeURIComponent(btn.dataset.title);
      if (contentArea) contentArea.value = template;
      const titleInput = container.querySelector('#diary-entry-title');
      if (titleInput) titleInput.value = title.replace(/[^\w\s—]/g, '').trim();
      container.querySelector('#tab-write-btn')?.click();
      contentArea?.dispatchEvent(new Event('input'));
      showToast('Template loaded into new diary page!', '✍️');
    });
  });

  // Save Diary Entry
  const saveBtn = container.querySelector('#diary-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const title = container.querySelector('#diary-entry-title')?.value.trim() || 'Untitled Diary Entry';
      const content = contentArea?.value.trim() || '';
      const tagsStr = container.querySelector('#diary-entry-tags')?.value.trim() || 'Reflection';
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      if (!content) {
        showToast('Please write something in your diary before saving.', '⚠️');
        contentArea?.focus();
        return;
      }

      store.addDiaryEntry({
        title,
        content,
        mood: selectedMood,
        tags
      });

      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
      showToast('Diary entry safely saved in your Book of Days!', '📖');

      // Switch to archive tab
      renderJournalView(container);
      setTimeout(() => {
        container.querySelector('#tab-archive-btn')?.click();
      }, 50);
    });
  }

  // Clear button
  container.querySelector('#diary-clear-btn')?.addEventListener('click', () => {
    if (contentArea) contentArea.value = '';
    const titleInput = container.querySelector('#diary-entry-title');
    if (titleInput) titleInput.value = '';
    contentArea?.dispatchEvent(new Event('input'));
  });

  // Read full page modal
  container.querySelectorAll('.diary-read-btn, .diary-entry-card').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.diary-delete-btn') || e.target.closest('.diary-edit-btn')) return;
      const entryId = item.dataset.entryId || item.dataset.id;
      const entry = (store.state.journal.entries || []).find(x => x.id === entryId);
      if (entry) openDiaryReaderModal(entry, container);
    });
  });

  // Edit entry button trigger
  container.querySelectorAll('.diary-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryId = btn.dataset.id;
      const entry = (store.state.journal.entries || []).find(x => x.id === entryId);
      if (entry) openDiaryEditorModal(entry, container);
    });
  });

  // Delete entry
  container.querySelectorAll('.diary-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryId = btn.dataset.id;
      store.deleteDiaryEntry(entryId);
      renderJournalView(container);
      setTimeout(() => {
        container.querySelector('#tab-archive-btn')?.click();
      }, 50);
    });
  });
}

/**
 * Full Page Diary Reader Modal
 */
function openDiaryReaderModal(entry, mainContainer) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="custom-modal-backdrop" id="diary-modal-backdrop">
      <div class="custom-modal-card" style="max-width: 680px; width: 100%; max-height: 85vh; padding: 2.4rem; margin: auto; background: var(--bg-card); border: 1.5px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.4rem;">
          <div>
            <span class="card-tag" style="background: rgba(224, 138, 149, 0.16); color: var(--color-rose);">
              ${entry.mood || '✨ Inspired'}
            </span>
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin: 0.6rem 0 0.2rem;">
              ${entry.title}
            </h2>
            <p style="font-size: 0.84rem; color: var(--text-muted);">
              📅 ${entry.date} • ⏰ ${entry.time || ''} • ✦ ${entry.wordCount || 0} words
            </p>
          </div>
          <button class="modal-close-btn" id="close-diary-reader-btn">✕</button>
        </div>

        <div style="font-family: var(--font-sans); font-size: 1rem; color: var(--text-primary); line-height: 1.8; white-space: pre-wrap; margin-bottom: 1.8rem; padding: 1.4rem; background: rgba(0,0,0,0.25); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
${entry.content}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.2rem; flex-wrap: wrap; gap: 0.6rem;">
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${(entry.tags || []).map(t => `<span class="card-tag" style="background: rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 0.72rem;">#${t}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 0.8rem;">
            <button class="btn-secondary" id="reader-edit-page-btn" style="padding: 0.55rem 1.4rem; font-size: 0.88rem; font-weight: 600;">
              ✏️ Edit Entry
            </button>
            <button class="btn-primary" id="close-diary-reader-bottom-btn" style="padding: 0.55rem 1.4rem; font-size: 0.88rem;">
              Close Page
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const close = () => { modalContainer.innerHTML = ''; };
  document.getElementById('close-diary-reader-btn')?.addEventListener('click', close);
  document.getElementById('close-diary-reader-bottom-btn')?.addEventListener('click', close);
  document.getElementById('diary-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'diary-modal-backdrop') close();
  });

  // Edit from reader
  document.getElementById('reader-edit-page-btn')?.addEventListener('click', () => {
    close();
    openDiaryEditorModal(entry, mainContainer);
  });
}

/**
 * Full Page Diary Editor Modal (Allows editing any aspect of diary entries)
 */
function openDiaryEditorModal(entry, mainContainer) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const moods = [
    { label: '✨ Inspired', color: '#F08C42' },
    { label: '🕊️ Peaceful', color: '#E08A95' },
    { label: '🌿 Grounded', color: '#8A9880' },
    { label: '⚡ Disciplined', color: '#E08A95' },
    { label: '💭 Reflective', color: '#BBA395' },
    { label: '🌧️ Vulnerable', color: '#9F5154' }
  ];

  let selectedMood = entry.mood || '✨ Inspired';

  modalContainer.innerHTML = `
    <div class="custom-modal-backdrop" id="edit-diary-modal-backdrop">
      <div class="custom-modal-card" style="max-width: 680px; width: 100%; max-height: 88vh; padding: 2.2rem 2.4rem; margin: auto; background: var(--bg-card); border: 1.5px solid var(--border-color); box-shadow: var(--shadow-lg), 0 20px 60px rgba(0, 0, 0, 0.7);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 1.2rem; margin-bottom: 1.6rem;">
          <div>
            <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">EDIT DIARY ENTRY</span>
            <h2 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--text-primary); margin-top: 0.3rem;">
              <span>✏️</span> Edit Your Words
            </h2>
          </div>
          <button class="modal-close-btn" id="close-edit-modal-btn">✕</button>
        </div>

        <form id="diary-edit-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <!-- Title -->
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
              Diary Entry Title
            </label>
            <input type="text" id="edit-diary-title" class="diary-title-input" value="${entry.title.replace(/"/g, '&quot;')}" required style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 1.15rem; font-weight: 600; font-family: var(--font-serif); outline: none;">
          </div>

          <!-- Date & Time Row -->
          <div class="grid-2" style="gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
                Date
              </label>
              <input type="text" id="edit-diary-date" class="profile-input-field" value="${entry.date}" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.92rem; outline: none;">
            </div>
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
                Time
              </label>
              <input type="text" id="edit-diary-time" class="profile-input-field" value="${entry.time || ''}" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.92rem; outline: none;">
            </div>
          </div>

          <!-- Mood Selector -->
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">
              Mood / Heart Space
            </label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="edit-modal-mood-list">
              ${moods.map(m => `
                <button type="button" class="diary-mood-chip ${selectedMood === m.label ? 'active' : ''}" data-mood="${m.label}">
                  ${m.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Content Lined Textarea -->
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
              Diary Content
            </label>
            <textarea id="edit-diary-content" class="diary-lined-textarea" rows="10" style="min-height: 220px; font-size: 0.98rem; line-height: 1.8;">${entry.content}</textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; font-size: 0.78rem; color: var(--text-muted);">
              <span id="edit-live-word-count">${entry.wordCount || 0} words</span>
              <span>Edits will update your archive directly</span>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
              Tags (comma separated)
            </label>
            <input type="text" id="edit-diary-tags" class="profile-input-field" value="${(entry.tags || []).join(', ')}" placeholder="e.g. Discipline, Reflection, Healing" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.92rem; outline: none;">
          </div>

          <!-- Footer Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem; margin-top: 0.5rem;">
            <button type="button" id="cancel-edit-entry-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full);">
              Cancel
            </button>
            <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 2rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">
              💾 Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  `;

  const close = () => { modalContainer.innerHTML = ''; };
  document.getElementById('close-edit-modal-btn')?.addEventListener('click', close);
  document.getElementById('cancel-edit-entry-btn')?.addEventListener('click', close);
  document.getElementById('edit-diary-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'edit-diary-modal-backdrop') close();
  });

  // Mood selection in edit modal
  modalContainer.querySelectorAll('#edit-modal-mood-list .diary-mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      modalContainer.querySelectorAll('#edit-modal-mood-list .diary-mood-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedMood = chip.dataset.mood;
    });
  });

  // Live word counter in edit modal
  const contentArea = document.getElementById('edit-diary-content');
  const liveCount = document.getElementById('edit-live-word-count');
  if (contentArea && liveCount) {
    contentArea.addEventListener('input', () => {
      const words = contentArea.value.trim().split(/\s+/).filter(Boolean).length;
      liveCount.textContent = `${words} words`;
    });
  }

  // Handle Edit Submit
  const editForm = document.getElementById('diary-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('edit-diary-title').value.trim() || 'Untitled Diary Entry';
      const date = document.getElementById('edit-diary-date').value.trim() || entry.date;
      const time = document.getElementById('edit-diary-time').value.trim() || entry.time;
      const content = contentArea.value.trim();
      const tagsStr = document.getElementById('edit-diary-tags').value.trim();
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ['Reflection'];

      if (!content) {
        showToast('Diary content cannot be empty.', '⚠️');
        return;
      }

      store.updateDiaryEntry(entry.id, {
        title,
        date,
        time,
        content,
        mood: selectedMood,
        tags
      });

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      showToast('Diary entry updated in your Book of Days!', '✨');
      close();

      // Refresh view
      if (mainContainer) {
        renderJournalView(mainContainer);
        setTimeout(() => {
          mainContainer.querySelector('#tab-archive-btn')?.click();
        }, 50);
      }
    });
  }
}

