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

import type { MouseEvent, ChangeEvent, RefCallback, ReactNode, FocusEvent, KeyboardEvent } from "react";

import type { Ref } from "../../common/main/base-props.js";
import type { InputDOMProps } from "../../input/base/template/base.tpl.api.js";
import type { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";

import type { MultiselectProps } from "./multiselect.api.js";

export interface MultiselectTplProps
	extends
		Ref<HTMLDivElement>,
		Pick<
			MultiselectProps,
			Exclude<
				keyof MultiselectProps,
				"hintTemplate" | "groupingHandler" | "sortingHandler" | "onChange" | "mobileHeadingTitle"
			>
		>,
		InputDOMProps {
	selectedCount?: number;
	showDropdown?: boolean;
	inputValue?: string;
	hint?: string;
	showClearButton?: boolean;

	onClearButtonClick?(event: MouseEvent): void;
	onSelectAllCheck?(checked: boolean, event: ChangeEvent<HTMLInputElement>): void;
	onClick?(event: MouseEvent): void;

	/**
	 * Trigger when the pre-selected item is changed.
	 */
	onPreselectedItemChange?(preSelectedItem: MultiselectProps.Item | undefined): void;

	/**
	 * Trigger when the selected item is changed - clicking/press Enter on an item.
	 */
	onSelectedItemChange?(selectedItem: MultiselectProps.Item | undefined): void;

	/**
	 * Get the instance of Dropdown.
	 * @param instance – the Dropdown component instance.
	 */
	dropdownInstance?: RefCallback<DropDown>;

	/**
	 * The container for dropdown.
	 * @param content – dropdown itself which will be rendered inside the container.
	 */
	dropdownContainer?(content: ReactNode): ReactNode | false;

	/**
	 * Specifies whether the select all items option is shown in the dropdown.
	 */
	enableSelectAllOption?: boolean;

	dropdownRef?: RefCallback<HTMLDivElement>;
	inputRef?: RefCallback<HTMLInputElement>;
	inputWrapperRef?: RefCallback<HTMLDivElement>;
	helperTextRef?: RefCallback<HTMLDivElement>;
	labelRef?: RefCallback<HTMLLabelElement>;
	clearButtonRef?: RefCallback<HTMLButtonElement>;
	onFocus?(event: FocusEvent): void;
	onBlur?(event: FocusEvent): void;
	onChange?(ev: ChangeEvent<HTMLInputElement>): void;
	onKeyDown?(ev: KeyboardEvent<HTMLElement>): void;
	onInputWrapperMouseDown?(event: MouseEvent<HTMLElement>): void;
	onInputWrapperClick?(event: MouseEvent<HTMLElement>): void;
	onDropdownKeyDown?(event: KeyboardEvent<HTMLElement>): void;
	onDropdownIconClick?(event: MouseEvent<HTMLElement>): void;
}
