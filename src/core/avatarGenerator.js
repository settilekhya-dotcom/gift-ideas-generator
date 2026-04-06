/**
 * The Gift Brief — Avatar Generator
 * Generates a stylized, deterministic SVG avatar based on the recipient's traits and gender
 */

import { AVATAR_COLORS, AVATAR_SHAPES } from '../utils/constants.js';

/**
 * Generate an SVG string representing the recipient based on their profile
 * @param {Object} profile - Normalized recipient profile
 * @returns {string} The raw SVG string
 */
export function generateAvatarSvg(profile) {
  // 1. Determine colors based on personality
  let dominantTrait = profile.personalityIds[0] || 'thoughtful';
  let primaryColor = AVATAR_COLORS[dominantTrait] || '#2D5A3D';
  let secondaryTrait = profile.personalityIds[1];
  let secondaryColor = secondaryTrait ? (AVATAR_COLORS[secondaryTrait] || '#C9A96E') : '#C9A96E';

  // 2. Determine gender-based silhouette
  const gender = profile.gender || 'other';
  let silhouette = '';

  if (gender === 'female') {
    // Elegant silhouette with longer hair/soft edges
    silhouette = `
      <path d="M40,105 Q40,85 50,75 Q40,70 40,50 A20,20 0 1,1 80,50 Q80,70 70,75 Q80,85 80,105" fill="currentColor" />
      <path d="M40,50 Q40,30 60,30 Q80,30 80,50 Q80,65 70,70 L50,70 Q40,65 40,50" fill="currentColor" />
    `;
  } else if (gender === 'male') {
    // Sharp silhouette with short hair / broader shoulders
    silhouette = `
      <path d="M35,105 Q35,80 50,75 Q45,70 45,55 A15,15 0 1,1 75,55 Q75,70 70,75 Q85,80 85,105" fill="currentColor" />
      <path d="M45,45 Q45,40 60,40 Q75,40 75,45 L75,55 L45,55 Z" fill="currentColor" />
    `;
  } else {
    // Minimal abstract silhouette
    silhouette = `
      <circle cx="60" cy="50" r="20" fill="currentColor" />
      <path d="M30,105 Q30,75 60,75 Q90,75 90,105" fill="currentColor" />
    `;
  }

  // 3. Determine trait-based background shape
  let shapeCategory = profile.dominantPersonalityCategory || 'temperament';
  let shapeValue = profile.personalityIds.find(id => AVATAR_SHAPES[shapeCategory] && AVATAR_SHAPES[shapeCategory][id]);
  let shapeType = shapeValue ? AVATAR_SHAPES[shapeCategory][shapeValue] : 'circle';
  if (!shapeType) shapeType = 'circle';

  let bgShape = '';
  switch (shapeType) {
    case 'star': bgShape = `<polygon points="60,10 75,45 110,48 82,72 90,108 60,88 30,108 38,72 10,48 45,45" />`; break;
    case 'burst': bgShape = `<path d="M60,5 L75,40 L110,30 L90,60 L115,105 L75,85 L60,115 L45,85 L5,105 L30,60 L10,30 L45,40 Z" />`; break;
    case 'hexagon': bgShape = `<polygon points="60,10 105,35 105,85 60,110 15,85 15,35" />`; break;
    case 'heart': bgShape = `<path d="M60,35 A25,25 0 0,1 110,35 A25,25 0 0,1 60,100 A25,25 0 0,1 10,35 A25,25 0 0,1 60,35 Z" />`; break;
    case 'diamond': bgShape = `<polygon points="60,10 110,60 60,110 10,60" />`; break;
    default: bgShape = `<circle cx="60" cy="60" r="50" />`; break;
  }

  // 4. Background tone based on closeness
  let bgColor = '#FDF8F0';
  if (profile.closenessValue >= 4) bgColor = '#FAEBD7';
  else if (profile.closenessValue <= 2) bgColor = '#F2F2F2';

  const size = 120;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.6" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      <rect width="${size}" height="${size}" rx="40" fill="${bgColor}" />
      
      <!-- Trait Background Shape -->
      <g opacity="0.1" fill="${secondaryColor}">
        ${bgShape}
      </g>

      <!-- Humanoid Silhouette -->
      <g filter="url(#softShadow)" color="${primaryColor}">
        ${silhouette}
      </g>

      <!-- Connection Detail -->
      <circle cx="60" cy="60" r="5" fill="white" opacity="0.5" />
      
      <!-- Highlight -->
      <path d="M40,30 Q60,15 80,30" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.3" />
    </svg>
  `.replace(/\s+/g, ' ').trim();
}
