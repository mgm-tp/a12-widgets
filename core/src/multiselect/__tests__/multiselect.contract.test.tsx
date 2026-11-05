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
 * What the Multiselect reports and shows, as opposed to what it renders.
 *
 * The existing suite counts its callbacks but never reads what they were handed, and pins most of
 * its prop surface with a snapshot — which proves the markup has not moved, not that the feature
 * works. These tests assert the selection the widget hands back, and back the snapshot-only props
 * with an assertion about what the user actually sees.
 */

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { render, getByDataRole, getAllByDataRole, queryByDataRole } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import type { MultiselectProps } from "../main/multiselect.api.js";
import { Multiselect } from "../main/multiselect.view.js";

const ITEMS: MultiselectProps.Item[] = [
	{ id: "java", label: "Java" },
	{ id: "groovy", label: "Groovy" },
	{ id: "kotlin", label: "Kotlin" },
	{ id: "scala", label: "Scala" }
];

/** The ids of the selection reported by the given `onChange` spy on its last call. */
function reportedIds(onChange: ReturnType<typeof vi.fn>): string[] {
	const calls = onChange.mock.calls;
	const lastCall = calls[calls.length - 1] as [MultiselectProps.Item[]];

	return lastCall[0].map((item) => item.id);
}

function options(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Dropdown.Item);
}

/** Labels of the options, taken from the option's own text rather than its whole subtree. */
function optionLabels(container: HTMLElement): string[] {
	return options(container).map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent ?? "");
}

/** The clear button, which the widget only identifies by an id derived from the widget's own. */
function clearButton(container: HTMLElement, id: string): HTMLElement | null {
	return container.querySelector(`#${id}-multiselect-clear-button`);
}

/** The checkbox that shows an option's selection state. */
function checkboxOf(option: HTMLElement): HTMLElement {
	return getByDataRole(option, DataRoles.Checkbox.Input);
}

/** Sends real key presses to an element, focusing it first so the keys land where they would. */
async function press(target: HTMLElement, ...keys: string[]): Promise<void> {
	target.focus();

	for (const key of keys) {
		await userEvent.keyboard(key);
	}
}

async function openDropdown(container: HTMLElement): Promise<HTMLElement> {
	await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

	return getByDataRole(container, DataRoles.Dropdown);
}

/** A Multiselect wired the way consumers are expected to wire it: `onChange` back into `items`. */
function ControlledMultiselect(props: { onChange?(selectedItems: MultiselectProps.Item[]): void }): ReactElement {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const items = useMemo(
		() => ITEMS.map((item) => ({ ...item, selected: selectedIds.includes(item.id) })),
		[selectedIds]
	);

	return (
		<Multiselect
			items={items}
			enableSelectAllOption={false}
			onChange={(selectedItems) => {
				props.onChange?.(selectedItems);
				setSelectedIds(selectedItems.map((item) => item.id));
			}}
		/>
	);
}

