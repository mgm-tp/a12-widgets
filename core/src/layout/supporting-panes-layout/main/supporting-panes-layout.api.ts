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

import type { Variants } from "motion/react";

import type { Styleable, Identifiable, Container, Ref, HTMLAttributes } from "../../../common/main/base-props.js";

export interface CustomAnimationConfig {
	/**
	 * Animation variants for the pane container.
	 */
	paneVariants: Variants;

	/**
	 * Animation variants for the pane content.
	 */
	contentVariants: Variants;
}

export namespace SupportingPanesLayoutProps {
	export interface LayoutProps extends Styleable, Identifiable, Container, Ref, HTMLAttributes {}

	export interface PrimaryPaneProps extends Styleable, Identifiable, Container, Ref, HTMLAttributes {}

	export type SecondaryPanePosition = "left" | "right";

	export interface SecondaryPaneProps extends Styleable, Identifiable, Container, Ref, HTMLAttributes {
		/**
		 * Position to handle the resize behavior and animation. A secondary pane can be placed on the left or right side of the primary pane.
		 */
		position: SecondaryPanePosition;

		/**
		 * Width configurations.
		 *
		 * A pane will be expanded by default with the given {@link expanded}.
		 */
		widthConfig?: {
			/**
			 * Width when the pane is expanded.
			 *
			 * @default 25%
			 */
			expanded?: number | string;

			/**
			 * Width when the pane is collapsed.
			 */
			collapsed?: number | string;
		};

		/**
		 * This is used to control the collapse/expand state externally. For example, by clicking a button.
		 * By default, the pane will take up 25% of the entire layout.
		 *
		 * @default false
		 */
		collapsed?: boolean;

		/**
		 * Callback function to toggle the pane between collapsed and expanded states.
		 *
		 * This function updates the pane's state based on its current state.
		 * It is recommended to use this function to better manage the collapse/expand behavior and ensure smooth state transitions.
		 */
		onToggleCollapsed?(): void;

		/**
		 * Resize options.
		 */
		resizeOptions?: {
			/**
			 * Minimum width to stop resizing from occurring.
			 *
			 * If both this property and {@link widthConfig.collapsed} are specified, the pane will shrink until it reaches the minimum width, then jump back to the collapsed state.
			 */
			minWidth: number | string;

			/**
			 * Maximum width to stop resizing from occurring.
			 */
			maxWidth: number | string;

			/**
			 * A callback will be triggered on mousedown to start resizing.
			 */
			onResizeStart?(event: MouseEvent): void;

			/**
			 * A callback will be triggered while resizing.
			 */
			onResize?(event: MouseEvent, payload: { resizedElementWidth: number; siblingElementWidth: number }): void;

			/**
			 * Callback triggered when the resizing action is finished.
			 *
			 * @param event – The mouse event associated with the resize action.
			 * @param payload – An object containing details about the resize operation:
			 *   - `resizedElement`: The element that was resized.
			 *   - `siblingElement`: The adjacent sibling element affected by the resize.
			 *   - `resizedElementWidth`: The new width of the resized element.
			 *   - `siblingElementWidth`: The new width of the sibling element.
			 *   - `isAtCollapsedWidth`: A boolean indicating if the resized element is at its collapsed width.
			 */
			onResizeStop?(
				event: MouseEvent,
				payload: {
					resizedElement: HTMLElement | null;
					siblingElement: HTMLElement | null;
					resizedElementWidth: number;
					siblingElementWidth: number;
					isAtCollapsedWidth: boolean;
				}
			): void;
		};

		/**
		 * Whether the pane should be hidden or not.
		 */
		hide?: boolean;

		/**
		 * Custom animation configuration for the pane.
		 * If provided, this will override the default SPL animation.
		 */
		customAnimation?: CustomAnimationConfig;
	}
}
