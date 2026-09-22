/**
 * Quick Add Modal Component (+)
 * Easily log Habit, Action, Journal reflection, or Life Experience
 */
import { store } from '../store.js';
import { showToast } from './toast.js';

export function openQuickAddModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const modalHtml = `
    <div class="modal-overlay" id="quick-add-overlay">
      <div class="modal-dialog" style="max-width: 520px;">
        <button class="modal-close-btn" id="close-quick-add">&times;</button>
        
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
          <span style="font-size: 1.4rem;">✦</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem;">Quick Log</h2>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.4rem;">
          What would you like to capture in your journey today?
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
          <!-- 1. Top Action -->
          <div style="background: var(--bg-card-subtle); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <label style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--color-burgundy); display: block; margin-bottom: 0.4rem;">
              🎯 Add Today's Action
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="quick-action-input" class="form-input" placeholder="e.g. Study 1 hour, 20 min walk...">
              <button class="btn-primary" id="save-quick-action-btn" style="white-space: nowrap;">Add</button>
            </div>
          </div>

          <!-- 2. Quick Reflection -->
          <div style="background: var(--bg-card-subtle); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <label style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose-dark); display: block; margin-bottom: 0.4rem;">
              🤍 1-Line Gratitude / Thought
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="quick-thought-input" class="form-input" placeholder="e.g. Grateful for quiet morning coffee...">
              <button class="btn-secondary" id="save-quick-thought-btn" style="white-space: nowrap;">Save</button>
            </div>
          </div>

          <!-- 3. Life Experience -->
          <div style="background: var(--bg-card-subtle); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <label style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--color-peach); display: block; margin-bottom: 0.4rem;">
              ☕ Life Experience
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="quick-experience-input" class="form-input" placeholder="e.g. Sunset matcha at bakery...">
              <button class="btn-secondary" id="save-quick-exp-btn" style="white-space: nowrap;">Record</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  const overlay = document.getElementById('quick-add-overlay');
  const closeBtn = document.getElementById('close-quick-add');
  const closeModal = () => { container.innerHTML = ''; };

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  closeBtn.addEventListener('click', closeModal);

  // Save action
  const saveActionBtn = document.getElementById('save-quick-action-btn');
  saveActionBtn.addEventListener('click', () => {
    const val = document.getElementById('quick-action-input').value.trim();
    if (val) {
      store.addTop3(val, 'Focus');
      showToast('Added to Today\'s Actions!', '🎯');
      closeModal();
      window.dispatchEvent(new CustomEvent('render-current-view'));
    }
  });

  // Save thought
  const saveThoughtBtn = document.getElementById('save-quick-thought-btn');
  saveThoughtBtn.addEventListener('click', () => {
    const val = document.getElementById('quick-thought-input').value.trim();
    if (val) {
      store.state.journal.currentDaily.gratitude = val;
      store.saveState();
      showToast('Gratitude recorded in journal.', '🤍');
      closeModal();
    }
  });

  // Save experience
  const saveExpBtn = document.getElementById('save-quick-exp-btn');
  saveExpBtn.addEventListener('click', () => {
    const val = document.getElementById('quick-experience-input').value.trim();
    if (val) {
      store.state.daily.liveActivity = {
        id: 'live-' + Date.now(),
        title: val,
        category: 'Explore',
        completed: false
      };
      store.saveState();
      showToast('Life moment captured!', '☕');
      closeModal();
      window.dispatchEvent(new CustomEvent('render-current-view'));
    }
  });
}
