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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type SliderConfigType = {
	container: { height: string; horizontalPadding: string; invalidMarginBottom: string; paddingTop: string };
	fill: {
		background: string;
		height: string;
		hoverBackground: string;
		leftActiveBackground: string;
		leftBG: string;
		leftDisabledBackground: string;
		leftFocusBackground: string;
	};
	label: {
		color: string;
		disabledColor: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		top: string;
	};
	thumb: {
		activeBackground: string;
		borderRadius: string | number;
		disabledBackground: string;
		focusBackground: string;
		hoverBackground: string;
		invalidBackground: string;
		readonlyBackground: string;
		size: string;
		thumbBackground: string;
		transformOrigin: string;
		transformRotate: string;
	};
	tick: {
		background: string;
		borderRadius: string | number;
		height: string;
		hoverBackground: string;
		leftActiveBackground: string;
		leftBackground: string;
		leftDisabledBackground: string;
		leftFocusBackground: string;
		top: string;
		width: string;
	};
	wrapper: { gap: string };
};

export const sliderConfig = (theme: BaseThemeType): SliderConfigType => {
	const { colors, spacing, typography } = theme;
	const tickHeight = spacing.spacing.spacingSm,
		fillHeight = spacing.spacing.spacing3xs,
		labelTop = spacing.verticalSpacing.vertWhiteSpacingsm,
		labelFontSize = typography.fontSize.tinyFontSize;

	return {
		label: {
			color: colors.text.color,
			disabledColor: colors.interaction.disabled.color,
			fontFamily: typography.font.MAIN_FONT,
			fontWeight: typography.fontWeight.regularFontWeight,
			fontSize: labelFontSize,
			top: labelTop + "px"
		},
		fill: {
			height: fillHeight + "px",
			background: colors.divider.color,
			hoverBackground: colors.interaction.hover.color,
			leftActiveBackground: colors.interaction.secondaryInteractionColor,
			leftBG: colors.divider.colorDark,
			leftDisabledBackground: colors.interaction.disabled.color,
			leftFocusBackground: colors.interaction.focus.color
		},
		tick: {
			background: colors.divider.color,
			borderRadius: "1px",
			hoverBackground: colors.interaction.hover.color,
			leftActiveBackground: colors.interaction.secondaryInteractionColor,
			leftBackground: colors.divider.colorDark,
			leftDisabledBackground: colors.interaction.disabled.color,
			leftFocusBackground: colors.interaction.focus.color,
			width: "1px",
			height: tickHeight + "px",
			top: `${fillHeight / 2 - tickHeight / 2}px`
		},
		thumb: {
			activeBackground: colors.interaction.secondaryInteractionColor,
			thumbBackground: colors.interaction.secondaryInteractionColor,
			borderRadius: "50% 50% 18% 50%",
			disabledBackground: colors.interaction.disabled.color,
			focusBackground: colors.interaction.focus.color,
			size: 1.5 * spacing.spacing.spacingSm + "px",
			hoverBackground: colors.interaction.hover.color,
			invalidBackground: colors.variant.errorColor,
			readonlyBackground: colors.interaction.readonly.color,
			transformOrigin: "79% -31%", // Adapt when changing rotation
			transformRotate: "45deg"
		},
		container: {
			invalidMarginBottom: spacing.verticalSpacing.vertWhiteSpacing2xs + "px",
			horizontalPadding: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			paddingTop: `${tickHeight / 2}px`,
			height: `${tickHeight / 2 + fillHeight + labelTop}px`
		},
		wrapper: {
			gap: spacing.spacing.spacing2xs + "px"
		}
	};
};
