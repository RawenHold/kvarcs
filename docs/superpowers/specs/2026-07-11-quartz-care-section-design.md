# Quartz Care Section Design

## Goal

Add a bilingual interactive section to the home page that explains safe everyday care for KVARC-S quartz surfaces. The section should turn practical maintenance guidance into a short, memorable interaction instead of a long article.

## Placement

Render the section immediately after the existing `Services` section, whose Russian eyebrow is "Полный цикл", and before the portfolio marquee. Do not add a new top-level navigation item.

## Content Model

The section has four scenarios. Each scenario includes a short label, title, instruction, caution, and visual state.

1. **Everyday care**: wipe with warm water, mild or neutral soap, and a soft cloth; rinse and dry the surface.
2. **Spills and stains**: remove spills promptly; soften dried residue with water; use an approved non-abrasive cleaner, then rinse and dry.
3. **Heat protection**: place hot cookware and countertop appliances on a trivet or hot pad; avoid direct thermal shock.
4. **What to avoid**: do not use oven or grill cleaners, drain cleaners, strong acids or alkalis, abrasive pads, or cut directly on the surface. If accidental chemical contact occurs, rinse promptly with plenty of water.

A persistent note states that engineered quartz normally does not require sealing, waxing, or polishing. A secondary note explains that dark, honed, concrete, or rough finishes can show marks more readily and may need more frequent drying.

All customer-facing content must be available in Russian and Uzbek. Copy should be concise, calm, and specific. It must not claim that quartz is completely stain-proof, scratch-proof, heat-proof, antibacterial, or maintenance-free.

## Interaction

The default scenario is everyday care. Four semantic buttons act as a single-select control. Selecting a scenario updates the visual surface, the instruction, and the caution text.

Keyboard behavior:

- `Tab` reaches every scenario button.
- `Enter` or `Space` selects a scenario through native button behavior.
- Left and right arrow keys move to the previous or next scenario and wrap at the ends.
- The active button exposes `aria-pressed="true"`.

The interaction contains no autoplay. User selection remains stable until another scenario is selected.

## Visual Direction

The direction is "material-care atelier": a restrained editorial layout that feels like a premium material sample desk rather than an instruction manual.

- Use existing Playfair Display and IBM Plex Sans typography.
- Use current theme variables for light and dark modes.
- The main object is a large quartz slab rendered with CSS texture, subtle grain, and theme-aware highlights.
- Each scenario adds one purposeful animated layer: a cleaning sweep, dissolving stain, heat ring with trivet, or chemical warning trace.
- Controls form a compact numbered rail rather than four repeated feature cards.
- Gold remains the interaction accent; warning states use a restrained muted red derived from the existing palette.
- Do not introduce gradients outside the existing mineral and surface vocabulary, decorative blobs, nested cards, or new illustration dependencies.

## Motion

Scenario transitions last 250-360 ms and use transform and opacity. The visual state enters first, followed by the text with a 40 ms stagger. Continuous animation is limited to a subtle surface highlight and stops when the section is outside the viewport.

When `prefers-reduced-motion` is enabled, scenario states switch without spatial movement and all ambient animation is disabled.

## Responsive Behavior

- **1440 px and wider**: asymmetric two-column layout using `minmax(0, 1.4fr) minmax(20rem, 1fr)`.
- **1024-1439 px**: two columns with reduced visual height and tighter text measure.
- **640-1023 px**: visual first, controls and content below; scenario controls use a single `overflow-x: auto` row that centers when all controls fit.
- **375-639 px**: compact visual, full-width control rail, single-column copy, touch targets at least 44 px.

Text, controls, and animated layers must not change the section width or cause horizontal page overflow.

## Component Architecture

- Add a focused `QuartzCare` client component and keep it separate from the existing large `kvarcs-site.tsx` file.
- Add the translated care content to the existing `translations.ts` model and consume it through the existing `Lang` type.
- Add a small pure helper for wrapped keyboard navigation so interaction behavior can be tested without a browser.
- Insert `<QuartzCare lang={lang} />` between `Services` and `PortfolioMarquee` on the home page only.
- Use existing Framer Motion and Lucide dependencies; add no packages and no new image assets.

## Accessibility

- Use a labelled `<section>` with one `h2`.
- Use native `<button>` elements with visible focus states.
- Decorative visual layers are hidden from assistive technology.
- Instructions remain readable without animation or JavaScript-driven pointer movement.
- Ensure body text and controls meet existing theme contrast requirements.

## Testing And Verification

1. Write a failing unit test for wrapped previous/next scenario navigation.
2. Implement the minimum helper and component behavior needed to pass it.
3. Run the unit test, ESLint, TypeScript, and the Next.js production build.
4. Verify light and dark themes at 375, 768, 1024, and 1440 px.
5. Verify mouse, touch, keyboard selection, reduced motion, and absence of horizontal overflow.

## Source Basis

- Caesarstone care and maintenance: https://www.caesarstoneus.com/care-maintenance/quartz-mineral-surfaces/
- Cambria quartz product care: https://www.cambriausa.com/quartz-countertops/product-care.html
- Cosentino Silestone use, cleaning, and maintenance manual: https://content.cosentino.com/alldocuments/silestone/maintenance/cleaning-maintenance/maintenance-use-EN.pdf

The site content uses the conservative guidance shared across these manufacturers. Product-specific chemicals are not recommended by name because compatibility can vary by formulation, finish, and market.

## Out Of Scope

- A separate care article or route.
- Product-specific stain chemistry or warranty advice.
- A downloadable care PDF.
- New navigation, analytics events, dependencies, image assets, or backend changes.
