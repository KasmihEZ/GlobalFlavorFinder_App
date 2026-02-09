/**
 * Ingredient Substitutions
 * Provides alternatives for common ingredients
 */

export const SUBSTITUTIONS_MAP = {
  'butter': [
    { name: 'olive oil', reason: 'Use 3/4 amount for cooking', impactNotes: 'Lighter flavor, works well for savory dishes', allergenTags: [] },
    { name: 'coconut oil', reason: 'Use equal amount', impactNotes: 'Adds tropical note', allergenTags: [] },
  ],
  'milk': [
    { name: 'coconut milk', reason: 'Use equal amount', impactNotes: 'Creamier, different flavor', allergenTags: [] },
    { name: 'almond milk', reason: 'Use equal amount', impactNotes: 'Thinner, less creamy', allergenTags: ['tree nuts'] },
    { name: 'oat milk', reason: 'Use equal amount', impactNotes: 'Good substitute, similar texture', allergenTags: ['gluten'] },
  ],
  'egg': [
    { name: 'applesauce', reason: 'Use 0.25 cup per egg', impactNotes: 'Works for baking, adds sweetness', allergenTags: [] },
    { name: 'banana', reason: 'Use 0.25 cup mashed per egg', impactNotes: 'Works for baking, adds sweetness and moisture', allergenTags: [] },
    { name: 'flax egg', reason: 'Mix 1 tbsp ground flax + 3 tbsp water per egg', impactNotes: 'Works for binding in baking', allergenTags: ['sesame'] },
  ],
  'chicken breast': [
    { name: 'turkey breast', reason: 'Use equal amount', impactNotes: 'Similar texture and cook time', allergenTags: [] },
    { name: 'tofu', reason: 'Use 1.5x amount', impactNotes: 'Plant-based, different texture', allergenTags: [] },
    { name: 'tempeh', reason: 'Use equal amount', impactNotes: 'Nutty flavor, firmer texture', allergenTags: ['soy'] },
  ],
  'fish': [
    { name: 'tofu', reason: 'Use 1.5x amount', impactNotes: 'Firm tofu works best', allergenTags: [] },
    { name: 'seitan', reason: 'Use equal amount', impactNotes: 'Chewy texture, neutral flavor', allergenTags: ['gluten'] },
    { name: 'mushrooms', reason: 'Use 1.5x amount', impactNotes: 'Umami flavor', allergenTags: [] },
  ],
  'shrimp': [
    { name: 'scallops', reason: 'Use equal amount', impactNotes: 'Similar cook time', allergenTags: ['shellfish'] },
    { name: 'tofu', reason: 'Use 1.5x amount', impactNotes: 'Plant-based', allergenTags: [] },
    { name: 'mushrooms', reason: 'Use 1.5x amount', impactNotes: 'Umami texture', allergenTags: [] },
  ],
  'cream': [
    { name: 'coconut milk', reason: 'Use equal amount', impactNotes: 'Creamier', allergenTags: [] },
    { name: 'greek yogurt', reason: 'Use equal amount', impactNotes: 'Tangier, lighter', allergenTags: ['dairy'] },
    { name: 'cashew cream', reason: 'Use equal amount', impactNotes: 'Rich and creamy', allergenTags: ['tree nuts'] },
  ],
  'cheese': [
    { name: 'nutritional yeast', reason: 'Use 0.5 tbsp per tbsp cheese', impactNotes: 'Vegan, cheesy flavor', allergenTags: [] },
    { name: 'cashew parmesan', reason: 'Use equal amount', impactNotes: 'Creamy, savory', allergenTags: ['tree nuts'] },
  ],
  'garlic': [
    { name: 'garlic powder', reason: 'Use 0.25 tsp per clove', impactNotes: 'Less pungent', allergenTags: [] },
    { name: 'shallot', reason: 'Use 1 tbsp minced per clove', impactNotes: 'Milder onion flavor', allergenTags: [] },
  ],
  'ginger': [
    { name: 'ginger powder', reason: 'Use 0.25 tsp per tbsp fresh', impactNotes: 'More concentrated', allergenTags: [] },
  ],
  'olive oil': [
    { name: 'vegetable oil', reason: 'Use equal amount', impactNotes: 'Neutral flavor, higher smoke point', allergenTags: [] },
    { name: 'coconut oil', reason: 'Use equal amount', impactNotes: 'Different flavor profile', allergenTags: [] },
  ],
  'soy sauce': [
    { name: 'tamari', reason: 'Use equal amount', impactNotes: 'Gluten-free alternative', allergenTags: [] },
    { name: 'coconut aminos', reason: 'Use equal amount', impactNotes: 'Paleo-friendly', allergenTags: [] },
  ],
  'bread': [
    { name: 'cauliflower rice', reason: 'Use equal amount', impactNotes: 'Low-carb', allergenTags: [] },
    { name: 'gluten-free bread', reason: 'Use equal amount', impactNotes: 'For allergies', allergenTags: [] },
  ],
  'peanuts': [
    { name: 'sunflower seed butter', reason: 'Use equal amount', impactNotes: 'Nut-free', allergenTags: [] },
    { name: 'tahini', reason: 'Use equal amount', impactNotes: 'Nutty flavor', allergenTags: ['sesame'] },
  ],
};

export function findSubstitutions(ingredientName) {
  const normalized = ingredientName.toLowerCase().trim();
  return SUBSTITUTIONS_MAP[normalized] || [];
}