# Global Pantry Chef - AI Cooking Recipe App

A modern, fully-functional web app that helps you cook dishes from around the world using locally available ingredients.

## 🚀 Quick Start

### Open the App
1. Navigate to: `c:\Users\NIRBO\Downloads\GlobalFlavorFinder_App\app.html`
2. Open in your browser (Chrome, Firefox, Safari, Edge)
3. Start adding ingredients and discovering recipes!

**No server or installation needed** — everything runs in your browser with localStorage persistence.

---

## 📖 How It Works: 5-Step Journey

### Step 1: Pantry 🛒
- Add ingredients you have available
- Type ingredient name + press Enter or comma
- Backspace to remove last ingredient
- All changes auto-save to browser

**Route:** `#/setup/pantry`

### Step 2: Preferences ⚙️
- Select dietary preferences (vegetarian, vegan, etc.)
- Mark allergies and restrictions
- Choose cooking skill level (beginner → advanced)
- Set available cooking time
- Optional: Show recipes with allergens or longer cook times

**Route:** `#/setup/preferences`

### Step 3: Recipe Discovery 🔍
- Browse all 13 recipes
- Search by title or cuisine
- Sort by: Best Match, Quickest, Easiest, or Most Pantry Items
- Filter badges show applied preferences
- Click any recipe to see full details

**Route:** `#/recipes?q=search_term&sort=match`

### Step 4: Recipe Detail 📖
- Full recipe with all ingredients and steps
- **Allergy Gate:** If you have allergies matching recipe, you must acknowledge before proceeding
- **Ingredient Checklist:** Green ✓ (in pantry) or Red ✗ (missing)
- **Substitution Picker:** Click "Substitute?" on missing ingredients to see alternatives
- Full step-by-step instructions with timers
- "Start Cooking" button launches guided mode

**Route:** `#/recipes/:id` (e.g., `#/recipes/pad-thai`)

### Step 5: Guided Cooking 👨‍🍳
- Step-by-step instructions
- Progress bar showing current step
- Timer widget (Start/Pause/Reset) with audio alert
- Back/Next navigation
- **Session Persistence:** Close browser and resume from same step
- Finish cooking → returns to recipes

**Route:** `#/cook/:id` (e.g., `#/cook/pad-thai`)

---

## 🍲 13 Seed Recipes

All recipes are pre-loaded with complete ingredient lists and step-by-step instructions:

1. **Pad Thai** (Thai) — 25 min, Intermediate
2. **Pasta Carbonara** (Italian) — 20 min, Intermediate
3. **Vegetable Biryani** (Indian) — 45 min, Advanced
4. **Shakshuka** (Middle Eastern) — 25 min, Beginner
5. **Sushi Rolls** (Japanese) — 30 min, Intermediate
6. **Butter Chicken** (Indian) — 40 min, Intermediate
7. **Baked Falafel** (Middle Eastern) — 35 min, Beginner
8. **Mushroom Risotto** (Italian) — 35 min, Intermediate
9. **Thai Green Curry** (Thai) — 30 min, Intermediate
10. **Fish Ceviche** (Peruvian) — 20 min, Beginner
11. **Moussaka** (Greek) — 60 min, Advanced
12. **Vegetable Stir-Fry** (Chinese) — 20 min, Beginner

---

## 🎨 Features

✅ **Smart Recipe Ranking**
- Scores recipes based on pantry match, skill level, and available time
- Automatically filters allergies and long recipes

✅ **Ingredient Substitutions**
- 30+ common ingredients with alternatives
- Shows impact notes and allergen conflicts
- Modal picker for easy browsing

✅ **Allergy Safety**
- Hard-blocks recipes with allergens by default
- Optional: Acknowledge and view blocked recipes
- Allergen warnings on all relevant pages

✅ **Session Persistence**
- Pantry items saved across sessions
- Preferences remembered
- Cooking progress resumes after page reload
- Recipes cached for offline viewing

✅ **Responsive Design**
- Mobile-first CSS (works on phone, tablet, desktop)
- Breakpoints: 480px, 768px, 1200px
- Touch-friendly buttons and inputs

✅ **Accessibility**
- Semantic HTML (nav, main, footer, buttons, inputs)
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on interactive elements
- XSS protection on all user text

✅ **No Dependencies**
- Pure HTML5 / CSS3 / JavaScript (ES6 modules)
- No npm packages, no build step
- Works offline after first load
- localStorage for persistence

---

## 📂 File Structure

