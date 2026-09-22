/**
 * BECOMING — NYC Ambient Atmosphere & Backdrop Manager
 * Manages post-login NYC backgrounds, particle bokeh canvas, time/weather simulation, and soundscape controller.
 */

import { soundscape } from './nyc-soundscape.js';

export const NYC_PRESETS = {
  'brooklyn-twilight': {
    id: 'brooklyn-twilight',
    name: 'Brooklyn Bridge Twilight',
    tag: 'ICONIC SKYLINE',
    timeLabel: '7:45 PM · DUSK',
    temp: '68°F',
    condition: 'Sunset Glow',
    imageUrl: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=2560&q=90',
    overlayMesh: 'radial-gradient(circle at 15% 20%, rgba(235, 140, 95, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(91, 27, 29, 0.14) 0%, transparent 50%)'
  },
  'manhattan-golden': {
    id: 'manhattan-golden',
    name: 'Manhattan Golden Hour',
    tag: 'MIDTOWN WARMTH',
    timeLabel: '6:15 PM · GOLDEN HOUR',
    temp: '72°F',
    condition: 'Amber Rays',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=2560&q=90',
    overlayMesh: 'radial-gradient(circle at 25% 15%, rgba(245, 175, 110, 0.22) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(180, 80, 70, 0.16) 0%, transparent 55%)'
  },
  'dumbo-dusk': {
    id: 'dumbo-dusk',
    name: 'DUMBO Waterfront Dusk',
    tag: 'EAST RIVER BREEZE',
    timeLabel: '8:20 PM · BLUE HOUR',
    temp: '66°F',
    condition: 'Cobblestone Breeze',
    imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=2560&q=90',
    overlayMesh: 'radial-gradient(circle at 75% 25%, rgba(140, 160, 210, 0.18) 0%, transparent 45%), radial-gradient(circle at 20% 60%, rgba(91, 27, 29, 0.12) 0%, transparent 50%)'
  },
  'soho-midnight': {
    id: 'soho-midnight',
    name: 'SoHo Rooftop Midnight',
    tag: 'VELVET SKYLINE',
    timeLabel: '11:00 PM · NIGHT',
    temp: '63°F',
    condition: 'City Lights',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2560&q=90',
    overlayMesh: 'radial-gradient(circle at 30% 20%, rgba(200, 150, 100, 0.15) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(120, 40, 50, 0.2) 0%, transparent 50%)'
  },
  'central-park-dawn': {
    id: 'central-park-dawn',
    name: 'Central Park Rose Dawn',
    tag: 'SERENE MORNING',
    timeLabel: '6:30 AM · DAWN',
    temp: '61°F',
    condition: 'Soft Mist',
    imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=2560&q=90',
    overlayMesh: 'radial-gradient(circle at 20% 15%, rgba(235, 180, 190, 0.22) 0%, transparent 45%), radial-gradient(circle at 80% 35%, rgba(245, 220, 180, 0.18) 0%, transparent 50%)'
  }
};

class NYCAtmosphereController {
  constructor() {
    this.currentAtmosphere = localStorage.getItem('becoming_nyc_atmosphere') || 'brooklyn-twilight';
    this.bgSkylineEl = null;
    this.particleCanvas = null;
    this.particleCtx = null;
    this.particles = [];
    this.animId = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
  }

  init() {
    this.bgSkylineEl = document.querySelector('.nyc-ambient-skyline');
    this.setupParticleCanvas();
    this.setAtmosphere(this.currentAtmosphere);
    this.setupParallax();
    this.setupClockTicker();
  }

  setAtmosphere(presetId) {
    if (!NYC_PRESETS[presetId]) presetId = 'brooklyn-twilight';
    this.currentAtmosphere = presetId;
    localStorage.setItem('becoming_nyc_atmosphere', presetId);

    const preset = NYC_PRESETS[presetId];
    if (this.bgSkylineEl) {
      this.bgSkylineEl.style.backgroundImage = `url('${preset.imageUrl}')`;
    }

    const meshEl = document.querySelector('.nyc-ambient-sunset-mesh');
    if (meshEl && preset.overlayMesh) {
      meshEl.style.setProperty('--atmosphere-mesh', preset.overlayMesh);
    }

    // Update Live Weather Badge
    this.updateAtmosphereUI();

    window.dispatchEvent(new CustomEvent('nyc-atmosphere-changed', {
      detail: preset
    }));
  }

  updateAtmosphereUI() {
    const preset = NYC_PRESETS[this.currentAtmosphere] || NYC_PRESETS['brooklyn-twilight'];
    const badgeTime = document.getElementById('nyc-live-time');
    const badgeName = document.getElementById('nyc-live-name');
    const badgeTemp = document.getElementById('nyc-live-temp');

    if (badgeTime) badgeTime.textContent = preset.timeLabel;
    if (badgeName) badgeName.textContent = preset.name;
    if (badgeTemp) badgeTemp.textContent = `${preset.temp} • ${preset.condition}`;
  }

