# Global Pantry Chef — 5-Step Build Plan

## Step 1: Hash Routing + Pantry Page
**Goal:** Set up client-side routing and build the pantry input interface.

**Deliverables:**
- `src/app.js` — SPA router (hash-based: `#/setup/pantry`, `#/setup/preferences`, etc.)
- `src/pages/pantry.js` — Pantry input page component
- Pantry chips input with Enter/comma/backspace behavior
- Persistence to localStorage on save
- "Next" button → `#/setup/preferences`

**Acceptance Criteria:**
- ✅ Hash routing works; browser back/forward works
- ✅ Can add/remove chips (Enter, comma, backspace)
- ✅ No duplicate ingredients (case-insensitive)
- ✅ Pantry persists across page reload
- ✅ "Next" button saves to localStorage and navigates
- ✅ Design follows `docs/styleguide.md` tokens (colors, spacing, typography)
- ✅ Mobile responsive (480px, 768px breakpoints)
- ✅ Keyboard accessible (Tab, Enter, Delete work)

**Dependencies:**
- `src/utils/domain.js` (normalizeIngredient, dedupePantry)
- `src/utils/storage.js` (getPantry, setPantry)
- `app-styles.css` tokens (colors, spacing, buttons, chips)

---

## Step 2: Preferences Page
**Goal:** Capture dietary, allergy, skill, and time preferences.

**Deliverables:**
- `src/pages/preferences.js` — Preferences page component
- Dietary multi-select (checkboxes): vegetarian, vegan, pescatarian, gluten-free, dairy-free, nut-free
- Allergies multi-select (checkboxes): peanuts, tree nuts, dairy, gluten, soy, shellfish, fish, eggs, sesame
- Skill level (radio buttons): beginner, intermediate, advanced
- Time available (preset buttons): 15/30/45/60/90+ minutes
- Conditional toggles:
  - "Show blocked recipes" (only if allergies selected)
  - "Show longer recipes" (only if time constraint active)
- Persistence to localStorage on change
- "Back" → `#/setup/pantry`, "Find Recipes" → `#/recipes`

**Acceptance Criteria:**
- ✅ All form controls functional and responsive
- ✅ Toggles appear/disappear based on selections
- ✅ Preferences persist across page reload
- ✅ "Back" returns to pantry with state preserved
- ✅ "Find Recipes" saves preferences and navigates
- ✅ Design follows styleguide (form inputs, buttons, spacing)
- ✅ Keyboard accessible (Tab through all controls)
- ✅ Mobile responsive

**Dependencies:**
- `src/utils/storage.js` (getPreferences, setPreferences)
- `app-styles.css` form tokens

---

## Step 3: Recipe Discovery (Results Page)
**Goal:** Display filtered and ranked recipes with search and filters.

**Deliverables:**
- `src/pages/discovery.js` — Discovery results page component
- Search bar for recipe titles/cuisines
- Filter bar (mobile: bottom drawer; desktop: inline):
  - Sort: "Best match", "Quickest", "Easiest", "Most pantry items"
  - Time filter: hide/show based on "Show longer recipes" toggle
  - Difficulty filter: select level
  - Dietary filter: multi-select
  - Allergen filter: multi-select
- Recipe cards grid showing:
  - Title, cuisine badge, time, difficulty, pantry match (X/Y ingredients)
  - Dietary badges (vegetarian, vegan, etc.)
  - Warning badge if recipe is blocked or over-time
- Click recipe card → `#/recipes/:id`
- URL reflects filters for shareability

**Acceptance Criteria:**
- ✅ Search filters recipes by title/cuisine in real-time
- ✅ All filters apply correctly (time, difficulty, dietary, allergens)
- ✅ Blocked recipes hidden by default; visible only with toggle + acknowledgement
- ✅ Over-time recipes hidden by default; visible with toggle
- ✅ Sorting changes result order correctly
- ✅ Pantry match score calculated and displayed
- ✅ Recipe cards link to detail page
- ✅ Filter state reflected in URL query params
- ✅ Design follows styleguide (cards, badges, grid, responsive)
- ✅ Keyboard accessible
- ✅ Mobile drawer works for filters

**Dependencies:**
- `src/data/recipes.js` (SEED_RECIPES)
- `src/utils/domain.js` (rankRecipes, calcPantryMatchScore, searchRecipes, etc.)
- `src/utils/storage.js` (getPantry, getPreferences)
- `app-styles.css` (card, badge, grid styles)

---

## Step 4: Recipe Detail Page
**Goal:** Display full recipe with substitution options and safety checks.

**Deliverables:**
- `src/pages/recipe-detail.js` — Recipe detail page component
- Recipe header: title, cuisine, time, difficulty, servings
- Allergy warning (if user allergens conflict)
- Acknowledgement gate (if recipe is blocked):
  - "⚠️ This recipe contains X, Y, Z (on your allergy list). I understand the risks."
  - Checkbox + "Continue" button to proceed
