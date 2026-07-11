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
import { mergeConfig } from "../../utils/merge-config.js";

export type ListConfigType = {
	background: string;
	border: string;
	dividerBorder: string;
	dividerMargin: number;
	fontFamily: string;
	item: {
		activeBorder: string;
		color: string;
		disabledColor: string;
		focusBorder: string;
		focusOutline: string;
		gap: string;
		buttonSemanticsGap?: string;
		buttonSemanticsDivider?: {
			light?: string;
			dark?: string;
		};
		graphic: {
			color: string;
			iconColor: string;
			iconFontSize: string;
			placeholder: {
				background: string;
				color: string;
				fontSize: string;
				height: string;
				lineHeight: string;
				width: string;
			};
		};
		hoverBG: string;
		hoverBorder: string;
		hoverTextDecoration?: string;
		meta: { color: string; fontSize: string; iconColor: string };
		minHeight: string;
		padding: string;
		readOnly?: {
			color: string;
		};
		secondaryText: { color: string; fontSize: string; fontWeight: number; lineHeight: string };
		selected: {
			activeLeftBorder: string;
			background: string;
			color?: string;
			focusLeftBorder: string;
			fontWeight?: number;
			hoverLeftBorder: string;
			leftBorder: string;
		};
		spacing: string;
		text: { color: string; fontSize: string; fontWeight: number };
	};
	subHeader: {
		color: string;
		fillBG: string;
		fillColor: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		lineHeight: string;
		minHeight: string;
		padding: string;
		active?: { background: string };
		hover?: { background: string };
		focus?: { background: string };
	};
};

const defaultListConfig = (theme: BaseThemeCore): ListConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	// List item min height (2.5x base spacing).
	const itemMinHeight = `${2.5 * spacing.baseSpacing.BASE}px`;

	return {
		background: colors.background.primaryBackground,
		border: `${theme.border.width.thin} solid ${colors.divider.color}`,
		dividerBorder: `${theme.border.width.thin} solid ${colors.divider.color}`,
		dividerMargin: 0,
		fontFamily: typography.font.MAIN_FONT,
		item: {
			activeBorder: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
			color: colors.text.color,
			gap: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			buttonSemanticsGap: `${2 * spacing.spacing.spacing3xs}px`,
			buttonSemanticsDivider: {
				light: `${theme.border.width.thin} solid ${colors.divider.colorLight}`,
				dark: `${theme.border.width.medium} solid ${colors.divider.colorSubtle}`
			},
			disabledColor: colors.interaction.disabled.colorDark,
			focusBorder: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
			focusOutline: focusStyles.focusedBoundaryDark,
			hoverBG: colors.background.interactiveBackground,
			hoverBorder: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			hoverTextDecoration: "none",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			readOnly: {
				color: "inherit"
			},
			selected: {
				activeLeftBorder: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouch}`,
				background: colors.interaction.selected.colorLight,
				color: "inherit",
				focusLeftBorder: `${theme.border.width.thick} solid ${colors.interaction.focus.color}`,
				fontWeight: typography.fontWeight.regularFontWeight,
				hoverLeftBorder: `${theme.border.width.thick} solid ${colors.interaction.hover.color}`,
				leftBorder: `${theme.border.width.thick} solid ${colors.interaction.selected.color}`
			},
			spacing: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			graphic: {
				color: "inherit",
				iconColor: "inherit",
				iconFontSize: typography.fontSize.lgFontSize,
				placeholder: {
					background: colors.placeHolderBackgroundDark,
					color: colors.text.invertedColor,
					fontSize: typography.fontSize.mediumFontSize,
					height: `${spacing.spacing.spacingMd}px`,
					lineHeight: `${spacing.spacing.spacingMd}px`,
					width: `${spacing.spacing.spacingMd}px`
				}
			},
			meta: {
				color: colors.text.secondaryColorDark,
				fontSize: typography.fontSize.tinyFontSize,
				iconColor: "inherit"
			},
			minHeight: itemMinHeight,
			text: {
				color: "inherit",
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: typography.fontWeight.regularFontWeight
			},
			secondaryText: {
				color: "inherit",
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: typography.fontWeight.regularFontWeight,
				lineHeight: typography.fontSize.mediumFontSize
			}
		},
		subHeader: {
			color: colors.text.color,
			fillBG: colors.secondaryColor,
			fillColor: colors.text.invertedColor,
			fontSize: typography.fontSize.smallFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			height: `${spacing.spacing.spacingLg + 2 * spacing.spacing.spacing3xs}px`,
			minHeight: `${spacing.spacing.spacingLg}px`,
			lineHeight: typography.fontSize.hugeFontSize,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			active: {
				background: colors.interaction.active.colorTouchInverted
			},
			hover: {
				background: colors.interaction.hover.colorInverted
			},
			focus: {
				background: colors.interaction.focus.colorInverted
			}
		}
	};
};

export const listOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		item: {
			selected: {
				background: colors.interaction.selected.colorInverted
			}
		},
		subHeader: {
			fillColor: colors.text.color,
			fontWeight: typography.fontWeight.boldFontWeight
		}
	};
};

export const listConfig = (theme: BaseThemeCore) => mergeConfig(defaultListConfig(theme), listOverrides(theme));
