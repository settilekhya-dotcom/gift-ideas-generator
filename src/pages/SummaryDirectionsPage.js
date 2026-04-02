import store from '../core/store.js';
import router from '../core/router.js';
import { Loader } from '../components/UI.js';
import { generateInsight } from '../core/insightGenerator.js';
import { buildRecipientProfile, getDirectionAffinities } from '../core/recipientEngine.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';

export function SummaryDirectionsPage() {
  const state = store.get();
  
  if (state.isLoading || !state.recipientInsight) {
    return `
      <div class="container page-shell animate-fade-in" style="min-height: 70vh; display: flex; align-items: center; justify-content: center;">
        ${Loader(state.loadingMessage || 'Processing brief...')}
      </div>
    `;
  }

  if (state.error) {
    return `
      <div class="container mt-8 text-center">
        <h2>Oops, something went wrong</h2>
        <p style="color:red" class="mt-4">${state.error}</p>
        <button class="btn btn-primary mt-4" onclick="window.history.back()">Go Back & Try Again</button>
      </div>
    `;
  }

  const profile = buildRecipientProfile(state.recipientInput);
  const affinities = getDirectionAffinities(profile);

  // Wait for tick to attach events
  setTimeout(attachListeners, 0);

  return `
    <div class="container page-shell insight-page animate-fade-in">
      <div class="page-top-nav">
        <button id="btn-back-input" class="btn btn-secondary">← Back</button>
      </div>
      <div class="insight-header">
        <h2 class="animate-slide-up">To ${profile.name || 'them'}, with thought.</h2>
        <p class="step-subtitle animate-slide-up" style="animation-delay:0.1s">We've identified what makes them unique and how to express it.</p>
      </div>


      <h3 class="mt-8 text-center animate-slide-up" style="animation-delay:0.3s">Where do you want to take this?</h3>
      <p class="text-center" style="color:var(--color-text-light)">Explore one of these tailored gifting directions.</p>

      <div class="directions-grid">
        ${Object.values(GIFT_DIRECTIONS).map((dir, i) => `
          <div class="direction-card card animate-slide-up" data-id="${dir.id}" style="animation-delay:${0.4 + (i * 0.1)}s" data-affinity="${affinities[dir.id] > 0.8 ? 'high' : 'normal'}">
            <div class="affinity-badge">High Match</div>
            <div class="direction-emoji">${dir.emoji}</div>
            <h4 class="direction-title">${dir.title}</h4>
            <div class="direction-tagline">${dir.tagline}</div>
            <p class="direction-desc">${dir.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export async function onEnterSummary() {
  const state = store.get();
  // Generate insight only if it doesn't already exist
  if (!state.recipientInsight && !state.isLoading && !state.error) {
    try {
      const profile = buildRecipientProfile(state.recipientInput);
      await generateInsight(profile);
      router._handleRouteChange(); // Re-render with new data
    } catch (e) {
      router._handleRouteChange(); // Re-render with error
    }
  }
}

function attachListeners() {
  const btnBack = document.getElementById('btn-back-input');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      router.navigate('input');
    });
  }

  document.querySelectorAll('.direction-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      store.set({ selectedDirection: id });
      router.navigate('ideas');
    });
  });
}
