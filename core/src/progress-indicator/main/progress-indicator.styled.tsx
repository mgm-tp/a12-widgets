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

import { styled, css, keyframes } from "styled-components";

import { brightFocus } from "../../theme/base/mixins/_interaction.js";
import { fadeIn } from "../../theme/base/mixins/_animation.js";
import { provider } from "../../common/main/device-detector.js";

import type { OverlayVariant, ProgressIndicatorSize } from "./progress-indicator.api.js";

const scale = keyframes`
	0%,
	80%,
	100% {
		transform-origin: top left;
		box-shadow: none;
	}
	0% {
		transform: scale(0) translate(-50%, -50%);
	}
	80% {
		transform: scale(1.1) translate(-50%, -50%);
		animation-timing-function: ease-out;
	}
	100% {
		transform: scale(1) translate(-50%, -50%);
		animation-timing-function: ease-in;
	}
`;

const rotateCircle = () => {
	let rotateCircleProperties = css``;

	for (let i = 1; i <= 8; i++) {
		rotateCircleProperties = css`
			${rotateCircleProperties}
			${i * 12.5}% {
				transform: rotate(${i * 135}deg);
			}
		`;
	}

	return keyframes`
		${rotateCircleProperties}
	`;
};

const leftSpin = keyframes`
	0% {
		transform: rotate(130deg);
	}
	50% {
		transform: rotate(-5deg);
	}
	100% {
		transform: rotate(130deg);
	}
`;

const rightSpin = keyframes`
	0% {
		transform: rotate(-130deg);
	}
	50% {
		transform: rotate(5deg);
	}
	100% {
		transform: rotate(-130deg);
	}
`;

const dots = keyframes`
	0% {
		width: 0;
		opacity: 0;
	}
	55% {
		width: 12px;
		opacity: 1;
	}
	99% {
		width: 12px;
		opacity: 1;
	}
	100% {
		width: 0;
		opacity: 0;
	}
`;

export const StyledLoadingOuterOverlay = styled.span.withConfig({ displayName: "StyledLoadingOuterOverlay-sc-" })<{
	single?: boolean;
	variant?: OverlayVariant;
	global?: boolean;
	visible?: boolean;
}>(({ theme, single, variant, global, visible }) => {
	const { outerOverlay, innerOverlay, brightBG } = theme.components.progressIndicator;

	const backgroundColor = variant
		? variant === "bright"
			? brightBG
			: "transparent"
		: single
			? innerOverlay.background
			: outerOverlay.background;

	return css`
		animation: ${fadeIn()} ${outerOverlay.animationDuration};
		background-color: ${backgroundColor};
		box-shadow: ${variant && "none"};
		height: 100%;
		left: 0;
		outline: none;
		overflow: hidden;
		position: ${global ? "fixed" : "absolute"};
		right: 0;
		top: 0;
		user-select: none;
		visibility: ${!visible && "hidden"};
		// Remove animation since the outer overlay is flickering on the iPad
		${provider.isTablet() &&
		css`
			animation-name: none;
		`}
	`;
});

export const StyledLoadingInnerOverlay = styled.span.withConfig({ displayName: "StyledLoadingInnerOverlay-sc-" })<{
	single?: boolean;
	noAnimation?: boolean;
	variant?: OverlayVariant;
}>(({ theme, noAnimation, variant, single }) => {
	const { innerOverlay, brightBG } = theme.components.progressIndicator;

	const backgroundColor = variant
		? variant === "bright"
			? brightBG
			: "transparent"
		: single
			? "transparent"
			: innerOverlay.background;

	return css`
		align-items: center;
		background-color: ${backgroundColor};
		border-radius: ${innerOverlay.borderRadius};
		box-shadow: ${!single && !variant && innerOverlay.boxShadow};
		display: flex;
		flex-direction: column;
		justify-content: center;
		left: 50%;
		outline: none;
		padding: ${innerOverlay.padding};
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		transform-origin: top left;
		user-select: none;

		${!noAnimation &&
		css`
			animation:
				${fadeIn()} ${innerOverlay.animationDuration},
				${scale} ${innerOverlay.animationDuration};
		`}

		&:focus {
			${brightFocus}
		}
	`;
});

