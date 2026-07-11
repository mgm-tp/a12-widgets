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

import type { RefObject, ReactNode } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";

export type InteractionHintComponentConfigMap = {
	button: InteractionHintBaseConfig;
	link: InteractionHintBaseConfig;
	iconButton: InteractionHintBaseConfig;
	counter: InteractionHintBaseConfig;
	tabPanel: InteractionHintBaseConfig;
	list: InteractionHintBaseConfig;
	fileUpload: InteractionHintBaseConfig;
	collapsiblePanel: InteractionHintBaseConfig;
	toggle: InteractionHintBaseConfig;
	wizard: InteractionHintBaseConfig;
	interactiveTile: InteractionHintBaseConfig;
	horizontalFlyoutMenu: InteractionHintBaseConfig;
	accordion: InteractionHintVerticalConfig;
	verticalFlyoutMenu: InteractionHintVerticalConfig;
	slidingMenu: InteractionHintVerticalConfig;
	filter?: InteractionHintBaseConfig;
};
export type InteractionHintComponentKey = keyof InteractionHintComponentConfigMap;

export type InteractionHintPosition = "left" | "right";

export interface InteractionHintBehavior {
	/**
	 * Enable or disable interaction hint for this specific component instance.
	 * No effects when the hint is disabled.
	 * @default false
	 */
	followCursor?: boolean;

	/**
	 * When enabled, the hint will follow the cursor during hover instead of being anchored to the element.
	 * No effects when the hint is disabled.
	 * @default false
	 */
	hideArrow?: boolean;
}

export interface InteractionHintBaseConfig extends InteractionHintBehavior {
	/**
	 * Enable or disable interaction hint for this specific component instance.
	 * @default false
	 */
	enabled?: boolean;
}

export interface InteractionHintVerticalConfig extends InteractionHintBaseConfig {
	/**
	 * Position of the hint relative to the reference element.
	 * Used by list-based components (e.g., accordion, flyout menu, sliding menu)
	 * to align the hint without covering the element's text content.
	 */
	position?: InteractionHintPosition;
}

export type InteractionHintConfig = InteractionHintVerticalConfig;

/**
 * Component-specific configuration for interaction hints.
 */
export type InteractionHintComponentConfig = {
	[K in InteractionHintComponentKey]?: boolean | InteractionHintComponentConfigMap[K];
};

export interface InteractionHintProps extends Styleable, Identifiable, InteractionHintBehavior {
	/**
	 * The trigger element that has the provided title.
	 */
	referenceElementRef: RefObject<HTMLElement | null>;

	/**
	 * The title of the element
	 */
	title?: ReactNode;

	/**
	 * Variant of the interaction hint.
	 * @default undefined
	 */
	variant?: "success" | "hint" | "error" | "warning";

	/**
	 * Specifies whether the reference element is focusable.
	 * @default true
	 */
	focusable?: boolean;

	/**
	 * Position of the hint relative to the reference element.
	 */
	position?: InteractionHintPosition;
}
