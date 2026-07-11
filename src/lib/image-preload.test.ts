import assert from "node:assert/strict";
import test from "node:test";

import { collectImagePreloadSources } from "./image-preload.ts";

test("collects unique preload sources with active images first", () => {
  assert.deepEqual(
    collectImagePreloadSources(
      ["/active.jpg", "/active-detail.jpg"],
      ["/preview-1.jpg", "/active.jpg", "", "/preview-2.jpg"]
    ),
    ["/active.jpg", "/active-detail.jpg", "/preview-1.jpg", "/preview-2.jpg"]
  );
});
