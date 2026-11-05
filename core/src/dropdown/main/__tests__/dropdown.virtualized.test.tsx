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

import { DataRoles } from "../../../common/main/data-roles.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";

const ITEM_COUNT = 5000;

function createItems(count = ITEM_COUNT): DropDownItem[] {
	return Array.from({ length: count }, (_, index) => ({
		id: String(index + 1),
		label: `Option ${String(index + 1).padStart(4, "0")}`,
		value: `option-${index + 1}`
	}));
}

function renderedOptions(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item);
}

function renderedLabels(container: HTMLElement): string[] {
	return renderedOptions(container).map((option) => option.textContent ?? "");
}

function activeOptionLabels(container: HTMLElement): string[] {
	return renderedOptions(container)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => option.textContent ?? "");
}

/**
 * States that the list really is windowed, which is what makes the cases below discriminate: an
 * unwindowed list mounts every option, and an assertion that an option is on screen or has been
 * scrolled to holds there just as well. Any case that acts on an option outside the window says this
 * first, so that a `virtualize` which quietly stopped windowing fails instead of staying green.
 */
function expectWindowed(container: HTMLElement, total = ITEM_COUNT): void {
	expect(renderedOptions(container).length).toBeLessThan(total);
	expect(queryByDataRole(container, DataRoles.Dropdown.VirtualSpacer)).toBeTruthy();
}

