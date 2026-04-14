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
 * This buffered input widget acts as a decorator for input widgets,
 * adding buffered state to the wrapped widget.
 * Has no intrinsic rendering functionality, but passes this off to the wrapped widget.
 */

import type { RefCallback, RefObject, ChangeEvent, FocusEvent, KeyboardEvent } from "react";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

/**
 * The props of BufferedInput.
 */
export interface BufferedInputProps<ValueType> extends Styleable, Identifiable {
	/**
	 * Initial value of the buffered input.
	 */
	initialValue?: ValueType;

	/**
	 * If set to true, {@link onValueSubmit} will always be triggered whenever blur the input
	 * even if the value is not changed since the last submit.
	 */
	alwaysSubmit?: boolean;

	/**
	 * Called if the wrapped component signalled that it is finished.
	 */
	onValueSubmit(value?: ValueType): void;
}

/**
 * Props for component that provide stateless editing of a value.
 * The value can be of any type. The component
 * can signal an immediate change of the value as well as a completion of the current editing. For an HTML input
 * element, the changing event could be fired on change of a single character.
 */
export interface ImmediateInputProps<T> {
	/**
	 * Current value of the input.
	 */
	value?: T;

	/**
	 * Whether the input should be submitted when pressing ENTER key.
	 * The callback {@link onSubmit} will be triggered if this prop is `true`.
	 */
	submitOnEnter?: boolean;

	/**
	 * Is called if the input value is changed.
	 */
	onValueChange?(value: T): void;

	/**
	 * Is called if the input is done.
	 */
	onSubmit?(): void;

	/**
	 * The input's reference.
	 */
	inputRef?: RefCallback<HTMLInputElement | HTMLTextAreaElement> | RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export interface HTMLInputProps {
	value?: string;

	/** HTML change event of the underlying input. */
	onChange?(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;

	/** HTML blur event of the underlying input. */
	onBlur?(ev: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;

	/** HTML keydown event of the underlying input. */
	onKeyDown?(ev: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}
