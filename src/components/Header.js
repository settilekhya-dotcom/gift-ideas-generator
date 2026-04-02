import { getApiKey, saveApiKey } from '../utils/storage.js';

export function Header() {
  return `
    <header class="app-header glass">
      <a href="#home" class="logo">
        <span class="logo-icon">✧</span>
        The Gift Brief
      </a>
      <nav>
        <button id="settings-btn" class="btn btn-text">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </nav>
      <div class="progress-container">
        <div id="app-progress-bar" class="progress-bar" style="width: 0%"></div>
      </div>
    </header>

    <!-- Settings Modal -->
    <div id="settings-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:100; align-items:center; justify-content:center;">
      <div style="background:var(--color-surface); padding:2rem; border-radius:var(--radius-lg); width:90%; max-width:400px; box-shadow:var(--shadow-lg);">
        <h3 style="margin-bottom:1rem;">Settings</h3>
        <p style="font-size:0.9rem; color:var(--color-text-light); margin-bottom:1rem;">
          Enter your Gemini API Key. It is stored locally in your browser and never sent anywhere else.
        </p>
        <input type="password" id="input-api-key" class="form-input" style="width:100%; padding:0.5rem; margin-bottom:1.5rem;" placeholder="AIzaSy...">
        <div style="display:flex; justify-content:flex-end; gap:1rem;">
          <button id="btn-close-settings" class="btn btn-secondary">Close</button>
          <button id="btn-save-settings" class="btn btn-primary">Save Key</button>
        </div>
      </div>
    </div>
  `;
}

export function initHeader() {
  const modal = document.getElementById('settings-modal');
  const btnOpen = document.getElementById('settings-btn');
  const btnClose = document.getElementById('btn-close-settings');
  const btnSave = document.getElementById('btn-save-settings');
  const inputKey = document.getElementById('input-api-key');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      inputKey.value = getApiKey() || '';
      modal.style.display = 'flex';
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (btnSave && modal) {
    btnSave.addEventListener('click', () => {
      const val = inputKey.value.trim();
      if (val) {
        saveApiKey(val);
      }
      modal.style.display = 'none';
      
      // Flash success toast (reusing existing styles if possible or just alert)
      alert("API Key saved successfully!");
    });
  }
}