describe("com.mgmtp.a12.widgets.dropdown.virtualized", () => {
	test("mounts only a window of the options while keeping the full scroll height", () => {
		const items = createItems();
		const { container } = render(<DropDown virtualize items={items} />);
		const options = renderedOptions(container);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);
		const spacer = getByDataRole(container, DataRoles.Dropdown.VirtualSpacer);

		expect(options.length).toBeGreaterThan(0);
		expect(options.length).toBeLessThan(ITEM_COUNT / 10);
		// The first option is rendered, the last one is not.
		expect(options[0].textContent).toBe("Option 0001");
		expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
		expect(spacer.getBoundingClientRect().height).toBeGreaterThan(content.clientHeight);
	});

	test("reports the real list position on every rendered option", () => {
		const { container } = render(<DropDown virtualize items={createItems()} />);
		const [first] = renderedOptions(container);

		expect(first).toHaveAttribute("aria-setsize", String(ITEM_COUNT));
		expect(first).toHaveAttribute("aria-posinset", "1");
	});

	test("selects the option the keyboard navigated to, past the rendered window", async () => {
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(
			<DropDown virtualize items={createItems()} onSelectedItemChange={onSelectedItemChangeSpy} />
		);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);

		// The option navigation is about to land on is not mounted at all, so selecting it cannot go
		// through the rendered options.
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain(`Option ${ITEM_COUNT}`);

		// Arrow up from no active option wraps to the last option, which is far outside the window.
		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });
		fireEvent.keyDown(dropdown, { key: Key.Enter });

		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({
			id: String(ITEM_COUNT),
			value: `option-${ITEM_COUNT}`
		});
	});

	test("scrolls the selected option into the window when the list opens on it", async () => {
		// The common case for a windowed list: it opens with a value already selected, which is far
		// enough down that it is not in the initial window at all.
		const items = createItems();
		const { container } = render(<DropDown virtualize items={items} selectedItem={items[2500]} />);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);

		await vi.waitFor(() => expect(content.scrollTop).toBeGreaterThan(0));
		await vi.waitFor(() => {
			const selected = renderedOptions(container).filter((option) => option.getAttribute("aria-selected") === "true");
			expect(selected.map((option) => option.textContent)).toEqual(["Option 2501"]);
		});

		// The window moved to the selection rather than growing to cover it: the options it started on
		// are gone.
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain("Option 0001");
	});

	test("scrolls the selected option into the window when the selection changes", async () => {
		const items = createItems();
		const { container, rerender } = render(<DropDown virtualize items={items} selectedItem={items[0]} />);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);

		expect(content.scrollTop).toBe(0);
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain("Option 4001");

		rerender(<DropDown virtualize items={items} selectedItem={items[4000]} />);

		await vi.waitFor(() => expect(content.scrollTop).toBeGreaterThan(0));
		await vi.waitFor(() => expect(renderedLabels(container)).toContain("Option 4001"));

		// The option it scrolled away from is unmounted, so the window travelled instead of widening.
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain("Option 0001");
	});

	test("scrolls a newly activated option into the window", async () => {
		const { container } = render(<DropDown virtualize items={createItems()} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);

		expect(content.scrollTop).toBe(0);
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain(`Option ${ITEM_COUNT}`);

		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });

		await vi.waitFor(() => expect(content.scrollTop).toBeGreaterThan(0));
		// The option that navigation stopped on is mounted, so it can be referenced by
		// `aria-activedescendant` and shown as active. It was not mounted a moment ago: the window had to
		// follow the active option for this to hold.
		await vi.waitFor(() => expect(activeOptionLabels(container)).toEqual([`Option ${ITEM_COUNT}`]));
		expectWindowed(container);
		expect(renderedLabels(container)).not.toContain("Option 0001");
	});

	test("keeps rendering every option when virtualization is not requested", () => {
		const items = createItems(300);
		const { container } = render(<DropDown items={items} />);

		expect(renderedOptions(container)).toHaveLength(300);
		expect(queryByDataRole(container, DataRoles.Dropdown.VirtualSpacer)).toBeFalsy();
	});

	test("windows a list with sections, keeping the header of the section in view", () => {
		const items: DropDownItem[] = [
			{ id: "s1", label: "Section", children: createItems(120) },
			{ id: "s2", label: "Other", children: createItems(80) }
		];
		const { container } = render(<DropDown virtualize items={items} />);
		const options = renderedOptions(container);

		expect(options.length).toBeGreaterThan(0);
		expect(options.length).toBeLessThan(200);
		expect(queryByDataRole(container, DataRoles.Dropdown.VirtualSpacer)).toBeTruthy();
		// The second section starts past the window, so only the first header is mounted.
		expect(getAllByDataRole(container, DataRoles.Dropdown.SectionItem)).toHaveLength(1);
		expect(options[0].textContent).toBe("Option 0001");
	});

	test("numbers a windowed option among the options, leaving the section headers out of the count", () => {
		const items: DropDownItem[] = [
			{ id: "s1", label: "Section", children: createItems(120) },
			{ id: "s2", label: "Other", children: createItems(80) }
		];
		const { container } = render(<DropDown virtualize items={items} />);
		const [first] = renderedOptions(container);

		expect(first).toHaveAttribute("aria-setsize", "200");
		expect(first).toHaveAttribute("aria-posinset", "1");
		expect(first).toHaveAttribute("aria-describedby", "s1");
	});

	test("scrolls to an option in a later section, past the headers above it", async () => {
		const items: DropDownItem[] = [
			{ id: "s1", label: "Section", children: createItems(120) },
			{ id: "s2", label: "Other", children: createItems(80) }
		];
		const { container } = render(<DropDown virtualize items={items} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);

		// Arrow up wraps to the last option, which is in the second section — so the row it has to
		// scroll to sits two headers below its position among the options.
		fireEvent.keyDown(dropdown, { key: Key.ArrowUp });

		await vi.waitFor(() => expect(content.scrollTop).toBeGreaterThan(0));
		await vi.waitFor(() => expect(activeOptionLabels(container)).toEqual(["Option 0080"]));

		// It is the last of the 200 options and the 202nd row, the two headers included — which is the
		// offset the list has to apply to scroll to it at all.
		const [active] = renderedOptions(container).filter((option) => option.getAttribute("data-preselect") === "true");
		expect(active).toHaveAttribute("aria-posinset", "200");
		expect(active).toHaveAttribute("aria-setsize", "200");
		expect(active).toHaveAttribute("aria-describedby", "s2");
		expect(active.dataset.index).toBe("201");
	});

	test("falls back to rendering every option for a wrapping grid", () => {
		const { container } = render(<DropDown virtualize horizontal items={createItems(150)} />);

		expect(renderedOptions(container)).toHaveLength(150);
		expect(queryByDataRole(container, DataRoles.Dropdown.VirtualSpacer)).toBeFalsy();
	});

	test("selects the option a click landed on, wherever the window has scrolled to", async () => {
		const onSelectedItemChangeSpy = vi.fn();
		const { container } = render(
			<DropDown virtualize items={createItems()} onSelectedItemChange={onSelectedItemChangeSpy} />
		);
		const content = getByDataRole(container, DataRoles.Dropdown.Content);

		expectWindowed(container);

		// Scrolled well past the start, the options on screen are no longer the first ones — so a click
		// has to map through the window's offset to reach the item it is pointing at.
		content.scrollTop = 20_000;
		await vi.waitFor(() => expect(renderedLabels(container)).not.toContain("Option 0001"));

		const [option] = renderedOptions(container);
		const label = option.textContent;
		const position = option.getAttribute("aria-posinset");

		fireEvent.click(option);

		// `id` is the option's 1-based place in the list, which is what `aria-posinset` reports — the
		// clicked option and the reported item have to be the same one.
		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
		expect(onSelectedItemChangeSpy.mock.calls[0][0]).toMatchObject({ id: position, label, selected: false });
	});
});
