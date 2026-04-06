/**
 * The Gift Brief — Compare Engine
 * Generates comparison scoring and reasoning for shortlisted directions
 */

import { callAIJSON } from './api.js';
import { buildComparisonPrompt, getSystemInstruction } from '../utils/prompts.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';
import store from './store.js';

/**
 * Compare shortlisted directions based on the recipient profile
 * @param {Object} profile - Normalized recipient profile
 * @param {Object} insight - Recipient insight
 * @param {Array} shortlist - Array of shortlisted items
 * @returns {Promise<Object>} Comparison results
 */
export async function compareDirections(profile, insight, shortlist) {
  if (!shortlist || shortlist.length < 2) {
    throw new Error('Need at least 2 shortlisted directions to compare.');
  }

  // Hydrate shortlist with full direction objects
  const hydratedShortlist = shortlist.map(item => ({
    ...item,
    direction: Object.values(GIFT_DIRECTIONS).find(d => d.id === item.directionId)
  }));

  store.set({ isLoading: true, loadingMessage: 'Analyzing your shortlist...' });

  try {
    const prompt = buildComparisonPrompt(profile, insight, hydratedShortlist);
    
    const rawResult = await callAIJSON(prompt, {
      systemInstruction: getSystemInstruction(),
      temperature: 0.6 // Slightly lower for more objective scoring
    });

    // Validate structure
    const fallbackDirectionId = hydratedShortlist[0].directionId;
    const result = {
      scores: rawResult.scores || {},
      bestFitId: rawResult.bestFitId || fallbackDirectionId,
      bestFitReason: rawResult.bestFitReason || 'This direction aligns best with their personality.',
      runnerUpId: rawResult.runnerUpId || null,
      decisionTip: rawResult.decisionTip || 'Trust your gut — you know them best.'
    };

    // Ensure all shortlisted items have scores
    for (const item of hydratedShortlist) {
      if (!result.scores[item.directionId]) {
        // Fallback default scores
        result.scores[item.directionId] = {
          emotionalFit: 7,
          personalizationPotential: 7,
          effortLevel: 7,
          surpriseFactor: 7,
          meaningfulness: 7,
          overall: 7
        };
      }
    }

    store.set({ comparisonResult: result, error: null });
    return result;

  } catch (error) {
    console.warn('Compare API failed, using fallback comparison:', error);
    const fallbackDirectionId = hydratedShortlist[0].directionId;
    const fallbackRunnerUpId = hydratedShortlist[1]?.directionId || null;
    const fallbackScores = {};
    for (const item of hydratedShortlist) {
      fallbackScores[item.directionId] = {
        emotionalFit: 7,
        personalizationPotential: 7,
        effortLevel: 7,
        surpriseFactor: 7,
        meaningfulness: 8,
        overall: item.directionId === fallbackDirectionId ? 8 : 7
      };
    }
    const fallbackResult = {
      scores: fallbackScores,
      bestFitId: fallbackDirectionId,
      bestFitReason: 'This option is the safest match based on the details captured so far.',
      runnerUpId: fallbackRunnerUpId,
      decisionTip: 'If both feel right, choose the one you can personalize most easily.'
    };
    store.set({ comparisonResult: fallbackResult, error: null });
    return fallbackResult;
  } finally {
    store.set({ isLoading: false, loadingMessage: '' });
  }
}
