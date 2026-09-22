/**
 * BECOMING — Main Application Entry Point & Router
 */
import { store } from './store.js';
import { renderHomeView } from './views/home.js';
import { renderBecomeView } from './views/become.js';
import { renderGoalsView } from './views/goals.js';
import { renderRoutineView } from './views/routine.js';
import { renderGrowView } from './views/grow.js';
import { renderLiveView } from './views/live.js';
import { renderJournalView } from './views/journal.js';
import { renderProfileView } from './views/profile.js';
import { renderOnboardingView } from './views/onboarding.js';
import { renderLoginView } from './views/login.js';
import { openResetModal } from './components/reset-modal.js';
import { openAIAssistantModal } from './components/ai-assistant-modal.js';
import { openVoiceAssistantModal } from './components/voice-assistant-modal.js';
import { openQuickAddModal } from './components/quick-add-modal.js';
import { nycAtmosphere, openNYCAtmosphereModal } from './components/nyc-atmosphere.js';
import { soundscape } from './components/nyc-soundscape.js';

class App {
  constructor() {
    this.container = document.getElementById('view-container');
    this.currentView = 'home';
    this.validViews = ['home', 'become', 'goals', 'routine', 'grow', 'live', 'journal', 'profile', 'onboarding', 'login'];
    this.init();
  }

  init() {
    // 1. Fixed Luxury Senti Dark Theme & NYC Atmosphere
    document.documentElement.setAttribute('data-theme', 'noir');
    store.state.user.theme = 'noir';
    nycAtmosphere.init();

    // 2. Set Avatar initial
    const avatarEl = document.getElementById('nav-avatar-initials');
    if (avatarEl) {
      avatarEl.textContent = (store.state.user.name || 'A').charAt(0);
    }

    // 3. Setup Navigation & Global Modals
    this.setupNavigation();
    this.setupGlobalActions();

    // 4. Handle Route on Load
    const initialHash = window.location.hash.replace('#', '').trim();
    if (initialHash && this.validViews.includes(initialHash)) {
      this.navigateTo(initialHash);
    } else {
      this.navigateTo('home');
    }

    // Custom events
    window.addEventListener('navigate-to-view', (e) => {
      this.navigateTo(e.detail);
    });

    window.addEventListener('render-current-view', () => {
      this.renderView(this.currentView);
    });

    window.addEventListener('start-onboarding-flow', () => {
      this.navigateTo('onboarding');
    });

    window.addEventListener('soundscape-state-changed', (e) => {
      const soundBtn = document.getElementById('soundscape-toggle-btn');
      if (soundBtn) {
        if (e.detail.isPlaying) {
          soundBtn.classList.add('playing');
        } else {
          soundBtn.classList.remove('playing');
        }
      }
    });

    window.addEventListener('nyc-atmosphere-changed', (e) => {
      const badgeText = document.getElementById('nyc-live-badge-text');
      if (badgeText && e.detail?.name) {
        badgeText.textContent = `✦ ${e.detail.name}`;
      }
    });
  }

  setupNavigation() {
    // Desktop Nav buttons & Login buttons
    document.querySelectorAll('.nav-btn, .nav-profile-btn, #nav-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Mobile Nav buttons
    document.querySelectorAll('.mob-nav-btn:not(.mob-plus-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Brand Logo
    const logoBtn = document.getElementById('logo-btn');
    if (logoBtn) {
      logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('home');
      });
    }

    // Hash change event listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && this.validViews.includes(hash) && hash !== this.currentView) {
        this.navigateTo(hash);
      }
    });
  }

  setupGlobalActions() {
    // Quick Add Button Desktop
    const quickAddBtn = document.getElementById('open-quick-add-btn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => openQuickAddModal());
    }

    // Quick Add Button Mobile
    const mobQuickAddBtn = document.getElementById('mob-quick-add');
    if (mobQuickAddBtn) {
      mobQuickAddBtn.addEventListener('click', () => openQuickAddModal());
    }

    // Reset Mode Button
    const resetBtn = document.getElementById('open-reset-modal-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => openResetModal());
    }

    // AI Coach Button
    const aiBtn = document.getElementById('open-ai-modal-btn');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => openAIAssistantModal());
    }

    // Voice Assistant Button (Mark-LIII)
    const voiceBtn = document.getElementById('open-voice-modal-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => openVoiceAssistantModal());
    }

    // Global Event Listener to open Voice Assistant
    window.addEventListener('open-voice-modal', () => {
      openVoiceAssistantModal();
    });

    // NYC Atmosphere Customizer
    const atmosphereBtn = document.getElementById('open-atmosphere-modal-btn');
    if (atmosphereBtn) {
      atmosphereBtn.addEventListener('click', () => openNYCAtmosphereModal());
    }

    // Soundscape Toggle
    const soundscapeBtn = document.getElementById('soundscape-toggle-btn');
    if (soundscapeBtn) {
      soundscapeBtn.addEventListener('click', () => {
        if (soundscape.isPlaying) {
          soundscape.stop();
          soundscape.notifyListeners();
        } else {
          openNYCAtmosphereModal();
        }
      });
    }

    // Theme Toggle Quick Cycle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const themes = ['ivory', 'rose', 'matcha', 'noir'];
        const current = store.state.user.theme || 'ivory';
        const next = themes[(themes.indexOf(current) + 1) % themes.length];
        store.setTheme(next);
      });
    }
  }

  navigateTo(viewName) {
    if (!this.validViews.includes(viewName)) {
      viewName = 'home';
    }

    this.currentView = viewName;
    if (window.location.hash.replace('#', '') !== viewName) {
      window.location.hash = viewName;
    }

    // Desktop navbar active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mobile navbar active state
    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Handle full-screen immersive mode for Login view
    const mainNav = document.getElementById('main-nav');
    const mobileNav = document.getElementById('mobile-nav');
    if (viewName === 'login') {
      if (mainNav) mainNav.style.display = 'none';
      if (mobileNav) mobileNav.style.display = 'none';
    } else {
      if (mainNav) mainNav.style.display = 'flex';
      if (mobileNav) mobileNav.style.display = '';
    }

    // Render View
    this.renderView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderView(viewName) {
    if (!this.container) return;
    this.container.innerHTML = '';

    switch (viewName) {
      case 'home':
        renderHomeView(this.container);
        break;
      case 'become':
        renderBecomeView(this.container);
        break;
      case 'goals':
        renderGoalsView(this.container);
        break;
      case 'routine':
        renderRoutineView(this.container);
        break;
      case 'grow':
        renderGrowView(this.container);
        break;
      case 'live':
        renderLiveView(this.container);
        break;
      case 'journal':
        renderJournalView(this.container);
        break;
      case 'profile':
        renderProfileView(this.container);
        break;
      case 'onboarding':
        renderOnboardingView(this.container);
        break;
      case 'login':
        renderLoginView(this.container);
        break;
      default:
        renderHomeView(this.container);
    }
  }
}

// Start application
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
