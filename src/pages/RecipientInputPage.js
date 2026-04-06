import store from '../core/store.js';
import router from '../core/router.js';
import { StepIndicator } from '../components/UI.js';
import { 
  PERSONALITY_TRAITS, 
  INTEREST_CATEGORIES, 
  RELATIONSHIP_TYPES, 
  CLOSENESS_LEVELS, 
  OCCASIONS, 
  GIFT_INTENTS,
  PROFILER_STEPS 
} from '../utils/constants.js';
import { validateRecipientInput } from '../core/recipientEngine.js';
import { saveJourney } from '../utils/storage.js';

export function RecipientInputPage() {
  const state = store.get();
  const stepIdx = state.profilerStep || 0;
  const input = state.recipientInput;

  // Wait for next tick to attach DOM listeners
  setTimeout(attachListeners, 0);

  return `
    <div class="container profiler-container">
      ${StepIndicator(stepIdx, 6)}
      
      <div class="step-header">
        <h2>${PROFILER_STEPS[stepIdx].label}</h2>
        <p class="step-subtitle">${PROFILER_STEPS[stepIdx].description}</p>
      </div>

      <div class="step-content">
        ${renderStepContent(stepIdx, input)}
      </div>

      <div class="form-actions">
        <button id="btn-prev" class="btn btn-secondary">
          ${stepIdx === 0 ? 'Back to Home' : 'Back'}
        </button>
        <button id="btn-next" class="btn btn-primary">
          ${stepIdx === 5 ? 'Get Insights ✨' : 'Continue'}
        </button>
      </div>
      <div id="form-error" style="color: #d32f2f; text-align: right; margin-top: 8px; min-height: 20px;"></div>
    </div>
  `;
}

function renderStepContent(stepIdx, input) {
  switch (stepIdx) {
    case 0: return renderPersonality(input);
    case 1: return renderInterests(input);
    case 2: return renderRelationship(input);
    case 3: return renderOccasion(input);
    case 4: return renderMemory(input);
    case 5: return renderIntent(input);
    default: return '';
  }
}

