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

import type { ReactNode, ChangeEvent } from "react";

import type { Container } from "../../../common/main/base-props.js";
import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../base/template/base.tpl.api.js";

export type SwitchLabelPosition = "top" | "left" | "right" | "bottom";

export interface SwitchProps
	extends
		Omit<BaseInputProps, "breakTooltipsToNewLine">,
		Omit<BaseInputEventHandler<HTMLInputElement>, "onChange">,
		InputDOMProps,
		Container {
	/**
	 * Switch state
	 * @default false
	 */
	checked?: boolean;

	/**
	 * Set unchecked option label
	 */
	uncheckedOption?: ReactNode;

	/**
	 * Set checked option label
	 */
	checkedOption?: ReactNode;

	/**
	 * Hide options
	 * @default false
	 */
	hideOptions?: boolean;

	/**
	 * Specifies addons will be placed after the switch
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * Handler function when the switch is changed.
	 */
	onChange(value: boolean, event: ChangeEvent<HTMLInputElement>): void;

	/**
	 * Specifies the position of the label relative to the switch control.
	 *
	 * @default "top"
	 */
	labelPosition?: SwitchLabelPosition;

	/**
	 * Specifies the icon displayed inside the thumb when the switch is checked.
	 *
	 * @default <Icon>check</Icon>
	 */
	checkedIcon?: ReactNode;

	/**
	 * Specifies the icon displayed inside the thumb when the switch is unchecked.
	 *
	 * @default <Icon>remove</Icon>
	 */
	uncheckedIcon?: ReactNode;
}
