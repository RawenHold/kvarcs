import assert from "node:assert/strict";
import test from "node:test";

import { moveCareStep } from "./quartz-care.ts";

test("wraps quartz-care scenario navigation in both directions", () => {
  assert.equal(moveCareStep(3, 1, 4), 0);
  assert.equal(moveCareStep(0, -1, 4), 3);
});
