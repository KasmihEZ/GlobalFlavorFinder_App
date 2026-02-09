# Global Pantry Chef — Styleguide (Design System)
**Purpose:** Single source of truth for UI styling and component rules.  
**Reference inspiration:** https://linear.app (inspiration for clarity, spacing, premium minimalism; do not copy).  
**Rule:** Do not invent styles ad-hoc. If a needed rule is missing, add it here first.

---

## 1) Design Principles
- **Minimal, premium, quiet:** whitespace-forward layout; avoid visual noise.
- **Clarity > decoration:** every element supports comprehension and flow.
- **Consistent surfaces:** subtle borders, soft shadows, restrained gradients.
- **Fast scanning:** strong type hierarchy; concise labels; predictable UI.
- **Accessible by default:** keyboard, focus, contrast, touch targets.

---

## 2) Layout & Grid
### Page container
- Max content width: **1200px**
- Horizontal padding: **16px (mobile)**, **24px (tablet)**, **32px (desktop)**
- Vertical section spacing: **48–96px** depending on section importance.

### Breakpoints (mobile-first)
- **sm:** 480px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1200px+

### Grid
- Mobile: single-column
- Desktop: 12-column grid (use only when needed); prefer simple responsive stacks.

---

## 3) Color System
### Palette (semantic tokens)
- `--bg`: `#FFFFFF`
- `--bg-elevated`: `#FFFFFF`
- `--bg-muted`: `#F8F8F8`
- `--text`: `#111111`
- `--text-muted`: `#666666`
- `--border`: `#E6E6E6`
- `--shadow`: `rgba(0,0,0,0.08)`

### Brand accent (use sparingly)
- `--accent`: `#5E5CE6`
- `--accent-hover`: `#4F4BBF`
- Accent usage: primary highlights, links, focus rings, selected states. Avoid large accent blocks.

### Status colors
- Success: `#1F9D55`
- Warning: `#B7791F`
- Danger: `#D64545`
- Info: `--accent`

### Gradients
- Allowed only for **hero backgrounds** and **subtle depth**, e.g. `linear-gradient(135deg, #FFF 0%, #F8F8F8 100%)`.

---

## 4) Typography
### Font family
- System stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`

### Scale (guideline)
- H1: **48px / 1.15**, weight **700**, letter-spacing **-1px**
- H2: **32px / 1.2**, weight **650**, letter-spacing **-0.6px**
- H3: **20px / 1.3**, weight **600**, letter-spacing **-0.3px**
- Body: **16px / 1.6**, weight **400**
- Small: **14px / 1.5**, weight **400**
- Micro: **12px / 1.4**, weight **500** (labels/badges)

### Rules
- Use **tight letter-spacing** for headlines only.
- Prefer sentence case for headings and labels.
- Limit paragraphs to **~60–75 characters** per line for readability.

---

## 5) Spacing & Sizing
### Spacing scale (px)
- `--space-1`: 4
- `--space-2`: 8
- `--space-3`: 12
- `--space-4`: 16
- `--space-5`: 24
- `--space-6`: 32
- `--space-7`: 48
- `--space-8`: 64
- `--space-9`: 96

### Touch targets
- Minimum interactive height: **44px**
- Chip height: **32–36px**
- Icon button: **40–44px**

---

## 6) Radius, Borders, Shadows
- Radius:
  - `--radius-sm`: 6px
  - `--radius-md`: 10px
  - `--radius-lg`: 14px
- Border: 1px `--border` (avoid heavy outlines)
- Shadows (subtle only):
  - Elevation 1: `0 1px 4px rgba(0,0,0,0.06)`
  - Elevation 2: `0 8px 24px rgba(0,0,0,0.08)`

---

## 7) Motion
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Duration:
  - Fast: **120–160ms** (hover/focus)
  - Base: **200–280ms** (enter/exit, modal)
- Motion should communicate state changes; avoid gimmicks.

---

## 8) Core Components (specs)
### 8.1 Buttons
**Variants**
- Primary: solid `--text` background, white text
- Secondary: transparent background, 1px border
- Tertiary/link: text-only, subtle hover background

**Rules**
- Height: 44px
- Padding: 12px 18–24px
- Hover: slight lift (optional) + shadow increase
- Disabled: reduce opacity, no shadow, cursor default
- Loading: spinner + preserve width

### 8.2 Inputs
- Height: 44px
- Background: `--bg`
- Border: 1px `--border`
- Focus: visible focus ring using `--accent` (2px)

### 8.3 Chips / Tags (Pantry)
**Chip anatomy**
- Label (ingredient name)
- Optional leading icon (rare)
- Remove “x” button

**Behavior**
- Enter/comma creates chip
- Backspace on empty input removes last chip
- Prevent duplicates (case-insensitive)
- Chips wrap to new lines; input stays at end

**States**
- Default: light border, minimal fill
- Selected (if applicable): subtle tinted background using `rgba(accent, 0.08)`
- Error chip: danger border + icon (only when needed)

### 8.4 Cards (Recipe cards)
- Border 1px `--border`, radius `--radius-lg`
- Hover: small elevation increase + border darken
- Contents:
  - Title
  - Cuisine badge
  - Time + difficulty
  - Pantry match indicator (e.g., “Uses 7/10”)

### 8.5 Badges
- Compact pill with 12–14px text
- Muted background; strong text contrast
- Use for: dietary, cuisine, allergens (danger tone)

### 8.6 Filters (Discovery)
- Use a filter bar with:
  - Search input
  - Filter chips or dropdowns
  - Sort control
- Keep filter UI compact; overflow into a bottom sheet/drawer on mobile.

### 8.7 Stepper (Guided Cooking)
- Header shows:
  - Step count (e.g., 3/10)
  - Step title (optional)
- Controls:
  - Next / Back buttons (sticky bottom on mobile)
- Each step supports:
  - Timer module (if present)
  - “I don’t have this” substitution action (contextual)
- Persist progress after every navigation.

### 8.8 Timer
- Inline timer with:
  - Start/Pause
  - Reset
  - Remaining time
- Use OS/browser timer; don’t rely on perfect background timing (best-effort).
- Provide audible/visual completion indication (phase 2 if needed).

### 8.9 Alerts / Notices
- Info (accent tint), Warning, Danger
- Use for allergy conflicts and substitution warnings
- Must be readable, scannable, and non-dismissable if blocking.

---

## 9) Accessibility Requirements
- Keyboard navigation for all interactive elements.
- Visible focus state (do not remove outline without replacement).
- Contrast: target WCAG AA (text on background).
- Use semantic landmarks: `header`, `nav`, `main`, `footer`.
- Form labels: explicit labels and helpful error text.
- Announce step changes in guided cooking (ARIA live region if needed).

---

## 10) Content & Voice
- Tone: confident, calm, practical.
- Avoid hype words (e.g., “revolutionary”).
- Prefer action labels:
  - “Start cooking”
  - “Resume”
  - “Find recipes”
  - “Apply substitution”

---

## 11) CSS Token Template (reference)
Use CSS variables aligned to the tokens above (example structure):

```css
:root {
  --bg: #ffffff;
  --bg-muted: #f8f8f8;
  --text: #111111;
  --text-muted: #666666;
  --border: #e6e6e6;

  --accent: #5e5ce6;
  --accent-hover: #4f4bbf;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
}
```

---

## 12) Change Control
Any new UI pattern must be added here:
1. Define tokens if needed
2. Define component anatomy + states
3. Define responsive behavior
4. Define accessibility notes