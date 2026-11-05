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
	getByDataRole,
	getByTitle,
	queryAllByDataRole,
	queryByDataRole,
	queryByTitle,
	screen,
	waitFor
} from "test-utils";
import { expect } from "vitest";
import { userEvent } from "vitest/browser";

import { A11yResourceDefinitions } from "../../../common/main/a11y-localization/a11y-resources.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { MarkdownEditorMode } from "../../main/markdown-editor.api.js";

/** All data-roles of the editor, so a test does not write `DataRoles.MarkdownEditor` every time. */
export const EDITOR_ROLES = DataRoles.MarkdownEditor;

/** The English names of the editor's controls, the ones it shows unless the host changes them. */
const TITLES = A11yResourceDefinitions.en?.markdownEditorTitles as Record<string, string>;

/** The name a control gives a screen reader. */
const getAccessibleName = (element: Element): string => {
	// A Button with no title still writes `title=""`, so an empty string has to fall through.
	const own = element.getAttribute("aria-label") || element.getAttribute("title");

	if (own) {
		return own;
	}

	// A menu puts the role on its wrapper, like the rich text editor does.
	// The name sits on the button inside.
	const trigger = element.querySelector("button");

	return trigger?.getAttribute("aria-label") || trigger?.getAttribute("title") || "";
};

/** The names of all the toolbar controls, in the order they show up. */
export function getToolbarItemNames(container: HTMLElement): string[] {
	return queryAllByDataRole(container, EDITOR_ROLES.ToolbarItem).map(getAccessibleName);
}

/**
 * The buttons in the dialog's footer, in the order they show up. The last one submits.
 *
 * They all share the one `Action` role, so where a button sits is what tells them apart.
 * The date picker's footer works the same way.
 */
export function getDialogActions(container: HTMLElement): HTMLElement[] {
	const footer = queryByDataRole(container, EDITOR_ROLES.Dialog.Footer);

	return footer ? queryAllByDataRole(footer, EDITOR_ROLES.Dialog.Action) : [];
}

/**
 * The toolbar control called `titleKey` — `getToolbarItem(container, "bold")`.
 *
 * All the controls share the one `ToolbarItem` role, like the rich text editor's do,
 * so the name is what tells them apart. The name comes from the title list,
 * so this keeps working when the toolbar order changes or a feature hides a control.
 */
export function queryToolbarItem(container: HTMLElement, titleKey: string): HTMLElement | null {
	return (
		queryAllByDataRole(container, EDITOR_ROLES.ToolbarItem).find((el) => getAccessibleName(el) === TITLES[titleKey]) ??
		null
	);
}

/** Same as {@link queryToolbarItem}, but fails the test when the control is not there. */
export function getToolbarItem(container: HTMLElement, titleKey: string): HTMLElement {
	const item = queryToolbarItem(container, titleKey);

	if (!item) {
		throw new Error(`No toolbar control named "${TITLES[titleKey]}" (${titleKey}).`);
	}

	return item;
}

/** The dialog field with the label `titleKey` — `queryDialogField(container, "linkUrlLabel")`. */
export function queryDialogField(container: HTMLElement, titleKey: string): HTMLElement | null {
	return (
		queryAllByDataRole(container, EDITOR_ROLES.Dialog.Field).find((field) =>
			field.textContent?.includes(TITLES[titleKey])
		) ?? null
	);
}

/**
 * The read-only box the editor draws for a directive it does not know.
 *
 * The box has no `data-role`, the same as the other nodes the editor renders.
 * Its `title` is what names it, so that is what we look for.
 */
export function getUnknownDirective(container: HTMLElement): HTMLElement {
	return getByTitle(container, TITLES.directiveUnknown);
}

/** Same as `getUnknownDirective`, but `null` when the editor drew no such box. */
export function queryUnknownDirective(container: HTMLElement): HTMLElement | null {
	return queryByTitle(container, TITLES.directiveUnknown);
}

/**
 * The mode the editor really shows. `readonly` always lands on view,
 * the same fold `EditorShell` does.
 */
export function getShownMode(mode: MarkdownEditorMode = "edit", readonly?: boolean): MarkdownEditorMode {
	return readonly ? "view" : mode;
}

/** The role of the surface each mode shows. */
export function getSurfaceRole(mode: MarkdownEditorMode): string {
	return {
		edit: EDITOR_ROLES.Surface.Edit,
		source: EDITOR_ROLES.Surface.Source,
		view: EDITOR_ROLES.Surface.View
	}[mode];
}

