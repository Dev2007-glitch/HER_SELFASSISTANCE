/**
 * View: ROUTINE (Section 9 of design.doc)
 * Spacious timeline layout with thin lines, small icons & whitespace:
 * MORNING (07:00 Wake up, 07:10 Water + skincare, 07:30 Walk, 08:00 Breakfast, 08:30 Get ready)
 * EVENING (18:00 Workout, 19:00 Dinner, 20:00 Study, 21:30 Journal, 22:30 Wind down)
 */
import { store } from '../store.js';

let isAddingStep = false;
let addingPeriod = 'morning';

export function renderRoutineView(container) {
  const state = store.state;

  container.innerHTML = `
    <div class="view-routine">
      <div class="hero-editorial-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-sage-light) 100%);">
        <span class="hero-tagline">RHYTHM & ELEGANCE</span>
        <h1 class="hero-greeting" style="font-size: 3.2rem;">Daily Timeline & Rhythms</h1>
        <p class="hero-message">“Discipline is built through calm, repeatable rituals with plenty of space to breathe.”</p>
      </div>

      <div class="grid-2">
        
        <!-- MORNING TIMELINE -->
        <div class="her-card" style="padding: 2.2rem; border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
          <div class="card-header">
            <div>
              <span class="card-tag" style="background: var(--color-sage-light); color: var(--color-sage-dark);">Dawn · 07:00 - 08:45</span>
              <h3 class="card-title" style="margin-top: 0.4rem; font-size: 1.8rem; color: var(--text-primary);">☀️ MORNING</h3>
            </div>
            <button class="btn-ghost open-add-routine-btn" data-period="morning">+ Add Step</button>
          </div>

          <div style="position: relative; padding-left: 1.8rem; border-left: 1.5px solid var(--border-color); margin-left: 0.8rem; margin-top: 1.4rem; display: flex; flex-direction: column; gap: 1.4rem;">
            ${state.routines.morning.map(task => `
              <div style="position: relative;">
                <!-- Timeline Dot -->
                <div style="position: absolute; left: -2.35rem; top: 3px; width: 14px; height: 14px; border-radius: 50%; background: ${task.completed ? 'var(--color-burgundy)' : 'var(--bg-secondary)'}; border: 2.5px solid var(--bg-card); transition: background 0.3s;"></div>
                
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div class="custom-checkbox ${task.completed ? 'checked' : ''}" data-routine-period="morning" data-routine-id="${task.id}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <span style="font-family: var(--font-sans); font-size: 0.82rem; font-weight: 700; color: var(--color-rose); margin-right: 6px;">${task.time}</span>
                      <span class="item-text" style="font-size: 0.96rem; font-weight: 500; color: var(--text-primary);">${task.name}</span>
                    </div>
                  </div>
                  <span class="card-tag" style="font-size: 0.7rem;">${task.duration}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- EVENING TIMELINE -->
        <div class="her-card" style="padding: 2.2rem; border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
          <div class="card-header">
            <div>
              <span class="card-tag" style="background: var(--color-rose-light); color: var(--color-rose-dark);">Dusk · 18:00 - 22:45</span>
              <h3 class="card-title" style="margin-top: 0.4rem; font-size: 1.8rem; color: var(--text-primary);">🌙 EVENING</h3>
            </div>
            <button class="btn-ghost open-add-routine-btn" data-period="evening">+ Add Step</button>
          </div>

          <div style="position: relative; padding-left: 1.8rem; border-left: 1.5px solid var(--border-color); margin-left: 0.8rem; margin-top: 1.4rem; display: flex; flex-direction: column; gap: 1.4rem;">
            ${state.routines.evening.map(task => `
              <div style="position: relative;">
                <!-- Timeline Dot -->
                <div style="position: absolute; left: -2.35rem; top: 3px; width: 14px; height: 14px; border-radius: 50%; background: ${task.completed ? 'var(--color-burgundy)' : 'var(--bg-secondary)'}; border: 2.5px solid var(--bg-card); transition: background 0.3s;"></div>
                
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div class="custom-checkbox ${task.completed ? 'checked' : ''}" data-routine-period="evening" data-routine-id="${task.id}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <span style="font-family: var(--font-sans); font-size: 0.82rem; font-weight: 700; color: var(--color-rose); margin-right: 6px;">${task.time}</span>
                      <span class="item-text" style="font-size: 0.96rem; font-weight: 500; color: var(--text-primary);">${task.name}</span>
                    </div>
                  </div>
                  <span class="card-tag" style="font-size: 0.7rem;">${task.duration}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Habit Consistency Trackers -->
      <div class="her-card" style="margin-top: 2rem; border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
        <div class="card-header">
          <div>
            <h3 class="card-title" style="color: var(--text-primary);"><span>📊</span> Habit Grace System</h3>
            <p class="card-subtitle">Consistency over streaks · Missing one day never erases your growth.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem;">
          ${state.habits.map(h => `
            <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-weight: 600; font-size: 0.98rem; color: var(--text-primary);">${h.name}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${h.frequency}</div>
                </div>
                <span style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--color-rose);">${h.consistencyScore}%</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- CUSTOM MODAL CARD: ADD ROUTINE STEP -->
      ${isAddingStep ? `
        <div class="custom-modal-backdrop" id="routine-modal-overlay">
          <div class="her-card custom-modal-card" style="max-width: 520px; width: 100%; padding: 2.2rem; border: 1.5px solid var(--color-rose); box-shadow: var(--shadow-lg), 0 0 35px rgba(224, 138, 149, 0.25); position: relative;">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">DAILY RHYTHM</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.45rem; color: var(--text-primary);"><span>⏳</span> Add ${addingPeriod === 'morning' ? 'Morning ☀️' : 'Evening 🌙'} Step</h3>
              </div>
              <button class="btn-ghost" id="close-routine-modal-x" style="font-size: 1.2rem; padding: 0.2rem 0.6rem; cursor: pointer;">✕</button>
            </div>

            <form id="add-routine-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Step Description</label>
                <input type="text" id="routine-name-input" class="profile-input-field" required placeholder="e.g. 15-minute gentle mobility & stretch" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
              </div>

              <div class="grid-2" style="gap: 1.25rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Start Time</label>
                  <input type="text" id="routine-time-input" class="profile-input-field" value="${addingPeriod === 'morning' ? '07:30' : '20:30'}" placeholder="e.g. 07:30" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Duration</label>
                  <input type="text" id="routine-duration-input" class="profile-input-field" value="15 min" placeholder="e.g. 15 min" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                </div>
              </div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.8rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button type="button" id="cancel-routine-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">+ Add Step</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachRoutineListeners(container);
}

function attachRoutineListeners(container) {
  // Toggle checkbox
  container.querySelectorAll('[data-routine-period]').forEach(box => {
    box.addEventListener('click', () => {
      const period = box.dataset.routinePeriod;
      const id = box.dataset.routineId;
      store.toggleRoutineTask(period, id);
      renderRoutineView(container);
    });
  });

  // Open modal
  container.querySelectorAll('.open-add-routine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addingPeriod = btn.dataset.period || 'morning';
      isAddingStep = true;
      renderRoutineView(container);
    });
  });

  // Close modal
  const closeX = container.querySelector('#close-routine-modal-x');
  const cancelBtn = container.querySelector('#cancel-routine-btn');
  const overlay = container.querySelector('#routine-modal-overlay');

  const closeModal = () => {
    isAddingStep = false;
    renderRoutineView(container);
  };

  if (closeX) closeX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Form submit
  const form = container.querySelector('#add-routine-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (container.querySelector('#routine-name-input')?.value || '').trim();
      const time = (container.querySelector('#routine-time-input')?.value || '07:30').trim();
      const duration = (container.querySelector('#routine-duration-input')?.value || '15 min').trim();

      if (!name) return;

      store.state.routines[addingPeriod].push({
        id: 'r-' + Date.now(),
        time,
        name,
        duration,
        completed: false
      });
      store.saveState();
      isAddingStep = false;
      renderRoutineView(container);
    });
  }
}
