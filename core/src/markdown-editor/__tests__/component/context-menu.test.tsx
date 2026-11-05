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
 * The two right-click menus the editor comes with, in rich edit mode only.
 *
 * In a table, the row and column operations aim at the cell under the pointer.
 * They are not on the toolbar at all: the table button opens the size grid and inserts, nothing more.
 * GFM has no row above the header row, and a table with no header row is not a table,
 * so those two operations are off while the click lands in the header — and only those:
 * a column reaches every row, and deleting the table takes the header with it anyway.
 *
 * On an image, "Edit properties" opens the image dialog already filled in with that picture,
 * and "Delete image" takes it out. A picture inside a table cell answers both questions,
 * so the more exact one wins and the image menu opens.
 *
 * Everywhere else the browser keeps its own menu — spell check, paste, translate —
 * and so it does in source and preview mode.
 */

import { queryAllByDataRole, render, screen, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
	ControlledEditor,
	EDITOR_ROLES,
	findMenuItems,
	getSurfaceByMode,
	getToolbarItem,
	queryDialogField,
	switchMode
} from "../utils/index.js";

const TABLE = ["| a | b |", "| - | - |", "| c | d |"].join("\n");

const SRC = "https://example.com/a.png";
const IMAGE = `![alt text](${SRC} "a title")`;

const ROW_AND_COLUMN_OPERATIONS = [
	"Insert row above",
	"Insert row below",
	"Delete row",
	"Insert column before",
	"Insert column after",
	"Delete column",
	"Delete table"
];

/** The menu item whose label is `label`, from an open menu. */
function menuItem(items: HTMLElement[], label: string): HTMLElement {
	// The label is only part of the text: an item starts with its Material Symbols ligature.
	const found = items.find((item) => item.textContent?.includes(label));

	if (!found) {
		throw new Error(
			`menu item "${label}" not found. The open menu has: ${items.map((item) => item.textContent).join(" | ")}`
		);
	}

	return found;
}

const isOff = (item: HTMLElement): boolean => item.getAttribute("aria-disabled") === "true";

/**
 * Fires a `contextmenu` event on `element`, the way a right-click does.
 *
 * `userEvent` has no right-click, and the menus listen for the native event on the
 * editor root, so the event is dispatched by hand. The coordinates are the element's,
 * because that is where the menu opens.
 */
async function rightClick(element: HTMLElement): Promise<void> {
	const { top, left } = element.getBoundingClientRect();

	element.dispatchEvent(
		new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: left, clientY: top })
	);

	// Let React paint whatever the event opened. This is a plain yield, not a wait for a
	// condition: the caller waits on what it actually wants — the openers below wait for the
	// menu's items and the focus inside it, the "no menu" tests for nothing at all.
	await new Promise((resolve) => requestAnimationFrame(resolve));
}

/** Waits for the menu the right-click opened to have focus, then hands back its items. */
async function awaitOpenMenu(): Promise<HTMLElement[]> {
	const items = await findMenuItems();
	const menu = await screen.findByRole("menu");

	// The portal takes focus a tick after it draws its items. A key pressed before that
	// lands on the body, where nothing handles it, and the menu never moves.
	await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true));

	return items;
}

/** The text of the rendered document that reads `text`, once the editor has drawn it. */
async function findTextByContent(surface: HTMLElement, text: string): Promise<HTMLElement> {
	return waitFor(() => {
		const match = [...surface.querySelectorAll<HTMLElement>("[data-lexical-text]")].find(
			(node) => node.textContent === text
		);

		if (!match) {
			throw new Error(`nothing reading "${text}" is rendered yet`);
		}

		return match;
	});
}

/** Right-clicks the cell of the rendered table whose text is `text`, and returns the menu items. */
async function openTableMenu(surface: HTMLElement, text: string): Promise<HTMLElement[]> {
	const cell = await findTextByContent(surface, text);

	await userEvent.click(cell);
	await rightClick(cell);

	return awaitOpenMenu();
}

/** Right-clicks the first image the surface draws, and returns the menu items. */
async function openImageMenu(surface: HTMLElement): Promise<HTMLElement[]> {
	const image = await waitFor(() => {
		const match = surface.querySelector("img");

		if (!match) {
			throw new Error("the surface draws no image");
		}

		return match;
	});

	await rightClick(image);

	return awaitOpenMenu();
}

/** The `<input>` of the dialog field labelled `titleKey`, once the dialog is open. */
async function dialogInput(titleKey: string): Promise<HTMLInputElement> {
	return waitFor(() => {
		const input = queryDialogField(document.body, titleKey)?.querySelector("input");

		if (!input) {
			throw new Error(`the image dialog has no "${titleKey}" field yet`);
		}

		return input;
	});
}

