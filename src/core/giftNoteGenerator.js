/**
 * The Gift Brief — Gift Note & Brief Generator
 */

import { callAIJSON } from './api.js';
import { buildGiftBriefPrompt, buildGiftNotePrompt, getSystemInstruction } from '../utils/prompts.js';
import { GIFT_DIRECTIONS } from '../utils/constants.js';
import store from './store.js';

/**
 * Generate the final Gift Brief summary
 * @param {Object} profile - Normalized profile
 * @param {Object} insight - Recipient insight
 * @param {string} directionId - Chosen direction ID
 * @param {Object} deepDive - Chosen direction deep dive
 * @returns {Promise<Object>} The generated brief
 */
export async function generateFinalBrief(profile, insight, directionId, deepDive) {
  const direction = Object.values(GIFT_DIRECTIONS).find(d => d.id === directionId);
  store.set({ isLoading: true, loadingMessage: 'Preparing your final brief...' });

  try {
    const prompt = buildGiftBriefPrompt(profile, insight, direction, deepDive);
    
    const rawBrief = await callAIJSON(prompt, {
      systemInstruction: getSystemInstruction(),
      temperature: 0.7 
    });

    const brief = {
      direction: direction,
      headline: rawBrief.headline || direction.tagline,
      summary: rawBrief.summary || `A thoughtful gift focusing on ${direction.title.toLowerCase()}.`,
      whyStrongestDirection: rawBrief.whyStrongestDirection || `This direction best matches ${profile.name || 'them'} because it aligns with both personality and relationship context, not just the occasion.`,
      shoppingCompass: Array.isArray(rawBrief.shoppingCompass) && rawBrief.shoppingCompass.length
        ? rawBrief.shoppingCompass.slice(0, 3)
        : [
            'Choose something that connects to a real interest or memory.',
            'Prefer details that feel personal over flashy packaging.',
            'Pick quality and relevance over novelty for novelty\'s sake.'
          ],
      whatToAvoid: Array.isArray(rawBrief.whatToAvoid) && rawBrief.whatToAvoid.length
        ? rawBrief.whatToAvoid.slice(0, 3)
        : [
            'Generic items that could be for anyone.',
            'Overly practical gifts with no emotional signal.'
          ],
      thoughtfulUpgrade: Array.isArray(rawBrief.thoughtfulUpgrade) && rawBrief.thoughtfulUpgrade.length
        ? rawBrief.thoughtfulUpgrade.slice(0, 3)
        : [
            'Add a short note naming the specific reason you chose it.',
            'Reference a shared moment in how you present the gift.'
          ],
      topIdea: rawBrief.topIdea || deepDive?.whatGiftsFit?.[0] || 'A thoughtful, personalized gift',
      personalTouch: rawBrief.personalTouch || deepDive?.howToPersonalize?.[0] || 'Add a personal note naming the specific reason you chose it.',
      occasionNote: rawBrief.occasionNote || `Perfect for this occasion.`
    };

    store.set({ finalBrief: brief, error: null });
    return brief;

  } catch (error) {
    console.warn('Brief API failed, using fallback brief:', error);
    const fallbackBrief = {
      direction: direction,
      headline: direction?.tagline || 'A thoughtful gift, chosen with care',
      summary: `A meaningful gift centered on ${direction?.title?.toLowerCase() || 'what matters most to them'}.`,
      whyStrongestDirection: 'This direction balances emotional fit, personalization, and practicality better than generic gift choices.',
      shoppingCompass: [
        'Look for something that reflects their real routines or passions.',
        'Prioritize personal relevance over price or trendiness.',
        'Choose an item that makes the story behind the gift easy to explain.'
      ],
      whatToAvoid: [
        'Anything too generic or last-minute in feel.',
        'Items that are useful but emotionally empty.'
      ],
      thoughtfulUpgrade: [
        'Include a handwritten note with one specific memory.',
        'Personalize timing or presentation to match their personality.'
      ],
      topIdea: deepDive?.whatGiftsFit?.[0] || 'A personalized, memory-linked gift',
      personalTouch: deepDive?.howToPersonalize?.[0] || 'Include a personal note explaining why you chose it.',
      occasionNote: 'A heartfelt gesture often matters more than price or scale.'
    };
    store.set({ finalBrief: fallbackBrief, error: null });
    return fallbackBrief;
  } finally {
    store.set({ isLoading: false, loadingMessage: '' });
  }
}

/**
 * Generate a personalized gift note
 * @param {Object} profile - Normalized profile
 * @param {Object} brief - The final gift brief
 * @returns {Promise<Object>} { note, tone }
 */
export async function generateGiftNote(profile, brief) {
  store.set({ isLoading: true, loadingMessage: 'Writing your gift note...' });

  try {
    const prompt = buildGiftNotePrompt(profile, brief);
    
    const result = await callAIJSON(prompt, {
      systemInstruction: getSystemInstruction(),
      temperature: 0.8
    });

    const noteData = {
      note: result.note || 'Wishing you the very best on this special day.',
      tone: result.tone || 'Warm'
    };

    store.set({ giftNote: noteData, error: null });
    return noteData;

  } catch (error) {
    console.warn('Gift note API failed, using fallback note:', error);
    const fallbackNote = {
      note: `I picked this for you because it reminded me of what makes you special. I hope it brings you joy and feels as thoughtful as intended.`,
      tone: 'Warm'
    };
    store.set({ giftNote: fallbackNote, error: null });
    return fallbackNote;
  } finally {
    store.set({ isLoading: false, loadingMessage: '' });
  }
}
