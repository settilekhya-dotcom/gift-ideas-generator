/**
 * The Gift Brief — Insight Generator
 * Orchestrates the generation of the AI recipient insight
 */

import { callGeminiJSON } from './api.js';
import { buildInsightPrompt, getSystemInstruction } from '../utils/prompts.js';
import store from './store.js';

/**
 * Generate AI insight for the recipient profile
 * @param {Object} profile - Normalized recipient profile
 * @returns {Promise<Object>} The generated insight object
 */
export async function generateInsight(profile) {
  store.set({ isLoading: true, loadingMessage: 'Understanding your recipient...' });

  try {
    const prompt = buildInsightPrompt(profile);
    
    const rawInsight = await callGeminiJSON(prompt, {
      systemInstruction: getSystemInstruction(),
      temperature: 0.7 
    });

    // Validate the response format to ensure it has the expected structure
    const insight = {
      personalitySnapshot: rawInsight.personalitySnapshot || 'A wonderful, complex person based on the traits you provided.',
      emotionalCues: Array.isArray(rawInsight.emotionalCues) 
        ? rawInsight.emotionalCues.slice(0, 4) 
        : ['Values meaningful connection', 'Appreciates thoughtful gestures', 'Has unique passions'],
      giftingThemes: Array.isArray(rawInsight.giftingThemes)
        ? rawInsight.giftingThemes.slice(0, 4)
        : ['Moments of connection', 'Support for their interests'],
      connectionInsight: rawInsight.connectionInsight || 'You share a significant bond that a thoughtful gift can honor.',
      keyConsideration: rawInsight.keyConsideration || 'Focus on what makes them feel seen and appreciated.'
    };

    // Update store with the new insight
    store.set({ recipientInsight: insight, error: null });
    return insight;

  } catch (error) {
    console.warn('Insight API failed, using fallback insight:', error);
    const fallbackInsight = {
      personalitySnapshot: `${profile.name || 'They'} come across as thoughtful and unique, with clear personal preferences you can honor.`,
      emotionalCues: [
        'Values meaningful gestures over flashy ones',
        'Appreciates being seen and understood',
        'Responds well to personal touches'
      ],
      giftingThemes: [
        'Shared memory',
        'Personal growth',
        'Everyday delight'
      ],
      connectionInsight: 'A gift that reflects your shared context will likely feel especially meaningful.',
      keyConsideration: 'Choose something specific to who they are, not just the occasion.'
    };
    store.set({ recipientInsight: fallbackInsight, error: null });
    return fallbackInsight;
  } finally {
    store.set({ isLoading: false, loadingMessage: '' });
  }
}