export const StyledLoadingCircle = styled.span.withConfig({ displayName: "StyledLoadingCircle-sc-" })<{
	noAnimation?: boolean;
	size?: ProgressIndicatorSize;
	horizontal?: boolean;
}>(({ theme, noAnimation = true, size, horizontal }) => {
	const { circle, label } = theme.components.progressIndicator;
	const sizeValue = circle.size[size as keyof typeof circle.size] ?? circle.size.big;

	return css`
		display: flex;
		flex-shrink: 0;
		height: ${sizeValue};
		margin: ${circle.margin};
		position: relative;
		width: ${sizeValue};
		${!noAnimation &&
		css`
			animation: ${fadeIn()} ${circle.animation.duration} ${circle.animation.timingFunction};
		`}

		~ ${StyledLoadingLabel} {
			margin: ${label.withCircleMargin};
		}
		${size === "small" &&
		css`
			font-size: 0;
			margin: ${circle.smallMargin};

			~ ${StyledLoadingLabel} {
				margin: ${label.small.margin};
			}
		`}
		${horizontal &&
		css`
			&:not(:only-child) {
				margin-left: 0;

				~ ${StyledLoadingLabel} {
					margin: ${label.horizontalWithCircleMargin};
					text-align: left;
				}
			}
		`}
	`;
});

export const StyledLoadingCircleLayer = styled.span.withConfig({ displayName: "StyledLoadingCircleLayer-sc-" })<{
	borderColor?: string;
}>(({ theme, borderColor }) => {
	const { circle } = theme.components.progressIndicator;

	return css`
		animation: ${rotateCircle} 4s linear infinite both;
		border-color: ${borderColor ?? circle.borderBottomColor};
		height: 100%;
		position: absolute;
		width: 100%;
	`;
});

export const StyledLoadingHalfCircle = styled.span.withConfig({ displayName: "StyledLoadingHalfCircle-sc-" })`
	border-color: inherit;
	display: inline-block;
	height: 100%;
	position: relative;
	overflow: hidden;
	width: 50%;
`;

export const StyledLoadingCircleSpinner = styled.span.withConfig({ displayName: "StyledLoadingCircleSpinner-sc-" })<{
	position: "left" | "right";
}>(({ theme, position }) => {
	return css`
		animation: 2.5s linear infinite both;
		border: ${theme.components.progressIndicator.circle.border};
		border-color: inherit;
		border-bottom-color: transparent;
		border-radius: 50%;
		box-sizing: border-box;
		bottom: 0;
		content: "";
		display: block;
		height: 100%;
		position: absolute;
		top: 0;
		width: 200%; // To get the width of circle layer selector
		${position === "left" &&
		css`
			animation-name: ${leftSpin};
			border-right-color: transparent;
			border-right-style: dotted;
			left: 0;
		`}
		${position === "right" &&
		css`
			animation-name: ${rightSpin};
			border-left-color: transparent;
			border-left-style: dotted;
			right: 0;
		`}
	`;
});

export const StyledLoadingLabel = styled.span.withConfig({ displayName: "StyledLoadingLabel-sc-" })<{
	useDots?: boolean;
	noAnimation?: boolean;
	small?: boolean;
	outerOverlayVariant?: OverlayVariant;
	innerOverlayVariant?: OverlayVariant;
}>(({ theme, useDots, noAnimation, small, outerOverlayVariant, innerOverlayVariant }) => {
	const { circle, label } = theme.components.progressIndicator;
	const color =
		outerOverlayVariant && innerOverlayVariant && outerOverlayVariant === innerOverlayVariant
			? label.withOverlayColor
			: label.color;

	return css`
		color: ${color};
		cursor: default;
		font-style: italic;
		font-size: ${small && label.small.fontSize};
		font-weight: ${label.fontWeight};
		margin: ${label.margin};
		user-select: none;
		text-align: center;
		${!noAnimation &&
		css`
			animation: ${fadeIn()} ${circle.animation.duration} ${circle.animation.timingFunction};
		`}
		${useDots &&
		css`
			flex: 1;
			padding-right: 12px;
			position: relative;

			&:after {
				content: "...";
				overflow: hidden;
				position: absolute;
				animation: ${dots} 2s ease-in-out infinite;
				text-align: left;
			}
		`}
	`;
});
