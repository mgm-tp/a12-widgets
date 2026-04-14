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
 * This widget allow you to create a container to help you use screen space more effectively and reduce screen clutter.
 * @module
 */

import type { ResizeAndDragContainerProps } from "../../resize-and-drag-container/main/resize-and-drag-container.api.js";
import type { Orientation } from "../../common/main/alignment.js";

import type { CalloutTplProps } from "./template/callout.tpl.api.js";

export interface CalloutProps extends Omit<CalloutTplProps, "resizeAndDrag"> {
	/**
	 * The callout will anchor to this reference element.
	 */
	referenceElement: HTMLElement;

	/**
	 * A DOMRect object provides information about the trigger element's size and its position relative to the viewport.
	 * It is useful for recalculating the orientation of the Attached Portal when the reference element is overlapped by other elements.
	 */
	referenceElementRect?: DOMRect;

	/**
	 * Clicking outside will close the portal.
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Press Esc key will close the portal.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * Clicking the {@link referenceElement} will close the portal.
	 * @default true
	 */
	closeOnClickReferenceElement?: boolean;

	/**
	 * Aligns the container to the {@link referenceElement} upon the initial mounting process.
	 */
	orientationList?: Orientation[];

	/**
	 * If this prop is set to true, the Callout will initially expand to be the same width as the Contentbox's content area.
	 *
	 * *Note:* This property only works when {@link resizeAndDragOptions} is enabled.
	 */
	boundToContentbox?: boolean;

	/**
	 * Props of Resize and Drag Container
	 *
	 * *Note:* The Resize and Drag Container currently doesn't support phone devices.
	 */
	resizeAndDragOptions?: CalloutWithResizeAndDragProps;

	/**
	 * The function will be fired when close the container.
	 */
	onClose?(): void;

	/**
	 * @internal
	 * Min height of the callout.
	 */
	minHeight?: number;
}

export type CalloutWithResizeAndDragProps = Omit<ResizeAndDragContainerProps, "orientationList">;
