import router from '../core/router.js';
import store from '../core/store.js';

export function HomePage() {
  setTimeout(() => {
    initCarousel();
    const startBtn = document.getElementById('btn-start-journey');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        store.startNewJourney();
        router.navigate('input');
      });
    }
  }, 0);

  return `
    <div class="home-page container">
      <section class="hero-section">
        
        <!-- Left: Relatable Carousel -->
        <div class="hero-carousel animate-slide-up" style="animation-delay: 0.1s">
          <div class="carousel-container">
            <div class="carousel-card active">
              <div style="color: var(--color-primary); margin-bottom: 1rem;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 class="carousel-title">No more generic gift guides.</h3>
              <p class="carousel-desc">Stop scrolling through listicles. Find a gift that feels tailored specifically to them.</p>
            </div>
            <div class="carousel-card">
              <div style="color: var(--color-primary); margin-bottom: 1rem;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <h3 class="carousel-title">A gift that says you care.</h3>
              <p class="carousel-desc">You're not just trying to buy something. You want it to reflect your effort and understanding.</p>
            </div>
            <div class="carousel-card">
              <div style="color: var(--color-primary); margin-bottom: 1rem;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
              <h3 class="carousel-title">Stop second-guessing your ideas.</h3>
              <p class="carousel-desc">When every idea feels "okay", we help you confidently choose the one that feels right.</p>
            </div>
            <div class="carousel-card">
              <div style="color: var(--color-primary); margin-bottom: 1rem;">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 class="carousel-title">From vague thoughts to clarity.</h3>
              <p class="carousel-desc">Turn your scattered thoughts about someone into a structured, thoughtful gifting decision.</p>
            </div>
          </div>
          
          <div class="carousel-controls">
            <div class="carousel-dots">
              <div class="carousel-dot active" data-idx="0"></div>
              <div class="carousel-dot" data-idx="1"></div>
              <div class="carousel-dot" data-idx="2"></div>
              <div class="carousel-dot" data-idx="3"></div>
            </div>
          </div>
        </div>

        <!-- Right: Typography & CTA -->
        <div class="hero-content animate-slide-up" style="animation-delay: 0.3s">
          <div class="hero-badge">Not another shopping list</div>
          <h1 class="hero-title">
            Find gift ideas that actually<br/>feel like <em>them</em>.
          </h1>
          <p class="hero-subtitle">
            A guided gifting companion that helps you understand the person, explore meaningful gift directions, and choose an idea with confidence.
          </p>
          
          <div class="hero-actions" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <button id="btn-start-journey" class="btn btn-primary btn-lg">Start Gift Journey</button>
            <button id="btn-scroll-how" class="btn btn-secondary btn-lg">How it works</button>
            <div style="flex-basis: 100%; height: 0;"></div>
            <p class="hero-disclaimer" style="margin-top: 0.5rem;">
              No generic suggestions. No overwhelm. <br/> Just thoughtful decisions.
            </p>
          </div>
        </div>

      </section>
    </div>

    <!-- How It Works Reference -->
    <section id="how-it-works" class="how-it-works container" style="margin-top: 4rem; text-align: center;">
      <h2 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-primary-dark);">How it works</h2>
      <p style="color: var(--color-text); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">A simple 4-step flow that helps users move from vague thoughts to a clear gifting decision</p>
      
      <div class="steps-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 4rem;">
         <div class="step-card">
            <div class="step-num">1</div>
            <h3 class="step-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; font-family: var(--font-sans);">Understand the person</h3>
            <p class="step-desc" style="font-size: 0.9rem;">Answer thoughtful questions about who they are, what they love, and what matters to them.</p>
         </div>
         <div class="step-card">
            <div class="step-num">2</div>
            <h3 class="step-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; font-family: var(--font-sans);">Explore gift directions</h3>
            <p class="step-desc" style="font-size: 0.9rem;">Discover curated gifting paths based on their personality, not just their hobbies.</p>
         </div>
         <div class="step-card">
            <div class="step-num">3</div>
            <h3 class="step-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; font-family: var(--font-sans);">Dive into specific ideas</h3>
            <p class="step-desc" style="font-size: 0.9rem;">Get detailed, personalized gift concepts tailored perfectly to the direction you choose.</p>
         </div>
         <div class="step-card">
            <div class="step-num">4</div>
            <h3 class="step-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; font-family: var(--font-sans);">Decide with confidence</h3>
            <p class="step-desc" style="font-size: 0.9rem;">Generate a clear brief to guide your shopping, or let us write the perfect gift note.</p>
         </div>
      </div>
    </section>

    <!-- Edge-to-Edge Banner -->
    <section class="banner-section">
      <div class="container">
        <h3 style="font-family: var(--font-display); font-size: clamp(1.5rem, 5vw, 2rem); margin-bottom: 1.5rem; color: var(--color-primary-dark);">Ready to find a gift that feels personal?</h3>
        <button onclick="document.getElementById('btn-start-journey')?.click()" class="btn btn-primary btn-lg" style="box-shadow: none; width: 100%; max-width: 300px;">Start Gift Journey</button>
      </div>
    </section>
  `;
}

function initCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;

  const scrollBtn = document.getElementById('btn-scroll-how');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
    });
  }

  let currentIdx = 0;
  
  function setCard(idx) {
    cards.forEach((c, i) => {
      c.classList.remove('active', 'prev', 'next');
      if (i === idx) {
        c.classList.add('active');
      } else if (i === (idx - 1 + cards.length) % cards.length) {
        c.classList.add('prev');
      } else if (i === (idx + 1) % cards.length) {
        c.classList.add('next');
      }
    });

    dots.forEach((d, i) => {
      if (i === idx) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
    
    currentIdx = idx;
  }

  // Initialize
  setCard(0);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      setCard(parseInt(e.target.dataset.idx));
      resetInterval();
    });
  });

  let intervalId = setInterval(() => {
    let nextIdx = (currentIdx + 1) % cards.length;
    setCard(nextIdx);
  }, 3500);

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      let nextIdx = (currentIdx + 1) % cards.length;
      setCard(nextIdx);
    }, 3500);
  }
}
