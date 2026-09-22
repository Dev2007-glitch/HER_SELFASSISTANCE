/**
 * View: LUXURY NYC BROOKLYN BRIDGE FULL 3D REALTIME VIEW WITH MOVING TRAFFIC
 * Features:
 * - Full panoramic view of the iconic Brooklyn Bridge arches, suspension cables & NYC skyline at golden twilight
 * - Realtime 3D Canvas rendering continuous animated car traffic across the bridge (moving golden headlights, ruby taillights, motion blur & light trails)
 * - Realtime water reflection engine reflecting bridge lights & moving traffic on the East River
 * - Frosted glassmorphic authentication card with 3D gyroscope/mouse parallax
 * - Dynamic Auth Mode Switcher: Sign In & Register / Create Account
 * - Dynamic Profile and Avatar synchronization on login / register
 * - Preserved Blueprint Flow launcher in both modes
 * - Foreground coffee cup ("Better Things Ahead") & gold-embossed leather journal ("A DISCIPLINED MIND A BEAUTIFUL LIFE")
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import confetti from 'canvas-confetti';

let currentAuthMode = 'signin'; // 'signin' | 'register'

export function renderLoginView(container) {
  container.innerHTML = `
    <div class="luxury-login-page" id="login-parallax-container">
      
      <!-- Realtime 3D Panoramic Brooklyn Bridge & Moving Traffic Canvas Layer -->
      <div class="login-bg-layer" id="login-bg-layer">
        <canvas id="bridge-traffic-canvas" class="bridge-traffic-canvas"></canvas>
        <div class="sunset-atmospheric-fog"></div>
      </div>

      <!-- Top Header Navigation -->
      <header class="login-top-bar">
        <div class="login-brand-group">
          <span class="login-brand-title">H<span style="color: var(--color-amber);">E</span>R<span style="font-size: 0.6em; vertical-align: top; color: var(--color-rose); font-family: var(--font-sans); margin-left: 2px;">™</span></span>
          <div class="login-brand-tagline">
            <span>A BETTER YOU</span>
            <span>A BRIGHTER TOMORROW</span>
          </div>
        </div>

        <div class="login-nav-right" id="login-nav-auth-toggle-wrap">
          <span class="login-member-text" id="login-nav-member-label">${currentAuthMode === 'signin' ? 'Not a member?' : 'Already a member?'}</span>
          <button class="login-signup-link" id="login-toggle-mode-btn">${currentAuthMode === 'signin' ? 'Sign up' : 'Sign in'}</button>
        </div>
      </header>

      <!-- Main 3-Column Luxury Composition -->
      <div class="login-main-stage">
        
        <!-- Left Column: Editorial Headline & Foreground Table Elements -->
        <div class="login-left-editorial">
          <div class="editorial-headline-block">
            <h1 class="editorial-title">
              A Brighter<br>
              <em class="editorial-em">You</em> Awaits
            </h1>
            <div class="editorial-subline">
              <span>DISCIPLINE TODAY</span>
              <span>A LIFE YOU LOVE TOMORROW</span>
            </div>
          </div>

          <!-- Foreground Still Life Elements (Coffee & Leather Journal) -->
          <div class="still-life-container">
            <div class="coffee-cup-wrap" title="Fresh morning latte">
              <div class="coffee-cup">
                <span class="cup-text">Better<br>Things<br>Ahead</span>
                <div class="latte-art"></div>
              </div>
            </div>

            <div class="journal-book-wrap" title="Personal Growth Journal">
              <div class="journal-book">
                <div class="journal-emboss">
                  <span>A DISCIPLINED</span>
                  <span>MIND</span>
                  <span class="journal-accent">✦</span>
                  <span>A BEAUTIFUL</span>
                  <span>LIFE</span>
                </div>
                <div class="luxury-pen"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column: Frosted Glassmorphic Authentication Card -->
        <div class="login-center-card-wrap">
          <div class="frosted-auth-card" id="frosted-card">
            <div id="auth-card-dynamic-content">
              <!-- Rendered by renderCardBody() -->
            </div>
          </div>
        </div>

        <!-- Right Column: Goals, Habits & Handwritten Script -->
        <div class="login-right-editorial">
          <div class="pillars-list">
            <span class="pillar-item">GOALS</span>
            <span class="pillar-item">HABITS</span>
            <span class="pillar-item">A HEALTHIER YOU</span>
            <span class="pillar-item">A HAPPIER LIFE</span>
            <div class="pillar-divider"></div>
          </div>

          <div class="handwritten-script-wrap">
            <span class="handwritten-script">New Day<br>New You ♡</span>
          </div>
        </div>

      </div>

      <!-- Bottom Footer -->
      <footer class="login-bottom-bar">
        <div class="footer-left">
          <span>© 2026 HER™. All rights reserved.</span>
        </div>
        <div class="footer-links">
          <a href="#privacy" class="footer-link">Privacy</a>
          <a href="#terms" class="footer-link">Terms</a>
          <a href="#support" class="footer-link">Support</a>
        </div>
      </footer>
    </div>
  `;

  // Render initial auth card contents
  renderCardBody(container);

  // Attach 3D bridge simulation & interactive parallax
  attachLoginBehaviors(container);
}

/**
 * Render the inner authentication form (Sign In vs Register)
 */
