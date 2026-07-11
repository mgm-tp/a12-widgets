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

import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	getByRole,
	queryAllByDataRole,
	queryByDataRole,
	render,
	waitFor
} from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import type { ReactElement } from "react";

import { Link } from "../../../link/main/link/link.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { noop } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { DropDownItem } from "../../../dropdown/index.js";

import { MobileAutocomplete } from "../main/autocomplete.mobile.view.js";

import { inputProps, cityItems } from "./data.js";

describe("com.mgmtp.a12.widgets.autocomplete.mobile", () => {
	test("render default mobile autocomplete", async () => {
		const { container } = render(<MobileAutocomplete {...inputProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render readonly mobile autocomplete", async () => {
		const { container } = render(<MobileAutocomplete {...inputProps} readonly />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(input).toHaveAttribute("readonly", "");

		await userEvent.click(input);
		await waitFor(() => {
			expect(container.firstElementChild?.children).toHaveLength(1);
		});
	});

	test("render disabled mobile autocomplete", async () => {
		const { container } = render(<MobileAutocomplete {...inputProps} disabled />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(input).toBeDisabled();

		fireEvent.click(input);
		await waitFor(() => {
			expect(container.firstElementChild?.children).toHaveLength(1);
		});
	});

	test("render loading mobile autocomplete", async () => {
		const { container } = render(<MobileAutocomplete {...inputProps} loading />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(input);
		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("mobile autocomplete events", async () => {
		const onSearchSpy = vi.fn();
		const onValueChange = vi.fn();

		const { container } = render(
			<MobileAutocomplete {...inputProps} onSearch={onSearchSpy} onValueChange={onValueChange} />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);
		expect(onSearchSpy).toHaveBeenCalledTimes(1);

		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();

		const modalInput = getByDataRole(modal, DataRoles.TextField.Input) as HTMLInputElement;

		fireEvent.input(modalInput, { target: { value: "A" } });
		await waitFor(() => {
			expect(modalInput.value).toBe("A");
			expect(onSearchSpy).toHaveBeenCalledTimes(2);
		});
		const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);
		await userEvent.click(dropdownItems[0]);
		await waitFor(() => {
			expect(container.firstElementChild?.children).toHaveLength(1);
			expect(onValueChange).toHaveBeenCalledTimes(1);
		});
	});

	test("focus input without opening the list", async () => {
		const { container } = render(<MobileAutocomplete {...inputProps} openOnFocus={false} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.focus(input);
		await waitFor(() => {
			const modal = queryByDataRole(container, DataRoles.Modal.Overlay);
			expect(modal).toBeFalsy();
		});

		fireEvent.keyDown(input, { key: "Enter" });
		await waitFor(() => {
			const modal = queryByDataRole(container, DataRoles.Modal.Overlay);
			expect(modal).toBeTruthy();
		});
	});

	test("onValueChange should not be triggered when picking the currently selected item", async () => {
		const onValueChange = vi.fn();

		const { container } = render(<MobileAutocomplete {...inputProps} onValueChange={onValueChange} value="" />);

		const openAutocomplete = async () => {
			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		let dropdownItems = await openAutocomplete();
		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = await openAutocomplete();
		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = await openAutocomplete();
		await userEvent.click(dropdownItems[1]);
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	test("onValueChange should be triggered when change input value to empty string", async () => {
		const onValueChange = vi.fn();
		const { container } = render(<MobileAutocomplete {...inputProps} onValueChange={onValueChange} value="" />);

		const input = getByDataRole(container, DataRoles.TextField.Input);

		const openDropdown = async (): Promise<HTMLElement[]> => {
			await userEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		const changeInputValue = async (value: string): Promise<void> => {
			await userEvent.click(input);

			const modalContent = getByDataRole(container, DataRoles.Modal.OverlayContent);
			const modalHeader = getByDataRole(modalContent, DataRoles.Contentbox.Header);
			const closeButton = getByDataRole(modalHeader, DataRoles.Button);
			const modalInput = getByDataRole(modalContent, DataRoles.TextField.Input);

			if (value === "") {
				await userEvent.clear(modalInput);
			} else {
				await userEvent.type(modalInput, value);
			}

			await userEvent.click(closeButton);
		};

		await openDropdown();

		await userEvent.click(getByRole(container, "button", { name: "Save and close" }));

		expect(onValueChange).not.toHaveBeenCalled();

		const dropdownItems = await openDropdown();

		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledWith(inputProps.items[0]);
		onValueChange.mockReset();

		await changeInputValue("    ");
		expect(onValueChange).not.toHaveBeenCalled();

		await changeInputValue("notmatchtext");
		expect(onValueChange).not.toHaveBeenCalled();

		await changeInputValue("");
		expect(onValueChange).toHaveBeenCalledWith("");
	});

	test("render autocomplete with link options on mobile", async () => {
		const { container } = render(
			<MobileAutocomplete
				id={inputProps.id}
				label="Autocomplete with Links mobile"
				hintTemplate={inputProps.hintTemplate}
				items={inputProps.items}
				links={[
					<Link>Assign to me</Link>,
					<Link>
						<Icon>person_remove</Icon> Remove assignment
					</Link>
				]}
			/>
		);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("if `items` list is initialized empty, a new item should be added when pressing ENTER", async () => {
		const onValueChangeSpy = vi.fn();
		const onSearchSpy = vi.fn();

		const { container } = render(
			<MobileAutocomplete
				label="Add new item initially"
				value=""
				items={[]}
				hintTemplate={inputProps.hintTemplate}
				onValueChange={onValueChangeSpy}
				onSearch={onSearchSpy}
				allowAddingNewItem
			/>
		);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();

		const getDropdownItems = () => {
			return queryAllByDataRole(modal, DataRoles.Dropdown.Item);
		};

		expect(getDropdownItems()).toHaveLength(0);

		const input = getByDataRole(modal, DataRoles.TextField.Input);
		fireEvent.input(input, { target: { value: "New York" } });
		await userEvent.keyboard("{Enter}");
		expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("if `items` list is initialized empty, a new item should be added when blurring the input", async () => {
		const onValueChangeSpy = vi.fn();
		const onSearchSpy = vi.fn();

		const { container } = render(
			<MobileAutocomplete
				label="Add new item initially"
				value=""
				items={[]}
				hintTemplate={inputProps.hintTemplate}
				onValueChange={onValueChangeSpy}
				onSearch={onSearchSpy}
				allowAddingNewItem
			/>
		);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();

		const getDropdownItems = () => {
			return queryAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		expect(getDropdownItems()).toHaveLength(0);

		const input = getByDataRole(modal, DataRoles.TextField.Input);
		fireEvent.input(input, { target: { value: "London" } });
		fireEvent.blur(input);
		expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("Should render and handle interaction safely when a mobile autocomplete item contains React children", async () => {
		const MobileAutocompleteContainer = (): ReactElement => {
			const onValueChangeSpy = vi.fn();

			const items: DropDownItem[] = [
				{
					label: "Custom item",
					graphic: <Icon>mail</Icon>
				}
			];

			return (
				<MobileAutocomplete
					hintTemplate={inputProps.hintTemplate}
					items={items}
					value={items[0]}
					onValueChange={onValueChangeSpy}
				/>
			);
		};

		const { getByDataRole } = render(<MobileAutocompleteContainer />);
		const input = getByDataRole(DataRoles.TextField.Input);

		await userEvent.click(input);

		const dropdownItem = getByDataRole(DataRoles.Dropdown.Item);
		expect(dropdownItem).toBeTruthy();

		// Verify that clicking the dropdown item does not throw an error
		await expect(userEvent.click(dropdownItem)).resolves.not.toThrow();
	});

	test("Should trigger `onDropdownClose` when the dropdown is closed", async () => {
		const onDropdownClose = vi.fn();

		const { container } = render(<MobileAutocomplete {...inputProps} onDropdownClose={onDropdownClose} value="" />);

		const openAutocomplete = async () => {
			const input = getByDataRole(container, DataRoles.TextField.Input);
			await userEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		const dropdownItems = await openAutocomplete();
		await userEvent.click(dropdownItems[0]);
		expect(onDropdownClose).toHaveBeenCalledTimes(1);

		await openAutocomplete();
		await userEvent.keyboard("{Escape}");
		expect(onDropdownClose).toHaveBeenCalledTimes(2);

		await openAutocomplete();
		await userEvent.click(document.body);
		expect(onDropdownClose).toHaveBeenCalledTimes(3);
	});

	describe("Autocomplete mobile modal interactions", () => {
		test("Modal should open and the focus is set on input field after clicking to input, selecting item closes modal", async () => {
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const inputModal = modalOverlay.querySelector(`[data-role="${DataRoles.TextField.Input}"]`) as HTMLInputElement;
			expect(inputModal).toBeTruthy();

			await waitFor(() => {
				expect(inputModal).toHaveFocus();
			});

			// Select the first dropdown item to close the modal
			const item = container.querySelector(`[data-role="${DataRoles.Dropdown.Item}"]`) as HTMLElement;
			expect(item).toBeTruthy();

			await userEvent.click(item);

			await waitFor(() => {
				expect(
					container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`)
				).not.toBeInTheDocument();
			});

			expect((input as HTMLInputElement).value).toBe(cityItems[0]);
		});

		test("Modal should be closed without selecting any new item when pressing Save and Close button", async () => {
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const button = container.querySelector("[aria-label='Save and close']") as HTMLElement;
			expect(button).toBeTruthy();

			await userEvent.click(button);

			await waitFor(() => {
				expect(
					container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`)
				).not.toBeInTheDocument();
			});

			expect((input as HTMLInputElement).value).toBe("");
		});

		test("Modal should be closed without clearing the selected item", async () => {
			const inputValue = cityItems[2];
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" value={inputValue} onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			// First round: backspace all characters then press space, then save/close
			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const inputModal = modalOverlay.querySelector(`[data-role="${DataRoles.TextField.Input}"]`) as HTMLInputElement;
			expect(inputModal).toBeTruthy();

			await userEvent.click(inputModal);

			for (let i = 0; i < inputValue.length; i++) {
				await userEvent.keyboard("{Backspace}");
			}

			await userEvent.keyboard(" ");

			const button = container.querySelector("[aria-label='Save and close']") as HTMLElement;
			expect(button).toBeTruthy();

			await userEvent.click(button);

			await waitFor(() => {
				expect((input as HTMLInputElement).value).toBe(inputValue);
			});

			// Second round: backspace all characters then type non-existing item, then save/close
			await userEvent.click(input);

			const inputModal2 = container.querySelector(
				`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`
			) as HTMLInputElement;
			expect(inputModal2).toBeTruthy();

			await userEvent.click(inputModal2);

			for (let i = 0; i < inputValue.length; i++) {
				await userEvent.keyboard("{Backspace}");
			}

			await userEvent.type(inputModal2, "not existing item");

			const button2 = container.querySelector("[aria-label='Save and close']") as HTMLElement;
			expect(button2).toBeTruthy();

			await userEvent.click(button2);

			await waitFor(() => {
				expect((input as HTMLInputElement).value).toBe(inputValue);
			});
		});

		test("Modal should be closed with clearing the selected item via clear button", async () => {
			const inputValue = cityItems[2];
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" value={inputValue} onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const buttonClear = modalOverlay.querySelector("[aria-label='Clear text']") as HTMLElement;
			expect(buttonClear).toBeTruthy();

			const buttonSaveAndClose = modalOverlay.querySelector("[aria-label='Save and close']") as HTMLElement;
			expect(buttonSaveAndClose).toBeTruthy();

			await userEvent.click(buttonClear);
			await userEvent.click(buttonSaveAndClose);

			await waitFor(() => {
				expect((input as HTMLInputElement).value).toBe("");
			});
		});

		test("Modal should close with selecting the matched item after Enter to a matching item", async () => {
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const inputModal = modalOverlay.querySelector(`[data-role="${DataRoles.TextField.Input}"]`) as HTMLInputElement;
			expect(inputModal).toBeTruthy();

			await userEvent.click(inputModal);
			await userEvent.clear(inputModal);
			await userEvent.type(inputModal, "London");
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(
					container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`)
				).not.toBeInTheDocument();
			});

			expect((input as HTMLInputElement).value).toBe(cityItems[1]);
		});

		test("Should clear input value when tapping on the clear button", async () => {
			const { container } = render(
				<MobileAutocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />
			);
			const input = getByDataRole(container, DataRoles.TextField.Input);

			await userEvent.click(input);

			const modalOverlay = container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"]`) as HTMLElement;
			expect(modalOverlay).toBeTruthy();

			const inputModal = modalOverlay.querySelector(`[data-role="${DataRoles.TextField.Input}"]`) as HTMLInputElement;
			expect(inputModal).toBeTruthy();

			await userEvent.click(inputModal);
			await userEvent.clear(inputModal);
			await userEvent.type(inputModal, "London");
			await userEvent.keyboard("{Enter}");

			// After selecting "London", modal should close. Now find the input wrapper and blur it.
			const inputWrapper = container.querySelector(`[data-role="${DataRoles.TextField.Input.Wrapper}"]`) as HTMLElement;
			expect(inputWrapper).toBeTruthy();

			fireEvent.blur(inputWrapper);

			// Find the clear button within the input wrapper
			const clearButton = inputWrapper.querySelector(`[data-role="${DataRoles.Button}"]`) as HTMLElement;
			expect(clearButton).toBeTruthy();

			await userEvent.click(clearButton);

			// After tapping the clear button, the modal should reopen with an empty input
			await waitFor(() => {
				const reopenedInputModal = container.querySelector(
					`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`
				) as HTMLInputElement;
				expect(reopenedInputModal).toBeVisible();
				expect(reopenedInputModal.value).toBe("");
			});

			// The clear button should not be visible within the modal since the input is now empty
			await waitFor(() => {
				const modalClearButton = container.querySelector(
					`[data-role="${DataRoles.Modal.Overlay}"] [aria-label='Clear text']`
				);

				if (modalClearButton) {
					expect(modalClearButton).not.toBeVisible();
				} else {
					expect(modalClearButton).toBeNull();
				}
			});
		});

		test("Should not render the clear button when `enableClearButton` is false", async () => {
			const { container } = render(
				<MobileAutocomplete
					enableClearButton={false}
					items={cityItems}
					onValueChange={noop}
					hintTemplate="Just a hint"
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);

			const getClearButtonInTrigger = () =>
				container.querySelector(
					`[data-role="${DataRoles.Autocomplete}"] > [data-role="${DataRoles.TextField}"] [aria-label='Clear text']`
				);

			// Check if the input's clear button is not rendered when the input is empty
			expect(getClearButtonInTrigger()).toBeFalsy();

			await userEvent.click(input);

			// Check if the input modal's clear button is not rendered when the input is empty
			const getModalClearButton = () =>
				container.querySelector(`[data-role="${DataRoles.Modal.Overlay}"] [aria-label='Clear text']`);

			expect(getModalClearButton()).toBeFalsy();

			const inputModal = container.querySelector(
				`[data-role="${DataRoles.Modal.Overlay}"] [data-role="${DataRoles.TextField.Input}"]`
			) as HTMLInputElement;
			expect(inputModal).toBeTruthy();

			await userEvent.click(inputModal);
			await userEvent.clear(inputModal);
			await userEvent.type(inputModal, "Seoul");

			// Check if the input modal's clear button is still not rendered when the input has a value
			await waitFor(() => {
				expect(getModalClearButton()).toBeFalsy();
			});

			await userEvent.keyboard("{Enter}");

			// Check if the input's clear button is still not rendered when the modal is closed and the input has a value
			await waitFor(() => {
				expect(getClearButtonInTrigger()).toBeFalsy();
			});
		});
	});
});
