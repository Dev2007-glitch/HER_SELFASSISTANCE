/**
 * Reset Mode Modal (Section 12 of design.doc)
 * Soft, calm screen:
 * "You don't have to start over. You just need one good day."
 * Today's reset:
 * ☐ Make your bed
 * ☐ Drink water
 * ☐ 20-minute focus session
 * ☐ Take a walk
 * ☐ Sleep on time
 * [ I'm Showing Up Again ]
 */
import { store } from '../store.js';
import { showToast } from './toast.js';
import confetti from 'canvas-confetti';

export function openResetModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const modalHtml = `
    <div class="modal-overlay" id="reset-modal-overlay">
      <div class="modal-dialog" style="max-width: 560px; text-align: center; border: 2px solid var(--color-rose); background: #FCFAF7;">
        <button class="modal-close-btn" id="close-reset-modal">&times;</button>
        
        <div style="font-size: 2.5rem; margin-bottom: 0.4rem;">🌿</div>
        <span class="card-tag" style="background: var(--color-rose-light); color: var(--color-rose-dark); margin-bottom: 0.6rem; display: inline-block;">Gentle Reset</span>
        
        <h2 style="font-family: var(--font-display); font-size: 2.4rem; color: var(--text-primary); margin-bottom: 0.6rem; line-height: 1.15;">
          You don't have to start over.
        </h2>
        
        <p style="font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: var(--color-rose-dark); margin-bottom: 1.8rem; line-height: 1.4;">
          “You just need one good day.”
        </p>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.6rem; text-align: left; margin-bottom: 1.8rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-burgundy); font-weight: 700; margin-bottom: 1rem;">
            TODAY'S RESET RHYTHM
          </h4>
          
          <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.96rem; color: var(--text-primary);">
            <div style="display: flex; align-items: center; gap: 0.7rem;">
              <span style="font-size: 1.1rem; color: var(--color-burgundy);">☐</span>
              <span>Make your bed & reset personal desk</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.7rem;">
              <span style="font-size: 1.1rem; color: var(--color-burgundy);">☐</span>
              <span>Drink 2L fresh water throughout the day</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.7rem;">
              <span style="font-size: 1.1rem; color: var(--color-burgundy);">☐</span>
              <span>20-minute focus session on ONE priority</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.7rem;">
              <span style="font-size: 1.1rem; color: var(--color-burgundy);">☐</span>
              <span>Take a 15-minute walk outside in fresh air</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.7rem;">
              <span style="font-size: 1.1rem; color: var(--color-burgundy);">☐</span>
              <span>Sleep on time before 10:30 PM with zero guilt</span>
            </div>
          </div>
        </div>

        <button class="btn-primary" id="apply-reset-btn" style="width: 100%; padding: 0.95rem; font-size: 1.05rem;">
          I'm Showing Up Again ➔
        </button>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  const overlay = document.getElementById('reset-modal-overlay');
  const closeBtn = document.getElementById('close-reset-modal');
  const applyBtn = document.getElementById('apply-reset-btn');

  const closeModal = () => { container.innerHTML = ''; };

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  closeBtn.addEventListener('click', closeModal);

  applyBtn.addEventListener('click', () => {
    store.apply1DayReset();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    showToast('Reset activated: I am showing up again.', '🌿');
    closeModal();
    window.dispatchEvent(new CustomEvent('render-current-view'));
  });
}
