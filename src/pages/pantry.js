/**
 * Pantry Input Page
 * Add ingredients as chips, persist to localStorage
 */

import { getPantry, setPantry } from '../utils/storage.js';
import { normalizeIngredient, dedupePantry } from '../utils/domain.js';

export function renderPantryPage(outlet) {
  const pantryItems = getPantry();

  outlet.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1>What's in your pantry?</h1>
          <p>Add ingredients you have available. We'll suggest recipes using what you have.</p>
        </div>

        <div class="pantry-form" style="max-width: 600px; margin: 0 auto;">
          <div class="form-group">
            <label class="form-label" for="ingredient-input">Add ingredients</label>
            <div class="chips-container" id="chips-container" role="region" aria-label="Ingredient list">
              ${pantryItems.map((item, idx) => `
                <div class="chip">
                  <span>${escapeHtml(item)}</span>
                  <button class="chip-remove" type="button" data-index="${idx}" aria-label="Remove ${escapeHtml(item)}">
                    ✕
                  </button>
                </div>
              `).join('')}
              <input
                type="text"
                id="ingredient-input"
                class="chips-input"
                placeholder="Type ingredient and press Enter or comma"
                autocomplete="off"
              />
            </div>
            <small style="color: var(--color-text-muted); display: block; margin-top: 8px;">
              ${pantryItems.length} ingredient${pantryItems.length !== 1 ? 's' : ''} added
            </small>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 32px;">
            <button id="next-btn" class="btn btn-primary" style="flex: 1;">
              Next → Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set up event listeners
  setupPantryEvents(outlet);
}

function setupPantryEvents(outlet) {
  const input = outlet.querySelector('#ingredient-input');
  const container = outlet.querySelector('#chips-container');
  const nextBtn = outlet.querySelector('#next-btn');
  const removeButtons = outlet.querySelectorAll('.chip-remove');

  let pantryItems = getPantry();

  // Add ingredient on Enter or comma
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const ingredient = input.value.trim();
      if (ingredient) {
        pantryItems = dedupePantry([...pantryItems, ingredient]);
        setPantry(pantryItems);
        input.value = '';
        rerenderPantry();
      }
    }

    // Backspace to remove last chip
    if (e.key === 'Backspace' && input.value === '' && pantryItems.length > 0) {
      pantryItems.pop();
      setPantry(pantryItems);
      rerenderPantry();
    }
  });

  // Remove chip on button click
  removeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      pantryItems.splice(idx, 1);
      setPantry(pantryItems);
      rerenderPantry();
    });
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    setPantry(pantryItems);
    window.navigateTo('#/setup/preferences');
  });

  function rerenderPantry() {
    const parentOutlet = outlet.parentElement;
    renderPantryPage(parentOutlet);
    setupPantryEvents(parentOutlet);
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}