/**
 * The editable element of the surface for `mode`. This is where the caret goes,
 * so `userEvent` needs this element and not the wrapper.
 *
 * The `data-role` is on the wrapper and the `contenteditable` is a child of it.
 * We return the wrapper when there is no such child, so this also works in `view` mode,
 * which has no editable element.
 */
export function getSurfaceByMode(container: HTMLElement, mode: MarkdownEditorMode = "edit"): HTMLElement {
	const surface = getByDataRole(container, getSurfaceRole(mode));

	return surface.querySelector<HTMLElement>('[contenteditable="true"]') ?? surface;
}

/** True while the caret is somewhere inside `element`. */
export const isHoldingCaret = (element: HTMLElement): boolean => element.contains(document.activeElement);

/**
 * Waits until the surface for `mode` is in the DOM, editable or not.
 *
 * For tests that check something is *missing*, like no focus or no toolbar.
 * Right after `render` such a test would pass while the editor is still starting,
 * so we wait for the surface first.
 */
export async function waitForSurfaceReady(container: HTMLElement, mode: MarkdownEditorMode = "edit"): Promise<void> {
	await waitFor(() => expect(getByDataRole(container, getSurfaceRole(mode))).toBeInTheDocument());
}

/**
 * Waits for a menu to open and returns its items.
 *
 * Uses `screen` instead of the render container, because a menu renders in a portal
 * and is not inside the container. `findAllByRole` waits by itself, so the caller needs no `waitFor`.
 */
export async function findMenuItems(): Promise<HTMLElement[]> {
	return screen.findAllByRole("menuitem");
}

/**
 * Clicks the item of the open menu whose label contains `text`.
 *
 * Matches part of the text, because the `textContent` of an item starts with its
 * Material Symbols ligature. An exact match would never find anything.
 */
export async function clickMenuItem(text: string): Promise<void> {
	const items = await findMenuItems();
	const matchedItem = items.find((item) => item.textContent?.includes(text));

	if (!matchedItem) {
		const labels = items.map((item) => item.textContent).join(" | ");

		throw new Error(`menu item "${text}" not found. The open menu has: ${labels}`);
	}

	await userEvent.click(matchedItem);
}

/**
 * Picks a size from the open table grid: the cell that many rows down and columns
 * across. `rows` counts the header row, the same as the grid's own readout.
 */
export async function clickTableSize(rows: number, columns: number): Promise<void> {
	const gridRows = await screen.findAllByRole("row");
	const cell = gridRows[rows - 1]?.querySelectorAll<HTMLElement>('[role="gridcell"]')[columns - 1];

	if (!cell) {
		throw new Error(`the table grid has no ${rows} x ${columns} cell — it has ${gridRows.length} rows`);
	}

	// The picker inserts on mouse down, so the editor keeps its selection.
	await userEvent.click(cell);
}

/** The role of the menu item that picks each mode. */
export function getModeItemRole(mode: MarkdownEditorMode): string {
	return {
		edit: EDITOR_ROLES.ModeSwitcher.Edit,
		source: EDITOR_ROLES.ModeSwitcher.Source,
		view: EDITOR_ROLES.ModeSwitcher.View
	}[mode];
}

/**
 * Opens the mode menu in the toolbar and returns nothing — the items are then on the page.
 *
 * The menu renders in a portal, so its items are looked up with `screen` and not inside
 * the render container.
 */
export async function openModeMenu(container: HTMLElement): Promise<void> {
	await userEvent.click(getByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger));
}

/**
 * Switches the editor to `mode` the way a user does.
 *
 * The toolbar has the mode menu, so this opens it first and then picks the mode. A field
 * with no toolbar still shows the old row of buttons, and there the mode is one click.
 */
export async function switchMode(container: HTMLElement, mode: MarkdownEditorMode): Promise<void> {
	const trigger = queryByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger);

	if (!trigger) {
		await userEvent.click(getByDataRole(container, getModeItemRole(mode)));

		return;
	}

	await userEvent.click(trigger);
	await userEvent.click(await screen.findByDataRole(getModeItemRole(mode)));
}

/**
 * Simple sleep.
 *
 * For tests that check something does *not* happen. There is no state to wait for,
 * so the only way to know a debounce stayed quiet is to wait longer than it.
 */
export const wait = (milliseconds: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));
