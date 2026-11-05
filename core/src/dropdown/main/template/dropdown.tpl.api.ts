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
 * How many options can be selected at once.
 *
 * `"multiple"` turns the list into a multi-select listbox: it announces itself as
 * `aria-multiselectable`, every option carries its own `aria-selected`, activating an option toggles
 * it instead of replacing the selection, and each option gets a checkbox in front of its label.
 */
export type DropDownSelectionMode = "single" | "multiple";

/**
 * What `useDropdownNavigation` needs to know about the list it tracks the active option of.
 */
export interface DropdownNavigationOptions<T = unknown> {
	/**
	 * The options of the list, the same array that is handed to {@link DropDownProps.items}.
	 */
	items: DropDownItem<T>[];

	/**
	 * Identifies an option, the same way {@link DropDownProps.getItemKey} does. Pass the same function
	 * to both, so that the handle resolves an option to the position the list gives it.
	 * @param item - the option to identify
	 * @returns a value that is unique among {@link items}
	 */
	getItemKey?(item: DropDownItem<T>): string;
}

/**
 * Declarative handle over a {@link DropDown}'s active option — the option that arrow keys move and
 * that `aria-activedescendant` points at.
 *
 * Obtained from `useDropdownNavigation` and handed to the list through
 * {@link DropDownProps.navigation}. It replaces reaching into the rendered `DropDown` instance:
 * the active option becomes state the caller can render from, and moving it no longer means
 * computing a position against the list's internal flattening of {@link DropDownProps.items}.
 */
export interface DropdownNavigationHandle<T = unknown> {
	/** Position of the active option in the flattened item list, or `undefined` when none is active. */
	activeIndex: number | undefined;

	/** The active option itself. */
	activeItem: DropDownItem<T> | undefined;

	/** Position of the active link option among {@link DropDownProps.links}, if one is active. */
	activeLinkIndex: number | undefined;

	/**
	 * Forwards a key event to the list. Arrow keys move the active option — across the link options
	 * too — and the keys in {@link DropDownProps.keysToSelectItem} select it.
	 *
	 * Call this from the element that holds the focus, typically the combobox input.
	 */
	handleKeyDown(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Activates the option at a position in the flattened item list.
	 * @param index the position, or `undefined` to clear the active option
	 */
	setActiveIndex(index: number | undefined): void;

	/**
	 * Activates the given option, wherever it sits in the list. The option is looked up by
	 * {@link DropdownNavigationOptions.getItemKey}.
	 * @param item the option, or `undefined` to clear the active option
	 */
	setActiveItem(item: DropDownItem<T> | undefined): void;

	/** Activates the first option that is not disabled. */
	moveToFirst(): void;

	/** Activates the last option that is not disabled. */
	moveToLast(): void;

	/** Clears the active option. */
	reset(): void;

	/**
	 * @internal
	 * Connects the handle to the rendered list; set through {@link DropDownProps.navigation}.
	 */
	attach(target: DropdownNavigationTarget | null): void;

	/**
	 * @internal
	 * Reports the active link option back from the list.
	 */
	setActiveLinkIndex(index: number | undefined): void;
}

/**
 * @internal
 * The part of the rendered list a {@link DropdownNavigationHandle} drives. Only key handling still
 * needs the list itself: it measures a wrapping grid's rows and scrolls the active option into view.
 */
export interface DropdownNavigationTarget {
	handleForwardedKeyboardEvent(event: KeyboardEvent<HTMLElement>): void;
}

/**
 * The props of ExtendedDropDown.
 */
export interface DropDownProps<T = unknown> extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * Displays how many items match the searched keywords.
	 */
	hint?: string;

	/**
	 * List of DropDownItem.
	 */
	items: DropDownItem<T>[];

	/**
	 * List of links that will be displayed on top of {@link items}.
	 */
	links?: ReactNode[];

	/**
	 * Defines the selected item.
	 *
	 * Ignored when {@link selectionMode} is `"multiple"` — use {@link selectedItems} there.
	 */
	selectedItem?: DropDownItem<T>;

	/**
	 * Defines the selected items while {@link selectionMode} is `"multiple"`.
	 *
	 * Falls back to the options' own {@link DropDownItem.selected} flags when omitted.
	 */
	selectedItems?: DropDownItem<T>[];

	/**
	 * Whether one option or several can be selected at once.
	 * @default "single"
	 */
	selectionMode?: DropDownSelectionMode;

