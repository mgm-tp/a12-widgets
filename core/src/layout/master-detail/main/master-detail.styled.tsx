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
 * This is an internal module extracted for automated testing. Do not use.
 */
import { TransitionGroup } from "react-transition-group";
import type { CSSTransitionProps } from "react-transition-group/CSSTransition.js";
import { css, keyframes, styled } from "styled-components";

import { addPrefix } from "../../../common/main/utils.js";
import type { DefaultThemeType } from "../../../theme/schema.js";

import { useTransitionContext } from "./master-detail.context.js";

const basePaneClassName = addPrefix("masterDetailLayoutPane");

const sliceLeftToRightAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
`;

const sliceRightToLeftAnimation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
`;

export const StyledMasterDetailPlaceholder = styled.div.withConfig({ displayName: "StyledMasterDetailPlaceholder" })`
	width: 100%;
	height: 100%;
`;

export const StyledMasterDetailHeader = styled.div.withConfig({ displayName: "StyledMasterDetailHeader" })(
	({ theme }) => {
		return css`
			display: flex;
			flex-wrap: wrap;
			flex-shrink: 0;
			padding: ${theme.components.masterDetailLayout.header.padding};
		`;
	}
);

export const StyledMasterDetailTitle = styled.p.withConfig({ displayName: "StyledMasterDetailTitle" })(({ theme }) => {
	const { fontFamily, fontSize, fontWeight, lineHeight, margin, padding, width } =
		theme.components.masterDetailLayout.title;

	return css`
		font-family: ${fontFamily};
		font-size: ${fontSize};
		font-weight: ${fontWeight};
		line-height: ${lineHeight};
		margin: ${margin};
		padding: ${padding};
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		width: ${width};
	`;
});

export const StyledMasterDetailLayoutPane = styled.div.withConfig({ displayName: "StyledMasterDetailLayoutPane" })<
	{
		$smallView?: boolean;
		$isRtl: boolean;
		$numOfColumns: number;
		$columnsCount: number;
		$width?: number | string;
		$maxWidth?: number | string;
		$isResizable: boolean;
	} & Partial<CSSTransitionProps>
>(({ theme, $numOfColumns, $smallView, $isRtl, $width, $columnsCount, $isResizable }) => {
	const masterDetailLayout = theme.components.masterDetailLayout;
	const isTransitioning = useTransitionContext().isTransitioning;
	const smallViewAnimation = $isRtl ? sliceRightToLeftAnimation : sliceLeftToRightAnimation;
	const widthValue = typeof $width === "number" ? `${$width}px` : $width;
	const newWidth =
		widthValue && $isResizable
			? `width: ${$columnsCount > 1 ? widthValue : "100%"}`
			: $smallView
				? "width: 100%"
				: `flex: ${$numOfColumns};`;
	const resetWidth = widthValue ? "width: 0" : "flex: 0";
	const animationDuration = masterDetailLayout.pane.animationDuration;

	return css`
		box-sizing: border-box;
		display: flex;
		padding: ${masterDetailLayout.spacingForBoxShadow} ${masterDetailLayout.spacingBetweenPanes};
		overflow: hidden;
		will-change: max-width, flex, width;

		&.${basePaneClassName}--enter, &.${basePaneClassName}--exit {
			min-width: ${$smallView ? "100%" : "initial"};
		}

		&:not(:first-child) {
			border-left: ${masterDetailLayout.pane.nonFirstChildLeftBorder};
		}

		&:not(.${basePaneClassName}--enter):not(.${basePaneClassName}--exit) {
			${newWidth};
			${$width &&
			css`
				transition: all ${animationDuration};
			`}
		}

		&.${basePaneClassName}--enter {
			${resetWidth};
			max-width: 0;
			${$smallView &&
			css`
				&,
				+ .${basePaneClassName}--exit {
					animation: ${smallViewAnimation} ${animationDuration};
				}
			`}
		}

		&.${basePaneClassName}--enter-active {
			${newWidth};
			transition:
				max-width ${animationDuration},
				order 0s;
			max-width: 100%;
		}

		&.${basePaneClassName}--exit {
			${newWidth};
			${!widthValue &&
			css`
				flex-grow: 12;
			`}
			max-width: 100%
		}
		&.${basePaneClassName}--exit-active {
			${resetWidth};
			max-width: 0;
			// The ease-in transition is needed to make the flex animation slower than the max-width animation, which helps prevent the pane from jumping when animating out.
			transition:
				all ${animationDuration},
				flex ${animationDuration} ease-in,
				order 0s;
		}

		&:first-child {
			padding-left: ${masterDetailLayout.spacingForBoxShadow};

			${!isTransitioning &&
			$isResizable &&
			css`
				overflow: visible;
			`}
		}
		&:last-child {
			padding-right: ${masterDetailLayout.spacingForBoxShadow};
		}
	`;
});

const layoutBodyCSS = (theme: DefaultThemeType, smallView: boolean, isRtl: boolean) => {
	const { body } = theme.components.masterDetailLayout;

	return css`
		display: flex;
		flex-direction: ${isRtl ? `row-reverse` : `row`};
		flex: 1 1 auto;
		margin: ${body.margin};
		overflow: ${smallView ? "hidden" : "auto"};

		${isRtl &&
		css`
			.${basePaneClassName}--exit:not(.${basePaneClassName}--rtl)
				+ .${basePaneClassName}--rtl,
				.${basePaneClassName}--rtl
				+ .${basePaneClassName}--exit:not(.${basePaneClassName}--rtl) {
				order: -1;
			}
			.${basePaneClassName}--enter + .${basePaneClassName}--exit:not(.${basePaneClassName}--rtl) {
				order: 1;
			}
		`}
	`;
};

export const StyledMasterDetailLayoutBodyWithoutAnimation = styled.div.withConfig({
	displayName: "StyledMasterDetailLayoutBodyWithoutAnimation"
})<{
	$smallView: boolean;
	$isAnimateRtl: boolean;
	$animation: boolean;
}>(({ $smallView, $isAnimateRtl, theme }) => {
	return layoutBodyCSS(theme, $smallView, $isAnimateRtl);
});

export const StyledMasterDetailLayoutBody = styled(
	({ $smallView, $isAnimateRtl: $isAnimateRtl, $animation, ...rest }) => <TransitionGroup {...rest} />
).withConfig({ displayName: "StyledMasterDetailLayoutBody" })<{
	$smallView: boolean;
	$isAnimateRtl: boolean;
	$animation: boolean;
}>(({ $smallView, $isAnimateRtl, theme }) => {
	return layoutBodyCSS(theme, $smallView, $isAnimateRtl);
});

export const StyledMasterDetailLayoutView = styled.div.withConfig({ displayName: "StyledMasterDetailLayoutView" })<{
	smallView?: boolean;
}>(({ smallView, theme }) => {
	const { masterDetailLayout } = theme.components;

	return css`
		background-color: ${masterDetailLayout.background};
		border-radius: ${masterDetailLayout.borderRadius};
		display: flex;
		flex: 1 1 auto;
		flex-flow: column;
		height: 100%;
		overflow: hidden;

		${smallView &&
		css`
			${StyledMasterDetailLayoutBody} ${StyledMasterDetailLayoutPane} {
				padding: 0;
			}
		`}
	`;
});
