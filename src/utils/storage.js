/**
 * The Gift Brief — LocalStorage Helpers
 * Persist and restore journey state across page refreshes
 */

const STORAGE_KEYS = {
  JOURNEY: 'tgb_journey',
  API_KEY: 'tgb_api_key',
  SETTINGS: 'tgb_settings',
};

/**
 * Save the full journey state to localStorage
 * @param {Object} state - The store state to persist
 */
export function saveJourney(state) {
  try {
    const toSave = {
      journeyId: state.journeyId,
      journeyStartedAt: state.journeyStartedAt,
      currentStep: state.currentStep,
      recipientInput: state.recipientInput,
      profilerStep: state.profilerStep,
      recipientInsight: state.recipientInsight,
      selectedDirection: state.selectedDirection,
      directionDeepDive: state.directionDeepDive,
      shortlist: state.shortlist,
      comparisonResult: state.comparisonResult,
      finalBrief: state.finalBrief,
      giftNote: state.giftNote,
      avatarSvg: state.avatarSvg,
    };
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('Failed to save journey to localStorage:', error);
  }
}

/**
 * Load the saved journey from localStorage
 * @returns {Object|null} The saved journey state, or null if none exists
 */
export function loadJourney() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load journey from localStorage:', error);
    return null;
  }
}

/**
 * Clear the saved journey from localStorage
 */
export function clearJourney() {
  try {
    localStorage.removeItem(STORAGE_KEYS.JOURNEY);
  } catch (error) {
    console.warn('Failed to clear journey from localStorage:', error);
  }
}

/**
 * Check if a saved journey exists
 * @returns {boolean}
 */
export function hasSavedJourney() {
  try {
    return !!localStorage.getItem(STORAGE_KEYS.JOURNEY);
  } catch {
    return false;
  }
}

/**
 * Save the Gemini API key to localStorage
 * @param {string} key
 */
export function saveApiKey(key) {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  } catch (error) {
    console.warn('Failed to save API key to localStorage:', error);
  }
}

/**
 * Get the saved API key from localStorage
 * @returns {string|null}
 */
export function getApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Clear the saved API key
 */
export function clearApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.warn('Failed to clear API key from localStorage:', error);
  }
}

/**
 * Save user settings
 * @param {Object} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

/**
 * Load user settings
 * @returns {Object}
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
