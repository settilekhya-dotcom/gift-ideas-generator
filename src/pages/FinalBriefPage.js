import store from '../core/store.js';
import router from '../core/router.js';
import { Loader } from '../components/UI.js';
import { generateFinalBrief } from '../core/giftNoteGenerator.js';
import { buildRecipientProfile } from '../core/recipientEngine.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';

export function FinalBriefPage() {
  const state = store.get();

  if (state.isLoading) {
    return `<div class="container">${Loader(state.loadingMessage)}</div>`;
  }

  if (state.error) {
    return `<div class="container mt-8 text-center"><p style="color:red">${state.error}</p><button class="btn btn-primary" onclick="window.history.back()">Back</button></div>`;
  }

  const brief = state.finalBrief;
  if (!brief) {
    return `<div class="container">${Loader('Processing brief...')}</div>`;
  }

  setTimeout(attachListeners, 0);

  return `
    <div class="container page-shell py-8 brief-container animate-fade-in">
      <div class="page-top-nav">
        <button id="btn-back-compare-top" class="btn btn-secondary">← Back</button>
      </div>
      <div class="brief-header animate-slide-up">
        <h2>A gift that shows you truly know them</h2>
        <p style="color:var(--color-text-light)">Here is the strongest suggestion based on what you shared.</p>
      </div>

      <div class="brief-card animate-slide-up" style="animation-delay: 0.1s">
        <h3 class="brief-headline">${brief.headline}</h3>
        
        <p class="brief-summary">${brief.summary}</p>

        <div class="highlight-box" style="margin-bottom: 1rem;">
          <div class="highlight-title">Why this is the strongest direction</div>
          <div class="highlight-content">${brief.whyStrongestDirection || 'This direction is the most emotionally aligned and specific fit for them.'}</div>
        </div>
        
        <div class="brief-highlights">
          <div class="highlight-box">
            <div class="highlight-title">Top Idea to Consider</div>
            <div class="highlight-content">${brief.topIdea}</div>
          </div>
          <div class="highlight-box">
            <div class="highlight-title">The Personal Touch</div>
            <div class="highlight-content">${brief.personalTouch}</div>
          </div>
        </div>

        <div class="brief-highlights" style="margin-top: 1rem; padding-top: 1rem;">
          <div class="highlight-box">
            <div class="highlight-title">What to look for while shopping</div>
            <ul class="idea-list">
              ${(brief.shoppingCompass || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          <div class="highlight-box">
            <div class="highlight-title">What to avoid</div>
            <ul class="idea-list">
              ${(brief.whatToAvoid || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="highlight-box" style="margin-top: 1rem;">
          <div class="highlight-title">Make it more thoughtful</div>
          <ul class="idea-list">
            ${(brief.thoughtfulUpgrade || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div class="mt-8 text-center" style="color:var(--color-text-light); font-size:0.9rem;">
          <i>${brief.occasionNote}</i>
        </div>
      </div>

      <div class="actions-footer animate-slide-up text-center flex-column" style="animation-delay: 0.3s; margin-top:2rem;">
        <button id="btn-lock-decision" class="btn btn-primary btn-lg" style="width:100%; max-width:400px; margin: 0 auto;">Select Final Gift Idea</button>
      </div>

      ${state.shortlist.length > 1 ? `
        <div class="alternative-ideas animate-slide-up" style="animation-delay: 0.4s; margin-top: 4rem;">
          <h4 style="text-align:center; color:var(--color-text-light); margin-bottom: 1rem;">Other directions you explored</h4>
          <div class="ideas-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            ${state.shortlist.filter(item => item.directionId !== state.selectedDirection).map(item => {
              const dir = Object.values(GIFT_DIRECTIONS).find(d => d.id === item.directionId);
              return `
                <div class="card" style="padding:1rem;">
                  <div style="font-size:2rem; margin-bottom:0.5rem;">${dir.emoji}</div>
                  <h5 style="margin-bottom:0.25rem;">${dir.title}</h5>
                  <p style="font-size:0.85rem; color:var(--color-text-light); margin-bottom:1rem;">${dir.tagline}</p>
                  <button class="btn btn-secondary btn-switch" data-id="${dir.id}" style="font-size:0.8rem; padding:0.4rem 0.8rem; width:100%;">View This Brief Instead</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export async function onEnterBrief() {
  const state = store.get();
  
  if (!state.selectedDirection) {
    if (state.shortlist.length > 0) {
      store.set({ 
        selectedDirection: state.shortlist[0].directionId, 
        directionDeepDive: state.shortlist[0].deepDive,
        finalBrief: null 
      });
      router._handleRouteChange();
      return;
    } else {
      router.navigate('insight');
      return;
    }
  }

  // Safety: if insight is missing (e.g., refresh), go back to generate it
  if (!state.recipientInsight) {
    router.navigate('insight');
    return;
  }

  const briefMatches = state.finalBrief?.direction?.id === state.selectedDirection;
  
  if (state.selectedDirection && (!state.finalBrief || !briefMatches) && !state.isLoading && !state.error) {
    try {
      const profile = buildRecipientProfile(state.recipientInput);
      let deepDive = state.directionDeepDive;
      
      if (deepDive?._forDirection !== state.selectedDirection) {
        const item = state.shortlist.find(i => i.directionId === state.selectedDirection);
        if (item) deepDive = item.deepDive;
      }
      
      // Update store and tell the router to re-render to the 'Thinking' state
      store.set({ isLoading: true, loadingMessage: 'Preparing your final brief...' });
      router._handleRouteChange();
      
      const brief = await generateFinalBrief(profile, state.recipientInsight, state.selectedDirection, deepDive);
      
      // Clear loading state and set result
      store.set({ finalBrief: brief, isLoading: false, loadingMessage: '', error: null });
      router._handleRouteChange();
    } catch(e) {
      console.warn('Brief generation failed:', e);
      store.set({ isLoading: false, error: e.message || 'Brief generation failed.' });
      router._handleRouteChange();
    }
  }
}

function attachListeners() {
  const btnBackTop = document.getElementById('btn-back-compare-top');
  if (btnBackTop) {
    btnBackTop.addEventListener('click', () => {
      router.navigate('compare');
    });
  }

  const btnLockDecision = document.getElementById('btn-lock-decision');
  if (btnLockDecision) {
    btnLockDecision.addEventListener('click', () => {
      router.navigate('confirmation');
    });
  }

  document.querySelectorAll('.btn-switch').forEach(btn => {
    btn.addEventListener('click', () => {
      const dirId = btn.dataset.id;
      const state = store.get();
      const match = state.shortlist.find(item => item.directionId === dirId);
      store.set({ selectedDirection: dirId, directionDeepDive: match?.deepDive || null, finalBrief: null });
      router.navigate('brief'); // re-enters brief
    });
  });
}
