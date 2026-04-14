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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type ChartsConfigType = {
	barChart: { spacing: string; spacingMinWidth: string };
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	legend: {
		background: string;
		baseSpacing: string;
		boxShadow: string;
		item: { activeAndHoverBG: string; padding: string };
		surface: { margin: string; minWidth: string };
	};
	pieChart: {
		border: string;
		hideableBG: string;
		size: string;
		legend: {
			background: string;
		};
	};
	textColor: string;
};

export const chartsConfig = (theme: BaseThemeType): ChartsConfigType => {
	const { colors, spacing, typography } = theme;

	return {
		fontSize: typography.fontSize.tinyFontSize,
		fontFamily: typography.font.MAIN_FONT,
		fontWeight: typography.fontWeight.boldFontWeight,
		textColor: colors.text.color,
		barChart: {
			spacing: `${spacing.spacing.spacingMd}px`,
			spacingMinWidth: `${spacing.spacing.spacingSm}px`
		},
		pieChart: {
			border: `1px solid ${colors.interaction.active.color}`,
			size: `${spacing.spacing.spacingSm}px`,
			hideableBG: rgba(colors.background.primaryBackground, 0.8),
			legend: {
				background: colors.background.primaryBackground
			}
		},
		legend: {
			background: colors.background.primaryBackground,
			boxShadow: `0 0 0 1px ${colors.divider.colorDark}`,
			item: {
				activeAndHoverBG: colors.background.interactiveBackground,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			baseSpacing: `${spacing.baseSpacing.BASE}px`,
			surface: {
				minWidth: `${spacing.spacing.spacingLg}px`,
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
			}
		}
	};
};
