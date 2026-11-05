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
 * The Autocomplete's fullscreen dialog, which is what a phone gets and what `mobileModal` asks for on
 * any device. This is the file that covered `MobileAutocomplete`: the cases it had are kept, driving
 * the single `Autocomplete` through `mobileModal` instead of the deleted component, so that what the
 * dialog is expected to do stays comparable to what it did before the rewrite.
 *
 * Two things changed for every case. The dialog is portalled to the document now, so it is queried
 * from `document.body` rather than from the render container; and while it is open there are two text
 * fields in the DOM — the field in the page and the dialog's own — so each is addressed through a
 * helper instead of by a bare query.
 *
 * The cases that only recorded a snapshot of the old per-operating-system markup assert the behaviour
 * they were standing in for instead. The APG contract, the live region, the windowing and the
 * presentation-choice cases are new with the rewrite.
 */

import type { ReactElement } from "react";
import {
	fireEvent,
	findByDataRole,
	getAllByDataRole,
	getByDataRole,
	isAfter,
	queryAllByDataRole,
	queryByDataRole,
	render,
	waitFor
} from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import type { DropDownItem } from "../../../dropdown/index.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { Link } from "../../../link/main/link/link.view.js";
import type { MessagePosition } from "../../base/template/base.tpl.api.js";
import { Autocomplete } from "../main/autocomplete.view.js";

import { cityItems, inputProps } from "./data.js";

const baseProps = {
	id: "ac",
	label: "City",
	items: cityItems,
	hintTemplate: "{count} of {total} options shown",
	onValueChange: noop
} as const;

/**
 * The dialog is rendered in a portal, so it is queried from the document rather than the container.
 *
 * These reach for the roles the composed widgets already carry — the overlay's, the text field's, the
 * content box's button — rather than roles of the Autocomplete's own. Passing a `data-role` through
 * `inputProps` would *replace* `TextField`'s, taking the standard role away from consumers.
 */
const findDialog = (): Promise<HTMLElement> => findByDataRole(document.body, DataRoles.Modal.Overlay);
const queryDialog = (): HTMLElement | null => queryByDataRole(document.body, DataRoles.Modal.Overlay);

/** The editable combobox inside the dialog. */
const getDialogInput = (): HTMLElement => getByDataRole(queryDialog()!, DataRoles.TextField.Input);

/** The field in the page, which is the text input that is not inside the dialog. */
const getTrigger = (container: HTMLElement): HTMLElement => {
	const dialog = queryDialog();

	return getAllByDataRole(container, DataRoles.TextField.Input).find((field) => !dialog?.contains(field))!;
};

/** The dialog's dismiss button, which the content box titles by its localized label. */
const getDialogCloseButton = (): HTMLElement =>
	getAllByDataRole(queryDialog()!, DataRoles.Button).find(
		(button) => button.getAttribute("title") === "Save and close"
	)!;

/** The clear button carries its localized label as both a title and an accessible name. */
const isClearButton = (button: HTMLElement): boolean =>
	button.getAttribute("title") === "Clear text" || button.getAttribute("aria-label") === "Clear text";

/**
 * The clear button of the dialog's own field.
 *
 * `queryAll`, not `getAll`: `enableClearButton={false}` leaves no button at all to look through, and
 * that absence is what those cases assert.
 */
const getDialogClearButton = (): HTMLElement | undefined =>
	queryAllByDataRole(queryDialog()!, DataRoles.Button).find(isClearButton);

/** The clear button of the field in the page, which is the one outside the dialog. */
const getTriggerClearButton = (container: HTMLElement): HTMLElement | undefined => {
	const dialog = queryDialog();

	return queryAllByDataRole(container, DataRoles.Button).find(
		(button) => isClearButton(button) && !dialog?.contains(button)
	);
};

const openDialog = async (container: HTMLElement): Promise<HTMLElement> => {
	await userEvent.click(getTrigger(container));

	return findDialog();
};

