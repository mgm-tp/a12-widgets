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

import { render, getByDataRole, getAllByDataRole, queryByDataRole, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { Key as CustomKey } from "../../../common/main/utils.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";

interface Language {
	code: string;
}

const items: DropDownItem<Language>[] = [
	{ id: "1", label: "Java", data: { code: "java" } },
	{ id: "2", label: "Groovy", data: { code: "groovy" } },
	{ id: "3", label: "Kotlin", data: { code: "kotlin" } }
];

function optionLabels(container: HTMLElement, selected: boolean): string[] {
	return (
		getAllByDataRole(container, DataRoles.Dropdown.Item)
			.filter((option) => option.getAttribute("aria-selected") === String(selected))
			// The option's own text, not its whole content: the checkbox in front of it carries the label
			// again, for assistive technology.
			.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "")
	);
}

/** Labels of the options the list currently has active, read off `data-preselect`. */
function getActiveOptionLabels(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "");
}

describe("com.mgmtp.a12.widgets.dropdown.selection", () => {
	test("announces itself as multi-selectable and states every option's selection", () => {
		const { container } = render(<DropDown selectionMode="multiple" items={items} selectedItems={[items[1]]} />);

		expect(getByDataRole(container, DataRoles.Dropdown.Content)).toHaveAttribute("aria-multiselectable", "true");
		expect(optionLabels(container, true)).toEqual(["Groovy"]);
		expect(optionLabels(container, false)).toEqual(["Java", "Kotlin"]);
	});

	test("stays a single-select listbox by default", () => {
		const { container } = render(<DropDown items={items} selectedItem={items[1]} />);

		expect(getByDataRole(container, DataRoles.Dropdown.Content)).not.toHaveAttribute("aria-multiselectable");
		expect(queryByDataRole(container, DataRoles.Checkbox.Input)).toBeFalsy();
	});

	test("puts a checkbox in front of every option, checked along with the option", () => {
		const { container } = render(<DropDown selectionMode="multiple" items={items} selectedItems={[items[0]]} />);
		const checkboxes = getAllByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxes).toHaveLength(3);
		expect(checkboxes[0]).toHaveAttribute("aria-checked", "true");
		expect(checkboxes[1]).toHaveAttribute("aria-checked", "false");
	});

	test("states each option's selection in aria-selected, mirrored in the deprecated aria-checked", () => {
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={[{ id: "all", label: "Select all", indeterminate: true }, ...items]}
				selectedItems={[items[0]]}
			/>
		);
		const options = getAllByDataRole(container, DataRoles.Dropdown.Item);

		// `aria-selected` is the contract; `aria-checked` is kept for the callers that rendered the
		// checkboxes themselves before the list owned the selection.
		expect(options[0]).toHaveAttribute("aria-checked", "mixed");
		expect(options[1]).toHaveAttribute("aria-selected", "true");
		expect(options[1]).toHaveAttribute("aria-checked", "true");
		expect(options[2]).toHaveAttribute("aria-selected", "false");
		expect(options[2]).toHaveAttribute("aria-checked", "false");
	});

	test("leaves aria-checked to the caller in a single-select list", () => {
		const { container } = render(<DropDown items={items} selectedItem={items[0]} />);
		const options = getAllByDataRole(container, DataRoles.Dropdown.Item);

		expect(options[0]).toHaveAttribute("aria-selected", "true");
		expect(options[0].hasAttribute("aria-checked")).toBe(false);
	});

	test("shows the mixed state for an option that stands for a partly made selection", () => {
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={[{ id: "all", label: "Select all", indeterminate: true }, ...items]}
				selectedItems={[items[0]]}
			/>
		);
		const options = getAllByDataRole(container, DataRoles.Dropdown.Item);

		expect(getByDataRole(options[0], DataRoles.Checkbox.Input.Indeterminate)).toBeTruthy();
		expect(getByDataRole(options[0], DataRoles.Checkbox.Input)).toHaveAttribute("aria-checked", "mixed");
		// The options behind it keep the plain checkbox.
		expect(queryByDataRole(options[1], DataRoles.Checkbox.Input.Indeterminate)).toBeFalsy();
	});

	test("adds a clicked option to the selection and hands back the option's own data", async () => {
		const onSelectionChangeSpy = vi.fn();
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={items}
				selectedItems={[items[0]]}
				onSelectionChange={onSelectionChangeSpy}
			/>
		);

		await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.Item)[2]);

		expect(onSelectionChangeSpy).toHaveBeenCalledTimes(1);
		const [selectedItems, toggledItem] = onSelectionChangeSpy.mock.calls[0];
		expect(selectedItems.map((item: DropDownItem<Language>) => item.id)).toEqual(["1", "3"]);
		expect(toggledItem.data).toEqual({ code: "kotlin" });
	});

	test("removes an already selected option from the selection", async () => {
		const onSelectionChangeSpy = vi.fn();
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={items}
				selectedItems={[items[0], items[1]]}
				onSelectionChange={onSelectionChangeSpy}
			/>
		);

		await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.Item)[0]);

		expect(onSelectionChangeSpy.mock.calls[0][0].map((item: DropDownItem<Language>) => item.id)).toEqual(["2"]);
	});

	test("falls back to the options' own selected flags when no selection is passed", async () => {
		const onSelectionChangeSpy = vi.fn();
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={[
					{ id: "1", label: "Java", selected: true },
					{ id: "2", label: "Groovy" }
				]}
				onSelectionChange={onSelectionChangeSpy}
			/>
		);

		expect(optionLabels(container, true)).toEqual(["Java"]);

		await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.Item)[1]);

		expect(onSelectionChangeSpy.mock.calls[0][0].map((item: DropDownItem) => item.id)).toEqual(["1", "2"]);
	});

	test("moves the active option when an option's selected mark moves", () => {
		// The mark can sit on a top-level option or inside a section. `CustomSelect` uses both.
		const topLevelOption: DropDownItem<Language> = { id: "asm", label: "Assembly" };
		const sectionChild = items[1];
		const grouped = (markedId?: string): DropDownItem<Language>[] => [
			{ ...topLevelOption, selected: markedId === topLevelOption.id },
			{ id: "jvm", label: "JVM", children: items.map((item) => ({ ...item, selected: item.id === markedId })) }
		];
		const { container, rerender } = render(<DropDown items={grouped(topLevelOption.id)} />);

		expect(getActiveOptionLabels(container)).toEqual([topLevelOption.label]);

		// A rebuilt array, the way a consumer hands one in — only the mark moved.
		rerender(<DropDown items={grouped(sectionChild.id)} />);

		expect(getActiveOptionLabels(container)).toEqual([sectionChild.label]);
	});

	test("toggles with Space as well as Enter, without being told which keys select", () => {
		const onSelectionChangeSpy = vi.fn();
		const { container } = render(
			<DropDown selectionMode="multiple" items={items} onSelectionChange={onSelectionChangeSpy} />
		);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: CustomKey.Space });

		expect(onSelectionChangeSpy).toHaveBeenCalledTimes(1);
		expect(onSelectionChangeSpy.mock.calls[0][1]).toMatchObject({ id: "1" });
	});

	test("keeps the page still while Space toggles an option", () => {
		const { container } = render(<DropDown selectionMode="multiple" items={items} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });

		// Space is the browser's own "page down". The focus sits on the wrapper,
		// which is not a scroll container, so without this the page jumps a screen on every toggle.
		const toggled = fireEvent.keyDown(dropdown, { key: CustomKey.Space });

		expect(toggled).toBe(false);
	});

	test("does not treat the selected options as the active one", () => {
		const { container } = render(
			<DropDown selectionMode="multiple" items={items} selectedItems={[items[0], items[2]]} />
		);

		// In a single-select list the selected option doubles as the active one; with several selected
		// there is no such option, and highlighting all of them would be wrong.
		const active = getAllByDataRole(container, DataRoles.Dropdown.Item).filter(
			(option) => option.getAttribute("data-preselect") === "true"
		);
		expect(active).toHaveLength(0);
	});

	test("tells options with the same label apart through getItemKey", async () => {
		const duplicates: DropDownItem<Language>[] = [
			{ id: "a", label: "Chair", data: { code: "one" } },
			{ id: "b", label: "Chair", data: { code: "two" } }
		];
		const onSelectionChangeSpy = vi.fn();
		const { container } = render(
			<DropDown
				selectionMode="multiple"
				items={duplicates}
				getItemKey={(item) => item.id ?? ""}
				selectedItems={[duplicates[0]]}
				onSelectionChange={onSelectionChangeSpy}
			/>
		);

		// Without a key the two would compare equal by label and both count as selected.
		expect(optionLabels(container, true)).toHaveLength(1);

		await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.Item)[1]);

		expect(onSelectionChangeSpy.mock.calls[0][0].map((item: DropDownItem<Language>) => item.id)).toEqual(["a", "b"]);
	});
});
