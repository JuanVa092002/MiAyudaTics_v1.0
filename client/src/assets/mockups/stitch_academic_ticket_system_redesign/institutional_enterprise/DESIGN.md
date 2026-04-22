---
name: Institutional Enterprise
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#42474d'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#72787e'
  outline-variant: '#c2c7ce'
  surface-tint: '#3c627f'
  primary: '#001c2e'
  on-primary: '#ffffff'
  primary-container: '#00324d'
  on-primary-container: '#759bba'
  inverse-primary: '#a4cbec'
  secondary: '#226d00'
  on-secondary: '#ffffff'
  secondary-container: '#8afd5d'
  on-secondary-container: '#257400'
  tertiary: '#0a1b2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#203044'
  on-tertiary-container: '#8898b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbe6ff'
  primary-fixed-dim: '#a4cbec'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#224a66'
  secondary-fixed: '#8afd5d'
  secondary-fixed-dim: '#6fdf43'
  on-secondary-fixed: '#052100'
  on-secondary-fixed-variant: '#185200'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin: 32px
  max_width: 1280px
---

## Brand & Style

The design system is engineered for AyudaTIC to project an image of institutional authority, reliability, and technical proficiency. The brand personality is "The Dependable Expert"—a partner that provides clear, fast, and structured assistance. 

The aesthetic follows an **Enterprise Modern** style. It prioritizes functional clarity over decorative flair, utilizing a high-contrast palette and a rigorous layout grid. By blending minimalist principles with professional corporate standards, the UI evokes a sense of stability and speed. Every element is designed to minimize cognitive load, ensuring that users—ranging from administrative staff to technical experts—can navigate complex information with absolute confidence.

## Colors

The color strategy is built on a foundation of "Trust and Vitality." 

- **Deep Navy (#00324D):** The primary anchor. Used for navigation, headers, and primary actions to establish an institutional presence.
- **SENA Green (#39A900):** A strategic accent color. It is used sparingly for success states, primary conversion points, and brand-specific highlights to inject energy and growth into the professional frame.
- **Slate Grays:** A sophisticated range (from Slate-50 to Slate-800) is used for secondary text, borders, and structural divisions. This ensures the interface remains neutral and scalable without the harshness of pure black.
- **AA Compliance:** All text-on-background combinations are strictly monitored to exceed WCAG 2.1 AA standards, ensuring accessibility for all users.

## Typography

This design system utilizes **Public Sans** exclusively. Originally designed for government systems, it provides exceptional legibility and a neutral, professional tone.

The type scale is optimized for "zoom-safe" layouts, using relative units that ensure clarity at 200% magnification. Headlines use a slightly tighter letter-spacing and heavier weight to maintain a strong visual hierarchy, while body text utilizes a generous line-height (1.6) to facilitate long-form reading and data scanning. Labels use a slightly higher weight and optional uppercase styling for immediate categorization.

## Layout & Spacing

The layout is built on a **fixed 12-column grid** centered within a maximum width of 1280px. This ensures stability across desktop resolutions and prevents line lengths from becoming too long for comfortable reading.

The spacing rhythm is governed by an **8px base unit**. Generous whitespace is used between major sections (40px–64px) to create an "uncluttered" feel, while tighter spacing (8px–16px) is reserved for related internal component elements. All containers should use a standard gutter of 24px to maintain consistent vertical alignment across the dashboard and content pages.

## Elevation & Depth

The design system employs a "Low-Contrast Outline" and "Subtle Shadow" approach to depth. 

1.  **Surfaces:** Elements primarily sit on a Light Gray (Slate-50) background, with white cards creating the first level of containment.
2.  **Borders:** Fine, 1px borders in Slate-200 or Slate-300 are the primary method for defining sections. This keeps the interface crisp and "flat."
3.  **Elevation-1:** A single, highly diffused shadow (0px 2px 4px rgba(0, 50, 77, 0.08)) is used for interactive cards and floating menus. This creates a subtle lift without breaking the clean, enterprise aesthetic.
4.  **No Gradients:** Avoid all color gradients. Depth must be achieved through tonal stepping and crisp border definitions.

## Shapes

The shape language is disciplined and geometric. 

We utilize a **Soft (0.25rem)** roundedness for standard UI elements like buttons, inputs, and tags. This "sm" radius provides just enough softness to feel modern while maintaining the architectural rigor of a professional institution. For larger containers like cards or modals, a **Medium (0.5rem)** radius may be used to subtly distinguish them from smaller UI components. 

All borders must be 1px wide; do not use heavy strokes unless indicating a high-focus state.

## Components

### Buttons
- **Primary:** Deep Navy background, white text. No shadow in default state; slight darken on hover.
- **Secondary:** Transparent background, Deep Navy 1px border and text. 
- **Accent:** SENA Green background, white text. Reserved for the single most important call-to-action on a page.

### Input Fields
- **Style:** 1px Slate-300 border, 0.25rem radius.
- **Focus State:** 2px Deep Navy border with a 2px offset "halo" for high visibility.
- **Labels:** Always visible above the field in Label-MD typography.

### Cards
- **Style:** White background, 1px Slate-200 border, 0.5rem radius.
- **Hover:** Transition to Elevation-1 shadow to indicate interactivity.

### Chips & Badges
- **Style:** Flat, no border, using light tints of secondary colors (e.g., Light Green for success, Light Gray for neutral).
- **Typography:** Label-SM, bold.

### Lists & Data Tables
- **Style:** Row-based layout with 1px horizontal dividers in Slate-100.
- **Header:** Slate-50 background, uppercase Label-MD text for column headers.
- **Alignment:** Numbers are always right-aligned; text is left-aligned.

### Additional Components
- **Status Indicators:** Small 8px circles using the accent palette (Green, Amber, Red) for real-time monitoring.
- **Breadcrumbs:** Public Sans SM, Slate-500, to maintain user context within deep information hierarchies.