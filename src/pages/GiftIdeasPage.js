import store from '../core/store.js';
import router from '../core/router.js';
import { Loader } from '../components/UI.js';
import { generateDirectionDeepDive } from '../core/directionEngine.js';
import { buildRecipientProfile } from '../core/recipientEngine.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';
import { saveJourney } from '../utils/storage.js';

export function GiftIdeasPage() {
  const state = store.get();

  if (state.isLoading) {
    return `<div class="container page-shell">${Loader(state.loadingMessage || 'Exploring direction ideas...')}</div>`;
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

  const deepDive = state.directionDeepDive;
  const directionId = state.selectedDirection;
  const direction = Object.values(GIFT_DIRECTIONS).find(d => d.id === directionId);
  const isShortlisted = store.isShortlisted(directionId);
  const profile = directionId ? buildRecipientProfile(state.recipientInput) : null;

  setTimeout(attachListeners, 0);

  if (!direction) {
    return `<div class="container page-shell">${Loader('Loading direction...')}</div>`;
  }

  return `
    <div class="container page-shell animate-fade-in ideas-page">
      <div class="page-top-nav">
        <button id="btn-back-insight" class="btn btn-secondary">← Back</button>
      </div>
      <div class="ideas-header animate-slide-up">
        <span class="direction-badge">${direction.emoji} ${direction.title}</span>
        <h2 class="ideas-title">Let's explore this path.</h2>
        ${profile?.name ? `<p class="ideas-subtitle">Tailored for ${profile.name} based on what you shared.</p>` : ''}
        ${deepDive?.approachStyle ? `<p class="ideas-approach"><strong>Gifting approach:</strong> ${deepDive.approachStyle}</p>` : ''}
        ${deepDive
          ? `<p class="ideas-message">${deepDive.whatItCommunicates}</p>`
          : `<div class="ideas-header-skeleton">
              <div class="skeleton-line ideas-skeleton-line-wide"></div>
              <div class="skeleton-line ideas-skeleton-line-narrow"></div>
            </div>`
        }
      </div>

      <div class="ideas-grid mt-8">
        <div class="insight-block animate-slide-up" style="animation-delay: 0.1s">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Why this works for them
          </h3>
          <p>${deepDive ? deepDive.whyItWorks : `<div class="skeleton-line"></div><div class="skeleton-line" style="width:80%"></div>`}</p>
        </div>

        <div class="insight-block animate-slide-up" style="animation-delay: 0.2s">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            How to make it personal
          </h3>
          <ul class="idea-list">
            ${deepDive ? deepDive.howToPersonalize.map(idea => `<li>${idea}</li>`).join('') : `<li><div class="skeleton-line"></div></li><li><div class="skeleton-line"></div></li>`}
          </ul>
        </div>

        <div class="insight-block full-width animate-slide-up" style="animation-delay: 0.3s">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            Gift concepts to consider
          </h3>
          <div class="gift-concepts-grid">
            ${deepDive ? deepDive.whatGiftsFit.map(gift => `
              <div class="gift-concept-card">
                ${gift}
              </div>
            `).join('') : [1,2,3,4].map(() => `<div class="skeleton-line ideas-skeleton-card"></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="action-bar animate-slide-up" style="animation-delay: 0.4s">
        <div class="action-bar-text">
          <h3>What do you think?</h3>
          <p>You can shortlist this to compare, or proceed directly.</p>
        </div>
        <div class="action-buttons" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button id="btn-explore-others" class="btn btn-secondary">Explore Others</button>
          <button id="btn-shortlist" class="btn ${isShortlisted ? 'btn-secondary' : 'btn-secondary'}">
            ${isShortlisted ? 'Saved to Shortlist ✓' : 'Add to Shortlist'}
          </button>
          <button id="btn-proceed" class="btn btn-primary">
            Proceed with this direction →
          </button>
        </div>
      </div>
      
      ${store.get('shortlist').length > 0 ? `
        <div class="text-center mt-8 animate-fade-in ideas-compare-cta" style="animation-delay: 0.5s">
          <button id="btn-compare" class="btn btn-primary">Compare Shortlist (${store.get('shortlist').length}) →</button>
        </div>
      ` : ''}
    </div>
  `;
}

export async function onEnterIdeas() {
  const state = store.get();
  
  if (state.selectedDirection) {
    const existingShortlistMatch = state.shortlist.find(i => i.directionId === state.selectedDirection);
    
    if (state.directionDeepDive && state.selectedDirection === state.directionDeepDive._forDirection) {
      return; 
    }

    if (existingShortlistMatch) {
      store.set({ directionDeepDive: existingShortlistMatch.deepDive });
      router._handleRouteChange();
      return;
    }

    if (!state.isLoading && !state.error) {
      try {
        const profile = buildRecipientProfile(state.recipientInput);
        
        // Force immediate re-render to show loader
        store.set({ isLoading: true, loadingMessage: 'Exploring direction ideas...' });
        router._handleRouteChange();

        const deepDive = await generateDirectionDeepDive(profile, state.recipientInsight, state.selectedDirection);
        deepDive._forDirection = state.selectedDirection;
        
        store.set({ directionDeepDive: deepDive, isLoading: false, loadingMessage: '' });
        router._handleRouteChange();
      } catch (e) {
        console.warn('Direction generation failed:', e);
        store.set({ isLoading: false, error: e.message || 'Failed to explore this direction.' });
        router._handleRouteChange();
      }
    }
  } else {
    router.navigate('insight');
  }
}

function attachListeners() {
  const btnBackInsight = document.getElementById('btn-back-insight');
  if (btnBackInsight) {
    btnBackInsight.addEventListener('click', () => {
      router.navigate('insight');
    });
  }

  const btnExploreOthers = document.getElementById('btn-explore-others');
  if (btnExploreOthers) {
    btnExploreOthers.addEventListener('click', () => {
      store.set({ selectedDirection: null, directionDeepDive: null });
      router.navigate('insight');
    });
  }

  const btnShortlist = document.getElementById('btn-shortlist');
  if (btnShortlist) {
    btnShortlist.addEventListener('click', () => {
      const state = store.get();
      const dirId = state.selectedDirection;
      
      if (store.isShortlisted(dirId)) {
        store.removeFromShortlist(dirId);
      } else {
        store.addToShortlist(dirId, state.directionDeepDive);
      }
      
      saveJourney(store.get());
      router._handleRouteChange();
    });
  }

  const btnProceed = document.getElementById('btn-proceed');
  if (btnProceed) {
    btnProceed.addEventListener('click', () => {
      const state = store.get();
      const dirId = state.selectedDirection;
      
      // Auto-shortlist if not already, so it appears as an alternative option on the brief page
      if (!store.isShortlisted(dirId)) {
        store.addToShortlist(dirId, state.directionDeepDive);
        saveJourney(store.get());
      }
      
      store.set({ finalBrief: null }); // Ensure a fresh brief is generated for this specific path
      router.navigate('brief');
    });
  }

  const btnCompare = document.getElementById('btn-compare');
  if (btnCompare) {
    btnCompare.addEventListener('click', () => {
      router.navigate('compare');
    });
  }
}
