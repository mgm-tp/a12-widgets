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
 * The link options a `DropDown` renders above its option list take part in the same arrow-key
 * navigation as the options themselves: arrows move the active option across the boundary between
 * the two groups, and the keys that select an option activate a link instead when one is active.
 *
 * None of that was covered before, so these tests pin it down as it behaves today.
 */

import type { ReactNode } from "react";
import { render, getByDataRole, getAllByDataRole, queryByDataRole } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { Link } from "../../../link/main/link/link.view.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";

const items: DropDownItem[] = [
	{ id: "1", label: "Armchair" },
	{ id: "2", label: "Chair" },
	{ id: "3", label: "Rocking chair" }
];

/** Labels of the link options that are currently active, read off `aria-selected`. */
function activeLinks(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.LinkItemWrapper)
		.filter((link) => link.getAttribute("aria-selected") === "true")
		.map((link) => link.textContent ?? "");
}

/** Labels of the options that are currently active, read off `data-preselect`. */
function activeOptions(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "");
}

/** Labels of the options the list reports as selected, read off `aria-selected`. */
function selectedOptions(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("aria-selected") === "true")
		.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "");
}

function renderDropdown(
	props: {
		items?: DropDownItem[];
		links?: ReactNode[];
		onPreselectedLinkChange?(index: number | undefined): void;
		onPreselectedItemChange?(item: DropDownItem | undefined): void;
	} = {}
): { container: HTMLElement; dropdown: HTMLElement } {
	const { container } = render(
		<DropDown
			items={props.items ?? items}
			links={props.links ?? [<Link key="a">Add one</Link>, <Link key="b">Browse all</Link>]}
			onPreselectedLinkChange={props.onPreselectedLinkChange}
			onPreselectedItemChange={props.onPreselectedItemChange}
		/>
	);

	return { container, dropdown: getByDataRole(container, DataRoles.Dropdown) };
}

/** Sends a real key press to the list, which holds the focus while it is being navigated. */
async function press(dropdown: HTMLElement, key: "{ArrowDown}" | "{ArrowUp}" | "{Enter}"): Promise<void> {
	dropdown.focus();
	await userEvent.keyboard(key);
}

