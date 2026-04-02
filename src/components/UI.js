export function Loader(message = 'Thinking...') {
  return `
    <style>
      @keyframes slowReveal {
        0% { opacity: 0; }
        85% { opacity: 0; }
        100% { opacity: 1; }
      }
      .loader-hint {
        opacity: 0;
        animation: slowReveal 5s forwards;
        font-size: 0.9rem;
        color: var(--color-text-light);
        margin-top: 1rem;
        text-align: center;
        max-width: 280px;
        line-height: 1.4;
      }
    </style>
    <div class="loader-container animate-fade-in" style="flex-direction: column; align-items: center; display: flex;">
      <div class="spinner"></div>
      <div class="loader-text">${message}</div>
      <div class="loader-hint">
        Crafting deeply personalized insights.<br/>This usually takes 10-15 seconds ✨
      </div>
    </div>
  `;
}

export function StepIndicator(currentStep, totalSteps = 6) {
  let dots = '';
  for (let i = 0; i < totalSteps; i++) {
    const statusClass = i === currentStep ? 'active' : (i < currentStep ? 'completed' : '');
    dots += `<div class="step-dot ${statusClass}"></div>`;
  }
  
  return `
    <div class="step-indicator">
      ${dots}
    </div>
  `;
}
