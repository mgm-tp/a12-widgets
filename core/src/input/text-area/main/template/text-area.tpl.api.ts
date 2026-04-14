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
 * This text-area-stateless (input) widget wraps the HTML input element and provide more functionality
 * such as tooltips, label and error message.
 * It has no intrinsic state.
 * @module
 */

import type {
	CSSProperties,
	ReactNode,
	RefCallback,
	MouseEvent,
	KeyboardEvent,
	ChangeEvent,
	HTMLAttributes
} from "react";

import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../../base/template/base.tpl.api.js";

export interface TextAreaStatelessProps
	extends
		Omit<BaseInputProps, "breakTooltipsToNewLine">,
		BaseInputEventHandler<HTMLTextAreaElement>,
		InputDOMProps<HTMLTextAreaElement> {
	/**
	 * Value of the input.
	 */
	value?: string;

	/**
	 * Specifies the placeholder that is shown in the input when it's empty.
	 */
	placeholder?: string;

	/**
	 * Specifies the text alignment.
	 * @default left
	 */
	textAlignment?: "left" | "right";

	/**
	 * Allows the input's height to expand when the text gets longer.
	 */
	autoExpand?: boolean;

	/**
	 * Specifies styling for the wrapper.
	 */
	wrapperStyle?: CSSProperties;

	/**
	 * @internal
	 * The role of the wrapper to support the accessibility.
	 */
	wrapperRole?: string;

	/**
	 * Prefixes that will be placed in front of the html-input.
	 */
	prefixes?: ReactNode | ReactNode[];

	/**
	 * Suffixes that will be placed at the end of the html-input.
	 */
	suffixes?: ReactNode | ReactNode[];

	/**
	 * Addons that will be placed before the input wrapper.
	 */
	addonBefore?: ReactNode | ReactNode[];

	/**
	 * Addons that will be placed after the input wrapper.
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * Specifies whether the input should automatically get focus after rendering.
	 * @default false
	 */
	autoFocus?: boolean;

	/**
	 * A callback will be triggered when the input's height has been changed.
	 * *Note:* It works when {@link autoExpand} is enabled.
	 */
	onHeightChanged?(inputRef: HTMLTextAreaElement, newHeight: number): void;

	/**
	 * The reference of the input field.
	 */
	inputRef?: RefCallback<HTMLTextAreaElement>;

	/**
	 * The reference of the input wrapper.
	 */
	inputWrapperRef?: RefCallback<HTMLDivElement>;

	/**
	 * The event will be invoked when the real textarea has been clicked.
	 */
	onClick?(event: MouseEvent): void;

	/**
	 * The key down handler for the input.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLTextAreaElement>): void;

	/**
	 * The input event is fired when the value has been changed.
	 */
	onInput?(event: ChangeEvent<HTMLTextAreaElement>): void;

	/**
	 * The role attribute for the input wrapper, in order to support Accessibility.
	 */
	role?: string;

	/**
	 * The aria-autocomplete attribute for the input, in order to support Accessibility.
	 */
	ariaAutocomplete?: "inline" | "list" | "both" | "none";

	/**
	 * The aria-haspopup attribute for the input, in order to support Accessibility.
	 */
	ariaHaspopup?: "true" | "false" | "menu" | "listbox" | "tree" | "grid" | "dialog";

	/**
	 * The aria-expanded attribute for the input, in order to support Accessibility.
	 */
	ariaExpanded?: boolean;

	/**
	 * The aria-owns attribute for the input, in order to support Accessibility.
	 */
	ariaOwns?: string;

	/**
	 * @deprecated since 30.0.0
	 */
	ariaBusy?: boolean;

	/**
	 * The aria-activedescendant attribute for the input, in order to support Accessibility.
	 */
	ariaActivedescendant?: string;

	/**
	 * Specifies the HTML properties for the textarea wrapper.
	 */
	inputWrapperProps?: HTMLAttributes<HTMLDivElement>;

	/**
	 * @internal
	 * @default false
	 * Specifies whether hidden text should be shown to screen readers or not.
	 */
	showHiddenText?: boolean;
}
