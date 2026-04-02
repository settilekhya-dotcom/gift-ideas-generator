import store from '../core/store.js';
import router from '../core/router.js';
import { Loader } from '../components/UI.js';
import { generateGiftNote } from '../core/giftNoteGenerator.js';
import { generateAvatarSvg } from '../core/avatarGenerator.js';
import { buildRecipientProfile } from '../core/recipientEngine.js';

export function GiftCardPage() {
  const state = store.get();

  if (state.isLoading) {
    return `<div class="container">${Loader(state.loadingMessage)}</div>`;
  }

  if (state.error) {
    return `<div class="container mt-8 text-center"><p style="color:red">${state.error}</p><button class="btn btn-primary" onclick="window.history.back()">Back</button></div>`;
  }

  const noteData = state.giftNote;
  const avatarSvg = state.avatarSvg;
  
  if (!noteData || !avatarSvg) {
    return `<div class="container">${Loader('Writing the perfect note...')}</div>`;
  }

  setTimeout(attachListeners, 0);

  // Generate some random confetti pieces
  let confettiHtml = '';
  for(let i=0; i<30; i++) {
    const left = Math.random() * 100;
    const animDelay = Math.random() * 2;
    const animDur = 2 + Math.random() * 3;
    const bgColors = ['var(--color-primary)', 'var(--color-primary-light)', 'var(--color-accent)'];
    const color = bgColors[Math.floor(Math.random() * bgColors.length)];
    confettiHtml += `<div class="confetti-piece" style="left: ${left}vw; animation-delay: ${animDelay}s; animation-duration: ${animDur}s; background: ${color}"></div>`;
  }

  return `
    <div class="celebration-bg">
      ${confettiHtml}
    </div>
    <div class="container page-shell py-8 gift-card-container animate-fade-in">
      <div class="page-top-nav" style="width:100%; max-width:600px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <button id="btn-return-home-top" class="btn btn-secondary">Return Home</button>
        <span style="font-size: 0.85rem; color: var(--color-text-light);">Optional Gift Note</span>
      </div>
      
      <div class="physical-card animate-slide-up" style="margin-top: var(--spacing-6);">
        <div class="avatar-wrapper animate-slide-up" style="animation-delay: 0.2s; border-radius: var(--radius-full); overflow: hidden; margin: 0 auto 1.5rem; background: var(--color-surface); box-shadow: var(--shadow-sm); padding: 12px; display: flex; justify-content: center; align-items: center; width: 120px; height: 120px;">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(state.recipientInput?.name || 'Friend')}" 
               onerror="this.outerHTML=this.getAttribute('data-fallback')" 
               data-fallback="${avatarSvg.replace(/"/g, '&quot;')}"
               style="width:100%; height:100%; object-fit:cover;" />
        </div>
        
        <div class="note-content animate-slide-up" style="animation-delay: 0.4s; font-family: var(--font-display); font-size: 1.15rem; line-height: 1.6; outline: none; border: 1px dashed transparent; transition: border 0.2s; padding: 0.5rem; cursor: text;" id="gift-note-text" contenteditable="true" onfocus="this.style.border='1px dashed var(--color-primary-light)'" onblur="this.style.border='1px dashed transparent'" title="Click to edit note">
${noteData.note}
        </div>

        <div class="copy-btn-wrapper animate-slide-up" style="animation-delay: 0.6s">
          <button id="btn-copy-note" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Note
          </button>
        </div>
      </div>

      <div class="completion-actions animate-fade-in" style="animation-delay: 1s">
        <button id="btn-new-journey" class="btn btn-primary" style="width: 100%;">
          Start a New Gift Journey
        </button>
      </div>

      <div id="copy-toast" class="copy-toast">Note copied to clipboard! ✨</div>
    </div>
  `;
}

export async function onEnterCard() {
  const state = store.get();
  
  if (state.finalBrief && !state.giftNote && !state.isLoading && !state.error) {
    try {
      const profile = buildRecipientProfile(state.recipientInput);
      
      // Generate SVG synchronously
      const svg = generateAvatarSvg(profile);
      store.set({ avatarSvg: svg });
      
      // Generate note via AI
      await generateGiftNote(profile, state.finalBrief);
      router._handleRouteChange();
    } catch(e) {
      router._handleRouteChange();
    }
  }
}

function attachListeners() {
  const btnCopy = document.getElementById('btn-copy-note');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const text = document.getElementById('gift-note-text').innerText.trim();
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      });
    });
  }

  const btnNew = document.getElementById('btn-new-journey');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      store.startNewJourney();
      router.navigate('input');
    });
  }

  const btnReturnHomeTop = document.getElementById('btn-return-home-top');
  if (btnReturnHomeTop) {
    btnReturnHomeTop.addEventListener('click', () => {
      router.navigate('home');
    });
  }
}
