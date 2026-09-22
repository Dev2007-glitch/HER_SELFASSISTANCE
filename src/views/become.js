/**
 * View: BECOME (Section 7 of design.doc)
 * Large heading: "Who are you becoming?"
 * Identity Cards: DISCIPLINED, CONFIDENT, HEALTHY, CURIOUS
 * Identity ➔ Behavior Mapping
 */
import { store } from '../store.js';

let isAddingBehavior = false;

export function renderBecomeView(container) {
  const state = store.state;

  container.innerHTML = `
    <div class="view-become">
      <div class="hero-editorial-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-burgundy-light) 100%);">
        <span class="hero-tagline">PHILOSOPHICAL CORE</span>
        <h1 class="hero-greeting" style="font-size: 3.4rem;">Who are you becoming?</h1>
        <p class="hero-message">“Identity before habits. You don't become someone overnight; you practice being her each day.”</p>
      </div>

      <!-- Identity Cards Grid (Section 7) -->
      <div class="grid-2" style="margin-bottom: 2rem;">
        ${state.identity.statements.map(stmt => `
          <div class="her-card" style="border-top: 4px solid var(--color-burgundy);">
            <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-burgundy);">${stmt.trait}</span>
            <div style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 600; color: var(--text-primary); margin: 0.8rem 0 0.4rem; line-height: 1.3;">
              “${stmt.text}”
            </div>
            <p style="font-size: 0.86rem; color: var(--text-muted);">
              Anchored identity statement for daily alignment.
            </p>
          </div>
        `).join('')}
      </div>

      <!-- Section 7: Identity Connects to Behaviors -->
      <div class="her-card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><span>⚡</span> Identity ➔ Behavior Mapping</h3>
            <p class="card-subtitle">Connecting internal identity to concrete physical practice.</p>
          </div>
          <button class="btn-ghost" id="open-add-behavior-btn">+ Map New Behavior</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.4rem;">
          ${state.identity.behaviorMapping.map(mapping => `
            <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.4rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem;">
                <span style="font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.05em; color: var(--color-burgundy);">
                  ✦ ${mapping.trait}
                </span>
                <span class="card-tag">${mapping.behaviors.length} Actions</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                ${mapping.behaviors.map(b => `
                  <div style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9rem; color: var(--text-primary);">
                    <span style="color: var(--color-burgundy); font-weight: 700;">↓</span>
                    <span>${b}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Traits Selector -->
      <div class="her-card" style="margin-top: 1.8rem;">
        <div class="card-header">
          <div>
            <h3 class="card-title"><span>🪞</span> Character Traits Active</h3>
            <p class="card-subtitle">Tap to toggle traits you are currently focusing on.</p>
          </div>
        </div>

        <div class="traits-wrap">
          ${state.identity.allAvailableTraits.map(trait => {
            const selected = state.identity.selectedTraits.includes(trait);
            return `
              <button class="trait-chip ${selected ? 'selected' : ''}" data-trait="${trait}">
                <span>${selected ? '✓' : '+'}</span>
                <span>${trait}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- CUSTOM MODAL CARD: MAP BEHAVIOR -->
      ${isAddingBehavior ? `
        <div class="custom-modal-backdrop" id="behavior-modal-overlay">
          <div class="her-card custom-modal-card" style="max-width: 520px; width: 100%; padding: 2.2rem; border: 1.5px solid var(--color-rose); box-shadow: var(--shadow-lg), 0 0 35px rgba(224, 138, 149, 0.25); position: relative;">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">IDENTITY ARCHITECTURE</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.4rem; color: var(--text-primary);"><span>⚡</span> Map New Behavior</h3>
              </div>
              <button class="btn-ghost" id="close-behavior-modal-x" style="font-size: 1.2rem; padding: 0.2rem 0.6rem; cursor: pointer;">✕</button>
            </div>

            <form id="add-behavior-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Select Identity Trait</label>
                <select id="behavior-trait-select" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; cursor: pointer;">
                  ${state.identity.allAvailableTraits.map(t => `
                    <option value="${t.toUpperCase()}">${t}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Physical Behavior / Micro-Action</label>
                <input type="text" id="behavior-action-input" class="profile-input-field" required placeholder="e.g. Speak up in seminars and voice thoughts clearly" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
              </div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.8rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button type="button" id="cancel-behavior-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">+ Save Behavior</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachBecomeListeners(container);
}

function attachBecomeListeners(container) {
  // Listeners for traits toggle
  container.querySelectorAll('.trait-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const trait = chip.dataset.trait;
      store.toggleTrait(trait);
      renderBecomeView(container);
    });
  });

  // Open modal
  const openModalBtn = container.querySelector('#open-add-behavior-btn');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      isAddingBehavior = true;
      renderBecomeView(container);
    });
  }

  // Close modal handlers
  const closeModalX = container.querySelector('#close-behavior-modal-x');
  const cancelBtn = container.querySelector('#cancel-behavior-btn');
  const overlay = container.querySelector('#behavior-modal-overlay');

  const closeModal = () => {
    isAddingBehavior = false;
    renderBecomeView(container);
  };

  if (closeModalX) closeModalX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Form submit
  const form = container.querySelector('#add-behavior-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trait = container.querySelector('#behavior-trait-select')?.value || 'CONFIDENT';
      const action = (container.querySelector('#behavior-action-input')?.value || '').trim();

      if (!action) return;

      let m = store.state.identity.behaviorMapping.find(item => item.trait.toUpperCase() === trait.toUpperCase().trim());
      if (m) {
        m.behaviors.push(action);
      } else {
        store.state.identity.behaviorMapping.push({
          trait: trait.toUpperCase().trim(),
          behaviors: [action]
        });
      }
      store.saveState();
      isAddingBehavior = false;
      renderBecomeView(container);
    });
  }
}
