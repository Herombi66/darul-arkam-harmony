# Theme Implementation Guide

## Overview
- Colors are standardized via CSS variables defined in `src/index.css` using HSL tokens.
- Tailwind maps semantic classes (e.g., `bg-primary`, `text-foreground`) to these variables in `tailwind.config.ts`.
- Dark mode is class-based (`.dark`) and variables swap accordingly.

## Tokens
- Base: `--background`, `--foreground`, `--border`, `--input`, `--ring`.
- Brand: `--primary`, `--secondary`, `--accent` and `*-foreground`, `*-hover`.
- State: `--muted`, `--success`, `--warning`, `--destructive`.
- Layout: `--card*`, `--popover*`, `--sidebar*`.
- Gradients: `--gradient-primary`, `--gradient-secondary`, `--gradient-accent`, `--gradient-hero` use variable-driven HSL.

## Scoping and Inheritance
- Variables live on `:root`; `.dark` overrides are class-applied on the root element.
- The `body` declares `color-scheme: light dark` to align UA defaults with theme variables.
- Use semantic Tailwind classes to consume tokens; avoid hard-coded hex.

## Browser-specific Notes
- WebKit/Safari may render SVG default strokes differently; selectors were normalized to avoid attribute-based filters and use theme classes.
- If subtle differences persist in gradients on P3 displays, optionally add:
  ```css
  @media (color-gamut: p3) {
    :root { /* optional fine-tuning */ }
  }
  ```
- Keep colors in sRGB (HSL) for consistent cross-browser output.

## Interactive States
- Use `hover:bg-primary-hover`, `text-muted-foreground`, etc., to ensure stateful colors remain consistent.
- Transitions rely on `--transition-*` tokens to avoid timing mismatches.

## Charts (Recharts)
- Attribute selectors tied to default strokes were removed; theme selectors set stroke/fill via classes.
- Provide series colors via `ChartConfig` or Tailwind classes to ensure consistency.

## Testing
- Cross-browser tests (`Chromium`, `Firefox`, `WebKit`) validate computed colors for base tokens, gradients, hover, and dark mode.
- Run `npm run test:e2e` after `npm run preview` or let the test runner start the preview server.

## Overrides
- If a browser needs a targeted tweak, add minimal overrides under feature queries (e.g., `@supports`, `@media`) in `src/index.css`, bound to existing variables.