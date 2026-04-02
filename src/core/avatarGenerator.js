/**
 * The Gift Brief — Avatar Generator
 * Generates a stylized, deterministic SVG avatar based on the recipient's traits
 */

import { AVATAR_COLORS, AVATAR_SHAPES } from '../utils/constants.js';

/**
 * Generate an SVG string representing the recipient based on their profile
 * @param {Object} profile - Normalized recipient profile
 * @returns {string} The raw SVG string
 */
export function generateAvatarSvg(profile) {
  // Determine primary color based on dominant personality traits
  let dominantTrait = profile.personalityIds[0] || 'thoughtful';
  let primaryColor = AVATAR_COLORS[dominantTrait] || '#2D5A3D'; // Fallback to theme dark green

  // Determine secondary color
  let secondaryTrait = profile.personalityIds[1];
  let secondaryColor = secondaryTrait ? (AVATAR_COLORS[secondaryTrait] || '#C9A96E') : '#C9A96E';

  // Determine shape based on dominant category and specific traits
  let shapeCategory = profile.dominantPersonalityCategory || 'temperament';
  let shapeValue = profile.personalityIds.find(id => AVATAR_SHAPES[shapeCategory] && AVATAR_SHAPES[shapeCategory][id]);
  let shapeType = shapeValue ? AVATAR_SHAPES[shapeCategory][shapeValue] : 'circle';

  // Fallbacks if mapping isn't found
  if (!shapeType) shapeType = 'circle';

  const size = 120;
  const cx = size / 2;
  const cy = size / 2;

  // Build the SVG parts
  let shapeSvg = '';

  switch (shapeType) {
    case 'star':
      shapeSvg = `<polygon points="60,20 70,50 100,50 75,70 85,100 60,80 35,100 45,70 20,50 50,50" fill="${primaryColor}" opacity="0.9" />`;
      break;
    case 'burst':
      shapeSvg = `<path d="M60,10 L70,40 L100,30 L80,55 L110,70 L80,75 L90,105 L60,85 L30,105 L40,75 L10,70 L40,55 L20,30 L50,40 Z" fill="${primaryColor}" opacity="0.9" />`;
      break;
    case 'hexagon':
      shapeSvg = `<polygon points="60,15 100,35 100,85 60,105 20,85 20,35" fill="${primaryColor}" opacity="0.9" />
                  <polygon points="60,25 90,42 90,78 60,95 30,78 30,42" fill="none" stroke="${secondaryColor}" stroke-width="3" />`;
      break;
    case 'wave':
      shapeSvg = `<path d="M20,60 Q40,20 60,60 T100,60 Q80,100 60,60 T20,60" fill="${primaryColor}" opacity="0.9"/>
                  <circle cx="60" cy="60" r="15" fill="${secondaryColor}" />`;
      break;
    case 'square':
      shapeSvg = `<rect x="25" y="25" width="70" height="70" rx="10" fill="${primaryColor}" opacity="0.9" />
                  <rect x="35" y="35" width="50" height="50" rx="5" fill="${secondaryColor}" opacity="0.5" />`;
      break;
    case 'diamond':
      shapeSvg = `<polygon points="60,15 100,60 60,105 20,60" fill="${primaryColor}" opacity="0.9" />`;
      break;
    case 'heart':
      shapeSvg = `<path d="M60,35 A20,20 0 0,1 100,35 A20,20 0 0,1 60,85 A20,20 0 0,1 20,35 A20,20 0 0,1 60,35 Z" fill="${primaryColor}" opacity="0.9" />`;
      break;
    case 'circle':
    default:
      shapeSvg = `<circle cx="60" cy="60" r="40" fill="${primaryColor}" opacity="0.9" />
                  <circle cx="60" cy="60" r="25" fill="${secondaryColor}" opacity="0.4" />`;
      break;
  }

  // Determine background based on relationship closeness
  let bgColor = '#FDF8F0'; // Default Cream
  if (profile.closenessValue >= 4) {
    bgColor = '#F5E6D3'; // Warmer Beige for closer relationships
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
    <rect width="${size}" height="${size}" rx="60" fill="${bgColor}" />
    <!-- Subtle background pattern based on adventure score -->
    ${profile.adventureScore >= 2 ? `<circle cx="30" cy="30" r="3" fill="${secondaryColor}" opacity="0.3"/>
                                     <circle cx="90" cy="40" r="4" fill="${secondaryColor}" opacity="0.3"/>
                                     <circle cx="80" cy="90" r="2" fill="${secondaryColor}" opacity="0.3"/>
                                     <circle cx="40" cy="85" r="5" fill="${secondaryColor}" opacity="0.3"/>` : ''}
    ${shapeSvg}
    <!-- Inner highlight -->
    <path d="M${cx},${cy} A20,20 0 0,0 ${cx+15},${cy-15}" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  </svg>`;

  return svg.replace(/\s+/g, ' ').trim();
}
