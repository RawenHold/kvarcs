# Quartz Care Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, bilingual, interactive quartz-care section to the home page directly after the full-cycle services section.

**Architecture:** Keep scenario content in the existing translation dictionary, keyboard wrapping in a small pure utility, and all interactive rendering in a focused client component. Integrate the component with one import and one JSX insertion; style it through scoped classes and existing theme variables without new dependencies or image assets.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Framer Motion, Lucide React, Tailwind utilities, project CSS variables, Node test runner.

---

## File Map

- Create `src/lib/quartz-care.ts`: wrapped index navigation used by keyboard controls.
- Create `src/lib/quartz-care.test.ts`: unit coverage for forward and backward wrapping.
- Create `src/components/quartz-care.tsx`: localized interactive presentation, semantic controls, animated mineral surface.
- Modify `src/lib/translations.ts`: Russian and Uzbek care-section copy.
- Modify `src/components/kvarcs-site.tsx`: render the section after `Services`.
- Modify `src/app/globals.css`: scoped themed, responsive, and reduced-motion styles.

### Task 1: Wrapped Scenario Navigation

**Files:**
- Create: `src/lib/quartz-care.test.ts`
- Create: `src/lib/quartz-care.ts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { moveCareStep } from "./quartz-care.ts";

test("wraps quartz-care scenario navigation in both directions", () => {
  assert.equal(moveCareStep(3, 1, 4), 0);
  assert.equal(moveCareStep(0, -1, 4), 3);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/quartz-care.test.ts`

Expected: FAIL because `src/lib/quartz-care.ts` does not exist.

- [ ] **Step 3: Add the minimal implementation**

```ts
export function moveCareStep(current: number, direction: -1 | 1, count: number) {
  if (count <= 0) return 0;
  return (current + direction + count) % count;
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/quartz-care.test.ts`

Expected: 1 passing test, 0 failures.

### Task 2: Localized Care Content

**Files:**
- Modify: `src/lib/translations.ts` after each `services` object

- [ ] **Step 1: Add matching Russian and Uzbek content shapes**

Add a `care` object for each language with this exact interface inferred by `as const`:

```ts
care: {
  eyebrow: string;
  title: string;
  lead: string;
  scenarios: readonly {
    label: string;
    title: string;
    body: string;
    action: string;
  }[];
  noSeal: string;
  finishNote: string;
  controlsLabel: string;
}
```

Russian scenarios cover daily cleaning, prompt spill removal, heat protection, and chemicals/actions to avoid. Uzbek copy communicates the same guidance without introducing product-specific cleaners.

- [ ] **Step 2: Type-check the translation shape**

Run: `.\node_modules\.bin\tsc.cmd --noEmit`

Expected: exit code 0.

### Task 3: Interactive Quartz Care Component

**Files:**
- Create: `src/components/quartz-care.tsx`

- [ ] **Step 1: Build semantic state and controls**

Create a client component with this public interface:

```tsx
export function QuartzCare({ lang }: { lang: Lang })
```

Use `translations[lang].care`, `useState(0)`, a button-ref array, `aria-pressed`, and left/right key handling through `moveCareStep`. Scenario buttons remain native buttons, preserve Enter/Space behavior, and use a minimum 44px touch target.

- [ ] **Step 2: Build the animated material visual**

Render one CSS-generated quartz slab with four keyed visual states. Use `AnimatePresence mode="wait"`, 250–360ms opacity/transform transitions, Lucide icons, and `useReducedMotion()` to replace spatial transitions with immediate opacity changes when requested.

- [ ] **Step 3: Build supporting guidance**

Render the active scenario title, body, and concise action line, followed by the persistent no-sealing note and the finish-specific note. Decorative visual layers must use `aria-hidden="true"`; the section must reference its visible `h2` with `aria-labelledby`.

### Task 4: Home Integration And Styling

**Files:**
- Modify: `src/components/kvarcs-site.tsx:56,358-359`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Insert the component after Services**

```tsx
import { QuartzCare } from "@/components/quartz-care";

<Services lang={lang} />
<QuartzCare lang={lang} />
<PortfolioMarquee lang={lang} images={portfolioImages} />
```

- [ ] **Step 2: Add scoped theme-aware styles**

Add `.quartz-care*` classes using existing `--bg-*`, `--surface-*`, `--text-*`, `--border`, and `--accent` variables. The desktop layout uses `minmax(0, 1.4fr) minmax(20rem, 1fr)`; tablet stacks the visual above content; mobile uses compact controls and no horizontal page overflow.

- [ ] **Step 3: Add restrained motion and reduced-motion handling**

Animate only the slab highlight and state-specific decorative layer. Under `@media (prefers-reduced-motion: reduce)`, disable ambient loops, smooth scrolling, and transforms while preserving visible state changes.

### Task 5: Verification

**Files:**
- Verify all files above

- [ ] **Step 1: Run focused unit tests**

Run: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/quartz-care.test.ts src/lib/image-preload.test.ts`

Expected: all tests pass.

- [ ] **Step 2: Run static checks**

Run: `.\node_modules\.bin\next.cmd lint`

Expected: no ESLint errors.

Run: `.\node_modules\.bin\tsc.cmd --noEmit`

Expected: no TypeScript errors.

- [ ] **Step 3: Run production build**

Run: `.\node_modules\.bin\next.cmd build`

Expected: successful optimized production build.

- [ ] **Step 4: Perform responsive and theme smoke checks**

Verify light/dark themes at 375px, 768px, 1024px, and 1440px; switch all four scenarios by pointer and keyboard; confirm no overflow; confirm reduced-motion mode removes ambient movement.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check` and `git diff -- src/lib/quartz-care.ts src/lib/quartz-care.test.ts src/lib/translations.ts src/components/quartz-care.tsx src/components/kvarcs-site.tsx src/app/globals.css`

Expected: no whitespace errors and only care-section changes plus the implementation plan.
