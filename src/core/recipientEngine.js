/**
 * The Gift Brief — Recipient Engine
 * Validates and normalizes recipient input into a structured profile
 */

import {
  PERSONALITY_TRAITS,
  RELATIONSHIP_TYPES,
  CLOSENESS_LEVELS,
  OCCASIONS,
  GIFT_INTENTS,
  INTEREST_CATEGORIES
} from '../utils/constants.js';

/**
 * Validate recipient input from the profiler form
 * @param {Object} input - Raw recipientInput from store
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateRecipientInput(input) {
  const errors = {};

  if (!input.personality || input.personality.length === 0) {
    errors.personality = 'Please select at least one personality trait.';
  }

  if (!input.interests || input.interests.length === 0) {
    errors.interests = 'Please select at least one interest.';
  }

  if (!input.relationship) {
    errors.relationship = 'Please select a relationship type.';
  }

  if (!input.closeness) {
    errors.closeness = 'Please indicate how close you are.';
  }

  if (!input.occasion) {
    errors.occasion = 'Please select an occasion.';
  }

  if (!input.giftIntent || input.giftIntent.length === 0) {
    errors.giftIntent = 'Please select what you want to express.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Build a normalized, enriched recipient profile from raw input
 * @param {Object} input - Raw recipientInput from store
 * @returns {Object} Normalized profile with labels resolved
 */
export function buildRecipientProfile(input) {
  // Resolve personality trait labels
  const personalityLabels = input.personality
    .map(id => PERSONALITY_TRAITS.find(t => t.id === id)?.label)
    .filter(Boolean);

  if (input.customPersonality && input.customPersonality.trim() !== '') {
    personalityLabels.push(input.customPersonality.trim());
  }

  // Resolve relationship label
  const relationshipData = RELATIONSHIP_TYPES.find(r => r.id === input.relationship);
  const relationshipLabel = relationshipData?.label || input.relationship;

  // Resolve closeness label
  const closenessData = CLOSENESS_LEVELS.find(c => c.id === input.closeness);
  const closenessLabel = closenessData?.label || input.closeness;
  const closenessValue = closenessData?.value || 3;

  // Resolve occasion label
  const occasionData = OCCASIONS.find(o => o.id === input.occasion);
  const occasionLabel = occasionData?.label || input.occasion;

  // Resolve gift intent labels
  const intentLabels = input.giftIntent
    .map(id => GIFT_INTENTS.find(i => i.id === id)?.label)
    .filter(Boolean);

  // Build a flat list of interests
  const interestsList = [...(input.interests || [])];
  
  if (input.customInterests && input.customInterests.trim() !== '') {
    interestsList.push(input.customInterests.trim());
  }

  // Determine dominant personality category
  const traitCategories = input.personality.map(id =>
    PERSONALITY_TRAITS.find(t => t.id === id)?.category
  ).filter(Boolean);

  const categoryCount = traitCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const dominantCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'temperament';

  // Score sentimental tendency (used for avatar and direction weighting)
  const sentimentalTraits = ['sentimental', 'nostalgic', 'romantic', 'empathetic', 'thoughtful'];
  const sentimentScore = input.personality.filter(t => sentimentalTraits.includes(t)).length;

  // Score adventurousness
  const adventurousTraits = ['adventurous', 'energetic', 'spontaneous', 'playful'];
  const adventureScore = input.personality.filter(t => adventurousTraits.includes(t)).length;

  return {
    // Raw input preserved
    name: input.name || '',
    personalityIds: input.personality,
    interestsList,
    relationshipId: input.relationship,
    closenessId: input.closeness,
    occasionId: input.occasion,
    sharedMemory: input.sharedMemory || '',
    giftIntentIds: input.giftIntent,

    // Resolved labels (for prompts & display)
    personalityLabels,
    relationshipLabel,
    closenessLabel,
    closenessValue,
    occasionLabel,
    intentLabels,

    // Derived metrics (for direction scoring & avatar)
    dominantPersonalityCategory: dominantCategory,
    sentimentScore,
    adventureScore,
    isHighlySentimental: sentimentScore >= 2,
    isAdventurous: adventureScore >= 2,
    hasSharedMemory: !!input.sharedMemory && input.sharedMemory.trim().length > 10,

    // Metadata
    profileBuiltAt: new Date().toISOString()
  };
}

/**
 * Get direction affinity scores based on the recipient profile
 * These are heuristic pre-scores before AI refinement
 * @param {Object} profile - Normalized recipient profile
 * @returns {Object} { directionId: score (0-1) }
 */
export function getDirectionAffinities(profile) {
  const affinities = {
    'memory-keepsake': 0,
    'comfort-care': 0,
    'interest-surprise': 0,
    'experience-moment': 0
  };

  // Memory Keepsake — boosted by sentimental traits, close relationships, shared memories
  affinities['memory-keepsake'] +=
    (profile.sentimentScore * 0.25) +
    (profile.hasSharedMemory ? 0.3 : 0) +
    (profile.closenessValue >= 4 ? 0.2 : 0) +
    (profile.isHighlySentimental ? 0.15 : 0);

  // Comfort & Care — boosted by empathetic, calm traits; get-well, support occasions
  const comfortOccasions = ['get-well', 'just-because', 'thank-you'];
  const comfortTraits = ['empathetic', 'calm', 'reserved', 'homebody'];
  affinities['comfort-care'] +=
    (profile.personalityIds.filter(t => comfortTraits.includes(t)).length * 0.2) +
    (comfortOccasions.includes(profile.occasionId) ? 0.35 : 0);

  // Interest-based Surprise — boosted by adventurous, creative, many interests
  affinities['interest-surprise'] +=
    (profile.adventureScore * 0.2) +
    (profile.interestsList.length >= 5 ? 0.25 : 0) +
    (profile.personalityIds.includes('creative') ? 0.15 : 0) +
    (profile.personalityIds.includes('spontaneous') ? 0.15 : 0);

  // Experience/Shared Moment — boosted by adventurousness, social traits, close relationships
  const experienceOccasions = ['anniversary', 'birthday', 'graduation'];
  const socialTraits = ['social-butterfly', 'adventurous', 'energetic', 'spontaneous'];
  affinities['experience-moment'] +=
    (profile.personalityIds.filter(t => socialTraits.includes(t)).length * 0.15) +
    (experienceOccasions.includes(profile.occasionId) ? 0.25 : 0) +
    (profile.closenessValue >= 4 ? 0.2 : 0);

  // Normalize to 0-1
  const max = Math.max(...Object.values(affinities), 0.1);
  for (const key of Object.keys(affinities)) {
    affinities[key] = Math.min(1, affinities[key] / max);
  }

  return affinities;
}
