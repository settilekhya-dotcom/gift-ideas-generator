/**
 * The Gift Brief — AI Prompt Templates
 * All prompts for Gemini API calls, crafted for empathetic, meaningful output
 */

/**
 * Build the recipient insight prompt
 * @param {Object} profile - Normalized recipient profile from recipientEngine
 * @returns {string} The prompt text
 */
export function buildInsightPrompt(profile) {
  return `Analyze this person for gifting. Keep it warm but very specific.
  
- Name: ${profile.name || 'the recipient'}
- Relationship: ${profile.relationshipLabel}
- Personality: ${profile.personalityLabels.join(', ')}
- Interests: ${profile.interestsList.join(', ')}
- Memory: "${profile.sharedMemory || 'None'}"
- Intent: ${profile.intentLabels.join(', ')}

Respond as a JSON object:
{
  "personalitySnapshot": "2-3 sentences on who they are at their core.",
  "emotionalCues": ["3 max-word phrases on what they value emotionally"],
  "giftingThemes": ["3 specific gifting themes that fit them"],
  "connectionInsight": "1-2 sentences on why the givers relationship is special.",
  "keyConsideration": "One practical gating factor.",
  "believabilityAnchor": "One realistic grounded detail."
}`;
}

/**
 * Build the gift direction deep-dive prompt
 * @param {Object} profile - Normalized recipient profile
 * @param {Object} direction - The selected gift direction from constants
 * @param {Object} insight - The previously generated recipient insight
 * @returns {string} The prompt text
 */
export function buildDirectionPrompt(profile, direction, insight) {
  return `You are a thoughtful gifting advisor. A giver has chosen to explore the "${direction.title}" gift direction for someone they care about.

RECIPIENT PROFILE:
- Name: ${profile.name || 'the recipient'}
- Personality: ${profile.personalityLabels.join(', ')}
- Interests: ${profile.interestsList.join(', ')}
- Relationship: ${profile.relationshipLabel} (${profile.closenessLabel})
- Occasion: ${profile.occasionLabel}
- Gift intent: ${profile.intentLabels.join(', ')}
- Shared memory: "${profile.sharedMemory || 'Not specified'}"

AI INSIGHT ABOUT THIS PERSON:
${insight.personalitySnapshot}
Key themes: ${insight.giftingThemes.join('; ')}

SELECTED DIRECTION: ${direction.title}
Direction description: ${direction.description}

Now give a deeply personalized breakdown of this gift direction FOR THIS SPECIFIC PERSON.
Make it sound human, emotionally aware, and concrete. Avoid generic assistant language.

Respond with a JSON object with exactly these fields:

{
  "whyItWorks": "2-3 sentences explaining why THIS direction fits THIS person specifically, referencing profile details and relationship context.",
  "whatGiftsFit": ["5-6 specific gift *ideas* (not product links) that fit this direction AND this person's profile. Each should be specific (e.g. 'A hand-bound journal with prompts about their travels' not just 'a journal'). Format: plain descriptive phrases."],
  "whatItCommunicates": "2 sentences on the emotional message this direction sends — what it says about the giver and the relationship.",
  "approachStyle": "One sentence describing what kind of gifting approach this represents (for example: memory-led, care-led, interest-led, or experience-led), tailored to this recipient.",
  "howToPersonalize": ["4 specific, actionable ways to make a gift in this direction uniquely personal to this recipient — reference their actual interests/memories/traits"],
  "fitScore": A number from 1-10 indicating how well this direction fits the recipient (based on their profile),
  "fitReason": "One sentence explaining the fit score."
}`;
}

/**
 * Build the comparison reasoning prompt
 * @param {Object} profile - Normalized recipient profile
 * @param {Object} insight - Recipient insight
 * @param {Array} shortlistedItems - Array of { direction, deepDive }
 * @returns {string} The prompt text
 */
export function buildComparisonPrompt(profile, insight, shortlistedItems) {
  const directionsText = shortlistedItems.map((item, i) =>
    `Direction ${i + 1}: ${item.direction.title}
     Why it works: ${item.deepDive.whyItWorks}
     Fit score: ${item.deepDive.fitScore}/10`
  ).join('\n\n');

  return `You are a thoughtful gifting advisor helping someone choose between shortlisted gift directions.

RECIPIENT: ${profile.name || 'the recipient'} — ${profile.personalityLabels.join(', ')}
Occasion: ${profile.occasionLabel} | Intent: ${profile.intentLabels.join(', ')}
Key insight: ${insight.personalitySnapshot}

SHORTLISTED DIRECTIONS:
${directionsText}

Compare these directions and identify the best fit. Respond with a JSON object:

{
  "scores": {
    ${shortlistedItems.map((item, i) => `"${item.direction.id}": {
      "emotionalFit": <1-10>,
      "personalizationPotential": <1-10>,
      "effortLevel": <1-10>,
      "surpriseFactor": <1-10>,
      "meaningfulness": <1-10>,
      "overall": <1-10>
    }`).join(',\n    ')}
  },
  "bestFitId": "The direction ID of the best overall fit",
  "bestFitReason": "2-3 sentences explaining clearly and warmly why this direction is the best choice for this specific person and occasion.",
  "runnerUpId": "The direction ID of the second-best fit (if applicable, else null)",
  "decisionTip": "One piece of practical advice to help the giver make their final decision."
}`;
}

