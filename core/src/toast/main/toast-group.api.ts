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

import type { Ref, Container, Identifiable, Styleable } from "../../common/main/base-props.js";

export interface ToastGroupStackOptions {
	/**
	 * The title of Stackable Toast Group's toolbar.
	 */
	toolbarTitle?: ReactNode;

	/**
	 * Items to be rendered inside the Stackable Toast Group's toolbar.
	 */
	toolbarItems?: ReactNode;

	/**
	 * Handle when toggling Toasts in Stackable ToastGroup.
	 * The handler returns the current stacking state of the Stackable Toast Group.
	 */
	onToggleStack?(handler: () => boolean): void;
}

export interface ToastGroupProps extends Container, Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * Position of ToastGroup on screen.
	 * @default top-right
	 */
	position?: ToastGroupProps.Position;

	/**
	 * The ToastGroup will show on the corner of this viewport.
	 * @default window
	 */
	alignTo?: ToastGroupProps.Viewport;

	/**
	 * Direction of toasts while showing in ToastGroup.
	 * @default If the position is top-left/top-right, the direction will be top-down. Otherwise, the direction
	 * will be bottom-up.
	 */
	direction?: ToastGroupProps.Direction;

	/**
	 * Custom timeout for TransitionGroup.
	 * Change this if you are also overriding the duration in css,
	 * the value should be equal to or bigger than the css transition duration.
	 * @default 400
	 */
	animationTimeout?: number;

	/**
	 * Display with mobile layout or not.
	 */
	mobile?: boolean;

	/**
	 * Display the ToastGroup as a stack of toasts.
	 * Recommended when the viewport has a limited space.
	 * The ToastGroup will no longer handle the Toast's {@link ToastTemplateProps.focusOnMount} and {@link focusBack}
	 */
	stackable?: ToastGroupStackOptions | boolean;

	/**
	 * Whether close on pressing Esc or not.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * If the active element is on the Toast Group when it disappears, focus back to the previous active element. Otherwise, keep the focus on the current active element.
	 * @default true
	 */
	focusBack?: boolean;

	/**
	 * Return handler for focusing back to previous active element.
	 */
	focusBackHandler?(handler: () => void): void;

	/**
	 * Handle when closing Toast in ToastGroup.
	 */
	onClose?(): void;
}

export namespace ToastGroupProps {
	export type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";
	export type Viewport = HTMLElement | "window" | "parent";
	export type Direction = "top-down" | "bottom-up";
}
