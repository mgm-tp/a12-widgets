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
 * This ExtendedDropDown widget displays the current list of matching issues for
 * the autocomplete functionality. It renders the current state of the selection
 * list.
 */

import type { ReactNode, KeyboardEvent, MouseEvent, UIEvent, FocusEvent } from "react";

import type { Ref, Identifiable, Styleable } from "../../../common/main/base-props.js";

export type SelectedItemPosition = "top" | "middle" | "bottom";

/**
 * The props of ExtendedDropDown.
 */
export interface DropDownProps extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * Displays how many items match the searched keywords.
	 */
	hint?: string;

	/**
	 * List of DropDownItem.
	 */
	items: DropDownItem[];

	/**
	 * List of links that will be displayed on top of {@link items}.
	 */
	links?: ReactNode[];

	/**
	 * Defines the selected item.
	 */
	selectedItem?: DropDownItem;

	/**
	 * Defines the tabindex attribute.
	 * @default 0
	 */
	tabIndex?: number;

	/**
	 * Whether the dropdown is in touch mode or not.
	 * @deprecated since 32.0.0 because touch is detected inside of Dropdown, don't need this prop anymore.
	 */
	touch?: boolean;

	/**
	 * Uses the light color for background.
	 */
	lightBackground?: boolean;

	/**
	 * Display items in horizontal.
	 */
	horizontal?: boolean;

	/**
	 * Keycode to select an item.
	 * @default ENTER
	 * @deprecated since 32.3.0 because event.keycode is deprecated. Use {@link keysToSelectItem} instead.
	 */
	selectItemKeys?: number[];

	/**
	 * Keys to select an item.
	 * @default ENTER
	 */
	keysToSelectItem?: string[];

	/**
	 * aria-labelledby attribute for the dropdown content wrapper.
	 */
	ariaLabelledby?: string;

	/**
	 * initial position of selected item.
	 * @default "bottom"
	 */
	selectedItemPosition?: SelectedItemPosition;

	/**
	 * To display element(s) at the bottom for extended functionality such as loading more items.
	 */
	footer?: ReactNode;

	/**
	 * @internal
	 * Use focus style for preselected item instead of blue background.
	 */
	useFocusStyle?: boolean;

	/**
	 * @internal
	 * Support accessibility by setting aria-hidden to true on the text,
	 * ensuring screen readers ignore reading the label to prevent it from being read twice.
	 */
	hideA11yLabel?: boolean;

	/**
	 * Custom function to render dropdown custom label.
	 *
	 * @param item - The dropdown item being rendered
	 * @returns ReactNode to be rendered as the label
	 */
	labelRenderer?(item: DropDownItem): ReactNode;

	/**
	 * Handle event when pressing keyboard on the dropdown wrapper.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Handle event when triggering mousedown on the dropdown wrapper.
	 */
	onWrapperMouseDown?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when triggering mousedown on an item.
	 */
	onMouseDown?(item: DropDownItem, event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when the DropDown is scrolled.
	 */
	onScroll?(event: UIEvent<HTMLElement>): void;

	/**
	 * Handle event when a key has been pressed.
	 */
	onKeyPress?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Handle event when blurring the dropdown.
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Trigger when the pre-selected item is changed.
	 * For example, when pressing up/down arrow key.
	 */
	onPreselectedItemChange?(preselectedItem: DropDownItem | undefined): void;

	/**
	 * Trigger when the pre-selected link is changed.
	 * For example, when pressing up/down arrow key.
	 */
	onPreselectedLinkChange?(preselectedLinkPosition: number | undefined): void;

	/**
	 * Trigger when the selected item is changed - clicking/press Enter on an item.
	 */
	onSelectedItemChange?(selectedItem: DropDownItem | undefined): void;

	/**
	 * Handle event when an item is selected by mouse.
	 *
	 * @deprecated from 29.0.0. Use {@link onSelectedItemChange} instead.
	 */
	onClick?(item: DropDownItem, event: MouseEvent<HTMLElement>): void;
}

/**
 * DropDownItem definition inside of {@link DropDownProps}.
 */
export interface DropDownItem extends Styleable, Identifiable {
	/**
	 * Label of dropdown item.
	 */
	label: string;

	/**
	 * If set to true, the label will still be rendered but it won't be displayed.
	 * This will save space but still support Accessibility.
	 */
	hideLabel?: boolean;

	/**
	 * Specifies the value of a DropdownItem that should get selected.
	 * If the value does not exist, the {@link selected} item will be set dependent on the {@link label} and id or {@link selected}.
	 */
	value?: string;

	/**
	 * An additional text that is placed below the {@link label}.
	 */
	secondaryText?: ReactNode;

	/**
	 * A graphic element (e.g. icon) that is placed in front of the {@link label}.
	 */
	graphic?: ReactNode;

	/**
	 * Whether a dropdown item contains a list of DropdownItem inside.
	 */
	children?: DropDownItem[];

	/**
	 * Whether a dropdown item should be disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether a dropdown item should be selected.
	 */
	selected?: boolean;

	/**
	 * Whether a dropdown item represents an empty value.
	 */
	isEmptyValue?: boolean;

	/**
	 * tabindex attribute.
	 * @default -1 if {@link children} is defined or {@link disabled} is true
	 */
	tabIndex?: number;

	/**
	 * title attribute.
	 */
	title?: string;

	/**
	 * aria-checked attribute.
	 */
	ariaChecked?: "true" | "false" | "mixed";

	/**
	 * @internal
	 */
	dataType?: string;

	/**
	 * @internal
	 */
	divider?: boolean;
}
