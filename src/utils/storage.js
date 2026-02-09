/**
 * localStorage Utilities
 * Manages all data persistence
 */

export function getPantry() {
  const pantry = localStorage.getItem('gpc:pantry');
  return pantry ? JSON.parse(pantry) : [];
}

export function setPantry(items) {
  localStorage.setItem('gpc:pantry', JSON.stringify(items));
}

export function getPreferences() {
  const prefs = localStorage.getItem('gpc:preferences');
  return prefs ? JSON.parse(prefs) : {
    dietary: [],
    allergies: [],
    skillLevel: 'beginner',
    timeAvailableMinutes: 60,
    showBlockedRecipes: false,
    showLongerRecipes: false,
  };
}

export function setPreferences(prefs) {
  localStorage.setItem('gpc:preferences', JSON.stringify(prefs));
}

export function cacheRecipe(recipeId, recipe) {
  const cache = localStorage.getItem('gpc:recipe_cache') || '{}';
  const recipes = JSON.parse(cache);
  recipes[recipeId] = recipe;
  localStorage.setItem('gpc:recipe_cache', JSON.stringify(recipes));
}

export function getCachedRecipe(recipeId) {
  const cache = localStorage.getItem('gpc:recipe_cache') || '{}';
  const recipes = JSON.parse(cache);
  return recipes[recipeId] || null;
}

export function addToRecent(recipe) {
  const recent = localStorage.getItem('gpc:recent') || '[]';
  const recipes = JSON.parse(recent);
  recipes.unshift({
    ...recipe,
    addedAt: Date.now(),
  });
  // Keep only last 10
  recipes.splice(10);
  localStorage.setItem('gpc:recent', JSON.stringify(recipes));
}

export function getRecent() {
  const recent = localStorage.getItem('gpc:recent') || '[]';
  return JSON.parse(recent);
}

export function getCookingSession(recipeId) {
  const sessions = localStorage.getItem('gpc:cooking_sessions') || '{}';
  const all = JSON.parse(sessions);
  return all[recipeId] || null;
}

export function saveCookingSession(session) {
  const sessions = localStorage.getItem('gpc:cooking_sessions') || '{}';
  const all = JSON.parse(sessions);
  all[session.recipeId] = session;
  localStorage.setItem('gpc:cooking_sessions', JSON.stringify(all));
}

export function deleteCookingSession(recipeId) {
  const sessions = localStorage.getItem('gpc:cooking_sessions') || '{}';
  const all = JSON.parse(sessions);
  delete all[recipeId];
  localStorage.setItem('gpc:cooking_sessions', JSON.stringify(all));
}