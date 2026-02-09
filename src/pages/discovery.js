/**
 * Discovery Page (Step 3)
 * Search, filter, and display ranked recipes
 */

import { SEED_RECIPES } from '../data/recipes.js';
import { getPantry, getPreferences } from '../utils/storage.js';
import {
  rankRecipes,
  searchRecipes,
  calcPantryMatchScore,
  recipeHasAllergens,
} from '../utils/domain.js';

const SORT_OPTIONS = [
  { value: 'match', label: 'Best Match' },
  { value: 'time', label: 'Quickest' },
  { value: 'difficulty', label: 'Easiest' },
  { value: 'pantry', label: 'Most Pantry Items' },
];

export function renderDiscoveryPage(outlet) {
  const pantryItems = getPantry();
  const prefs = getPreferences();
  const searchQuery = new URLSearchParams(window.location.hash.split('?')[1] || '').get('q') || '';
  const sortBy = new URLSearchParams(window.location.hash.split('?')[1] || '').get('sort') || 'match';

  // Search and filter recipes
  let results = searchRecipes(SEED_RECIPES, searchQuery);

  // Rank recipes based on preferences
  const ranked = rankRecipes(
    results,
    pantryItems,
    prefs.allergies,
    prefs.timeAvailableMinutes,
    prefs.skillLevel,
    prefs.showBlockedRecipes,
    prefs.showLongerRecipes
  );

  // Sort results
  let sorted = ranked.slice();
  if (sortBy === 'time') {
    sorted.sort((a, b) => a.recipe.timeMinutes - b.recipe.timeMinutes);
  } else if (sortBy === 'difficulty') {
    const diffMap = { beginner: 0, intermediate: 1, advanced: 2 };
    sorted.sort((a, b) => diffMap[a.recipe.difficulty] - diffMap[b.recipe.difficulty]);
  } else if (sortBy === 'pantry') {
    sorted.sort((a, b) => {
      const scoreA = calcPantryMatchScore(a.recipe, pantryItems).matchCount;
      const scoreB = calcPantryMatchScore(b.recipe, pantryItems).matchCount;
      return scoreB - scoreA;
    });
  }
  // 'match' is default (already ranked by score)

  outlet.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1>Recipe Discovery</h1>
          <p>${sorted.length} recipe${sorted.length !== 1 ? 's' : ''} found</p>
        </div>

        <!-- Search and Filter Bar -->
        <div class="discovery-controls">
          <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
            <input
              type="text"
              id="search-input"
              class="form-input"
              placeholder="Search recipes by title or cuisine..."
              value="${escapeHtml(searchQuery)}"
              style="flex: 1; min-width: 250px;"
            />
            <select id="sort-select" class="form-select" style="min-width: 150px;">
              ${SORT_OPTIONS.map(opt => `
                <option value="${opt.value}" ${sortBy === opt.value ? 'selected' : ''}>
                  ${opt.label}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Quick filters -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 0.9rem;">
            <span style="color: var(--color-text-muted);">Filters:</span>
            <span class="badge">
              ${prefs.dietary.length > 0 ? prefs.dietary.join(', ') : 'No dietary'}
            </span>
            <span class="badge">
              ${prefs.allergies.length > 0 ? prefs.allergies.join(', ') : 'No allergies'}
            </span>
            <span class="badge">${prefs.skillLevel}</span>
            <span class="badge">${prefs.timeAvailableMinutes} min</span>
            <a href="#/setup/preferences" style="color: var(--color-accent); text-decoration: underline;">Edit</a>
          </div>
        </div>

        <!-- Results Grid -->
        <div class="recipes-grid">
          ${sorted.length > 0 ? sorted.map(({ recipe, blocked }) => {
            const pantryScore = calcPantryMatchScore(recipe, pantryItems);
            const isBlocked = recipeHasAllergens(recipe, prefs.allergies);
            const isLong = recipe.timeMinutes > prefs.timeAvailableMinutes;

            return `
              <a href="#/recipes/${recipe.id}" class="recipe-card">
                <div class="recipe-card-header">
                  <h3>${escapeHtml(recipe.title)}</h3>
                  <div class="recipe-card-badges">
                    <span class="badge">${recipe.cuisine}</span>
                    ${isBlocked && !prefs.showBlockedRecipes ? '' : isBlocked ? '<span class="badge badge-danger">⚠️ Contains allergens</span>' : ''}
                    ${isLong && !prefs.showLongerRecipes ? '' : isLong ? '<span class="badge badge-warning">⏱️ Longer recipe</span>' : ''}
                  </div>
                </div>
                <div class="recipe-card-body">
                  <div style="display: flex; gap: 16px; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 12px;">
                    <span>⏱️ ${recipe.timeMinutes} min</span>
                    <span>📊 ${recipe.difficulty}</span>
                    <span>🛒 ${pantryScore.matchCount}/${pantryScore.totalCount}</span>
                  </div>
                  <p style="color: var(--color-text-muted); font-size: 0.95rem; margin: 0;">
                    ${escapeHtml(recipe.description)}
                  </p>
                </div>
                ${recipe.dietaryTags.length > 0 ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;">
                    ${recipe.dietaryTags.map(tag => `<span class="badge badge-success">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </a>
            `;
          }).join('') : `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
              <p style="color: var(--color-text-muted); font-size: 1rem;">
                No recipes match your criteria. Try adjusting your preferences or search.
              </p>
              <a href="#/setup/preferences" class="btn btn-secondary" style="margin-top: 16px;">
                Edit Preferences
              </a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  setupDiscoveryEvents(outlet);
}

function setupDiscoveryEvents(outlet) {
  const searchInput = outlet.querySelector('#search-input');
  const sortSelect = outlet.querySelector('#sort-select');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      updateUrl({ q: query, sort: sortSelect?.value || 'match' });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sort = e.target.value;
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const query = params.get('q') || '';
      updateUrl({ q: query, sort });
    });
  }
}

function updateUrl(params) {
  const query = params.q || '';
  const sort = params.sort || 'match';
  const hash = query ? `#/recipes?q=${encodeURIComponent(query)}&sort=${sort}` : `#/recipes?sort=${sort}`;
  window.location.hash = hash;
  // Re-render with new params
  setTimeout(() => {
    const outlet = document.getElementById('page-outlet');
    if (outlet) renderDiscoveryPage(outlet);
  }, 0);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}