/** Clicks the dialog's submit button. The actions share one role, so the last one is it. */
async function submitDialog(): Promise<void> {
	const actions = queryAllByDataRole(document.body, EDITOR_ROLES.Dialog.Action);

	await userEvent.click(actions.at(-1)!);
}

/** The markdown the host last heard about. */
const lastEmit = (onChange: ReturnType<typeof vi.fn>): string => String(onChange.mock.calls.at(-1)?.[0]);

describe("the table context menu", () => {
	test("the toolbar's table button only inserts — the operations live on the right-click menu", async () => {
		const { container } = render(<ControlledEditor initialValue={TABLE} />);

		await userEvent.click(getToolbarItem(container, "tableMenu"));

		// The grid is what opened, not a list of operations.
		await waitFor(() => expect(screen.getAllByRole("gridcell").length).toBeGreaterThan(0));
		expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
	});

	test("right-clicking a cell opens the row and column operations", async () => {
		const { container } = render(<ControlledEditor initialValue={TABLE} />);
		const items = await openTableMenu(getSurfaceByMode(container), "c");

		for (const label of ROW_AND_COLUMN_OPERATIONS) {
			expect(menuItem(items, label)).toBeInTheDocument();
		}
	});

	test("in a header cell, the row operations GFM does not allow are switched off", async () => {
		const { container } = render(<ControlledEditor initialValue={TABLE} />);
		const items = await openTableMenu(getSurfaceByMode(container), "a");

		await waitFor(() => expect(isOff(menuItem(items, "Insert row above"))).toBe(true));
		expect(isOff(menuItem(items, "Delete row"))).toBe(true);

		// Insert row below writes the first body row, which is valid GFM, so it stays on.
		expect(isOff(menuItem(items, "Insert row below"))).toBe(false);

		for (const label of ["Insert column before", "Insert column after", "Delete column", "Delete table"]) {
			expect(isOff(menuItem(items, label))).toBe(false);
		}
	});

	test("in a body cell, every row operation works", async () => {
		const { container } = render(<ControlledEditor initialValue={TABLE} />);
		const items = await openTableMenu(getSurfaceByMode(container), "c");

		await waitFor(() => expect(isOff(menuItem(items, "Insert row above"))).toBe(false));
		expect(isOff(menuItem(items, "Delete row"))).toBe(false);
	});

	test("picking an operation edits the table the click was in", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue={TABLE} onChange={onChange} emitMode="change" />);

		const items = await openTableMenu(getSurfaceByMode(container), "c");

		await userEvent.click(menuItem(items, "Insert row below"));

		await waitFor(() => expect(lastEmit(onChange)).toContain("| c | d |"));
		expect(lastEmit(onChange).split("\n").filter(Boolean)).toHaveLength(4);
	});

	test("outside a table the browser keeps its own menu", async () => {
		const { container } = render(<ControlledEditor initialValue={`${TABLE}\n\nhello`} />);
		const surface = getSurfaceByMode(container);
		const paragraph = await findTextByContent(surface, "hello");

		await userEvent.click(paragraph);
		await rightClick(paragraph);

		expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
	});
});

