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

import type { ReactNode } from "react";

import type { CommonToastProps } from "../../common/toast.common.api.js";

export interface ToastTemplateProps extends CommonToastProps {
	/**
	 * Header to display.
	 */
	header?: ReactNode;

	/**
	 * Footer to display.
	 */
	footer?: ReactNode;

	/**
	 * Define a fixed height for Toast Content
	 */
	contentHeight?: number;

	/**
	 * @internal
	 */
	shouldHideToastWhenAdding?: boolean;

	/**
	 * Set focus on the Toast when it has finished rendering
	 * @default true
	 */
	focusOnMount?: boolean;

	/**
	 * Define the aria-level of the Toast Title
	 * @default 2
	 * @internal
	 */
	ariaLevel?: number;

	/**
	 * Invoked when the toast is closed.
	 *
	 * *Note:* This handler is required when using a `temporary` toast with a {@link ToastProps.duration}.
	 */
	onClose?(): void;
}
