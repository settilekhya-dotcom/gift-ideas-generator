/**
 * The Gift Brief — Constants
 * All static data: gift directions, personality traits, interests, relationships, occasions
 */

// ─── Gift Directions ────────────────────────────────────────────────
export const GIFT_DIRECTIONS = {
  MEMORY_KEEPSAKE: {
    id: 'memory-keepsake',
    title: 'Memory-Based Keepsake',
    emoji: '🎞️',
    tagline: 'A gift rooted in shared history',
    description: 'Gifts that capture and celebrate a meaningful moment, memory, or milestone you share with the recipient.',
    examples: [
      'A photo book of shared memories',
      'A handwritten letter recounting a special moment',
      'A custom illustration of a meaningful place',
      'A time capsule with curated mementos',
      'A scrapbook of your journey together'
    ],
    communicates: 'I remember. I cherish what we\'ve been through. Our story matters to me.',
    personalizationTips: [
      'Reference a specific shared memory or inside joke',
      'Include dates, places, or quotes that hold meaning',
      'Use their handwriting or a photo they love',
      'Add a personal note explaining why this memory matters'
    ],
    scoringWeights: {
      emotionalFit: 0.9,
      personalizationPotential: 0.95,
      effortLevel: 0.8,
      surpriseFactor: 0.7,
      meaningfulness: 0.95
    }
  },
  COMFORT_CARE: {
    id: 'comfort-care',
    title: 'Comfort & Care Gesture',
    emoji: '💝',
    tagline: 'A gift that says "I care about your well-being"',
    description: 'Gifts focused on the recipient\'s comfort, relaxation, or self-care — showing that you pay attention to what they need.',
    examples: [
      'A curated self-care kit tailored to their preferences',
      'A cozy handmade blanket or comfort item',
      'A wellness experience (spa day, meditation retreat)',
      'A home-cooked meal or baked goods with their favorites',
      'A journal with prompts for reflection'
    ],
    communicates: 'I see you. I want you to feel cared for. Your well-being matters to me.',
    personalizationTips: [
      'Include their favorite scents, textures, or flavors',
      'Think about what they need right now, not just what they want',
      'Add a handwritten note about why you chose each item',
      'Consider their current life situation and stressors'
    ],
    scoringWeights: {
      emotionalFit: 0.85,
      personalizationPotential: 0.8,
      effortLevel: 0.6,
      surpriseFactor: 0.5,
      meaningfulness: 0.85
    }
  },
  INTEREST_SURPRISE: {
    id: 'interest-surprise',
    title: 'Interest-Based Surprise',
    emoji: '🎯',
    tagline: 'A gift that shows you truly know them',
    description: 'Gifts that tap into the recipient\'s hobbies, passions, or curiosities — demonstrating that you pay attention to what lights them up.',
    examples: [
      'A book by an author they\'ve been meaning to read',
      'Tools or supplies for their favorite hobby',
      'A class or workshop in something they\'re curious about',
      'A subscription related to their passion',
      'A curated collection tied to their interest'
    ],
    communicates: 'I pay attention to what excites you. I support your passions. I know who you are.',
    personalizationTips: [
      'Go niche — show you know the specific corner of their interest',
      'Combine two of their interests in an unexpected way',
      'Include something they wouldn\'t buy for themselves',
      'Add context about why you chose this specific thing'
    ],
    scoringWeights: {
      emotionalFit: 0.7,
      personalizationPotential: 0.85,
      effortLevel: 0.5,
      surpriseFactor: 0.9,
      meaningfulness: 0.75
    }
  },
  EXPERIENCE_MOMENT: {
    id: 'experience-moment',
    title: 'Experience or Shared Moment',
    emoji: '🌟',
    tagline: 'A gift of time and presence',
    description: 'Gifts that create new memories together — an experience, adventure, or quality time that deepens your bond.',
    examples: [
      'A surprise day trip to a place they\'ve mentioned wanting to visit',
      'Tickets to a show, concert, or event they\'d love',
      'A cooking class or creative workshop to do together',
      'A planned adventure (hiking, stargazing, road trip)',
      'A "day of yes" where you do everything they want'
    ],
    communicates: 'I want to spend time with you. Let\'s make new memories. Our relationship is the real gift.',
    personalizationTips: [
      'Plan around something they\'ve casually mentioned wanting to do',
      'Add thoughtful details (their favorite snacks, a playlist for the drive)',
      'Capture the experience with photos or a small keepsake',
      'Include an element of surprise in the planning'
    ],
    scoringWeights: {
      emotionalFit: 0.85,
      personalizationPotential: 0.75,
      effortLevel: 0.7,
      surpriseFactor: 0.85,
      meaningfulness: 0.9
    }
  }
};

