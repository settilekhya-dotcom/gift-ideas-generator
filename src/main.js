import './styles/globals.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/homepage.css';
import './styles/profiler.css';
import './styles/insight.css';
import './styles/ideas.css';
import './styles/compare.css';
import './styles/brief.css';
import './styles/card.css';

import router from './core/router.js';
import store from './core/store.js';
import { Header, initHeader } from './components/Header.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { RecipientInputPage } from './pages/RecipientInputPage.js';
import { SummaryDirectionsPage, onEnterSummary } from './pages/SummaryDirectionsPage.js';
import { GiftIdeasPage, onEnterIdeas } from './pages/GiftIdeasPage.js';
import { ComparePage, onEnterCompare } from './pages/ComparePage.js';
import { FinalBriefPage, onEnterBrief } from './pages/FinalBriefPage.js';
import { ConfirmationPage } from './pages/ConfirmationPage.js';
import { GiftCardPage, onEnterCard } from './pages/GiftCardPage.js';

// Utils
import { loadJourney, getApiKey, saveJourney } from './utils/storage.js';

// Hydrate store from LocalStorage
const savedJourney = loadJourney();
if (savedJourney) {
  // Only restore if there's actually meaningful data
  if (savedJourney.recipientInput?.name) {
    store.set({ ...savedJourney, isLoading: false, error: null });
  }
}

const savedApiKey = getApiKey();
if (savedApiKey) {
  // Keep startup source consistent with Header save flow
  store.set({ apiKey: savedApiKey });
}

// Update progress bar helper
function updateProgressBar(path) {
  const bar = document.getElementById('app-progress-bar');
  const container = document.querySelector('.progress-container');
  if (!bar) return;
  
  if (path === 'home') {
    if (container) container.style.display = 'none';
  } else {
    if (container) container.style.display = 'block';
  }
  
  const progressMap = {
    'home': '0%',
    'input': '15%',
    'insight': '40%',
    'ideas': '60%',
    'compare': '85%',
    'brief': '95%',
    'card': '100%'
  };

  bar.style.width = progressMap[path] || '0%';
}

// 1. Initial Render (Header)
document.getElementById('header-root').innerHTML = Header();
initHeader();

// 2. Register Routes
router.register('home', HomePage, { 
  title: 'Home',
  onEnter: () => store.set({ currentStep: 'home' })
});

router.register('input', RecipientInputPage, {
  title: 'About Them',
  onEnter: () => store.set({ currentStep: 'input' })
});

router.register('insight', SummaryDirectionsPage, {
  title: 'AI Insights',
  onEnter: async () => {
    store.set({ currentStep: 'insight' });
    await onEnterSummary();
  }
});

router.register('ideas', GiftIdeasPage, {
  title: 'Gift Ideas',
  onEnter: async () => {
    store.set({ currentStep: 'ideas' });
    await onEnterIdeas();
  }
});

// Decision
router.register('compare', ComparePage, {
  title: 'Compare Ideas',
  onEnter: async () => {
    store.set({ currentStep: 'compare' });
    await onEnterCompare();
  }
});

router.register('brief', FinalBriefPage, { 
  title: 'Final Brief',
  onEnter: async () => {
    store.set({ currentStep: 'brief' });
    await onEnterBrief();
  }
});

router.register('confirmation', ConfirmationPage, {
  title: 'Decision Confirmed',
  onEnter: () => store.set({ currentStep: 'confirmation' })
});

router.register('card', GiftCardPage, {
  title: 'Gift Card',
  onEnter: async () => {
    store.set({ currentStep: 'card' });
    await onEnterCard();
  }
});

// Listen for navigation to update progress bar
router.onAfterNavigate = (path) => {
  updateProgressBar(path);
};

// Global error catcher (reset loading state if something throws completely outside)
window.addEventListener('unhandledrejection', (event) => {
  store.set({ isLoading: false, error: event.reason?.message || "An unexpected error occurred." });
});

// 3. Initialize Router
// Start routing based on hash, or default to home. 
// If there is an active journey, we might want to drop them on the right step, but hash-routing usually wins.
router.init('app-root');
