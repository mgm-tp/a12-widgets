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
 * This module contains basic functionality for input widgets.
 * It has no intrinsic state.
 * @module
 */

import type { ReactNode, ChangeEvent, FocusEvent, MouseEvent, KeyboardEvent, HTMLProps } from "react";

import type { Identifiable, Ref, Styleable, DataRole, Container } from "../../../common/main/base-props.js";

export interface BaseInputProps extends Identifiable, Styleable {
	/**
	 * The input widget's label.
	 */
	label?: ReactNode;

	/**
	 * Visually hides the label while keeping it accessible to screen readers.
	 * Requires a {@link label} to be provided. The label text will still be announced by assistive technologies.
	 * @default false
	 */
	hideLabel?: boolean;

	/**
	 * Additional element that will be shown on the left of the input's label.
	 */
	labelGraphic?: ReactNode;

	/**
	 * Additional element that will be shown as the Error message for the input.
	 */
	errorMessage?: ReactNode;

	/**
	 * Additional element that will be shown as the Warning message for the input.
	 */
	warningMessage?: ReactNode;

	/**
	 * Additional element that will be shown as the Info message for the input.
	 */
	infoMessage?: ReactNode;

	/**
	 * Specifies whether the input is readonly.
	 */
	readonly?: boolean;

	/**
	 * Specifies whether the input is disabled.
	 */
	disabled?: boolean;

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
	 * Warning state for the input widget.
	 */
	warning?: boolean;

	/**
	 * Error state for the input widget.
	 */
	error?: boolean;

	/**
	 * Info state for the input widget.
	 */
	info?: boolean;

	/**
	 * Make input's width fits to parent's width.
	 * @default true
	 */
	fitToParent?: boolean;

	/**
	 * aria-describedby attribute for the input.
	 */
	ariaDescribedby?: string;

	/**
	 * Additional content displayed below the inputs.
	 */
	helperText?: ReactNode;
}

export interface BaseInputEventHandler<ElementType extends HTMLElement> {
	/**
	 * Handler function when the value of the input is changed.
	 */
	onChange?(ev: ChangeEvent<ElementType>): void;

	/**
	 * Handler function when the input is focused.
	 */
	onFocus?(ev: FocusEvent<ElementType>): void;

	/**
	 * Handler function when the input is blurred.
	 */
	onBlur?(ev: FocusEvent<ElementType>): void;
}

export interface LabelProps extends Identifiable, Styleable, Ref<HTMLLabelElement>, DataRole {
	/**
	 * Additional element that will be shown on the left of the label.
	 * @requires label
	 */
	graphic?: ReactNode;

	/**
	 * Custom element that will appear as a child of the label.
	 */
	label?: ReactNode;

	/**
	 * Visually hides the label while keeping it accessible to screen readers.
	 * Requires a {@link label} to be provided. The label text will still be announced by assistive technologies.
	 * @default false
	 */
	hide?: boolean;

	/**
	 * If set to true, the label will be styled as disabled.
	 */
	disabled?: boolean;

	/**
	 * Specifies the element the label should be associated with
	 */
	htmlFor?: string;

	/**
	 * Handler function when the label is clicked.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handler function for the onKeyDown event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;
}

export interface ErrorProps extends Identifiable, Styleable, DataRole, Ref<HTMLDivElement> {
	errorMessage?: ReactNode;
}

export interface WarningProps extends Identifiable, Styleable, DataRole, Ref<HTMLDivElement> {
	warningMessage?: ReactNode;
}

export interface InfoProps extends Identifiable, Styleable, DataRole, Ref<HTMLDivElement> {
	infoMessage?: ReactNode;
}

export interface SelectionSuffixProps extends Identifiable, Styleable, DataRole {
	disabled?: boolean;

	onClick?(event: MouseEvent<HTMLElement>): void;
}

export interface InputWrapperProps extends Identifiable, Styleable, DataRole, Container {}

export interface InputTooltipsProps {
	tooltips: ReactNode;

	/**
	 * Break tooltips in new line or not.
	 * @default false
	 */
	breakLine?: boolean;
}

export interface InputDOMProps<T extends HTMLElement = HTMLInputElement> {
	/**
	 * Additional props that will be placed at the real HTML Input Element.
	 */
	inputProps?: HTMLProps<T>;
}