function renderCardBody(container) {
  const cardContent = container.querySelector('#auth-card-dynamic-content');
  const navMemberLabel = container.querySelector('#login-nav-member-label');
  const navToggleBtn = container.querySelector('#login-toggle-mode-btn');

  if (navMemberLabel && navToggleBtn) {
    if (currentAuthMode === 'signin') {
      navMemberLabel.textContent = 'Not a member?';
      navToggleBtn.textContent = 'Sign up';
    } else {
      navMemberLabel.textContent = 'Already a member?';
      navToggleBtn.textContent = 'Sign in';
    }
  }

  if (!cardContent) return;

  if (currentAuthMode === 'signin') {
    cardContent.innerHTML = `
      <div class="card-inner-header">
        <h2 class="auth-card-title">Welcome <span class="title-accent">Back</span></h2>
        <p class="auth-card-subtitle">CONTINUE YOUR JOURNEY</p>
      </div>

      <form class="auth-form" id="login-form" onsubmit="event.preventDefault();">
        <div class="form-group-custom">
          <span class="input-icon">✉️</span>
          <input type="email" id="login-email" class="auth-input-glass" placeholder="Email address" value="${store.state.user.email || 'anna@becoming.life'}" required>
        </div>

        <div class="form-group-custom">
          <span class="input-icon">🔒</span>
          <input type="password" id="login-password" class="auth-input-glass" placeholder="Password" value="••••••••••••" required>
          <button type="button" class="password-toggle-btn" id="toggle-pwd-btn">👁️</button>
        </div>

        <div class="auth-aux-row">
          <label class="remember-label">
            <input type="checkbox" id="remember-me" checked>
            <span class="custom-check-box"></span>
            <span class="remember-text">Remember me</span>
          </label>
          <a href="#forgot" class="forgot-link" id="forgot-pwd-link">Forgot your password?</a>
        </div>

        <button type="submit" class="auth-submit-btn" id="signin-submit-btn">
          <span>Sign in</span>
          <span class="submit-arrow">➔</span>
        </button>

        <div class="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div class="social-auth-grid">
          <button type="button" class="social-auth-btn" id="auth-google-btn" title="Sign in with Google">
            <span class="social-icon">G</span>
            <span>Google</span>
          </button>

          <button type="button" class="social-auth-btn" id="auth-apple-btn" title="Sign in with Apple ID">
            <span class="social-icon"></span>
            <span>Apple</span>
          </button>

          <button type="button" class="social-auth-btn social-more-btn" id="auth-more-btn" title="More login options (Facebook, GitHub, Passkey)">
            <span>•••</span>
          </button>
        </div>

        <!-- Preserved Option from Image 3 (Compact Blueprint Flow) -->
        <button type="button" class="login-blueprint-shortcut-btn" id="login-blueprint-shortcut-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; margin-top: 0.8rem; padding: 0.55rem 1rem; border-radius: var(--radius-full); background: rgba(224, 138, 149, 0.08); border: 1px dashed rgba(224, 138, 149, 0.35); color: var(--color-rose); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
          <span>📜</span>
          <span>New or want to reset? <u>Launch Blueprint Flow</u></span>
        </button>

        <div class="card-footer-quote">
          “ Same girl. Bigger goals. ”
        </div>
      </form>
    `;
  } else {
    // Register Mode
    cardContent.innerHTML = `
      <div class="card-inner-header">
        <h2 class="auth-card-title">Create <span class="title-accent">Account</span></h2>
        <p class="auth-card-subtitle">START YOUR TRANSFORMATION</p>
      </div>

      <form class="auth-form" id="register-form" onsubmit="event.preventDefault();">
        <div class="form-group-custom">
          <span class="input-icon">👤</span>
          <input type="text" id="register-name" class="auth-input-glass" placeholder="Full Name (e.g. Maya Lin)" required autofocus>
        </div>

        <div class="form-group-custom">
          <span class="input-icon">✉️</span>
          <input type="email" id="register-email" class="auth-input-glass" placeholder="Email address" required>
        </div>

        <div class="form-group-custom">
          <span class="input-icon">🔒</span>
          <input type="password" id="register-password" class="auth-input-glass" placeholder="Create password (min 6 characters)" required minlength="6">
          <button type="button" class="password-toggle-btn" id="toggle-pwd-btn">👁️</button>
        </div>

        <div class="auth-aux-row">
          <label class="remember-label" style="font-size: 0.78rem;">
            <input type="checkbox" id="register-terms" checked required>
            <span class="custom-check-box"></span>
            <span class="remember-text">I commit to becoming my highest self ✦</span>
          </label>
        </div>

        <button type="submit" class="auth-submit-btn" id="register-submit-btn" style="background: linear-gradient(135deg, var(--color-burgundy) 0%, #4D1A1F 100%);">
          <span>Create Account</span>
          <span class="submit-arrow">➔</span>
        </button>

        <div class="auth-divider">
          <span>OR REGISTER WITH</span>
        </div>

        <div class="social-auth-grid">
          <button type="button" class="social-auth-btn" id="auth-google-btn" title="Sign up with Google">
            <span class="social-icon">G</span>
            <span>Google</span>
          </button>

          <button type="button" class="social-auth-btn" id="auth-apple-btn" title="Sign up with Apple ID">
            <span class="social-icon"></span>
            <span>Apple</span>
          </button>

          <button type="button" class="social-auth-btn social-more-btn" id="auth-more-btn" title="More login options (Facebook, GitHub, Passkey)">
            <span>•••</span>
          </button>
        </div>

        <!-- Preserved Option from Image 3 (Compact Blueprint Flow) in Register mode too -->
        <button type="button" class="login-blueprint-shortcut-btn" id="login-blueprint-shortcut-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; margin-top: 0.8rem; padding: 0.55rem 1rem; border-radius: var(--radius-full); background: rgba(224, 138, 149, 0.08); border: 1px dashed rgba(224, 138, 149, 0.35); color: var(--color-rose); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
          <span>📜</span>
          <span>New or want to reset? <u>Launch Blueprint Flow</u></span>
        </button>

        <div class="card-footer-quote">
          “ Today is day one of becoming her. ”
        </div>
      </form>
    `;
  }

  // Bind form-specific events
  bindFormEvents(container);
}

