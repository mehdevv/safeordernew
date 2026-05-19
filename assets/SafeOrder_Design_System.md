# SafeOrder — Design System
> **Version 1.0** · Source of truth for all UI/UX decisions across the platform.  
> Applies to: E-commerçant interface · Client interface · Admin panel

---

## Table of Contents
1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius & Shadows](#5-border-radius--shadows)
6. [Component Tokens](#6-component-tokens)
7. [Icons & Iconography](#7-icons--iconography)
8. [Motion & Animation](#8-motion--animation)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Dark Mode](#10-dark-mode)
11. [Usage Rules & Anti-patterns](#11-usage-rules--anti-patterns)

---

## 1. Brand Identity

### App Name
```
Safe Order
```
Written as two words, capital S and capital O. Never "safeorder", "safe-order", or "SafeOrder" in public-facing text.

### Logo Mark
- **Shape**: Rounded square (iOS app icon format, radius ~22%)
- **Icon**: Shield with an embedded box/package mark inside
- **Background**: Primary Blue `#0080FF`
- **Icon color**: Pure white `#FFFFFF`
- **Minimum size**: 24×24px (icon only), 80px wide (with wordmark)

### Wordmark
- **Font**: Magnetik — Bold weight
- **Color**: Primary Blue `#0080FF`
- **Tracking**: Default (0)
- **Usage**: Wordmark always appears horizontally next to or below the logo mark. Never stack logo mark above wordmark at small sizes.

### Brand Tagline
```
Smart order management. Full control.
```

### Primary Brand Colors (from brand document)
```
Blue:  #0080FF   ← Primary brand color
Green: #00FF91   ← Secondary / success accent
```

---

## 2. Color System

### CSS Custom Properties (Root Variables)

```css
:root {
  /* ── Brand ──────────────────────────────────────── */
  --color-brand-blue:       #0080FF;
  --color-brand-green:      #00FF91;

  /* ── Primary Palette ────────────────────────────── */
  --color-navy:             #0D3B66;   /* Deep navy — topbars, sidebars, headings */
  --color-blue:             #1A5C99;   /* Mid blue — interactive elements */
  --color-blue-light:       #E8F0FE;   /* Light blue — hover states, card tints */

  --color-green:            #0D6E3F;   /* Success green — confirmed, delivered */
  --color-green-light:      #E6F7EE;   /* Light green — success backgrounds */

  --color-gold:             #F0AE1A;   /* Warning gold — pending, call required */
  --color-gold-light:       #FEF7E0;   /* Light gold — warning backgrounds */

  --color-red:              #C0392B;   /* Danger red — returns, errors, risk */
  --color-red-light:        #FDEDEB;   /* Light red — danger backgrounds */

  --color-purple:           #5B21B6;   /* AI / insights — IA badge */
  --color-purple-light:     #EDE9FE;   /* Light purple — AI backgrounds */

  /* ── Neutrals ───────────────────────────────────── */
  --color-bg-primary:       #FFFFFF;
  --color-bg-secondary:     #F0F2F5;   /* App shell, page backgrounds */
  --color-bg-tertiary:      #E9ECEF;   /* Dividers, empty states */

  --color-text-primary:     #1A1A2E;   /* Body text, labels */
  --color-text-secondary:   #6B7280;   /* Sublabels, metadata */
  --color-text-disabled:    #9CA3AF;   /* Disabled inputs, placeholders */

  --color-border-primary:   #D1D5DB;   /* Input borders */
  --color-border-secondary: #E5E7EB;   /* Card borders */
  --color-border-tertiary:  #F3F4F6;   /* Subtle dividers */

  /* ── Semantic aliases ───────────────────────────── */
  --color-success:          var(--color-green);
  --color-warning:          var(--color-gold);
  --color-danger:           var(--color-red);
  --color-info:             var(--color-blue);
  --color-ai:               var(--color-purple);
}
```

---

### Color Palette Reference

#### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-navy` | `#0D3B66` | Topbar, sidebar, primary buttons, headings |
| `--color-blue` | `#1A5C99` | Links, active states, secondary actions |
| `--color-brand-blue` | `#0080FF` | Logo, wordmark, brand highlights |
| `--color-brand-green` | `#00FF91` | Brand accent (use sparingly, decorative only) |

#### Status Colors

| Token | Hex | Light BG | When to use |
|---|---|---|---|
| `--color-green` | `#0D6E3F` | `#E6F7EE` | Confirmed, delivered, success, Safe Pay paid |
| `--color-gold` | `#F0AE1A` | `#FEF7E0` | Pending, awaiting call, delayed, warning |
| `--color-red` | `#C0392B` | `#FDEDEB` | Return, error, high risk, cancellation |
| `--color-purple` | `#5B21B6` | `#EDE9FE` | AI / Safe Insights badges and features |
| `--color-blue` | `#1A5C99` | `#E8F0FE` | Information, dispatch, new order |

#### Order Pipeline Status Colors

```
Confirmation  → #1A5C99  (Blue)
Préparation   → #0D6E3F  (Green)
Dispatch      → #0E7490  (Teal)
En livraison  → #534AB7  (Indigo)
Livré         → #1A9456  (Bright green)
Retour        → #C0392B  (Red)
```

#### Neutral Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#FFFFFF` | Cards, modals, input backgrounds |
| `--color-bg-secondary` | `#F0F2F5` | Page background, shell |
| `--color-bg-tertiary` | `#E9ECEF` | Skeleton loaders, empty bars |
| `--color-text-primary` | `#1A1A2E` | All body copy, labels, values |
| `--color-text-secondary` | `#6B7280` | Subtitles, metadata, helper text |
| `--color-text-disabled` | `#9CA3AF` | Placeholders, disabled fields |

---

### Color Usage Rules

```
✅ DO
- Use --color-navy for all primary action buttons
- Use status light backgrounds (#E6F7EE etc.) for badge fills
- Use status dark color for badge text on light background
- Use --color-purple exclusively for AI/IA features
- Use --color-gold for anything requiring user attention (not error)

❌ DON'T
- Never use #00FF91 (brand green) on white — contrast is too low for text
- Never use red for warnings — red is reserved for errors and returns only
- Never apply --color-navy as body text color
- Never mix status colors arbitrarily — each color has a fixed semantic meaning
```

---

## 3. Typography

### Primary Typeface

**Magnetik** — Used for all UI text across the product.

```
Font family: 'Magnetik', system-ui, sans-serif
Source: Custom / licensed typeface
```

#### Weight Scale

| Weight Name | CSS Value | Usage |
|---|---|---|
| Light | `300` | Large display text, decorative headers |
| Regular | `400` | Body text, descriptions, input values |
| Semibold | `600` | Labels, section titles, badge text |
| Bold | `700` | Page headings, KPI values, CTAs |

#### Type Scale

```css
/* Display */
--text-display:     26px / 700  /* App name on landing, hero headlines */
--text-h1:          20px / 700  /* Screen titles */
--text-h2:          16px / 600  /* Section headers */
--text-h3:          14px / 600  /* Sub-section headers, card titles */

/* Body */
--text-body-lg:     14px / 400  /* Primary body, order names */
--text-body:        13px / 400  /* Default body text */
--text-body-sm:     12px / 400  /* Secondary info, captions */

/* Labels */
--text-label:       12px / 500  /* Form labels, column headers */
--text-label-sm:    11px / 500  /* Metadata, timestamps, badges */
--text-micro:       10px / 500  /* Dot labels, pill text */
```

#### Line Heights

```css
--leading-tight:    1.2   /* Headings, KPI numbers */
--leading-normal:   1.4   /* Body text */
--leading-relaxed:  1.6   /* Long descriptions, conditions text */
```

#### Letter Spacing

```css
--tracking-tight:   -0.3px   /* Topbar logo, large numbers */
--tracking-normal:   0px     /* Default body */
--tracking-wide:     0.05em  /* Section labels (uppercase) */
--tracking-wider:    0.08em  /* Status labels (uppercase) */
```

#### CSS Implementation

```css
/* Full type scale as CSS custom properties */
:root {
  --font-family: 'Magnetik', system-ui, sans-serif;

  --text-display: 700 26px/1.2 var(--font-family);
  --text-h1:      700 20px/1.3 var(--font-family);
  --text-h2:      600 16px/1.3 var(--font-family);
  --text-h3:      600 14px/1.4 var(--font-family);
  --text-body-lg: 400 14px/1.4 var(--font-family);
  --text-body:    400 13px/1.4 var(--font-family);
  --text-body-sm: 400 12px/1.5 var(--font-family);
  --text-label:   500 12px/1.2 var(--font-family);
  --text-label-sm:500 11px/1.2 var(--font-family);
  --text-micro:   500 10px/1.2 var(--font-family);
}
```

#### Typography Examples

```
Display (26px Bold)
→ "SafeOrder" on landing screen

H1 (20px Bold)
→ Screen title in topbar or dashboard

H2 (16px Semibold)
→ "Vos informations", "Livraison"

Body (13px Regular)
→ Order name: "Nassim T.", product descriptions

Label (12px Medium)
→ "Numéro de téléphone", "Wilaya"

Micro (10px Medium, uppercase)
→ "SAFE PAY ✓", "LIVRÉ", "IA"
```

---

## 4. Spacing & Layout

### Base Unit
**Base = 4px** — All spacing values are multiples of 4.

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
}
```

### Layout Structure

#### Mobile (Client interface — primary)
```
Screen width:     375px (design base)
Horizontal padding: 16px (left + right)
Content width:    343px
Card gap:         12px
Section gap:      20px
```

#### Dashboard (E-commerçant — tablet/desktop)
```
Sidebar width:    52px (collapsed)
Content area:     calc(100% - 52px)
Inner padding:    12px
Card gap:         8px
Stats row gap:    8px
```

#### Admin Panel (Desktop)
```
Sidebar width:    220px (expanded)
Content padding:  24px
Card gap:         16px
Table row height: 48px
```

### Component Spacing

| Component | Padding |
|---|---|
| Button (primary) | `10px 20px` |
| Button (small) | `5px 12px` |
| Input field | `0 10px` (height: 34px) |
| Card | `12px` |
| Order card | `10px 12px` |
| Stat card | `10px 12px` |
| Badge (pill) | `2px 8px` |
| Badge (small) | `3px 8px` |
| Topbar | `10px 16px` |
| Content area | `20px 16px` |
| Cell (table) | `8px 12px` |

---

## 5. Border Radius & Shadows

### Border Radius Scale

```css
:root {
  --radius-sm:    6px;    /* Small chips, micro badges */
  --radius-md:    8px;    /* Inputs, buttons, small cards */
  --radius-lg:    10px;   /* Order cards, stat cards, insight boxes */
  --radius-xl:    12px;   /* Role cards, modal sheets */
  --radius-2xl:   16px;   /* App shell, page containers */
  --radius-pill:  20px;   /* Filter tabs, lang buttons */
  --radius-full:  9999px; /* Avatar, dot indicators, round badges */
}
```

### Shadow Scale

```css
:root {
  --shadow-none:  none;
  --shadow-xs:    0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm:    0 1px 4px rgba(0, 0, 0, 0.08);
  --shadow-md:    0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-lg:    0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-float: 0 16px 40px rgba(0, 0, 0, 0.16);  /* Modals, dropdowns */
}
```

### Border Styles

```css
:root {
  --border-thin:    0.5px solid var(--color-border-secondary);  /* Cards, inputs */
  --border-default: 1px solid var(--color-border-primary);      /* Active states */
  --border-thick:   1.5px solid var(--color-navy);              /* Selected options */
  --border-accent:  3px solid currentColor;                     /* Left accent on retour cards */
}
```

---

## 6. Component Tokens

### Buttons

```css
/* Primary — Navy */
.btn-primary {
  background: var(--color-navy);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font: var(--text-body);
  font-weight: 500;
  width: 100%;
  cursor: pointer;
}

/* Success — Green */
.btn-green {
  background: var(--color-green);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font: var(--text-body);
  font-weight: 500;
  width: 100%;
  cursor: pointer;
}

/* Ghost / Secondary */
.btn-ghost {
  background: transparent;
  color: var(--color-navy);
  border: 0.5px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: 9px 20px;
}

/* Filter tab / pill */
.pill-tab {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: none;
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  font: var(--text-label-sm);
  font-weight: 500;
}
.pill-tab.active {
  background: <status-color>;
  color: #FFFFFF;
}
```

### Input Fields

```css
.input {
  width: 100%;
  height: 34px;
  border: 0.5px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: 0 10px;
  font: var(--text-body);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  outline: none;
  transition: border-color 0.15s;
}
.input:focus {
  border-color: var(--color-navy);
  box-shadow: 0 0 0 3px rgba(13, 59, 102, 0.08);
}
```

### Cards

```css
/* Standard card */
.card {
  background: var(--color-bg-primary);
  border: 0.5px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: 12px;
}

/* Order card */
.order-card {
  background: var(--color-bg-primary);
  border: 0.5px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Accent card (left border) */
.card-accent {
  border-left: 3px solid var(--color-red);   /* or green, navy, gold */
  border-top: 0.5px solid var(--color-border-secondary);
  border-right: 0.5px solid var(--color-border-secondary);
  border-bottom: 0.5px solid var(--color-border-secondary);
}

/* Stat card */
.stat-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  border: 0.5px solid var(--color-border-secondary);
}
```

### Badges / Pills

```css
/* Base badge */
.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

/* Status variants */
.badge-success  { background: #E6F7EE; color: #0D6E3F; }
.badge-warning  { background: #FEF7E0; color: #7A5600; }
.badge-danger   { background: #FDEDEB; color: #791F1F; }
.badge-info     { background: #E8F0FE; color: #0C447C; }
.badge-purple   { background: #EDE9FE; color: #3C3489; }  /* AI */
.badge-navy     { background: #E8F0FE; color: #0D3B66; }  /* New */

/* AI Badge (specific) */
.badge-ai {
  background: #EDE9FE;
  color: #5B21B6;
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-block;
  margin-top: 4px;
}
```

### Status Dot Indicator

```css
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Colors match pipeline statuses */
.dot-confirmation { background: #1A5C99; }
.dot-preparation  { background: #0D6E3F; }
.dot-dispatch     { background: #0E7490; }
.dot-delivery     { background: #534AB7; }
.dot-delivered    { background: #1A9456; }
.dot-return       { background: #C0392B; }
```

### Topbar

```css
.topbar {
  background: var(--color-navy);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-logo {
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.topbar-logo .accent {
  color: var(--color-gold);   /* "Order" word in some contexts */
}
```

### Sidebar (Dashboard)

```css
.sidebar {
  background: var(--color-navy);
  width: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 6px;
}

.sidebar-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  transition: background 0.15s;
}

.sidebar-icon:hover   { background: rgba(255,255,255,0.12); }
.sidebar-icon.active  { background: rgba(255,255,255,0.20); color: #fff; }
```

### Step / Progress Bar

```css
.step-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.step {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: var(--color-bg-tertiary);
}
.step.done   { background: var(--color-green); }
.step.active { background: var(--color-navy); }
```

### Trust Bar

```css
.trust-bar-wrap {
  background: var(--color-bg-tertiary);
  border-radius: 4px;
  height: 6px;
  margin-top: 4px;
}

.trust-bar {
  height: 6px;
  border-radius: 4px;
  background: var(--color-green);
  /* width set dynamically as % of trust score */
}
```

### Language Switcher

```css
.lang-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
}
.lang-btn.active {
  background: var(--color-gold);
  color: var(--color-navy);
  font-weight: 500;
}
```

### Safe Pay Callout Box

```css
.safepay-box {
  background: #FEF7E0;
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  margin-bottom: 12px;
}

.condition-box {
  background: #E6F7EE;
  border: 1px solid var(--color-green);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
}
```

---

## 7. Icons & Iconography

### Style
- **Style**: Outline / filled hybrid — match system icon conventions per OS
- **Size scale**: 12 / 16 / 20 / 24 / 32px
- **Color**: Always inherit from parent context (never hardcoded)
- **Sidebar icons**: 16px, white with reduced opacity unless active

### Emoji Usage
SafeOrder uses emoji as functional icons in several contexts:

| Context | Emoji | Meaning |
|---|---|---|
| Role card | 🏪 | E-commerçant |
| Role card | 🛍️ | Client |
| Role card | 🛡️ | Administrateur |
| Product image placeholder | 👗 🧴 | Product categories |
| AI/Insights | 💡 | Safe Insights |
| Notifications | 🔔 | Alerts |

> **Rule**: Emoji are used only as placeholders and decorative elements. Never as the only indicator of meaning — always pair with text.

---

## 8. Motion & Animation

### Transition Defaults

```css
:root {
  --transition-fast:   0.1s ease;
  --transition-base:   0.15s ease;
  --transition-slow:   0.25s ease;
  --transition-bounce: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Usage Guidelines

```css
/* Hover state on cards */
.role-card {
  transition: border-color var(--transition-base);
}
.role-card:hover {
  border-color: var(--color-navy);
}

/* Tab switching */
.ptab {
  transition: background var(--transition-fast), color var(--transition-fast);
}

/* Input focus ring */
.input:focus {
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

/* Screen/page transitions */
.screen {
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Principles
- Keep animations **functional**, not decorative
- Duration cap: **300ms** for UI transitions
- Avoid animation on frequently repeated elements (list rows)
- Use `prefers-reduced-motion` media query for accessibility

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile-first approach */
:root {
  --bp-sm:  480px;   /* Large phone */
  --bp-md:  768px;   /* Tablet */
  --bp-lg:  1024px;  /* Small desktop */
  --bp-xl:  1280px;  /* Desktop */
  --bp-2xl: 1440px;  /* Large desktop */
}
```

### Interface Targets

| Interface | Primary Target | Notes |
|---|---|---|
| Client (commande, tracking) | Mobile 375px | Mobile-first, no desktop version required |
| E-commerçant dashboard | 768px–1024px | Tablet + desktop |
| Admin panel | 1280px+ | Desktop only |

### Grid Systems

```css
/* Mobile — Single column */
.grid-mobile { display: flex; flex-direction: column; gap: 12px; }

/* Form — 2 columns */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* Stats — 4 columns (dashboard) */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

/* Payment options — 2 columns */
.pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
```

---

## 10. Dark Mode

### Variables Override

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary:       #1C1C1E;
    --color-bg-secondary:     #2C2C2E;
    --color-bg-tertiary:      #3A3A3C;

    --color-text-primary:     #F2F2F7;
    --color-text-secondary:   #AEAEB2;
    --color-text-disabled:    #636366;

    --color-border-primary:   #3A3A3C;
    --color-border-secondary: #2C2C2E;
    --color-border-tertiary:  #1C1C1E;

    /* Brand colors stay the same */
    /* Status colors: slightly lighter for dark context */
    --color-green-light:  rgba(13, 110, 63, 0.2);
    --color-gold-light:   rgba(240, 174, 26, 0.2);
    --color-red-light:    rgba(192, 57, 43, 0.2);
    --color-blue-light:   rgba(26, 92, 153, 0.2);
    --color-purple-light: rgba(91, 33, 182, 0.2);
  }
}
```

> **Note**: Dark mode is secondary. Design and QA in light mode first. The topbar and sidebar remain `--color-navy` (#0D3B66) in both modes.

---

## 11. Usage Rules & Anti-patterns

### ✅ DO

- Use semantic color tokens (`--color-success`, `--color-danger`) rather than raw hex values in components
- Apply `--color-navy` for all primary CTA buttons across all three interfaces
- Keep badge text/background always from the same status color family
- Use `0.5px` borders on cards — thinner than default for a refined feel
- Maintain the Topbar as `--color-navy` across all views (consistency anchor)
- Use `border-radius: var(--radius-pill)` on all filter/tab chips
- Keep AI/Safe Insights elements exclusively purple — do not use purple elsewhere
- Use emoji + text for role cards, never emoji alone

### ❌ DON'T

- Don't use `#00FF91` as a text color on white — insufficient contrast (WCAG fail)
- Don't mix heading sizes freely — respect the type scale hierarchy
- Don't use `box-shadow` on cards that already have a visible border
- Don't use red (`--color-red`) for informational warnings — that's gold's job
- Don't apply the full `--color-navy` (#0D3B66) as body text — use `--color-text-primary`
- Don't add border-radius greater than `--radius-xl` (12px) on rectangular cards
- Don't use font-weight below 400 in interactive elements (readability)
- Don't use more than 3 status colors on the same screen simultaneously
- Don't animate list items in the order pipeline — performance and cognitive load

### Accessibility Minimums

| Pair | Contrast | Pass |
|---|---|---|
| White on `#0D3B66` (navy) | 8.6:1 | ✅ AAA |
| White on `#0D6E3F` (green) | 5.2:1 | ✅ AA |
| White on `#C0392B` (red) | 4.8:1 | ✅ AA |
| `#7A5600` on `#FEF7E0` | 4.6:1 | ✅ AA |
| `#1A1A2E` on `#FFFFFF` | 17.4:1 | ✅ AAA |
| `#6B7280` on `#FFFFFF` | 4.6:1 | ✅ AA |

> Minimum target: **WCAG 2.1 AA** for all text/background pairs.

---

## Quick Reference Card

```
BRAND COLORS      #0080FF · #00FF91
NAVY (primary)    #0D3B66
GREEN (success)   #0D6E3F
GOLD (warning)    #F0AE1A
RED (danger)      #C0392B
PURPLE (AI)       #5B21B6

FONT              Magnetik (Light · Regular · Semibold · Bold)
BASE UNIT         4px
CARD RADIUS       10px
BUTTON RADIUS     8px
SHELL RADIUS      16px

BG PAGE           #F0F2F5
BG CARD           #FFFFFF
TEXT PRIMARY      #1A1A2E
TEXT SECONDARY    #6B7280
BORDER CARD       0.5px solid #E5E7EB
```

---

*SafeOrder Design System — v1.0 — 2025*  
*Maintained by the SafeOrder product team. Update this document with every design decision that becomes a standard.*
