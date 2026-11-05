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
 * A dialog listing a table's columns, one checkbox per column, so that the end user can decide which
 * of them the table shows. The visibility state and the trigger that opens the panel stay with the
 * consumer.
 * @module
 */

import type { ReactNode, RefObject } from "react";

import type { Orientation } from "../../common/main/alignment.js";
import type { DataRole, Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

/**
 * One column offered for hiding and showing. A row is a single tab stop that carries the checkbox
 * semantics itself: a click on it, ENTER or SPACE toggles the column.
 */
export interface ColumnVisibilityItem {
	/**
	 * Identifies the column, and keys it in the map reported by
	 * {@link ColumnVisibilityPanelProps.onVisibilityChange}.
	 */
	id: string;

	/**
	 * The column's name, usually the text of its header cell. An item without a label renders an empty
	 * row; give it a {@link title} so that it still has an accessible name.
	 */
	label?: ReactNode;

	/** An icon shown in front of the {@link label}, usually the icon of the column's header cell. */
	icon?: ReactNode;

	/** The accessible name of the row, used when the item has no {@link label}, and as its tooltip. */
	title?: string;

	/**
	 * Whether the column is currently shown by the table. The panel is controlled: it never holds
	 * visibility of its own.
	 */
	visible: boolean;

	/** Whether the row is disabled. It cannot be toggled and is ignored by the reset action. */
	disabled?: boolean;

	/**
	 * The visibility the reset action restores this column to.
	 * @default true
	 */
	defaultVisible?: boolean;
}

/** The visibility of every listed column, keyed by {@link ColumnVisibilityItem.id}. */
export type ColumnVisibilityMap = Record<string, boolean>;

/**
 * The row a change originated from. It is not reported for a reset, which changes all rows at once.
 */
export interface ColumnVisibilityChange {
	/** The {@link ColumnVisibilityItem.id} of the toggled row. */
	id: string;

	/** The visibility the row was toggled to. */
	visible: boolean;
}

/** Why the panel asks to be closed. */
export type ColumnVisibilityPanelCloseReason = "onEscape" | "onOutsideClick" | "onCloseButton" | "onTab";

/**
 * How the panel is presented.
 *
 * - `attached`: anchored to the trigger element.
 * - `modal`: centered in a modal overlay, with an explicit close button.
 * - `auto`: `modal` on a screen narrower than the panel (the `xs` break point, up to 575px) or on a
 *   touch device, `attached` otherwise.
 */
export type ColumnVisibilityPanelPresentation = "auto" | "attached" | "modal";

export interface ColumnVisibilityPanelProps extends Styleable, Identifiable, DataRole, Ref<HTMLDivElement> {
	/** The columns to list, in the order they are listed in. */
	items: ColumnVisibilityItem[];

	/**
	 * Whether the panel is shown. Rendering the panel only while it is open works as well.
	 * @default true
	 */
	open?: boolean;

	/**
	 * The element the panel is anchored to and returns the focus to, usually the button that opens it.
	 *
	 * Without it `presentation="auto"` falls back to the modal, and `presentation="attached"` renders
	 * nothing.
	 */
	triggerElement?: HTMLElement | null | RefObject<HTMLElement | null>;

	/**
	 * Whether the whole panel is disabled: the rows, the actions and the search field. The close button
	 * stays usable.
	 */
	disabled?: boolean;

	/**
	 * The panel's title, and its accessible name unless {@link ariaLabel} overrides it.
	 * @default "Columns", localized
	 */
	title?: ReactNode;

	/** The accessible name of the dialog. Needed when {@link title} is not a plain text. */
	ariaLabel?: string;

	/**
	 * The heading level the {@link title} is announced with.
	 * @default 2
	 */
	ariaLevel?: number;

	/**
	 * The label of the reset action.
	 * @default "Reset to default", localized
	 */
	resetLabel?: ReactNode;

	/**
	 * Whether the reset action is disabled. By default it is, while no column deviates from its
	 * {@link ColumnVisibilityItem.defaultVisible}.
	 */
	resetDisabled?: boolean;

	/** Whether to leave the reset action out, for a table whose visibility has no default to return to. */
	hideReset?: boolean;

	/**
	 * Whether the panel offers an action that shows every column it currently lists. While a search
	 * narrows the list, it applies to the narrowed list only. Disabled columns are never touched.
	 * @default false
	 */
	showAll?: boolean;

	/**
	 * The label of the show-all action.
	 * @default "Show all", localized
	 */
	showAllLabel?: ReactNode;

	/**
	 * Whether the panel offers a search field that narrows the list. It filters {@link items} by their
	 * label, or by their {@link ColumnVisibilityItem.title} where the label is not a text.
	 * @default false
	 */
	searchable?: boolean;

	/**
	 * The placeholder and the hidden label of the search field.
	 * @default "Search columns", localized
	 */
	searchPlaceholder?: string;

	/**
	 * The message shown in place of the list when the search matches no column.
	 * @default "No matching columns", localized
	 */
	noResultsText?: ReactNode;

	/** The tooltip of the close button shown in the modal presentation. */
	closeButtonTitle?: string;

	/**
	 * See {@link ColumnVisibilityPanelPresentation}.
	 * @default "auto"
	 */
	presentation?: ColumnVisibilityPanelPresentation;

	/**
	 * The positions the attached panel prefers relative to the {@link triggerElement}, the first
	 * one having the highest priority.
	 * @default ["bottom-end", "bottom-start", "top-end", "top-start"]
	 */
	orientationList?: Orientation[];

	/**
	 * Whether the panel closes when ESC is hit.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * Whether the panel closes when clicking outside of it.
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether the focus may leave the panel by tabbing past its last, or back before its first, element:
	 * the panel closes and the focus returns to the {@link triggerElement}. Left off, TAB wraps around
	 * inside the dialog.
	 *
	 * *Note:* Has no effect in the modal presentation.
	 * @default false
	 */
	closeOnTabOut?: boolean;

	/**
	 * Whether the panel takes the focus when it opens.
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * Called with the visibility of all listed columns whenever the user changes it.
	 *
	 * @param visibility – see {@link ColumnVisibilityMap}.
	 * @param change – the toggled row, or `undefined` for a reset.
	 */
	onVisibilityChange(visibility: ColumnVisibilityMap, change?: ColumnVisibilityChange): void;

	/**
	 * Called in addition to {@link onVisibilityChange} on a reset, for a consumer that stores the
	 * visibility and wants to drop what it stored.
	 *
	 * @param defaultVisibility – the visibility the panel reset the columns to.
	 */
	onReset?(defaultVisibility: ColumnVisibilityMap): void;

	/**
	 * Called when the search term changes. The panel filters its list itself either way.
	 *
	 * @param searchTerm – what the search field holds now.
	 */
	onSearchChange?(searchTerm: string): void;

	/**
	 * Called when the panel asks to be closed. The consumer that owns the open state closes it.
	 *
	 * @param reason – see {@link ColumnVisibilityPanelCloseReason}.
	 */
	onClose?(reason: ColumnVisibilityPanelCloseReason): void;
}