/**
 * Bind form submit and helper buttons inside the active card
 */
function bindFormEvents(container) {
  // Password Visibility Toggle
  const pwdInput = container.querySelector('#login-password') || container.querySelector('#register-password');
  const togglePwdBtn = container.querySelector('#toggle-pwd-btn');
  if (pwdInput && togglePwdBtn) {
    togglePwdBtn.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        togglePwdBtn.textContent = '🔒';
      } else {
        pwdInput.type = 'password';
        togglePwdBtn.textContent = '👁️';
      }
    });
  }

  // Sign In Form Submit
  const signinForm = container.querySelector('#login-form');
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = container.querySelector('#login-email');
      const email = emailInput ? emailInput.value.trim() : 'anna@becoming.life';
      
      // Determine user name from email
      const prefix = email.split('@')[0];
      const userName = prefix ? (prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[._-]/g, ' ')) : 'User';

      // Login - if new/different account, initializes clean 0-data state
      store.loginWithAccount({ email, name: userName });

      // Update navbar avatar
      const navAvatar = document.getElementById('nav-avatar-initials');
      if (navAvatar) {
        navAvatar.textContent = (userName || 'U').charAt(0).toUpperCase();
      }

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      showToast(`Welcome, ${userName}! Your clean life dashboard is ready. ✨`, '✨');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
      }, 600);
    });
  }

  // Register Form Submit (Always brand new 0-data account)
  const registerForm = container.querySelector('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = container.querySelector('#register-name');
      const emailInput = container.querySelector('#register-email');
      
      const name = nameInput ? nameInput.value.trim() : 'User';
      const email = emailInput ? emailInput.value.trim() : 'user@becoming.life';

      // Initialize brand new account with 0 data (0% metrics, 0 stats, empty diary, unticked tasks)
      store.registerNewAccount({ name, email });

      // Update navbar avatar
      const navAvatar = document.getElementById('nav-avatar-initials');
      if (navAvatar) {
        navAvatar.textContent = (name || 'U').charAt(0).toUpperCase();
      }

      confetti({ particleCount: 65, spread: 80, origin: { y: 0.6 } });
      showToast(`Welcome to HER™, ${name}! Your new account is active. ✨`, '🌸');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
      }, 600);
    });
  }

  // Social Auth Modals (Google, Apple, Facebook / More)
  const googleBtn = container.querySelector('#auth-google-btn');
  const appleBtn = container.querySelector('#auth-apple-btn');
  const moreBtn = container.querySelector('#auth-more-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      openGoogleAccountModal();
    });
  }

  if (appleBtn) {
    appleBtn.addEventListener('click', () => {
      openAppleAccountModal();
    });
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      openMoreSocialModal();
    });
  }

  // Preserved Blueprint Shortcut Button
  const blueprintShortcutBtn = container.querySelector('#login-blueprint-shortcut-btn');
  if (blueprintShortcutBtn) {
    blueprintShortcutBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('start-onboarding-flow'));
    });
  }

  // Forgot password link
  const forgotLink = container.querySelector('#forgot-pwd-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Password reset link sent to your email address! ✉️', '🔑');
    });
  }
}

