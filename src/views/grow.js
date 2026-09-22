/**
 * View: GROW (Section 11 of design.doc)
 * Emotional progress with Real Indian Calendar & Panchang Festival System
 * Features:
 * - Real Indian Calendar with Months, Weekdays, Sundays highlighted
 * - Authentic Indian Festivals, Gazetted Holidays & National Observances
 * - Interactive Daily Presence & Consistency tracking without binary guilt
 * - Narrative Growth Timeline Payoff
 */
import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import { getIndianCalendarMonthData } from '../utils/indian-calendar.js';

// Calendar Navigation State
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

export function renderGrowView(container) {
  const state = store.state;
  const grow = state.grow;
  const calData = getIndianCalendarMonthData(calYear, calMonth);

  container.innerHTML = `
    <div class="view-grow">
      <div class="hero-editorial-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-burgundy-light) 100%);">
        <span class="hero-tagline">HER GROWTH & CONSISTENCY</span>
        <h1 class="hero-greeting" style="font-size: 3.2rem;">Quiet Compounding</h1>
        <p class="hero-message">“The competition is never with others on a leaderboard. It is only: Me today versus me before.”</p>
      </div>

      <!-- Hero Metrics Row -->
      <div class="grid-3" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); margin-bottom: 2rem;">
        <div class="her-card" style="text-align: center; padding: 1.8rem 1.2rem;">
          <span style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-burgundy); font-weight: 700;">PRESENCE</span>
          <div style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; color: var(--text-primary); margin: 0.2rem 0;">
            ${grow.daysShowedUp}
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Days showed up</span>
        </div>

        <div class="her-card" style="text-align: center; padding: 1.8rem 1.2rem;">
          <span style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-rose-dark); font-weight: 700;">CONSISTENCY</span>
          <div style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; color: var(--color-burgundy); margin: 0.2rem 0;">
            ${grow.overallConsistency}%
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">30-day holistic score</span>
        </div>

        <div class="her-card" style="text-align: center; padding: 1.8rem 1.2rem;">
          <span style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-cocoa); font-weight: 700;">GOALS PROGRESSED</span>
          <div style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; color: var(--text-primary); margin: 0.2rem 0;">
            ${grow.goalsCompleted}
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Milestones achieved</span>
        </div>

        <div class="her-card" style="text-align: center; padding: 1.8rem 1.2rem;">
          <span style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-sage); font-weight: 700;">HABITS ACTIVE</span>
          <div style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; color: var(--text-primary); margin: 0.2rem 0;">
            ${grow.habitsMaintained}
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Maintained with grace</span>
        </div>
      </div>

      <!-- REAL INDIAN CALENDAR & PRESENCE TRACKER -->
      <div class="her-card" style="margin-bottom: 2rem; border: 1.5px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
        
        <!-- Calendar Controls & Indian Panchang Info -->
        <div class="indian-cal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">🇮🇳 INDIAN CALENDAR</span>
              <span class="indian-cal-panchang-badge">✦ ${calData.panchang} · Ritu: ${calData.ritu}</span>
            </div>
            <h2 class="indian-cal-title" style="margin: 0.4rem 0 0.2rem; font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary);">
              ${calData.monthName} ${calData.year}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Click any day to toggle your presence status or explore Indian festivals & Sundays.</p>
          </div>

          <!-- Navigation Controls -->
          <div class="indian-cal-nav-btns">
            <button class="cal-nav-btn" id="btn-cal-prev" title="Previous Month">‹ Previous</button>
            <button class="cal-nav-btn today-btn" id="btn-cal-today" title="Jump to Current Month">📅 Today</button>
            <button class="cal-nav-btn" id="btn-cal-next" title="Next Month">Next ›</button>
          </div>
        </div>

        <!-- Weekday Headers (Mon to Sun with Sunday Highlighted) -->
        <div class="indian-cal-weekdays">
          <div class="weekday-col">MON</div>
          <div class="weekday-col">TUE</div>
          <div class="weekday-col">WED</div>
          <div class="weekday-col">THU</div>
          <div class="weekday-col">FRI</div>
          <div class="weekday-col">SAT</div>
          <div class="weekday-col sunday-col">SUN ☀️</div>
        </div>

        <!-- Indian Calendar Grid -->
        <div class="indian-cal-grid">
          ${calData.days.map((day, idx) => {
            if (day.isPadding) {
              return `
                <div class="indian-cal-cell padding-cell">
                  <span class="cal-day-num muted">${day.dayNumber}</span>
                </div>
              `;
            }

            const presence = store.getDatePresence(day.dateKey, day.dayNumber - 1);
            const isSunday = day.isSunday;
            const isToday = day.isToday;
            const festival = day.festival;

            return `
              <div class="indian-cal-cell active-cell ${isSunday ? 'sunday-cell' : ''} ${isToday ? 'today-cell' : ''} ${festival ? 'has-festival' : ''}" 
                   data-date-key="${day.dateKey}" 
                   data-day-num="${day.dayNumber}"
                   data-fest-name="${festival ? festival.name : ''}"
                   title="${day.dateKey}${isSunday ? ' (Sunday)' : ''}${festival ? ' • ' + festival.name : ''} — Presence: ${presence.toUpperCase()}">
                
                <div class="cal-cell-top">
                  <span class="cal-day-num ${isSunday ? 'sunday-num' : ''}">${day.dayNumber}</span>
                  <div class="cal-badges-group">
                    ${isToday ? `<span class="cal-badge-pill today">TODAY</span>` : ''}
                    ${isSunday ? `<span class="cal-badge-pill sunday">SUN</span>` : ''}
                  </div>
                </div>

                ${festival ? `
                  <div class="indian-cal-fest-pill ${festival.type || ''}">
                    <span class="fest-icon">${festival.emoji}</span>
                    <span class="fest-label">${festival.name}</span>
                  </div>
                ` : ''}

                <div class="cal-cell-bottom">
                  <span class="cal-presence-pill ${presence}">
                    ${presence === 'completed' ? '✓ Showed Up' : 
                      presence === 'partial' ? '⚡ Partial' : 
                      presence === 'rest' ? '🌿 Rest' :
                      presence === 'missed' ? '— Missed' : '— Upcoming'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Legend & Indian Calendar Explanations -->
        <div class="indian-cal-footer-bar">
          <div class="heatmap-legend" style="flex-wrap: wrap; gap: 1rem;">
            <div class="legend-item">
              <div class="legend-dot" style="background: var(--color-burgundy);"></div>
              <span style="color: var(--text-primary); font-weight: 600;">Showed Up (Completed)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background: var(--color-peach);"></div>
              <span style="color: var(--text-primary); font-weight: 600;">Partial</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background: var(--color-sand);"></div>
              <span style="color: var(--text-primary); font-weight: 600;">Rest & Restore</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background: var(--status-missed);"></div>
              <span style="color: var(--text-primary); font-weight: 600;">Missed</span>
            </div>
            <div class="legend-item">
              <span style="font-size: 0.72rem; color: var(--text-muted); border: 1px dashed var(--border-color); padding: 0.15rem 0.5rem; border-radius: var(--radius-full); font-weight: 600;">— Upcoming Days</span>
            </div>
            <div class="legend-item">
              <span style="font-size: 0.75rem; background: rgba(240, 140, 66, 0.2); color: var(--color-amber); padding: 0.15rem 0.55rem; border-radius: var(--radius-full); font-weight: 700; border: 1px solid rgba(240, 140, 66, 0.35);">☀️ SUNDAY</span>
            </div>
            <div class="legend-item">
              <span style="font-size: 0.75rem; background: rgba(224, 138, 149, 0.2); color: var(--color-rose); padding: 0.15rem 0.55rem; border-radius: var(--radius-full); font-weight: 700; border: 1px solid rgba(224, 138, 149, 0.35);">🪔 Indian Festival</span>
            </div>
          </div>
        </div>
            <div class="legend-item">
              <span style="font-size: 0.75rem; background: rgba(240, 140, 66, 0.2); color: var(--color-amber); padding: 0.15rem 0.55rem; border-radius: var(--radius-full); font-weight: 700; border: 1px solid rgba(240, 140, 66, 0.35);">☀️ SUNDAY</span>
            </div>
            <div class="legend-item">
              <span style="font-size: 0.75rem; background: rgba(224, 138, 149, 0.2); color: var(--color-rose); padding: 0.15rem 0.55rem; border-radius: var(--radius-full); font-weight: 700; border: 1px solid rgba(224, 138, 149, 0.35);">🪔 Indian Festival</span>
            </div>
          </div>
        </div>

        <!-- Monthly Festivals Breakdown List -->
        ${calData.monthFestivals.length > 0 ? `
          <div class="monthly-festivals-panel" style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px dashed var(--border-color);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem;">
              <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--color-rose); letter-spacing: 0.08em;">
                🪔 ${calData.monthName} ${calData.year} Indian Festivals & Significant Observances (${calData.monthFestivals.length})
              </span>
            </div>
            <div class="festivals-chips-grid">
              ${calData.monthFestivals.map(fest => `
                <div class="festival-summary-card ${fest.isSunday ? 'sunday-fest' : ''}">
                  <span class="fest-date-tag">${calData.monthName.slice(0, 3)} ${String(fest.day).padStart(2, '0')} (${fest.weekday})</span>
                  <div class="fest-main-info">
                    <span style="font-size: 1.1rem;">${fest.emoji}</span>
                    <span style="font-weight: 600; color: var(--text-primary);">${fest.name}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            No major national gazetted festivals recorded for this calendar month.
          </div>
        `}

      </div>

      <!-- Emotional Payoff Narrative at Bottom -->
      <div class="her-card" style="background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%); border: 1.5px solid var(--border-color);">
        <div class="card-header">
          <div>
            <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-burgundy);">Emotional Transformation Payoff</span>
            <h3 class="card-title" style="margin-top: 0.3rem;">Your Growth Narrative</h3>
          </div>
        </div>

        <div class="grid-2" style="margin-top: 1rem;">
          <div style="background: var(--bg-card); padding: 1.4rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em;">
              30 DAYS AGO:
            </span>
            <p style="font-family: var(--font-serif); font-size: 1.22rem; font-style: italic; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.45;">
              “${grow.timeline.past30Days}”
            </p>
          </div>

          <div style="background: var(--bg-card); padding: 1.4rem; border-radius: var(--radius-md); border: 1.5px solid var(--color-burgundy);">
            <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-burgundy); letter-spacing: 0.1em;">
              TODAY:
            </span>
            <p style="font-family: var(--font-serif); font-size: 1.22rem; font-weight: 600; color: var(--text-primary); margin-top: 0.4rem; line-height: 1.45;">
              “${grow.timeline.today}”
            </p>
          </div>
        </div>
      </div>

    </div>
  `;

  attachGrowCalendarListeners(container);
}

function attachGrowCalendarListeners(container) {
  // Previous Month
  const prevBtn = container.querySelector('#btn-cal-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      calMonth--;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      }
      renderGrowView(container);
    });
  }

  // Next Month
  const nextBtn = container.querySelector('#btn-cal-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      calMonth++;
      if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      renderGrowView(container);
    });
  }

  // Today Button
  const todayBtn = container.querySelector('#btn-cal-today');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      calYear = now.getFullYear();
      calMonth = now.getMonth();
      renderGrowView(container);
    });
  }

  // Cell presence toggle click
  container.querySelectorAll('.indian-cal-cell.active-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const dateKey = cell.dataset.dateKey;
      const dayNum = parseInt(cell.dataset.dayNum, 10);
      const festName = cell.dataset.festName;

      const nextStatus = store.toggleDatePresence(dateKey, dayNum - 1);
      
      let msg = `Updated ${dateKey} to ${nextStatus.toUpperCase()}`;
      if (festName) {
        msg += ` (${festName})`;
      }
      showToast(msg, '🗓️');
      renderGrowView(container);
    });
  });
}