// ─── Personality Traits ─────────────────────────────────────────────
export const PERSONALITY_TRAITS = [
  // Temperament
  { id: 'adventurous', label: 'Adventurous', category: 'temperament' },
  { id: 'calm', label: 'Calm & Grounded', category: 'temperament' },
  { id: 'energetic', label: 'Energetic', category: 'temperament' },
  { id: 'thoughtful', label: 'Thoughtful', category: 'temperament' },
  { id: 'playful', label: 'Playful & Fun-Loving', category: 'temperament' },
  { id: 'reserved', label: 'Reserved & Private', category: 'temperament' },

  // Social
  { id: 'social-butterfly', label: 'Social Butterfly', category: 'social' },
  { id: 'homebody', label: 'Homebody', category: 'social' },
  { id: 'creative', label: 'Creative & Artistic', category: 'social' },
  { id: 'analytical', label: 'Analytical & Logical', category: 'social' },
  { id: 'empathetic', label: 'Empathetic & Caring', category: 'social' },
  { id: 'independent', label: 'Independent', category: 'social' },

  // Values
  { id: 'minimalist', label: 'Minimalist', category: 'values' },
  { id: 'sentimental', label: 'Sentimental', category: 'values' },
  { id: 'practical', label: 'Practical', category: 'values' },
  { id: 'romantic', label: 'Romantic', category: 'values' },
  { id: 'nostalgic', label: 'Nostalgic', category: 'values' },
  { id: 'spontaneous', label: 'Spontaneous', category: 'values' }
];

// ─── Interest Categories ────────────────────────────────────────────
export const INTEREST_CATEGORIES = [
  {
    id: 'creative',
    label: 'Creative & Tech',
    interests: ['Photography', 'Music', 'Gaming', 'Writing', 'Gadgets', 'DIY Projects']
  },
  {
    id: 'active',
    label: 'Active & Outdoors',
    interests: ['Hiking', 'Fitness', 'Travel', 'Sports', 'Gardening']
  },
  {
    id: 'lifestyle',
    label: 'Food & Lifestyle',
    interests: ['Cooking', 'Coffee/Tea', 'Home Decor', 'Reading', 'Wellness']
  }
];

// ─── Relationship Types ─────────────────────────────────────────────
export const RELATIONSHIP_TYPES = [
  { id: 'partner', label: 'Partner / Spouse', icon: '❤️' },
  { id: 'parent', label: 'Parent', icon: '🏠' },
  { id: 'sibling', label: 'Sibling', icon: '👫' },
  { id: 'child', label: 'Child', icon: '🧒' },
  { id: 'best-friend', label: 'Best Friend', icon: '🤝' },
  { id: 'friend', label: 'Friend', icon: '😊' },
  { id: 'colleague', label: 'Colleague / Mentor', icon: '💼' },
  { id: 'grandparent', label: 'Grandparent', icon: '👴' },
  { id: 'relative', label: 'Other Relative', icon: '👪' },
  { id: 'acquaintance', label: 'Acquaintance', icon: '🙂' },
  { id: 'other', label: 'Other', icon: '👤' }
];

// ─── Closeness Levels ───────────────────────────────────────────────
export const CLOSENESS_LEVELS = [
  { id: 'very-close', label: 'Very Close — They\'re my person', value: 5 },
  { id: 'close', label: 'Close — We share a real bond', value: 4 },
  { id: 'warm', label: 'Warm — We care about each other', value: 3 },
  { id: 'friendly', label: 'Friendly — We get along well', value: 2 },
  { id: 'formal', label: 'Formal — We\'re cordial and respectful', value: 1 }
];

// ─── Occasions ──────────────────────────────────────────────────────
export const OCCASIONS = [
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍' },
  { id: 'wedding', label: 'Wedding / Engagement', icon: '💒' },
  { id: 'graduation', label: 'Graduation', icon: '🎓' },
  { id: 'holiday', label: 'Holiday / Festival', icon: '🎄' },
  { id: 'thank-you', label: 'Thank You / Appreciation', icon: '🙏' },
  { id: 'just-because', label: 'Just Because', icon: '💛' },
  { id: 'housewarming', label: 'Housewarming', icon: '🏡' },
  { id: 'baby', label: 'Baby Shower / New Baby', icon: '👶' },
  { id: 'farewell', label: 'Farewell / Going Away', icon: '✈️' },
  { id: 'get-well', label: 'Get Well / Support', icon: '🌻' },
  { id: 'promotion', label: 'Promotion / Achievement', icon: '🏆' },
  { id: 'other', label: 'Other', icon: '🎁' }
];