function attachLoginBehaviors(container) {
  const frostedCard = container.querySelector('#frosted-card');
  const pageContainer = container.querySelector('#login-parallax-container');
  const canvas = container.querySelector('#bridge-traffic-canvas');

  // Start 3D Realtime Brooklyn Bridge Traffic & River Animation Engine
  initBrooklynBridge3DEngine(canvas);

  // Mouse Parallax
  if (pageContainer && frostedCard) {
    pageContainer.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xOffset = (clientX / innerWidth - 0.5) * 18;
      const yOffset = (clientY / innerHeight - 0.5) * 18;

      frostedCard.style.transform = `perspective(1000px) rotateY(${xOffset * 0.35}deg) rotateX(${-yOffset * 0.35}deg) translateZ(10px)`;
    });

    pageContainer.addEventListener('mouseleave', () => {
      frostedCard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)`;
    });
  }

  // Toggle Mode (Sign In <-> Register)
  const toggleBtn = container.querySelector('#login-toggle-mode-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentAuthMode = currentAuthMode === 'signin' ? 'register' : 'signin';
      renderCardBody(container);
    });
  }
}

/**
 * Google Account Selection Modal
 */
function openGoogleAccountModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="custom-modal-backdrop" id="google-auth-backdrop">
      <div class="custom-modal-card" style="max-width: 440px; width: 100%; padding: 2rem; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg), 0 25px 60px rgba(0,0,0,0.7);">
        
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2rem; margin-bottom: 0.4rem;">
            <svg width="34" height="34" viewBox="0 0 24 24" style="vertical-align: middle;">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin: 0 0 0.3rem;">Sign in with Google</h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0;">Choose an account to continue to HER™</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          <!-- Account 1 -->
          <div class="google-account-item" data-email="anna.editorial@becoming.life" data-name="Anna" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-card-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--color-burgundy), var(--color-rose)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem;">
                A
              </div>
              <div>
                <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Anna</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">anna.editorial@becoming.life</div>
              </div>
            </div>
            <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: var(--radius-full); background: rgba(224, 138, 149, 0.18); color: var(--color-rose); font-weight: 600;">Active</span>
          </div>

          <!-- Account 2 -->
          <div class="google-account-item" data-email="anna.design.nyc@gmail.com" data-name="Anna Miller" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-card-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #4285F4, #34A853); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem;">
                A
              </div>
              <div>
                <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Anna Miller</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">anna.design.nyc@gmail.com</div>
              </div>
            </div>
          </div>

          <!-- Use another account -->
          <div class="google-account-item" data-email="new" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.85rem 1rem; border-radius: var(--radius-md); background: transparent; border: 1px dashed var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--bg-card-subtle); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              👤
            </div>
            <div style="font-size: 0.88rem; font-weight: 600; color: var(--color-rose);">Use another account</div>
          </div>
        </div>

        <div style="text-align: right; border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <button type="button" class="btn-ghost" id="close-google-auth-btn" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full);">Cancel</button>
        </div>

      </div>
    </div>
  `;

  const close = () => { container.innerHTML = ''; };
  document.getElementById('close-google-auth-btn')?.addEventListener('click', close);
  document.getElementById('google-auth-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'google-auth-backdrop') close();
  });

  container.querySelectorAll('.google-account-item').forEach(item => {
    item.addEventListener('click', () => {
      const email = item.dataset.email;
      const name = item.dataset.name || 'Anna';
      if (email === 'new') {
        const userPrompt = prompt('Enter your Google Account email:', 'user@gmail.com');
        if (userPrompt) {
          const cleanEmail = userPrompt.trim();
          const cleanPrefix = cleanEmail.split('@')[0];
          const cleanName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1).replace(/[._-]/g, ' ');
          store.registerNewAccount({ email: cleanEmail, name: cleanName });
          const navAvatar = document.getElementById('nav-avatar-initials');
          if (navAvatar) navAvatar.textContent = cleanName.charAt(0).toUpperCase();
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          showToast(`Signed in with new Google Account as ${cleanName}! Starting clean slate. ✨`, '🌐');
          setTimeout(() => {
            close();
            window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
          }, 500);
        }
      } else {
        store.loginWithAccount({ email, name });
        const navAvatar = document.getElementById('nav-avatar-initials');
        if (navAvatar) navAvatar.textContent = name.charAt(0).toUpperCase();
        confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
        showToast(`Signed in with Google as ${name}!`, '✨');
        setTimeout(() => {
          close();
          window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
        }, 500);
      }
    });
  });
}

