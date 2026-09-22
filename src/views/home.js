/**
 * View: HOME / DASHBOARD (Section 6 of design.doc)
 * Senti CRM Luxury Branding × Panoramic NYC Atmosphere × Refined Liquid Glass
 * Header: "Good morning, Anna. Today is another chance to become her."
 * Modular Layout: [YOUR IDENTITY: "I keep promises to myself."] + [TODAY: ○ Study, ○ Workout, ○ Journal]
 * Life Balance Row: [MIND 72% · BODY 84% · FUTURE 61%]
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import { nycAtmosphere, NYC_PRESETS } from '../components/nyc-atmosphere.js';
import { soundscape } from '../components/nyc-soundscape.js';
import confetti from 'canvas-confetti';

let isAddingTop3 = false;

export function renderHomeView(container) {
  const state = store.state;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const hour = now.getHours();
  let greetingTime = 'Good morning';
  if (hour >= 12 && hour < 17) greetingTime = 'Good afternoon';
  if (hour >= 17) greetingTime = 'Good evening';

  const activePreset = nycAtmosphere.currentAtmosphere || 'brooklyn-twilight';
  const currentSound = soundscape.currentTrack || 'off';

  const mindDone = (state.daily.checklist?.mind || []).filter(i => i.completed).length;
  const mindTotal = (state.daily.checklist?.mind || []).length;
  const mindPct = mindTotal > 0 ? Math.round((mindDone / mindTotal) * 100) : 0;

  const bodyDone = (state.daily.checklist?.body || []).filter(i => i.completed).length;
  const bodyTotal = (state.daily.checklist?.body || []).length;
  const bodyPct = bodyTotal > 0 ? Math.round((bodyDone / bodyTotal) * 100) : 0;

  const futureDone = (state.daily.checklist?.future || []).filter(i => i.completed).length;
  const futureTotal = (state.daily.checklist?.future || []).length;
  const futurePct = futureTotal > 0 ? Math.round((futureDone / futureTotal) * 100) : 0;

  container.innerHTML = `
    <div class="view-home">
      
      <!-- Top Live NYC Atmosphere & Inspiration Ribbon -->
      <div class="nyc-inspiration-ribbon">
        <div class="ribbon-tag">
          <span>✦ NEW YORK EDITORIAL</span>
        </div>
        <div class="ribbon-text">
          “Discipline without burnout. Growth without perfection. You become who you repeatedly practice being.”
        </div>
        <div class="ribbon-badge">
          <span>Compounding Daily ✧</span>
        </div>
      </div>

      <!-- NYC Interactive Atmosphere & Focus Bar -->
      <div class="her-card" style="padding: 1.1rem 1.6rem; margin-bottom: 1.8rem; background: var(--glass-bg); backdrop-filter: var(--glass-blur);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-burgundy); display: flex; align-items: center; gap: 0.4rem;">
              <span class="atmosphere-dot"></span> NYC SKYLINE ATMOSPHERE:
            </span>
            <div class="dashboard-scene-pills" style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <button class="scene-quick-pill ${activePreset === 'brooklyn-twilight' ? 'active' : ''}" data-scene="brooklyn-twilight">
                🌉 Brooklyn Bridge
              </button>
              <button class="scene-quick-pill ${activePreset === 'manhattan-golden' ? 'active' : ''}" data-scene="manhattan-golden">
                🌅 Manhattan Sunset
              </button>
              <button class="scene-quick-pill ${activePreset === 'dumbo-dusk' ? 'active' : ''}" data-scene="dumbo-dusk">
                🌊 DUMBO Dusk
              </button>
              <button class="scene-quick-pill ${activePreset === 'soho-midnight' ? 'active' : ''}" data-scene="soho-midnight">
                🕯️ SoHo Midnight
              </button>
              <button class="scene-quick-pill ${activePreset === 'central-park-dawn' ? 'active' : ''}" data-scene="central-park-dawn">
                🌸 Central Park Dawn
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-rose-dark); display: flex; align-items: center; gap: 0.35rem;">
              🎧 SOUND:
            </span>
            <div class="dashboard-sound-pills" style="display: flex; gap: 0.4rem;">
              <button class="sound-quick-pill ${currentSound === 'off' ? 'active' : ''}" data-sound-track="off">
                🔇 Off
              </button>
              <button class="sound-quick-pill ${currentSound === 'rain' ? 'active' : ''}" data-sound-track="rain">
                🌧️ Rain
              </button>
              <button class="sound-quick-pill ${currentSound === 'loft' ? 'active' : ''}" data-sound-track="loft">
                ☕ Loft
              </button>
              <button class="sound-quick-pill ${currentSound === 'wind' ? 'active' : ''}" data-sound-track="wind">
                🌬️ Wind
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Section 1: Hero Editorial Grid (2-Column Hero + NYC Lifestyle Portrait) -->
      <div class="editorial-hero-grid">
        <div class="hero-editorial-card">
          <span class="hero-tagline">BECOMING · DAILY OPERATING SYSTEM</span>
          <h1 class="hero-greeting">${greetingTime}, ${state.user.name || 'Anna'}.</h1>
          <div style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 0.8rem; font-weight: 500;">${dateFormatted}</div>
          <p class="hero-message">“Today is another chance to become her. Build your habits. Keep your promises.”</p>
        </div>

        <div class="hero-image-frame">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85" alt="NYC Editorial Aesthetic" />
          <div class="floating-overlay-card">
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-burgundy); font-weight: 700;">EDITORIAL VIBE</div>
              <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">SoHo · Manhattan, NYC</div>
            </div>
            <span class="card-tag">Living in Flow</span>
          </div>
        </div>
      </div>

      <!-- Section 2 & 3: Modular Layout [YOUR IDENTITY] + [TODAY FOCUS] -->
      <div class="grid-2-editorial">
        
        <!-- Module 1: Your Identity -->
        <div class="her-card identity-card">
          <div class="card-header">
            <div>
              <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-burgundy);">Identity Architecture</span>
              <h3 class="card-title" style="margin-top: 0.3rem;"><span>✨</span> Your Identity</h3>
            </div>
          </div>

          <div class="identity-mantra-box">
            “${state.identity.todayMantra}”
          </div>

          <div style="margin-top: 1.2rem;">
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em; display: block; margin-bottom: 0.6rem;">
              Core Traits Practiced Today
            </span>
            <div class="traits-wrap" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${state.identity.selectedTraits.map(t => `
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-burgundy); font-weight: 600;">
                  ✦ ${t}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Module 2: Today Focus (Top 3 Actions) -->
        <div class="her-card top3-card">
          <div class="card-header">
            <div>
              <span class="card-tag" style="background: var(--color-rose-light); color: var(--color-rose-dark);">Top 3 Priorities</span>
              <h3 class="card-title" style="margin-top: 0.3rem;"><span>🎯</span> Today's Non-Negotiables</h3>
            </div>
            <button class="btn-ghost" id="add-top3-btn" style="font-size: 0.82rem; padding: 0.3rem 0.75rem;">+ Add</button>
          </div>

          <div class="top3-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.6rem;">
            ${state.daily.top3.map(item => `
              <div class="top3-item ${item.completed ? 'completed' : ''}">
                <div class="top3-left">
                  <div class="custom-checkbox ${item.completed ? 'checked' : ''}" data-top3-id="${item.id}">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span class="top3-title">${item.title}</span>
                </div>
                <span class="top3-category-badge">${item.category}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Section 6: Life Balance Metric Row: [MIND 72% · BODY 84% · FUTURE 61%] -->
      <div class="senti-metrics-row">
        <div class="metric-pill-card ${mindPct > 0 ? 'active' : ''}" style="${mindPct === 100 ? 'border-color: var(--color-rose); box-shadow: 0 0 16px rgba(224, 138, 149, 0.3);' : ''}">
          <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-burgundy); letter-spacing: 0.12em;">🧠 MIND</span>
          <div class="metric-pill-val">${mindPct}%</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${mindDone}/${mindTotal} Reading & Journaling</span>
        </div>

        <div class="metric-pill-card ${bodyPct > 0 ? 'active' : ''}" style="${bodyPct === 100 ? 'border-color: var(--color-rose); box-shadow: 0 0 16px rgba(224, 138, 149, 0.3);' : ''}">
          <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose-dark); letter-spacing: 0.12em;">🥗 BODY</span>
          <div class="metric-pill-val">${bodyPct}%</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${bodyDone}/${bodyTotal} Pilates & Hydration</span>
        </div>

        <div class="metric-pill-card ${futurePct > 0 ? 'active' : ''}" style="${futurePct === 100 ? 'border-color: var(--color-rose); box-shadow: 0 0 16px rgba(224, 138, 149, 0.3);' : ''}">
          <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-cocoa); letter-spacing: 0.12em;">💼 FUTURE</span>
          <div class="metric-pill-val">${futurePct}%</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${futureDone}/${futureTotal} Deep Study Blocks</span>
        </div>
      </div>

      <!-- Main Columns: Checklist & Daily Promise -->
      <div class="grid-main-side" style="margin-top: 1.8rem;">
        <!-- Left: Holistic Checklist -->
        <div class="her-card">
          <div class="card-header">
            <div>
              <h3 class="card-title"><span>📋</span> Daily Checklist</h3>
              <p class="card-subtitle">Mind · Body · Future · Self</p>
            </div>
          </div>

          <!-- Mind -->
          <div class="checklist-category-block">
            <div class="category-badge-header">
              <span class="category-name">🧠 Mind</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${state.daily.checklist.mind.filter(i => i.completed).length}/${state.daily.checklist.mind.length}
              </span>
            </div>
            <div class="checklist-items">
              ${state.daily.checklist.mind.map(item => `
                <div class="checklist-item ${item.completed ? 'completed' : ''}">
                  <div class="checklist-left">
                    <div class="custom-checkbox ${item.completed ? 'checked' : ''}" data-cat="mind" data-item-id="${item.id}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="item-text">${item.text}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Body -->
          <div class="checklist-category-block">
            <div class="category-badge-header">
              <span class="category-name">🥗 Body & Health</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${state.daily.checklist.body.filter(i => i.completed).length}/${state.daily.checklist.body.length}
              </span>
            </div>
            <div class="checklist-items">
              ${state.daily.checklist.body.map(item => `
                <div class="checklist-item ${item.completed ? 'completed' : ''}">
                  <div class="checklist-left">
                    <div class="custom-checkbox ${item.completed ? 'checked' : ''}" data-cat="body" data-item-id="${item.id}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="item-text">${item.text}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Future -->
          <div class="checklist-category-block">
            <div class="category-badge-header">
              <span class="category-name">💼 Future & Tech</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${state.daily.checklist.future.filter(i => i.completed).length}/${state.daily.checklist.future.length}
              </span>
            </div>
            <div class="checklist-items">
              ${state.daily.checklist.future.map(item => `
                <div class="checklist-item ${item.completed ? 'completed' : ''}">
                  <div class="checklist-left">
                    <div class="custom-checkbox ${item.completed ? 'checked' : ''}" data-cat="future" data-item-id="${item.id}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="item-text">${item.text}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Daily Promise Check & Don't Forget to Live -->
        <div style="display: flex; flex-direction: column; gap: 1.6rem;">
          
          <div class="her-card promise-card">
            <div class="card-header">
              <div>
                <span class="card-tag" style="background: var(--color-rose-light); color: var(--color-rose-dark);">Self-Trust</span>
                <h3 class="card-title" style="margin-top: 0.3rem;">Daily Promise</h3>
              </div>
            </div>

            <div class="promise-text">
              “${state.daily.promise.text}”
            </div>

            <div style="margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 0.8rem;">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.6rem;">
                Night check: Did you keep your promise?
              </span>
              <div class="promise-options">
                <button class="promise-btn ${state.daily.promise.status === 'yes' ? 'selected-yes' : ''}" data-status="yes">
                  ✓ Yes
                </button>
                <button class="promise-btn ${state.daily.promise.status === 'partial' ? 'selected-partial' : ''}" data-status="partial">
                  ◐ Partially
                </button>
                <button class="promise-btn ${state.daily.promise.status === 'not_today' ? 'selected-not-today' : ''}" data-status="not_today">
                  ○ Not today
                </button>
              </div>
            </div>
          </div>

          <!-- Don't Forget to Live callout -->
          <div class="her-card" style="background: linear-gradient(135deg, var(--color-peach-light) 0%, var(--bg-card) 90%); border: 1px solid rgba(232, 191, 169, 0.4);">
            <span class="card-tag" style="background: var(--color-peach); color: #211A18;">🕊️ Don't Forget to Live</span>
            <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin: 0.6rem 0 0.3rem;">
              ${state.daily.liveActivity.title}
            </h4>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 0.8rem;">
              Category: ${state.daily.liveActivity.category} · Life is happening today.
            </p>
            <button class="btn-secondary" id="complete-live-btn" style="width: 100%;">
              ${state.daily.liveActivity.completed ? '✓ Experienced Today' : 'Mark as Experienced'}
            </button>
          </div>

        </div>
      </div>

      <!-- CUSTOM MODAL CARD: ADD TOP 3 PRIORITY -->
      ${isAddingTop3 ? `
        <div class="custom-modal-backdrop" id="top3-modal-overlay">
          <div class="her-card custom-modal-card" style="max-width: 500px; width: 100%; padding: 2.2rem; border: 1.5px solid var(--color-rose); box-shadow: var(--shadow-lg), 0 0 35px rgba(224, 138, 149, 0.25); position: relative;">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">TODAY'S PRIORITIES</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.4rem; color: var(--text-primary);"><span>🎯</span> Add Focus Action</h3>
              </div>
              <button class="btn-ghost" id="close-top3-modal-x" style="font-size: 1.2rem; padding: 0.2rem 0.6rem; cursor: pointer;">✕</button>
            </div>

            <form id="add-top3-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Category</label>
                <select id="top3-cat-select" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; cursor: pointer;">
                  <option value="Mind">Mind & Study</option>
                  <option value="Body">Body & Movement</option>
                  <option value="Future">Future & Career</option>
                  <option value="Life">Intentional Life</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Focus Action Description</label>
                <input type="text" id="top3-task-input" class="profile-input-field" required placeholder="e.g. 90-minute Machine Learning practice" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
              </div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.8rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button type="button" id="cancel-top3-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">+ Add to Today's Top 3</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachHomeListeners(container);
}

function attachHomeListeners(container) {
  // NYC Preset Scene Buttons
  container.querySelectorAll('.scene-quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const sceneId = pill.dataset.scene || pill.dataset.sceneId;
      container.querySelectorAll('.scene-quick-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      nycAtmosphere.setAtmosphere(sceneId);
    });
  });

  // Soundscape Quick Buttons
  container.querySelectorAll('.sound-quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const track = pill.dataset.soundTrack;
      container.querySelectorAll('.sound-quick-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      soundscape.setTrack(track);
    });
  });

  // Top 3 check
  container.querySelectorAll('[data-top3-id]').forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = box.dataset.top3Id;
      store.toggleTop3(id);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.65 } });
      renderHomeView(container);
    });
  });

  // Open Add top 3 modal
  const addTop3Btn = container.querySelector('#add-top3-btn');
  if (addTop3Btn) {
    addTop3Btn.addEventListener('click', () => {
      isAddingTop3 = true;
      renderHomeView(container);
    });
  }

  // Close Top 3 modal
  const closeTop3X = container.querySelector('#close-top3-modal-x');
  const cancelTop3Btn = container.querySelector('#cancel-top3-btn');
  const overlay = container.querySelector('#top3-modal-overlay');

  const closeTop3Modal = () => {
    isAddingTop3 = false;
    renderHomeView(container);
  };

  if (closeTop3X) closeTop3X.addEventListener('click', closeTop3Modal);
  if (cancelTop3Btn) cancelTop3Btn.addEventListener('click', closeTop3Modal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTop3Modal();
    });
  }

  // Form submit Top 3
  const form = container.querySelector('#add-top3-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = (container.querySelector('#top3-task-input')?.value || '').trim();
      const cat = container.querySelector('#top3-cat-select')?.value || 'Mind';
      if (!task) return;

      store.addTop3(task, cat);
      isAddingTop3 = false;
      renderHomeView(container);
    });
  }

  // Promise status
  container.querySelectorAll('.promise-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status;
      store.setPromiseStatus(status);
      if (status === 'yes') {
        confetti({ particleCount: 38, spread: 60, origin: { y: 0.6 } });
      }
      renderHomeView(container);
    });
  });

  // Checklist check
  container.querySelectorAll('.custom-checkbox[data-cat]').forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = box.dataset.cat;
      const itemId = box.dataset.itemId;
      store.toggleChecklist(cat, itemId);
      renderHomeView(container);
    });
  });

  // Live complete
  const liveBtn = container.querySelector('#complete-live-btn');
  if (liveBtn) {
    liveBtn.addEventListener('click', () => {
      store.state.daily.liveActivity.completed = !store.state.daily.liveActivity.completed;
      store.saveState();
      if (store.state.daily.liveActivity.completed) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
      renderHomeView(container);
    });
  }
}

