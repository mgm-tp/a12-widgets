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

export type CheckboxConfigType = {
	active: { border: string; checkedBG: string };
	background: string;
	borderRadius: string | number;
	checked: { background: string; border: string; invalidBorderColor: string; margin: string };
	disabled: { background: string; border: string; checkedBG: string; checkedBorderColor: string };
	error: { border: string; checkedBG: string };
	focus: { border: string; checkedBG: string };
	hover: { border: string; checkedBG: string };
	indeterminateBackground: string;
	info: { border: string; checkedBG: string };
	inputHeight: string;
	label: {
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		lineHeight: string;
		maxWidth: string;
		verticalAlign: string;
	};
	readOnly: { background: string; border: string; checkedBG: string; checkedBorderColor: string };
	single: { fieldControlPadding: string; minHeight: string; padding: string };
	warning: { border: string; checkedBG: string };
};

export const checkboxConfig = (theme: BaseThemeType): CheckboxConfigType => {
	const { colors, spacing, typography } = theme;

	return {
		active: {
			border: `2px solid ${colors.interaction.active.colorTouch}`,
			checkedBG: colors.interaction.active.colorTouch
		},
		background: colors.background.primaryBackground,
		borderRadius: "0",
		checked: {
			background: colors.text.color,
			border: `2px solid ${colors.background.primaryBackground}`,
			invalidBorderColor: colors.variant.errorColor,
			margin: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0 0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`
		},
		disabled: {
			background: colors.interaction.disabled.color,
			border: `1px solid ${colors.interaction.disabled.colorDark}`,
			checkedBG: colors.interaction.disabled.colorDark,
			checkedBorderColor: colors.interaction.disabled.colorDark
		},
		error: {
			border: `1px solid ${colors.variant.errorColor}`,
			checkedBG: colors.variant.errorColor
		},
		focus: {
			border: `2px solid ${colors.interaction.focus.color}`,
			checkedBG: colors.interaction.focus.color
		},
		hover: {
			border: `2px solid ${colors.interaction.hover.color}`,
			checkedBG: colors.interaction.hover.color
		},
		info: {
			border: `1px solid ${colors.variant.infoColor}`,
			checkedBG: colors.variant.infoColor
		},
		indeterminateBackground: colors.text.color,
		inputHeight: `${spacing.baseSpacing.BASE + 4}px`,
		label: {
			color: "inherit",
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			lineHeight: `${spacing.baseSpacing.BASE + 4}px`,
			maxWidth: "100%",
			verticalAlign: "top"
		},
		readOnly: {
			background: colors.interaction.disabled.color,
			border: `1px solid ${colors.interaction.disabled.colorDark}`,
			checkedBG: colors.interaction.disabled.colorDark,
			checkedBorderColor: colors.interaction.disabled.colorDark
		},
		single: {
			fieldControlPadding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0`,
			minHeight: `${spacing.spacing.spacingLg}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0 0 0`
		},
		warning: {
			border: `1px solid ${colors.variant.warningColorDark}`,
			checkedBG: colors.variant.warningColorDark
		}
	};
};
