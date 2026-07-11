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
 * This select (input) widget wraps the HTML select element and provide more functionality
 * such as tooltips, label and error message.
 * @module
 */

import type { RefCallback, HTMLProps, ReactNode } from "react";

import type { DataRole } from "../../../common/main/base-props.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../base/template/base.tpl.api.js";

/**
 * The props of Select.
 */
export interface SelectProps<T extends HTMLElement = HTMLSelectElement>
	extends BaseInputProps, DataRole, Omit<BaseInputEventHandler<HTMLElement>, "onChange">, InputDOMProps<T> {
	/**
	 * The current selected value.
	 */
	value?: string;

	/**
	 * Text that will be displayed if no value is selected.
	 */
	placeholder?: string;

	/**
	 * The reference element of:
	 * - The select input on Desktop
	 * - The select wrapper element on Mobile.
	 */
	selectRef?: RefCallback<HTMLSelectElement | HTMLElement>;

	/**
	 * Trigger when an item's state is changed.
	 */
	onValueChanged?(value: string): void;

	/**
	 * An array of options to use when the select is customized
	 */
	items: SelectItem[];

	/**
	 * Render a custom HTML structure instead of the native browser select tag.
	 * The custom structure is a combination of the Tag Input and other widgets to demonstrate the select component.
	 */
	useCustomView?: boolean;

	/**
	 * Additional props that will be placed at the real HTML Input Element.
	 * Use this prop when {@link useCustomView} is true.
	 */
	customInputProps?: HTMLProps<HTMLInputElement>;

	/**
	 * Whether the items will display in horizontal or not.
	 * This property only work with customized select.
	 */
	horizontalMode?: boolean;
}

/**
 * The props of Custom Select.
 */
export interface CustomSelectProps extends Omit<SelectProps<HTMLInputElement>, "customInputProps" | "useCustomView"> {
	/**
	 * Whether the list of items would be opened when focusing the input.
	 * @default false
	 */
	openOnFocus?: boolean;

	/**
	 * The id for the select wrapper element.
	 */
	selectWrapperId?: string;

	/**
	 * The reference element of the select wrapper element inside the Modal on Mobile.
	 */
	selectWrapperInModalRef?: RefCallback<HTMLElement>;

	/**
	 * Focus back on the input when the list of item is closed.
	 * When this prop is set to false, the focus will be lost after select an item or close the modal is closed on mobile devices.
	 * To handle focus when the list of item is closed, you can use:
	 * - On desktop: onSelect
	 * - On Mobile: {@link onModalClose}
	 *
	 * @default true
	 */
	focusBack?: boolean;

	/**
	 * Custom keys to open the modal on mobile or the dropdown on desktop.
	 * The default keys will be overridden if this property is defined.
	 * @default ["Space", "Arrow Down", "Arrow Up", "Enter"]
	 */
	keysToOpen?: string[];

	/**
	 * Custom keys to close the modal on mobile or the dropdown on desktop.
	 * The default keys will be overridden if this property is defined.
	 * @default mobile: ["ESC"], desktop: ["ESC", "TAB"]
	 */
	keysToClose?: string[];

	/**
	 * Custom props for the modal on mobile.
	 * @default true
	 */
	modalProps?: {
		/**
		 * If true, the modal on mobile will be fullscreen.
		 * @default true
		 */
		fullscreen?: boolean;

		/**
		 * If true, the modal on mobile will not have gutter.
		 * @default true
		 */
		noGutter?: boolean;
	};

	/**
	 * Specifies whether the prefix is shown in the input.
	 * @default true
	 */
	showPrefixes?: boolean;

	/**
	 * A callback function that will be triggered on desktop when the visibility of the Custom Select's dropdown changes.
	 * @param isDropdownVisible – true if the dropdown is currently being shown, otherwise false.
	 */
	onVisibilityChange?(isDropdownVisible: boolean): void;

	/**
	 * Trigger an onSelect even when a selection is made, additionally to the onChange event, doesn't matter if selection has changed or not
	 * This function will be fired in case the select is customized
	 */
	onSelect?(value: string): void;

	/**
	 * Callback when the modal is closed.
	 */
	onModalClose?(): void;

	/**
	 * Callback when the modal is opened.
	 */
	onModalOpen?(): void;

	/**
	 * Custom function to render custom label.
	 * This allows for flexible rendering of rich content label inside both select input and dropdown items.
	 *
	 * @param item - The dropdown item being rendered
	 * @returns ReactNode to be rendered as the label
	 */
	labelRenderer?(item: DropDownItem): ReactNode;
}

/**
 * The props of native HTML select element.
 */
export type NativeSelectProps = Omit<SelectProps, "customInputProps" | "useCustomView">;

export interface SelectItem
	extends
		Pick<DropDownItem, "label" | "value" | "children" | "disabled" | "id" | "graphic" | "isEmptyValue">,
		DataRole {}