/**
 * Apple ID Sign-In Modal
 */
function openAppleAccountModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="custom-modal-backdrop" id="apple-auth-backdrop">
      <div class="custom-modal-card" style="max-width: 440px; width: 100%; padding: 2.2rem 2rem; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg), 0 25px 60px rgba(0,0,0,0.7);">
        
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2.6rem; color: var(--text-primary); margin-bottom: 0.3rem;"></div>
          <h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin: 0 0 0.3rem;">Sign in with Apple ID</h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0;">Do you want to sign in to HER™ with your Apple ID?</p>
        </div>

        <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color); padding: 1.1rem; margin-bottom: 1.4rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border-subtle);">
            <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">Apple ID Account</span>
            <span style="font-size: 0.88rem; color: var(--text-primary); font-weight: 700;">anna.apple@icloud.com</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem;">
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; color: var(--text-primary);">
              <input type="radio" name="apple-email-opt" value="share" checked>
              <span>Share My Email (anna.apple@icloud.com)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; color: var(--text-secondary);">
              <input type="radio" name="apple-email-opt" value="hide">
              <span>Hide My Email (Relay iCloud)</span>
            </label>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <button type="button" class="action-pill-btn" id="confirm-apple-signin-btn" style="background: var(--color-burgundy); color: #fff; border: 1px solid var(--color-rose); padding: 0.75rem; border-radius: var(--radius-full); font-weight: 700; width: 100%; cursor: pointer;">
            Continue with Face ID / Passkey 
          </button>
          <button type="button" class="btn-ghost" id="close-apple-auth-btn" style="padding: 0.6rem; border-radius: var(--radius-full); justify-content: center; width: 100%;">
            Cancel
          </button>
        </div>

      </div>
    </div>
  `;

  const close = () => { container.innerHTML = ''; };
  document.getElementById('close-apple-auth-btn')?.addEventListener('click', close);
  document.getElementById('apple-auth-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'apple-auth-backdrop') close();
  });

  document.getElementById('confirm-apple-signin-btn')?.addEventListener('click', () => {
    store.loginWithAccount({ email: 'anna.apple@icloud.com', name: 'Anna' });
    const navAvatar = document.getElementById('nav-avatar-initials');
    if (navAvatar) navAvatar.textContent = 'A';
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
    showToast('Authenticated with Apple ID!', '');
    setTimeout(() => {
      close();
      window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
    }, 500);
  });
}

/**
 * Facebook / Social SSO Modal
 */
function openMoreSocialModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="custom-modal-backdrop" id="more-auth-backdrop">
      <div class="custom-modal-card" style="max-width: 440px; width: 100%; padding: 2rem; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg), 0 25px 60px rgba(0,0,0,0.7);">
        
        <div style="text-align: center; margin-bottom: 1.4rem;">
          <h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin: 0 0 0.3rem;">More Sign In Options</h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0;">Connect with your preferred identity provider</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          <!-- Facebook Option -->
          <div class="social-option-row" data-provider="Facebook" data-email="anna.fb@facebook.com" data-name="Anna Miller" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; border-radius: var(--radius-md); background: var(--bg-card-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <span style="font-size: 1.3rem; color: #1877F2; font-weight: 800;">f</span>
              <div>
                <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Continue with Facebook</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Logged in as Anna Miller</div>
              </div>
            </div>
            <span style="color: var(--color-rose);">➔</span>
          </div>

          <!-- GitHub Option -->
          <div class="social-option-row" data-provider="GitHub" data-email="anna.code@github.com" data-name="Anna Miller" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; border-radius: var(--radius-md); background: var(--bg-card-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <span style="font-size: 1.3rem;">🐙</span>
              <div>
                <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Sign in with GitHub</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">anna-dev</div>
              </div>
            </div>
            <span style="color: var(--color-rose);">➔</span>
          </div>

          <!-- Passkey Option -->
          <div class="social-option-row" data-provider="Passkey" data-email="anna.passkey@becoming.life" data-name="Anna" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; border-radius: var(--radius-md); background: var(--bg-card-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <span style="font-size: 1.3rem;">🔑</span>
              <div>
                <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Device Passkey / Touch ID</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">FIDO2 biometric login</div>
              </div>
            </div>
            <span style="color: var(--color-rose);">➔</span>
          </div>
        </div>

        <div style="text-align: right; border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <button type="button" class="btn-ghost" id="close-more-auth-btn" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full);">Cancel</button>
        </div>

      </div>
    </div>
  `;

  const close = () => { container.innerHTML = ''; };
  document.getElementById('close-more-auth-btn')?.addEventListener('click', close);
  document.getElementById('more-auth-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'more-auth-backdrop') close();
  });

  container.querySelectorAll('.social-option-row').forEach(row => {
    row.addEventListener('click', () => {
      const provider = row.dataset.provider;
      const email = row.dataset.email;
      const name = row.dataset.name || 'Anna';
      store.loginWithAccount({ email, name });
      const navAvatar = document.getElementById('nav-avatar-initials');
      if (navAvatar) navAvatar.textContent = name.charAt(0).toUpperCase();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      showToast(`Authenticated with ${provider}!`, '✨');
      setTimeout(() => {
        close();
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
      }, 500);
    });
  });
}

