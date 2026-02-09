/**
 * Recipe Detail Page (Step 4)
 * Full recipe with allergy gate, substitution picker, caching
 */

import { SEED_RECIPES } from '../data/recipes.js';
import { getPantry, getPreferences, cacheRecipe, addToRecent } from '../utils/storage.js';
import {
  findMissingIngredients,
  buildAllergyWarning,
  calcPantryMatchScore,
  recipeHasAllergens,
} from '../utils/domain.js';
import { findSubstitutions } from '../data/substitutions.js';

export function renderRecipeDetailPage(outlet, recipeId) {
  const recipe = SEED_RECIPES.find(r => r.id === recipeId);
  if (!recipe) {
    outlet.innerHTML = '<div class="page"><div class="container"><p>Recipe not found.</p></div></div>';
    return;
  }

  const pantryItems = getPantry();
  const prefs = getPreferences();

  // Cache recipe for offline access
  cacheRecipe(recipeId, recipe);
  addToRecent(recipe);

  // Check allergy conflicts
  const isBlocked = recipeHasAllergens(recipe, prefs.allergies);
  const allergyWarning = buildAllergyWarning(recipe, prefs.allergies);

  // If blocked and user hasn't acknowledged, show gate
  if (isBlocked && !prefs.showBlockedRecipes) {
    renderAllergyGate(outlet, recipe, recipeId);
    return;
  }

  // Normal recipe detail view
  const pantryScore = calcPantryMatchScore(recipe, pantryItems);
  const missingIngredients = findMissingIngredients(recipe, pantryItems);

  outlet.innerHTML = `
    <div class="page">
      <div class="container" style="max-width: 800px;">
        <!-- Header -->
        <div style="margin-bottom: var(--space-7);">
          <a href="#/recipes" style="color: var(--color-accent); text-decoration: none; margin-bottom: var(--space-3); display: inline-block;">← Back to recipes</a>
          <h1 style="font-size: 2.5rem; font-weight: 700; margin: var(--space-3) 0;">${escapeHtml(recipe.title)}</h1>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: var(--space-5);">
            <span class="badge">${recipe.cuisine}</span>
            <span class="badge">⏱️ ${recipe.timeMinutes} min</span>
            <span class="badge">📊 ${recipe.difficulty}</span>
            <span class="badge">🍽️ ${recipe.servings} servings</span>
            <span class="badge">🛒 ${pantryScore.matchCount}/${pantryScore.totalCount} in pantry</span>
          </div>
          <p style="font-size: 1.1rem; color: var(--color-text-muted); margin: 0;">
            ${escapeHtml(recipe.description)}
          </p>
        </div>

        <!-- Allergy Warning (if applicable) -->
        ${allergyWarning ? `
          <div class="alert alert-danger" style="margin-bottom: var(--space-5);">
            ${escapeHtml(allergyWarning)}
          </div>
        ` : ''}

        <!-- Dietary Badges -->
        ${recipe.dietaryTags.length > 0 ? `
          <div style="margin-bottom: var(--space-5);">
            <h3 style="font-size: 0.95rem; font-weight: 600; margin: 0 0 var(--space-2) 0; color: var(--color-text-muted);">Dietary Info</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${recipe.dietaryTags.map(tag => `<span class="badge badge-success">${tag}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Ingredients -->
        <div style="margin-bottom: var(--space-7);">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 var(--space-4) 0;">Ingredients</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-2);">
            ${recipe.ingredients.map((ing, idx) => {
              const inPantry = pantryItems.some(p => p.toLowerCase() === ing.name.toLowerCase());
              const isMissing = !inPantry;
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: ${inPantry ? 'rgba(31, 157, 85, 0.05)' : 'rgba(214, 69, 69, 0.05)'}; border-radius: var(--radius-md); border-left: 4px solid ${inPantry ? 'var(--color-success)' : 'var(--color-danger)'};">
                  <span>
                    <span style="margin-right: 8px;">${inPantry ? '✓' : '✗'}</span>
                    <span style="font-weight: 500;">${escapeHtml(ing.name)}</span>
                    <span style="color: var(--color-text-muted); margin-left: 8px;">${escapeHtml(ing.quantityText)}</span>
                  </span>
                  ${isMissing ? `
                    <button class="btn-substitute" data-ing="${escapeHtml(ing.name)}" style="
                      background: none;
                      border: none;
                      color: var(--color-accent);
                      cursor: pointer;
                      text-decoration: underline;
                      font-size: 0.9rem;
                      padding: 0;
                    ">
                      Substitute?
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Steps -->
        <div style="margin-bottom: var(--space-7);">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 var(--space-4) 0;">Instructions</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${recipe.steps.map(step => `
              <div style="display: flex; gap: var(--space-4);">
                <div style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background: var(--color-accent);
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 600;
                  flex-shrink: 0;
                ">
                  ${step.stepIndex}
                </div>
                <div style="flex: 1;">
                  <h3 style="font-weight: 600; margin: 0 0 var(--space-2) 0;">${escapeHtml(step.title)}</h3>
                  <p style="color: var(--color-text-muted); margin: 0; line-height: 1.6;">
                    ${escapeHtml(step.description)}
                  </p>
                  ${step.timerMinutes ? `<span class="badge" style="margin-top: var(--space-2);">⏱️ ${step.timerMinutes} min</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CTA -->
        <div style="display: flex; gap: 12px; margin-bottom: var(--space-5);">
          <a href="#/cook/${recipeId}" class="btn btn-primary" style="flex: 1; text-align: center;">
            Start Cooking →
          </a>
          <a href="#/recipes" class="btn btn-secondary">
            Back to Search
          </a>
        </div>
      </div>
    </div>

    <!-- Substitution Modal (hidden) -->
    <div id="substitution-modal" style="
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 200;
      padding: var(--space-4);
    ">
      <div style="
        background: var(--color-bg);
        border-radius: var(--radius-lg);
        max-width: 500px;
        margin: auto;
        padding: var(--space-5);
        max-height: 80vh;
        overflow-y: auto;
      ">
        <h2 style="margin: 0 0 var(--space-4) 0;" id="modal-title">Substitute Ingredient</h2>
        <div id="modal-content"></div>
        <div style="display: flex; gap: 12px; margin-top: var(--space-5);">
          <button class="btn btn-secondary" onclick="document.getElementById('substitution-modal').style.display = 'none';">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;

  setupRecipeDetailEvents(outlet, recipe, recipeId);
}

function renderAllergyGate(outlet, recipe, recipeId) {
  outlet.innerHTML = `
    <div class="page">
      <div class="container" style="max-width: 600px;">
        <div style="margin: var(--space-7) 0; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">⚠️</div>
          <h1 style="font-size: 2rem; font-weight: 700; margin: 0 0 var(--space-4) 0;">Allergen Warning</h1>
          <p style="font-size: 1.1rem; color: var(--color-text-muted); margin: 0 0 var(--space-5) 0;">
            This recipe contains ingredients from your allergy list.
          </p>

          <div class="alert alert-danger" style="text-align: left; margin-bottom: var(--space-5);">
            <strong>Allergens detected:</strong><br>
            ${recipe.allergenTags.map(tag => `<span class="badge badge-danger" style="margin: 4px 4px 0 0;">${tag}</span>`).join('')}
          </div>

          <form id="allergy-form">
            <label class="checkbox-label" style="justify-content: center; margin-bottom: var(--space-5);">
              <input type="checkbox" id="allergy-ack" required>
              <span>I understand the risks and want to proceed</span>
            </label>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-3);">
              Continue to Recipe
            </button>
          </form>

          <a href="#/recipes" class="btn btn-secondary" style="width: 100%;">
            Back to Search
          </a>
        </div>
      </div>
    </div>
  `;

  const form = outlet.querySelector('#allergy-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      renderRecipeDetailPage(outlet, recipeId);
    });
  }
}

function setupRecipeDetailEvents(outlet, recipe, recipeId) {
  const substituteButtons = outlet.querySelectorAll('.btn-substitute');
  const modal = outlet.querySelector('#substitution-modal');

  substituteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ingName = btn.dataset.ing;
      showSubstitutionPicker(outlet, recipe, ingName);
    });
  });

  // Close modal on background click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
      modal.style.display = 'none';
    }
  });
}

function showSubstitutionPicker(outlet, recipe, ingName) {
  const subs = findSubstitutions(ingName);
  const modal = outlet.querySelector('#substitution-modal');
  const content = outlet.querySelector('#modal-content');

  if (!subs || subs.length === 0) {
    content.innerHTML = '<p>No substitutions available for this ingredient.</p>';
  } else {
    content.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${subs.map(sub => `
          <div style="padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
            <h3 style="margin: 0 0 var(--space-2) 0;">${escapeHtml(sub.name)}</h3>
            <p style="color: var(--color-text-muted); font-size: 0.9rem; margin: 0 0 var(--space-2) 0;">
              ${escapeHtml(sub.reason)}
            </p>
            ${sub.allergenTags && sub.allergenTags.length > 0 ? `
              <p style="color: var(--color-warning); font-size: 0.85rem; margin: 0 0 var(--space-2) 0;">
                ⚠️ Allergens: ${sub.allergenTags.join(', ')}
              </p>
            ` : ''}
            <small style="color: var(--color-text-muted); display: block;">
              ${escapeHtml(sub.impactNotes || 'Impact: minimal')}
            </small>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.style.display = 'block';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}