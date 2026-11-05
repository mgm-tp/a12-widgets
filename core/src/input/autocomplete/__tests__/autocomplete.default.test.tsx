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
import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	isAfter,
	queryAllByDataRole,
	queryByDataRole,
	render,
	waitFor
} from "test-utils";
import { Key } from "ts-key-enum";
import { afterEach, describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { provider } from "../../../common/main/device-detector.js";
import { noop } from "../../../common/main/utils.js";
import { navigateWithTab } from "../../../common/test/user-event-utils.js";
import type { DropDownItem } from "../../../dropdown/index.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import { Autocomplete } from "../main/autocomplete.view.js";

import { cityItems, inputProps } from "./data.js";

describe("com.mgmtp.a12.widgets.autocomplete.behavior", () => {
	test("render default autocomplete", () => {
		const { container } = render(<Autocomplete {...inputProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render readonly autocomplete", () => {
		const { container } = render(<Autocomplete {...inputProps} readonly />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		expect(container.firstElementChild?.children).toHaveLength(1);
	});

	test("render disabled autocomplete", async () => {
		const { container } = render(<Autocomplete {...inputProps} disabled />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		expect(container.firstElementChild?.children).toHaveLength(1);
	});

	test("autocomplete loading state", () => {
		const { container } = render(<Autocomplete {...inputProps} loading />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("shows the loading overlay while a search has not produced its items yet", async () => {
		// An async search in flight: no matches, no hint, no links — so the list itself has nothing to
		// show, but the field must still say that it is working.
		const { container } = render(
			<Autocomplete label="City" items={[]} hintTemplate="" onSearch={vi.fn()} loading onValueChange={noop} />
		);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		// The indicator holds itself back briefly, so that a search that returns at once does not flash it.
		await waitFor(() => expect(queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay)).toBeVisible());
	});

	test("marks the committed value as the active option when it is the first of the list", async () => {
		// Options without a `value` are identified by their label and generated id, which has to come out
		// the same for the option in the list and for the committed value — including at index 0.
		const items: DropDownItem[] = [{ label: "Apple" }, { label: "Banana" }];
		const { container } = render(
			<Autocomplete label="Fruit" items={items} hintTemplate="" value={items[0]} onValueChange={noop} />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);

		const options = getAllByDataRole(container, DataRoles.Dropdown.Item);
		expect(options[0]).toHaveAttribute("id", "Apple");
		expect(options[0]).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", "Apple");
	});

	test("focus input without opening the list", () => {
		const { container } = render(<Autocomplete {...inputProps} openOnFocus={false} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		fireEvent.focus(input);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();

		fireEvent.keyDown(input, { key: Key.Enter });
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();
	});

	test("autocomplete events", async () => {
		const onSearchSpy = vi.fn();
		const onValueChange = vi.fn();

		const { container } = render(
			<Autocomplete {...inputProps} onSearch={onSearchSpy} onValueChange={onValueChange} value="a" />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(input);

		// onSearch callback would be called twice for focus and click events
		expect(onSearchSpy).toHaveBeenCalledTimes(2);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		fireEvent.click(queryAllByDataRole(container, DataRoles.Dropdown.Item)[0]);
		expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	test("onValueChange should not be triggered when picking the currently selected item", () => {
		const onValueChange = vi.fn();

		const { container } = render(<Autocomplete {...inputProps} onValueChange={onValueChange} value="" />);

		const getDropdownItems = () => {
			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		let dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[1]);
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	test("onValueChange should be triggered when change input value to empty string", async () => {
		const onValueChange = vi.fn();

		const { container } = render(
			<Autocomplete
				hintTemplate={inputProps.hintTemplate}
				items={inputProps.items}
				onValueChange={onValueChange}
				value=""
			/>
		);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		const openDropdown = async () => {
			await userEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		await openDropdown();
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		let dropdownItems = await openDropdown();

		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledWith(inputProps.items[0]);
		onValueChange.mockReset();

		await userEvent.type(input, "     ");
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		await userEvent.type(input, "notmatchtext");
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		await userEvent.clear(input);
		await userEvent.click(document.body);
		expect(onValueChange).toHaveBeenCalledWith("");
		onValueChange.mockReset();

		dropdownItems = await openDropdown();

		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledWith(inputProps.items[0]);
		onValueChange.mockReset();

		await userEvent.clear(input);
		await navigateWithTab(userEvent, () => !input.contains(document.activeElement));
		expect(onValueChange).toHaveBeenCalledWith("");
	});

	test("Input caret position should not change after focus to the middle of input text", async () => {
		const selectedValue = "AppleScript";

		// Start with autocomplete component that has already had selectedValue
		const { container, rerender } = render(<Autocomplete {...inputProps} value={selectedValue} />);
		const inputEl = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		// Cursor position is at the end of selectedValue
		expect(inputEl.selectionStart).toEqual(selectedValue.length);
		expect(inputEl.selectionEnd).toEqual(selectedValue.length);

		const focusPosition = 5;
		fireEvent.focus(inputEl);
		inputEl.setSelectionRange(focusPosition, focusPosition);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);

		// Rerender component with new value of items to simulate onSearch handle when focusing the input
		rerender(<Autocomplete {...inputProps} value={selectedValue} items={[...(inputProps.items as string[])]} />);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);
	});

	test("Input caret position should not change after option items change from empty to the list which contains input value", async () => {
		const selectedValue = "AppleScript";

		// Start with autocomplete component that has already had selectedValue
		const { container, rerender } = render(<Autocomplete {...inputProps} value={selectedValue} items={[]} />);
		const inputEl = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		// Cursor position is at the end of selectedValue
		expect(inputEl.selectionStart).toEqual(selectedValue.length);
		expect(inputEl.selectionEnd).toEqual(selectedValue.length);

		const focusPosition = 5;
		fireEvent.focus(inputEl);
		inputEl.setSelectionRange(focusPosition, focusPosition);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);

		// Rerender component with new value of items that contains selectedValue
		rerender(<Autocomplete {...inputProps} value={selectedValue} items={[...(inputProps.items as string[])]} />);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);
	});

	test("Should render and handle interaction safely when an autocomplete item contains React children", async () => {
		const AutocompleteContainer = (): ReactElement => {
			const onValueChangeSpy = vi.fn();

			const items: DropDownItem[] = [
				{
					label: "Custom item",
					graphic: <Icon>mail</Icon>
				}
			];

			return (
				<Autocomplete
					hintTemplate={inputProps.hintTemplate}
					items={items}
					value={items[0]}
					onValueChange={onValueChangeSpy}
				/>
			);
		};

		const { getByDataRole } = render(<AutocompleteContainer />);
		const input = getByDataRole(DataRoles.TextField.Input);

		await userEvent.click(input);

		const dropdownItem = getByDataRole(DataRoles.Dropdown.Item);
		expect(dropdownItem).toBeTruthy();

		// Verify that clicking the dropdown item does not throw an error
		expect(async () => {
			await userEvent.click(dropdownItem);
		}).not.toThrowError();
	});

	// The counterpart of what the dialog does: there is an on-screen keyboard in the way of the options
	// on a touch device too, once the caller pins the attached presentation with `mobileModal={false}`.
	describe("[Mobile] the on-screen keyboard makes room for the options", () => {
		// The provider is a module singleton, so the spy has to go again before the next case runs.
		afterEach(() => {
			vi.restoreAllMocks();
		});

		test("scrolling the attached list takes the focus off the field, which closes the keyboard", async () => {
			vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const { container } = render(<Autocomplete {...inputProps} items={cityItems} mobileModal={false} />);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const list = await waitFor(() => getByDataRole(document.body, DataRoles.Dropdown.Content));
			expect(input).toHaveFocus();

			fireEvent.scroll(list);

			await waitFor(() => expect(input).not.toHaveFocus());
		});

		test("a pointer scrolling the same list on a desktop keeps the focus, and with it the keyboard navigation", async () => {
			vi.spyOn(provider, "hasTouch").mockReturnValue(false);

			const { container } = render(<Autocomplete {...inputProps} items={cityItems} mobileModal={false} />);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const list = await waitFor(() => getByDataRole(document.body, DataRoles.Dropdown.Content));

			fireEvent.scroll(list);

			await userEvent.keyboard(`{${Key.ArrowDown}}`);
			expect(input).toHaveFocus();
			expect(input).toHaveAttribute("aria-activedescendant");
		});
	});

	describe("adding item", () => {
		test("if `items` list is initialized empty, a new item should be added when pressing ENTER", async () => {
			const onValueChangeSpy = vi.fn();
			const onSearchSpy = vi.fn();

			const { container } = render(
				<Autocomplete
					label="Add new item initially"
					value=""
					items={[]}
					hintTemplate={inputProps.hintTemplate}
					onValueChange={onValueChangeSpy}
					onSearch={onSearchSpy}
					allowAddingNewItem
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);

			fireEvent.input(input, { target: { value: "New York" } });
			fireEvent.keyDown(input, { key: Key.Enter });
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
		});

		test("if `items` list is initialized empty, a new item should be added when clicking outside", () => {
			const onValueChangeSpy = vi.fn();
			const onSearchSpy = vi.fn();

			const { container } = render(
				<Autocomplete
					label="Add new item initially"
					value=""
					items={[]}
					hintTemplate={inputProps.hintTemplate}
					onValueChange={onValueChangeSpy}
					onSearch={onSearchSpy}
					allowAddingNewItem
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);

			fireEvent.input(input, { target: { value: "London" } });
			fireEvent.mouseDown(document.body);
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
		});

		test("Should trigger `onDropdownClose` when the dropdown is closed", async () => {
			const onDropdownClose = vi.fn();

			const { container } = render(<Autocomplete {...inputProps} onDropdownClose={onDropdownClose} value="" />);

			const openDropdown = async () => {
				const input = getByDataRole(container, DataRoles.TextField.Input);
				await userEvent.click(input);

				return getAllByDataRole(container, DataRoles.Dropdown.Item);
			};

			const dropdownItems = await openDropdown();
			await userEvent.click(dropdownItems[0]);
			expect(onDropdownClose).toHaveBeenCalledTimes(1);

			await openDropdown();
			await userEvent.keyboard("{Escape}");
			expect(onDropdownClose).toHaveBeenCalledTimes(2);

			await openDropdown();
			await userEvent.click(document.body);
			expect(onDropdownClose).toHaveBeenCalledTimes(3);
		});

		test("closes on an outside click while a search without matches leaves nothing to show", async () => {
			// No matches, no hint and no links: the popup has no content, but the list still counts as
			// open, so every way of closing it again has to keep working.
			const onDropdownClose = vi.fn();
			const { container } = render(
				<Autocomplete
					label="City"
					hintTemplate=""
					items={["Java", "Groovy"]}
					onValueChange={noop}
					onDropdownClose={onDropdownClose}
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);
			await userEvent.type(input, "zzz");

			expect(queryAllByDataRole(document.body, DataRoles.Dropdown.Item)).toHaveLength(0);

			await userEvent.click(document.body);
			await waitFor(() => {
				expect(onDropdownClose).toHaveBeenCalledTimes(1);
			});

			// ... and the field opens again afterwards, rather than staying wedged in an open state.
			await userEvent.clear(input);
			await userEvent.click(input);

			await waitFor(() => {
				expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(2);
			});
		});
	});

	describe("grouped and disabled options", () => {
		const groupedItems: DropDownItem[] = [
			{ label: "Germany", children: [{ label: "Berlin" }, { label: "Munich" }] },
			{ label: "France", children: [{ label: "Paris" }, { label: "Lyon" }] }
		];

		const groupedProps = {
			id: "grouped",
			label: "City",
			items: groupedItems,
			hintTemplate: "{count} of {total} options shown",
			onValueChange: noop
		} as const;

		const openList = async (container: HTMLElement): Promise<HTMLElement[]> => {
			await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		test("renders the options of a group under a heading of their own", async () => {
			const { container } = render(<Autocomplete {...groupedProps} />);
			const options = await openList(container);

			// The groups themselves are headings, not options: only the four leaves are selectable.
			expect(options.map((option) => option.textContent)).toEqual(["Berlin", "Munich", "Paris", "Lyon"]);
			expect(getAllByDataRole(container, DataRoles.Dropdown.SectionItem)).toHaveLength(2);
		});

		test("counts the options of a grouped list, not its groups, in the hint", async () => {
			const { container } = render(<Autocomplete {...groupedProps} />);
			await openList(container);

			expect(getByDataRole(container, DataRoles.Dropdown.Hint)).toHaveTextContent("4 of 4 options shown");
		});

		test("arrows through a grouped list by option, stepping over the headings", async () => {
			const { container } = render(<Autocomplete {...groupedProps} />);
			const options = await openList(container);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			// Munich is the last option of the first group and Paris the first of the second, so moving
			// from one to the other is what crosses a heading.
			await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");

			await waitFor(() => {
				expect(input).toHaveAttribute("aria-activedescendant", options[2].id);
			});
			expect(options[2]).toHaveTextContent("Paris");
		});

		test("commits an option chosen from inside a group", async () => {
			const onValueChange = vi.fn();
			const { container } = render(<Autocomplete {...groupedProps} onValueChange={onValueChange} />);
			const options = await openList(container);

			await userEvent.click(options[3]);

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toMatchObject({ label: "Lyon" });
			expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveValue("Lyon");
		});

		test("finds the committed option again when it sits inside a group", async () => {
			// Re-opening the list has to recognize the committed value among the options, which for a
			// grouped list means looking past the groups holding them.
			const { container } = render(<Autocomplete {...groupedProps} value="Munich" />);
			const options = await openList(container);

			await waitFor(() => {
				expect(options[1]).toHaveAttribute("aria-selected", "true");
			});
			expect(options.filter((option) => option.getAttribute("aria-selected") === "true")).toHaveLength(1);
		});

		test("marks a disabled option and does not commit it on a click", async () => {
			const onValueChange = vi.fn();
			const items: DropDownItem[] = [{ label: "Berlin" }, { label: "Munich", disabled: true }];
			const { container } = render(<Autocomplete id="d" label="City" items={items} onValueChange={onValueChange} />);
			const options = await openList(container);

			expect(options[1]).toHaveAttribute("aria-disabled", "true");

			// fireEvent, not userEvent: a disabled option takes no pointer events, so a real click never
			// reaches it and the driver waits for it to become actionable until it times out.
			fireEvent.click(options[1]);

			expect(onValueChange).not.toHaveBeenCalled();
		});

		test("steps over a disabled option on the way down the list", async () => {
			const items: DropDownItem[] = [{ label: "Berlin" }, { label: "Munich", disabled: true }, { label: "Hamburg" }];
			const { container } = render(<Autocomplete id="d" label="City" items={items} onValueChange={noop} />);
			const options = await openList(container);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.keyboard("{ArrowDown}{ArrowDown}");

			await waitFor(() => {
				expect(input).toHaveAttribute("aria-activedescendant", options[2].id);
			});
			expect(options[2]).toHaveTextContent("Hamburg");
		});

		test("does not commit a disabled option on Enter", async () => {
			const onValueChange = vi.fn();
			const items: DropDownItem[] = [{ label: "Munich", disabled: true }, { label: "Berlin" }];
			const { container } = render(<Autocomplete id="d" label="City" items={items} onValueChange={onValueChange} />);
			await openList(container);

			// Arrowing down from nothing skips the disabled first option and lands on Berlin.
			await userEvent.keyboard("{ArrowDown}{Enter}");

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toMatchObject({ label: "Berlin" });
		});
	});

	describe("message position", () => {
		const messageRoles = [
			DataRoles.TextField.ErrorMessage,
			DataRoles.TextField.WarningMessage,
			DataRoles.TextField.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<Autocomplete
					items={cityItems}
					label="Test Label"
					helperText="Test Helper Text"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
					hintTemplate=""
				/>
			);

		test("renders the messages above the control for above", () => {
			const { getByDataRole } = renderWithMessages("above");
			const control = getByDataRole(DataRoles.TextField.Control);
			const inputWrapper = getByDataRole(DataRoles.TextField.Input.Wrapper);
			const label = getByDataRole(DataRoles.TextField.Label);
			const helperText = getByDataRole(DataRoles.TextField.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(true);
				// label → message → control → helper text
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, inputWrapper)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});

		test("renders the messages below the control for below", () => {
			const { getByDataRole } = renderWithMessages("below");
			const control = getByDataRole(DataRoles.TextField.Control);
			const inputWrapper = getByDataRole(DataRoles.TextField.Input.Wrapper);
			const label = getByDataRole(DataRoles.TextField.Label);
			const helperText = getByDataRole(DataRoles.TextField.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(true);
				// label → control → message → helper text
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(inputWrapper, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak, helperText?: string) =>
			render(
				<Autocomplete
					items={cityItems}
					label="Test Label"
					helperText={helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
					hintTemplate=""
				/>
			);

		/**
		 * Inline tooltips do not use the text-field's tooltip slot at all: the autocomplete hands them to
		 * the text-field as `addonAfter`, so they arrive in the after-addon beside the control.
		 */
		test("renders the tooltips in the after-addon beside the control for false", () => {
			const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips(false);
			const control = getByDataRole(DataRoles.TextField.Control);
			const addon = getByDataRole("text-field--addon-after-0");
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.TextField.TooltipAddon)).toBeNull();
			expect(addon.contains(tooltip)).toBe(true);
			expect(isAfter(control, addon)).toBe(true);
		});

		test("renders the tooltips above the control for above", () => {
			const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips("above");
			const control = getByDataRole(DataRoles.TextField.Control);
			const inputWrapper = getByDataRole(DataRoles.TextField.Input.Wrapper);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole("text-field--addon-after-0")).toBeNull();
			expect(control.contains(tooltip)).toBe(true);
			expect(isAfter(tooltip, inputWrapper)).toBe(true);
		});

		test("renders the tooltips below the whole control row for below", () => {
			const { getByDataRole, getByText } = renderWithTooltips("below", "Test Helper Text");
			const control = getByDataRole(DataRoles.TextField.Control);
			const fieldMain = control.parentElement as HTMLElement;
			const helperText = getByDataRole(DataRoles.TextField.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(fieldMain.contains(tooltip)).toBe(false);
			expect(isAfter(fieldMain, tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});

	/** The combobox is the input itself in both presentations, so that is the element that is marked. */
	describe("aria-invalid", () => {
		test("marks the input as invalid for error", () => {
			const { getByDataRole } = render(<Autocomplete items={cityItems} label="Test Label" error hintTemplate="" />);

			expect(getByDataRole(DataRoles.TextField.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("marks the input as invalid for errorMessage", () => {
			const { getByDataRole } = render(
				<Autocomplete items={cityItems} label="Test Label" errorMessage="Test error message" hintTemplate="" />
			);

			expect(getByDataRole(DataRoles.TextField.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("does not mark the input as invalid for a warning or an info", () => {
			const { getByDataRole } = render(
				<Autocomplete
					items={cityItems}
					label="Test Label"
					warning
					info
					warningMessage="Test warning message"
					infoMessage="Test info message"
					hintTemplate=""
				/>
			);

			expect(getByDataRole(DataRoles.TextField.Input)).not.toHaveAttribute("aria-invalid");
		});
	});
});