  setupClockTicker() {
    const updateTime = () => {
      const now = new Date();
      // Format NYC Time (EST/EDT)
      const options = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true };
      const nycTimeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      
      const realTimeEl = document.getElementById('nyc-realtime-clock');
      if (realTimeEl) {
        realTimeEl.textContent = `${nycTimeStr} NYC`;
      }
    };
    updateTime();
    setInterval(updateTime, 30000);
  }

  setupParallax() {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.targetMouseX = (e.clientX - cx) / cx;
      this.targetMouseY = (e.clientY - cy) / cy;
    }, { passive: true });

    const updateParallax = () => {
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

      if (this.bgSkylineEl) {
        const moveX = this.mouseX * -14;
        const moveY = this.mouseY * -10;
        this.bgSkylineEl.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.04)`;
      }

      requestAnimationFrame(updateParallax);
    };
    requestAnimationFrame(updateParallax);
  }

  setupParticleCanvas() {
    let canvas = document.getElementById('nyc-particles-canvas');
    if (!canvas) {
      const bgContainer = document.getElementById('global-nyc-bg');
      if (!bgContainer) return;
      canvas = document.createElement('canvas');
      canvas.id = 'nyc-particles-canvas';
      canvas.className = 'nyc-particles-canvas';
      bgContainer.appendChild(canvas);
    }

    this.particleCanvas = canvas;
    this.particleCtx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.createParticles();
    };

    window.addEventListener('resize', resize);
    resize();
    this.animateParticles();
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(35, Math.floor(window.innerWidth / 40));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.particleCanvas.width,
        y: Math.random() * this.particleCanvas.height,
        size: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.35 + 0.12,
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  animateParticles() {
    if (!this.particleCtx || !this.particleCanvas) return;
    const ctx = this.particleCtx;
    const w = this.particleCanvas.width;
    const h = this.particleCanvas.height;

    ctx.clearRect(0, 0, w, h);

    this.particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.pulseVal += p.pulseSpeed;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseVal));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 205, 145, ${currentOpacity})`;
      ctx.shadowColor = 'rgba(230, 160, 90, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.animateParticles());
  }
}

export const nycAtmosphere = new NYCAtmosphereController();

/**
 * Opens the NYC Atmosphere & Soundscape Customizer Modal
 */
export function openNYCAtmosphereModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const activePreset = nycAtmosphere.currentAtmosphere;
  const currentSound = soundscape.currentTrack;
  const isPlayingSound = soundscape.isPlaying;

  const modalHtml = `
    <div class="custom-modal-backdrop" id="atmosphere-modal-backdrop">
      <div class="custom-modal-card atmosphere-modal" style="max-width: 620px; width: 100%; padding: 2rem; margin: auto;">
        <div class="modal-header">
          <div>
            <span class="card-tag" style="background: var(--color-burgundy); color: #fff;">NYC Panorama & Atmosphere</span>
            <h3 class="modal-title" style="margin-top: 0.3rem;">New York City Sanctuary</h3>
          </div>
          <button class="modal-close-btn" id="close-atmosphere-modal-btn">✕</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem 0 0.5rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.2rem;">
            Select your ambient NYC backdrop and focus soundscape to keep your mind inspired and disciplined.
          </p>

          <!-- Scene Selector -->
          <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-burgundy); margin-bottom: 0.75rem;">
            🌆 Panoramic NYC Skyline View
          </div>
          <div class="atmosphere-scene-grid">
            ${Object.values(NYC_PRESETS).map(preset => `
              <div class="atmosphere-scene-card ${preset.id === activePreset ? 'active' : ''}" data-preset-id="${preset.id}">
                <div class="scene-preview" style="background-image: url('${preset.imageUrl}');">
                  <span class="scene-badge">${preset.tag}</span>
                </div>
                <div class="scene-info">
                  <span class="scene-name">${preset.name}</span>
                  <span class="scene-meta">${preset.timeLabel} • ${preset.temp}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Focus Soundscape Generator -->
          <div style="margin-top: 1.8rem; padding-top: 1.4rem; border-top: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-burgundy);">
                🎧 Procedural NYC Ambient Soundscape
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${isPlayingSound ? '● Playing' : '○ Muted'}</span>
            </div>

            <div class="soundscape-options-grid">
              <button class="soundscape-btn ${currentSound === 'off' ? 'active' : ''}" data-sound="off">
                <span class="sound-icon">🔇</span>
                <span class="sound-label">Silence</span>
              </button>
              <button class="soundscape-btn ${currentSound === 'rain' ? 'active' : ''}" data-sound="rain">
                <span class="sound-icon">🌧️</span>
                <span class="sound-label">SoHo Rain</span>
              </button>
              <button class="soundscape-btn ${currentSound === 'loft' ? 'active' : ''}" data-sound="loft">
                <span class="sound-icon">☕</span>
                <span class="sound-label">Brooklyn Loft</span>
              </button>
              <button class="soundscape-btn ${currentSound === 'wind' ? 'active' : ''}" data-sound="wind">
                <span class="sound-icon">🌬️</span>
                <span class="sound-label">Hudson Wind</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.6rem;">
          <button class="btn-primary" style="width: 100%;" id="save-atmosphere-modal-btn">Apply Atmosphere</button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  // Scene Selection Listener
  container.querySelectorAll('.atmosphere-scene-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.atmosphere-scene-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const presetId = card.dataset.presetId;
      nycAtmosphere.setAtmosphere(presetId);
    });
  });

  // Soundscape Selection Listener
  container.querySelectorAll('.soundscape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.soundscape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sound = btn.dataset.sound;
      soundscape.setTrack(sound);
    });
  });

  // Close Listeners
  const closeModal = () => { container.innerHTML = ''; };
  document.getElementById('close-atmosphere-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('save-atmosphere-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('atmosphere-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'atmosphere-modal-backdrop') closeModal();
  });
}
