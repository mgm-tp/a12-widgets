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

import type { CustomClientRect } from "./utils.js";
import { addPrefix, getElementDocument, getIframeOffset } from "./utils.js";
import { provider } from "./device-detector.js";
import { DataRoles } from "./data-roles.js";

// tslint:disable-next-line:no-any
export interface OrientationMap<K = any> {
	"top-start": K;
	top: K;
	"top-end": K;
	"right-start": K;
	right: K;
	"right-end": K;
	"bottom-start": K;
	bottom: K;
	"bottom-end": K;
	"left-start": K;
	left: K;
	"left-end": K;
}

export type Orientation = keyof OrientationMap;

export namespace Orientation {
	export function toClassName(orientation: Orientation): string {
		const [a, b] = orientation.split("-");

		return addPrefix(`h_${a}${b ? b.slice(0, 1).toUpperCase() + b.slice(1) : ""}`);
	}
}

export const ORIENTATION_LIST: Orientation[] = [
	"top-start",
	"top",
	"top-end",
	"right-start",
	"right",
	"right-end",
	"bottom-start",
	"bottom",
	"bottom-end",
	"left-start",
	"left",
	"left-end"
];

export interface Position {
	orientation: Orientation;
	top: number;
	left: number;
}

export function getGlobalViewportBox(): CustomClientRect {
	const innerWidth = window.innerWidth;
	const innerHeight = window.innerHeight;

	return {
		top: 0,
		bottom: innerHeight,
		height: innerHeight,
		left: 0,
		right: innerWidth,
		width: innerWidth
	};
}

export interface BoundaryAlignmentArgument {
	referenceElement?: Element;
	element: Element;
	preferredOrientation: Orientation;
	mode: "absolute" | "fixed";
	orientationList?: Orientation[];
	fixedOrientation?: boolean;
	adjustPositionToScreen?: boolean;
	fixedPosition?: {
		top: number;
		left: number;
	};
	referenceElementRect?: DOMRect;
}

export const DISTANCE_TO_SCREEN_BORDER = 10;