/**
 * 3D Realtime Brooklyn Bridge Traffic & Panoramic Environment Engine
 * Draws the iconic suspension bridge towers, glowing cables, moving car traffic (headlights & taillights with trails),
 * illuminated Manhattan skyscrapers, and shimmering East River reflections.
 */
function initBrooklynBridge3DEngine(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationId;
  let width, height;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Background High-Res Base Skyline & Bridge Image
  const bgImage = new Image();
  bgImage.crossOrigin = 'anonymous';
  bgImage.src = 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=2400&q=90';

  // Cars on the bridge lanes (Westbound: Headlights [amber/white], Eastbound: Taillights [ruby red])
  const cars = [];
  const TOTAL_CARS = 45;

  for (let i = 0; i < TOTAL_CARS; i++) {
    const isWestbound = Math.random() > 0.45;
    cars.push({
      progress: Math.random(),
      speed: (isWestbound ? 0.0018 : -0.0016) + (Math.random() - 0.5) * 0.0006,
      laneOffset: (Math.random() - 0.5) * 6,
      isWestbound,
      size: Math.random() * 2 + 2,
      brightness: Math.random() * 0.4 + 0.6
    });
  }

  let time = 0;

  const render = () => {
    time += 0.015;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Panoramic Sunset Skyline Background
    if (bgImage.complete && bgImage.naturalWidth > 0) {
      const imgRatio = bgImage.naturalWidth / bgImage.naturalHeight;
      const screenRatio = width / height;
      let drawW, drawH, drawX, drawY;

      if (screenRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) * 0.5;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) * 0.5;
        drawY = 0;
      }
      ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#1E0D10');
      skyGrad.addColorStop(0.35, '#42171E');
      skyGrad.addColorStop(0.55, '#873B35');
      skyGrad.addColorStop(0.75, '#DE8A66');
      skyGrad.addColorStop(1, '#0C0302');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Sunset Atmospheric Color Grading Tint
    const tintGrad = ctx.createLinearGradient(0, 0, 0, height);
    tintGrad.addColorStop(0, 'rgba(15, 6, 6, 0.25)');
    tintGrad.addColorStop(0.45, 'rgba(91, 27, 29, 0.15)');
    tintGrad.addColorStop(0.7, 'rgba(235, 140, 95, 0.18)');
    tintGrad.addColorStop(1, 'rgba(12, 3, 2, 0.85)');
    ctx.fillStyle = tintGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Brooklyn Bridge Perspective Road Geometry
    const bridgeStartX = width * 0.05;
    const bridgeStartY = height * 0.44;
    const bridgeEndX = width * 0.95;
    const bridgeEndY = height * 0.56;

    // 4. Draw Realtime Moving Car Headlights & Taillights with Light Trails
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    cars.forEach(car => {
      car.progress += car.speed;
      if (car.progress > 1) car.progress = 0;
      if (car.progress < 0) car.progress = 1;

      const p = car.progress;
      const archDip = Math.sin(p * Math.PI) * -18;
      const x = bridgeStartX + (bridgeEndX - bridgeStartX) * p;
      const y = bridgeStartY + (bridgeEndY - bridgeStartY) * p + archDip + car.laneOffset;

      const scale = 0.6 + p * 0.6;
      const r = car.size * scale;

      if (car.isWestbound) {
        // Golden / Warm White Headlights
        const glowRadius = r * 5;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        grad.addColorStop(0, `rgba(255, 245, 215, ${car.brightness})`);
        grad.addColorStop(0.4, `rgba(245, 190, 110, ${car.brightness * 0.5})`);
        grad.addColorStop(1, 'rgba(235, 150, 80, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 235, 180, ${car.brightness * 0.35})`;
        ctx.beginPath();
        ctx.ellipse(x - 8 * scale, y, 10 * scale, r * 0.8, -0.05, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Glowing Ruby Red Taillights
        const glowRadius = r * 4.5;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        grad.addColorStop(0, `rgba(255, 60, 60, ${car.brightness * 0.95})`);
        grad.addColorStop(0.4, `rgba(200, 20, 30, ${car.brightness * 0.4})`);
        grad.addColorStop(1, 'rgba(150, 0, 10, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFAAAA';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220, 30, 40, ${car.brightness * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(x + 7 * scale, y, 9 * scale, r * 0.7, 0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Water Reflections
      const waterY = height * 0.62 + (y - bridgeStartY) * 0.6 + Math.sin(time * 2 + x * 0.02) * 3;
      if (waterY < height) {
        ctx.fillStyle = car.isWestbound ? 'rgba(245, 180, 100, 0.08)' : 'rgba(210, 30, 40, 0.08)';
        ctx.beginPath();
        ctx.ellipse(x, waterY, r * 3, r * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();

    // 6. Suspension Cable Fairy Lights Twinkle
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 28; i++) {
      const cableX = width * 0.2 + (i / 28) * (width * 0.65);
      const curve = Math.sin((i / 28) * Math.PI);
      const cableY = height * 0.32 + curve * 40;
      const twinkle = Math.sin(time * 3 + i * 0.8) * 0.35 + 0.65;

      ctx.fillStyle = `rgba(255, 230, 180, ${twinkle * 0.6})`;
      ctx.beginPath();
      ctx.arc(cableX, cableY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 7. Shimmering East River Golden Sunset Waves
    ctx.save();
    const riverTop = height * 0.58;
    const riverHeight = height - riverTop;
    const waterGrad = ctx.createLinearGradient(0, riverTop, 0, height);
    waterGrad.addColorStop(0, 'rgba(220, 130, 85, 0.06)');
    waterGrad.addColorStop(0.4, 'rgba(145, 55, 60, 0.12)');
    waterGrad.addColorStop(1, 'rgba(15, 6, 6, 0.4)');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, riverTop, width, riverHeight);

    ctx.fillStyle = 'rgba(255, 220, 180, 0.04)';
    for (let j = 0; j < 24; j++) {
      const rx = (Math.sin(time + j * 1.5) * 0.45 + 0.5) * width;
      const ry = riverTop + (j / 24) * riverHeight;
      const rw = (j * 4) + 40;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    animationId = requestAnimationFrame(render);
  };

  render();
}
