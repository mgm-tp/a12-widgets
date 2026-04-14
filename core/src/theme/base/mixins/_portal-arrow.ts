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

import type { CSSObject } from "styled-components";
import { css } from "styled-components";

import type { Orientation } from "../../../common/main/alignment.js";
import { getIframeOffset } from "../../../common/main/utils.js";

export const getArrowSide = (orientation: Orientation): string => {
	return orientation.includes("top")
		? "bottom"
		: orientation.includes("bottom")
			? "top"
			: orientation.includes("left")
				? "right"
				: "left";
};

type ElementDefaultSelector = "&:before" | "&:after" | (string & {});

export const basePortalArrow = (props: {
	orientation: Orientation;
	arrow: {
		size: number;
		background: string;
		border: string;
		boxShadow: string;
		endPosition?: string;
		startPosition?: string;
		parentMargin?: string;
		styles?: CSSObject;
	};
	selector?: CSSObject | ElementDefaultSelector;
	referenceElement?: HTMLElement | null;
	containerPosition?: {
		top: number;
		left: number;
	};
}) => {
	const { arrow, orientation, referenceElement, containerPosition } = props;

	let arrowAdjustPosition = {
		left: "50%",
		top: "50%"
	};

	if (referenceElement && containerPosition) {
		const referenceElementRect = referenceElement.getBoundingClientRect();
		const iframeOffset = getIframeOffset(referenceElement, document);

		arrowAdjustPosition = {
			left: `${referenceElementRect.left + iframeOffset.left + referenceElementRect.width / 2 - containerPosition.left}px`,
			top: `${referenceElementRect.top + iframeOffset.top + referenceElementRect.height / 2 - containerPosition.top}px`
		};
	}

	const element = props.selector ?? "&:before";
	const side = getArrowSide(orientation);

	const portalMarginValue = `margin-${side}: ${Math.ceil((arrow.size * Math.sqrt(2)) / 2)}px`;
	const arrowBorderValue = `border-${orientation.split("-")[0]}: none`;

	return css`
		${portalMarginValue};

		${element} {
			background-color: ${arrow.background};
			border: ${arrow.border};
			${arrowBorderValue};
			content: "";
			height: ${arrow.size}px;
			pointer-events: none;
			position: absolute;
			transform: rotate(45deg);
			width: ${arrow.size}px;

			${arrow.styles?.position !== "fixed" &&
			css`
				${side}: ${-arrow.size / 2}px;
			`}

			${orientation.includes("top") &&
			css`
				border-left: none;
				box-shadow: ${arrow.boxShadow};
			`}
			
			${orientation.includes("bottom") &&
			css`
				border-right: none;
			`}
			
			${orientation.includes("left") &&
			css`
				border-bottom: none;
				box-shadow: 2px -2px 2px 0 rgba(0, 0, 0, 0.2);
			`}
			
			${orientation.includes("right") &&
			css`
				border-top: none;
			`}
			
			${["top", "bottom"].includes(orientation) &&
			css`
				left: ${arrowAdjustPosition.left};
				transform: translateX(-50%) rotate(45deg);
			`}
			
			${["left", "right"].includes(orientation) &&
			css`
				top: ${arrowAdjustPosition.top};
				transform: translateY(-50%) rotate(45deg);
			`}

			${arrow.styles &&
			css`
				${arrow.styles}; // Override styles of arrow
			`}
		}

		${["top-start", "bottom-start"].includes(orientation) &&
		css`
			margin-left: ${arrow.parentMargin};

			${element} {
				left: ${arrow.startPosition};
			}
		`}

		${["left-start", "right-start"].includes(orientation) &&
		css`
			margin-top: ${arrow.parentMargin};

			${element} {
				top: ${arrow.startPosition};
			}
		`}
		
		${["top-end", "bottom-end"].includes(orientation) &&
		css`
			margin-right: ${arrow.parentMargin};

			${element} {
				right: ${arrow.endPosition};
			}
		`}
		
		${["left-end", "right-end"].includes(orientation) &&
		css`
			margin-bottom: ${arrow.parentMargin};

			${element} {
				bottom: ${arrow.endPosition};
			}
		`}
	`;
};