export function buildGiftBriefPrompt(profile, insight, direction, deepDive) {
  return `You are a thoughtful gifting advisor. Generate a final "Gift Brief" summary for ${profile.name}.
  
- CHOSEN DIRECTION: ${direction.title}
- OCCASION: ${profile.occasionLabel}
- WHY IT WORKS: ${deepDive.whyItWorks}
- TOP GIFT IDEAS: ${deepDive.whatGiftsFit.slice(0, 3).join('; ')}

Respond as a JSON object:
{
  "headline": "Punchy 5-10 word title (e.g. 'A gift rooted in shared history')",
  "summary": "2-3 empathetic sentences about why this choice is right and what it will mean.",
  "whyStrongestDirection": "1-2 sentences on why this beats generic alternatives.",
  "shoppingCompass": ["3 brief, specific signals to look for while shopping (max 10 words each)"],
  "whatToAvoid": ["2 brief pitfalls for this direction (max 10 words each)"],
  "thoughtfulUpgrade": ["2-3 simple ways to add extra meaning (max 12 words each)"],
  "topIdea": "The strongest specific idea from the list, tailored to them",
  "personalTouch": "One specific meaningful detail to add",
  "occasionNote": "One sentence about why this matches their ${profile.occasionLabel}"
}`;
}

/**
 * Build the personalized gift note prompt
 * @param {Object} profile - Normalized recipient profile
 * @param {Object} brief - The final gift brief
 * @param {string} giverName - Optional giver name
 * @returns {string} The prompt text
 */
export function buildGiftNotePrompt(profile, brief, giverName = null) {
  const hasMemory = profile.sharedMemory && profile.sharedMemory.trim() !== '';
  
  return `You are helping someone write a heartfelt, personal gift note for someone they care about.

RECIPIENT: ${profile.name || 'the recipient'}
GIVER: ${giverName || 'the giver'}
RELATIONSHIP: ${profile.relationshipLabel} (${profile.closenessLabel})
OCCASION: ${profile.occasionLabel}
PERSONALITY: ${profile.personalityLabels.join(', ')}
INTERESTS: ${profile.interestsList.join(', ')}
GIFT DIRECTION: ${brief.headline}
WHAT THE GIVER WANTS TO EXPRESS: ${profile.intentLabels.join(', ')}
${hasMemory ? `CRITICAL PERSONAL MEMORY/DETAIL: "${profile.sharedMemory}"` : ''}

Write a short, genuine gift note (3-5 sentences). 

CRITICAL INSTRUCTIONS FOR TONE AND STYLE:
- This MUST feel like a real human wrote it. 
- Avoid ALL common AI cliches (e.g., "I hope this gift...", "Wishing you a tapestry of...", "In the symphony of life...").
- Keep it grounded, natural, and emotionally warm. Do not use overly formal phrasing or generic emotional filler.
- It should sound like something a real person would say out loud to them.
${hasMemory ? `- You MUST naturally weave the "CRITICAL PERSONAL MEMORY/DETAIL" into the note. This is the most important part of the prompt.` : ''}
- References their PERSONALITY and INTERESTS naturally (e.g., if they are adventurous, mention their spirit; if they love gardening, hide a metaphor in there).
- Match the intimacy of the relationship (${profile.closenessLabel}).
- End with a warm, conversational closing appropriate to the relationship.

Respond with a JSON object:
{
  "note": "The full gift note text",
  "tone": "One word describing the emotional tone (e.g. 'tender', 'playful', 'warm', 'sincere')"
}`;
}

/**
 * Build the system instruction used across all prompts
 * @returns {string}
 */
export function getSystemInstruction() {
  return `You are The Gift Brief — a wise, emotionally intelligent gifting companion. Your purpose is to help people give gifts that are deeply meaningful, not just expensive or generic. You never recommend specific products to purchase. You speak with warmth, clarity, and genuine care. You understand that the best gifts come from truly knowing someone, not from shopping lists.`;
}
