/**
 * View: PROFILE & LIFE BLUEPRINT
 * HER Personal Data Management, Identity Blueprint, System Overview & Data Privacy
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';

let isEditingPersonalData = false;

export function renderProfileView(container) {
  const state = store.state;
  const user = state.user;

  // Format joined date
  const joinedFormatted = user.joinedDate 
    ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'August 2026';

  container.innerHTML = `
    <div class="view-profile">
      <!-- Profile Header Hero -->
      <div class="hero-banner" style="background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem 2.5rem; margin-bottom: 2rem; backdrop-filter: var(--glass-blur);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <div class="avatar-circle" style="width: 80px; height: 80px; font-size: 2.4rem; background: linear-gradient(135deg, var(--color-burgundy), #5C1D21); color: #FAF4F4; border: 2px solid var(--color-rose); box-shadow: var(--shadow-md);">
              ${(user.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <span class="hero-tagline" style="color: var(--color-rose); font-size: 0.78rem; letter-spacing: 0.12em; font-weight: 700; text-transform: uppercase;">✦ HER PERSONAL OPERATING SYSTEM</span>
              <h1 class="hero-greeting" style="font-size: 2.4rem; margin: 0.2rem 0; color: var(--text-primary); font-family: var(--font-serif);">${user.name || 'Anna'}</h1>
              <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 600px; line-height: 1.5;">${user.tagline || 'Become the woman you are building. One ordinary day at a time.'}</p>
              <div style="display: flex; gap: 1rem; margin-top: 0.6rem; font-size: 0.82rem; color: var(--text-muted);">
                <span>📍 ${user.location || 'New York City, NY'}</span>
                <span>💼 ${user.occupation || 'Creative Technologist'}</span>
                <span>✨ Member since ${joinedFormatted}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.8rem; align-items: center;">
            <button class="action-pill-btn" id="toggle-edit-profile-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.65rem 1.4rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-full); transition: all var(--transition-fast);">
              ${isEditingPersonalData ? '✕ Cancel Editing' : '✎ Edit Personal Data'}
            </button>
            <button class="btn-ghost" id="profile-hero-signout-btn" style="color: var(--color-rose); border: 1px solid rgba(224, 138, 149, 0.4); padding: 0.65rem 1.4rem; border-radius: var(--radius-full); font-weight: 600; cursor: pointer;" title="Sign out of your account">
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>

      <div class="grid-main-side">
        <!-- Left Column: Personal Information & Identity Blueprint -->
        <div style="display: flex; flex-direction: column; gap: 1.6rem;">
          
          <!-- Personal Information Card -->
          <div class="her-card" id="personal-data-card" style="border: 1.5px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">USER PROFILE</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.35rem; color: var(--text-primary);"><span>👤</span> Personal Information</h3>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${isEditingPersonalData ? 'Editing Mode' : 'View Mode'}</span>
            </div>

            ${isEditingPersonalData ? `
              <!-- EDIT FORM MODE -->
              <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="grid-2" style="gap: 1.25rem;">
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Full Name</label>
                    <input type="text" id="input-profile-name" value="${user.name || ''}" class="profile-input-field" required placeholder="Your full name" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Email Address</label>
                    <input type="email" id="input-profile-email" value="${user.email || ''}" class="profile-input-field" placeholder="your.email@example.com" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                </div>

                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Personal Bio / Core Tagline</label>
                  <textarea id="input-profile-tagline" rows="2" class="profile-input-field" placeholder="Your aspirational mantra or personal tagline" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; font-family: var(--font-sans);">${user.tagline || ''}</textarea>
                </div>

                <div class="grid-2" style="gap: 1.25rem;">
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Occupation / Role</label>
                    <input type="text" id="input-profile-occupation" value="${user.occupation || ''}" class="profile-input-field" placeholder="e.g. Creative Technologist & Writer" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Location / City</label>
                    <input type="text" id="input-profile-location" value="${user.location || ''}" class="profile-input-field" placeholder="e.g. New York City, NY" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                </div>

                <div class="grid-3" style="gap: 1rem;">
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Wake Up Time</label>
                    <input type="time" id="input-profile-waketime" value="${user.wakeTime || '07:00'}" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Sleep Time</label>
                    <input type="time" id="input-profile-sleeptime" value="${user.sleepTime || '22:30'}" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Daily Focus Time</label>
                    <input type="text" id="input-profile-focus" value="${user.timeDedication || '2 hours'}" class="profile-input-field" placeholder="e.g. 2 hours" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
                  </div>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                  <button type="button" id="cancel-edit-profile-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                  <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">💾 Save Personal Data</button>
                </div>
              </form>
            ` : `
              <!-- VIEW DISPLAY MODE -->
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="grid-2" style="gap: 1rem;">
                  <div style="background: var(--bg-card-subtle); padding: 1.1rem 1.3rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose); letter-spacing: 0.05em;">Full Name</span>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: 0.3rem;">${user.name || 'Anna'}</div>
                  </div>
                  <div style="background: var(--bg-card-subtle); padding: 1.1rem 1.3rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose); letter-spacing: 0.05em;">Email Address</span>
                    <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-top: 0.3rem;">${user.email || 'anna.editorial@becoming.life'}</div>
                  </div>
                </div>

                <div style="background: var(--bg-card-subtle); padding: 1.1rem 1.3rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-amber); letter-spacing: 0.05em;">Personal Bio & Purpose</span>
                  <div style="font-size: 1.05rem; font-family: var(--font-serif); font-style: italic; color: var(--text-primary); margin-top: 0.3rem; line-height: 1.5;">“${user.tagline || 'Become the woman you are building. One ordinary day at a time.'}”</div>
                </div>

                <div class="grid-2" style="gap: 1rem;">
                  <div style="background: var(--bg-card-subtle); padding: 1.1rem 1.3rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">Occupation / Focus</span>
                    <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 0.3rem;">💼 ${user.occupation || 'Creative Technologist & Writer'}</div>
                  </div>
                  <div style="background: var(--bg-card-subtle); padding: 1.1rem 1.3rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">Current Location</span>
                    <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 0.3rem;">📍 ${user.location || 'New York City, NY'}</div>
                  </div>
                </div>

                <div class="grid-3" style="gap: 1rem;">
                  <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
                    <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-amber);">Wake Time</span>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">☀️ ${user.wakeTime || '07:00'}</div>
                  </div>
                  <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
                    <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose);">Sleep Time</span>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">🌙 ${user.sleepTime || '22:30'}</div>
                  </div>
                  <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
                    <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose-dark);">Daily Focus</span>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">⚡ ${user.timeDedication || '2 hours'}</div>
                  </div>
                </div>

                <div style="margin-top: 0.5rem; text-align: right;">
                  <button class="btn-ghost" id="quick-edit-data-btn" style="color: var(--color-rose); font-weight: 600; font-size: 0.88rem; cursor: pointer;">✎ Modify Personal Details</button>
                </div>
              </div>
            `}
          </div>

          <!-- Blueprint Card (Compact & Elegant) -->
          <div class="her-card" style="border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur); padding: 1.4rem 1.6rem;">
            <div class="card-header" style="margin-bottom: 0.8rem;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-size: 0.72rem;">Identity Architecture</span>
                <h3 class="card-title" style="margin-top: 0.2rem; font-size: 1.25rem;"><span>📜</span> Your HER Blueprint</h3>
              </div>
            </div>

            <p style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--text-primary); font-style: italic; margin-bottom: 0.9rem; line-height: 1.45;">
              “${state.identity.todayMantra || 'You are becoming someone who is disciplined, healthy, confident, and academically strong.'}”
            </p>

            <div style="background: var(--bg-card-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose); letter-spacing: 0.05em;">Selected Core Traits</span>
              <div class="traits-wrap" style="margin-top: 0.4rem; display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${state.identity.selectedTraits.map(t => `<span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 600; font-size: 0.76rem; padding: 0.2rem 0.6rem;">✦ ${t}</span>`).join('')}
              </div>
            </div>

            <button class="btn-secondary" id="restart-onboarding-btn" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.88rem; font-weight: 600;">
              Re-run Interactive Onboarding Blueprint Flow
            </button>
          </div>

        </div>

        <!-- Right Column: System Inventory & Privacy -->
        <div style="display: flex; flex-direction: column; gap: 1.6rem;">
          
          <!-- Active Life Systems Summary -->
          <div class="her-card" style="border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
            <div class="card-header">
              <h3 class="card-title"><span>🌟</span> Active Life Inventory</h3>
            </div>

            <div class="grid-3" style="grid-template-columns: repeat(3, 1fr); gap: 0.8rem;">
              <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-rose); font-weight: 700;">Goals</span>
                <div style="font-family: var(--font-serif); font-size: 1.9rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">
                  ${state.goals.length}
                </div>
              </div>
              <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-amber); font-weight: 700;">Habits</span>
                <div style="font-family: var(--font-serif); font-size: 1.9rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">
                  ${state.habits.length}
                </div>
              </div>
              <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-rose); font-weight: 700;">Diary</span>
                <div style="font-family: var(--font-serif); font-size: 1.9rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">
                  ${(state.journal && state.journal.entries) ? state.journal.entries.length : 0}
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Simulator -->
          <div class="her-card" style="border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
            <div class="card-header">
              <h3 class="card-title"><span>🔔</span> Gentle Notification Rhythm</h3>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.88rem;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 600; color: var(--text-primary);">Morning Intention (${user.wakeTime || '07:30'})</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">“What's one thing you want to make sure happens today?”</div>
                </div>
                <button class="btn-ghost test-notif-btn" data-type="morning">Test</button>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 600; color: var(--text-primary);">Evening Promise Check (${user.sleepTime || '21:30'})</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">“Before the day ends: did you keep today's promise?”</div>
                </div>
                <button class="btn-ghost test-notif-btn" data-type="evening">Test</button>
              </div>
            </div>
          </div>

          <!-- Data & Privacy with Sign Out Option -->
          <div class="her-card" style="border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
            <div class="card-header">
              <h3 class="card-title"><span>🔒</span> Privacy & Data</h3>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              <button class="btn-secondary" id="export-data-btn" style="width: 100%;">
                Export All My Data (JSON)
              </button>
              <button class="btn-ghost" id="reset-data-btn" style="color: var(--color-rose); justify-content: center; width: 100%;">
                Reset to Fresh Defaults
              </button>
              <button class="btn-ghost" id="profile-bottom-signout-btn" style="color: var(--color-rose); border: 1px solid rgba(224, 138, 149, 0.35); justify-content: center; width: 100%; font-weight: 600; margin-top: 0.4rem; padding: 0.7rem; border-radius: var(--radius-md);">
                🚪 Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  attachProfileListeners(container);
}

function attachProfileListeners(container) {
  const user = store.state.user;

  // Sign out handlers
  const handleSignOut = () => {
    showToast(`Signed out safely. See you soon, ${user.name || 'Anna'}!`, '👋');
    window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'login' }));
  };

  const heroSignOutBtn = container.querySelector('#profile-hero-signout-btn');
  if (heroSignOutBtn) heroSignOutBtn.addEventListener('click', handleSignOut);

  const bottomSignOutBtn = container.querySelector('#profile-bottom-signout-btn');
  if (bottomSignOutBtn) bottomSignOutBtn.addEventListener('click', handleSignOut);

  // Toggle Edit Personal Data Mode
  const toggleEditBtn = container.querySelector('#toggle-edit-profile-btn');
  if (toggleEditBtn) {
    toggleEditBtn.addEventListener('click', () => {
      isEditingPersonalData = !isEditingPersonalData;
      renderProfileView(container);
    });
  }

  // Quick edit trigger
  const quickEditBtn = container.querySelector('#quick-edit-data-btn');
  if (quickEditBtn) {
    quickEditBtn.addEventListener('click', () => {
      isEditingPersonalData = true;
      renderProfileView(container);
    });
  }

  // Cancel edit
  const cancelEditBtn = container.querySelector('#cancel-edit-profile-btn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      isEditingPersonalData = false;
      renderProfileView(container);
    });
  }

  // Handle Edit Profile Form Submission
  const editForm = container.querySelector('#edit-profile-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = (container.querySelector('#input-profile-name')?.value || '').trim();
      const email = (container.querySelector('#input-profile-email')?.value || '').trim();
      const tagline = (container.querySelector('#input-profile-tagline')?.value || '').trim();
      const occupation = (container.querySelector('#input-profile-occupation')?.value || '').trim();
      const location = (container.querySelector('#input-profile-location')?.value || '').trim();
      const wakeTime = container.querySelector('#input-profile-waketime')?.value || '07:00';
      const sleepTime = container.querySelector('#input-profile-sleeptime')?.value || '22:30';
      const timeDedication = (container.querySelector('#input-profile-focus')?.value || '2 hours').trim();

      if (!name) {
        showToast('Please enter your name.', '⚠️');
        return;
      }

      store.updateUserProfile({
        name,
        email,
        tagline,
        occupation,
        location,
        wakeTime,
        sleepTime,
        timeDedication
      });

      // Update navbar avatar initial
      const navAvatar = document.getElementById('nav-avatar-initials');
      if (navAvatar) {
        navAvatar.textContent = name.charAt(0).toUpperCase();
      }

      isEditingPersonalData = false;
      showToast('Personal data updated successfully!', '✨');
      renderProfileView(container);
    });
  }

  // Restart onboarding
  const restartOnboardingBtn = container.querySelector('#restart-onboarding-btn');
  if (restartOnboardingBtn) {
    restartOnboardingBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('start-onboarding-flow'));
    });
  }

  // Test Notifications
  container.querySelectorAll('.test-notif-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (type === 'morning') {
        showToast('Good morning. What is one thing you want to make sure happens today?', '☀️', 4500);
      } else {
        showToast('Before the day ends: did you keep today\'s promise to yourself?', '🌙', 4500);
      }
    });
  });

  // Export JSON data
  const exportBtn = container.querySelector('#export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `becoming_blueprint_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Data exported successfully!', '💾');
    });
  }

  // Reset to Defaults
  const resetBtn = container.querySelector('#reset-data-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      store.resetAllData();
      renderProfileView(container);
    });
  }
}
