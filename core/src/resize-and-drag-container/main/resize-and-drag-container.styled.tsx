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

import { styled, css } from "styled-components";

import { StyledCalloutWrapper } from "../../callout/main/template/callout.tpl.view.js";
import { addPrefix } from "../../common/main/utils.js";
import type { Orientation, OrientationMap } from "../../common/main/alignment.js";

export const resizeAndDragContentAnimate = addPrefix("resize-and-drag-content-animate");

const animationTransformOrigin: OrientationMap<string> = {
	["top"]: "bottom center",
	["top-end"]: "bottom right",
	["top-start"]: "bottom left",
	["right"]: "left center",
	["right-end"]: "left bottom",
	["right-start"]: "left top",
	["bottom"]: "top center",
	["bottom-end"]: "top right",
	["bottom-start"]: "top left",
	["left"]: "right center",
	["left-end"]: "right bottom",
	["left-start"]: "right top"
};

export const StyledResizeAndDragContentWrapper = styled.div.withConfig({
	displayName: "StyledResizeAndDragContentWrapper-sc-"
})<{
	$containsHandle?: boolean;
	$disableDragging?: boolean;
	$isDragging?: boolean;
	$orientation: Orientation;
	$animationDuration: number;
}>(({ theme, $containsHandle, $disableDragging, $isDragging, $orientation, $animationDuration }) => {
	const { callout, resizeAndDragContainer } = theme.components;
	const opacityAnimationDelay = $animationDuration / 6;

	// * selector has the lowest specificity value, so adding !important for higher priority will help to override all styles
	return css`
		height: 100%;
		outline: none;

		${StyledCalloutWrapper} {
			width: ${callout.width};
		}

		& > *:not(${StyledCalloutWrapper}) {
			width: 100%;
		}

		& > *:only-child {
			box-shadow: ${resizeAndDragContainer.boxShadow};
			height: 100%;
			overflow: auto;

			& > *:only-child {
				flex-grow: 1;
			}
		}

		.${addPrefix("handle")} {
			cursor: move;

			& > * {
				cursor: move !important;
			}
		}

		${!$disableDragging &&
		!$containsHandle &&
		css`
			cursor: move;

			* {
				cursor: move !important;
			}
		`}

		${$isDragging &&
		css`
			animation: none;

			&:after,
			&:before,
			*,
			*:before,
			*:after {
				animation: none !important;
			}
		`} 
			
		// The animation for Resize And Drag Container.
		transform-origin: ${animationTransformOrigin[$orientation]};
		&.${resizeAndDragContentAnimate}-enter {
			background: ${resizeAndDragContainer.animation.background};
			transform: scaleX(0) scaleY(0);

			& > * {
				opacity: 0;
			}
		}

		&.${resizeAndDragContentAnimate}-enter-active, &.${resizeAndDragContentAnimate}-exit {
			transform: scaleX(1) scaleY(1);
			& > * {
				transition: opacity ${opacityAnimationDelay}ms ease-in-out ${$animationDuration / 3}ms;
				opacity: 1;
			}
		}

		&.${resizeAndDragContentAnimate}-enter-active {
			transition: transform ${$animationDuration}ms cubic-bezier(0.17, 0.88, 0.33, 1.13);
		}

		&.${resizeAndDragContentAnimate}-exit {
			background: ${resizeAndDragContainer.animation.background};
		}

		&.${resizeAndDragContentAnimate}-exit-active {
			transform: scaleX(0) scaleY(0);
			transition: transform ${$animationDuration}ms cubic-bezier(0.17, 0.88, 0.33, 1);

			& > * {
				opacity: 0;
				transition: opacity ${opacityAnimationDelay}ms ease-in-out;
			}
		}

		&.${resizeAndDragContentAnimate}-exit-done {
			opacity: 0;
		}
	`;
});
