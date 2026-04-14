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
 *  Badge widget displays on top-right corner of the parent element.
 *  @module
 */

import type { Identifiable, Styleable } from "../../common/main/base-props.js";

export interface BadgeProps extends Identifiable, Styleable {
	/**
	 * Max count to show.
	 * @default 9999
	 */
	overflowCount?: number;

	/**
	 * Variant will decide the Badge color.
	 * @default info
	 */
	variant?: BadgeVariant;

	/**
	 * This property combines with variants to use light colors.
	 * @default false
	 */
	light?: boolean;

	/**
	 * Number to show in badge.
	 */
	count?: number;

	/**
	 * Timeout for animation in millisecond.
	 * @default 250
	 */
	animationTimeout?: number;

	/**
	 * Hides the badge.
	 */
	hidden?: boolean;

	/**
	 * Makes the Badge a standalone element.
	 */
	standalone?: boolean;

	/**
	 * Makes the Badge become a tiny version.
	 */
	tiny?: boolean;

	/**
	 * Title attribute for the badge. The hidden text of the badge will have the same text as the title and be localized as well.
	 * @default corresponding to {@link variant}
	 *
	 *  - Normal badge, for example:
	 *     + Title: "Info notifications"
	 *     + Hidden text: ", Info notifications: "
	 *  - Tiny badge, for example:
	 *     + Title: "Info notifications available"
	 *     + Hidden text: ", Info notifications available"
	 */
	title?: string;

	/**
	 * Given position for the Badge.
	 */
	position?: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};

	/** @internal */
	enabledInteractionHint?: boolean;
}

export type BadgeVariant = "info" | "success" | "warning" | "error";
