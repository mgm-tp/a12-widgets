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

import { GeneralColorsConfig } from "../../../base/colors.config.js";
import type { BaseThemeType } from "../../../schema/base-theme.js";

export type CalloutConfigType = {
	body: {
		backgroundColor: string;
		fontColor: string;
		fontFamily: string;
		fontSize: string;
		lineHeight: number;
		minHeight: string;
		padding: string;
		smallViewMinHeight: string;
	};
	footer: { borderTop: string; childPadding: string; gap: string; minHeight: string; padding: string };
	header: { minHeight: string };
	headerSuffix: { fontSize: string; gap: string };
	headerTitle: { fontColor: string; fontFamily: string; fontSize: string; fontWeight: number; lineHeight: number };
	inner: { backgroundColor: string; boxShadow: string; padding: string };
	pointer: { backgroundColor: string; height: string; width: string };
	width: string;
};

export const calloutConfig = (theme: BaseThemeType): CalloutConfigType => {
	const { colors, spacing, typography } = theme;

	return {
		width: "490px",
		inner: {
			backgroundColor: GeneralColorsConfig.yellowLight,
			boxShadow: `0px 0px 20px 0px ${rgba(colors.boxShadowBackground, 0.3)}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		header: {
			minHeight: `${3 * spacing.baseSpacing.BASE}px`
		},
		headerTitle: {
			fontColor: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			lineHeight: 1.45,
			fontWeight: typography.fontWeight.boldFontWeight
		},
		headerSuffix: {
			fontSize: typography.fontSize.bigFontSize,
			gap: spacing.spacing.spacingXs + "px"
		},
		pointer: {
			backgroundColor: GeneralColorsConfig.yellowLight,
			height: `${spacing.spacing.spacingXs + 2}px`,
			width: `${spacing.spacing.spacingXs + 2}px`
		},
		body: {
			backgroundColor: colors.background.primaryBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			minHeight: `${2.25 * spacing.spacing.spacingLg}px`,
			fontColor: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			lineHeight: 1.45,
			smallViewMinHeight: `${spacing.spacing.spacingLg}px`
		},
		footer: {
			borderTop: `1px solid ${colors.divider.color}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			minHeight: `${3 * spacing.baseSpacing.BASE}px`,
			gap: `${spacing.spacing.spacingXs}px`,
			childPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		}
	};
};