describe("com.mgmtp.a12.widgets.autocomplete.mobile", () => {
	test("the field in the page is a read-only combobox that announces a dialog popup", () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);
		const trigger = getTrigger(container);

		expect(trigger).toHaveAttribute("role", "combobox");
		expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(trigger).toHaveAttribute("readonly");
		// The listbox lives in the dialog, so the trigger must not claim one.
		expect(trigger).not.toHaveAttribute("aria-autocomplete");
		expect(queryDialog()).toBeNull();
	});

	test("clicking the field opens the dialog and moves focus into its combobox", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);
		const trigger = getTrigger(container);

		await userEvent.click(trigger);
		await findDialog();

		await waitFor(() => {
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", "ac-dialog");
			expect(getDialogInput()).toHaveFocus();
		});
	});

	test("the dialog's combobox carries the listbox contract, and the trigger is hidden while it is open", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);

		const dialogInput = getDialogInput();
		expect(dialogInput).toHaveAttribute("role", "combobox");
		expect(dialogInput).toHaveAttribute("aria-haspopup", "listbox");
		expect(dialogInput).toHaveAttribute("aria-autocomplete", "both");
		expect(dialogInput).toHaveAttribute("aria-controls", "ac-dropdown");

		// Exactly one combobox is exposed: the overlay takes the page — and with it the trigger — out of
		// the accessibility tree, which is what lets the dialog own the interaction.
		const dialog = getByDataRole(document.body, DataRoles.Modal.OverlayContent);
		expect(dialog).toHaveAttribute("role", "dialog");
		expect(dialog).toHaveAttribute("aria-modal", "true");
		expect(dialog).toHaveAttribute("aria-labelledby", "ac-label");
		expect(dialog.contains(dialogInput)).toBe(true);
	});

	test("Enter, Space and the arrow keys open the dialog from the field", async () => {
		for (const key of ["{Enter}", "{ }", "{ArrowDown}", "{ArrowUp}"]) {
			const { container, unmount } = render(<Autocomplete {...baseProps} mobileModal openOnFocus={false} />);
			const trigger = getTrigger(container);

			trigger.focus();
			await userEvent.keyboard(key);
			await findDialog();

			expect(queryDialog()).not.toBeNull();
			unmount();
		}
	});

	test("focus input without opening the list", async () => {
		const { container } = render(<Autocomplete {...inputProps} mobileModal openOnFocus={false} />);
		const input = getTrigger(container);

		fireEvent.focus(input);
		await waitFor(() => {
			expect(queryDialog()).toBeFalsy();
		});

		fireEvent.keyDown(input, { key: "Enter" });
		await waitFor(() => {
			expect(queryDialog()).toBeTruthy();
		});
	});

	test("a readonly or disabled field never opens the dialog, and exposes no combobox", async () => {
		const { container: ro } = render(<Autocomplete {...baseProps} mobileModal readonly />);
		const readonlyTrigger = getTrigger(ro);
		expect(readonlyTrigger).not.toHaveAttribute("role", "combobox");
		await userEvent.click(readonlyTrigger);
		expect(queryDialog()).toBeNull();

		// A disabled field cannot be clicked at all, so the attributes are the whole contract here.
		const { container: disabled } = render(<Autocomplete {...baseProps} mobileModal disabled />);
		const disabledTrigger = getTrigger(disabled);
		expect(disabledTrigger).toBeDisabled();
		expect(disabledTrigger).not.toHaveAttribute("role", "combobox");
		expect(queryDialog()).toBeNull();
	});

	// Recorded a snapshot of the loading markup before. What it was standing in for is that the dialog
	// says it is working while a search is in flight, which is asserted directly here.
	test("render loading mobile autocomplete", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal loading />);

		const dialog = await openDialog(container);
		expect(dialog).toBeTruthy();

		// The indicator holds itself back briefly, so that a search that returns at once does not flash it.
		await waitFor(() => {
			expect(getByDataRole(dialog, DataRoles.ProgressIndicator.OuterOverlay)).toBeVisible();
		});
	});

	// Also a snapshot case before. The links belong to the option list, which both presentations share,
	// so the dialog has to show them below the options.
	test("render autocomplete with link options on mobile", async () => {
		const { container } = render(
			<Autocomplete
				id={inputProps.id}
				label="Autocomplete with Links mobile"
				hintTemplate={inputProps.hintTemplate}
				items={inputProps.items}
				mobileModal
				onValueChange={noop}
				links={[
					<Link key="assign">Assign to me</Link>,
					<Link key="remove">
						<Icon>person_remove</Icon> Remove assignment
					</Link>
				]}
			/>
		);

		const dialog = await openDialog(container);

		const links = getAllByDataRole(dialog, DataRoles.Dropdown.LinkItemWrapper);
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveTextContent("Assign to me");
		// The icon contributes its ligature to the text content, so this one is a partial match.
		expect(links[1]).toMatchTextContent("Remove assignment");
	});

	test("mobile autocomplete events", async () => {
		const onSearchSpy = vi.fn();
		const onValueChange = vi.fn();

		const { container } = render(
			<Autocomplete {...baseProps} mobileModal onSearch={onSearchSpy} onValueChange={onValueChange} />
		);

		await openDialog(container);
		expect(onSearchSpy).toHaveBeenCalled();

		const dialogInput = getDialogInput() as HTMLInputElement;
		fireEvent.input(dialogInput, { target: { value: "Lo" } });

		await waitFor(() => {
			expect(dialogInput.value).toBe("Lo");
			expect(onSearchSpy).toHaveBeenCalledWith("Lo");
		});

		await userEvent.click(getAllByDataRole(queryDialog()!, DataRoles.Dropdown.Item)[0]);

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(onValueChange).toHaveBeenCalledTimes(1);
		});
	});

	test("typing in the dialog filters the options", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);
		await userEvent.keyboard("Ber");

		await waitFor(() => {
			const options = document.querySelectorAll('[role="option"]');
			expect(options.length).toBeGreaterThan(0);
			options.forEach((option) => expect(option.textContent?.toLowerCase()).toContain("ber"));
		});
	});

	// The previous mobile implementation styled the dialog's body with it, and the attached dropdown
	// styles its option list — each presentation keeps the element it had.
	test("itemsWrapperClassName styles the dialog's body, and only that", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal itemsWrapperClassName="wrapper-class" />);

		await openDialog(container);

		expect(getByDataRole(document.body, DataRoles.Contentbox)).toHaveClass("wrapper-class");
		expect(getByDataRole(document.body, DataRoles.Dropdown)).not.toHaveClass("wrapper-class");
		expect(getByDataRole(document.body, DataRoles.Dropdown).parentElement).not.toHaveClass("wrapper-class");
	});

	// The theme caps the dropdown's height so a popup anchored to a field stays on screen. Inside the
	// dialog that cap would show a handful of rows above a large empty area, so it has to be lifted.
	test("the option list is not capped at the anchored dropdown's height", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);

		const list = getByDataRole(document.body, DataRoles.Dropdown.Content);
		expect(getComputedStyle(list).maxHeight).toBe("none");

		// Every option is laid out rather than clipped to the first few rows.
		await waitFor(() => {
			const options = document.querySelectorAll('[role="option"]');
			expect(options.length).toBe(cityItems.length);
			expect(list.scrollHeight).toBeLessThanOrEqual(list.clientHeight + 1);
		});
	});

	// The list windows itself here just as the anchored popup does. It used to mount no option at all
	// until the first keystroke: the virtualizer asks for its scroll container while the ref to it has
	// not been attached yet, and only a further render makes it ask again — which the anchored popup
	// gets from its positioning and the dialog never did.
	test("a windowed option list mounts its window as soon as the dialog opens", async () => {
		const manyItems = Array.from({ length: 500 }, (_, index) => `Option ${index}`);
		const { container } = render(<Autocomplete {...baseProps} items={manyItems} mobileModal />);

		await openDialog(container);

		await waitFor(() => {
			const options = getAllByDataRole(queryDialog()!, DataRoles.Dropdown.Item);

			expect(options.length).toBeGreaterThan(0);
			expect(options.length).toBeLessThan(manyItems.length);
		});
	});

	test("the list does not stretch past its options when only a few match", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);
		await userEvent.keyboard("Ber");

		// The whole dropdown, not just the scrolling list: it carries the background that would be
		// painted over the empty part of the dialog if it were stretched.
		const dropdown = getByDataRole(document.body, DataRoles.Dropdown);

		await waitFor(() => {
			const options = document.querySelectorAll('[role="option"]');
			expect(options.length).toBe(1);

			const lastOption = options[options.length - 1] as HTMLElement;
			expect(dropdown.getBoundingClientRect().bottom - lastOption.getBoundingClientRect().bottom).toBeLessThan(8);
		});
	});

	// The page keeps no live region of its own in this presentation, so the count cannot be announced
	// twice — once from behind the overlay and once from inside it.
	test("the dialog carries the only live region, and it announces the result count", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		expect(queryByDataRole(container, DataRoles.Autocomplete.LiveRegion)).toBeNull();

		const dialog = await openDialog(container);

		const liveRegions = getAllByDataRole(document.body, DataRoles.Autocomplete.LiveRegion);
		expect(liveRegions).toHaveLength(1);
		expect(dialog).toContainElement(liveRegions[0]);

		await waitFor(() => {
			expect(liveRegions[0]).toHaveTextContent(`${cityItems.length} of ${cityItems.length} options shown`);
		});
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
				<Autocomplete
					hintTemplate={inputProps.hintTemplate}
					items={items}
					value={items[0]}
					mobileModal
					onValueChange={onValueChangeSpy}
				/>
			);
		};

		const { container } = render(<MobileAutocompleteContainer />);

		await openDialog(container);

		const dropdownItem = getByDataRole(queryDialog()!, DataRoles.Dropdown.Item);
		expect(dropdownItem).toBeTruthy();

		// Verify that clicking the dropdown item does not throw an error
		await expect(userEvent.click(dropdownItem)).resolves.not.toThrow();
	});

	test("if `items` list is initialized empty, a new item should be added when pressing ENTER", async () => {
		const onValueChangeSpy = vi.fn();
		const onSearchSpy = vi.fn();

		const { container } = render(
			<Autocomplete
				label="Add new item initially"
				value=""
				items={[]}
				hintTemplate={inputProps.hintTemplate}
				mobileModal
				onValueChange={onValueChangeSpy}
				onSearch={onSearchSpy}
				allowAddingNewItem
			/>
		);

		const dialog = await openDialog(container);
		expect(queryAllByDataRole(dialog, DataRoles.Dropdown.Item)).toHaveLength(0);

		const input = getDialogInput();
		fireEvent.input(input, { target: { value: "New York" } });
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
			// A committed value is reported as the caller's own kind: a bare label for a list of strings,
			// and an item otherwise — which an empty `items` counts as.
			expect(onValueChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ label: "New York" }));
		});
	});

	/*
	 * The attached presentation commits a new item when the field is left, and that case lives in
	 * `autocomplete.default.test.tsx`. In the dialog, leaving the field is not leaving the widget —
	 * `handleInputBlur` deliberately commits nothing — so what has to hold here is that dismissing the
	 * dialog keeps the typed item rather than dropping it.
	 */
	test("if `items` list is initialized empty, a new item should be added when the dialog is dismissed", async () => {
		const onValueChangeSpy = vi.fn();
		const onSearchSpy = vi.fn();

		const { container } = render(
			<Autocomplete
				label="Add new item initially"
				items={[]}
				hintTemplate={inputProps.hintTemplate}
				mobileModal
				onValueChange={onValueChangeSpy}
				onSearch={onSearchSpy}
				allowAddingNewItem
			/>
		);

		const dialog = await openDialog(container);
		expect(queryAllByDataRole(dialog, DataRoles.Dropdown.Item)).toHaveLength(0);

		const input = getDialogInput();
		fireEvent.input(input, { target: { value: "London" } });
		fireEvent.blur(input);
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
			expect((getTrigger(container) as HTMLInputElement).value).toBe("London");
		});
	});

	test("selecting an option commits it to the field, closes the dialog and restores focus", async () => {
		const onValueChange = vi.fn();
		const { container } = render(<Autocomplete {...baseProps} mobileModal onValueChange={onValueChange} />);
		const trigger = getTrigger(container);

		await openDialog(container);
		await userEvent.click(document.querySelectorAll('[role="option"]')[1] as HTMLElement);

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(trigger).toHaveFocus();
			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect((trigger as HTMLInputElement).value).toBe(onValueChange.mock.calls[0][0]);
		});
	});

	test("Enter on the highlighted option commits it and closes the dialog", async () => {
		const onValueChange = vi.fn();
		const { container } = render(<Autocomplete {...baseProps} mobileModal onValueChange={onValueChange} />);
		const trigger = getTrigger(container);

		await openDialog(container);
		await userEvent.keyboard("{ArrowDown}{Enter}");

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect((trigger as HTMLInputElement).value).toBeTruthy();
			expect(trigger).toHaveFocus();
		});
	});

	test("Modal should close with selecting the matched item after Enter to a matching item", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);
		const trigger = getTrigger(container) as HTMLInputElement;

		await openDialog(container);

		const dialogInput = getDialogInput();
		await userEvent.clear(dialogInput);
		await userEvent.type(dialogInput, "London");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(trigger.value).toBe("London");
		});
	});

	test("onValueChange should not be triggered when picking the currently selected item", async () => {
		const onValueChange = vi.fn();
		const { container } = render(<Autocomplete {...baseProps} mobileModal onValueChange={onValueChange} />);

		const pick = async (index: number): Promise<void> => {
			await openDialog(container);
			await userEvent.click(getAllByDataRole(queryDialog()!, DataRoles.Dropdown.Item)[index]);
			await waitFor(() => expect(queryDialog()).toBeNull());
		};

		await pick(0);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		await pick(0);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		await pick(1);
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	test("Modal should be closed without selecting any new item when pressing Save and Close button", async () => {
		const onValueChange = vi.fn();
		const { container } = render(<Autocomplete {...baseProps} mobileModal onValueChange={onValueChange} />);
		const trigger = getTrigger(container) as HTMLInputElement;

		await openDialog(container);
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(trigger.value).toBe("");
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	test("the close button dismisses the dialog", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => expect(queryDialog()).toBeNull());
	});

	test("coming back to the page does not reopen the dialog on the trigger's restored focus", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);
		const trigger = getTrigger(container);

		await openDialog(container);
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => expect(queryDialog()).toBeNull());
		expect(trigger).toHaveFocus();

		// The user leaves for another app: the page is hidden with the trigger still focused. Coming
		// back, the browser restores focus to it — which is not the user reaching for the field.
		window.dispatchEvent(new Event("blur"));
		trigger.blur();
		trigger.focus();

		await waitFor(() => expect(trigger).toHaveFocus());
		expect(queryDialog()).toBeNull();
	});

	test("the trigger still opens the dialog on a later focus, after the page has been left once", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);
		const trigger = getTrigger(container);

		// Leaving and returning while the field is not focused must not leave a guard behind that
		// swallows the next deliberate focus.
		window.dispatchEvent(new Event("blur"));
		window.dispatchEvent(new Event("focus"));

		await userEvent.click(trigger);

		expect(await findDialog()).toBeTruthy();
	});

	test("the dialog's clear button leaves the focus, and so the on-screen keyboard, alone", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);
		await userEvent.keyboard("Ber");

		await waitFor(() => expect(getDialogClearButton()).toBeTruthy());

		// Taking focus off the field closes the on-screen keyboard, and the dialog jumps as it reopens
		// for the field being focused again. The default is prevented so that focus never moves.
		const notPrevented = fireEvent.mouseDown(getDialogClearButton()!);

		expect(notPrevented).toBe(false);
		expect(getDialogInput()).toHaveFocus();
	});

	test("the page is left where it was when the dialog took over the screen", async () => {
		const { container } = render(
			<>
				<div style={{ height: "800px" }} />
				<Autocomplete {...baseProps} mobileModal />
				<div style={{ height: "3000px" }} />
			</>
		);

		window.scrollTo(0, 500);

		await waitFor(() => expect(window.scrollY).toBe(500));

		// `fireEvent`, not `userEvent`: a user event scrolls the element it acts on into view, which is
		// the very thing this case is about.
		fireEvent.click(getTrigger(container));
		await findDialog();

		// What a phone does to the document while the dialog is up: the on-screen keyboard shrinks the
		// viewport, and the browser scrolls the page to keep the focused field inside it.
		window.scrollTo(0, 0);
		fireEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(window.scrollY).toBe(500);
		});

		window.scrollTo(0, 0);
	});

	test("Escape closes the dialog, keeps the committed value and restores focus", async () => {
		const onValueChange = vi.fn();
		const { container } = render(
			<Autocomplete {...baseProps} mobileModal initialValue={cityItems[0]} onValueChange={onValueChange} />
		);
		const trigger = getTrigger(container) as HTMLInputElement;
		const committed = trigger.value;

		await openDialog(container);
		await userEvent.keyboard("{Escape}");

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(trigger.value).toBe(committed);
			expect(trigger).toHaveFocus();
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	test("Modal should be closed without clearing the selected item", async () => {
		const inputValue = cityItems[2];
		const { container } = render(<Autocomplete {...baseProps} mobileModal initialValue={inputValue} />);
		const trigger = getTrigger(container) as HTMLInputElement;

		// First round: backspace all characters then press space, then save/close
		await openDialog(container);

		const dialogInput = getDialogInput();
		await userEvent.click(dialogInput);

		for (let i = 0; i < inputValue.length; i++) {
			await userEvent.keyboard("{Backspace}");
		}

		await userEvent.keyboard(" ");
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(trigger.value).toBe(inputValue);
		});

		// Second round: backspace all characters then type a non-existing item, then save/close
		await openDialog(container);

		const dialogInput2 = getDialogInput();
		await userEvent.click(dialogInput2);

		for (let i = 0; i < inputValue.length; i++) {
			await userEvent.keyboard("{Backspace}");
		}

		await userEvent.type(dialogInput2, "not existing item");
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(trigger.value).toBe(inputValue);
		});
	});

	test("the dialog's clear button follows the text typed into it, not the committed value", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await openDialog(container);

		// Nothing is committed yet, so the dialog starts without a clear button.
		expect(getDialogClearButton()).toBeUndefined();

		await userEvent.keyboard("Ber");

		await waitFor(() => expect(getDialogClearButton()).toBeTruthy());
		await userEvent.click(getDialogClearButton()!);

		await waitFor(() => {
			expect((getDialogInput() as HTMLInputElement).value).toBe("");
			expect(getDialogClearButton()).toBeUndefined();
			// Clearing the draft keeps the dialog open, with its field ready for the next search.
			expect(queryDialog()).not.toBeNull();
			expect(getDialogInput()).toHaveFocus();
		});
	});

	test("Modal should be closed with clearing the selected item via clear button", async () => {
		const inputValue = cityItems[2];
		const onValueChange = vi.fn();
		const { container } = render(
			<Autocomplete {...baseProps} mobileModal initialValue={inputValue} onValueChange={onValueChange} />
		);
		const trigger = getTrigger(container) as HTMLInputElement;

		await openDialog(container);

		await waitFor(() => expect(getDialogClearButton()).toBeTruthy());
		await userEvent.click(getDialogClearButton()!);
		await userEvent.click(getDialogCloseButton());

		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(trigger.value).toBe("");
			expect(onValueChange).toHaveBeenCalledWith("");
		});
	});

	test("Should clear input value when tapping on the clear button", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal initialValue={cityItems[1]} />);
		const trigger = getTrigger(container) as HTMLInputElement;

		expect(trigger.value).toBe(cityItems[1]);

		await userEvent.click(getTriggerClearButton(container)!);

		await waitFor(() => {
			expect(trigger.value).toBe("");
		});
	});

	test("Should trigger `onDropdownClose` when the dropdown is closed", async () => {
		const onDropdownClose = vi.fn();
		const { container } = render(<Autocomplete {...baseProps} mobileModal onDropdownClose={onDropdownClose} />);

		await openDialog(container);
		await userEvent.click(getAllByDataRole(queryDialog()!, DataRoles.Dropdown.Item)[0]);
		await waitFor(() => expect(onDropdownClose).toHaveBeenCalledTimes(1));

		await openDialog(container);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(onDropdownClose).toHaveBeenCalledTimes(2));

		await openDialog(container);
		await userEvent.click(getDialogCloseButton());
		await waitFor(() => expect(onDropdownClose).toHaveBeenCalledTimes(3));
	});

	test("Should not render the clear button when `enableClearButton` is false", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal enableClearButton={false} />);

		// Not rendered on the field in the page while it is empty
		expect(getTriggerClearButton(container)).toBeUndefined();

		await openDialog(container);

		// Nor in the dialog while its field is empty
		expect(getDialogClearButton()).toBeUndefined();

		await userEvent.type(getDialogInput(), "Seoul");

		// Nor once the dialog's field has a value
		await waitFor(() => {
			expect(getDialogClearButton()).toBeUndefined();
		});

		await userEvent.keyboard("{Enter}");

		// Nor on the field in the page once a value is committed
		await waitFor(() => {
			expect(queryDialog()).toBeNull();
			expect(getTriggerClearButton(container)).toBeUndefined();
		});
	});

	test("initiallyExpanded opens the dialog on the first render", async () => {
		render(<Autocomplete {...baseProps} mobileModal initiallyExpanded />);

		await findDialog();
		expect(getDialogInput()).toBeTruthy();
	});

	test("mobileModal={false} keeps the dropdown attached to the field", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal={false} />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy());
		expect(queryDialog()).toBeNull();
		// The field announces the listbox it owns rather than a dialog it would open.
		expect(getByDataRole(container, DataRoles.TextField.Input)).toHaveAttribute("aria-haspopup", "listbox");
	});

	test("defaults to the attached dropdown on a non-phone device", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy());
		expect(queryDialog()).toBeNull();
	});

	/**
	 * The dialog's own field resolves `messagePosition` from the same properties and provider as the
	 * field in the page, so a consumer that moves the messages moves them in both.
	 */
	describe("message position", () => {
		const openWithMessages = async (messagePosition: MessagePosition): Promise<HTMLElement> => {
			const { container } = render(
				<Autocomplete
					{...baseProps}
					mobileModal
					helperText="Test Helper Text"
					errorMessage="Test error message"
					messagePosition={messagePosition}
				/>
			);

			return openDialog(container);
		};

		test("renders the message above the dialog's control for above", async () => {
			const dialog = await openWithMessages("above");
			const control = getByDataRole(dialog, DataRoles.TextField.Control);
			const inputWrapper = getByDataRole(dialog, DataRoles.TextField.Input.Wrapper);
			const message = getByDataRole(dialog, DataRoles.TextField.ErrorMessage);

			expect(control.contains(message)).toBe(true);
			expect(isAfter(message, inputWrapper)).toBe(true);
		});

		test("renders the message below the dialog's control for below", async () => {
			const dialog = await openWithMessages("below");
			const control = getByDataRole(dialog, DataRoles.TextField.Control);
			const inputWrapper = getByDataRole(dialog, DataRoles.TextField.Input.Wrapper);
			const message = getByDataRole(dialog, DataRoles.TextField.ErrorMessage);

			expect(control.contains(message)).toBe(true);
			expect(isAfter(inputWrapper, message)).toBe(true);
		});
	});
});
