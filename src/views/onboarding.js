/**
 * View: ONBOARDING & LANDING FLOW (PRD Section 8)
 * Step 1: Landing Hero
 * Step 2: 5-Step Identity Discovery Questionnaire
 * Step 3: HER Blueprint Generation & "Start My First Day"
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import confetti from 'canvas-confetti';

export function renderOnboardingView(container) {
  let step = 0; // 0: Landing, 1: Trait Identity, 2: Life Areas, 3: Key Improvements, 4: Time Dedication, 5: Schedule, 6: Blueprint Generated

  const formData = {
    name: store.state.user.name || 'Maya',
    selectedTraits: [],
    selectedAreas: [],
    improvements: ['Study consistently', 'Exercise 4x weekly', 'Fix sleep schedule', 'Read 10 pages daily'],
    timeDedication: '',
    wakeTime: '06:30',
    sleepTime: '23:00'
  };

  const renderStep = () => {
    if (step === 0) {
      // Landing Hero Page
      container.innerHTML = `
        <div class="view-landing" style="max-width: 820px; margin: 2rem auto; text-align: center; animation: fadeIn 0.4s ease-out;">
          <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">✨</div>
          <span class="hero-tagline" style="font-size: 0.85rem; letter-spacing: 0.28em;">BECOME HER</span>
          
          <h1 style="font-family: var(--font-serif); font-size: 3.6rem; font-weight: 600; line-height: 1.15; margin: 0.6rem 0 1.2rem; color: var(--text-primary);">
            Build discipline.<br>
            Build consistency.<br>
            Build a life you actually love.
          </h1>

          <p style="font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: var(--text-secondary); max-width: 580px; margin: 0 auto 2.2rem; line-height: 1.5;">
            “You don't become the person you want to be overnight. You become them through what you repeatedly do.”
          </p>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" id="start-onboarding-btn" style="padding: 0.9rem 2.2rem; font-size: 1.05rem;">
              Start Becoming Her ➔
            </button>
            <button class="btn-secondary" id="skip-to-dashboard-btn" style="padding: 0.9rem 1.8rem; font-size: 1.02rem;">
              Open My Dashboard
            </button>
          </div>

          <!-- Feature Highlights Grid -->
          <div class="grid-3" style="margin-top: 3.5rem; text-align: left;">
            <div class="her-card">
              <span style="font-size: 1.6rem;">🪞</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin: 0.4rem 0 0.2rem;">Identity First</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Start with who you want to become rather than arbitrary task lists.</p>
            </div>
            <div class="her-card">
              <span style="font-size: 1.6rem;">🌱</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin: 0.4rem 0 0.2rem;">Grace over Streaks</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">No broken streak anxiety. Compounding 30-day consistency scores.</p>
            </div>
            <div class="her-card">
              <span style="font-size: 1.6rem;">🕊️</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin: 0.4rem 0 0.2rem;">Don't Forget to Live</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Dedicated space for friendships, cafes, hobbies, and pure joy.</p>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#start-onboarding-btn').addEventListener('click', () => {
        step = 1;
        renderStep();
      });

      container.querySelector('#skip-to-dashboard-btn').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
      });
      return;
    }

    // Step 1 - Trait Identity
    if (step === 1) {
      container.innerHTML = `
        <div class="her-card" style="max-width: 680px; margin: 1.5rem auto; padding: 2.4rem;">
          <span class="card-tag" style="background: var(--color-sage-light); color: var(--color-sage-dark); margin-bottom: 0.6rem; display: inline-block;">Step 1 of 5 · Identity</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem;">Who do you want to become?</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.6rem;">
            Select the traits and character qualities you wish to practice daily.
          </p>

          <div class="traits-wrap" id="onboard-traits">
            ${store.state.identity.allAvailableTraits.map(t => {
              const selected = formData.selectedTraits.includes(t);
              return `
                <button class="trait-chip ${selected ? 'selected' : ''}" data-trait="${t}">
                  <span>${selected ? '✓' : '+'}</span>
                  <span>${t}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
            <button class="btn-ghost" id="onboard-back-btn">← Back</button>
            <button class="btn-primary" id="onboard-next-btn">Continue ➔</button>
          </div>
        </div>
      `;
      attachStepListeners();
      return;
    }

    // Step 2 - Life Areas
    if (step === 2) {
      const areas = [
        '🎓 Education', '💼 Career', '💪 Fitness', '🥗 Health',
        '🧠 Mind', '💰 Money', '❤️ Relationships', '🎨 Hobbies',
        '✨ Confidence', '🌎 Experiences'
      ];
      container.innerHTML = `
        <div class="her-card" style="max-width: 680px; margin: 1.5rem auto; padding: 2.4rem;">
          <span class="card-tag" style="background: var(--color-peach-light); color: var(--color-peach); margin-bottom: 0.6rem; display: inline-block;">Step 2 of 5 · Priorities</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem;">What areas matter most right now?</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.6rem;">
            Choose 3 to 6 life priorities to avoid spreading yourself too thin.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;" id="onboard-areas">
            ${areas.map(a => {
              const selected = formData.selectedAreas.includes(a);
              return `
                <button class="promise-btn ${selected ? 'selected-yes' : ''}" data-area="${a}" style="text-align: left; padding: 0.85rem 1rem; border-radius: var(--radius-md);">
                  <span>${selected ? '✓ ' : ''}${a}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
            <button class="btn-ghost" id="onboard-back-btn">← Back</button>
            <button class="btn-primary" id="onboard-next-btn">Continue ➔</button>
          </div>
        </div>
      `;
      attachStepListeners();
      return;
    }

    // Step 3 - Realistic Time Commitment
    if (step === 3) {
      const times = ['< 15 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours', '3+ hours'];
      container.innerHTML = `
        <div class="her-card" style="max-width: 680px; margin: 1.5rem auto; padding: 2.4rem;">
          <span class="card-tag" style="background: var(--color-rose-light); color: var(--color-rose); margin-bottom: 0.6rem; display: inline-block;">Step 3 of 5 · Capacity</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem;">How much time can you dedicate daily?</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.6rem;">
            We use this to build a sustainable, burnout-free life operating system.
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.8rem;" id="onboard-time">
            ${times.map(t => {
              const selected = formData.timeDedication === t;
              return `
                <button class="promise-btn ${selected ? 'selected-yes' : ''}" data-time="${t}" style="padding: 0.95rem 1.2rem; text-align: left; font-size: 1rem; border-radius: var(--radius-md);">
                  ⚡ ${t} of intentional personal focus
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
            <button class="btn-ghost" id="onboard-back-btn">← Back</button>
            <button class="btn-primary" id="onboard-next-btn">Continue ➔</button>
          </div>
        </div>
      `;
      attachStepListeners();
      return;
    }

    // Step 4 - Daily Rhythm
    if (step === 4) {
      container.innerHTML = `
        <div class="her-card" style="max-width: 680px; margin: 1.5rem auto; padding: 2.4rem;">
          <span class="card-tag" style="background: var(--color-gold-light); color: var(--color-gold); margin-bottom: 0.6rem; display: inline-block;">Step 4 of 5 · Rhythm</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem;">What is your ideal daily rhythm?</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.6rem;">
            Aligning your routine with your circadian energy.
          </p>

          <div class="grid-2" style="margin-bottom: 1.2rem;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">☀️ Desired Wake Time:</label>
              <input type="time" id="onboard-wake" class="form-input" value="${formData.wakeTime}">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">🌙 Desired Sleep Time:</label>
              <input type="time" id="onboard-sleep" class="form-input" value="${formData.sleepTime}">
            </div>
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">What's your preferred first name?</label>
            <input type="text" id="onboard-name" class="form-input" value="${formData.name}" placeholder="Maya">
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
            <button class="btn-ghost" id="onboard-back-btn">← Back</button>
            <button class="btn-primary" id="generate-blueprint-btn">Generate My Blueprint ✨</button>
          </div>
        </div>
      `;

      container.querySelector('#onboard-back-btn').addEventListener('click', () => {
        step = 3;
        renderStep();
      });

      container.querySelector('#generate-blueprint-btn').addEventListener('click', () => {
        formData.name = container.querySelector('#onboard-name').value.trim() || 'Maya';
        formData.wakeTime = container.querySelector('#onboard-wake').value || '06:30';
        formData.sleepTime = container.querySelector('#onboard-sleep').value || '23:00';
        step = 5;
        renderStep();
      });
      return;
    }

    // Step 5 - HER Blueprint (PRD Step 3)
    if (step === 5) {
      container.innerHTML = `
        <div class="her-card" style="max-width: 720px; margin: 1.5rem auto; padding: 2.6rem; border: 2px solid var(--color-sage); animation: fadeIn 0.5s ease-out;">
          <div style="text-align: center; margin-bottom: 1.8rem;">
            <span style="font-size: 2.4rem;">📜</span>
            <span class="card-tag" style="background: var(--color-sage-light); color: var(--color-sage-dark); margin: 0.4rem 0; display: inline-block;">HER Blueprint Generated</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.4rem; color: var(--text-primary); margin-top: 0.2rem;">
              Your Life Blueprint, ${formData.name}.
            </h2>
            <p style="font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; color: var(--color-sage-dark); margin-top: 0.4rem;">
              “You are becoming someone who is ${formData.selectedTraits.slice(0, 4).join(', ')}.”
            </p>
          </div>

          <div style="background: var(--bg-card-subtle); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.4rem; margin-bottom: 1.6rem;">
            <div style="margin-bottom: 1rem;">
              <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--color-sage);">1. Your Core Priorities</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.4rem;">
                ${formData.selectedAreas.map(a => `<span class="card-tag" style="background: var(--color-sage-light); color: var(--color-sage-dark);">${a}</span>`).join('')}
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--color-peach);">2. Your Starter Goals</span>
              <ul style="padding-left: 1.2rem; font-size: 0.9rem; margin-top: 0.3rem; color: var(--text-primary); line-height: 1.6;">
                <li>Study consistently 2 hours per day with focus</li>
                <li>Exercise 4× weekly & nourish body</li>
                <li>Consistent restful sleep before ${formData.sleepTime}</li>
                <li>Read 10 pages daily before bed</li>
              </ul>
            </div>

            <div>
              <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose);">3. Daily Commitment</span>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.2rem;">
                ${formData.timeDedication} dedicated focus · Wake at ${formData.wakeTime} · Sleep at ${formData.sleepTime}
              </p>
            </div>
          </div>

          <button class="btn-primary" id="start-first-day-btn" style="width: 100%; padding: 0.95rem; font-size: 1.05rem;">
            Start My First Day ➔
          </button>
        </div>
      `;

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

      container.querySelector('#start-first-day-btn').addEventListener('click', () => {
        // Save to store
        store.state.user.name = formData.name;
        store.state.user.wakeTime = formData.wakeTime;
        store.state.user.sleepTime = formData.sleepTime;
        store.state.user.timeDedication = formData.timeDedication;
        store.state.identity.selectedTraits = formData.selectedTraits;
        store.state.user.isOnboarded = true;
        store.saveState();
        showToast('Welcome to your HER Operating System!', '✨');
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: 'home' }));
      });
    }
  };

  const attachStepListeners = () => {
    // Back button
    const backBtn = container.querySelector('#onboard-back-btn');
    if (backBtn) backBtn.addEventListener('click', () => { step--; renderStep(); });

    // Next button
    const nextBtn = container.querySelector('#onboard-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => { step++; renderStep(); });

    // Step 1 Traits selection
    container.querySelectorAll('#onboard-traits .trait-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const trait = chip.dataset.trait;
        if (formData.selectedTraits.includes(trait)) {
          formData.selectedTraits = formData.selectedTraits.filter(t => t !== trait);
        } else {
          formData.selectedTraits.push(trait);
        }
        renderStep();
      });
    });

    // Step 2 Areas selection
    container.querySelectorAll('#onboard-areas button').forEach(btn => {
      btn.addEventListener('click', () => {
        const area = btn.dataset.area;
        if (formData.selectedAreas.includes(area)) {
          formData.selectedAreas = formData.selectedAreas.filter(a => a !== area);
        } else {
          formData.selectedAreas.push(area);
        }
        renderStep();
      });
    });

    // Step 3 Time selection
    container.querySelectorAll('#onboard-time button').forEach(btn => {
      btn.addEventListener('click', () => {
        formData.timeDedication = btn.dataset.time;
        renderStep();
      });
    });
  };

  renderStep();
}
