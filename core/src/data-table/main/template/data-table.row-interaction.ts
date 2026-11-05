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

import type { FocusEventHandler, HTMLAttributes, KeyboardEventHandler, MouseEventHandler } from "react";
import { Key } from "ts-key-enum";

import { useDataTableContext } from "../data-table.context.js";

/** Inputs {@link useDataTableRowInteraction} needs to resolve a row's focus/keyboard wiring. */
export interface DataTableRowInteractionParams<ElementType extends HTMLElement> {
	/**
	 * Zero-based data index, driving the roving `tabIndex`. Omit it and the row
	 * falls back to the static `interactive ? 0 : -1` tab stop.
	 */
	rowIndex?: number;

	/** Whether the row is disabled — disabled rows are never focusable and never activate. */
	disabled?: boolean;

	/** Whether the row reacts to user interaction (drives the static tab stop). */
	interactive?: boolean;

	/** Explicit `tabIndex`, winning over both the roving and the static value. */
	tabIndex?: number;

	/** The row's click handler, if any — its presence enables Enter-activation. */
	onClick?: MouseEventHandler<ElementType>;

	/** The row's dedicated keydown handler. */
	onKeyDown?: KeyboardEventHandler<ElementType>;

	/** The row's focus handler. */
	onFocus?: FocusEventHandler<ElementType>;

	/** Consumer/wrapper attributes; only `onKeyDown` is read (and composed, not clobbered). */
	htmlAttributes?: HTMLAttributes<ElementType>;
}

/** Resolved DOM props {@link useDataTableRowInteraction} returns for the row element. */
export interface DataTableRowInteraction<ElementType extends HTMLElement> {
	tabIndex?: number;
	onFocus?: FocusEventHandler<ElementType>;
	onKeyDown?: KeyboardEventHandler<ElementType>;
}

/**
 * Shared focus/keyboard wiring for a body row, in either layout: the `<tr>` of the
 * table layout and the card `<div>` of {@link DataTableCardTpl} are the same
 * interaction unit, so both resolve it here rather than restating it.
 *
 * Three things happen:
 *
 *  - **Roving `tabIndex`** — while row-level arrow navigation is active exactly one
 *    row carries `tabIndex=0` and the rest `-1`, kept in sync by `onRowFocusChange`
 *    as focus lands. Disabled rows stay non-focusable.
 *  - **Enter-activation** — the row is the activation unit, so Enter on the row
 *    itself (not on a child) dispatches a native click, giving `onClick` a real
 *    `MouseEvent`.
 *  - **Keydown composition** — a handler may arrive both as `onKeyDown` and via
 *    `htmlAttributes` (the channel wrappers use for per-row accelerators). Spreading
 *    `htmlAttributes` onto the element would let the explicit prop clobber it, so
 *    both are invoked: native activation first, then the prop, then the external one.
 *
 * @internal
 */
export function useDataTableRowInteraction<ElementType extends HTMLElement>(
	params: DataTableRowInteractionParams<ElementType>
): DataTableRowInteraction<ElementType> {
	const { rowIndex, disabled, interactive, tabIndex, onClick, onKeyDown, onFocus, htmlAttributes } = params;
	const arrowNavActive = useDataTableContext().arrowNavActive;
	const isRowFocused = useDataTableContext().isRowFocused;
	const onRowFocusChange = useDataTableContext().onRowFocusChange;

	const rovingTabIndex =
		arrowNavActive && !disabled && rowIndex !== undefined ? (isRowFocused?.(rowIndex) ? 0 : -1) : undefined;

	const handleOnFocus: FocusEventHandler<ElementType> | undefined =
		arrowNavActive && rowIndex !== undefined
			? (event) => {
					if (event.target === event.currentTarget) {
						onRowFocusChange?.(rowIndex, event.currentTarget);
					}

					onFocus?.(event);
				}
			: onFocus;

	const externalOnKeyDown = htmlAttributes?.onKeyDown;
	const handleOnKeyDown: KeyboardEventHandler<ElementType> | undefined =
		onClick || onKeyDown || externalOnKeyDown
			? (event) => {
					if (!disabled && event.key === Key.Enter && event.target === event.currentTarget) {
						// Dispatch a native click so `onClick` gets a real MouseEvent.
						event.currentTarget.click();
					}

					onKeyDown?.(event);
					externalOnKeyDown?.(event);
				}
			: undefined;

	return {
		tabIndex: tabIndex ?? rovingTabIndex ?? (disabled ? undefined : interactive ? 0 : -1),
		onFocus: handleOnFocus,
		onKeyDown: disabled ? undefined : handleOnKeyDown
	};
}
