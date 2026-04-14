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
 * This radio (input) widget wraps the HTML radio elements in a group and provide more functionality
 * such as tooltips, label and error message.
 * @module
 */

import type { RefCallback, RefObject, HTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

import type { Container, Identifiable, Styleable } from "../../../common/main/base-props.js";
import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../base/template/base.tpl.api.js";

/**
 * The props of Radio.
 */
export interface RadioProps extends BaseInputProps, Container {
	/**
	 * If the widget should be rendered inline.
	 */
	inline?: boolean;

	/**
	 * Item's value that being selected.
	 */
	value?: string;

	/**
	 * Item's name support default keyboard accessibility of browsers.
	 * If not provided, the id will be used
	 */
	name?: string;

	/**
	 * The reference of the group wrapper.
	 */
	wrapperRef?: RefCallback<HTMLDivElement> | RefObject<HTMLDivElement>;

	/**
	 * Pass HTML properties into the span.field__group, which wraps all radio items.
	 *
	 * E.g. `{ ["aria-required"]: true }`
	 */
	groupDOMProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

	/**
	 * Trigger when a selection is changed.
	 */
	onValueChanged?(value: string): void;
}

/**
 * The props of Radio Item.
 */
export interface RadioItemProps
	extends Identifiable, Styleable, BaseInputEventHandler<HTMLInputElement>, InputDOMProps {
	/**
	 * Label for the input.
	 */
	label: ReactNode;

	/**
	 * Value of the input.
	 */
	value: string;

	/**
	 * Whether the input is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the input is readonly.
	 */
	readonly?: boolean;

	/**
	 * The name of the input.
	 */
	name?: string;

	/**
	 * Whether the input is in an error state (this will change the styling of the input).
	 */
	error?: boolean;

	/**
	 * Whether the input is in a warning state (this will change the styling of the input).
	 */
	warning?: boolean;

	/**
	 * Whether the input is in an info state (this will change the styling of the input).
	 */
	info?: boolean;

	/**
	 * The tabindex attribute that will be assigned.
	 */
	tabIndex?: number;

	/**
	 * The aria-describedby attribute for the input.
	 */
	ariaDescribedby?: string;

	/**
	 * The ref of the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * @internal
	 */
	selected?: boolean;
}
