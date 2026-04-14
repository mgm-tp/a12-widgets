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

import type { MouseEvent, KeyboardEvent } from "react";

import type { Container, Styleable, Identifiable, Ref, HTMLAttributes } from "../../common/main/base-props.js";
import type { Orientation } from "../../common/main/alignment.js";

/**
 * Positions a given element relative to a reference element, so that the
 * element is fully visible inside the current browser viewport if it is possible.
 */
export interface AttachedPortalProps extends Container, Styleable, Identifiable, Ref<HTMLDivElement>, HTMLAttributes {
	/**
	 * The element that is used to align the Portal element.
	 * Undefined signals that the dom was not rendered yet.
	 *
	 * Can be undefined if the {@link position} is defined.
	 */
	referenceElement?: HTMLElement;

	/**
	 * A DOMRect object provides information about the trigger element's size and its position relative to the viewport.
	 * It is useful for recalculating the orientation of the Attached Portal when the reference element is overlapped by other elements.
	 */
	referenceElementRect?: DOMRect;

	/**
	 * Aligns the portal to the {@link referenceElement}.
	 * @default "bottom-start"
	 *
	 * *Note:* Does not take effect on mobile devices.
	 */
	orientation?: Orientation;

	/**
	 * Opens the Portal at a given position.
	 */
	position?: {
		top: number;
		left: number;
	};

	/**
	 * List of preferred orientations
	 * - If both orientationList and {@link orientation} are defined, the AttachedPortal will
	 * prioritize the orientationList
	 * - The priority of orientations decrease from left to right (the first orientation of the list
	 * has the highest priority)
	 */
	orientationList?: Orientation[];

	/**
	 * As fixedOrientation is set to true, the attached portal will remain element's position at the preferred
	 * {@link orientation} or only adjust the position to the orientations that belongs to {@link orientationList}
	 * when screen's space is not enough to show the full-size element
	 */
	fixedOrientation?: boolean;

	/**
	 * Set selfSizing to true when the children of the attached portal have its own method for calculating size
	 */
	selfSizing?: boolean;

	/**
	 * Specifies whether the Portal hides when the position of the referenceElement changes.
	 */
	hideOnReferenceElementPositionChange?: boolean;

	/**
	 * If the portal closes on outer clicks.
	 * If set the exception, portal will be closed when clicking outside but won't be closed if click on exception.
	 */
	closeOnOutsideClick?: boolean | { exception?: (HTMLElement | null)[] };

	/**
	 * Specifies whether the Portal closes when clicking the {@link referenceElement}.
	 * @default true
	 */
	closeOnClickReferenceElement?: boolean;

	/**
	 * If the new element's position that depends on {@link referenceElement}
	 * is still covered by the screen, it will try to adjust the element's position
	 * to show full element's rectangle if possible.
	 */
	adjustPositionToScreen?: boolean;

	/**
	 * If the portal is opened, it will be focused automatically.
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * Should the portal close when the ESC key is hit.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * The reference element will be focused after the user pressed esc.
	 * @default true
	 */
	focusOnReferenceElementAfterEsc?: boolean;

	/**
	 * The reference element will be focused after close the portal.
	 * @default false
	 */
	focusOnReferenceElementAfterClose?: boolean;

	/**
	 * @internal
	 * Indicates whether the Attached Portal is part of a rich text editor.
	 */
	isInRichTextEditor?: boolean;

	/**
	 * Handle update element position.
	 */
	updateElementPosition?(handler: () => void): void;

	/**
	 * Notifies that the visibility of the portal is changed.
	 * @param isVisible – true if the portal is shown and false if not.
	 */
	onVisibilityChange?(isVisible: boolean): void;

	/**
	 * Handle event when click on the portal.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Callback when click outside the portal.
	 */
	onClickOutside?(event: Event): void;

	/**
	 * Handle event when mouse down on the portal.
	 */
	onMouseDown?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when mouse over on the portal.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when mouse leave on the portal.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when key down on the portal.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Callback will be triggered when the size has changed.
	 */
	onSizeChange?(maxWidth: number, maxHeight: number): void;

	/**
	 * Callback will be triggered when the orientation has changed.
	 */
	onOrientationChange?(orientation: Orientation): void;
}
