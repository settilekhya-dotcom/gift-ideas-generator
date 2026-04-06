/**
 * The Gift Brief — State Store
 * Pub/sub pattern state management for the gifting journey
 */

const initialState = {
  // Journey metadata
  journeyId: null,
  journeyStartedAt: null,
  currentStep: 'home', // home | input | insight | directions | ideas | compare | brief | card

  // API Key
  apiKey: null,

  // Recipient Input (Step 2)
  recipientInput: {
    name: '',
    gender: '',            // 'male' | 'female' | 'other'
    customGender: '',      // String for 'other' selection
    personality: [],       // Array of trait IDs
    interests: [],         // Array of interest strings
    relationship: null,    // Relationship type ID
    closeness: null,       // Closeness level ID
    occasion: null,        // Occasion ID
    sharedMemory: '',      // Free text
    giftIntent: [],        // Array of intent IDs
  },

  // Profiler form state
  profilerStep: 0,         // Current step index (0-5)

  // AI Insight (Step 3)
  recipientInsight: null,  // { personalitySnapshot, emotionalCues, giftingThemes }

  // Gift Directions (Step 3-4)
  selectedDirection: null, // Direction ID
  directionDeepDive: null, // { whyItWorks, whatGiftsFit, whatItCommunicates, howToPersonalize }

  // Shortlist & Compare (Step 5)
  shortlist: [],           // Array of { directionId, deepDive, addedAt }
  comparisonResult: null,  // { scores, bestFit, reasoning }

  // Final Brief (Step 6)
  finalBrief: null,        // { direction, reasoning, summary }

  // Gift Card (Step 7)
  giftNote: null,          // AI-generated gift note text
  avatarSvg: null,         // Generated SVG string

  // UI State
  isLoading: false,
  loadingMessage: '',
  error: null,
};

class Store {
  constructor() {
    this.state = { ...initialState };
    this.listeners = new Map();
    this.globalListeners = [];
  }

  /**
   * Get the full state or a specific key
   */
  get(key) {
    if (key) {
      return this.state[key];
    }
    return { ...this.state };
  }

  /**
   * Update state with partial updates
   * @param {Object} updates - Key-value pairs to update
   */
  set(updates) {
    const prevState = { ...this.state };
    const changedKeys = [];

    for (const [key, value] of Object.entries(updates)) {
      if (this.state[key] !== value) {
        this.state[key] = value;
        changedKeys.push(key);
      }
    }

    if (changedKeys.length > 0) {
      // Notify specific key listeners
      for (const key of changedKeys) {
        if (this.listeners.has(key)) {
          for (const callback of this.listeners.get(key)) {
            callback(this.state[key], prevState[key], key);
          }
        }
      }

      // Notify global listeners
      for (const callback of this.globalListeners) {
        callback(this.state, prevState, changedKeys);
      }
    }
  }

  /**
   * Update a nested object (e.g., recipientInput)
   * @param {string} key - Top-level state key
   * @param {Object} updates - Nested updates
   */
  setNested(key, updates) {
    const current = this.state[key];
    if (typeof current === 'object' && current !== null) {
      this.set({
        [key]: { ...current, ...updates }
      });
    }
  }

  /**
   * Subscribe to changes on specific state keys
   * @param {string|string[]} keys - State key(s) to listen to
   * @param {Function} callback - Called with (newValue, oldValue, key)
   * @returns {Function} Unsubscribe function
   */
  on(keys, callback) {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    for (const key of keyArray) {
      if (!this.listeners.has(key)) {
        this.listeners.set(key, new Set());
      }
      this.listeners.get(key).add(callback);
    }

    return () => {
      for (const key of keyArray) {
        if (this.listeners.has(key)) {
          this.listeners.get(key).delete(callback);
        }
      }
    };
  }

  /**
   * Subscribe to all state changes
   * @param {Function} callback - Called with (newState, oldState, changedKeys)
   * @returns {Function} Unsubscribe function
   */
  onAny(callback) {
    this.globalListeners.push(callback);
    return () => {
      this.globalListeners = this.globalListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Start a new journey — resets state with a new journey ID
   */
  startNewJourney() {
    const apiKey = this.state.apiKey; // Preserve API key
    this.state = {
      ...initialState,
      apiKey,
      journeyId: this._generateId(),
      journeyStartedAt: new Date().toISOString(),
      currentStep: 'input',
    };

    // Notify all global listeners
    for (const callback of this.globalListeners) {
      callback(this.state, initialState, Object.keys(this.state));
    }
  }

  /**
   * Reset entire state to initial
   */
  reset() {
    const apiKey = this.state.apiKey;
    const prevState = { ...this.state };
    this.state = { ...initialState, apiKey };

    for (const callback of this.globalListeners) {
      callback(this.state, prevState, Object.keys(this.state));
    }
  }

  /**
   * Add a direction to the shortlist
   */
  addToShortlist(directionId, deepDive) {
    const exists = this.state.shortlist.find(item => item.directionId === directionId);
    if (!exists) {
      this.set({
        shortlist: [
          ...this.state.shortlist,
          { directionId, deepDive, addedAt: new Date().toISOString() }
        ]
      });
    }
  }

  /**
   * Remove a direction from the shortlist
   */
  removeFromShortlist(directionId) {
    this.set({
      shortlist: this.state.shortlist.filter(item => item.directionId !== directionId)
    });
  }

  /**
   * Check if a direction is in the shortlist
   */
  isShortlisted(directionId) {
    return this.state.shortlist.some(item => item.directionId === directionId);
  }

  /**
   * Generate a unique journey ID
   */
  _generateId() {
    return `journey_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

// Singleton store instance
const store = new Store();
export default store;