export function getBoundaryAlignment(boundaryAlignmentArgument: BoundaryAlignmentArgument): Position {
	const roundRectValues = (rect: DOMRect | CustomClientRect) => ({
		top: Math.round(rect.top),
		right: Math.round(rect.right),
		bottom: Math.round(rect.bottom),
		left: Math.round(rect.left),
		width: Math.round(rect.width),
		height: Math.round(rect.height)
	});

	const {
		referenceElement,
		element,
		preferredOrientation,
		mode = "fixed",
		orientationList,
		fixedOrientation,
		adjustPositionToScreen,
		fixedPosition,
		referenceElementRect
	} = boundaryAlignmentArgument;

	const globalViewportBox = getGlobalViewportBox();

	const positionBoundingClientRect = getPositionBoundingClientRect(fixedPosition, referenceElement);

	const iframeOffset =
		referenceElement && !referenceElementRect
			? getIframeOffset(referenceElement, getElementDocument(element))
			: { top: 0, left: 0 };
	const iframeTopOffset = iframeOffset.top;
	const iframeLeftOffset = iframeOffset.left;

	const baseBox = referenceElementRect
		? roundRectValues(referenceElementRect)
		: roundRectValues(positionBoundingClientRect);

	const referenceElementBox = {
		...baseBox,
		top: baseBox.top + iframeTopOffset,
		bottom: baseBox.bottom + iframeTopOffset,
		left: baseBox.left + iframeLeftOffset,
		right: baseBox.right + iframeLeftOffset
	};

	const elementBox = element.getBoundingClientRect();

	// The following two variables provides information about left resp. top position by a given orientation
	type PositionMap = OrientationMap<number>;
	const leftPosition: PositionMap = {
		get "top-start"() {
			return referenceElementBox.left;
		},
		get top() {
			return referenceElementBox.left + referenceElementBox.width / 2 - elementBox.width / 2;
		},
		get "top-end"() {
			return referenceElementBox.right - elementBox.width;
		},
		get "right-start"() {
			return referenceElementBox.right;
		},
		get right() {
			return referenceElementBox.right;
		},
		get "right-end"() {
			return referenceElementBox.right;
		},
		get "bottom-start"() {
			return referenceElementBox.left;
		},
		get bottom() {
			return referenceElementBox.left + referenceElementBox.width / 2 - elementBox.width / 2;
		},
		get "bottom-end"() {
			return referenceElementBox.right - elementBox.width;
		},
		get "left-start"() {
			return referenceElementBox.left - elementBox.width;
		},
		get left() {
			return referenceElementBox.left - elementBox.width;
		},
		get "left-end"() {
			return referenceElementBox.left - elementBox.width;
		}
	};

	const topPosition: PositionMap = {
		get "top-start"() {
			return referenceElementBox.top - elementBox.height;
		},
		get top() {
			return referenceElementBox.top - elementBox.height;
		},
		get "top-end"() {
			return referenceElementBox.top - elementBox.height;
		},
		get "right-start"() {
			return referenceElementBox.top;
		},
		get right() {
			return referenceElementBox.top + referenceElementBox.height / 2 - elementBox.height / 2;
		},
		get "right-end"() {
			return referenceElementBox.bottom - elementBox.height;
		},
		get "bottom-start"() {
			return referenceElementBox.bottom;
		},
		get bottom() {
			return referenceElementBox.bottom;
		},
		get "bottom-end"() {
			return referenceElementBox.bottom;
		},
		get "left-start"() {
			return referenceElementBox.top;
		},
		get left() {
			return referenceElementBox.top + referenceElementBox.height / 2 - elementBox.height / 2;
		},
		get "left-end"() {
			return referenceElementBox.bottom - elementBox.height;
		}
	};

	// The following two variables provides information about rule that has to be fulfilled by a given orientation
	type PositionRequirementCheckerMap = OrientationMap<(position: number) => boolean>;
	const leftPositionRequirementCheckerMap: PositionRequirementCheckerMap = {
		"top-start": (leftPos) => leftPos + elementBox.width <= globalViewportBox.right,
		top: (leftPos) => leftPos + elementBox.width <= globalViewportBox.right && leftPos >= globalViewportBox.left,
		"top-end": (leftPos) => leftPos >= globalViewportBox.left,
		"right-start": (leftPos) => leftPos + elementBox.width <= globalViewportBox.right,
		right: (leftPos) => leftPos + elementBox.width <= globalViewportBox.right,
		"right-end": (leftPos) => leftPos + elementBox.width <= globalViewportBox.right,
		"bottom-start": (leftPos) => leftPos + elementBox.width <= globalViewportBox.right,
		bottom: (leftPos) => leftPos + elementBox.width <= globalViewportBox.right && leftPos >= globalViewportBox.left,
		"bottom-end": (leftPos) => leftPos >= globalViewportBox.left,
		"left-start": (leftPos) => leftPos >= globalViewportBox.left,
		left: (leftPos) => leftPos >= globalViewportBox.left,
		"left-end": (leftPos) => leftPos >= globalViewportBox.left
	};

	const topPositionRequirementCheckerMap: PositionRequirementCheckerMap = {
		"top-start": (topPos) => topPos >= globalViewportBox.top,
		top: (topPos) => topPos >= globalViewportBox.top,
		"top-end": (topPos) => topPos >= globalViewportBox.top,
		"right-start": (topPos) => topPos + elementBox.height <= globalViewportBox.bottom,
		right: (topPos) => topPos + elementBox.height <= globalViewportBox.bottom && topPos >= globalViewportBox.top,
		"right-end": (topPos) => topPos >= globalViewportBox.top,
		"bottom-start": (topPos) => topPos + elementBox.height <= globalViewportBox.bottom,
		bottom: (topPos) => topPos + elementBox.height <= globalViewportBox.bottom,
		"bottom-end": (topPos) => topPos + elementBox.height <= globalViewportBox.bottom,
		"left-start": (topPos) => topPos + elementBox.height <= globalViewportBox.bottom,
		left: (topPos) => topPos + elementBox.height <= globalViewportBox.bottom && topPos >= globalViewportBox.top,
		"left-end": (topPos) => topPos >= globalViewportBox.top
	};

	const getArea: OrientationMap<number> = {
		get "top-start"() {
			return referenceElementBox.top * (globalViewportBox.right - referenceElementBox.left);
		},
		get top() {
			return referenceElementBox.top * globalViewportBox.right;
		},
		get "top-end"() {
			return referenceElementBox.top * referenceElementBox.right;
		},
		get "right-start"() {
			return (
				(globalViewportBox.right - referenceElementBox.right) * (globalViewportBox.bottom - referenceElementBox.top)
			);
		},
		get right() {
			return (globalViewportBox.right - referenceElementBox.right) * globalViewportBox.bottom;
		},
		get "right-end"() {
			return (globalViewportBox.right - referenceElementBox.right) * referenceElementBox.bottom;
		},
		get "bottom-start"() {
			return (
				(globalViewportBox.bottom - referenceElementBox.bottom) * (globalViewportBox.right - referenceElementBox.left)
			);
		},
		get bottom() {
			return (globalViewportBox.bottom - referenceElementBox.bottom) * globalViewportBox.right;
		},
		get "bottom-end"() {
			return (globalViewportBox.bottom - referenceElementBox.bottom) * referenceElementBox.right;
		},
		get "left-start"() {
			return referenceElementBox.left * (globalViewportBox.bottom - referenceElementBox.top);
		},
		get left() {
			return referenceElementBox.left * globalViewportBox.bottom;
		},
		get "left-end"() {
			return referenceElementBox.left * referenceElementBox.bottom;
		}
	};

	function evaluateLeftPosition(orientationToEvaluate: Orientation): boolean {
		return leftPositionRequirementCheckerMap[orientationToEvaluate](leftPosition[orientationToEvaluate]);
	}

	function evaluateTopPosition(orientationToEvaluate: Orientation): boolean {
		return topPositionRequirementCheckerMap[orientationToEvaluate](topPosition[orientationToEvaluate]);
	}

	function doesElementFitToArea(orientation: Orientation): boolean {
		const elementBoxChild =
			element.children && element.children.length ? element.children[0].getBoundingClientRect() : undefined;

		if (!elementBoxChild) {
			return true;
		}

		const elementArea = elementBox.width * elementBox.height;
		const elementChildArea = elementBoxChild.width * elementBoxChild.height;
		const isNotOverflow = elementBox.width >= elementBoxChild.width && elementBox.height >= elementBoxChild.height;
		const isBodyNotOverflow = window.innerWidth <= window.screen.width;

		return elementArea <= getArea[orientation] && elementArea >= elementChildArea && isNotOverflow && isBodyNotOverflow;
	}

	function evaluatePosition(orientationToEvaluate: Orientation): boolean {
		if (provider.isPhone()) {
			return (
				doesElementFitToArea(orientationToEvaluate) && leftPosition[orientationToEvaluate] === globalViewportBox.left
			);
		}

		return evaluateLeftPosition(orientationToEvaluate) && evaluateTopPosition(orientationToEvaluate);
	}

	function findOrientationWithMaxArea(_orientationList: Orientation[]): Orientation {
		let maxArea = 0;
		let orientationWithMaxArea = _orientationList[0];

		for (const orientation of _orientationList) {
			const orientationArea = getArea[orientation];

			if (orientationArea > maxArea) {
				maxArea = orientationArea;
				orientationWithMaxArea = orientation;
			}
		}

		return orientationWithMaxArea;
	}

	function getOrientationFromList(_orientationList: Orientation[]): Orientation {
		for (const orientation of _orientationList) {
			if (evaluatePosition(orientation)) {
				return orientation;
			}
		}

		if (fixedOrientation) {
			return findOrientationWithMaxArea(_orientationList);
		}

		const orientationPrefixes = _orientationList.map((orientation) => orientation.split("-")[0]);
		const nonPreferredOrientations = ORIENTATION_LIST.filter(
			(orientation) => _orientationList.indexOf(orientation) === -1
		);
		const startsWithPrefixes: Orientation[] = [];
		const otherOrientations: Orientation[] = [];

		for (const orientation of nonPreferredOrientations) {
			const orientationPrefix = orientation.split("-")[0];

			if (orientationPrefixes.indexOf(orientationPrefix) !== -1) {
				startsWithPrefixes.push(orientation);
			} else {
				otherOrientations.push(orientation);
			}
		}

		for (const orientation of startsWithPrefixes) {
			if (evaluatePosition(orientation)) {
				return orientation;
			}
		}

		for (const orientation of otherOrientations) {
			if (evaluatePosition(orientation)) {
				return orientation;
			}
		}

		return findOrientationWithMaxArea(ORIENTATION_LIST);
	}

	function getOrientationFromPreferredOrientation(): Orientation {
		if (evaluatePosition(preferredOrientation) || fixedOrientation) {
			return preferredOrientation;
		}

		const orientationPrefix = preferredOrientation.split("-")[0];
		const startsWithPrefixes: Orientation[] = [];
		const otherOrientations: Orientation[] = [];

		for (const orientation of ORIENTATION_LIST) {
			if (orientation === preferredOrientation) {
				continue;
			}

			if (orientation.startsWith(orientationPrefix)) {
				startsWithPrefixes.push(orientation);
			} else {
				otherOrientations.push(orientation);
			}
		}

		for (const orientation of startsWithPrefixes) {
			if (evaluatePosition(orientation)) {
				return orientation;
			}
		}

		for (const orientation of otherOrientations) {
			if (evaluatePosition(orientation)) {
				return orientation;
			}
		}

		return findOrientationWithMaxArea(ORIENTATION_LIST);
	}

	const finalOrientation =
		orientationList && orientationList.length > 0
			? getOrientationFromList(orientationList)
			: getOrientationFromPreferredOrientation();

	const topOffset = mode === "absolute" ? window.scrollY : 0;
	const leftOffset = mode === "absolute" ? window.scrollX : 0;

	let top = Math.round(Math.max(topPosition[finalOrientation] + topOffset, 0));
	let left = Math.round(Math.max(leftPosition[finalOrientation] + leftOffset, 0));

	if (adjustPositionToScreen) {
		if (globalViewportBox.right < left + elementBox.width) {
			left = Math.max(0, globalViewportBox.right - elementBox.width);
		}

		if (globalViewportBox.bottom < top + elementBox.height) {
			top = Math.max(0, globalViewportBox.bottom - elementBox.height);
		}

		// make sure the element is not squeezed to the border (top and bottom) of the screen
		if (top <= DISTANCE_TO_SCREEN_BORDER * 2) {
			top = DISTANCE_TO_SCREEN_BORDER;
		}
	}

	// Need to recalculate portal position when WidgetsRoot component is not rendered at (0, 0) coordinate to viewport
	const portalPlaceholder = getElementDocument(element).querySelector(`[data-role="${DataRoles.Portal.Placeholder}"]`);
	const portalPlaceholderBox = portalPlaceholder?.getBoundingClientRect();

	return {
		orientation: finalOrientation,
		top: top - (portalPlaceholderBox?.top || 0),
		left: left - (portalPlaceholderBox?.left || 0)
	};
}

export function getPositionBoundingClientRect(
	position?: { top: number; left: number },
	referenceElement?: Element
): CustomClientRect {
	if (referenceElement) {
		return referenceElement.getBoundingClientRect();
	}

	if (position) {
		return { ...position, right: position.left, bottom: position.top, width: 0, height: 0 };
	}

	return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
}
