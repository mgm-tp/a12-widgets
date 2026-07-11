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

export type HeaderTriggerConfigType = {
	activatedBackground: string;
	activatedColor?: string;
	active: { background: string; border: string; color?: string; textDecoration?: string };
	border: string;
	borderRadius: string | number;
	color: string;
	focus: { background: string; border: string; color: string; outline: string };
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	gap: string;
	graphicFontSize: string;
	hover: { background: string; border: string; color?: string; textDecoration?: string };
	metaFontSize: string;
	minHeight: string;
	multilingual: {
		background: string;
		contentGap: string;
		graphicFontSize: string;
		light: {
			active: { borderColor: string; color: string };
			background: string;
			color: string;
			focus: { borderColor: string; color: string };
			hover: { borderColor: string; color: string };
		};
		padding: string;
	};
	padding: string;
	textTransform?: string;
	vertical: {
		graphicFontSize: string;
		icon: { activeColor: string; focusColor: string; hoverColor: string };
		languageFontSize: string;
	};
	// Styles for the case that only a graphic or meta icon is displayed
	onlyIcon: {
		borderRadius: string | number;
		minHeight: string;
		minWidth: string;
	};
};

const defaultHeaderTriggerConfig = (theme: BaseThemeCore): HeaderTriggerConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	return {
		activatedBackground: colors.interaction.touchOverlayDark,
		activatedColor: colors.text.invertedColor,
		active: {
			background: colors.interaction.touchOverlay,
			border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouchInverted}`,
			color: colors.interaction.active.colorTouchInverted,
			textDecoration: "none"
		},
		border: `${theme.border.width.medium} solid transparent`,
		borderRadius: theme.border.radius.sm,
		color: colors.text.invertedColor,
		focus: {
			background: colors.interaction.touchOverlay,
			border: `${theme.border.width.medium} solid ${colors.interaction.focus.colorInverted}`,
			color: colors.interaction.focus.colorInverted,
			outline: focusStyles.focusedBoundaryLight
		},
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: typography.fontWeight.regularFontWeight,
		gap: spacing.spacing.spacingXs + "px",
		hover: {
			background: colors.interaction.touchOverlay,
			border: `${theme.border.width.medium} solid ${colors.interaction.hover.colorInverted}`,
			color: colors.interaction.hover.colorInverted,
			textDecoration: "none"
		},
		graphicFontSize: typography.fontSize.lgFontSize,
		metaFontSize: typography.fontSize.lgFontSize,
		minHeight: `${spacing.spacing.spacingLg}px`,
		multilingual: {
			background: colors.placeHolderBackgroundDark,
			contentGap: spacing.spacing.spacing3xs + spacing.spacing.spacing2xs + "px",
			graphicFontSize: typography.fontSize.lgFontSize,
			light: {
				active: {
					borderColor: colors.interaction.active.colorTouch,
					color: colors.interaction.active.colorTouch
				},
				background: colors.background.interactiveBackground,
				color: colors.text.color,
				focus: {
					borderColor: colors.interaction.focus.color,
					color: colors.interaction.focus.color
				},
				hover: {
					borderColor: colors.interaction.hover.color,
					color: colors.interaction.hover.color
				}
			},
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${
				spacing.horizontalSpacing.horizWhiteSpacing3xs + spacing.horizontalSpacing.horizWhiteSpacing2xs
			}px`
		},
		padding: `0 ${spacing.spacing.spacing2xs}px`,
		textTransform: "uppercase",
		vertical: {
			icon: {
				activeColor: colors.interaction.active.colorTouch,
				focusColor: colors.interaction.focus.color,
				hoverColor: colors.interaction.hover.color
			},
			graphicFontSize: typography.fontSize.lgFontSize,
			languageFontSize: `calc(0.5 * ${typography.fontSize.mediumFontSize})`
		},
		onlyIcon: {
			borderRadius: theme.border.radius.sm,
			minHeight: `${spacing.spacing.spacingLg}px`,
			minWidth: `${spacing.spacing.spacingLg}px`
		}
	};
};

export const headerTriggerOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		activatedBackground: colors.variant.infoColorLight,
		activatedColor: colors.interaction.color,
		active: {
			background: colors.variant.infoColorLight,
			border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
			color: colors.interaction.active.colorTouch
		},
		border: `${theme.border.width.medium} solid ${colors.interaction.focus.colorInverted}`,
		borderRadius: "16px",
		color: colors.interaction.color,
		focus: {
			background: colors.interaction.focus.colorInverted,
			border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
			color: colors.interaction.focus.color
		},
		hover: {
			background: colors.interaction.hover.colorInverted,
			border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			color: colors.interaction.hover.color
		},
		multilingual: {
			background: colors.interaction.colorBG
		},
		onlyIcon: {
			borderRadius: "16px"
		}
	};
};

export const headerTriggerConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultHeaderTriggerConfig(theme), headerTriggerOverrides(theme));
