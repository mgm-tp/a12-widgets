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
 * The parts of `DropDown`'s prop contract that no test asserted before: the props that only ever
 * reached it from another widget (`useFocusStyle`, `hideA11yLabel`), the ones nothing passed at all
 * (`selectedItemPosition`, `ariaLabelledby`, the plain event callbacks), and the option flags that
 * only a snapshot stood for.
 */

import { render, getByDataRole, getAllByDataRole, queryByDataRole, fireEvent, waitFor } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { Key as CustomKey } from "../../../common/main/utils.js";
import { Link } from "../../../link/main/link/link.view.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { DropDown } from "../template/dropdown.tpl.view.js";

const items: DropDownItem[] = [
	{ id: "1", label: "Armchair" },
	{ id: "2", label: "Chair" },
	{ id: "3", label: "Rocking chair" }
];

/** Sends real key presses to the list, which holds the focus while it is navigated. */
async function press(list: HTMLElement, ...keys: string[]): Promise<void> {
	list.focus();

	for (const key of keys) {
		await userEvent.keyboard(key);
	}
}

/** Labels of the options that are currently active, read off `data-preselect`. */
function activeOptions(container: HTMLElement): string[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item)
		.filter((option) => option.getAttribute("data-preselect") === "true")
		.map((option) => option.textContent ?? "");
}

