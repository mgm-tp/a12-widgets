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
	getBySelector,
	queryByDataRole,
	render,
	setupDevice,
	waitFor
} from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { userEvent } from "vitest/browser";

import { ErrorTooltip } from "../../tooltip/error/main/error.view.js";
import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";

import type { TagInputProps } from "../main/tag-input.api.js";
import { TagInput } from "../main/tag-input.view.js";

describe("com.mgmtp.a12.widgets.tag-input", () => {
	const keys = ["\n", ";", ","];
	const initials = ["Widgets", "A12", "mgm"];
	const suggestions = [
		"Android phone",
		"iOS phone",
		"BlackBerry phone",
		"Windows phone",
		"Windows desktop",
		"macOS desktop",
		"Linux desktop",
		"A12",
		"mgm"
	];
	const populars = ["Android phone", "iOS phone", "Windows desktop", "macOS desktop", "A12", "mgm"];
	const addonAfter = ["addon-after1", "addon-after2"];
	const tooltips = [<HintTooltip text="a hint" key="hint" />, <ErrorTooltip text="an error" key="error" />];
	const properties: TagInputProps = {
		id: "test-id",
		className: "test-class",
		style: { color: "red" },
		label: "label",
		inputProps: { [`aria-required`]: true },
		addonAfter: addonAfter,
		tooltips: tooltips,
		helperText: "helperText",
		keys: keys,
		initialTags: initials,
		suggestionTags: suggestions,
		suggestionLabel: "suggestion",
		popularTags: populars,
		popularLabel: "popular",
		errorMessage: "errorMessage",
		warningMessage: "warningMessage"
	};
	describe("desktop", () => {
		test("render-tag-input", () => {
			const { container } = render(<TagInput {...properties} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render-disabled-tag-input", () => {
			const { container } = render(<TagInput {...properties} disabled />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render-readonly-tag-input", () => {
			const { container } = render(<TagInput {...properties} readonly />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("focus-tag", async () => {
			const { container } = render(<TagInput initialTags={initials} popularTags={populars} />);

			const inputElement = getByDataRole(container, "textarea-input");
			const initialTags = getAllByDataRole(container, "tag").filter((tag) => !tag.getAttribute("id")?.includes("a11y"));

			fireEvent.focus(inputElement);

			await waitFor(() => {
				const portal = getByDataRole(container, "attached-portal");
				expect(portal).toBeTruthy();
			});

			// Press LeftArrow when there's no value in textArea will focus on the last tag
			fireEvent.keyDown(inputElement, { key: Key.ArrowLeft });
			expect(initialTags[initialTags.length - 1].getAttribute("class")).toContain("tag--focus");

			// Press RightArrow when focus on the last tag will make it lose focus
			fireEvent.keyDown(inputElement, { key: Key.ArrowRight });
			expect(initialTags[initialTags.length - 1].getAttribute("class")).not.toContain("tag--focus");

			// Press Backspace when there's no value in textArea will focus on the last tag
			fireEvent.keyDown(inputElement, { key: Key.Backspace });
			expect(initialTags[initialTags.length - 1].getAttribute("class")).toContain("tag--focus");

			//Mousedown on a Tag will focus on it
			fireEvent.mouseDown(initialTags[0]);
			expect(initialTags[0].getAttribute("class")).toContain("tag--focus");
		});

		test("create-tag-by-keys", () => {
			const onAddedSpy = vi.fn();
			const { container } = render(
				<TagInput initialTags={initials} onAddedTag={onAddedSpy} popularTags={populars} keys={keys} />
			);

			const inputElement = getByDataRole(container, "textarea-input");

			fireEvent.focus(inputElement);

			// Type "," will create a tag
			fireEvent.change(inputElement, { target: { value: "testTag," } });
			expect(onAddedSpy).toHaveBeenCalledTimes(1);
			let tagContents = getAllByDataRole(container, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("testTag");

			// Type a character which belongs to keys will create a tag
			fireEvent.change(inputElement, { target: { value: "testTag2\n" } });
			expect(onAddedSpy).toHaveBeenCalledTimes(2);
			tagContents = getAllByDataRole(container, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("testTag2");

			fireEvent.change(inputElement, { target: { value: "testTag3;" } });
			expect(onAddedSpy).toHaveBeenCalledTimes(3);
			tagContents = getAllByDataRole(container, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("testTag3");
		});

		test("focus input without opening the list", async () => {
			const { container } = render(<TagInput initialTags={initials} popularTags={populars} openOnFocus={false} />);
			const inputElement = getByDataRole(container, "textarea-input");

			fireEvent.focus(inputElement);

			await waitFor(() => {
				expect(queryByDataRole(container, "dropdown")).toBeFalsy();
			});
		});

		test("create-a-tag-by-keyboard-and-blur", async () => {
			const onAddedSpy = vi.fn();
			const { container } = render(<TagInput initialTags={initials} onAddedTag={onAddedSpy} popularTags={populars} />);

			const inputElement = getByDataRole(container, "textarea-input");

			fireEvent.focus(inputElement);

			await waitFor(() => {
				expect(getByDataRole(container, "dropdown")).toBeTruthy();
			});

			fireEvent.keyDown(inputElement, { key: Key.Tab });
			expect(onAddedSpy).not.toHaveBeenCalled();

			// Create tag on Tab key
			fireEvent.focus(inputElement);
			fireEvent.change(inputElement, { target: { value: "testTag" } });
			fireEvent.keyDown(inputElement, { key: Key.Tab });
			let tagContents = getAllByDataRole(container, "tag-content");
			expect(onAddedSpy).toHaveBeenCalledTimes(1);
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("testTag");

			// Create tag on Enter key
			fireEvent.focus(inputElement);
			fireEvent.keyDown(inputElement, { key: Key.Enter });
			expect(onAddedSpy).toHaveBeenCalledTimes(2);
			tagContents = getAllByDataRole(container, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("Android phone");

			// Create tag on Input blur
			fireEvent.focus(inputElement);
			fireEvent.change(inputElement, { target: { value: "testTag3" } });
			fireEvent.blur(inputElement);
			tagContents = getAllByDataRole(container, "tag-content");
			expect(onAddedSpy).toHaveBeenCalledTimes(3);
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("testTag3");
		});

		test("check-duplicated-tag-by-keyboard", async () => {
			const onAddedSpy = vi.fn();
			const { container } = render(
				<TagInput
					initialTags={[...initials, "phone"]}
					onAddedTag={onAddedSpy}
					popularTags={populars}
					suggestionTags={suggestions}
				/>
			);

			const inputElement = getByDataRole(container, "textarea-input");

			fireEvent.focus(inputElement);

			await waitFor(() => {
				expect(getByDataRole(container, "dropdown")).toBeTruthy();
			});

			// Create a duplicated tag by entering a duplicated value, then close dropdown list and press ENTER
			fireEvent.change(inputElement, { target: { value: "phone" } });
			fireEvent.keyDown(inputElement, { key: Key.Escape });
			fireEvent.keyDown(inputElement, { key: Key.Enter });

			// Show an error notification if the tag is duplicated
			const errorToast = getByDataRole(container, "toast");
			expect(errorToast).toBeTruthy();
			fireEvent.keyDown(errorToast, { key: Key.Escape });

			// Open dropdown again and the first suggested tag should be selected by ENTER
			fireEvent.keyDown(inputElement, { key: Key.ArrowDown });
			await waitFor(() => {
				expect(getByDataRole(container, "dropdown")).toBeTruthy();
			});
			fireEvent.keyDown(inputElement, { key: Key.Enter });

			const tagGroupWrapper = getByDataRole(container, "tag-input-group");
			const tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");
			expect(onAddedSpy).toHaveBeenCalledTimes(1);
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("Android phone");
		});

		test("check-duplicated-tag-by-mouse", async () => {
			const onAddedSpy = vi.fn();
			const { container } = render(
				<TagInput initialTags={initials} onAddedTag={onAddedSpy} popularTags={populars} suggestionTags={suggestions} />
			);

			const inputElement = getByDataRole(container, "textarea-input");

			fireEvent.focus(inputElement);

			await waitFor(() => {
				expect(getByDataRole(container, "dropdown")).toBeTruthy();
			});

			// Create a tag after blurring the input
			fireEvent.change(inputElement, { target: { value: "ios" } });
			fireEvent.blur(inputElement);
			let tagGroupWrapper = getByDataRole(container, "tag-input-group");
			let tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("ios");

			// Type the same value as previous, then blur the input should show an error
			fireEvent.focus(inputElement);
			fireEvent.change(inputElement, { target: { value: "ios" } });
			fireEvent.blur(inputElement);

			const errorToast = getByDataRole(container, "toast");
			expect(errorToast).toBeTruthy();
			fireEvent.keyDown(errorToast, { key: Key.Escape });

			// Open dropdown again and the first suggested tag should be selected by ENTER
			fireEvent.keyDown(inputElement, { key: Key.ArrowDown });
			await waitFor(() => {
				expect(getByDataRole(container, "dropdown")).toBeTruthy();
			});

			const dropdown = getByDataRole(container, "dropdown");
			const matchedTag = getAllByDataRole(dropdown, "dropdown-item")[0];

			// Click the first matched item should not show the error
			fireEvent.click(matchedTag);
			expect(queryByDataRole(container, "toast")).toBeFalsy();

			tagGroupWrapper = getByDataRole(container, "tag-input-group");
			tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual("iOS phone");
		});

		test("remove-a-tag-by-BACKSPACE", () => {
			const onRemoveSpy = vi.fn();
			const { container } = render(<TagInput initialTags={initials} onRemoveTag={onRemoveSpy} />);

			const inputElement = getByDataRole(container, "textarea-input");

			let tagGroupWrapper = getByDataRole(container, "tag-input-group");
			let tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");

			expect(tagContents.length).toEqual(initials.length);

			// Press Backspace when a tag is being focused will remove the tag.
			fireEvent.focus(inputElement);
			fireEvent.keyDown(inputElement, { key: Key.Backspace });
			fireEvent.keyDown(inputElement, { key: Key.Backspace });
			expect(onRemoveSpy).toHaveBeenCalledTimes(1);

			tagGroupWrapper = getByDataRole(container, "tag-input-group");
			tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");
			expect(tagContents.length).toEqual(initials.length - 1);
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual(initials[tagContents.length - 1]);
		});

		test("remove-a-tag-by-Delete-key", () => {
			const onRemoveSpy = vi.fn();
			const { container } = render(<TagInput initialTags={initials} onRemoveTag={onRemoveSpy} />);

			const inputElement = getByDataRole(container, "textarea-input");

			let tagGroupWrapper = getByDataRole(container, "tag-input-group");
			let tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");

			expect(tagContents.length).toEqual(initials.length);

			// Press Delete when a tag is being focused will remove the tag.
			fireEvent.focus(inputElement);
			fireEvent.keyDown(inputElement, { key: Key.ArrowLeft });
			fireEvent.keyDown(inputElement, { key: Key.Delete });
			expect(onRemoveSpy).toHaveBeenCalledTimes(1);

			tagGroupWrapper = getByDataRole(container, "tag-input-group");
			tagContents = getAllByDataRole(tagGroupWrapper, "tag-content");
			expect(tagContents.length).toEqual(initials.length - 1);
			expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual(initials[tagContents.length - 1]);
		});

		describe("mouse events", () => {
			test("create a new tag by click on a dropdown item", async () => {
				const onAddedSpy = vi.fn();
				const { container } = render(
					<TagInput initialTags={initials} popularTags={populars} onAddedTag={onAddedSpy} />
				);

				const inputElement = getByDataRole(container, "textarea-input");
				fireEvent.focus(inputElement);

				await waitFor(() => {
					const dropdown = getByDataRole(container, "dropdown");
					expect(dropdown).toBeTruthy();
				});
				const dropdownItems = getAllByDataRole(container, "dropdown-item");
				fireEvent.click(dropdownItems[0]);
				expect(onAddedSpy).toHaveBeenCalledTimes(1);
				const tagContents = getAllByDataRole(container, "tag-content");
				expect(tagContents[tagContents.length - 1].textContent).toEqual("Android phone");
			});

			test("remove tag", async () => {
				const onRemoveSpy = vi.fn();
				const { container } = render(
					<TagInput initialTags={initials} popularTags={populars} onRemoveTag={onRemoveSpy} />
				);

				const createdTags = getAllByDataRole(container, "tag").filter(
					(tag) => !tag.getAttribute("id")?.includes("a11y")
				);
				const firstTagClearButton = getByDataRole(createdTags[0], "button");
				fireEvent.click(firstTagClearButton);
				expect(onRemoveSpy).toHaveBeenCalledTimes(1);
			});

			test("should not create a tag from the disabled dropdown item", async () => {
				const onAddedSpy = vi.fn();
				const { container } = render(
					<TagInput initialTags={initials} popularTags={populars} onAddedTag={onAddedSpy} />
				);

				const inputElement = getByDataRole(container, "textarea-input");

				fireEvent.focus(inputElement);

				fireEvent.click(inputElement);
				await waitFor(() => {
					const dropdown = getByDataRole(container, "dropdown");
					expect(dropdown).toBeTruthy();
				});

				const dropdownItems = getAllByDataRole(container, "dropdown-item");
				const lastItem = dropdownItems[dropdownItems.length - 1];
				expect(lastItem.getAttribute("aria-disabled")).toEqual("true");
				fireEvent.click(lastItem);

				expect(onAddedSpy).toHaveBeenCalledTimes(0);
				const tagContents = getAllByDataRole(container, "tag-content");
				expect(tagContents[tagContents.length - 1].textContent).toEqual(initials[initials.length - 1]);
			});

			test("should not create a new tag from the input text by clicking the disabled dropdown item", async () => {
				const onAddedSpy = vi.fn();
				const { container } = render(
					<TagInput
						initialTags={initials}
						suggestionTags={suggestions}
						popularTags={populars}
						onAddedTag={onAddedSpy}
					/>
				);

				const inputElement = getByDataRole(container, "textarea-input");

				// Not create a new tag from the input text by clicking the disabled dropdown item
				fireEvent.focus(inputElement);
				fireEvent.input(inputElement, { target: { value: "a" } });

				await waitFor(() => {
					const dropdown = getByDataRole(container, "dropdown");
					expect(dropdown).toBeTruthy();
				});

				const dropdownItems = getAllByDataRole(container, "dropdown-item");
				const lastItem = dropdownItems[dropdownItems.length - 1];
				expect(lastItem.getAttribute("aria-disabled")).toEqual("true");
				fireEvent.click(dropdownItems[dropdownItems.length - 1]);

				expect(onAddedSpy).toHaveBeenCalledTimes(0);
				const tagContents = getAllByDataRole(container, "tag-content");
				expect(tagContents[tagContents.length - 1].firstChild?.nodeValue).toEqual(initials[initials.length - 1]);
			});
		});

		test("comparator function", () => {
			const comparatorSpy = vi.fn((first: string, second: string) => second.localeCompare(first));
			const popularTags = ["tag 1", "tag 2", "tag 3", "tag 4"];
			const suggestionTags = ["tag 1", "tag 2", "tag 3", "tag 5", "tag 6", "tag 7", "tag 8"];
			let dropdownItems;

			const { container } = render(
				<TagInput suggestionTags={suggestionTags} popularTags={popularTags} comparator={comparatorSpy} />
			);

			expect(comparatorSpy).toHaveBeenCalled();

			const inputElement = getByDataRole(container, "textarea-input");

			// The popular tags are displayed upon opening the dropdown menu.
			fireEvent.focus(inputElement);
			dropdownItems = getAllByDataRole(getByDataRole(container, "dropdown"), "dropdown-item");
			dropdownItems.forEach((item, index) => {
				expect(item.textContent).toEqual(popularTags[popularTags.length - index - 1]);
			});

			// The suggestion tags are displayed as you type in the input field.
			fireEvent.change(inputElement, { target: { value: "tag" } });
			dropdownItems = getAllByDataRole(getByDataRole(container, "dropdown"), "dropdown-item");
			dropdownItems.forEach((item, index) => {
				expect(item.textContent).toEqual(suggestionTags[suggestionTags.length - index - 1]);
			});
		});

		test("should focus to text area and open the dropdown when clicking to tag group", () => {
			const { container } = render(<TagInput {...properties} />);

			const tagGroup = getByDataRole(container, "tag-group");
			const textArea = getByDataRole(tagGroup, "textarea-control").querySelector("[role='combobox']") as HTMLElement;

			fireEvent.click(tagGroup);

			expect(textArea.getAttribute("aria-expanded")).toBeTruthy();
			expect(getByDataRole(textArea, "textarea-input").matches(":focus")).toBe(true);
			expect(getByDataRole(container, "dropdown")).toBeTruthy();
		});
	});

	describe("Mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("A tag should be created when clicking the save button after entering text identical to a previously deleted tag ", async () => {
			const { container } = render(<TagInput initialTags={initials} />);

			// Click text input to open the tag input modal
			const tagInput = getByDataRole(container, "textarea-input");
			await userEvent.click(tagInput);

			// Tag Input displays as a modal
			const modal = getByDataRole(container, "modal-overlay");
			const modalTagInput = getByDataRole(modal, "textarea-input");

			// Type "mgm" text to input
			await userEvent.type(modalTagInput, "mgm");

			// Delete mgm tag
			await userEvent.click(getByDataRole(getBySelector(modal, "#mgm"), "button"));
			expect(modal.querySelector("#mgm")).toBeNull();

			// Check if text input content is "mgm" after deleting mgm tag
			expect(modalTagInput.textContent).toEqual("mgm");

			// Click save button
			const modalFooter = getByDataRole(modal, "contentbox-footer");
			const [, saveButton] = getAllByDataRole(modalFooter, "button");
			await userEvent.click(saveButton);

			// Modal is closed
			expect(queryByDataRole(container, "modal-overlay")).toBeNull();

			// New mgm tag is created and text input is empty
			expect(container.querySelector("#mgm")).toBeTruthy();
			expect(tagInput.textContent).toEqual("");
		});
	});
});
