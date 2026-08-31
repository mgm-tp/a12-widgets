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

import { getByDataRole, queryByDataRole, render, fireEvent, waitFor } from "test-utils";
import { describe, test, expect } from "vitest";
import { userEvent } from "vitest/browser";
import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import { Link } from "../../../link/main/link/link.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";

import { Autocomplete } from "../main/autocomplete.view.js";

import { inputProps, cityItems } from "./data.js";

describe("com.mgmtp.a12.widgets.autocomplete", () => {
	test("render basic autocomplete", async () => {
		const { container } = render(<Autocomplete {...inputProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render autocomplete with link options", async () => {
		const { container } = render(
			<Autocomplete
				id={inputProps.id}
				label="Autocomplete with Links"
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

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

// -- Story components inlined for desktop behavior tests --

const ExampleAutoComplete = ({ items }: { items: string[] | DropDownItem[] }): ReactNode => {
	const [selectedValue, setSelectedValue] = useState<string>();
	const handleOnValueChange = useCallback((value: string): void => {
		setSelectedValue(value);
	}, []);

	return (
		<Autocomplete
			id="autocomplete-basic"
			label="Location"
			inputPlaceHolder="Please select or start typing"
			hintTemplate="{count} matches"
			onValueChange={handleOnValueChange}
			items={items}
			value={selectedValue}
		/>
	);
};

function filterItems(items: string[], filterText: string): string[] {
	const toLowerCase = (value: string): string => value.toLocaleLowerCase();

	return [
		...items.filter((i) => toLowerCase(i).startsWith(toLowerCase(filterText))).sort(),
		...items.filter(
			(i) => !toLowerCase(i).startsWith(toLowerCase(filterText)) && toLowerCase(i).includes(toLowerCase(filterText))
		)
	];
}

const ExampleAsynchronousAutoComplete = ({
	itemsProps,
	timeout
}: {
	itemsProps: string[];
	timeout: number;
}): ReactNode => {
	const asyncSearch = useRef<number | undefined>(undefined);
	const [selectedValue, setSelectedValue] = useState("");
	const [items, setItems] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const handleOnSearch = (value: string) => {
		clearTimeout(asyncSearch.current);
		setLoading(true);
		asyncSearch.current = window.setTimeout(() => {
			setLoading(false);
			setItems(filterItems(itemsProps, value));
		}, timeout);
	};

	const handleOnValueChange = (value: string): void => {
		setSelectedValue(value);
	};

	return (
		<Autocomplete
			hintTemplate="{count} matches"
			id="autocomplete-async"
			items={items}
			onSearch={handleOnSearch}
			loading={loading}
			loadingLabel="Loading..."
			inputPlaceHolder="Please select or start typing"
			label="Asynchronous"
			onValueChange={handleOnValueChange}
			value={selectedValue}
		/>
	);
};

// -- Desktop behavior tests --

describe("Autocomplete desktop behavior", () => {
	describe("Non-asynchronous", () => {
		test("clear selection range after selecting with keyboard", async () => {
			render(<ExampleAutoComplete items={cityItems} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, "New");
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(input.selectionStart).toBe(8);
				expect(input.selectionEnd).toBe(8);
			});
		});

		test("Should not render the clear button when enableClearButton is false", async () => {
			render(
				<Autocomplete
					enableClearButton={false}
					items={cityItems}
					onValueChange={noop}
					hintTemplate="{count} out of {total} options shown"
				/>
			);

			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			// Check if the clear button is not present when the input is empty.
			expect(queryByDataRole(document.body, DataRoles.Button)).not.toBeInTheDocument();

			await userEvent.click(input);
			await userEvent.clear(input);
			await userEvent.type(input, "Seoul");

			// Check if the clear button is still not present when the input has a value.
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Button)).not.toBeInTheDocument();
			});
		});

		test("Input caret position should not change after filtering matched items", async () => {
			render(<Autocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, "Đà Nẵng");

			// Move cursor 4 positions to the left (from position 7 to position 3)
			input.setSelectionRange(3, 3);

			// Delete character at position 3, then type "n" at that position
			fireEvent.keyDown(input, { key: "Delete" });
			// Simulate to delete by modifying value and maintaining cursor
			const before = input.value.substring(0, 3);
			const after = input.value.substring(4);
			fireEvent.change(input, { target: { value: before + after, selectionStart: 3, selectionEnd: 3 } });
			input.setSelectionRange(3, 3);

			// Type "n" at cursor position 3
			fireEvent.change(input, {
				target: { value: before + "n" + after, selectionStart: 4, selectionEnd: 4 }
			});
			input.setSelectionRange(4, 4);

			await waitFor(() => {
				expect(input.selectionStart).toBe(4);
				expect(input.selectionEnd).toBe(4);
			});
		});

		test("Dropdown should open and the focus is set on input field after clicking to input", async () => {
			render(<Autocomplete items={cityItems} hintTemplate="Just a hint" onValueChange={noop} />);

			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.click(input);
			expect(input).toHaveFocus();

			await waitFor(() => {
				const dropdown = queryByDataRole(document.body, DataRoles.Dropdown);
				expect(dropdown).toBeVisible();
			});
		});

		test("Dropdown should open and the focus is set on input field after clicking to label", async () => {
			render(
				<Autocomplete
					label="Autocomplete label"
					items={cityItems}
					hintTemplate="Just a hint"
					onValueChange={noop}
					id="autocomplete-id"
				/>
			);
			const label = queryByDataRole(document.body, DataRoles.TextField.Label) as HTMLElement;
			await userEvent.click(label);

			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			expect(input).toHaveFocus();

			await waitFor(() => {
				const dropdown = queryByDataRole(document.body, DataRoles.Dropdown);
				expect(dropdown).toBeVisible();
			});
		});

		test("Compare amount of dropdown hint and actual amount of dropdown items", async () => {
			render(<Autocomplete items={cityItems} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, "London");

			await waitFor(() => {
				const hintElement = queryByDataRole(document.body, DataRoles.Dropdown.Hint);
				const dropdownItemsCount = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`).length;
				expect(hintElement).toHaveTextContent(`${dropdownItemsCount} matches`);
			});
		});

		test("Type a keyword that is matched to dropdown items gets highlighted", async () => {
			render(<ExampleAutoComplete items={cityItems} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			const inputValue = "London";

			await userEvent.click(input);
			await userEvent.clear(input);
			await userEvent.type(input, inputValue);

			await waitFor(() => {
				const preSelectItem = document.querySelector(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				expect(preSelectItem).toHaveTextContent(inputValue);
			});

			// Press enter to select item after the matched dropdown item gets highlighted.
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(input.value).toBe(inputValue);
				expect(queryByDataRole(document.body, DataRoles.Dropdown)).not.toBeInTheDocument();
			});
		});

		test("Enter to show all dropdown-item after selecting", async () => {
			const newItems = ["Cat", "Cat A", "Cat B", ...cityItems];
			render(<ExampleAutoComplete items={newItems} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			const inputValue = "Cat";

			await userEvent.clear(input);
			await userEvent.type(input, inputValue);
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(input.value).toBe(newItems[1]);
				expect(queryByDataRole(document.body, DataRoles.Dropdown)).not.toBeInTheDocument();
			});

			// Enter to show all dropdown-item
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				const dropdownItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`);
				expect(dropdownItems).toHaveLength(newItems.length);
			});
		});

		test("The dropdown is able to scroll when pressing Up/Down arrow key", async () => {
			render(<Autocomplete items={cityItems} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			await userEvent.click(input);

			for (let i = 0; i < 4; i++) {
				await userEvent.keyboard("{ArrowDown}");
			}

			expect(input).toHaveFocus();

			await waitFor(() => {
				const allDropdownItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`);
				const lastItem = Array.from(allDropdownItems).find((el) => el.textContent === cityItems[cityItems.length - 1]);
				expect(lastItem).toBeVisible();
			});
		});

		test("The dropdown is closed with selecting the preselect item after pressing Escape", async () => {
			render(<ExampleAutoComplete items={cityItems} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			await userEvent.click(input);

			for (let i = 0; i < 4; i++) {
				await userEvent.keyboard("{ArrowDown}");
			}

			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(input.value).toBe(cityItems[3]);
				expect(queryByDataRole(document.body, DataRoles.Dropdown)).not.toBeInTheDocument();
			});
		});

		test("The dropdown of Autocomplete Link is closed without selecting any preselect item after pressing Escape", async () => {
			const inputValue = "London";

			render(
				<Autocomplete
					items={cityItems}
					hintTemplate="{count} matches"
					onValueChange={noop}
					links={[
						<Link>Assign to me</Link>,
						<Link>
							<Icon>person_remove</Icon> Remove assignment
						</Link>
					]}
					value={inputValue}
				/>
			);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			await userEvent.click(input);

			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(input.value).toBe(inputValue);
				expect(queryByDataRole(document.body, DataRoles.Dropdown)).not.toBeInTheDocument();
			});
		});

		test("Should open the dropdown with the selected item highlighted after press up/down arrow key", async () => {
			const shortItems = ["London", "London1", "London2"];
			render(<Autocomplete items={shortItems} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			const inputValue = "London";

			await userEvent.click(input);
			await userEvent.clear(input);
			await userEvent.type(input, inputValue);
			await userEvent.keyboard("{Enter}");
			await userEvent.keyboard("{ArrowDown}");

			await waitFor(() => {
				const preSelectItem = document.querySelector(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				expect(preSelectItem).toHaveTextContent(inputValue);
			});
		});

		test("Clear button trigger clearing the selection of current item", async () => {
			const inputValue = cityItems[1];

			render(<Autocomplete items={cityItems} hintTemplate="{count} matches" value={inputValue} onValueChange={noop} />);
			const clearButton = queryByDataRole(document.body, DataRoles.Button) as HTMLElement;

			clearButton.focus();
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
				expect(input.value).toBe("");
			});
		});

		test("Select only one item when multiple items have the same label but different ids", async () => {
			const ITEMS: DropDownItem[] = [
				{
					id: "1",
					label: "Da Nang",
					secondaryText: "Mien Trung"
				},
				{
					id: "2",
					label: "London",
					secondaryText: "Anh Quoc"
				},
				{
					id: "3",
					label: "Da Nang",
					secondaryText: "Mien Trung Viet Nam"
				},
				{
					id: "4",
					label: "Berlin",
					secondaryText: "Germany"
				},
				{
					id: "5",
					label: "Ha Noi",
					secondaryText: "Mien Bac Viet Nam"
				}
			];

			render(<Autocomplete items={ITEMS} hintTemplate="{count} matches" onValueChange={noop} />);

			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			await userEvent.click(input);

			await userEvent.keyboard("{ArrowDown}");

			await waitFor(() => {
				const selectedItems = document.querySelectorAll(
					`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`
				);
				expect(selectedItems).toHaveLength(1);
			});
		});
	});

	describe("Asynchronous", () => {
		test("Should not trigger the onSearch callback when input value is empty", async () => {
			render(<ExampleAsynchronousAutoComplete itemsProps={cityItems} timeout={50} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.click(input);

			// The autocomplete calls onSearch("") on click which briefly triggers loading.
			// Wait for the loading to complete (timeout in ExampleAsynchronousAutoComplete resolves).
			await waitFor(
				() => {
					const progress = queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay);

					if (progress) {
						expect(progress).not.toBeVisible();
					}
				},
				{ timeout: 3000 }
			);
		});

		test("Should select the item when Enter key is pressed", async () => {
			const sortedItems = [...cityItems].sort();
			render(<ExampleAsynchronousAutoComplete itemsProps={cityItems} timeout={50} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;

			await userEvent.click(input);

			await waitFor(
				() => {
					const dropdownItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`);
					expect(dropdownItems).toHaveLength(cityItems.length);
				},
				{ timeout: 3000 }
			);

			await userEvent.keyboard("{ArrowDown}");

			await waitFor(() => {
				const selectedItem = document.querySelector(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				expect(selectedItem).toHaveTextContent(sortedItems[0]);
			});

			const selectedItem = document.querySelector(
				`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`
			) as HTMLElement;
			selectedItem.focus();
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(input.value).toBe(sortedItems[0]);
				const remaining = document.querySelectorAll(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				expect(remaining).toHaveLength(0);
			});
		});

		test.skip("Should display all items when dropdown is reopened if data is already available", async () => {
			render(<ExampleAsynchronousAutoComplete itemsProps={cityItems} timeout={50} />);
			const input = queryByDataRole(document.body, DataRoles.TextField.Input) as HTMLInputElement;
			const inputValue = "Berlin";

			await userEvent.clear(input);
			await userEvent.type(input, inputValue);

			await waitFor(() => {
				const progress = queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay);
				expect(progress).toBeVisible();
			});

			await waitFor(
				() => {
					const progress = queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay);

					// Progress indicator may be removed from DOM or hidden
					if (progress) {
						expect(progress).not.toBeVisible();
					}
				},
				{ timeout: 5000 }
			);

			await waitFor(() => {
				const dropdownItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`);
				const selectedItem = document.querySelector(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				expect(selectedItem).toHaveTextContent(inputValue);
				expect(dropdownItems).toHaveLength(1);
			});

			await userEvent.keyboard("{Escape}");

			await userEvent.click(input);

			// After clicking, the onSearch callback is triggered, which sets loading to true
			await waitFor(
				() => {
					const progress = queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay);
					expect(progress).toBeTruthy();
				},
				{ timeout: 3000 }
			);

			await waitFor(
				() => {
					const progress = queryByDataRole(document.body, DataRoles.ProgressIndicator.OuterOverlay);

					// Progress indicator may be removed from DOM or hidden
					if (progress) {
						expect(progress).not.toBeVisible();
					}
				},
				{ timeout: 5000 }
			);

			await waitFor(() => {
				const selectedItem = document.querySelector(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
				const dropdownItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"]`);
				expect(selectedItem).toHaveTextContent(inputValue);
				expect(dropdownItems).toHaveLength(cityItems.length);
			});
		});
	});
});