describe("com.mgmtp.a12.widgets.dropdown.links", () => {
	test("renders each link as an option of its own listbox", async () => {
		const { container } = renderDropdown();

		const links = getAllByDataRole(container, DataRoles.Dropdown.LinkItemWrapper);
		expect(links).toHaveLength(2);
		expect(links.map((link) => link.getAttribute("role"))).toEqual(["option", "option"]);
		expect(getByDataRole(container, DataRoles.Dropdown.Links).getAttribute("role")).toBe("listbox");
	});

	test("activates the links in order before reaching the option list", async () => {
		const { container, dropdown } = renderDropdown();

		// Nothing is active to begin with.
		expect(activeLinks(container)).toEqual([]);
		expect(activeOptions(container)).toEqual([]);

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);
		expect(activeOptions(container)).toEqual([]);

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Browse all"]);

		// Past the last link the active option moves into the list, and no link stays active.
		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual([]);
		expect(activeOptions(container)).toEqual(["Armchair"]);
	});

	test("hands the active option back to the last link when arrowing up off the first option", async () => {
		const { container, dropdown } = renderDropdown();

		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		expect(activeOptions(container)).toEqual(["Armchair"]);

		await press(dropdown, "{ArrowUp}");
		expect(activeOptions(container)).toEqual([]);
		expect(activeLinks(container)).toEqual(["Browse all"]);
	});

	test("hands the active option to the first link when arrowing down off the last option", async () => {
		const { container, dropdown } = renderDropdown();

		// Arrow up from nothing goes to the first link, then arrow down twice lands on the last option.
		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		await press(dropdown, "{ArrowDown}");
		expect(activeOptions(container)).toEqual(["Rocking chair"]);

		await press(dropdown, "{ArrowDown}");
		expect(activeOptions(container)).toEqual([]);
		expect(activeLinks(container)).toEqual(["Add one"]);
	});

	test("arrows up into the last option when nothing is active yet", async () => {
		const onPreselectedLinkChange = vi.fn();
		const { container, dropdown } = renderDropdown({ onPreselectedLinkChange });

		// The links sit above the options, so arrowing up from nothing enters the list from the bottom —
		// the same place arrowing up off the first link goes to. No link becomes active on the way.
		await press(dropdown, "{ArrowUp}");

		expect(activeOptions(container)).toEqual(["Rocking chair"]);
		expect(activeLinks(container)).toEqual([]);
		expect(onPreselectedLinkChange).not.toHaveBeenCalledWith(expect.any(Number));
	});

	test("selects the option arrowed up to from nothing, rather than reaching for a link", async () => {
		const onSelectedItemChange = vi.fn();
		const { container } = render(
			<DropDown
				items={items}
				links={[<Link key="a">Add one</Link>, <Link key="b">Browse all</Link>]}
				onSelectedItemChange={onSelectedItemChange}
			/>
		);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		await press(dropdown, "{ArrowUp}");
		await press(dropdown, "{Enter}");

		expect(onSelectedItemChange).toHaveBeenCalledTimes(1);
		expect(onSelectedItemChange).toHaveBeenCalledWith(expect.objectContaining({ label: "Rocking chair" }));
	});

	test("cycles through the links alone when there are no options", async () => {
		const { container, dropdown } = renderDropdown({ items: [] });

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Browse all"]);

		// With no options to move into, the last link wraps round to the first.
		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);

		// And arrowing up off the first wraps to the last.
		await press(dropdown, "{ArrowUp}");
		expect(activeLinks(container)).toEqual(["Browse all"]);
	});

	test("reports which link became active, and that none is once the list takes over", async () => {
		const onPreselectedLinkChange = vi.fn();
		const { dropdown } = renderDropdown({ onPreselectedLinkChange });

		await press(dropdown, "{ArrowDown}");
		expect(onPreselectedLinkChange).toHaveBeenLastCalledWith(0);

		await press(dropdown, "{ArrowDown}");
		expect(onPreselectedLinkChange).toHaveBeenLastCalledWith(1);

		await press(dropdown, "{ArrowDown}");
		expect(onPreselectedLinkChange).toHaveBeenLastCalledWith(undefined);
	});

	test("activates the link itself on Enter, and leaves the options alone", async () => {
		const onLinkClick = vi.fn();
		const onPreselectedItemChange = vi.fn();
		const { container, dropdown } = renderDropdown({
			links: [
				<Link key="a" onClick={onLinkClick}>
					Add one
				</Link>,
				<Link key="b">Browse all</Link>
			],
			onPreselectedItemChange
		});

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);

		await press(dropdown, "{Enter}");

		expect(onLinkClick).toHaveBeenCalledTimes(1);
		// No option was selected, so none was reported as active either.
		expect(onPreselectedItemChange).not.toHaveBeenCalled();
	});

	test("does not select an option on Enter while a link is the active one", async () => {
		const onSelectedItemChange = vi.fn();
		const { container } = render(
			<DropDown items={items} links={[<Link key="a">Add one</Link>]} onSelectedItemChange={onSelectedItemChange} />
		);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);

		await press(dropdown, "{Enter}");
		expect(onSelectedItemChange).not.toHaveBeenCalled();
	});

	test("clears the active link once Enter has activated it", async () => {
		const { container, dropdown } = renderDropdown();

		await press(dropdown, "{ArrowDown}");
		expect(activeLinks(container)).toEqual(["Add one"]);

		await press(dropdown, "{Enter}");
		expect(activeLinks(container)).toEqual([]);
	});

	test("forwards a click on the link option to the link it wraps", async () => {
		const onLinkClick = vi.fn();
		const { container } = renderDropdown({
			links: [
				<Link key="a" onClick={onLinkClick}>
					Add one
				</Link>
			]
		});

		// The click lands on the option wrapper rather than on the link, which is what the wrapper
		// forwards — clicking anywhere in the row has to activate the link.
		await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.LinkItemWrapper)[0]);

		expect(onLinkClick).toHaveBeenCalledTimes(1);
	});

	test("starts from the selected option instead of the links when there is one", async () => {
		const { container, dropdown } = renderDropdown({
			items: [
				{ id: "1", label: "Armchair", selected: true },
				{ id: "2", label: "Chair" }
			]
		});

		// A selected option is the active one from the outset, which is what makes the first arrow key
		// move within the list rather than onto the first link.
		expect(activeOptions(container)).toEqual(["Armchair"]);

		await press(dropdown, "{ArrowDown}");
		expect(activeOptions(container)).toEqual(["Chair"]);
		expect(activeLinks(container)).toEqual([]);
	});

	test("shows no option as selected while a link is the active one", async () => {
		const { container, dropdown } = renderDropdown({
			items: [
				{ id: "1", label: "Armchair", selected: true },
				{ id: "2", label: "Chair" }
			]
		});

		expect(selectedOptions(container)).toEqual(["Armchair"]);

		// Reached by arrowing up off the first option, since the selected option is already active.
		await press(dropdown, "{ArrowUp}");
		expect(activeLinks(container)).toEqual(["Browse all"]);
		expect(selectedOptions(container)).toEqual([]);
	});

	test("renders the links even when there are no options and no hint", async () => {
		const { container } = renderDropdown({ items: [] });

		expect(getByDataRole(container, DataRoles.Dropdown)).toBeInTheDocument();
		expect(getAllByDataRole(container, DataRoles.Dropdown.LinkItemWrapper)).toHaveLength(2);
		expect(queryByDataRole(container, DataRoles.Dropdown.Item)).toBeFalsy();
	});
});
