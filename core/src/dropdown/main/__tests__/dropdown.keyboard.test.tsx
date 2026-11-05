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
 * Keyboard navigation of the option list, as it behaves today. The {@link DropDown} is about to have
 * the active option moved out of its instance state, so these are written to pin down the behaviour
 * that has to survive that: which option each keystroke lands on, that a disabled option is stepped
 * over, that navigation addresses options by position rather than by matching a value, and that the
 * selection the caller passes is what the list opens on.
 *
 * Every case here passes against the list as it stands, so a change that alters any of it fails here
 * rather than being noticed later.
 * @module
 */

import { createRef } from "react";
import { render, getByDataRole, getAllByDataRole, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";

const items: DropDownItem[] = [
	{ id: "1", label: "Armchair" },
	{ id: "2", label: "Chair" },
	{ id: "3", label: "Hammock", disabled: true },
	{ id: "4", label: "Rocking chair" }
];

/** Options carrying the same label/value, which index-based navigation has to keep apart. */
const duplicateItems: DropDownItem[] = [
	{ id: "a", label: "Chair", value: "chair" },
	{ id: "b", label: "Chair", value: "chair" },
	{ id: "c", label: "Stool", value: "stool" }
];

function activeOptionLabels(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => option.textContent ?? "");
}

describe("com.mgmtp.a12.widgets.dropdown.keyboard", () => {
	test("activates the first option on arrow down and selects it on enter", () => {
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(<DropDown items={items} onSelectedItemChange={onSelectedItemChangeSpy} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		// Both events are dispatched within one task, so the active option has to be readable before
		// React has re-rendered.
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: Key.Enter });

		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({ id: "1", label: "Armchair" });
	});

	test("skips disabled options and reports the option it stops on", () => {
		const onPreselectedItemChangeSpy = vi.fn();
		const { container } = render(<DropDown items={items} onPreselectedItemChange={onPreselectedItemChangeSpy} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		// "Hammock" is disabled, so the third press has to land on "Rocking chair".
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });

		expect(activeOptionLabels(container)).toEqual(["Rocking chair"]);
		expect(onPreselectedItemChangeSpy).toHaveBeenLastCalledWith(expect.objectContaining({ id: "4" }));
	});

	test("wraps around at the end of the list", () => {
		const { container } = render(<DropDown items={items} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });

		expect(activeOptionLabels(container)).toEqual(["Rocking chair"]);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });

		expect(activeOptionLabels(container)).toEqual(["Armchair"]);
	});

	test("selects the option at the active index rather than the first value match", () => {
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(<DropDown items={duplicateItems} onSelectedItemChange={onSelectedItemChangeSpy} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });

		// Only the second "Chair" is active, even though the first one has the same label and value.
		expect(activeOptionLabels(container)).toEqual(["Chair"]);

		fireEvent.keyDown(dropdown, { key: Key.Enter });

		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({ id: "b" });
	});

	test("activates options in sections by their position in the flattened list", () => {
		const sectioned: DropDownItem[] = [
			{
				id: "s1",
				label: "Seats",
				children: [
					{ id: "1", label: "Armchair" },
					{ id: "2", label: "Chair" }
				]
			},
			{ id: "s2", label: "Beds", children: [{ id: "3", label: "Hammock" }] }
		];
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(<DropDown items={sectioned} onSelectedItemChange={onSelectedItemChangeSpy} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });
		fireEvent.keyDown(dropdown, { key: Key.Enter });

		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({ id: "3", label: "Hammock" });
	});

	test("activates and selects the option on screen when items are nested deeper than a section", () => {
		// The list renders one level of sections: an item below a section is an option of its own and its
		// own children are not rendered. Navigation has to address those rendered options, not the
		// nesting behind them.
		const deeplyNested: DropDownItem[] = [
			{ id: "1", label: "Armchair" },
			{
				id: "s1",
				label: "Seats",
				children: [
					{ id: "2", label: "Chair" },
					{ id: "3", label: "Stool", children: [{ id: "4", label: "Never rendered" }] }
				]
			}
		];
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(<DropDown items={deeplyNested} onSelectedItemChange={onSelectedItemChangeSpy} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		expect(getAllByDataRole(container, DataRoles.Dropdown.Item).map((option) => option.id)).toEqual(["1", "2", "3"]);

		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });
		expect(activeOptionLabels(container)).toEqual(["Stool"]);

		fireEvent.keyDown(dropdown, { key: Key.Enter });
		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({ id: "3", label: "Stool" });
	});

	test("setPreselectedPosition resolves a row to the option at that position", async () => {
		const dropdownRef = createRef<DropDown>();
		const onPreselectedItemChangeSpy = vi.fn();
		const { container } = render(
			<DropDown ref={dropdownRef} items={items} onPreselectedItemChange={onPreselectedItemChangeSpy} />
		);

		// A vertical list has one option per row, which is how consumers already used this API.
		dropdownRef.current?.setPreselectedPosition({ row: 3, index: 0 });

		// Called outside React's event handling, so the re-render has to be awaited.
		await vi.waitFor(() => expect(activeOptionLabels(container)).toEqual(["Rocking chair"]));
		expect(onPreselectedItemChangeSpy).toHaveBeenLastCalledWith(expect.objectContaining({ id: "4" }));

		dropdownRef.current?.resetPreselectedPosition();

		await vi.waitFor(() => expect(activeOptionLabels(container)).toEqual([]));
		expect(onPreselectedItemChangeSpy).toHaveBeenLastCalledWith(undefined);
	});

	test("reports the selected item as active when the list mounts", () => {
		const { container } = render(
			<DropDown
				items={[
					{ id: "1", label: "Armchair" },
					{ id: "2", label: "Chair", selected: true }
				]}
			/>
		);

		expect(activeOptionLabels(container)).toEqual(["Chair"]);
	});

	test("follows a selection the caller changes from outside the list", () => {
		const { container, rerender } = render(<DropDown items={items} selectedItem={items[0]} />);

		expect(activeOptionLabels(container)).toEqual(["Armchair"]);

		rerender(<DropDown items={items} selectedItem={items[3]} />);

		// The active option follows the selection, which is what scrolls it into view.
		expect(activeOptionLabels(container)).toEqual(["Rocking chair"]);
	});

	test("keeps the active option while a multi-select list is toggled", () => {
		// A checkbox in front of every option carries the label too, so the active option is read by id.
		const activeOptionIds = (container: HTMLElement): string[] =>
			getAllByDataRole(container, DataRoles.Dropdown.Item)
				.filter((option) => option.getAttribute("data-preselect") === "true")
				.map((option) => option.id);
		const { container, rerender } = render(<DropDown selectionMode="multiple" items={items} selectedItems={[]} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		expect(activeOptionIds(container)).toEqual(["2"]);

		// Toggling changes the selection on every keystroke, so the active option must stay put rather
		// than follow it — otherwise the keyboard navigation restarts under the user. The option being
		// selected is deliberately not the active one: were the active option to follow the selection,
		// it would move to "4" here.
		rerender(<DropDown selectionMode="multiple" items={items} selectedItems={[items[3]!]} />);

		expect(activeOptionIds(container)).toEqual(["2"]);
	});
});