function renderPersonality(input) {
  const selected = input.personality || [];
  const categories = {
    temperament: 'Temperament',
    social: 'Social Output',
    values: 'Core Values'
  };

  return Object.entries(categories).map(([catId, catLabel]) => `
    <div class="chip-group">
      <div class="chip-group-label" style="display: flex; justify-content: space-between; align-items: baseline;">
        <span>${catLabel}</span>
        <span style="font-size: 0.8rem; font-weight: normal; color: var(--color-text-light);">Select up to 2</span>
      </div>
      <div class="selection-grid">
        ${PERSONALITY_TRAITS.filter(t => t.category === catId).map(t => `
          <div class="chip trait-chip ${selected.includes(t.id) ? 'selected' : ''}" data-id="${t.id}">
            ${t.label} 
            ${selected.includes(t.id) ? '✓' : '+'}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <div class="form-group mb-4" style="margin-top: 2rem;">
      <label class="form-label" style="font-size: 0.95rem;">Any other traits we missed?</label>
      <input type="text" id="input-custom-personality" class="form-input" style="padding: 10px; max-width: 400px;" placeholder="e.g. loves dad jokes" value="${input.customPersonality || ''}" />
    </div>
  `;
}

function renderInterests(input) {
  const selected = input.interests || [];
  
  return INTEREST_CATEGORIES.map(cat => `
    <div class="chip-group">
      <div class="chip-group-label" style="display: flex; justify-content: space-between; align-items: baseline;">
        <span>${cat.label}</span>
        <span style="font-size: 0.8rem; font-weight: normal; color: var(--color-text-light);">Select up to 2</span>
      </div>
      <div class="selection-grid">
        ${cat.interests.map(interest => `
          <div class="chip interest-chip ${selected.includes(interest) ? 'selected' : ''}" data-val="${interest}">
            ${interest}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <div class="form-group mb-4" style="margin-top: 2rem;">
      <label class="form-label" style="font-size: 0.95rem;">Any other specific interests or hobbies?</label>
      <input type="text" id="input-custom-interests" class="form-input" style="padding: 10px; max-width: 400px;" placeholder="e.g. vintage watches, knitting" value="${input.customInterests || ''}" />
    </div>
  `;
}

function renderRelationship(input) {
  return `
    <div class="form-group">
      <label class="form-label">First, what is their name?</label>
      <input type="text" id="input-name" class="form-input" placeholder="e.g. Sarah" value="${input.name || ''}" />
    </div>

    <label class="form-label mt-8">What is their gender? (For a better avatar)</label>
    <div class="radio-grid mb-4" style="grid-template-columns: repeat(3, 1fr);">
      <div class="radio-card gender-card ${input.gender === 'male' ? 'selected' : ''}" data-gender="male">
        <span>👨 Male</span>
      </div>
      <div class="radio-card gender-card ${input.gender === 'female' ? 'selected' : ''}" data-gender="female">
        <span>👩 Female</span>
      </div>
      <div class="radio-card gender-card ${input.gender === 'other' ? 'selected' : ''}" data-gender="other">
        <span>👤 Other</span>
      </div>
    </div>

    ${input.gender === 'other' ? `
      <div class="form-group mb-8">
        <label class="form-label" style="font-size: 0.95rem;">Please specify</label>
        <input type="text" id="input-custom-gender" class="form-input" style="padding: 10px; max-width: 400px;" placeholder="e.g. Non-binary" value="${input.customGender || ''}" />
      </div>
    ` : ''}
    
    <label class="form-label mt-4">What is your relationship to them?</label>
    <div class="radio-grid mb-8">
      ${RELATIONSHIP_TYPES.map(rel => `
        <div class="radio-card rel-card ${input.relationship === rel.id ? 'selected' : ''}" data-id="${rel.id}">
          <span style="font-size: 1.5rem">${rel.icon}</span>
          <span>${rel.label}</span>
        </div>
      `).join('')}
    </div>

    ${input.relationship === 'other' ? `
      <div class="form-group mb-8">
        <label class="form-label" style="font-size: 0.95rem;">Please specify your relationship</label>
        <input type="text" id="input-custom-relationship" class="form-input" style="padding: 10px; max-width: 400px;" placeholder="e.g. Neighbor, Teacher" value="${input.customRelationship || ''}" />
      </div>
    ` : ''}

    <label class="form-label">How close are you?</label>
    <div class="radio-grid">
      ${CLOSENESS_LEVELS.map(cl => `
        <div class="radio-card close-card ${input.closeness === cl.id ? 'selected' : ''}" data-id="${cl.id}">
          <span>${cl.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderOccasion(input) {
  return `
    <div class="radio-grid">
      ${OCCASIONS.map(occ => `
        <div class="radio-card occ-card ${input.occasion === occ.id ? 'selected' : ''}" data-id="${occ.id}">
          <span style="font-size: 1.5rem">${occ.icon}</span>
          <span>${occ.label}</span>
        </div>
      `).join('')}
    </div>

    ${input.occasion === 'other' ? `
      <div class="form-group mt-8">
        <label class="form-label" style="font-size: 0.95rem;">Please specify the occasion</label>
        <input type="text" id="input-custom-occasion" class="form-input" style="padding: 10px; max-width: 400px;" placeholder="e.g. New Job, Retiring" value="${input.customOccasion || ''}" />
      </div>
    ` : ''}
  `;
}

function renderMemory(input) {
  return `
    <div class="form-group">
      <label class="form-label">Share a brief memory or inside joke (Optional but highly recommended)</label>
      <p style="color: var(--color-text-light); font-size: 0.9rem; margin-bottom: 12px;">This helps our AI understand the unique texture of your relationship.</p>
      <textarea id="input-memory" class="form-textarea" placeholder="e.g. That time we got lost in Kyoto and ended up at that amazing tiny ramen shop...">${input.sharedMemory || ''}</textarea>
    </div>
  `;
}

function renderIntent(input) {
  const selected = input.giftIntent || [];
  return `
    <div class="radio-grid" style="grid-template-columns: 1fr;">
      ${GIFT_INTENTS.map(intent => `
        <div class="radio-card intent-card ${selected.includes(intent.id) ? 'selected' : ''}" data-id="${intent.id}">
          <span style="font-size: 1.5rem">${intent.icon}</span>
          <span>${intent.label}</span>
          <span style="margin-left:auto">${selected.includes(intent.id) ? '✓' : ''}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Interactivity & Store Binding
function attachListeners() {
  const state = store.get();
  const stepIdx = state.profilerStep;
  const input = state.recipientInput;

  // Name Input
  const nameInput = document.getElementById('input-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      store.setNested('recipientInput', { name: e.target.value });
    });
  }

  // Custom Personality Input
  const customPersonality = document.getElementById('input-custom-personality');
  if (customPersonality) {
    customPersonality.addEventListener('input', (e) => {
      store.setNested('recipientInput', { customPersonality: e.target.value });
    });
  }

  // Custom Interests Input
  const customInterests = document.getElementById('input-custom-interests');
  if (customInterests) {
    customInterests.addEventListener('input', (e) => {
      store.setNested('recipientInput', { customInterests: e.target.value });
    });
  }



  // Custom Relationship Input
  const customRelationship = document.getElementById('input-custom-relationship');
  if (customRelationship) {
    customRelationship.addEventListener('input', (e) => {
      store.setNested('recipientInput', { customRelationship: e.target.value });
    });
  }

  // Custom Gender Input
  const customGender = document.getElementById('input-custom-gender');
  if (customGender) {
    customGender.addEventListener('input', (e) => {
      store.setNested('recipientInput', { customGender: e.target.value });
    });
  }

  // Custom Occasion Input
  const customOccasion = document.getElementById('input-custom-occasion');
  if (customOccasion) {
    customOccasion.addEventListener('input', (e) => {
      store.setNested('recipientInput', { customOccasion: e.target.value });
    });
  }

  // Memory Input
  const memoryInput = document.getElementById('input-memory');
  if (memoryInput) {
    memoryInput.addEventListener('input', (e) => {
      store.setNested('recipientInput', { sharedMemory: e.target.value });
    });
  }

  // Chips (Multi-select)
  document.querySelectorAll('.trait-chip').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const traitObj = PERSONALITY_TRAITS.find(t => t.id === id);
      const cat = traitObj ? traitObj.category : null;
      let newTraits = [...(input.personality || [])];
      
      if (newTraits.includes(id)) {
        newTraits = newTraits.filter(i => i !== id);
      } else {
        if (cat) {
          const countInCat = newTraits.filter(t => PERSONALITY_TRAITS.find(p => p.id === t)?.category === cat).length;
          if (countInCat < 2) newTraits.push(id);
        } else {
          newTraits.push(id);
        }
      }
      store.setNested('recipientInput', { personality: newTraits });
      router._handleRouteChange(); // Re-render step
    });
  });

  document.querySelectorAll('.interest-chip').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.dataset.val;
      const interestObj = INTEREST_CATEGORIES.find(c => c.interests.includes(val));
      const catId = interestObj ? interestObj.id : null;
      let newInterests = [...(input.interests || [])];
      
      if (newInterests.includes(val)) {
        newInterests = newInterests.filter(i => i !== val);
      } else {
        if (catId) {
          const countInCat = newInterests.filter(i => INTEREST_CATEGORIES.find(c => c.id === catId)?.interests.includes(i)).length;
          if (countInCat < 2) newInterests.push(val);
        } else {
          newInterests.push(val);
        }
      }
      store.setNested('recipientInput', { interests: newInterests });
      router._handleRouteChange(); 
    });
  });

  document.querySelectorAll('.intent-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      let newIntents = [...(input.giftIntent || [])];
      if (newIntents.includes(id)) newIntents = newIntents.filter(i => i !== id);
      else if (newIntents.length < 3) newIntents.push(id);
      store.setNested('recipientInput', { giftIntent: newIntents });
      router._handleRouteChange();
    });
  });

  // Radio Cards (Single-select)
  document.querySelectorAll('.gender-card').forEach(el => {
    el.addEventListener('click', () => {
      store.setNested('recipientInput', { gender: el.dataset.gender });
      router._handleRouteChange();
    });
  });

  document.querySelectorAll('.rel-card').forEach(el => {
    el.addEventListener('click', () => {
      store.setNested('recipientInput', { relationship: el.dataset.id });
      router._handleRouteChange();
    });
  });

  document.querySelectorAll('.close-card').forEach(el => {
    el.addEventListener('click', () => {
      store.setNested('recipientInput', { closeness: el.dataset.id });
      router._handleRouteChange();
    });
  });

  document.querySelectorAll('.occ-card').forEach(el => {
    el.addEventListener('click', () => {
      store.setNested('recipientInput', { occasion: el.dataset.id });
      router._handleRouteChange();
    });
  });

  // Navigation
  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (stepIdx > 0) {
        store.set({ profilerStep: stepIdx - 1 });
        router._handleRouteChange();
      } else {
        router.navigate('home');
      }
    });
  }

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const errEl = document.getElementById('form-error');
      errEl.innerText = '';

      // Proceed to next step
      if (stepIdx < 5) {
        store.set({ profilerStep: stepIdx + 1 });
        saveJourney(store.get());
        router._handleRouteChange();
      } else {
        // Final submit
        const validation = validateRecipientInput(store.get('recipientInput'));
        if (validation.valid) {
          saveJourney(store.get());
          router.navigate('insight');
        } else {
          // Show first error
          errEl.innerText = Object.values(validation.errors)[0];
        }
      }
    });
  }
}