	/**
	 * Identifies an option, so that the list can tell which of {@link items} a selected or active
	 * option is.
	 *
	 * Without it options are matched by {@link DropDownItem.value}, falling back to
	 * {@link DropDownItem.label} together with {@link DropDownItem.id} — which cannot tell two
	 * options with the same label apart. Provide it whenever labels may repeat.
	 * @param item - the option to identify
	 * @returns a value that is unique among {@link items}
	 */
	getItemKey?(item: DropDownItem<T>): string;

	/**
	 * The active option, obtained from `useDropdownNavigation`.
	 *
	 * Handing one in makes the list read its active option from the handle instead of keeping it to
	 * itself, which is what lets the caller render from it — and move it — without holding on to the
	 * rendered `DropDown`.
	 */
	navigation?: DropdownNavigationHandle<T>;

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
	 * @default ENTER, and SPACE as well while {@link selectionMode} is `"multiple"`
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
	 * Renders only the options in view instead of all of them, which keeps long lists responsive.
	 * Sections are windowed along with their options. Ignored for `horizontal` lists and when
	 * `useFocusStyle` moves focus onto the options.
	 * @default false
	 */
	virtualize?: boolean;

	/**
	 * Height in pixels assumed for options that have not been measured yet, used while virtualizing.
	 * Real heights are measured as options appear, so this only affects the initial scroll height.
	 * @default 24
	 */
	estimatedItemHeight?: number;

	/**
	 * Height in pixels assumed for section headers that have not been measured yet, used while
	 * virtualizing. Defaults to {@link estimatedItemHeight}, which is the closer guess of the two for
	 * a header rendered like a single-line option.
	 */
	estimatedSectionHeight?: number;

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
	labelRenderer?(item: DropDownItem<T>): ReactNode;

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
	onMouseDown?(item: DropDownItem<T>, event: MouseEvent<HTMLElement>): void;

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
	onPreselectedItemChange?(preselectedItem: DropDownItem<T> | undefined): void;

	/**
	 * Trigger when the pre-selected link is changed.
	 * For example, when pressing up/down arrow key.
	 */
	onPreselectedLinkChange?(preselectedLinkPosition: number | undefined): void;

	/**
	 * Trigger when the selected item is changed - clicking/press Enter on an item.
	 *
	 * Fires for the toggled option while {@link selectionMode} is `"multiple"` as well; the resulting
	 * selection is reported by {@link onSelectionChange}.
	 */
	onSelectedItemChange?(selectedItem: DropDownItem<T> | undefined): void;

	/**
	 * Trigger when the selection is changed while {@link selectionMode} is `"multiple"`.
	 * @param selectedItems - the options that are selected now
	 * @param toggledItem - the option that was just selected or deselected
	 * @param event - the click or key event that toggled it
	 */
	onSelectionChange?(
		selectedItems: DropDownItem<T>[],
		toggledItem: DropDownItem<T>,
		event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
	): void;

	/**
	 * Handle event when an item is selected by mouse.
	 *
	 * @deprecated from 29.0.0. Use {@link onSelectedItemChange} instead.
	 */
	onClick?(item: DropDownItem<T>, event: MouseEvent<HTMLElement>): void;
}

/**
 * DropDownItem definition inside of {@link DropDownProps}.
 *
 * @typeParam T - type of the value carried in {@link DropDownItem.data}
 */
export interface DropDownItem<T = unknown> extends Styleable, Identifiable {
	/**
	 * Label of dropdown item.
	 */
	label: string;

	/**
	 * The value this option stands for in the calling code, handed back untouched by every callback
	 * that reports an option.
	 *
	 * Saves mapping the list's options back onto your own model by label or id — which is what makes
	 * options with equal labels ambiguous.
	 */
	data?: T;

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
	children?: DropDownItem<T>[];

	/**
	 * Whether a dropdown item should be disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether a dropdown item should be selected.
	 */
	selected?: boolean;

	/**
	 * Whether the option stands for a selection that is only partly made — a "select all" option while
	 * some of the options below it are selected, for instance.
	 *
	 * Only has an effect while {@link DropDownProps.selectionMode} is `"multiple"`, where it makes the
	 * option's checkbox show the mixed state instead of a plain check mark.
	 */
	indeterminate?: boolean;

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
	 *
	 * Not needed for a multi-select list: with {@link DropDownProps.selectionMode} set to `"multiple"`
	 * every option states its own selection through `aria-selected`, and mirrors it in `aria-checked`
	 * unless this says otherwise. The mirror is there for the callers that used to render the
	 * checkboxes themselves and is deprecated — read `aria-selected`.
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
