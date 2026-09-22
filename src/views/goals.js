/**
 * View: GOALS (Section 8 of design.doc)
 * Life Stories, not Jira Tickets:
 * Visual goal cards: Title, % complete, Milestones
 * 90 DAY VISION ➔ Monthly goals ➔ Weekly targets ➔ Today's action
 */
import { store } from '../store.js';

let isCreatingGoal = false;

export function renderGoalsView(container) {
  const state = store.state;

  container.innerHTML = `
    <div class="view-goals">
      <div class="hero-editorial-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-peach-light) 100%);">
        <span class="hero-tagline">LIFE STORIES · NOT JIRA TICKETS</span>
        <h1 class="hero-greeting" style="font-size: 3.2rem;">Visual Life Goals</h1>
        <p class="hero-message">“A vision without daily practice is just a wish. Connect your 90-day ambition to today's action.”</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.6rem; flex-wrap: wrap; gap: 0.8rem;">
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          <strong>${state.goals.length}</strong> active life narratives in motion
        </span>
        <button class="btn-primary" id="open-create-goal-btn">
          <span>+ Create Life Goal</span>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.8rem;">
        ${state.goals.map(goal => `
          <div class="her-card" style="border-left: 5px solid var(--color-burgundy); border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
            
            <!-- Header -->
            <div class="card-header">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose);">${goal.category} · ${goal.timeframe}</span>
                <h3 class="card-title" style="margin-top: 0.4rem; font-size: 1.7rem; color: var(--text-primary);">${goal.title}</h3>
              </div>
              <div style="text-align: right;">
                <span style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 700; color: var(--color-rose);">${goal.progress}%</span>
                <span style="font-size: 0.72rem; display: block; color: var(--text-muted); text-transform: uppercase;">Complete</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="height: 8px; background: var(--bg-secondary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 1.4rem;">
              <div style="height: 100%; width: ${goal.progress}%; background: linear-gradient(90deg, var(--color-burgundy), var(--color-rose)); border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
            </div>

            <!-- Hierarchy Grid (90-Day Vision ➔ Monthly ➔ Weekly ➔ Today's action) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; background: var(--bg-card-subtle); padding: 1.4rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.4rem;">
              <div>
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-rose); font-weight: 700;">🔮 90-DAY VISION</span>
                <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 4px; line-height: 1.4;">${goal.vision}</p>
              </div>
              <div>
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-amber); font-weight: 700;">📅 MONTHLY TARGET</span>
                <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 4px; line-height: 1.4;">${goal.monthlyTarget}</p>
              </div>
              <div>
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-rose); font-weight: 700;">⚡ WEEKLY TARGET</span>
                <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 4px; line-height: 1.4;">${goal.weeklyTarget}</p>
              </div>
              <div style="background: var(--bg-card); padding: 0.8rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-amber); font-weight: 700;">✨ TODAY'S ACTION</span>
                <p style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${goal.todayAction}</p>
              </div>
            </div>

            <!-- Milestones -->
            <div>
              <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); display: block; margin-bottom: 0.6rem;">
                Story Milestones:
              </span>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${goal.milestones.map((m, mIdx) => `
                  <div style="display: flex; align-items: center; gap: 0.7rem; font-size: 0.9rem; color: ${m.done ? 'var(--text-muted)' : 'var(--text-primary)'};">
                    <div class="custom-checkbox ${m.done ? 'checked' : ''}" data-goal-id="${goal.id}" data-milestone-idx="${mIdx}">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span style="text-decoration: ${m.done ? 'line-through' : 'none'}; cursor: pointer;">${m.text}</span>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        `).join('')}
      </div>

      <!-- CUSTOM MODAL CARD: CREATE GOAL -->
      ${isCreatingGoal ? `
        <div class="custom-modal-backdrop" id="goal-modal-overlay">
          <div class="her-card custom-modal-card" style="max-width: 600px; width: 100%; padding: 2.2rem; border: 1.5px solid var(--color-rose); box-shadow: var(--shadow-lg), 0 0 35px rgba(224, 138, 149, 0.25); position: relative;">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">GOAL ARCHITECTURE</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.45rem; color: var(--text-primary);"><span>🎯</span> Create Life Goal & Story</h3>
              </div>
              <button class="btn-ghost" id="close-goal-modal-x" style="font-size: 1.2rem; padding: 0.2rem 0.6rem; cursor: pointer;">✕</button>
            </div>

            <form id="create-goal-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="grid-2" style="gap: 1.25rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Goal Title</label>
                  <input type="text" id="goal-title-input" class="profile-input-field" required placeholder="e.g. BECOME FLUENT IN ITALIAN" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Category</label>
                  <select id="goal-category-select" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; cursor: pointer;">
                    <option value="Mind & Study">Mind & Study</option>
                    <option value="Body & Movement">Body & Movement</option>
                    <option value="Career & Future">Career & Future</option>
                    <option value="Creative & Life">Creative & Life</option>
                    <option value="Financial Growth">Financial Growth</option>
                  </select>
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">90-Day Vision Statement</label>
                <textarea id="goal-vision-input" rows="2" class="profile-input-field" placeholder="e.g. Feel completely confident speaking, traveling solo, and connecting with locals." style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; font-family: var(--font-sans);"></textarea>
              </div>

              <div class="grid-2" style="gap: 1.25rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Weekly Target</label>
                  <input type="text" id="goal-weekly-input" class="profile-input-field" placeholder="e.g. 3 x 30-min conversation lessons" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Today's Micro-Action</label>
                  <input type="text" id="goal-today-input" class="profile-input-field" placeholder="e.g. Practice 15 vocabulary flashcards" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                </div>
              </div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.8rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button type="button" id="cancel-goal-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">+ Create Life Goal</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachGoalsListeners(container);
}

function attachGoalsListeners(container) {
  // Milestone checkboxes
  container.querySelectorAll('.custom-checkbox[data-goal-id]').forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const gId = box.dataset.goalId;
      const mIdx = parseInt(box.dataset.milestoneIdx, 10);
      store.toggleGoalMilestone(gId, mIdx);
      renderGoalsView(container);
    });
  });

  // Open modal
  const openBtn = container.querySelector('#open-create-goal-btn');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      isCreatingGoal = true;
      renderGoalsView(container);
    });
  }

  // Close modal handlers
  const closeX = container.querySelector('#close-goal-modal-x');
  const cancelBtn = container.querySelector('#cancel-goal-btn');
  const overlay = container.querySelector('#goal-modal-overlay');

  const closeModal = () => {
    isCreatingGoal = false;
    renderGoalsView(container);
  };

  if (closeX) closeX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Form submit
  const form = container.querySelector('#create-goal-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (container.querySelector('#goal-title-input')?.value || '').trim();
      const category = container.querySelector('#goal-category-select')?.value || 'Growth';
      const vision = (container.querySelector('#goal-vision-input')?.value || '').trim() || 'Become her step by step.';
      const weekly = (container.querySelector('#goal-weekly-input')?.value || '').trim() || '3 focused sessions per week';
      const today = (container.querySelector('#goal-today-input')?.value || '').trim() || 'Start day 1 with 15 minutes';

      if (!title) return;

      store.state.goals.unshift({
        id: 'g-' + Date.now(),
        title: title.toUpperCase(),
        category,
        timeframe: '90-Day Vision',
        vision,
        monthlyTarget: '12 hours dedicated practice',
        weeklyTarget: weekly,
        todayAction: today,
        progress: 0,
        milestones: [
          { text: 'Start with foundational step 1', done: false },
          { text: 'Reach consistent 30-day checkpoint', done: false },
          { text: 'Achieve vision breakthrough', done: false }
        ]
      });
      store.saveState();
      isCreatingGoal = false;
      renderGoalsView(container);
    });
  }
}