describe("com.mgmtp.a12.widgets.dropdown.contract", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("what it renders at all", () => {
		test("renders nothing for an empty list with no hint and no links", async () => {
			const { container } = render(<DropDown items={[]} />);

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();
		});

		test("renders for an empty list as soon as there is a hint to show", async () => {
			const { container } = render(<DropDown items={[]} hint="No results" />);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeInTheDocument();
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("No results");
			expect(queryByDataRole(container, DataRoles.Dropdown.Item)).toBeFalsy();
		});

		test("renders the footer alongside the options", async () => {
			const { container } = render(<DropDown items={items} footer={<Link>Load more</Link>} />);

			expect(getByDataRole(container, DataRoles.Dropdown).textContent).toContain("Load more");
			expect(getAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(3);
		});

		test("names the option list after the hint as well as the caller's label", async () => {
			const { container } = render(
				<DropDown items={items} id="furniture" hint="3 of 12" ariaLabelledby="furniture-label" />
			);

			const content = getByDataRole(container, DataRoles.Dropdown.Content);
			expect(content.getAttribute("aria-labelledby")).toContain("furniture-label");
			expect(content.getAttribute("aria-labelledby")).toContain("furniture--hint");
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).id).toBe("furniture--hint");
		});

		test("names the link list after the caller's label", async () => {
			const { container } = render(
				<DropDown items={items} id="furniture" ariaLabelledby="furniture-label" links={[<Link key="a">Add</Link>]} />
			);

			expect(getByDataRole(container, DataRoles.Dropdown.Links).getAttribute("aria-labelledby")).toBe(
				"furniture-label"
			);
		});
	});

	describe("option flags", () => {
		test("keeps a hidden label readable but out of sight", async () => {
			const { container } = render(<DropDown items={[{ id: "1", label: "Armchair", hideLabel: true }]} />);

			const option = getByDataRole(container, DataRoles.Dropdown.Item);
			expect(queryByDataRole(option, DataRoles.Dropdown.Text)).toBeFalsy();
			expect(getByDataRole(option, DataRoles.HiddenText).textContent).toBe("Armchair");
		});

		test("states an option's checked state when the caller sets one", async () => {
			const { container } = render(
				<DropDown
					items={[
						{ id: "1", label: "Armchair", ariaChecked: "true" },
						{ id: "2", label: "Chair", ariaChecked: "mixed" },
						{ id: "3", label: "Stool" }
					]}
				/>
			);

			const options = getAllByDataRole(container, DataRoles.Dropdown.Item);
			expect(options[0].getAttribute("aria-checked")).toBe("true");
			expect(options[1].getAttribute("aria-checked")).toBe("mixed");
			expect(options[2].hasAttribute("aria-checked")).toBe(false);
		});

		test("marks a disabled option and does not report it as clicked", async () => {
			const onSelectedItemChange = vi.fn();
			const { container } = render(
				<DropDown
					items={[{ id: "1", label: "Armchair", disabled: true }]}
					onSelectedItemChange={onSelectedItemChange}
				/>
			);

			const option = getByDataRole(container, DataRoles.Dropdown.Item);
			expect(option.getAttribute("aria-disabled")).toBe("true");
			expect(option.tabIndex).toBe(-1);

			// `force` skips the actionability wait, which a disabled option never satisfies — so this is
			// still a real click, delivered where a user's click would be refused.
			await userEvent.click(option, { force: true });
			expect(onSelectedItemChange).not.toHaveBeenCalled();
		});

		test("points each option of a section at the section that describes it", async () => {
			const { container } = render(
				<DropDown
					items={[
						{
							id: "seating",
							label: "Seating",
							children: [{ id: "1", label: "Armchair" }]
						}
					]}
				/>
			);

			expect(getByDataRole(container, DataRoles.Dropdown.SectionItem).id).toBe("seating");
			expect(getByDataRole(container, DataRoles.Dropdown.Item).getAttribute("aria-describedby")).toBe("seating");
		});

		test("hides the option text from assistive technology when asked to", async () => {
			const { container } = render(<DropDown items={items} hideA11yLabel />);

			expect(getAllByDataRole(container, DataRoles.Dropdown.Text)[0].getAttribute("aria-hidden")).toBe("true");
		});

		test("leaves the option text readable by default", async () => {
			const { container } = render(<DropDown items={items} />);

			expect(getAllByDataRole(container, DataRoles.Dropdown.Text)[0].hasAttribute("aria-hidden")).toBe(false);
		});
	});

	describe("keyboard model", () => {
		test("does nothing on an arrow key when every option is disabled", async () => {
			const onPreselectedItemChange = vi.fn();
			const { container } = render(
				<DropDown
					items={items.map((item) => ({ ...item, disabled: true }))}
					onPreselectedItemChange={onPreselectedItemChange}
				/>
			);

			await press(getByDataRole(container, DataRoles.Dropdown), "{ArrowDown}");

			expect(activeOptions(container)).toEqual([]);
			expect(onPreselectedItemChange).not.toHaveBeenCalled();
		});

		test("reports the option an arrow key moved to", async () => {
			const onPreselectedItemChange = vi.fn();
			const { container } = render(<DropDown items={items} onPreselectedItemChange={onPreselectedItemChange} />);

			await press(getByDataRole(container, DataRoles.Dropdown), "{ArrowDown}");

			expect(onPreselectedItemChange).toHaveBeenCalledTimes(1);
			expect(onPreselectedItemChange.mock.calls[0][0]).toMatchObject({ id: "1", label: "Armchair" });
		});

		test("moves along the row with left and right in a horizontal list", async () => {
			const { container } = render(<DropDown horizontal items={items} />);
			const dropdown = getByDataRole(container, DataRoles.Dropdown);

			await press(dropdown, "{ArrowDown}");
			expect(activeOptions(container)).toEqual(["Armchair"]);

			await press(dropdown, "{ArrowRight}");
			expect(activeOptions(container)).toEqual(["Chair"]);

			await press(dropdown, "{ArrowLeft}");
			expect(activeOptions(container)).toEqual(["Armchair"]);
		});

		test("selects with the keys the caller nominates instead of Enter", async () => {
			const onSelectedItemChange = vi.fn();
			const { container } = render(
				<DropDown items={items} keysToSelectItem={[CustomKey.Space]} onSelectedItemChange={onSelectedItemChange} />
			);
			const dropdown = getByDataRole(container, DataRoles.Dropdown);

			await press(dropdown, "{ArrowDown}");

			await press(dropdown, "{Enter}");
			expect(onSelectedItemChange).not.toHaveBeenCalled();

			await press(dropdown, " ");
			expect(onSelectedItemChange).toHaveBeenCalledTimes(1);
			expect(onSelectedItemChange.mock.calls[0][0]).toMatchObject({ id: "1" });
		});

		test("moves real focus onto the active option when the options can hold it", async () => {
			// `useFocusStyle` alone is not enough: the option has to be focusable, which it only is once
			// the caller gives it a tab index. This is why Multiselect sets one on every option.
			const focusableItems = items.map((item) => ({ ...item, tabIndex: 0 }));
			const { container } = render(<DropDown items={focusableItems} useFocusStyle />);

			await press(getByDataRole(container, DataRoles.Dropdown), "{ArrowDown}");

			expect(getAllByDataRole(container, DataRoles.Dropdown.Item)[0]).toHaveFocus();
		});

		test("cannot move focus onto an option that carries no tab index", async () => {
			const { container } = render(<DropDown items={items} useFocusStyle />);

			await press(getByDataRole(container, DataRoles.Dropdown), "{ArrowDown}");

			expect(activeOptions(container)).toEqual(["Armchair"]);
			expect(getAllByDataRole(container, DataRoles.Dropdown.Item)[0]).not.toHaveFocus();
		});

		test("leaves focus where it is without that instruction", async () => {
			const focusableItems = items.map((item) => ({ ...item, tabIndex: 0 }));
			const { container } = render(<DropDown items={focusableItems} />);

			await press(getByDataRole(container, DataRoles.Dropdown), "{ArrowDown}");

			expect(getAllByDataRole(container, DataRoles.Dropdown.Item)[0]).not.toHaveFocus();
		});
	});

	describe("scrolling the selected option into place", () => {
		test.each([
			["top", "start"],
			["middle", "center"],
			["bottom", "end"]
		] as const)("scrolls a %s-positioned selection to the %s of the list", async (position, block) => {
			const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => undefined);

			render(
				<DropDown
					items={items.map((item) => ({ ...item, selected: item.id === "3" }))}
					selectedItemPosition={position}
				/>
			);

			await waitFor(() => {
				expect(scrollIntoView).toHaveBeenCalled();
			});
			expect(scrollIntoView).toHaveBeenLastCalledWith({ block });
		});
	});

	describe("plain event callbacks", () => {
		test("reports a scroll of the option list", async () => {
			const onScroll = vi.fn();
			const { container } = render(<DropDown items={items} onScroll={onScroll} />);

			fireEvent.scroll(getByDataRole(container, DataRoles.Dropdown.Content));

			expect(onScroll).toHaveBeenCalledTimes(1);
		});

		test("reports a mouse down on the list itself, apart from one on an option", async () => {
			const onWrapperMouseDown = vi.fn();
			const onMouseDown = vi.fn();
			const { container } = render(
				<DropDown items={items} hint="3 of 12" onWrapperMouseDown={onWrapperMouseDown} onMouseDown={onMouseDown} />
			);

			// The hint is part of the list but not an option, so a press there reaches the list alone.
			await userEvent.click(getByDataRole(container, DataRoles.Dropdown.Hint));
			expect(onWrapperMouseDown).toHaveBeenCalledTimes(1);
			expect(onMouseDown).not.toHaveBeenCalled();

			await userEvent.click(getAllByDataRole(container, DataRoles.Dropdown.Item)[0]);
			expect(onMouseDown).toHaveBeenCalledTimes(1);
			expect(onMouseDown.mock.calls[0][0]).toMatchObject({ id: "1" });
		});

		test("reports a key press", async () => {
			const onKeyPress = vi.fn();
			const { container } = render(<DropDown items={items} onKeyPress={onKeyPress} />);

			await press(getByDataRole(container, DataRoles.Dropdown), "a");

			expect(onKeyPress).toHaveBeenCalledTimes(1);
		});
	});
});
