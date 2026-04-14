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

import type { Orientation } from "../../../common/main/alignment.js";

import type { ConnectedToastTemplateProps } from "./template/connected-toast.template.api.js";

export type ConnectedToastType = "temporary" | "permanent";
export interface ConnectedToastProps extends ConnectedToastTemplateProps {
	/**
	 * Duration until timeout
	 * @default 2000
	 *
	 * *Note:* Only works if the {@link type} is "temporary" and {@link onClose} callback is provided.
	 */
	duration?: number;

	/**
	 * The toast will anchor to this reference element.
	 */
	referenceElement: HTMLElement;

	/**
	 * Orientation of toast when anchor to {@link referenceElement}.
	 */
	orientation?: Orientation;

	/**
	 * Whether the toast should be focused automatically when it is opened.
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * If the position of the referenceElement changes then the connected toast closes.
	 * @default true
	 */
	hideOnReferenceElementPositionChange?: boolean;

	/**
	 * Clicking outside will close the portal.
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Specifies if the connected toast is permanent or temporary
	 *
	 * - "temporary": Automatically invokes the {@link onClose} callback after the specified {@link duration}.
	 * - "permanent": Remains visible until explicitly closed by the user or programmatically.
	 * @default "temporary"
	 */
	type?: ConnectedToastType;

	/**
	 * Invoked when the toast is closed
	 *
	 * *Note:* This handler is required when {@link type} is "temporary" with a {@link duration}.
	 */
	onClose?(): void;
}
