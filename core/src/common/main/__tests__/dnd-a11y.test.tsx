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

import type { ReactNode } from "react";
import { useEffect } from "react";
import { getByDataRole, render } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataRoles } from "../data-roles.js";
import { triggerPostMoveFlash } from "../dnd-flash/index.js";
import { LiveRegion, useLiveRegion, type LiveRegionHandle } from "../live-region/index.js";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("triggerPostMoveFlash", () => {
	test("animates the element", () => {
		const element = document.createElement("div");
		const animate = vi.spyOn(element, "animate").mockReturnValue({} as Animation);

		triggerPostMoveFlash(element, { color: "rgb(0, 0, 255)" });

		expect(animate).toHaveBeenCalledTimes(1);
	});

	test("flashes a table row through its cells, not the row itself", () => {
		// A `<tr>`'s own background paints *behind* its cells, and every DataTable cell carries an opaque
		// `background` from `cellBase` — animating the row is therefore invisible on screen.
		const row = document.createElement("tr");
		const cells = [document.createElement("td"), document.createElement("td")];
		cells.forEach((cell) => row.appendChild(cell));

		const rowAnimate = vi.spyOn(row, "animate").mockReturnValue({} as Animation);
		const cellAnimates = cells.map((cell) => vi.spyOn(cell, "animate").mockReturnValue({} as Animation));

		triggerPostMoveFlash(row, { color: "rgb(0, 0, 255)" });

		expect(rowAnimate).not.toHaveBeenCalled();
		cellAnimates.forEach((animate) => expect(animate).toHaveBeenCalledTimes(1));
	});
});

describe("LiveRegion", () => {
	function Harness({ messages }: { messages: string[] }): ReactNode {
		const region = useLiveRegion();

		useEffect(() => {
			messages.forEach((message) => (region.ref as { current: LiveRegionHandle | null }).current?.announce(message));
		}, [messages, region.ref]);

		return <LiveRegion ref={region.ref} dataRole={DataRoles.Table.A11yLiveRegion} />;
	}

	test("renders a polite status region and speaks the latest message", () => {
		const { container } = render(<Harness messages={["Moved to position 2 of 5"]} />);
		const region = getByDataRole(container, DataRoles.Table.A11yLiveRegion);

		expect(region).toHaveAttribute("role", "status");
		expect(region).toHaveAttribute("aria-live", "polite");
		expect(region.textContent).toContain("Moved to position 2 of 5");
	});

	test("re-announces an identical consecutive message (forces a text change)", () => {
		const { container } = render(<Harness messages={["Moved to position 1 of 5", "Moved to position 1 of 5"]} />);
		const region = getByDataRole(container, DataRoles.Table.A11yLiveRegion);

		// The second identical announcement appends a zero-width space so the DOM text changes.
		expect(region.textContent?.startsWith("Moved to position 1 of 5")).toBe(true);
	});
});
