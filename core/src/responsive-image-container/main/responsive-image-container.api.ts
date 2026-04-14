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

import type { MouseEvent, SyntheticEvent } from "react";

import type { Styleable, Identifiable } from "../../common/main/base-props.js";

export interface ResponsiveImageContainerProps extends Styleable, Identifiable {
	/**
	 * Specifies the URL of the image.
	 */
	src: string;

	/**
	 * Title attribute of the image.
	 */
	title?: string;

	/**
	 * Specifies an alternate text for an image if the image cannot be displayed.
	 * @default ""
	 */
	alt?: string;

	/**
	 * Takes the height into consideration.
	 * @deprecated This props is not needed anymore since we use the object-fit property to manage the size instead of JavaScript code.
	 * @default false
	 */
	handleHeight?: boolean;

	/**
	 * Try to fit the image width to the parent.
	 * @deprecated This props is not needed anymore since we use the object-fit property to manage the size instead of JavaScript code.
	 */
	preferWidth?: "fitToParent" | "scaleIfNeeded";

	/**
	 * A callback will be triggered when the image is clicked by mouse.
	 */
	onClick?(event: MouseEvent<HTMLImageElement>): void;

	/**
	 * A callback will be triggered when the image is loaded successfully.
	 */
	onLoad?(event: SyntheticEvent<HTMLImageElement>): void;
}
