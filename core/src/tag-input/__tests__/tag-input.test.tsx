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
import { useEffect, useRef, useState } from "react";
import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	getBySelector,
	isAfter,
	queryByDataRole,
	render,
	screen,
	setupDevice,
	waitFor
} from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import type { MessagePosition, TooltipLineBreak } from "../../input/base/template/base.tpl.api.js";
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

		describe("keyboard events", () => {
			test("focusableRemoveButtons toggles the remove button's tab order", () => {
				const { container, rerender } = render(<TagInput initialTags={initials} />);

				const getFirstTagClearButton = (): HTMLElement => {
					const createdTags = getAllByDataRole(container, "tag").filter(
						(tag) => !tag.getAttribute("id")?.includes("a11y")
					);

					return getByDataRole(createdTags[0], "button");
				};

				expect(getFirstTagClearButton().getAttribute("tabindex")).toBe("-1");

				rerender(<TagInput initialTags={initials} focusableRemoveButtons />);
				expect(getFirstTagClearButton().getAttribute("tabindex")).toBe("0");
			});

			test("Enter/Space on a focused tag wrapper return focus to the text area", () => {
				for (const focusableRemoveButtons of [false, true]) {
					const { container, unmount } = render(
						<TagInput initialTags={initials} focusableRemoveButtons={focusableRemoveButtons} />
					);

					const createdTags = getAllByDataRole(container, "tag").filter(
						(tag) => !tag.getAttribute("id")?.includes("a11y")
					);
					const inputElement = getByDataRole(container, "textarea-input");

					for (const key of [Key.Enter, " "]) {
						inputElement.focus();
						fireEvent.keyDown(inputElement, { key: Key.Backspace });
						expect(document.activeElement).toBe(createdTags[createdTags.length - 1]);

						fireEvent.keyDown(document.activeElement as HTMLElement, { key });
						expect(document.activeElement).toBe(inputElement);
					}

					unmount();
				}
			});

			test("Enter/Space/Backspace/Delete on a focused remove button remove that tag", async () => {
				const onRemoveSpy = vi.fn();
				const fourTags = ["Widgets", "A12", "mgm", "Storybook"];
				const { container } = render(
					<TagInput initialTags={fourTags} focusableRemoveButtons onRemoveTag={onRemoveSpy} />
				);

				const getClearButton = (index: number): HTMLElement =>
					getByDataRole(
						getAllByDataRole(container, "tag").filter((tag) => !tag.getAttribute("id")?.includes("a11y"))[index],
						"button"
					);

				getClearButton(0).focus();
				await userEvent.keyboard("{Enter}");
				expect(onRemoveSpy).toHaveBeenNthCalledWith(1, "Widgets");

				getClearButton(1).focus(); // mgm
				await userEvent.keyboard("{Space}");
				expect(onRemoveSpy).toHaveBeenNthCalledWith(2, "mgm");

				// via getFocusedButtonTagIndex fallback
				getClearButton(0).focus(); // A12
				await userEvent.keyboard("{Backspace}");
				expect(onRemoveSpy).toHaveBeenNthCalledWith(3, "A12");

				getClearButton(0).focus(); // Storybook
				await userEvent.keyboard("{Delete}");
				expect(onRemoveSpy).toHaveBeenNthCalledWith(4, "Storybook");

				expect(onRemoveSpy).toHaveBeenCalledTimes(4);
			});

			test("Backspace and arrow keys move focus between tag wrappers; Shift+Tab then walks backward through remove buttons", async () => {
				const { container } = render(<TagInput initialTags={initials} focusableRemoveButtons />);

				const createdTags = getAllByDataRole(container, "tag").filter(
					(tag) => !tag.getAttribute("id")?.includes("a11y")
				);
				const clearButtons = createdTags.map((tag) => getByDataRole(tag, "button"));
				const inputElement = getByDataRole(container, "textarea-input");

				// Backspace focuses the last tag's wrapper.
				inputElement.focus();
				fireEvent.keyDown(inputElement, { key: Key.Backspace });
				expect(document.activeElement).toBe(createdTags[createdTags.length - 1]);

				// Arrow keys move between wrappers.
				fireEvent.keyDown(document.activeElement as HTMLElement, { key: Key.ArrowLeft });
				expect(document.activeElement).toBe(createdTags[createdTags.length - 2]);

				fireEvent.keyDown(document.activeElement as HTMLElement, { key: Key.ArrowRight });
				expect(document.activeElement).toBe(createdTags[createdTags.length - 1]);

				// Shift+Tab from the wrapper goes to the previous tag's remove button.
				await userEvent.tab({ shift: true });
				expect(document.activeElement).toBe(clearButtons[clearButtons.length - 2]);

				// Shift+Tab again keeps walking backward, button to button.
				await userEvent.tab({ shift: true });
				expect(document.activeElement).toBe(clearButtons[clearButtons.length - 3]);
			});

			test("Tab from a focused tag wrapper moves focus to that same tag's remove button", async () => {
				const { container } = render(<TagInput initialTags={initials} focusableRemoveButtons />);

				const createdTags = getAllByDataRole(container, "tag").filter(
					(tag) => !tag.getAttribute("id")?.includes("a11y")
				);
				const clearButtons = createdTags.map((tag) => getByDataRole(tag, "button"));
				const inputElement = getByDataRole(container, "textarea-input");

				// Backspace focuses the last tag's wrapper.
				inputElement.focus();
				fireEvent.keyDown(inputElement, { key: Key.Backspace });
				expect(document.activeElement).toBe(createdTags[createdTags.length - 1]);

				// Tab from the wrapper goes to that same tag's remove button.
				await userEvent.tab();
				expect(document.activeElement).toBe(clearButtons[clearButtons.length - 1]);
			});

			test("Arrow keys move focus to the adjacent tag's wrapper when starting from a remove button", async () => {
				const { container } = render(<TagInput initialTags={initials} focusableRemoveButtons />);

				const createdTags = getAllByDataRole(container, "tag").filter(
					(tag) => !tag.getAttribute("id")?.includes("a11y")
				);
				const clearButtons = createdTags.map((tag) => getByDataRole(tag, "button"));

				clearButtons[1].focus();
				expect(document.activeElement).toBe(clearButtons[1]);

				fireEvent.keyDown(document.activeElement as HTMLElement, { key: Key.ArrowLeft });
				expect(document.activeElement).toBe(createdTags[0]);

				// Wait for the async blur/focus state update before the next keydown.
				clearButtons[1].focus();
				await waitFor(() => expect(document.activeElement).toBe(clearButtons[1]));

				fireEvent.keyDown(document.activeElement as HTMLElement, { key: Key.ArrowRight });
				expect(document.activeElement).toBe(createdTags[2]);
			});

			test("Tab from outside the component focuses the first tag's remove button", async () => {
				const { container, unmount } = render(
					<>
						<button type="button">before</button>
						<TagInput initialTags={initials} focusableRemoveButtons />
					</>
				);

				const firstClearButton = getByDataRole(
					getAllByDataRole(container, "tag").filter((tag) => !tag.getAttribute("id")?.includes("a11y"))[0],
					"button"
				);

				const outsideButton = screen.getByText("before");
				outsideButton.focus();
				expect(document.activeElement).toBe(outsideButton);

				await userEvent.tab();
				expect(document.activeElement).toBe(firstClearButton);

				unmount();

				// Mirrors the showcase's "Reset focus" wrapper, which clears its own tabIndex on blur.
				function SelfClearingFocusWrapper(): ReactElement {
					const [focusable, setFocusable] = useState(true);
					const wrapperRef = useRef<HTMLDivElement | null>(null);

					useEffect(() => {
						wrapperRef.current?.focus();
					}, []);

					return (
						<div
							ref={wrapperRef}
							data-role="self-clearing-focus-wrapper"
							tabIndex={focusable ? 0 : undefined}
							onBlur={() => setFocusable(false)}
						>
							<TagInput initialTags={initials} focusableRemoveButtons />
						</div>
					);
				}

				const { container: secondContainer } = render(<SelfClearingFocusWrapper />);
				const secondFirstClearButton = getByDataRole(
					getAllByDataRole(secondContainer, "tag").filter((tag) => !tag.getAttribute("id")?.includes("a11y"))[0],
					"button"
				);

				await waitFor(() =>
					expect(document.activeElement).toBe(getByDataRole(secondContainer, "self-clearing-focus-wrapper"))
				);

				await userEvent.tab();
				expect(document.activeElement).toBe(secondFirstClearButton);
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

		/**
		 * These position suites live inside the desktop block on purpose: the mobile block below
		 * mocks the device provider in `beforeAll` and nothing restores it, so anything defined
		 * after it renders the touch layout.
		 */
		describe("message position", () => {
			const messageRoles = [
				DataRoles.TagInput.ErrorMessage,
				DataRoles.TagInput.WarningMessage,
				DataRoles.TagInput.InfoMessage
			];

			const renderWithMessages = (messagePosition: MessagePosition) =>
				render(
					<TagInput
						label="Test Label"
						helperText="Test Helper Text"
						errorMessage="Test error message"
						warningMessage="Test warning message"
						infoMessage="Test info message"
						messagePosition={messagePosition}
					/>
				);

			test("renders the messages above the control for above", () => {
				const { getByDataRole } = renderWithMessages("above");
				const group = getByDataRole(DataRoles.TagInput.Group);
				// the field around the messages and the tag group carries no data-role of its own
				const control = group.parentElement as HTMLElement;
				const label = getByDataRole(DataRoles.TagInput.Label);
				// the tag input labels its helper text with the tag role, not with its own
				const helperText = getByDataRole(DataRoles.Tag.HelperText);

				for (const role of messageRoles) {
					const message = getByDataRole(role);

					expect(control.contains(message)).toBe(true);
					expect(isAfter(message, group)).toBe(true);
					// the message stays inside the label -> helper text envelope
					expect(isAfter(label, message)).toBe(true);
					expect(isAfter(message, helperText)).toBe(true);
				}
			});

			test("renders the messages below the control for below", () => {
				const { getByDataRole } = renderWithMessages("below");
				const group = getByDataRole(DataRoles.TagInput.Group);
				const control = group.parentElement as HTMLElement;
				const label = getByDataRole(DataRoles.TagInput.Label);
				const helperText = getByDataRole(DataRoles.Tag.HelperText);

				for (const role of messageRoles) {
					const message = getByDataRole(role);

					expect(control.contains(message)).toBe(true);
					expect(isAfter(group, message)).toBe(true);
					// the message stays inside the label -> helper text envelope
					expect(isAfter(label, message)).toBe(true);
					expect(isAfter(message, helperText)).toBe(true);
				}
			});
		});

		describe("tooltip position", () => {
			const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak) =>
				render(
					<TagInput
						label="Test Label"
						helperText="Test Helper Text"
						tooltips={<div>Test tooltip</div>}
						breakTooltipsToNewLine={breakTooltipsToNewLine}
					/>
				);

			test("renders the tooltips inline beside the control for false", () => {
				const { getByDataRole, getByText } = renderWithTooltips(false);
				const group = getByDataRole(DataRoles.TagInput.Group);
				const tagGroup = getByDataRole(DataRoles.TagGroup);
				const addon = getByDataRole(DataRoles.TagInput.TooltipAddon);
				const tooltip = getByText("Test tooltip");

				expect(addon.contains(tooltip)).toBe(true);
				// the addon sits inside the group wrapper, after the tag group itself
				expect(group.contains(addon)).toBe(true);
				expect(isAfter(tagGroup, addon)).toBe(true);
			});

			test("renders the tooltips above the control for above", () => {
				const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips("above");
				const group = getByDataRole(DataRoles.TagInput.Group);
				const control = group.parentElement as HTMLElement;
				const tooltip = getByText("Test tooltip");

				expect(queryByDataRole(DataRoles.TagInput.TooltipAddon)).toBeNull();
				expect(control.contains(tooltip)).toBe(true);
				expect(isAfter(tooltip, group)).toBe(true);
			});

			test("renders the tooltips below the whole control row for below", () => {
				const { container, getByDataRole, getByText, queryByDataRole } = renderWithTooltips("below");
				const group = getByDataRole(DataRoles.TagInput.Group);
				const fieldMain = group.parentElement?.parentElement as HTMLElement;
				const helperText = getByDataRole(DataRoles.Tag.HelperText);
				const tooltip = getByText("Test tooltip");

				expect(queryByDataRole(DataRoles.TagInput.TooltipAddon)).toBeNull();
				expect(fieldMain.contains(tooltip)).toBe(false);
				expect(tooltip.parentElement).toBe(container.firstChild);
				expect(isAfter(fieldMain, tooltip)).toBe(true);
				expect(isAfter(tooltip, helperText)).toBe(true);
			});
		});

		describe("aria-invalid", () => {
			// the tag input's control is a text-area, so the invalid flag lands on the textarea input
			test("marks the input as invalid for error", () => {
				const { getByDataRole } = render(<TagInput label="Test Label" error />);

				expect(getByDataRole(DataRoles.Textarea.Input)).toHaveAttribute("aria-invalid", "true");
			});

			test("marks the input as invalid for errorMessage", () => {
				const { getByDataRole } = render(<TagInput label="Test Label" errorMessage="Test error message" />);

				expect(getByDataRole(DataRoles.Textarea.Input)).toHaveAttribute("aria-invalid", "true");
			});

			test("does not mark the input as invalid for a warning or an info", () => {
				const { getByDataRole } = render(
					<TagInput
						label="Test Label"
						warning
						info
						warningMessage="Test warning message"
						infoMessage="Test info message"
					/>
				);

				expect(getByDataRole(DataRoles.Textarea.Input)).not.toHaveAttribute("aria-invalid");
			});
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
