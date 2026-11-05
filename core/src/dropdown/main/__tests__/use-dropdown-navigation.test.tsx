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

import type { ReactElement } from "react";
import { useState } from "react";
import { render, getByDataRole, getAllByDataRole, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";
import { useDropdownNavigation } from "../template/use-dropdown-navigation.js";

const items: DropDownItem[] = [
	{ id: "1", label: "Armchair", disabled: true },
	{ id: "2", label: "Chair" },
	{ id: "3", label: "Hammock" },
	{ id: "4", label: "Stool", disabled: true }
];

/** Options with the same label, which only a key can tell apart. */
const duplicates: DropDownItem[] = [
	{ id: "a", label: "Chair" },
	{ id: "b", label: "Chair" }
];

/**
 * A combobox in miniature: an input that keeps the focus and reports the active option, and a list
 * that renders it — which is what the handle exists to hold together.
 */
function Combobox(props: {
	items?: DropDownItem[];
	getItemKey?(item: DropDownItem): string;
	itemToActivate?: DropDownItem;
}): ReactElement {
	const listItems = props.items ?? items;
	const navigation = useDropdownNavigation({ items: listItems, getItemKey: props.getItemKey });

	return (
		<>
			<input
				data-role={DataRoles.TextField.Input}
				role="combobox"
				aria-expanded
				aria-controls="list"
				aria-activedescendant={navigation.activeItem?.id}
				readOnly
				onKeyDown={navigation.handleKeyDown}
			/>
			{/* The caller can read the active option without asking the list for it. */}
			<output data-role={DataRoles.Dropdown.Hint}>{navigation.activeItem?.label ?? "none"}</output>
			<button type="button" onClick={() => navigation.setActiveItem(props.itemToActivate)}>
				activate
			</button>
			<button type="button" onClick={navigation.moveToFirst}>
				first
			</button>
			<button type="button" onClick={navigation.moveToLast}>
				last
			</button>
			<button type="button" onClick={navigation.reset}>
				reset
			</button>
			<DropDown id="list" items={listItems} getItemKey={props.getItemKey} navigation={navigation} />
		</>
	);
}

function activeLabel(container: HTMLElement): string {
	return getByDataRole(container, DataRoles.Dropdown.Hint).textContent ?? "";
}

function highlightedLabels(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "");
}

describe("com.mgmtp.a12.widgets.dropdown.use-dropdown-navigation", () => {
	test("moves the active option on arrow keys sent to the element holding the focus", async () => {
		const { container } = render(<Combobox />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.keyDown(input, { key: Key.ArrowDown });

		// "Armchair" is disabled, so the first press lands on "Chair".
		expect(activeLabel(container)).toBe("Chair");
		expect(highlightedLabels(container)).toEqual(["Chair"]);
		expect(input).toHaveAttribute("aria-activedescendant", "2");

		fireEvent.keyDown(input, { key: Key.ArrowDown });

		expect(activeLabel(container)).toBe("Hammock");
		expect(highlightedLabels(container)).toEqual(["Hammock"]);
	});

	test("activates a named option without being told its position", async () => {
		const { container, getByRole } = render(<Combobox itemToActivate={items[2]} />);

		await userEvent.click(getByRole("button", { name: "activate" }));

		expect(activeLabel(container)).toBe("Hammock");
		expect(highlightedLabels(container)).toEqual(["Hammock"]);
	});

	test("tells options with the same label apart when given a key", async () => {
		const { container, getByRole } = render(
			<Combobox items={duplicates} itemToActivate={duplicates[1]} getItemKey={(item) => item.id ?? ""} />
		);

		await userEvent.click(getByRole("button", { name: "activate" }));

		// Both options read "Chair"; only the second one is the active one.
		const options = getAllByDataRole(container, DataRoles.Dropdown.Item);
		expect(options[0]).toHaveAttribute("data-preselect", "false");
		expect(options[1]).toHaveAttribute("data-preselect", "true");
	});

	test("moves to the first and last option that can be activated, and clears again", async () => {
		const { container, getByRole } = render(<Combobox />);

		await userEvent.click(getByRole("button", { name: "first" }));
		expect(activeLabel(container)).toBe("Chair");

		await userEvent.click(getByRole("button", { name: "last" }));
		// "Stool" is disabled, so the last option that can be activated is "Hammock".
		expect(activeLabel(container)).toBe("Hammock");

		await userEvent.click(getByRole("button", { name: "reset" }));
		expect(activeLabel(container)).toBe("none");
		expect(highlightedLabels(container)).toEqual([]);
	});

	test("settles instead of re-rendering forever while the list reports the position it already has", () => {
		let renders = 0;

		function CountingCombobox(): ReactElement {
			renders++;
			const [listItems] = useState(items);
			const navigation = useDropdownNavigation({ items: listItems });

			return <DropDown items={listItems} navigation={navigation} />;
		}

		const { container } = render(<CountingCombobox />);

		expect(getAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(4);
		// The list publishes its active option after every update; the handle has to swallow the
		// unchanged ones or mounting alone would loop.
		expect(renders).toBeLessThan(5);
	});
});
