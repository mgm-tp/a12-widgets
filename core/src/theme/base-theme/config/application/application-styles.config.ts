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

import type { BaseThemeSpacingType } from "../../../schema/spacing.api.js";
import type { BaseThemeColorsType } from "../../../schema/base-colors.api.js";
import type { BaseThemeTypographyType } from "../../../schema/typography.api.js";
import type { ApplicationStyle } from "../../../schema/application-styles.api.js";

import { ResponsiveConfig } from "../base/responsive.config.js";

export const ApplicationStyles = (params: {
	colors: BaseThemeColorsType;
	typography: BaseThemeTypographyType;
	spacing: BaseThemeSpacingType;
}): ApplicationStyle => {
	const { colors, typography, spacing } = params;

	return {
		background: colors.background.secondaryBackground,
		boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
		color: colors.text.color,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		responsive: ResponsiveConfig,
		// NOTE: This should be moved to GlobalStyles in a future major version.
		paragraphMargin: "1rem 0",
		input: {
			activeBoxShadow: `0 2px 0 0 ${colors.interaction.active.colorTouch}`,
			background: colors.background.primaryBackground,
			borderRadius: 0,
			boxShadow: `0 1px 0 0 ${colors.secondaryColor}`,
			defaultBorder: "0 1px 0 0",
			focusBorder: "0 2px 0 0",
			focusBoxShadow: `0 2px 0 0 ${colors.interaction.focus.color}`,
			fontColor: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			hoverBorder: "0 2px 0 0",
			hoverBoxShadow: `0 2px 0 0 ${colors.interaction.hover.color}`,
			lineHeight: 1.45,
			height: spacing.spacing.spacingLg + "px"
		},
		label: {
			disabledColor: colors.interaction.disabled.colorDark,
			fontColor: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			textTransform: "none"
		}
	};
};

export const applicationStylesOverrides = (params: {
	colors: BaseThemeColorsType;
	hoverStyles: { hoverStyle: string };
}) => {
	const { colors, hoverStyles } = params;

	return {
		input: {
			activeBoxShadow: hoverStyles.hoverStyle,
			background: colors.background.primaryBackground,
			borderRadius: "4px",
			boxShadow: `0 0 0 1px ${colors.divider.colorBorder}`,
			defaultBorder: "0 0 0 1px",
			focusBorder: "0 0 0 2px",
			focusBoxShadow: `0 0 0 2px ${colors.interaction.primaryInteractionColor}`,
			hoverBorder: "0 0 0 2px",
			hoverBoxShadow: hoverStyles.hoverStyle
		}
	};
};
