import store from '../core/store.js';
import router from '../core/router.js';
import { Loader } from '../components/UI.js';
import { compareDirections } from '../core/compareEngine.js';
import { buildRecipientProfile } from '../core/recipientEngine.js';
import { COMPARISON_CRITERIA, GIFT_DIRECTIONS } from '../utils/constants.js';

export function ComparePage() {
  const state = store.get();
  const shortlist = state.shortlist;

  if (shortlist.length < 2) {
    setTimeout(() => {
      document.getElementById('btn-explore')?.addEventListener('click', () => router.navigate('insight'));
    }, 0);
    return `
      <div class="container py-8 animate-fade-in">
        <div class="shortlist-empty">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h2>Not enough to compare</h2>
          <p class="mt-4" style="color:var(--color-text-light);">You need at least 2 shortlisted directions to compare them side-by-side.</p>
          <button id="btn-explore" class="btn btn-primary mt-8">Explore Directions</button>
        </div>
      </div>
    `;
  }

  if (state.isLoading) {
    return `<div class="container">${Loader(state.loadingMessage)}</div>`;
  }

  if (state.error) {
    return `
      <div class="container mt-8 text-center">
        <h2>Oops, something went wrong</h2>
        <p style="color:red" class="mt-4">${state.error}</p>
        <button class="btn btn-primary mt-4" onclick="window.history.back()">Go Back</button>
      </div>
    `;
  }

  const result = state.comparisonResult;
  if (!result) {
    return `<div class="container">${Loader('Setting up comparison...')}</div>`;
  }

  setTimeout(attachListeners, 0);

  return `
    <div class="container page-shell py-8 animate-fade-in">
      <div class="page-top-nav">
        <button id="btn-back-insight" class="btn btn-secondary">← Back</button>
      </div>
      <div class="compare-header animate-slide-up">
        <h2>Side-by-Side Comparison</h2>
        <p style="color:var(--color-text-light); max-width: 600px; margin: 8px auto 0;">
          Our AI has evaluated your shortlist against ${state.recipientInput.name || 'their'} unique profile.
        </p>
      </div>

      <div class="compare-grid mt-8">
        ${shortlist.map((item, idx) => {
          const dir = Object.values(GIFT_DIRECTIONS).find(d => d.id === item.directionId);
          const isBest = result.bestFitId === dir.id;
          const scores = result.scores[dir.id];
          
          return `
            <div class="compare-column ${isBest ? 'recommended-fit' : ''} animate-slide-up" style="animation-delay: ${0.1 * idx}s">
              
              <div class="compare-col-header">
                <div class="compare-emoji">${dir.emoji}</div>
                <h3>${dir.title}</h3>
              </div>
              
              <div class="compare-body">
                <div class="scores-container">
                  ${renderScoreBar('Emotional Fit', scores.emotionalFit)}
                  ${renderScoreBar('Personalization', scores.personalizationPotential)}
                  ${renderScoreBar('Effort & Thought', scores.effortLevel)}
                  ${renderScoreBar('Surprise Factor', scores.surpriseFactor)}
                  ${renderScoreBar('Meaningfulness', scores.meaningfulness)}
                </div>

                <div class="score-overall">
                  <div class="score-label">Overall Match</div>
                  <div class="overall-number">${scores.overall}<span style="font-size:1rem; color:var(--color-text-light); font-weight:400;">/10</span></div>
                </div>
              </div>

              <div class="compare-footer flex-footer">
                ${isBest ? `
                  <div class="gentle-recommendation">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span>This option is the safest match based on the details captured so far.</span>
                  </div>
                ` : '<div class="gentle-recommendation placeholder-rec"></div>'}
                <button class="btn btn-primary btn-select" data-id="${dir.id}" style="width: 100%;">
                  Choose This Direction
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="decision-tip-box animate-slide-up" style="animation-delay: 0.5s">
        <h4 style="display:flex; align-items:center; gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Advice from The Gift Brief
        </h4>
        <p class="mt-2" style="font-size:0.95rem;">${result.decisionTip}</p>
      </div>

      <div class="text-center mt-8 mb-8 animate-fade-in">
        <button id="btn-back-ideas" class="btn btn-secondary">Explore More Directions</button>
      </div>
    </div>
  `;
}

function renderScoreBar(label, score) {
  const safeScore = score || 5;
  const percentage = (safeScore / 10) * 100;
  return `
    <div class="score-row">
      <div class="score-label">
        <span>${label}</span>
        <span>${safeScore}/10</span>
      </div>
      <div class="score-bar-bg">
        <div class="score-bar-fill" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

export async function onEnterCompare() {
  const state = store.get();
  
  if (state.shortlist.length >= 2 && !state.comparisonResult && !state.isLoading && !state.error) {
    try {
      const profile = buildRecipientProfile(state.recipientInput);
      await compareDirections(profile, state.recipientInsight, state.shortlist);
      router._handleRouteChange();
    } catch (e) {
      router._handleRouteChange();
    }
  }
}

function attachListeners() {
  document.querySelectorAll('.btn-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const dirId = btn.dataset.id;
      const match = store.get('shortlist').find(item => item.directionId === dirId);
      // When a user commits to a direction from compare, we set it as selected
      // and navigate to the brief logic
      store.set({ selectedDirection: dirId, directionDeepDive: match?.deepDive || null });
      router.navigate('brief');
    });
  });

  const btnBackInsight = document.getElementById('btn-back-insight');
  if (btnBackInsight) {
    btnBackInsight.addEventListener('click', () => {
      router.navigate('insight');
    });
  }

  const btnBack = document.getElementById('btn-back-ideas');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      router.navigate('insight');
    });
  }
}
