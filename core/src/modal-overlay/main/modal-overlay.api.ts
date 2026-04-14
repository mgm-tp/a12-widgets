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
 * A modal will display on screen as a dialog.
 * The current page is blocked for changes if the dialog box is displayed.
 * User can provide a message and buttons with custom callback functions.
 */

import type { HTMLAttributes as ReactHTMLAttributes } from "react";

import type { Container, Styleable, Identifiable, Ref, HTMLAttributes } from "../../common/main/base-props.js";

export interface ModalOverlayProps extends Container, Styleable, Identifiable, Ref<HTMLDivElement>, HTMLAttributes {
	/**
	 * If true, the modal overlay can be closed by the key ESC key.
	 *
	 * @default true
	 * @requires {@link onClose}
	 */
	closeOnEsc?: boolean;

	/**
	 * If true, the modal overlay can be closed by clicking outside.
	 *
	 *  @requires {@link onClose}
	 *
	 * *Note:* This option can cause issues when used with other modals or portals (e.g. DatePicker).
	 * This is because clicking inside them will be treated as clicking outside of this modal, causing it to close.
	 * In such cases, set this option to false.
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * If true, the modal overlay will be fullscreen.
	 */
	fullscreen?: boolean;

	/**
	 * If true, the modal overlay will not have gutter.
	 * @default false
	 */
	noGutter?: boolean;

	/**
	 * If true, the modal overlay will prevent the scroll event.
	 */
	preventScroll?: boolean;

	/**
	 * Focus back to the trigger element when the modal is closed.
	 *
	 * @default true
	 */
	focusBack?: boolean;

	/**
	 * Set the maximum width of the modal overlay.
	 * Either a number of pixels or a string (for example "70%") can be applied.
	 */
	maxWidth?: number | string;

	/**
	 * Focus on the modal container when it is opened.
	 *
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * Whether the modal should be displayed within the parent.
	 * @default false
	 */
	fitToParent?: boolean;

	/**
	 * Additional HTML attributes for the modal container.
	 */
	containerAttributes?: ReactHTMLAttributes<HTMLDivElement>;

	/**
	 * This callback triggered to close the modal.
	 *
	 * *Note:* Required when using {@link closeOnEsc} or {@link closeOnOutsideClick}.
	 */
	onClose?(): void;

	/**
	 * This callback is called if the modal overlay opens.
	 */
	onOpen?(): void;
}