describe("com.mgmtp.a12.widgets.multiselect.contract", () => {
	describe("the selection it reports", () => {
		test("reports the option that was checked, and nothing else", async () => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} onChange={onChange} />);

			await openDropdown(container);
			await userEvent.click(options(container)[1]);

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(reportedIds(onChange)).toEqual(["groovy"]);
		});

		test("accumulates the selection in the order the options were checked", async () => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} onChange={onChange} />);

			await openDropdown(container);
			await userEvent.click(options(container)[2]);
			await userEvent.click(options(container)[0]);

			expect(reportedIds(onChange)).toEqual(["kotlin", "java"]);
		});

		test("drops an option from the selection when it is unchecked again", async () => {
			const onChange = vi.fn();
			const { container } = render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id !== "scala" }))}
					enableSelectAllOption={false}
					onChange={onChange}
				/>
			);

			await openDropdown(container);
			expect(checkboxOf(options(container)[1])).toBeChecked();

			await userEvent.click(options(container)[1]);

			expect(reportedIds(onChange)).toEqual(["java", "kotlin"]);
			expect(checkboxOf(options(container)[1])).not.toBeChecked();
		});

		test("reports every option when the select-all option is checked, and none when unchecked", async () => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} selectAllText="All" onChange={onChange} />);

			await openDropdown(container);

			// The select-all option sits in front of the options it stands for.
			await userEvent.click(options(container)[0]);
			expect(reportedIds(onChange)).toEqual(["java", "groovy", "kotlin", "scala"]);

			await userEvent.click(options(container)[0]);
			expect(reportedIds(onChange)).toEqual([]);
		});

		test("reports the emptied selection when the clear button is pressed", async () => {
			const onChange = vi.fn();
			const { container } = render(
				<Multiselect
					id="languages"
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "java" }))}
					enableSelectAllOption={false}
					onChange={onChange}
				/>
			);

			await userEvent.click(clearButton(container, "languages")!);

			// The widget defers the clearing by a tick, so the report is not in before the click resolves.
			await vi.waitFor(() => expect(onChange).toHaveBeenCalled());
			expect(reportedIds(onChange)).toEqual([]);
			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("");
		});

		test("says which option was checked and whether it now is", async () => {
			const onItemCheck = vi.fn();
			const { container } = render(
				<Multiselect items={ITEMS} enableSelectAllOption={false} onItemCheck={onItemCheck} />
			);

			await openDropdown(container);
			await userEvent.click(checkboxOf(options(container)[2]));

			expect(onItemCheck).toHaveBeenCalledTimes(1);
			const [checked, item] = onItemCheck.mock.calls[0];
			expect(checked).toBe(true);
			expect(item).toMatchObject({ id: "kotlin", label: "Kotlin" });
		});

		test("hands the clicked option back to the click handler", async () => {
			const onItemClick = vi.fn();
			const { container } = render(
				<Multiselect items={ITEMS} enableSelectAllOption={false} onItemClick={onItemClick} />
			);

			await openDropdown(container);
			await userEvent.click(options(container)[3]);

			expect(onItemClick).toHaveBeenCalledTimes(1);
			expect(onItemClick.mock.calls[0][0]).toMatchObject({ id: "scala", label: "Scala" });
		});

		test("reports a selection made with the keyboard", async () => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} onChange={onChange} />);

			const dropdown = await openDropdown(container);
			await press(dropdown, "{ArrowDown}", " ");

			expect(reportedIds(onChange)).toEqual(["java"]);
		});
	});

	describe("what the field shows", () => {
		test("lists the selected labels in the field, comma separated", async () => {
			const { container } = render(
				<Multiselect items={ITEMS.map((item) => ({ ...item, selected: item.id !== "scala" }))} />
			);

			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("Java, Groovy, Kotlin");
		});

		test("shows the placeholder while nothing is selected", async () => {
			const { container } = render(<Multiselect items={ITEMS} placeholder="Please select" />);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			expect(input).toHaveValue("");
			expect(input).toHaveAttribute("placeholder", "Please select");
		});

		test("counts the selection in the counter", async () => {
			const { container } = render(
				<Multiselect items={ITEMS.map((item) => ({ ...item, selected: item.id !== "scala" }))} id="languages" />
			);

			expect(getByDataRole(container, DataRoles.Counter).textContent).toContain("3");
		});

		test("fills the hint template with the number of options shown and held", async () => {
			const { container } = render(
				<Multiselect items={ITEMS} hintTemplate="{count} of {total} options shown" enableSelectAllOption={false} />
			);

			await openDropdown(container);
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("4 of 4 options shown");
		});

		test("narrows the hint as the search narrows the list", async () => {
			const { container } = render(
				<Multiselect items={ITEMS} hintTemplate="{count} of {total} options shown" enableSelectAllOption={false} />
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);
			await userEvent.type(input, "a");

			// Java and Scala are the two options containing an "a".
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("2 of 4 options shown");
		});

		test("shows an error, a warning and an info message", async () => {
			const { container } = render(
				<Multiselect
					items={ITEMS}
					id="languages"
					errorMessage="Pick at least one"
					warningMessage="That is a lot"
					infoMessage="Nine languages available"
				/>
			);

			expect(getByDataRole(container, DataRoles.TextField.ErrorMessage).textContent).toContain("Pick at least one");
			expect(getByDataRole(container, DataRoles.TextField.WarningMessage).textContent).toContain("That is a lot");
			expect(getByDataRole(container, DataRoles.TextField.InfoMessage).textContent).toContain(
				"Nine languages available"
			);
		});

		test("keeps a hidden label available to assistive technology", async () => {
			const { container } = render(<Multiselect items={ITEMS} id="languages" label="Languages" hideLabel />);

			// Hidden means taken out of sight, not out of the accessibility tree — the label keeps its
			// text and its association with the field, and only gains the unseen-but-read class.
			const label = getByDataRole(container, DataRoles.TextField.Label);
			expect(label.textContent).toContain("Languages");
			expect(label.className).toContain("-u-unseenButRead");
		});

		test("shows the label when it is not hidden", async () => {
			const { container } = render(<Multiselect items={ITEMS} id="languages" label="Languages" />);

			const label = getByDataRole(container, DataRoles.TextField.Label);
			expect(label.textContent).toContain("Languages");
			expect(label.className).not.toContain("-u-unseenButRead");
		});
	});

	describe("when it must not respond", () => {
		test.each(["disabled", "readonly"] as const)("ignores the keyboard while %s", async (state) => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} {...{ [state]: true }} onChange={onChange} />);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await press(input, "{ArrowDown}");
			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();

			await press(input, "{Enter}");
			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();

			expect(onChange).not.toHaveBeenCalled();
		});

		test.each(["disabled", "readonly"] as const)("does not open on the expand icon while %s", async (state) => {
			const { container } = render(<Multiselect items={ITEMS} {...{ [state]: true }} />);

			const expandIcon = queryByDataRole(container, DataRoles.SelectionSuffix);

			if (expandIcon) {
				await userEvent.click(expandIcon);
			}

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();
		});

		test.each(["disabled", "readonly"] as const)(
			"offers no clear button while %s, even with a selection",
			async (state) => {
				const { container } = render(
					<Multiselect
						id="languages"
						items={ITEMS.map((item) => ({ ...item, selected: true }))}
						{...{ [state]: true }}
					/>
				);

				expect(clearButton(container, "languages")).toBeNull();
			}
		);
	});

	describe("searching", () => {
		test("puts the list back as it was when the search text is cleared", async () => {
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} />);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);
			expect(options(container)).toHaveLength(4);

			await userEvent.type(input, "kot");
			expect(optionLabels(container)).toEqual(["Kotlin"]);

			await userEvent.clear(input);
			expect(options(container)).toHaveLength(4);
		});

		test("keeps a selection made while searching after the search is cleared", async () => {
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} onChange={onChange} />);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);
			await userEvent.type(input, "kot");
			await userEvent.click(options(container)[0]);

			expect(reportedIds(onChange)).toEqual(["kotlin"]);

			const selected = options(container).filter(
				(option) => checkboxOf(option).getAttribute("aria-checked") === "true"
			);
			expect(selected.map((option) => getByDataRole(option, DataRoles.Dropdown.Text).textContent)).toEqual(["Kotlin"]);
		});
	});

	describe("moving on with the keyboard", () => {
		test("steps from the option list to the clear button and back to the field", async () => {
			const { container } = render(
				<Multiselect
					id="languages"
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "java" }))}
					enableSelectAllOption={false}
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			const dropdown = await openDropdown(container);

			// Tab does not leave the widget while the list is open: it goes to the clear button first,
			// and Shift+Tab returns to the field.
			await press(dropdown, "{Tab}");
			expect(clearButton(container, "languages")).toHaveFocus();

			await press(dropdown, "{Shift>}{Tab}{/Shift}");
			expect(input).toHaveFocus();
		});

		test("drops a selection on close that the caller never fed back through items", async () => {
			// The widget is effectively controlled: closing the list re-derives the selection from
			// `items`, so a caller that ignores `onChange` loses what the user picked. Pinned here
			// because it is easy to change by accident and invisible until a consumer hits it.
			const onChange = vi.fn();
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} onChange={onChange} />);

			await openDropdown(container);
			await userEvent.click(options(container)[0]);
			expect(reportedIds(onChange)).toEqual(["java"]);

			// The list lives in a portal outside the widget, so the key has to reach the field itself —
			// closing it from the list is what the Tab handler above covers.
			await press(getByDataRole(container, DataRoles.TextField.Input), "{Escape}");

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();
			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("");
		});

		test("keeps the selection the caller feeds back, and reports it once", async () => {
			const onChange = vi.fn();
			const { container } = render(<ControlledMultiselect onChange={onChange} />);

			await openDropdown(container);
			await userEvent.click(options(container)[0]);
			expect(onChange).toHaveBeenCalledTimes(1);

			await userEvent.click(document.body);

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();
			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("Java");
			// Closing must not report the same selection a second time.
			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	// The existing suite asserts these four handlers are *called* with the right arguments, but
	// nothing checked that what they return is what the widget then renders — so a refactor could
	// drop a handler's result entirely and stay green.
	describe("the handlers that decide order, filtering and display", () => {
		test("puts the selected options in front by default", async () => {
			const { container } = render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "kotlin" }))}
					enableSelectAllOption={false}
				/>
			);

			await openDropdown(container);
			expect(optionLabels(container)).toEqual(["Kotlin", "Java", "Groovy", "Scala"]);
		});

		test("follows a custom grouping of the options", async () => {
			// Selected options need not come first: the grouping handler decides, and this one keeps
			// every option in the unselected group, reversed.
			const groupingHandler = vi.fn(() => ({ selectedItems: [], unselectedItems: [...ITEMS].reverse() }));
			const { container } = render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "kotlin" }))}
					groupingHandler={groupingHandler}
					enableSelectAllOption={false}
				/>
			);

			await openDropdown(container);
			expect(optionLabels(container)).toEqual(["Scala", "Kotlin", "Groovy", "Java"]);
		});

		test("leaves the options in the order they were given when no sorting handler is set", async () => {
			// `sortingHandler` is documented as defaulting to alphanumerical, but every call site reads
			// `sortingHandler ? sortingHandler(...) : <unsorted>` — there is no default. Alphabetical
			// order would be Groovy, Java, Kotlin, Scala.
			const { container } = render(<Multiselect items={ITEMS} enableSelectAllOption={false} />);

			await openDropdown(container);
			expect(optionLabels(container)).toEqual(["Java", "Groovy", "Kotlin", "Scala"]);
		});

		test("renders the options in the order a custom sorting handler returns", async () => {
			const sortingHandler = vi.fn((items: MultiselectProps.Items) => {
				const flat = Array.isArray(items) ? items : [...items.selectedItems, ...items.unselectedItems];

				return [...flat].sort((one, other) => other.label.localeCompare(one.label));
			});
			const { container } = render(
				<Multiselect items={ITEMS} sortingHandler={sortingHandler} enableSelectAllOption={false} />
			);

			await openDropdown(container);
			expect(sortingHandler).toHaveBeenCalled();
			expect(optionLabels(container)).toEqual(["Scala", "Kotlin", "Java", "Groovy"]);
		});

		test("shows only what a custom filtering handler returns", async () => {
			// Matching on the start of the label rather than anywhere in it, so a search the default
			// handler would answer with two options answers with none.
			const filteringHandler = vi.fn((searchText: string, items: MultiselectProps.Items) => {
				const flat = Array.isArray(items) ? items : [...items.selectedItems, ...items.unselectedItems];

				return flat.filter((item) => item.label.toLowerCase().startsWith(searchText.toLowerCase()));
			});
			const { container } = render(
				<Multiselect
					items={ITEMS}
					filteringHandler={filteringHandler}
					hintTemplate="{count} of {total} options shown"
					enableSelectAllOption={false}
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);

			// "o" appears inside Groovy and Kotlin, but starts neither.
			await userEvent.type(input, "o");

			expect(filteringHandler).toHaveBeenCalledWith("o", expect.anything());
			expect(queryByDataRole(container, DataRoles.Dropdown.Item)).toBeFalsy();
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("0 of 4 options shown");
		});

		test("narrows to what a custom filtering handler matches", async () => {
			const filteringHandler = (searchText: string, items: MultiselectProps.Items) => {
				const flat = Array.isArray(items) ? items : [...items.selectedItems, ...items.unselectedItems];

				return flat.filter((item) => item.label.toLowerCase().startsWith(searchText.toLowerCase()));
			};

			const { container } = render(
				<Multiselect items={ITEMS} filteringHandler={filteringHandler} enableSelectAllOption={false} />
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);
			await userEvent.type(input, "s");

			expect(optionLabels(container)).toEqual(["Scala"]);
		});

		test("puts what a custom joining handler returns in the field", async () => {
			const joiningHandler = vi.fn((selectedItems: MultiselectProps.Item[]) =>
				selectedItems.map((item) => item.label).join(" / ")
			);
			const { container } = render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "java" || item.id === "groovy" }))}
					joiningHandler={joiningHandler}
				/>
			);

			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("Java / Groovy");
		});

		test("tells the joining handler that the list is closed while it is", async () => {
			// Declared with the handler's own signature so that the reported arguments stay typed.
			const joiningHandler = vi.fn(
				(_selectedItems: MultiselectProps.Item[], _items: MultiselectProps.Items, _dropdownClosed: boolean) => "joined"
			);
			render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "java" }))}
					joiningHandler={joiningHandler}
				/>
			);

			expect(joiningHandler.mock.calls[0][2]).toBe(true);
		});

		test("shows the search text rather than the selection while the list is open", async () => {
			const { container } = render(
				<Multiselect
					items={ITEMS.map((item) => ({ ...item, selected: item.id === "java" }))}
					enableSelectAllOption={false}
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			expect(input).toHaveValue("Java");

			// Opening hands the field over to typing, so the joined selection makes way for the search.
			await userEvent.click(input);
			expect(input).toHaveValue("");

			await userEvent.type(input, "sca");
			expect(input).toHaveValue("sca");
			expect(optionLabels(container)).toEqual(["Scala"]);
		});
	});
});
