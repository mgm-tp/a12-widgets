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

import { expect, afterEach } from "vitest";
// @ts-expect-error jest-styled-components is not typed
import styleSheetSerializer from "jest-styled-components/src/styleSheetSerializer";
import { cleanup } from "@testing-library/react";
import "../../theme/basic.css";
import "./test.css";

expect.addSnapshotSerializer(styleSheetSerializer);

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

export {};
