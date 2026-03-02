---
paths:
  - "src/_includes/**/*.njk"
  - "src/assets/css/**"
  - "src/assets/js/**"
---

# Accessibility (a11y) Guidelines

Target: **WCAG 2.2 Level AA** compliance.

## Current State
The site uses semantic HTML, ARIA attributes on key interactive elements, and proper heading hierarchy. The following areas need improvement.

## Semantic HTML Requirements
- Wrap page content in a `<main>` landmark element (currently missing)
- Use `<nav>`, `<section>`, `<header>`, `<footer>` for all landmark regions
- Every `<section>` should have an accessible name via `aria-labelledby` pointing to its heading, or `aria-label`
- Use `<button>` for interactive elements, not styled `<div>` or `<span>`

## Keyboard Navigation
- **All interactive elements** must be reachable and operable via keyboard (Tab, Enter, Space, Escape, Arrow keys)
- **Skip link**: add a "Skip to main content" link as the first focusable element in `base.njk`
- **Escape key**: close mobile nav, chatbot panel, and any overlay when Escape is pressed
- **Focus trapping**: when chatbot panel or mobile nav is open, trap focus within the panel
- **Arrow keys**: support arrow key navigation in the slideshow dots

## Focus Styles
- **Every interactive element** must have a visible `:focus-visible` style — currently only the theme toggle has one
- Use a consistent focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`
- Apply to: nav links, buttons (`.btn-primary`, `.btn-ghost`), about toggle, chatbot input, chatbot send button, slideshow dots, contact links, social links
- Never use `outline: none` without an alternative visible indicator

## Color & Contrast
- Maintain minimum **4.5:1** contrast ratio for normal text, **3:1** for large text (18px+ or 14px+ bold) in both dark and light themes
- **Do not rely on color alone** to convey information — the skill proficiency dots should include text labels or patterns alongside color
- `--text-muted` values must meet 4.5:1 against their respective backgrounds

## Motion & Animation
- **Add `prefers-reduced-motion` media query** in `style.css` to disable or reduce all animations and transitions:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- The `.reveal` class elements should still become visible — just without animation

## ARIA & Screen Readers
- **Chatbot messages container** (`#chatbot-messages`): add `aria-live="polite"` so new messages are announced
- **Chatbot input**: add an associated `<label>` element (can be visually hidden with `.sr-only` class)
- **Theme toggle**: already has dynamic `aria-label` — maintain this pattern for all toggles
- **Decorative elements**: use `aria-hidden="true"` on section numbers (`.section-number`), decorative SVGs, and the grain overlay
- **Loading states**: announce chatbot typing indicator via `aria-live` region

## Forms
- Every `<input>` must have an associated `<label>` (use `.sr-only` / visually-hidden class if label should not be visible)
- Error messages should be linked to inputs via `aria-describedby`
- Use `autocomplete` attributes where applicable

## Touch Targets
- Minimum interactive target size: **44x44px** (WCAG 2.2 Level AA) — verify chatbot send button, nav toggle, slideshow dots, social links

## Testing
- Test keyboard navigation by tabbing through the entire page without a mouse
- Test with a screen reader (VoiceOver on Mac, NVDA on Windows)
- Verify both dark and light themes pass contrast checks
- Test with `prefers-reduced-motion` enabled in browser dev tools
- Use Lighthouse > Accessibility as a baseline
