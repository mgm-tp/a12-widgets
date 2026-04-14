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

import type { MutableRefObject } from "react";

/**
 * Property of SizeDetect
 */
export interface SizeDetectorProps {
	/**
	 * A list of breakpoints to calculate the size.
	 *
	 * @default
	 *
	 * [{ width: 575, size: "xs" },
	 *
	 * { width: 767, size: "sm" },
	 *
	 * { width: 991, size: "md" },
	 *
	 * { width: Number.POSITIVE_INFINITY, size: "lg" }]
	 */
	breakPoints?: SizeDetectorProps.BreakPoint[];
}

export namespace SizeDetectorProps {
	/**
	 * Size name of viewport
	 */
	export type Size = "xs" | "sm" | "md" | "lg" | null;

	export interface BreakPoint {
		/**
		 * Upper bound of this breakpoint.
		 */
		width: number;

		/**
		 * Name of the breakpoint.
		 */
		size: Size;
	}
}

export interface WindowSizeDetectorProps extends SizeDetectorProps {}

export interface ElementSizeDetectorProps extends SizeDetectorProps {
	/**
	 * React reference of the element to observe.
	 * Pass a reference to the element you want to attach resize handlers to.
	 * It must be an instance of React.useRef or React.createRef functions.
	 */
	targetRef: MutableRefObject<HTMLElement | null>;

	/**
	 * Trigger onResize on width change
	 * @default true
	 */
	handleWidth?: boolean;

	/**
	 * Trigger onResize on height change
	 * @default false
	 */
	handleHeight?: boolean;
}

export interface SizeDetectorComponentProps extends SizeDetectorProps {
	/**
	 * A callback will be triggered when the size is changed leading to changing the breakpoint.
	 */
	onSizeChange?(breakPoint: SizeDetectorProps.BreakPoint): void;
}
