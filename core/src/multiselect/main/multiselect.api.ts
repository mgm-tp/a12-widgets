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

import type { ReactNode, RefCallback, RefObject, ChangeEvent, MouseEvent } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";
import type { InputDOMProps } from "../../input/base/template/base.tpl.api.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";

export interface MultiselectProps extends Styleable, Identifiable, InputDOMProps {
	/**
	 * The items that will be available as options inside the Multiselect dropdown.
	 */
	items: MultiselectProps.Items;

	/**
	 * Label for the Multiselect input.
	 */
	label?: ReactNode;

	/**
	 * Can be used in conjunction with the label prop to hide the label while still following accessibility best practices.
	 *
	 * @default false
	 */
	hideLabel?: boolean;

	/**
	 * Additional element will be shown on the left of the label of Multiselect.
	 */
	labelGraphic?: ReactNode;

	/**
	 * Whether the Multiselect should be readonly.
	 */
	readonly?: boolean;

	/**
	 * Whether the Multiselect should be disabled.
	 */
	disabled?: boolean;

	/**
	 * The placeholder text for the input that will be displayed if no values are selected.
	 */
	placeholder?: string;

	/**
	 * Informational text displayed above the Multiselect items when the Multiselect is open.
	 */
	hintTemplate?: string;

	/**
	 * Text that displays inside the 'select all items' option.
	 */
	selectAllText?: string;

	/**
	 * Specifies whether the select all items option is shown in the dropdown.
	 * @default true
	 */
	enableSelectAllOption?: boolean;

	/**
	 * If set to true, the Multiselect will appear as a modal while selecting options.
	 */
	mobile?: boolean;

	/**
	 * The title for the Multiselect modal if the 'mobile' prop is set to true.
	 */
	mobileHeadingTitle?: ReactNode;

	/**
	 * Can be used to provide additional information that will display under the input.
	 */
	helperText?: ReactNode;

	/**
	 * Handles grouping selected and unselected items to different groups.
	 */
	groupingHandler?: MultiselectProps.GroupingHandler;

	/**
	 * Handles sorting items.
	 *
	 * @default alphanumerical
	 */
	sortingHandler?: MultiselectProps.SortingHandler;

	/**
	 * Handles filtering items when the user types on the input.
	 *
	 * @default compare not case sensitive.
	 */
	filteringHandler?: MultiselectProps.FilteringHandler;

	/**
	 * Handles joining selected items to show on the input.
	 *
	 * @default selections are displayed in the input as comma-separated list.
	 */
	joiningHandler?: MultiselectProps.JoiningHandler;

	/**
	 * Additional Tooltip for the input widget.
	 */
	tooltips?: ReactNode;

	/**
	 * Break tooltips in new line or not.
	 * @default false
	 */
	breakTooltipsToNewLine?: boolean;

	/**
	 * The error message(s) that will be shown in the text-line error message.
	 */
	errorMessage?: ReactNode;

	/**
	 * The warning message(s) that will be shown in the text-line warning message.
	 */
	warningMessage?: ReactNode;

	/**
	 * The info message(s) that will be shown in the text-line warning message.
	 */
	infoMessage?: ReactNode;

	/**
	 * aria-describedby attribute for input
	 */
	ariaDescribedby?: string;

	/**
	 * Whether the list of items should open when focusing the input.
	 * @default true
	 */
	openOnFocus?: boolean;

	/**
	 * The reference of the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement> | RefObject<HTMLInputElement>;

	/**
	 * Handler function when a Multiselect dropdown item checkbox is checked/unchecked.
	 */
	onItemCheck?(value: boolean, item: MultiselectProps.Item, event: ChangeEvent<HTMLInputElement>): void;

	/**
	 * Handler function when a Multiselect dropdown item is clicked.
	 */
	onItemClick?(item: MultiselectProps.Item, event?: MouseEvent): void;

	/**
	 * Handler function when the value of the input is changed.
	 */
	onChange?(selectedItems: MultiselectProps.Item[]): void;
}

export namespace MultiselectProps {
	export type Items = MultiselectProps.Item[] | MultiselectProps.ItemGroup;
	export interface ItemGroup {
		/**
		 * An array of the items that are currently selected.
		 */
		selectedItems: Item[];

		/**
		 * An array of the items that are currently NOT selected.
		 */
		unselectedItems: Item[];
	}
	export interface Item extends DropDownItem {
		id: string;
		label: string;
		selected?: boolean;
	}
	export type GroupingHandler = (
		items: MultiselectProps.Items,
		selectedItems: MultiselectProps.Item[]
	) => MultiselectProps.ItemGroup;
	export type SortingHandler = (items: MultiselectProps.Items) => MultiselectProps.Items;
	export type FilteringHandler = (searchText: string, items: MultiselectProps.Items) => MultiselectProps.Items;
	export type JoiningHandler = (
		selectedItems: MultiselectProps.Item[],
		items: MultiselectProps.Items,
		dropdownClosed: boolean
	) => string;
}
