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

import { rgba } from "polished";

import type { BaseThemeCore } from "../../schema.js";

export type ProgressIndicatorConfigType = {
	brightBG: string;
	circle: {
		animation: { duration: string; timingFunction: string };
		border: string;
		borderBottomColor: string;
		margin: string;
		size: { big: string; medium: string; small: string };
		smallMargin: string;
	};
	innerOverlay: {
		animationDuration: string;
		background: string;
		borderRadius: string | number;
		boxShadow: string;
		padding: string;
	};
	label: {
		color: string;
		fontWeight: number;
		horizontalWithCircleMargin: string;
		margin: string;
		small: { fontSize: string; margin: string };
		withCircleMargin: string;
		withOverlayColor: string;
	};
	outerOverlay: { animationDuration: string; background: string };
};

export const progressIndicatorConfig = (theme: BaseThemeCore): ProgressIndicatorConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		brightBG: rgba(colors.background.secondaryBackground, theme.opacity.nearFull),
		circle: {
			animation: {
				duration: "0.4s",
				timingFunction: "cubic-bezier(0,0,1,-1)"
			},
			border: "3px solid transparent",
			borderBottomColor: colors.highlightColor,
			margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			smallMargin: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			size: {
				small: 1.25 * spacing.baseSpacing.BASE + "px",
				medium: spacing.spacing.spacingMd + "px",
				big: 2.5 * spacing.baseSpacing.BASE + "px"
			}
		},
		innerOverlay: {
			animationDuration: theme.motion.duration.slow,
			background: colors.shadow.overlayDeep,
			borderRadius: theme.border.radius.sm,
			boxShadow: `0 0 2px ${colors.boxShadowBackground}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		label: {
			color: colors.text.invertedColor,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			horizontalWithCircleMargin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			small: {
				fontSize: typography.fontSize.tinyFontSize,
				margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0 0 0`
			},
			withCircleMargin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			withOverlayColor: colors.text.color
		},
		outerOverlay: {
			animationDuration: "0.2s",
			background: rgba(colors.boxShadowBackground, theme.opacity.low)
		}
	};
};