```
c:\Users\NIRBO\Downloads\GlobalFlavorFinder_App\
├── app.html                    ← APP ENTRY POINT ⭐
├── app-styles.css              ← App component styles
├── styles.css                  ← Landing page styles
├── README.md                   ← This file
├── BUILD_PLAN.md               ← 5-step specifications
├── IMPLEMENTATION.md           ← Build guide (from step 1)
├── docs/
│   ├── prd.md                  ← Product requirements
│   └── styleguide.md           ← Design system
└── src/
    ├── app.js                  ← SPA router (main entry)
    ├── data/
    │   ├── recipes.js          ← 13 seed recipes
    │   └── substitutions.js    ← Ingredient alternatives
    ├── utils/
    │   ├── domain.js           ← Business logic (ranking, filtering)
    │   └── storage.js          ← localStorage utilities
    └── pages/
        ├── pantry.js           ← Step 1: Pantry input
        ├── preferences.js      ← Step 2: User preferences
        ├── discovery.js        ← Step 3: Recipe search/browse
        ├── recipe-detail.js    ← Step 4: Full recipe view
        └── cooking.js          ← Step 5: Guided cooking
```

---

## 🧪 Testing Checklist

### Test Full Journey
```
1. Open app.html
2. Add ingredients: garlic, olive oil, pasta, eggs, cheese
3. Go to Preferences
   - Select "Vegetarian"
   - Select allergy "Dairy" (optional)
   - Select skill "Beginner"
   - Select time "30 minutes"
4. See recipes list
   - Search "pasta" → should filter
   - Sort "Quickest" → order changes
5. Click "Pasta Carbonara"
   - See allergy warning (if dairy selected)
   - Click "Continue" if blocked
   - See ingredients (some green ✓, some red ✗)
   - Try substitution on missing ingredient
6. Click "Start Cooking"
   - See Step 1 of 4
   - If timer exists, click "Start"
   - Click "Next Step" → advances
   - Refresh page → resumes at same step
   - Finish cooking → back to recipes
```

### Test Data Persistence
```
1. Add pantry items
2. Refresh page → items still there ✓
3. Set preferences
4. Refresh page → preferences still there ✓
5. Start cooking recipe
6. Go to step 3
7. Close browser completely
8. Reopen app.html
9. Click "Start Cooking" for same recipe
10. Should be at step 3 ✓
```

### Test Offline Mode
```
1. Load recipe detail page once
2. Open Developer Tools → Network → Offline
3. Refresh page
4. Recipe should still show (cached) ✓
5. Can still navigate within cached recipe
```

---

## 🔧 Troubleshooting

**App won't load?**
- ✓ Make sure you opened `app.html` (not `index.html`)
- ✓ Check browser console (F12 → Console) for errors
- ✓ Try different browser (Chrome, Firefox, Safari)

**Ingredients not saving?**
- ✓ Check if localStorage is enabled
- ✓ Try clearing browser cache and reloading
- ✓ Check browser privacy settings

**Timers not working?**
- ✓ Click a button first (user interaction required)
- ✓ Check browser volume is on
- ✓ Falls back to alert() if Web Audio unavailable

**Search/filter not working?**
- ✓ Type in search box (real-time search)
- ✓ Case-insensitive and partial matches work
- ✓ Try sorting dropdown simultaneously

---

## 🎯 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile Safari (iOS 14+)  
✅ Chrome Mobile (Android 10+)

---

## 📝 Design System

**Colors:**
- Accent: `#5e5ce6` (purple)
- Text: `#111111` (dark)
- Muted: `#666666` (gray)
- Border: `#e6e6e6` (light gray)
- Success: `#1f9d55` (green)
- Danger: `#d64545` (red)

**Spacing:** 4px, 8px, 12px, 16px, 24px, 32px, 48px

**Typography:**
- Body: System sans-serif
- Headings: 600-700 weight
- Monospace: Timers

**Radius:** 6px, 10px, 14px (smooth, minimal)

---

## 🚀 Performance

- **Zero build step** — Just open and run
- **Lightweight** — <50KB total code
- **Fast search** — Real-time with 13 recipes
- **Instant routing** — Hash-based, no server
- **Low memory** — All data in memory + localStorage
- **Mobile optimized** — <1s load time

---

## � Support

This is a client-side only app. No backend server, no API, no registration needed.

For issues, check:
1. Browser console (F12 → Console tab)
2. Check file paths are correct
3. Verify all `.js` files exist in `src/` folder
4. Try in different browser

---

**Built with ❤️ for global cooking enthusiasts**

Happy cooking! 🌍👨‍🍳