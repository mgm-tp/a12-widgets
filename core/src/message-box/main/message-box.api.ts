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
 * This message box widget can be used to show a message to user,
 * the box can include a general message and additional content.
 * In the future this can be extended to show any kind of message.
 * @module
 */

import type { ReactNode } from "react";

import type { Container, Identifiable, Styleable } from "../../common/main/base-props.js";

/**
 * The props of MessageBox.
 */
export interface MessageBoxProps extends Styleable, Identifiable, Container {
	/**
	 * The message to be shown at the top of the MessageBox.
	 */
	label?: ReactNode;

	/**
	 * The icon to be shown before the label. Useful to place an error or warning icon.
	 */
	icon?: ReactNode;

	/**
	 * Useful to place a button on the right of the MessageBox that show/hide the content.
	 */
	action?: ReactNode;

	/**
	 * Variant of message box.
	 * @default "error"
	 */
	variant?: MessageBoxVariant;

	/**
	 * Set invisible focus on the message when it has finished rendering to support A11Y
	 * In case of multiple boxes, to make sure there is only 1 box has focused, set this to "false" for the others.
	 * @default true
	 */
	focusOnMessage?: boolean;
}

/**
 * The visual style variant for message boxes.
 */
export type MessageBoxVariant = "info" | "success" | "warning" | "error";
