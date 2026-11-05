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
import { motion } from "motion/react";
import { css, styled } from "styled-components";

import type { DefaultThemeType } from "../../../theme/schema.js";

/**
 * @deprecated No longer used internally; the placeholder pane has been removed from the layout.
 * Use {@link StyledMasterDetailLayoutBody} directly if you need a full-size container. Retained for
 * backward compatibility.
 */
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

export const StyledMasterDetailLayoutPane = styled(motion.div).withConfig({
	displayName: "StyledMasterDetailLayoutPane"
})<{
	$width?: number | string;
	$flexGrow?: number;
	$isResizable: boolean;
	$isTransitioning?: boolean;

	/** @deprecated No longer used; the pane no longer needs the small-view flag. */
	$smallView?: boolean;

	/** @deprecated No longer used; animation direction is handled internally via Motion. */
	$isRtl?: boolean;

	/** @deprecated No longer used; column layout is derived from flex sizing. */
	$numOfColumns?: number;

	/** @deprecated No longer used; column layout is derived from flex sizing. */
	$columnsCount?: number;

	/** @deprecated No longer used. */
	$maxWidth?: number | string;
}>(({ theme, $width, $flexGrow, $isResizable, $isTransitioning }) => {
	const masterDetailLayout = theme.components.masterDetailLayout;
	// `$width` accepts a number (treated as px) for backward compatibility; internally we use a string.
	const widthValue = typeof $width === "number" ? `${$width}px` : $width;

	const sizing = $isResizable
		? css`
				${
					widthValue &&
					css`
						width: ${widthValue};
					`
				}
			`
		: css`
				${
					$flexGrow !== undefined &&
					css`
						flex: ${$flexGrow} 1 0%;
					`
				}
				min-width: 0;
			`;

	return css`
		box-sizing: border-box;
		display: flex;
		padding: ${masterDetailLayout.spacingForBoxShadow} ${masterDetailLayout.spacingBetweenPanes};
		overflow: hidden;

		${sizing}

		&:not(:first-child) {
			border-left: ${masterDetailLayout.pane.nonFirstChildLeftBorder};
		}

		&:first-child {
			padding-left: ${masterDetailLayout.spacingForBoxShadow};

			${
				!$isTransitioning &&
				$isResizable &&
				css`
					overflow: visible;
				`
			}
		}
		&:last-child {
			padding-right: ${masterDetailLayout.spacingForBoxShadow};
		}
	`;
});

export const StyledMasterDetailLayoutPaneContentWrapper = styled.div.withConfig({
	displayName: "StyledMasterDetailLayoutPaneContentWrapper"
})(({ theme }) => {
	const { content } = theme.components.masterDetailLayout.pane;

	return css`
		background: ${content?.background};
		border-radius: ${content?.borderRadius}px;
		display: flex;
		flex: 1 1 auto;
		min-width: 0;
		width: 100%;
		height: 100%;
	`;
});

export const StyledMasterDetailLayoutPaneContent = styled(motion.div).withConfig({
	displayName: "StyledMasterDetailLayoutPaneContent"
})`
	display: flex;
	flex: 1 1 auto;
	min-width: 0;
	width: 100%;
	height: 100%;
`;

const layoutBodyCSS = (theme: DefaultThemeType, smallView: boolean, isSingleView?: boolean): ReturnType<typeof css> => {
	const { body } = theme.components.masterDetailLayout;

	return css`
		display: flex;
		flex: 1 1 auto;
		margin: ${body.margin};
		overflow: ${smallView || isSingleView ? "hidden" : "auto"};
	`;
};

export const StyledMasterDetailLayoutBody = styled.div.withConfig({
	displayName: "StyledMasterDetailLayoutBody"
})<{
	$smallView: boolean;
	$isSingleView?: boolean;

	/** @deprecated No longer used; the body no longer wraps a TransitionGroup and does not animate. */
	$isAnimateRtl?: boolean;

	/** @deprecated No longer used; the body no longer wraps a TransitionGroup and does not animate. */
	$animation?: boolean;
}>(({ $smallView, $isSingleView, theme }) => {
	return layoutBodyCSS(theme, $smallView, $isSingleView);
});

/**
 * @deprecated The Master-Detail body no longer wraps a `TransitionGroup`, so there is no longer a
 * separate "without animation" variant. Use {@link StyledMasterDetailLayoutBody} directly instead.
 * Retained for backward compatibility; behaves identically to `StyledMasterDetailLayoutBody`, and
 * the `$isAnimateRtl` and `$animation` props are ignored.
 */
export const StyledMasterDetailLayoutBodyWithoutAnimation = styled.div.withConfig({
	displayName: "StyledMasterDetailLayoutBodyWithoutAnimation"
})<{
	$smallView: boolean;
	$isAnimateRtl?: boolean;
	$animation?: boolean;
}>(({ $smallView, theme }) => {
	return layoutBodyCSS(theme, $smallView);
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

		${
			smallView &&
			css`
				${StyledMasterDetailLayoutBody} ${StyledMasterDetailLayoutPane} {
					padding: 0;
				}
			`
		}
	`;
});
