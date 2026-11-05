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
 * Windowing of the Autocomplete's option list, which the widget turns on by itself once a search
 * matches enough options and which `virtualize` overrides in either direction.
 *
 * The Dropdown's own windowing is covered by `dropdown.virtualized.test.tsx`; what is at stake here
 * is only what the Autocomplete decides on top of it — the threshold, the override, and that the
 * fullscreen dialog decides the same way the attached dropdown does, since both go through
 * `AutocompleteDropdown`.
 */

import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor, findByDataRole } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { VIRTUALIZE_FROM_ITEM_COUNT } from "../main/autocomplete.dropdown.view.js";
import { Autocomplete } from "../main/autocomplete.view.js";

const OVER_THRESHOLD = VIRTUALIZE_FROM_ITEM_COUNT + 50;
const UNDER_THRESHOLD = VIRTUALIZE_FROM_ITEM_COUNT - 50;

/** Options labelled so that a prefix can narrow the list to a known count. */
function createItems(count: number): string[] {
	return Array.from({ length: count }, (_, index) => `Option ${String(index + 1).padStart(4, "0")}`);
}

/** The same options, split over four groups — a heading count far below the threshold. */
function createGroupedItems(count: number): DropDownItem[] {
	const options = createItems(count).map((label) => ({ label }));
	const groupSize = Math.ceil(count / 4);

	return Array.from({ length: 4 }, (_, group) => ({
		label: `Group ${group + 1}`,
		children: options.slice(group * groupSize, (group + 1) * groupSize)
	}));
}

const baseProps = {
	id: "ac",
	label: "Option",
	hintTemplate: "{count} of {total} options shown",
	onValueChange: noop
} as const;

const getInput = (container: HTMLElement): HTMLElement => getByDataRole(container, DataRoles.TextField.Input);

const renderedOptions = (scope: HTMLElement): HTMLElement[] => getAllByDataRole(scope, DataRoles.Dropdown.Item);

const isWindowed = (scope: HTMLElement): boolean => queryByDataRole(scope, DataRoles.Dropdown.VirtualSpacer) !== null;

/** Opens the attached dropdown and hands back the portal the option list lives in. */
async function openList(container: HTMLElement): Promise<HTMLElement> {
	await userEvent.click(getInput(container));

	return findByDataRole(container, DataRoles.AttachedPortal);
}

describe("com.mgmtp.a12.widgets.autocomplete.virtualized", () => {
	test(`windows a list of ${OVER_THRESHOLD} matches without being asked to`, async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});
		// Only a window of the options is mounted, which is the point of the threshold.
		expect(renderedOptions(portal).length).toBeLessThan(OVER_THRESHOLD);
	});

	test(`renders every option of a list of ${UNDER_THRESHOLD} matches, below the threshold`, async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createItems(UNDER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(renderedOptions(portal).length).toBe(UNDER_THRESHOLD);
		});
		expect(isWindowed(portal)).toBe(false);
	});

	test("virtualize={false} keeps every option rendered however long the list is", async () => {
		const { container } = render(
			<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} virtualize={false} />
		);
		const portal = await openList(container);

		await waitFor(() => {
			expect(renderedOptions(portal).length).toBe(OVER_THRESHOLD);
		});
		expect(isWindowed(portal)).toBe(false);
	});

	test("virtualize windows a list that would otherwise be short enough to render whole", async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createItems(UNDER_THRESHOLD)} virtualize />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});
		expect(renderedOptions(portal).length).toBeLessThan(UNDER_THRESHOLD);
	});

	test("counts the matches, not the options given, when deciding to window", async () => {
		// Typing narrows a list that is over the threshold down to one that is under it, and the list
		// stops being windowed with it — the decision follows what is actually shown.
		const { container } = render(<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});

		// The labels are padded to four digits, so "Option 00" is the prefix of 0001 to 0099 — 99
		// options, which is under the threshold.
		await userEvent.type(getInput(container), "Option 00");

		await waitFor(() => {
			expect(renderedOptions(portal).length).toBe(99);
		});
		expect(isWindowed(portal)).toBe(false);
	});

	test("reports the real match count on a windowed option, not the size of the window", async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});

		const [first] = renderedOptions(portal);

		expect(first).toHaveAttribute("aria-setsize", String(OVER_THRESHOLD));
		expect(first).toHaveAttribute("aria-posinset", "1");
	});

	test("selects an option the keyboard reached past the end of the window", async () => {
		const items = createItems(OVER_THRESHOLD);
		const { container } = render(<Autocomplete {...baseProps} items={items} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});
		// The option arrowing up wraps to is not mounted, so selecting it cannot go through the DOM.
		const last = items[items.length - 1];

		expect(renderedOptions(portal).map((option) => option.textContent)).not.toContain(last);

		await userEvent.keyboard("{ArrowUp}");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			expect(getInput(container)).toHaveValue(last);
		});
	});

	test(`windows a grouped list holding ${OVER_THRESHOLD} options across four groups`, async () => {
		// The decision counts the options, not the headings — four groups are nowhere near the
		// threshold, while the options they hold are well past it.
		const { container } = render(<Autocomplete {...baseProps} items={createGroupedItems(OVER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(isWindowed(portal)).toBe(true);
		});
		expect(renderedOptions(portal).length).toBeLessThan(OVER_THRESHOLD);
	});

	test(`renders a grouped list of ${UNDER_THRESHOLD} options whole, below the threshold`, async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createGroupedItems(UNDER_THRESHOLD)} />);
		const portal = await openList(container);

		await waitFor(() => {
			expect(renderedOptions(portal).length).toBe(UNDER_THRESHOLD);
		});
		expect(isWindowed(portal)).toBe(false);
	});

	test("windows the fullscreen dialog's list on the same threshold", async () => {
		const { container } = render(<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} mobileModal />);

		await userEvent.click(getInput(container));

		const dialog = await findByDataRole(document.body, DataRoles.Modal.Overlay);

		await waitFor(() => {
			expect(isWindowed(dialog)).toBe(true);
		});
		expect(renderedOptions(dialog).length).toBeLessThan(OVER_THRESHOLD);
	});

	test("renders the dialog's list whole when the caller turns windowing off", async () => {
		const { container } = render(
			<Autocomplete {...baseProps} items={createItems(OVER_THRESHOLD)} mobileModal virtualize={false} />
		);

		await userEvent.click(getInput(container));

		const dialog = await findByDataRole(document.body, DataRoles.Modal.Overlay);

		await waitFor(() => {
			expect(renderedOptions(dialog).length).toBe(OVER_THRESHOLD);
		});
		expect(isWindowed(dialog)).toBe(false);
	});
});
