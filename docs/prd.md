# Global Pantry Chef — Product Requirements Document (PRD)

**Product:** Global Pantry Chef  
**Type:** Responsive web app (mobile-first)  
**Doc purpose:** Source of truth for product scope, behavior, and acceptance criteria.  
**Design reference:** Minimal, high-fidelity aesthetic inspired by https://linear.app (do not copy; use as inspiration for clarity, spacing, and premium simplicity).  
**Last updated:** 2026-02-08

---

## 1) Problem Statement

People want to cook flavorful dishes from around the world, but they:
- Don’t know what to make with what they already have.
- Have dietary restrictions/allergies.
- Have limited time/skill and need guidance.
- Waste ingredients due to poor planning.
- Need substitutions when ingredients are missing.

**Global Pantry Chef** uses AI to generate and adapt global recipes using locally available ingredients, and guides users through cooking step-by-step.

---

## 2) Goals & Success Metrics

### Goals
1. Turn a user’s pantry into viable recipe options quickly.
2. Respect dietary preferences, allergies, skill level, and time constraints.
3. Provide a trustworthy cooking flow (guided mode with timers and substitutions).
4. Make it easy to resume cooking and repeat favorites.

### Success metrics (initial)
- **Activation:** % of users who enter pantry + preferences and view results within first session.
- **Conversion:** % who start “Guided Cooking” from a recipe detail page.
- **Completion:** % who complete a cooking session (reach final step).
- **Retention:** 7-day return rate; “recent recipes” re-opens.
- **Satisfaction proxy:** thumbs up/down per recipe, substitution usage rate.

---

## 3) Target Users & Personas

1. **Busy Explorer**: wants quick dinners, open to global flavors, time-limited.
2. **Diet-Restricted Planner**: needs strict allergy/diet compliance and clear labeling.
3. **Beginner Cook**: needs step-by-step instructions, confidence, and timers.
4. **Budget/Low-waste Cook**: wants to use what’s already available and substitute smartly.

---

## 4) Core User Journeys

### Journey A — “What can I cook tonight?”
1. Enter pantry items as chips/tags.
2. Set preferences (dietary, skill, time).
3. View recipe discovery results with filters/search.
4. Open recipe detail; review substitutions/allergy notes.
5. Start guided cooking; complete steps with timers.
6. Recipe saved in recent; progress saved.

### Journey B — “I’m missing an ingredient mid-cook”
1. In guided mode, tap “I don’t have this.”
2. See suggested substitutions + impact notes (taste/texture/allergens).
3. Apply substitution; ingredients list and step instructions update.
4. Continue cooking.

---

## 5) Functional Requirements (MVP+)

### 5.1 Pantry Input (chips/tags)
**Requirements**
- Add ingredient via input field; press Enter/comma or select suggestion to create a chip.
- Remove chip (x button / backspace behavior).
- Normalize ingredients (trim, lowercase display rules, dedupe).
- Optional quantity/unit per ingredient (can be Phase 2).

**Acceptance criteria**
- Users can add/remove ingredients quickly on mobile.
- Duplicate ingredients are prevented or merged.
- Input remains usable with 50+ ingredients.

---

### 5.2 Preferences
**Inputs**
- Dietary: e.g., vegetarian/vegan/pescatarian/halal/kosher/gluten-free/dairy-free/nut-free (configurable).
- Allergies: explicit allergen list (separate from diet).
- Skill: beginner / intermediate / advanced.
- Time available: slider or presets (15/30/45/60+ minutes).

**Acceptance criteria**
- Preferences persist across sessions.
- Filters affect results ranking and eligibility.
- Allergy constraints are enforced (hard constraint by default).

---

### 5.3 Recipe Discovery (Results Page)
**Requirements**
- Show a list/grid of recipe cards.
- Each card includes: title, cuisine/region tag, time estimate, difficulty, dietary badges, “uses X/Y pantry items”.
- Search bar for recipe names/cuisines/ingredients.
- Filters: time, difficulty, dietary, exclude allergens, cuisine/region.
- Sorting: best match, quickest, easiest, most pantry match.

**Acceptance criteria**
- Search and filters update results within 200ms for local data; otherwise show loading skeleton for network.
- Filters state is reflected in URL/query params (shareable).

---

### 5.4 Recipe Detail Page
**Requirements**
- Recipe overview: image (optional), summary, servings, time, difficulty.
- Ingredients list:
  - Identify which are in pantry vs missing.
  - Provide substitution options for missing items.
