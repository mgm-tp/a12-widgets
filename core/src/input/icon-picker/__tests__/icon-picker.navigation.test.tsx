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

/**
 * How the IconPicker drives the active option of its icon grid.
 *
 * The existing suite leans on snapshots: fifteen snapshot assertions across its sixteen tests, seven
 * of which assert nothing else at all. A snapshot records the markup rather than the behaviour, so a
 * change to how the active option is tracked would re-record them instead of failing. These pin the
 * behaviour itself — arrow keys moving the active icon, and the actions that clear it.
 *
 * One case is deliberately left out: what happens to the highlight when the field is cleared while
 * `selectedIcon` is set. The active option is reported through the `data-preselect` attribute, which
 * the dropdown today writes imperatively — so after an explicit reset the attribute can hold a stale
 * value that React never corrects. That is worth fixing rather than pinning, and pinning it here
 * would make the fix look like a regression.
 */

import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import { IconPicker } from "../main/icon-picker.view.js";

/** Titles of the icons the grid reports as active. */
function activeIcons(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => option.getAttribute("title") ?? "");
}

function input(container: HTMLElement): HTMLInputElement {
	return getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;
}

/** The clear button, which the field identifies only by its localized title. */
function clearButton(container: HTMLElement): HTMLElement {
	return getAllByDataRole(container, DataRoles.Button).find((button) => button.getAttribute("title") === "Clear text")!;
}

/** Sends real key presses to an element, focusing it first so the keys land where they would. */
async function press(target: HTMLElement, ...keys: string[]): Promise<void> {
	target.focus();

	for (const key of keys) {
		await userEvent.keyboard(key);
	}
}

async function open(container: HTMLElement): Promise<void> {
	await userEvent.click(input(container));
	await waitFor(() => {
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();
	});
}

describe("com.mgmtp.a12.widgets.icon-picker.navigation", () => {
	test("moves the active icon along the grid with the arrow keys", async () => {
		const { container } = render(<IconPicker id="icons" onChange={noop} />);

		await open(container);
		expect(activeIcons(container)).toEqual([]);

		await press(input(container), "{ArrowRight}");
		const [firstActive] = activeIcons(container);
		expect(firstActive).toBeTruthy();

		await press(input(container), "{ArrowRight}");
		const [secondActive] = activeIcons(container);
		expect(secondActive).toBeTruthy();
		expect(secondActive).not.toBe(firstActive);
	});

	test("shows the active icon's name in the field while navigating", async () => {
		const { container } = render(<IconPicker id="icons" onChange={noop} />);

		await open(container);
		await press(input(container), "{ArrowRight}");

		const [active] = activeIcons(container);
		expect(input(container)).toHaveValue(active);
	});

	test("keeps exactly one icon active", async () => {
		const { container } = render(<IconPicker id="icons" onChange={noop} />);

		await open(container);
		await press(input(container), "{ArrowRight}");
		await press(input(container), "{ArrowDown}");
		await press(input(container), "{ArrowRight}");

		expect(activeIcons(container)).toHaveLength(1);
	});

	test("commits the active icon on Enter", async () => {
		const onChange = vi.fn();
		const { container } = render(<IconPicker id="icons" onChange={onChange} />);

		await open(container);
		await press(input(container), "{ArrowRight}");
		const shownName = input(container).value;
		expect(shownName).toBeTruthy();

		await press(input(container), "{Enter}");

		expect(onChange).toHaveBeenCalledTimes(1);
		// The field shows a display name that can carry a suffix, so the committed icon's own label is
		// what that name is built from rather than the name itself.
		const committed = onChange.mock.calls[0][0] as { label: string };
		expect(committed.label).toBeTruthy();
		expect(shownName).toContain(committed.label);
	});

	test("drops the active icon when the search text changes", async () => {
		const { container } = render(<IconPicker id="icons" onChange={noop} />);

		await open(container);
		await press(input(container), "{ArrowRight}");
		expect(activeIcons(container)).toHaveLength(1);

		await userEvent.fill(input(container), "ala");

		expect(activeIcons(container)).toEqual([]);
	});

	test("drops the active icon when the field is cleared", async () => {
		// Rendered without `selectedIcon` on purpose. With one, what happens to the highlight after the
		// clear depends on how `data-preselect` is maintained, which is not settled enough today to pin
		// here — see the note at the top of this file.
		const { container } = render(<IconPicker id="icons" onChange={noop} />);

		await open(container);
		// Navigating fills the field, which is what brings the clear button out.
		await press(input(container), "{ArrowRight}");
		expect(activeIcons(container)).toHaveLength(1);

		await userEvent.click(clearButton(container));

		await waitFor(() => {
			expect(input(container)).toHaveValue("");
		});
		expect(activeIcons(container)).toEqual([]);
	});

	test("leaves the grid alone while the clear button holds the focus", async () => {
		const { container } = render(<IconPicker id="icons" selectedIcon={{ label: "edit" }} onChange={noop} />);

		await open(container);
		await press(input(container), "{ArrowRight}");
		const before = activeIcons(container);

		await press(clearButton(container), "{ArrowRight}");

		expect(activeIcons(container)).toEqual(before);
	});
});
