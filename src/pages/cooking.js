/**
 * Guided Cooking Page (Step 5)
 * Step-by-step cooking with timers and session persistence
 */

import { SEED_RECIPES } from '../data/recipes.js';
import { getCachedRecipe, getCookingSession, saveCookingSession } from '../utils/storage.js';

export function renderCookingPage(outlet, recipeId) {
  const recipe = SEED_RECIPES.find(r => r.id === recipeId) || getCachedRecipe(recipeId);
  if (!recipe) {
    outlet.innerHTML = '<div class="page"><div class="container"><p>Recipe not found.</p></div></div>';
    return;
  }

  // Load or initialize session
  let session = getCookingSession(recipeId) || {
    recipeId,
    currentStep: 1,
    completedSteps: [],
    timerStates: {},
    substitutions: {},
    startedAt: Date.now(),
  };

  const currentStep = recipe.steps.find(s => s.stepIndex === session.currentStep);
  const isFirstStep = session.currentStep === 1;
  const isLastStep = session.currentStep === recipe.steps.length;
  const totalSteps = recipe.steps.length;

  outlet.innerHTML = `
    <div class="page">
      <div class="container" style="max-width: 800px;">
        <!-- Header -->
        <div style="margin-bottom: var(--space-5);">
          <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 var(--space-2) 0;">
            ${escapeHtml(recipe.title)}
          </h1>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <span style="color: var(--color-text-muted);">Step ${session.currentStep} of ${totalSteps}</span>
            <a href="#/recipes/${recipeId}" style="color: var(--color-accent); text-decoration: none;">← Back to recipe</a>
          </div>
          <!-- Progress bar -->
          <div style="height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; background: var(--color-accent); width: ${(session.currentStep / totalSteps) * 100}%; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Step Content -->
        <div style="margin-bottom: var(--space-7); padding: var(--space-5); background: var(--color-bg-muted); border-radius: var(--radius-lg);">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 var(--space-3) 0;">
            ${escapeHtml(currentStep.title)}
          </h2>
          <p style="font-size: 1.1rem; color: var(--color-text); line-height: 1.8; margin: 0 0 var(--space-4) 0;">
            ${escapeHtml(currentStep.description)}
          </p>

          <!-- Timer (if applicable) -->
          ${currentStep.timerMinutes ? `
            <div id="timer-widget" style="background: var(--color-bg); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4);">
              <div style="text-align: center;">
                <div id="timer-display" style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); font-family: monospace; margin-bottom: var(--space-3);">
                  ${currentStep.timerMinutes}:00
                </div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <button id="timer-start" class="btn btn-primary" style="min-width: 80px;">Start</button>
                  <button id="timer-pause" class="btn btn-secondary" style="min-width: 80px; display: none;">Pause</button>
                  <button id="timer-reset" class="btn btn-secondary" style="min-width: 80px;">Reset</button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Ingredients for this step -->
          ${currentStep.ingredients && currentStep.ingredients.length > 0 ? `
            <div style="background: var(--color-bg); padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4);">
              <h3 style="font-size: 0.95rem; font-weight: 600; margin: 0 0 var(--space-2) 0;">Ingredients for this step:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${currentStep.ingredients.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Navigation -->
        <div style="display: flex; gap: 12px; margin-bottom: var(--space-5);">
          <button id="back-btn" class="btn btn-secondary" ${isFirstStep ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            ← Back
          </button>
          <button id="next-btn" class="btn btn-primary" style="flex: 1;">
            ${isLastStep ? 'Finish Cooking →' : 'Next Step →'}
          </button>
        </div>

        <!-- Quick links -->
        <div style="text-align: center;">
          <a href="#/recipes" style="color: var(--color-accent); text-decoration: none; font-size: 0.9rem;">Exit to Recipes</a>
        </div>
      </div>
    </div>
  `;

  setupCookingEvents(outlet, recipe, session, recipeId);
}

function setupCookingEvents(outlet, recipe, session, recipeId) {
  const backBtn = outlet.querySelector('#back-btn');
  const nextBtn = outlet.querySelector('#next-btn');
  const timerDisplay = outlet.querySelector('#timer-display');
  const timerStart = outlet.querySelector('#timer-start');
  const timerPause = outlet.querySelector('#timer-pause');
  const timerReset = outlet.querySelector('#timer-reset');

  let timerInterval = null;
  let timerRemaining = (session.timerStates[session.currentStep] || (recipe.steps[session.currentStep - 1]?.timerMinutes * 60) || 0);

  // Back button
  if (backBtn && !backBtn.disabled) {
    backBtn.addEventListener('click', () => {
      if (session.currentStep > 1) {
        session.currentStep--;
        saveCookingSession(session);
        renderCookingPage(outlet.parentElement, recipeId);
      }
    });
  }

  // Next button
  nextBtn.addEventListener('click', () => {
    const currentStep = recipe.steps[session.currentStep - 1];
    if (currentStep.stepIndex === recipe.steps.length) {
      // Last step - finish cooking
      localStorage.removeItem(`gpc:cooking_sessions`);
      window.navigateTo('#/recipes');
    } else {
      session.currentStep++;
      saveCookingSession(session);
      renderCookingPage(outlet.parentElement, recipeId);
    }
  });

  // Timer controls
  if (timerStart) {
    timerStart.addEventListener('click', () => {
      timerStart.style.display = 'none';
      timerPause.style.display = 'inline-block';

      timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay(timerRemaining);

        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerStart.style.display = 'inline-block';
          timerPause.style.display = 'none';
          playTimerAlert();
        }

        // Save timer state
        session.timerStates[session.currentStep] = timerRemaining;
        saveCookingSession(session);
      }, 1000);
    });
  }

  if (timerPause) {
    timerPause.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerStart.style.display = 'inline-block';
      timerPause.style.display = 'none';
    });
  }

  if (timerReset) {
    timerReset.addEventListener('click', () => {
      clearInterval(timerInterval);
      const currentStep = recipe.steps[session.currentStep - 1];
      timerRemaining = currentStep.timerMinutes * 60;
      updateTimerDisplay(timerRemaining);
      timerStart.style.display = 'inline-block';
      timerPause.style.display = 'none';
      session.timerStates[session.currentStep] = timerRemaining;
      saveCookingSession(session);
    });
  }

  function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  function playTimerAlert() {
    // Simple beep using Web Audio API (or fall back to visual alert)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      alert('Timer finished!');
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}