- Allergy notes: clearly surfaced; indicate if any ingredient/substitution conflicts with selected allergies.
- “Start Cooking” CTA to guided mode.
- Save/favorite + recent viewing.

**Acceptance criteria**
- Any allergen conflicts are shown before starting guided cooking.
- Substitutions are actionable (apply & update view).

---

### 5.5 Guided Cooking Mode (Step-by-step)
**Requirements**
- Step list broken into discrete steps with:
  - Next / Back navigation.
  - Step progress indicator (e.g., 3 of 10).
  - Inline timers per step (start/pause/reset).
  - “I don’t have this” substitution button contextually (ingredient-based step or ingredient list view).
- Persist cooking progress:
  - Current recipe id
  - Current step index
  - Active timers state (at least remaining time) (best-effort)
  - Applied substitutions

**Acceptance criteria**
- User can leave and resume within same device/session with accurate step position.
- Timer UX is reliable and accessible (keyboard + screen reader support).

---

### 5.6 Save Recent Recipes + Cooking Progress
**Requirements**
- Recent recipes list (last N, e.g., 20).
- For each: last opened time, last step index (if in progress), quick “Resume cooking”.
- Optional favorites (Phase 2) distinct from recents.

**Acceptance criteria**
- Recents and progress survive page refresh and browser restart (local persistence).
- User can clear recents/progress.

---

## 6) Data Model (initial)

### Entities
- **Ingredient**: `id`, `name`, `aliases[]`, `allergenTags[]`
- **PantryItem**: `ingredientId`, `displayName`, `quantity?`, `unit?`, `addedAt`
- **Preferences**: `dietary[]`, `allergies[]`, `skillLevel`, `timeAvailableMinutes`
- **Recipe**: `id`, `title`, `cuisine`, `difficulty`, `timeMinutes`, `ingredients[]`, `steps[]`, `dietaryTags[]`, `allergenTags[]`
- **RecipeIngredient**: `ingredientId`, `displayName`, `quantityText`, `optional`, `substitutions[]`
- **Substitution**: `id`, `ingredientId`, `substituteIngredientId`, `reason`, `impactNotes`, `allergenTags[]`
- **CookingSession**: `sessionId`, `recipeId`, `currentStepIndex`, `appliedSubstitutions[]`, `timerStates[]`, `startedAt`, `updatedAt`, `status`

---

## 7) Non-Functional Requirements

- **Performance:** 90+ Lighthouse performance on landing and core pages (target).
- **Accessibility:** WCAG 2.1 AA basics (focus states, semantic landmarks, contrast).
- **Security/Privacy:** Preferences/allergies stored locally by default; avoid collecting personal data in MVP.
- **Reliability:** App usable offline for recents/progress; recipe data may require network depending on architecture.
- **Observability (Phase 2):** basic event logging (search, filter apply, start cooking, complete).

---

## 8) UX/Design Principles (product-level)

- Minimal UI, high clarity, premium spacing.
- Prefer progressive disclosure (show details when needed).
- Trust and safety: allergy info should be hard to miss.
- “Fast path” to start cooking; avoid forcing account creation in MVP.

---

## 9) Scope, Phasing, and Milestones

### Phase 0 — Foundation
- App shell, routing, layout, base components, persistence layer, design tokens.

### Phase 1 — Core MVP
- Pantry input
- Preferences
- Discovery results (search + filters)
- Recipe detail (substitutions + allergy notes)
- Guided cooking mode (steps + timers)
- Recent recipes + progress restore

### Phase 2 — Enhancements
- Accounts + sync
- Favorites/collections
- Grocery list
- Nutrition info
- Meal planning

---

## 10) Out of Scope (for MVP)
- Payments/subscriptions
- Social/community features
- Full nutrition certification / medical claims
- Multi-device sync (unless specified)

---

## 11) Open Questions (tracked)
- Recipe source: internal dataset vs external API vs AI generation?
- Allergy handling strictness (hard block vs warnings)?
- Offline requirements for recipes vs only sessions/recents?
- Localization (units, languages) timeline?

---

## 12) Definition of Done (for MVP release)
- All Phase 1 features implemented with acceptance criteria met.
- Responsive UI across mobile/tablet/desktop.
- Basic accessibility pass (keyboard navigation, labels, contrast).
- Local persistence for pantry/preferences/recents/sessions verified.
- Clear error states and empty states for each page.