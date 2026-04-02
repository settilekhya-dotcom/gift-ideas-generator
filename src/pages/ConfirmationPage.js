import store from '../core/store.js';
import router from '../core/router.js';

export function ConfirmationPage() {
  setTimeout(attachListeners, 0);

  return `
    <div class="container page-shell py-8 confirmation-page animate-scale-up" style="max-width: 600px; text-align: center;">
      <div class="confirmation-icon-wrapper animate-fade-in" style="animation-delay: 0.1s;">
        <div class="success-icon" style="background: rgba(84, 110, 90, 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>
      
      <div class="confirmation-text animate-slide-up" style="animation-delay: 0.2s;">
        <h1 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-primary-dark); margin-bottom: 1rem;">
          Congratulations — you made it.
        </h1>
        <p style="font-size: 1.15rem; color: var(--color-text-light); line-height: 1.6; margin-bottom: 3rem;">
          You finally decided on a gift idea that feels thoughtful and right for them. 
          <br/><br/>
          Your main gifting task is complete. Take a breath and enjoy the feeling of finding something meaningful.
        </p>
      </div>

      <div class="optional-flow animate-slide-up" style="animation-delay: 0.4s; background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: left;">
        <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">Optional: Add a Personal Note</h3>
        <p style="color: var(--color-text-light); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Want to write a heartfelt card to go with the gift? We can help you draft a thoughtful note based on the details you shared. Completely optional.
        </p>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button id="btn-generate-note" class="btn btn-primary">Generate Gift Note</button>
          <button id="btn-skip" class="btn btn-secondary">Skip for now</button>
        </div>
      </div>
    </div>
  `;
}

function attachListeners() {
  const btnGenerateNote = document.getElementById('btn-generate-note');
  if (btnGenerateNote) {
    btnGenerateNote.addEventListener('click', () => {
      router.navigate('card');
    });
  }

  const btnSkip = document.getElementById('btn-skip');
  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      router.navigate('home');
    });
  }
}
