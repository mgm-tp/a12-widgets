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

export type SwitchConfigType = {
	control: {
		gap: string;
	};
	label: {
		cursor: string;
	};
	optionLabel: {
		checkedMargin: string;
		color: string;
		fontFamily: string;
		fontSize: string;
		uncheckedMargin: string;
		weight: number;
	};
	thumb: {
		active: { color: string; size: string };
		border: string;
		checkedIconColor: string;
		color: string;
		disabled: { backgroundColor: string; borderWidth: string; color: string };
		errorColor: string;
		focus: { color: string; size: string };
		hover: { color: string; size: string };
		uncheckedIconColor: string;
		iconSize?: string;
		infoColor: string;
		readonly: { borderWidth: string; color: string };
		size: string;
		uncheckedBackground: string;
		warningColor: string;
	};
	track: {
		border: string;
		disabled: { background: string; borderColor: string };
		height: string;
		readonly: { background: string; borderColor: string };
		uncheckedBackground: string;
		width: string;
	};
	transitionTiming: string;
};

export const switchConfig = (theme: BaseThemeType): SwitchConfigType => {
	const { colors, spacing, typography } = theme;

	return {
		control: {
			gap: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
		},
		label: {
			cursor: "pointer"
		},
		optionLabel: {
			color: colors.text.color,
			checkedMargin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			uncheckedMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`,
			weight: typography.fontWeight.regularFontWeight
		},
		thumb: {
			active: {
				color: colors.interaction.active.colorTouch,
				size: `${spacing.spacing.spacingMd - 2}px`
			},
			border: `2px solid ${colors.interaction.secondaryInteractionColor}`,
			checkedIconColor: colors.background.primaryBackground,
			color: colors.interaction.secondaryInteractionColor,
			disabled: {
				backgroundColor: colors.interaction.disabled.color,
				borderWidth: "1px",
				color: colors.interaction.disabled.colorDark
			},
			errorColor: colors.variant.errorColor,
			focus: {
				color: colors.interaction.focus.color,
				size: `${spacing.spacing.spacingMd - 2}px`
			},
			hover: {
				color: colors.interaction.hover.color,
				size: `${spacing.spacing.spacingMd - 2}px`
			},
			uncheckedIconColor: colors.interaction.secondaryInteractionColor,
			iconSize: "12px",
			infoColor: colors.variant.infoColor,
			readonly: {
				borderWidth: "1px",
				color: colors.interaction.readonly.colorDark
			},
			size: `${spacing.spacing.spacingMd - 4}px`,
			uncheckedBackground: colors.background.primaryBackground,
			warningColor: colors.variant.warningColorDark
		},
		track: {
			border: `1px dotted ${colors.graphicSecondaryColorDark}`,
			disabled: {
				background: colors.interaction.disabled.color,
				borderColor: colors.interaction.disabled.colorDark
			},
			height: `${spacing.spacing.spacingSm}px`,
			readonly: {
				background: colors.interaction.readonly.color,
				borderColor: colors.interaction.readonly.colorDark
			},
			uncheckedBackground: colors.background.interactiveBackground,
			width: `${spacing.spacing.spacingLg}px`
		},
		transitionTiming: "0.1s"
	};
};
