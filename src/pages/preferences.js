/**
 * Preferences Page (Step 2)
 * Capture dietary, allergy, skill, and time preferences
 */

import { getPreferences, setPreferences } from '../utils/storage.js';

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'nut-free', label: 'Nut-free' },
];

const ALLERGY_OPTIONS = [
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'tree nuts', label: 'Tree nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'soy', label: 'Soy' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'fish', label: 'Fish' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'sesame', label: 'Sesame' },
];

const SKILL_OPTIONS = [
  { value: 'beginner', label: 'Beginner (new to cooking)' },
  { value: 'intermediate', label: 'Intermediate (some experience)' },
  { value: 'advanced', label: 'Advanced (very comfortable)' },
];

const TIME_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '90 minutes or more' },
];

export function renderPreferencesPage(outlet) {
  const prefs = getPreferences();

  const dietaryChecked = (value) => prefs.dietary.includes(value) ? 'checked' : '';
  const allergyChecked = (value) => prefs.allergies.includes(value) ? 'checked' : '';
  const skillChecked = (value) => prefs.skillLevel === value ? 'checked' : '';
  const timeChecked = (value) => prefs.timeAvailableMinutes.toString() === value ? 'checked' : '';
  const showBlockedToggle = prefs.allergies.length > 0;
  const showLongerToggle = prefs.timeAvailableMinutes < 90;

  outlet.innerHTML = `
    <div class="page">
      <div class="container" style="max-width: 700px;">
        <div class="page-header">
          <h1>Your Cooking Preferences</h1>
          <p>Help us find recipes that match your needs and constraints.</p>
        </div>

        <form id="preferences-form" class="preferences-form">
          <!-- Dietary Preferences -->
          <fieldset class="form-fieldset">
            <legend class="form-legend">Dietary Preferences (optional)</legend>
            <div class="form-checkboxes">
              ${DIETARY_OPTIONS.map(opt => `
                <label class="checkbox-label">
                  <input type="checkbox" name="dietary" value="${opt.value}" ${dietaryChecked(opt.value)}>
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <!-- Allergies -->
          <fieldset class="form-fieldset">
            <legend class="form-legend">Allergies & Restrictions</legend>
            <div class="form-checkboxes">
              ${ALLERGY_OPTIONS.map(opt => `
                <label class="checkbox-label">
                  <input type="checkbox" name="allergies" value="${opt.value}" ${allergyChecked(opt.value)}>
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <!-- Skill Level -->
          <fieldset class="form-fieldset">
            <legend class="form-legend">Cooking Skill Level</legend>
            <div class="form-radios">
              ${SKILL_OPTIONS.map(opt => `
                <label class="radio-label">
                  <input type="radio" name="skillLevel" value="${opt.value}" ${skillChecked(opt.value)}>
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <!-- Time Available -->
          <fieldset class="form-fieldset">
            <legend class="form-legend">Time Available for Cooking</legend>
            <div class="form-radios">
              ${TIME_OPTIONS.map(opt => `
                <label class="radio-label">
                  <input type="radio" name="timeAvailable" value="${opt.value}" ${timeChecked(opt.value)}>
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <!-- Conditional Toggles -->
          ${showBlockedToggle ? `
            <div class="form-fieldset">
              <label class="checkbox-label">
                <input type="checkbox" id="show-blocked" name="showBlockedRecipes" ${prefs.showBlockedRecipes ? 'checked' : ''}>
                <span><strong>Show recipes with my allergens</strong> (I'll check ingredients carefully)</span>
              </label>
              <small style="color: var(--color-text-muted); display: block; margin-top: 8px;">
                By default, we hide recipes that contain your allergens. Enable this to see all recipes.
              </small>
            </div>
          ` : ''}

          ${showLongerToggle ? `
            <div class="form-fieldset">
              <label class="checkbox-label">
                <input type="checkbox" id="show-longer" name="showLongerRecipes" ${prefs.showLongerRecipes ? 'checked' : ''}>
                <span><strong>Show recipes that take longer</strong> (I have extra time)</span>
              </label>
              <small style="color: var(--color-text-muted); display: block; margin-top: 8px;">
                By default, we hide recipes longer than your available time. Enable this to see all recipes.
              </small>
            </div>
          ` : ''}

          <!-- Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 48px;">
            <button type="button" id="back-btn" class="btn btn-secondary">
              ← Back
            </button>
            <button type="button" id="find-btn" class="btn btn-primary" style="flex: 1;">
              Find Recipes →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  setupPreferencesEvents(outlet);
}

function setupPreferencesEvents(outlet) {
  const form = outlet.querySelector('#preferences-form');
  const backBtn = outlet.querySelector('#back-btn');
  const findBtn = outlet.querySelector('#find-btn');

  // Back button
  backBtn.addEventListener('click', () => {
    window.navigateTo('#/setup/pantry');
  });

  // Find recipes button
  findBtn.addEventListener('click', (e) => {
    e.preventDefault();
    savePreferencesFromForm();
    window.navigateTo('#/recipes');
  });

  // Save preferences on form change (auto-save)
  form.addEventListener('change', () => {
    savePreferencesFromForm();
  });

  function savePreferencesFromForm() {
    const formData = new FormData(form);

    const dietary = Array.from(formData.getAll('dietary'));
    const allergies = Array.from(formData.getAll('allergies'));
    const skillLevel = formData.get('skillLevel') || 'beginner';
    const timeAvailableMinutes = parseInt(formData.get('timeAvailable') || '60', 10);
    const showBlockedRecipes = formData.has('showBlockedRecipes');
    const showLongerRecipes = formData.has('showLongerRecipes');

    const prefs = {
      dietary,
      allergies,
      skillLevel,
      timeAvailableMinutes,
      showBlockedRecipes,
      showLongerRecipes,
    };

    setPreferences(prefs);
  }
}