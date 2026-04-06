/**
 * The Gift Brief — Direction Engine
 * Handles the AI deep-dive generation for a specific gift direction
 */

import { callAIJSON } from './api.js';
import { buildDirectionPrompt, getSystemInstruction } from '../utils/prompts.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';
import store from './store.js';

/**
 * Generate a personalized deep-dive for a specific direction
 * @param {Object} profile - Normalized recipient profile
 * @param {Object} insight - Recipient insight
 * @param {string} directionId - The ID of the selected direction
 * @returns {Promise<Object>} The generated deep-dive object
 */
export async function generateDirectionDeepDive(profile, insight, directionId) {
  const direction = Object.values(GIFT_DIRECTIONS).find(d => d.id === directionId);
  if (!direction) throw new Error(`Invalid direction ID: ${directionId}`);

  store.set({ isLoading: true, loadingMessage: `Exploring ${direction.title} ideas...` });

  try {
    const prompt = buildDirectionPrompt(profile, direction, insight);
    
    const rawDeepDive = await callAIJSON(prompt, {
      systemInstruction: getSystemInstruction(),
      temperature: 0.8 // Slightly higher creativity for gift ideas
    });

    // Validate and format
    const deepDive = {
      whyItWorks: rawDeepDive.whyItWorks || `This direction aligns well with their personality and your relationship.`,
      whatGiftsFit: Array.isArray(rawDeepDive.whatGiftsFit) 
        ? rawDeepDive.whatGiftsFit 
        : direction.examples,
      whatItCommunicates: rawDeepDive.whatItCommunicates || direction.communicates,
      approachStyle: rawDeepDive.approachStyle || `This is a ${direction.title.toLowerCase()} approach that prioritizes emotional relevance over generic gifting.`,
      howToPersonalize: Array.isArray(rawDeepDive.howToPersonalize)
        ? rawDeepDive.howToPersonalize
        : direction.personalizationTips,
      fitScore: typeof rawDeepDive.fitScore === 'number' ? rawDeepDive.fitScore : 8,
      fitReason: rawDeepDive.fitReason || 'This is a strong match for their profile.'
    };

    // Update store
    store.set({
      selectedDirection: directionId,
      directionDeepDive: deepDive,
      error: null
    });
    
    return deepDive;

  } catch (error) {
    console.warn('Direction API failed, using fallback deep-dive:', error);
    const fallbackDeepDive = {
      whyItWorks: `This direction maps well to ${profile.name || 'their'} interests and the tone of your relationship.`,
      whatGiftsFit: Array.isArray(direction.examples) && direction.examples.length > 0
        ? direction.examples
        : ['A thoughtful, personalized gift'],
      whatItCommunicates: direction.communicates || 'I see you and care deeply about what matters to you.',
      approachStyle: `This is a ${direction.title.toLowerCase()} path that keeps the gift personal and emotionally clear.`,
      howToPersonalize: Array.isArray(direction.personalizationTips) && direction.personalizationTips.length > 0
        ? direction.personalizationTips
        : ['Add a short handwritten note that references a shared memory.'],
      fitScore: 8,
      fitReason: 'A reliable option that balances meaning, practicality, and personal relevance.'
    };
    store.set({
      selectedDirection: directionId,
      directionDeepDive: fallbackDeepDive,
      error: null
    });
    return fallbackDeepDive;
  } finally {
    store.set({ isLoading: false, loadingMessage: '' });
  }
}
