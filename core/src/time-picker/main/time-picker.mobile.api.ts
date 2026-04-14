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

import type { ReactNode, HTMLAttributes } from "react";

import type { Ref } from "../../common/main/base-props.js";

import type { TimePickerBaseProps, TimePickerProps } from "./time-picker.api.js";

export interface TimePickerDialogProps extends TimePickerBaseProps, Ref {
	/**
	 * Callback that is called when the ok button is clicked.
	 */
	onOkClick?(): void;

	/**
	 * Callback that is called when the clear button is clicked.
	 */
	onClearClick?(): void;

	/**
	 * Callback that is called when the Time Picker Dialog is closed.
	 */
	onClose?(): void;

	/**
	 * @internal
	 * Additional HTML attributes to be applied to the Time Picker Dialog.
	 */
	pickerAttributes?: HTMLAttributes<HTMLDivElement>;
}

export interface PickerProps extends Omit<TimePickerBaseProps, "clearLabel" | "okLabel"> {
	/**
	 * Initial screen of TimePickerDialog Picker
	 */
	initialScreen?: TimePickerProps.Screen;

	/**
	 * Display date value of datePicker
	 */
	dateDisplay?: ReactNode;

	/**
	 * Trigger when the screen of TimePickerDialog Picker is changed.
	 */
	onScreenChange?(screen: TimePickerProps.Screen): void;
}
