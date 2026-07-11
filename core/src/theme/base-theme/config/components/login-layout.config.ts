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

import type { BaseThemeCore } from "../../schema.js";

export type LoginLayoutConfigType = {
	background: { color: string; padding: string; position: string; repeat: string; size: string };
	beforeAfterHeight: string;
	container: {
		background: string;
		padding: string;
		secondaryBackground: string;
		spacingBottom: string;
		top: string;
		width: string;
	};
	footer: { itemMargin: string; margin: string };
	formItem: { labelColor: string; marginBottom: string };
	headline: {
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		lineHeight: string;
		marginBottom: string;
	};
	logo: { marginBottom: string; maxHeight: string; minHeight: string; width: string };
	mobile: { margin: string; padding: string; spacingBottom: string };
};

export const loginLayoutConfig = (theme: BaseThemeCore): LoginLayoutConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const applicationStyles = theme.applicationStyles;

	return {
		container: {
			background: colors.background.primaryBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing4xl}px ${spacing.horizontalSpacing.horizWhiteSpacing4xl}px 0 ${spacing.horizontalSpacing.horizWhiteSpacing4xl}px`,
			secondaryBackground: colors.background.secondaryBackground,
			spacingBottom: spacing.verticalSpacing.vertWhiteSpacing4xl + "px",
			top: "20%",
			width: 4.5 * spacing.spacing.spacing2Xl + "px"
		},
		logo: {
			marginBottom: spacing.verticalSpacing.vertWhiteSpacingxl + "px",
			maxHeight: 3.5 * spacing.baseSpacing.BASE + "px",
			minHeight: spacing.spacing.spacingMd + "px",
			width: 3 * spacing.spacing.spacing2Xl + "px"
		},
		headline: {
			color: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.bigFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			lineHeight: `${theme.typography.lineHeight.base}`,
			marginBottom: spacing.verticalSpacing.vertWhiteSpacinglg + "px"
		},
		formItem: {
			marginBottom: spacing.verticalSpacing.vertWhiteSpacingsm + "px",
			labelColor: applicationStyles.label.fontColor
		},
		footer: {
			margin: `${spacing.verticalSpacing.vertWhiteSpacingmd}px 0 0 0 `,
			itemMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingmd}px 0`
		},
		background: {
			color: colors.primaryColor,
			position: "center",
			repeat: "no-repeat",
			size: "cover",
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		mobile: {
			margin: "0 auto",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxl}px ${spacing.horizontalSpacing.horizWhiteSpacingxl}px 0 ${spacing.horizontalSpacing.horizWhiteSpacingxl}px`,
			spacingBottom: spacing.verticalSpacing.vertWhiteSpacingxl + "px"
		},
		beforeAfterHeight: spacing.verticalSpacing.vertWhiteSpacingmd + "px"
	};
};
