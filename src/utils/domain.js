/**
 * Domain Logic & Business Rules
 * Recipe ranking, filtering, and validation
 */

/**
 * Normalize ingredient name (lowercase, trim)
 */
export function normalizeIngredient(name) {
  return name.toLowerCase().trim();
}

/**
 * Deduplicate pantry items (case-insensitive)
 */
export function dedupePantry(items) {
  const seen = new Set();
  return items.filter(item => {
    const normalized = normalizeIngredient(item);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

/**
 * Calculate pantry match score for a recipe
 */
export function calcPantryMatchScore(recipe, pantryItems) {
  const pantryNormalized = pantryItems.map(normalizeIngredient);
  let matchCount = 0;
  recipe.ingredients.forEach(ing => {
    if (pantryNormalized.includes(normalizeIngredient(ing.name))) {
      matchCount++;
    }
  });
  return {
    matchCount,
    totalCount: recipe.ingredients.length,
    percentage: (matchCount / recipe.ingredients.length) * 100,
  };
}

/**
 * Check if recipe has allergens matching user allergies
 */
export function recipeHasAllergens(recipe, userAllergies) {
  if (!userAllergies || userAllergies.length === 0) return false;
  return recipe.allergenTags.some(allergen =>
    userAllergies.some(userAllergen =>
      normalizeIngredient(allergen) === normalizeIngredient(userAllergen)
    )
  );
}

/**
 * Build allergy warning message
 */
export function buildAllergyWarning(recipe, userAllergies) {
  const conflicts = recipe.allergenTags.filter(allergen =>
    userAllergies.some(userAllergen =>
      normalizeIngredient(allergen) === normalizeIngredient(userAllergen)
    )
  );
  if (conflicts.length === 0) return null;
  return `⚠️ This recipe contains: ${conflicts.join(', ')}`;
}

/**
 * Find missing ingredients in a recipe
 */
export function findMissingIngredients(recipe, pantryItems) {
  const pantryNormalized = pantryItems.map(normalizeIngredient);
  return recipe.ingredients.filter(ing =>
    !pantryNormalized.includes(normalizeIngredient(ing.name))
  );
}

/**
 * Search recipes by title or cuisine
 */
export function searchRecipes(recipes, query) {
  if (!query || query.trim() === '') return recipes;
  const normalized = normalizeIngredient(query);
  return recipes.filter(recipe =>
    normalizeIngredient(recipe.title).includes(normalized) ||
    normalizeIngredient(recipe.cuisine).includes(normalized)
  );
}

/**
 * Rank recipes based on multiple factors
 */
export function rankRecipes(
  recipes,
  pantryItems,
  userAllergies = [],
  timeAvailable = 60,
  skillLevel = 'beginner',
  showBlockedRecipes = false,
  showLongerRecipes = false
) {
  const skillMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const userSkillLevel = skillMap[skillLevel] || 1;

  const ranked = recipes
    .filter(recipe => {
      // Filter by allergies (unless toggled)
      const hasAllergens = recipeHasAllergens(recipe, userAllergies);
      if (hasAllergens && !showBlockedRecipes) return false;

      // Filter by time (unless toggled)
      if (recipe.timeMinutes > timeAvailable && !showLongerRecipes) return false;

      return true;
    })
    .map(recipe => {
      let score = 100; // Base score

      // Pantry match (40 points max)
      const pantryScore = calcPantryMatchScore(recipe, pantryItems);
      score += (pantryScore.percentage / 100) * 40;

      // Skill match (30 points max)
      const recipeSkillMap = { beginner: 1, intermediate: 2, advanced: 3 };
      const recipeSkill = recipeSkillMap[recipe.difficulty] || 1;
      const skillDiff = Math.abs(userSkillLevel - recipeSkill);
      score += Math.max(0, 30 - skillDiff * 15);

      // Time match (20 points max)
      const timeDiff = Math.abs(recipe.timeMinutes - timeAvailable);
      score += Math.max(0, 20 - timeDiff * 0.1);

      // Allergen penalty
      if (recipeHasAllergens(recipe, userAllergies)) {
        score -= 10; // Penalize recipes with allergens (even if showing)
      }

      return { recipe, score, blocked: false };
    })
    .sort((a, b) => b.score - a.score);

  return ranked;
}