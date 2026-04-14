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
 * This widget allow you to create a container for the comment's components.
 * @module
 */

import type { ReactNode } from "react";

import type { CalloutWithResizeAndDragProps } from "../../../callout/main/callout.api.js";
import type { CalloutHeaderProps } from "../../../callout/main/template/callout.tpl.api.js";
import type { Container, HTMLAttributes, Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";

export interface CommentContainerProps extends Styleable, Identifiable, Container, Ref<HTMLDivElement>, HTMLAttributes {
	/**
	 * The container's header.
	 * Recommend using {@link CalloutHeaderProps}
	 */
	header?: ReactNode | CalloutHeaderProps;

	/**
	 * The container's footer.
	 */
	footer?: ReactNode;

	/**
	 * Reference element that triggers opening/closing the container.
	 */
	referenceElement: HTMLElement;

	/**
	 * A DOMRect object provides information about the trigger element's size and its position relative to the viewport.
	 * It is useful for recalculating the orientation of the Attached Portal when the reference element is overlapped by other elements.
	 */
	referenceElementRect?: DOMRect;

	/**
	 * If true, the container will close when clicking the {@link referenceElement}.
	 * @default true
	 */
	closeOnClickReferenceElement?: boolean;

	/**
	 * If true, the container will close after clicking outside.
	 * @default `true` on desktop.
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * The function will be fired when closing the container.
	 */
	onClose?(): void;

	/**
	 * Min height of the comment container.
	 * @default 300(px)
	 */
	minHeight?: number;

	/**
	 * Props of the Resize and Drag Container.
	 */
	resizeAndDragOptions?: CalloutWithResizeAndDragProps;

	/**
	 * If true, it will render a pointer which lets users know the container is triggered form which element.
	 * @default true
	 */
	isPointerVisible?: boolean;
}
