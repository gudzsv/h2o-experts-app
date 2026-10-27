# Style guide

The app has no external design file, so this guide records what the CSS already
does. New UI should follow it so screens stay consistent.

## Approach: mobile-first

Base styles target phones (320-375 px). Larger screens add rules with
`min-width` media queries, never the other way round.

```css
.card { /* mobile */ }

@media screen and (min-width: 768px) { /* tablet */ }

@media screen and (min-width: 1440px) { /* desktop */ }
```

Use exactly these two breakpoints and this spelling. Layout widths:

| Viewport | Container | Page padding |
| --- | --- | --- |
| 320-375 px | `min-width: 320px`, `max-width: 375px` | 20 px |
| 768 px and up | `max-width: 768px` | 32 px |
| 1440 px and up | `max-width: 1440px` | 32 px |

## Tokens

Defined in `src/assets/styles/colors.css` (colors, radii, shadow) and
`src/assets/styles/base.css` (`--Animation_cubic`). Do not write hex colors or
repeat radii in components; use a token, and add one first if none fits.

| Token | Value | Use |
| --- | --- | --- |
| `--white` | `#ffffff` | surfaces, text on dark fills |
| `--light-gray` | `#f0eff4` | card backgrounds |
| `--light-green` | `#9be1a0` | accent, primary action |
| `--light-green-hover` | `#87d28d` | accent hover |
| `--dark-blue` | `#323f47` | primary text, dark buttons |
| `--black` | `#2f2f2f` | icon strokes, form text |
| `--error` | `#ef5050` | errors |
| `--gray-muted` | `#bcbcbc` | muted text and borders |
| `--gray-disabled-bg` | `#e6e6e6` | disabled button background |
| `--gray-hover` | `#f4f4f6` | secondary button hover |
| `--dark-blue-a20`, `--dark-blue-a30` | 20% / 30% of `--dark-blue` | borders, disabled text |
| `--black-a60` | 60% of `--black` | secondary text |
| `--border-color`, `--border-color-active` | black at 20% / 40% | input borders |
| `--placeholder`, `--text-span` | black at 60% / 50% | placeholder, helper text |
| `--radius-sm` | `15px` | inputs, popovers, modals, small cards |
| `--radius-lg` | `30px` | pill buttons, large cards |
| `--shadow-card` | `0 4px 50px rgba(0, 0, 0, 0.1)` | floating cards |
| `--Animation_cubic` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | transitions |

Circles use `border-radius: 50%`.

## Typography

- Body: Poppins 400 and 700. Display text (greeting, `h1`): Gilroy 400 and 700.
  Only these weights are loaded; do not use others.
- Body text 14 px on mobile and 16 px from 768 px, `letter-spacing: -0.01em`.
- Section titles 16 px, 700 (18 px from 768 px).

## Layout rules for new UI

- No fixed heights or absolute positioning in new blocks.
- The tracker's main card (`WaterMainInfo`) places its children absolutely over
  the bottle image, and the right card (`WaterDetailedInfo`) has a fixed height
  from 768 px. Do not insert new elements into either without checking all three
  widths. Prefer a modal or a separate route for new content.

## Reuse before building

- Modals: `ModalTemplate` (`components/Modal`).
- Buttons: `AddWaterBtn` (`primary` / `secondary`), the chips in
  `QuickAmounts`.
- Small menus: the `UserBarPopover` pattern.
- Feedback: `react-hot-toast`. Loading: `Loader`.
- Icons: add a `<symbol id="icon-...">` to `src/assets/icons/sprite.svg` and
  color it from CSS.

## Conventions

- CSS Modules, camelCase class names, `clsx` for conditional classes.
- Every user-facing string goes in both `src/i18n/locales/en` and `uk`.
  Ukrainian is longer, so check for overflow.
- Interactive elements are `<button>` or links, keyboard reachable, with a
  visible focus state and a translated `aria-label` when there is no text.

## Checking a change

Before opening a PR, run the app and look at it at 320, 375, 768 and 1440 px in
both languages, including modals. For CSS refactors that must not change the
look, compare resolved values before and after instead of eyeballing.
