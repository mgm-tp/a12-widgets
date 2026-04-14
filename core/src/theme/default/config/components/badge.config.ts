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

export type BadgeConfigType = {
	background: { error: string; info: string; success: string; warning: string; light?: string };
	borderRadius: string | number;
	boxShadow: string;
	colorVariant?: { error: string; info: string; success: string; warning: string; light: string };
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	height: string;
	padding: string;
	tiny: { height: string; width: string };
	transition: string;
};

export const badgeConfig = (theme: BaseThemeType): BadgeConfigType => {
	const { spacing, colors, typography } = theme;

	return {
		tiny: {
			width: `${spacing.spacing.spacingXs}px`,
			height: `${spacing.spacing.spacingXs}px`
		},
		borderRadius: `${spacing.spacing.spacingXs}px`,
		boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
		colorVariant: {
			error: colors.variant.text.error,
			info: colors.variant.text.info,
			success: colors.variant.text.success,
			warning: colors.variant.text.warning,
			light: colors.text.invertedColor
		},
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: typography.fontWeight.semiBoldFontWeight,
		height: `calc(${spacing.spacing.spacingSm}px + 6px)`,
		padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
		transition: "transform .25s ease-in-out",
		background: {
			error: colors.variant.errorColor,
			info: colors.variant.infoColor,
			success: colors.variant.successColor,
			warning: colors.variant.warningColorDark,
			light: colors.variant.infoColor
		}
	};
};