describe("the image context menu", () => {
	test("right-clicking an image offers editing and deleting it", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const items = await openImageMenu(getSurfaceByMode(container));

		expect(menuItem(items, "Edit properties")).toBeInTheDocument();
		expect(menuItem(items, "Delete image")).toBeInTheDocument();

		// The table operations belong to the other menu. Two items, and these are they.
		expect(items).toHaveLength(2);
	});

	test("the image the menu is about is selected, so it is clear which one it means", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const surface = getSurfaceByMode(container);

		await openImageMenu(surface);

		await waitFor(() => expect(surface.querySelector("img")).toHaveAttribute("data-selected"));
	});

	test("deleting takes the image out of the markdown and leaves the text around it", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={`${IMAGE}\n\nhello`} onChange={onChange} emitMode="change" />
		);
		const surface = getSurfaceByMode(container);
		const items = await openImageMenu(surface);

		await userEvent.click(menuItem(items, "Delete image"));

		await waitFor(() => expect(surface.querySelector("img")).toBeNull());
		expect(lastEmit(onChange)).not.toContain(SRC);
		expect(lastEmit(onChange)).toContain("hello");
	});

	test("editing opens the dialog on what the image says now", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const items = await openImageMenu(getSurfaceByMode(container));

		await userEvent.click(menuItem(items, "Edit properties"));

		expect(await dialogInput("imageSrcLabel")).toHaveValue(SRC);
		expect(await dialogInput("imageAltLabel")).toHaveValue("alt text");
		expect(await dialogInput("imageTitleLabel")).toHaveValue("a title");
	});

	test("applying changes the image that was clicked instead of inserting a second one", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue={IMAGE} onChange={onChange} emitMode="change" />);
		const surface = getSurfaceByMode(container);
		const items = await openImageMenu(surface);

		await userEvent.click(menuItem(items, "Edit properties"));
		await userEvent.fill(await dialogInput("imageSrcLabel"), "https://example.com/b.png");
		await userEvent.fill(await dialogInput("imageAltLabel"), "new alt");
		await submitDialog();

		await waitFor(() => expect(lastEmit(onChange)).toContain('![new alt](https://example.com/b.png "a title")'));
		expect(surface.querySelectorAll("img")).toHaveLength(1);
	});

	test("emptying the title field takes the title off", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue={IMAGE} onChange={onChange} emitMode="change" />);
		const items = await openImageMenu(getSurfaceByMode(container));

		await userEvent.click(menuItem(items, "Edit properties"));
		await userEvent.clear(await dialogInput("imageTitleLabel"));
		await submitDialog();

		await waitFor(() => expect(lastEmit(onChange)).toContain(`![alt text](${SRC})`));
	});

	test("a refused address is reported and the image is left as it was", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue={IMAGE} onChange={onChange} emitMode="change" />);
		const items = await openImageMenu(getSurfaceByMode(container));

		await userEvent.click(menuItem(items, "Edit properties"));
		await userEvent.fill(await dialogInput("imageSrcLabel"), "javascript:alert(1)");
		await submitDialog();

		await waitFor(() => expect(queryAllByDataRole(document.body, EDITOR_ROLES.Dialog.Error)).not.toHaveLength(0));
		expect(onChange).not.toHaveBeenCalled();
	});

	test("an image inside a table cell gets the image menu, not the table one", async () => {
		const { container } = render(<ControlledEditor initialValue={`| a |\n| --- |\n| ${IMAGE} |`} />);
		const items = await openImageMenu(getSurfaceByMode(container));

		expect(menuItem(items, "Edit properties")).toBeInTheDocument();
		expect(items.some((item) => item.textContent?.includes("Insert row below"))).toBe(false);
	});

	test("in preview mode the browser keeps its own menu", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);

		await switchMode(container, "view");

		const image = await waitFor(() => {
			const match = getSurfaceByMode(container, "view").querySelector("img");

			if (!match) {
				throw new Error("the preview draws no image");
			}

			return match;
		});

		await rightClick(image);

		expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
	});
});

/** Both menus render through the same component, so these hold for either one. */
describe("working either menu from the keyboard", () => {
	test("Down walks the items that are on and wraps at the end", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const items = await openImageMenu(getSurfaceByMode(container));

		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() => expect(document.activeElement).toBe(items[0]));

		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() => expect(document.activeElement).toBe(items[1]));

		// Two items, so the third step is back at the top.
		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() => expect(document.activeElement).toBe(items[0]));
	});

	test("Up from the first item wraps to the last", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const items = await openImageMenu(getSurfaceByMode(container));

		// Neither arrow starts at an item, so the first press of either opens at the top.
		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() => expect(document.activeElement).toBe(items[0]));

		await userEvent.keyboard("{ArrowUp}");
		await waitFor(() => expect(document.activeElement).toBe(items.at(-1)));
	});

	test("the arrow keys skip the items that are switched off", async () => {
		const { container } = render(<ControlledEditor initialValue={TABLE} />);
		const items = await openTableMenu(getSurfaceByMode(container), "a");

		// In the header row, "Insert row above" and "Delete row" are off.
		await userEvent.keyboard("{ArrowDown}");

		await waitFor(() => expect(document.activeElement).toBe(menuItem(items, "Insert row below")));
	});

	test("Escape closes the menu and puts the caret back in the text", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);
		const surface = getSurfaceByMode(container);

		await openImageMenu(surface);
		await userEvent.keyboard("{Escape}");

		await waitFor(() => expect(screen.queryAllByRole("menuitem")).toHaveLength(0));
		expect(surface.contains(document.activeElement)).toBe(true);
	});

	test("clicking away closes the menu", async () => {
		const { container } = render(<ControlledEditor initialValue={IMAGE} />);

		await openImageMenu(getSurfaceByMode(container));

		// Not the text around the image: the menu opens at the pointer and may well cover it.
		await userEvent.click(document.body);

		await waitFor(() => expect(screen.queryAllByRole("menuitem")).toHaveLength(0));
	});
});