- Ingredients section:
  - Visual indicators: ✓ (in pantry) / ✗ (missing)
  - "Substitute" button for missing ingredients
  - Substitution picker (modal/drawer):
    - Show options with impact notes
    - Show allergen conflicts for each option
    - "Apply" button updates ingredient list
- Steps preview (brief list)
- "Start Cooking" button → `#/cook/:id`
- Cache full recipe to localStorage on load (offline access)
- Add to recents on page load

**Acceptance Criteria:**
- ✅ Allergy warning displays correctly
- ✅ Blocked recipe shows acknowledgement gate; blocks access until checked
- ✅ Ingredients marked as in-pantry or missing correctly
- ✅ Substitution picker displays all options + impact notes
- ✅ Allergen conflicts shown in picker if applicable
- ✅ Applying substitution updates ingredient list + allergen notes
- ✅ Recipe cached to localStorage for offline viewing
- ✅ Recipe added to recents with timestamp
- ✅ "Start Cooking" button navigates with recipe ID
- ✅ Design follows styleguide (cards, alerts, buttons, responsive)
- ✅ Keyboard accessible (modal accessible)
- ✅ Mobile responsive

**Dependencies:**
- `src/data/recipes.js` (SEED_RECIPES)
- `src/data/substitutions.js` (findSubstitutions)
- `src/utils/domain.js` (findMissingIngredients, buildAllergyWarning)
- `src/utils/storage.js` (cacheRecipe, addToRecent)
- `app-styles.css` (cards, alerts, buttons, modal styles)

---

## Step 5: Guided Cooking Mode
**Goal:** Step-by-step cooking interface with timers, substitutions, and session persistence.

**Deliverables:**
- `src/pages/cooking.js` — Guided cooking page component
- Step stepper:
  - Header: "Step X of Y" + step title
  - Step body: description, any timer, ingredient list for this step
  - Progress indicator (dots or bar)
- Timer widget (per step, if applicable):
  - Display remaining time
  - Start / Pause / Reset buttons
- "I don't have this" button (contextual):
  - Opens substitution picker scoped to step ingredients or all missing
  - Apply substitution → updates ingredient list + allergen notes
- Sticky navigation (mobile):
  - Back / Next buttons
  - Back disabled on step 1, Next disabled on final step
  - Final step shows "Finish Cooking" instead of Next
- Session persistence:
  - Load session on page init (restore step, substitutions, timer states)
  - Save session after every step change
  - Best-effort timer persistence (remaining time stored)

**Acceptance Criteria:**
- ✅ Navigation forward/back through steps works
- ✅ Step content (description, ingredients) displays correctly
- ✅ Timer starts/pauses/resets; remaining time displays
- ✅ "I don't have this" substitution picker works contextually
- ✅ Applying substitution updates ingredient list and allergen notes
- ✅ Session persists after every step change (reload page → resume at same step)
- ✅ Offline mode works (recipe cached locally from detail page)
- ✅ Timer states best-effort persist (remaining time stored/restored)
- ✅ "Finish Cooking" completes session
- ✅ Design follows styleguide (stepper, timer, buttons, responsive)
- ✅ Keyboard accessible (Back/Next via keyboard, Tab through controls)
- ✅ Mobile responsive (sticky nav, readable text on small screens)
- ✅ ARIA live region for step changes (screen reader support)

**Dependencies:**
- `src/data/recipes.js` (SEED_RECIPES)
- `src/data/substitutions.js` (findSubstitutions)
- `src/utils/domain.js` (findMissingIngredients, substitutionHasAllergenConflict)
- `src/utils/storage.js` (getCachedRecipe, getCookingSession, saveCookingSession)
- `app-styles.css` (stepper, timer, buttons, responsive styles)

---

## Common Implementation Rules

**All Steps:**
1. Use `@docs/styleguide.md` as the source of truth for design decisions
2. Use CSS tokens from `app-styles.css` (never hardcode colors/spacing)
3. Use domain functions from `@src/utils/domain.js` (no duplicate logic)
4. Use storage helpers from `@src/utils/storage.js` (localStorage access only)
5. Follow mobile-first responsive design (test at 480px, 768px, 1200px)
6. Keyboard accessible: Tab navigation, Enter/Space to activate, Escape to close modals
7. Test all user journeys per the PRD (`@docs/prd.md`)

---

## Success Metrics

After all 5 steps complete:
- ✅ Full user journey works: Pantry → Preferences → Discovery → Detail → Cooking
- ✅ Offline mode works for cached recipes + guided cooking
- ✅ Allergy safety: blocked recipes hidden by default, visible with toggle + acknowledgement
- ✅ Substitutions work contextually (detail page + cooking mode)
- ✅ Session persistence: resume cooking at same step after reload
- ✅ Mobile-first responsive across all pages
- ✅ Keyboard accessible throughout
- ✅ Design consistent with styleguide

---

**Status:** Plan finalized. Ready for Step 1 implementation.