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

import axe from "axe-core";
import type { FC } from "react";
import { useState } from "react";
import { queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { EDITORS } from "./harness.js";

const SAMPLE_MARKDOWN = "# Heading\n\ntext with **bold**, *italic*, `code`\n\n- one\n- two\n\n> quote";

/**
 * The violations the editor still has, each with the reason it is still here.
 *
 * The gate below compares the violations axe reports against this list exactly, in both
 * directions. A new violation fails the suite, and so does fixing one without deleting
 * its entry — so the list cannot quietly rot into a blanket excuse.
 */
const KNOWN_VIOLATIONS: Record<string, string> = {
	// The surface takes its name from the field label, and this suite renders no label.
	// A host that renders none leaves the surface unnamed too, so this is a real gap
	// rather than a quirk of the test: the surface needs a name of its own to fall back on.
	"aria-input-field-name": "the editing surface has no accessible name when the field carries no label"
};

const ControlledEditorUnderTest: FC<{
	Component: (typeof EDITORS)[number]["Component"];
	initialValue: string;
	initialMode?: "edit" | "source" | "view";
}> = ({ Component, initialValue, initialMode = "edit" }) => {
	const [value, setValue] = useState(initialValue);

	return <Component value={value} initialMode={initialMode} onChange={setValue} />;
};

/**
 * Waits for whatever surface this case rendered.
 *
 * The shared `waitForSurfaceReady` needs a mode. This suite runs the same test body
 * for every mode, so it accepts both surfaces.
 */
async function waitForEitherSurface(container: HTMLElement, roles: (typeof EDITORS)[number]["roles"]): Promise<void> {
	await waitFor(() => {
		const surfaces = [roles.Surface.Edit, roles.Surface.Source, roles.Surface.View];

		if (!surfaces.some((role) => queryByDataRole(container, role))) {
			throw new Error("editor not mounted yet");
		}
	});
}

describe("editor parity — accessibility (axe-core)", () => {
	for (const editor of EDITORS) {
		for (const mode of ["edit", "source"] as const) {
			test(`${editor.id} — ${mode} mode`, async () => {
				const { container } = render(
					<ControlledEditorUnderTest Component={editor.Component} initialValue={SAMPLE_MARKDOWN} initialMode={mode} />
				);
				await waitForEitherSurface(container, editor.roles);

				const results = await axe.run(container, {
					runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] }
				});

				const violations = results.violations.map((violation) => ({
					id: violation.id,
					impact: violation.impact ?? "n/a",
					nodes: violation.nodes.length
				}));

				const toolbarElement = container.querySelector('[role="toolbar"]');
				const toolbar = {
					present: toolbarElement !== null,
					tabbable: toolbarElement ? toolbarElement.querySelectorAll('[tabindex="0"]').length : 0,
					toggles: container.querySelectorAll("[aria-pressed]").length
				};

				// Kept for the report aggregator, which tracks the numbers over time.
				// eslint-disable-next-line no-console
				console.log(
					`A11Y|${JSON.stringify({ editor: editor.id, mode, violationCount: violations.length, violations, toolbar })}`
				);

				// Gate 1: exactly the violations we already know about, and no others.
				expect([...new Set(results.violations.map((violation) => violation.id))].sort()).toEqual(
					Object.keys(KNOWN_VIOLATIONS).sort()
				);

				// Gate 2: the ARIA toolbar pattern. The whole toolbar is one Tab stop and the
				// arrow keys move within it, so a second tabbable control means the roving
				// tabindex broke and every button became a stop of its own.
				expect(toolbar.present).toBe(true);
				expect(toolbar.tabbable).toBe(1);

				// Gate 3: the toggles report their state. Rich mode is where they are live;
				// source mode disables the ones with no markdown form.
				if (mode === "edit") {
					expect(toolbar.toggles).toBeGreaterThan(0);
				}
			});
		}
	}
});
