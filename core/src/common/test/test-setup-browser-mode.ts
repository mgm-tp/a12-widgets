/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import "../../theme/basic.css";
import "./test.css";

import { cleanup } from "@testing-library/react";
// @ts-expect-error jest-styled-components is not typed
import styleSheetSerializer from "jest-styled-components/src/styleSheetSerializer";
// @ts-expect-error jest-styled-components is not typed
import toHaveStyleRule from "jest-styled-components/src/toHaveStyleRule";
// @ts-expect-error jest-styled-components is not typed
import { resetStyleSheet } from "jest-styled-components/src/utils";
import { expect, beforeEach, afterEach } from "vitest";

// Node-style `global` alias for browser-only code paths that still reference it: the
// jest-styled-components serializer (`global.Element`) and react-dnd. Vitest 5 injects
// Vite `define` entries into the browser as JSON values, so `define: { global: "window" }`
// now yields the string "window" instead of the window object.
(globalThis as unknown as { global: unknown }).global = globalThis;

expect.addSnapshotSerializer(styleSheetSerializer);

/**
 * Force every `@font-face` in `basic.css` to finish loading before the first test renders.
 *
 * A browser only fetches a web font once an element actually asks for it, so without this the first
 * renders in a file lay out against the fallback face and reflow a few frames later, once the real font
 * arrives. Any assertion that reads geometry - and any snapshot of a styled-component that interpolates
 * a measured value - therefore records whichever face happened to be active, which varies with test
 * order, machine speed and disk cache.
 *
 * The Material Symbols faces are the worst offenders: until the font is there, `<Icon>navigation</Icon>`
 * renders its ligature as the literal word, so the element is roughly twice as wide as the 24px glyph it
 * becomes.
 *
 * `document.fonts.ready` alone does not help - with nothing yet requested it resolves immediately - so
 * each face is loaded explicitly. Iterating the font set rather than naming faces keeps this correct when
 * `basic.css` gains or drops one. A face that fails to load is left to the fallback rather than failing
 * the run; that is still deterministic, which is all this hook is for.
 */
await Promise.all([...document.fonts].map((fontFace) => fontFace.load().catch(() => undefined)));
await document.fonts.ready;

beforeEach(() => {
	resetStyleSheet();
});

/**
 * Per-test teardown.
 *
 * `cleanup()` unmounts the React trees it rendered, but it does not own
 * everything a test can leave behind. Instrumenting this hook across a full
 * suite run found, after `cleanup()` had already run: 32 stray body nodes
 * (leaked portals plus recharts' cached `#recharts_measurement_span`) and
 * body-level attributes written by components such as scroll locks and
 * `aria-hidden`.
 *
 * This sweep is hygiene, not a flakiness fix: measured over 20 consecutive
 * full-suite runs it produced no reduction in the flake rate. It is here to stop
 * per-test residue from accumulating into order-dependence later.
 *
 * What is deliberately NOT done here, each rejected on measured evidence:
 *   - `vi.useRealTimers()` is NOT forced. date-picker, date-time-picker and
 *     date-time-utils install fake timers in `beforeAll` and restore them in
 *     `afterAll`. Tearing the clock down per-test would never reinstall it.
 *   - `vi.restoreAllMocks()` is NOT called. It breaks 17 tests: tag-input.mobile
 *     calls `setupDevice()` (a `vi.spyOn` on the shared device `provider`
 *     singleton) once in `beforeAll`, so restoring per-test reverts that suite to
 *     a desktop device after its first test.
 *   - `vi.resetAllMocks()` is NOT called: it would wipe `vi.fn()`
 *     implementations that suites configure once in `beforeAll`.
 */
afterEach(() => {
	cleanup();

	for (const node of [...document.body.children]) {
		if (node.tagName !== "STYLE" && node.tagName !== "SCRIPT") {
			node.remove();
		}
	}

	document.body.removeAttribute("style");
	document.body.removeAttribute("aria-hidden");
	document.body.className = "";
});

expect.addSnapshotSerializer(styleSheetSerializer);
expect.extend({ toHaveStyleRule });

export {};
