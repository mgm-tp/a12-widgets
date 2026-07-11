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
 * The text-field widget wraps the HTML input element and provides more functionality
 * such as tooltips, icon and action buttons.
 * It has no intrinsic state.
 * @module
 */

import type { ReactNode, KeyboardEvent, RefCallback, HTMLProps, MouseEvent, InputEventHandler } from "react";

import type { Identifiable, Styleable } from "../../../../common/main/base-props.js";
import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../../base/template/base.tpl.api.js";

export interface TextFieldProps
	extends Omit<BaseInputProps, "breakTooltipsToNewLine">, BaseInputEventHandler<HTMLInputElement>, InputDOMProps {
	/**
	 * Value of the input.
	 */
	value?: string;

	/**
	 * Specifies the placeholder that is shown in the input when it's empty.
	 */
	placeholder?: string;

	/**
	 * Specifies whether autocomplete is enabled.
	 */
	autoComplete?: string;

	/**
	 * Specifies whether spellCheck is enabled.
	 */
	spellCheck?: boolean;

	/**
	 * Specifies the text alignment.
	 * @default left
	 */
	textAlignment?: "left" | "right";

	/**
	 * Specifies the prefixes that will be placed in front of the html-input.
	 */
	prefixes?: ReactNode | ReactNode[];

	/**
	 * Specifies the suffixes that will be placed at the end of the html-input.
	 */
	suffixes?: ReactNode | ReactNode[];

	/**
	 * Specifies the addons that will be placed before the input wrapper.
	 */
	addonBefore?: ReactNode | ReactNode[];

	/**
	 * Specifies the addons that will be placed after the input wrapper.
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * Specifies whether the input should automatically get focus after rendering.
	 * @default false
	 */
	autoFocus?: boolean;

	/**
	 * Specifies the role attribute for the input wrapper, in order to support Accessibility.
	 * @see [Roles]{@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles}
	 */
	role?: string;

	/**
	 * The key down handler for the input.
	 */
	onKeyDown?(ev: KeyboardEvent<HTMLInputElement>): void;

	/**
	 * The key up handler for the input.
	 */
	onKeyUp?(ev: KeyboardEvent<HTMLInputElement>): void;

	/**
	 * The reference of the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * The reference of the input wrapper.
	 */
	inputWrapperRef?: RefCallback<HTMLDivElement>;

	/**
	 * The reference of the label.
	 */
	labelRef?: RefCallback<HTMLLabelElement>;

	/**
	 * The reference of the helper text.
	 */
	helperTextRef?: RefCallback<HTMLDivElement>;

	/**
	 * Additional non-standard props that will be added to the real HTML Input Element.
	 */
	customInputProps?: CustomInputProps;

	/**
	 * Additional props that will be placed at the Wrapper of the real HTML Input Element.
	 */
	customInputWrapperProps?: Omit<HTMLProps<HTMLDivElement>, "ref" | "as">;

	/**
	 * The handler that will be invoked when the input field is clicked twice.
	 */
	onDoubleClick?(event: MouseEvent<HTMLInputElement>): void;

	/**
	 * The click handler for the input field.
	 */
	onClick?(event: MouseEvent): void;

	/**
	 * The input event is fired when the value has been changed.
	 */
	onInput?: InputEventHandler<HTMLInputElement>;

	/**
	 * A callback will be triggered when the input wrapper has been clicked.
	 */
	onWrapperClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse down handler for the input wrapper.
	 */
	onWrapperMouseDown?(event: MouseEvent<HTMLElement>): void;

	/**
	 * The key down handler for the input wrapper.
	 */
	onWrapperKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * The key press handler for the input wrapper.
	 */
	onWrapperKeyPress?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * @internal
	 * @default false
	 * Specifies whether hidden text should be shown to screen readers or not.
	 */
	showHiddenText?: boolean;
}

interface CustomInputProps {
	/**
	 * Determines if the virtual keyboard should be shown. It accepts two values: auto and manual.
	 *  "auto" causes the editable input to automatically show the VK when it is focused or tapped (current behavior)
	 *  "manual" prevents the default handling of the VK in a browser and needs to be handled by the script
	 */
	virtualKeyboardPolicy?: "auto" | "manual";
}

export interface TextAffixProps extends Identifiable, Styleable {
	/**
	 * The component's content.
	 */
	children: string;

	/**
	 * If true, the content will be truncated when it's too long.
	 */
	truncate?: boolean;
}