// ─── Gift Intent ────────────────────────────────────────────────────
export const GIFT_INTENTS = [
  { id: 'express-love', label: 'Express love or deep affection', icon: '❤️' },
  { id: 'show-appreciation', label: 'Show appreciation or gratitude', icon: '🙏' },
  { id: 'make-smile', label: 'Make them smile or laugh', icon: '😄' },
  { id: 'offer-comfort', label: 'Offer comfort or support', icon: '🤗' },
  { id: 'celebrate', label: 'Celebrate their achievement', icon: '🎉' },
  { id: 'surprise', label: 'Surprise and delight them', icon: '✨' },
  { id: 'strengthen-bond', label: 'Strengthen our bond', icon: '🤝' },
  { id: 'inspire', label: 'Inspire or encourage them', icon: '🌟' }
];

// ─── Comparison Criteria ────────────────────────────────────────────
export const COMPARISON_CRITERIA = [
  {
    id: 'emotional-fit',
    label: 'Emotional Fit',
    description: 'How well does this direction match the emotional tone of your relationship?',
    icon: '💗'
  },
  {
    id: 'personalization',
    label: 'Personalization Potential',
    description: 'How much room is there to make this gift uniquely theirs?',
    icon: '✍️'
  },
  {
    id: 'effort',
    label: 'Effort & Thoughtfulness',
    description: 'How much effort does this direction require (and show)?',
    icon: '⚡'
  },
  {
    id: 'surprise',
    label: 'Surprise Factor',
    description: 'How unexpected and delightful would this be for them?',
    icon: '🎊'
  },
  {
    id: 'meaningfulness',
    label: 'Meaningfulness',
    description: 'How deeply meaningful will this gift feel to the recipient?',
    icon: '💎'
  }
];

// ─── Journey Steps ──────────────────────────────────────────────────
export const JOURNEY_STEPS = [
  { id: 'input', label: 'Tell Us About Them', number: 1 },
  { id: 'insight', label: 'AI Insight', number: 2 },
  { id: 'directions', label: 'Explore Directions', number: 3 },
  { id: 'ideas', label: 'Gift Ideas', number: 4 },
  { id: 'compare', label: 'Compare & Decide', number: 5 },
  { id: 'brief', label: 'Your Gift Brief', number: 6 },
  { id: 'card', label: 'Gift Card', number: 7 }
];

// ─── Profiler Form Steps ────────────────────────────────────────────
export const PROFILER_STEPS = [
  { id: 'personality', label: 'Personality', description: 'What are they like?' },
  { id: 'interests', label: 'Interests', description: 'What lights them up?' },
  { id: 'relationship', label: 'Relationship', description: 'How are you connected?' },
  { id: 'occasion', label: 'Occasion', description: 'What\'s the moment?' },
  { id: 'memory', label: 'Shared Memory', description: 'A moment that matters' },
  { id: 'intent', label: 'Gift Intent', description: 'What do you want to say?' }
];

// ─── Avatar Trait Mappings ──────────────────────────────────────────
export const AVATAR_COLORS = {
  adventurous: '#E8734A',
  calm: '#7BA7A7',
  energetic: '#F4C542',
  thoughtful: '#6B7DB3',
  playful: '#E87BAE',
  reserved: '#8B9DAF',
  creative: '#B76EE8',
  sentimental: '#E88B8B',
  practical: '#6BAF6B',
  romantic: '#D46B8D',
  nostalgic: '#C9A96E',
  spontaneous: '#4AC9E8'
};

export const AVATAR_SHAPES = {
  temperament: {
    adventurous: 'star',
    calm: 'circle',
    energetic: 'burst',
    thoughtful: 'hexagon',
    playful: 'wave',
    reserved: 'square'
  },
  values: {
    minimalist: 'circle',
    sentimental: 'heart',
    practical: 'square',
    romantic: 'heart',
    nostalgic: 'diamond',
    spontaneous: 'star'
  }
};
