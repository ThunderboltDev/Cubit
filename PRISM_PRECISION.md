# Prism Precision: Design System Rules

A structural, depth-driven design language for Cubit.

## 1. Typography

Cubit uses two font families with strict usage rules.

| Family | Variable | Usage |
|--------|----------|-------|
| **Sans** | `--font-sans` | All UI text, labels, navigation, buttons, paragraphs |
| **Mono** | `--font-mono` | Timer displays, time values, numerical statistics |

## 2. Colors

Cubit uses an OKLCH-based color system with semantic tokens for consistent theming across light and dark modes.

### Base Colors

**Background** (`--background`) — The main page background. Light mode uses a near-white warm gray, dark mode uses a deep charcoal.

**Foreground** (`--foreground`) — Primary text color. High contrast against background.

### Surface Colors

**Secondary** (`--secondary`) — Elevated surfaces such as cards, navigation bars, and grouped items. One step up from base background.

**Secondary Foreground** (`--secondary-foreground`) — Text color optimized for secondary surfaces.

**Muted** (`--muted`) — Subtle backgrounds for secondary details or areas requiring minimal contrast.

**Muted Foreground** (`--muted-foreground`) — Hint text, placeholders, disabled states. Reduced emphasis.

**Inset** (`--inset`) — Sunken surfaces for inputs, pressed states, or recessed containers.

### Semantic Colors

**Accent** (`--accent`) — Primary brand color for interactive highlights, focus rings, and active states.

**Success** (`--success`) — Positive outcomes, personal bests, completion states.

**Warning** (`--warning`) — Cautionary states, inspection countdown, pending actions. Yellow-orange.

**Danger** (`--danger`) — Errors, DNF results, destructive actions.

**Info** (`--info`) — Neutral status information, help text, tips.

### Structural Colors

**Border** (`--border`) — Dividers, outlines, and separators. Subtle opacity for minimal visual noise.

## 3. Elevation & Shadows

Depth is created by combining **Outer Shadows** (elevation) and **Inner Glows** (structural sharpness).

| Level | Utility | Usage |
| :--- | :--- | :--- |
| **Flat** | `shadow-none` | Static elements that shouldn't appear interactive. |
| **Low (sm)** | `shadow-sm` | Small buttons, subtle interactive tags. |
| **Medium (md)** | `shadow-md` | Default cards, standard buttons. |
| **High (lg)** | `shadow-lg` | Floating navigation, modals, popovers. |

### Surface Lifts
To create "layered" depth, use the following patterns:

- **Surface Lift**: `bg-secondary shadow-md border border-border`
- **Surface Inset**: `bg-inset inset-shadow border border-border` (for inputs or pressed states).

## 4. Borders & Radius

- **Borders**: Always use `border-border`. Only use borders on interactive or container elements (Cards, Buttons, Inputs).

- **Radius**: Strictly follow the `--radius` scale.
    - `rounded-sm`: For smaller elements like badges.
    - `rounded-md`: Default for Buttons (0.65rem).
    - `rounded-lg`: Large containers (Cards).

You can use `rounded-full` in appropriate cases.

## 5. Wrappers 

Wrapper utilities control page-level max-width and horizontal margins. Use when you need consistent spacing around content edges.

| Utility      | Max Width |
| :----------- | :-------- |
| `wrapper-xs` | 12rem     |
| `wrapper-sm` | 24rem     |
| `wrapper-md` | 36rem     |
| `wrapper-lg` | 48rem     |
| `wrapper-xl` | 60rem     |

All wrappers apply responsive horizontal margins and center the container. Refer to `app.css` for exact margin calculations.

## 6. Transition & Animation

CSS handles static transitions. Framer Motion handles dynamic gestures, layout changes, and orchestration. Never duplicate the same animation in both systems.

Accordion keyframes (`accordion-down`, `accordion-up`) are reserved exclusively for the Accordion component. Do not use elsewhere.
Easing functions.

### Utilities and Constants

To use easing functions with framer motion import `EASE` from `@/constants/motion.ts`. For CSS use tailwind utility classes

| Utility | Framer Motion|
| :--- | :--- | :--- |
| `ease-spring` | `EASE.spring`|
| `ease-snappy` | `EASE.snappy` | 
| `ease-gentle` | `EASE.gentle` | 

### Usage

Use Tailwind for:
- Hover color/opacity changes
- Focus rings
- Static transforms (`hover:scale-105`)
- Border/shadow transitions

Use Framer Motion for:
- Mount/unmount animations (`AnimatePresence`)
- Layout shifts (`layout` prop)
- Drag and press gestures
- Page transitions
- Exit animations
- Timer state changes
- List reordering

### Hybrid Pattern

Combine both systems for rich interactions:

```tsx
<motion.button
  className="bg-secondary hover:bg-muted transition-colors-fast"
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Press me
</motion.button>
```

## 7. Misc Utilities

- `text-responsive`: Base text size (mobile-first scaling)
- `link`: Styled anchor with hover accent
- `input`: Input element styling
- `pb-mobile-nav`: Safe area padding for mobile navigation
- `focus-ring`: Standardized focus visible ring
- `wrapper-*`: Page-level max-width containers
- `scrollbar-*`: Custom scrollbar styling
