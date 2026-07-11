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
 * This autocomplete widget provide autocompletion for enumerated values. This widget combines the
 * TextField to provide the input functionality and DropDown for selection of values.
 * When user start typing, the first matching option will be pre-selected. The remaining characters of the first
 * matching option will be selected/highlighted.
 *
 * Option which start with the entered value is displayed first. There is also a hint of total number of options and
 * number of matched options.
 *
 * A delete button is provided so we can clear the text quickly, especially for touch devices.
 * @module
 */

import type { ReactNode, RefCallback } from "react";

import type { DropDownItem, SelectedItemPosition } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import type { Ref } from "../../../common/main/base-props.js";
import type { BaseInputProps, InputDOMProps } from "../../base/template/base.tpl.api.js";

export interface AutocompleteProps extends Omit<BaseInputProps, "fitToParent">, InputDOMProps, Ref<HTMLDivElement> {
	/**
	 * Uses the light color for background.
	 */
	lightBackground?: boolean;

	/**
	 * The template for the hint text.
	 * You need to provide placeholders for number of item shown and number of item
	 * in total, and it should follow this template: `"{count} of {total} options shown"`.
	 *
	 * If you want to not show the hint, just set its value to an empty string.
	 */
	hintTemplate: string;

	/**
	 * Placeholder text for the input of the Autocomplete.
	 */
	inputPlaceHolder?: string;

	/**
	 * An array of strings to use as the source of autocompletion.
	 */
	items: string[] | DropDownItem[];

	/**
	 * @deprecated. Will be removed in 33.0.0.
	 */
	searchResult?: string[] | DropDownItem[];

	/**
	 * The initial value for the input field that you want to make as pre-selected value.
	 * It should be an existing item from the source.
	 */
	initialValue?: string | DropDownItem;

	/**
	 * Initial position of the selected item.
	 * @default "bottom"
	 */
	selectedItemPosition?: SelectedItemPosition;

	/**
	 * The selected item of the autocomplete from outside.
	 */
	value?: string | DropDownItem;

	/**
	 * Specify whether the dropdown is displayed or not at the initial rendering.
	 */
	initiallyExpanded?: boolean;

	/**
	 * If caseSensitive is set, only existing items having a label written in corresponding case are selected.
	 */
	caseSensitive?: boolean;

	/**
	 * Allow the user to enter and submit a new value if set to true.
	 */
	allowAddingNewItem?: boolean;

	/**
	 * If true, the Progress Indicator is shown.
	 */
	loading?: boolean;

	/**
	 * Specifies whether the clear button is shown.
	 * @default true
	 */
	enableClearButton?: boolean;

	/**
	 * Label of the Progress Indicator.
	 */
	loadingLabel?: ReactNode;

	/**
	 * Links to be displayed on top of the dropdown items.
	 */
	links?: ReactNode[];

	/**
	 * Elements that get rendered before the select button, and after the clear button, if it gets rendered.
	 */
	suffixes?: ReactNode;

	/**
	 * Elements that get rendered at the beginning of input.
	 */
	prefixes?: ReactNode;

	/**
	 * Additional css class names which wrap items.
	 */
	itemsWrapperClassName?: string;

	/**
	 * The element to override the TextField which triggers open the autocomplete on mobile.
	 * @default TextField
	 */
	mobileTriggerElement?: ReactNode;

	/**
	 * aria-labelledby attribute for the dropdown content wrapper in case of extended autocomplete with grouped items.
	 * This attribute is defined to make screen readers read the label, validation messages or additional
	 * information (e.g: tooltip) of the autocomplete.
	 * @deprecated since 32.2.0, use {@link BaseInputProps.ariaDescribedby} instead
	 */
	ariaLabelledby?: string;

	/**
	 * Get ref of input inside autocomplete.
	 * @param ref – the input element reference.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * Whether the list of items would be opened when focusing the input.
	 * @default true
	 */
	openOnFocus?: boolean;

	/**
	 * To display element(s) at the bottom of the dropdown for extended functionality such as loading more items.
	 */
	dropdownFooter?: ReactNode;

	/**
	 * Function to call when selected item changed.
	 */
	onValueChange?(value: string | DropDownItem): void;

	/**
	 * A function is used to filter items by the given text.
	 * It should also be used in case the autocomplete contains grouped items.
	 *
	 * @param value – Text to be searched
	 */
	onSearch?(value: string): void;

	/**
	 * Returns a handler that is triggered right after the dropdown is closed.
	 */
	onDropdownClose?(): void;

	/**
	 * Returns a handler for closing the list of items and reset selected option.
	 * It's handy to use with {@link links} where the dropdown can be intentionally closed based on the user's needs
	 * @param handler – a callback to execute the close and reset operation.
	 */
	closeAndResetOption?(handler: () => void): void;
}
