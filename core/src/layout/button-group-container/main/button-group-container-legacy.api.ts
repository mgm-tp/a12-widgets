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
 * This button group widget is layout component wraps many buttons
 * and position them together to either left or right.
 * Uses the legacy deprecated API with leftSlot and rightSlot.
 * @module
 */

import type { ReactNode } from "react";

import type { Container, Identifiable, Styleable } from "../../../common/main/base-props.js";
import type { ButtonGroupProps } from "../../../button-group/main/button-group.api.js";

/**
 * The props of ButtonGroupContainerLegacy using the deprecated API.
 */
export interface ButtonGroupContainerLegacyProps extends Styleable, Identifiable, Container {
	/**
	 * Customizes the PopupMenu's icon in case responsive behavior is enabled.
	 */
	popupMenuIcon?: ReactNode;

	/**
	 * Customizes the PopupMenu's title in case responsive behavior is enabled.
	 *
	 * *Note:* It only supports for mobile usage.
	 */
	popupMenuHeaderTitle?: ReactNode;

	/**
	 * Specify buttons on the left.
	 * @deprecated from 34.4.0, use {@link leftSlotButtons} instead
	 */
	leftSlot?: ReactNode[];

	/**
	 * Specify buttons on the right.
	 * @deprecated from 34.4.0, use {@link rightSlotButtons} instead
	 */
	rightSlot?: ReactNode[];

	/**
	 * Additional props for the {@link ButtonGroup} of {@link leftSlot}.
	 *
	 * *Note:* some props such as children, alignment, popupMenuIcon and responsive
	 * will not be available for this additional props because they are calculated internally
	 */
	leftSlotProps?: ButtonGroupContainerLegacyProps.ButtonGroup;

	/**
	 * Additional props for the {@link ButtonGroup} of {@link rightSlot}.
	 *
	 * *Note:* some props such as children, alignment, popupMenuIcon and responsive
	 * will not be available for this additional props because they are calculated internally
	 */
	rightSlotProps?: ButtonGroupContainerLegacyProps.ButtonGroup;

	/**
	 * When the total width of buttons is larger than the ButtonGroupContainer's width, the buttons will be grouped into a PopupMenu.
	 *
	 * *Note:* In case the ButtonGroupContainer is one of the flex items that is placed in the flex container
	 * defining the horizontal direction, we have to set `flex-shrink: 0` (or use `-u-flex-no-shrink` class)
	 * for the rest of the flex items so that the ButtonGroupContainer could behave correctly.
	 *
	 * @default  false
	 */
	responsive?: boolean;

	/**
	 * Defines the direction from which buttons should be collapsed into the popup menu when responsive behavior is enabled.
	 *
	 * - "left-to-right": Buttons are collapsed from left to right (default behavior)
	 * - "right-to-left": Buttons are collapsed from right to left
	 *
	 * @default "left-to-right"
	 */
	collapsingDirection?: "left-to-right" | "right-to-left";

	/**
	 * When enabled, the container only takes up as much width as its visible buttons (`max-width: max-content`),
	 * allowing siblings to sit next to it rather than being pushed away.
	 * Recalculation is triggered when the container's parentElement resizes.
	 * The container's parentElement must not have `max-width: max-content` or a fixed width —
	 * it must be able to grow and shrink with available space for uncollapsing to work correctly.
	 *
	 * @requires responsive={true}
	 * @default false
	 */
	fitVisibleContentWidth?: boolean;
}

export namespace ButtonGroupContainerLegacyProps {
	export type ButtonGroup = Omit<ButtonGroupProps, "children" | "alignment">;
}
