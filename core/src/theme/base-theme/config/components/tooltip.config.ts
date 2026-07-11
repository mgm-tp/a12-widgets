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

import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type TooltipConfigType = {
	activeColor: string;
	arrow: { background: string; border: string; boxShadow: string };
	color: string;
	containerMaxWidth: string;
	content: {
		background: string;
		border: string;
		borderRadius: string | number;
		boxShadow: string;
		fontFamily: string;
		fontSize: string;
		padding: string;
	};
	darkColor: string;
	error: { background: string; color: string };
	focusColor: string;
	hint: { background: string; color: string; contentColor: string };
	hoverColor: string;
	iconFontSize: string;
	nextToLabelMargin: string;
	success: { background: string; color: string; contentColor: string };
	typesQuantity: number;
	warning: { background: string; color: string; contentColor: string };
};

const defaultTooltipConfig = (theme: BaseThemeCore): TooltipConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		activeColor: colors.interaction.active.colorTouch,
		arrow: {
			background: colors.background.primaryBackground,
			border: `${theme.border.width.thin} solid ${colors.interaction.active.color}`,
			boxShadow: `2px 2px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
		},
		color: colors.variant.infoColor,
		containerMaxWidth: "500px",
		content: {
			background: colors.background.primaryBackground,
			border: `${theme.border.width.thin} solid ${colors.interaction.active.color}`,
			borderRadius: theme.border.radius.sm,
			boxShadow: `1px 2px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		darkColor: colors.text.invertedColor,
		error: {
			background: colors.variant.errorColorLight,
			color: colors.variant.errorColor
		},
		focusColor: colors.interaction.focus.color,
		hint: {
			background: colors.background.primaryBackground,
			color: colors.variant.infoColor,
			contentColor: colors.text.color
		},
		hoverColor: colors.interaction.hover.color,
		iconFontSize: typography.fontSize.lgFontSize,
		nextToLabelMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
		success: {
			background: colors.background.primaryBackground,
			color: colors.variant.successColor,
			contentColor: colors.text.color
		},
		typesQuantity: 4,
		warning: {
			background: colors.variant.warningColorLight,
			color: colors.variant.warningColor,
			contentColor: colors.variant.text.warning
		}
	};
};

export const tooltipOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		arrow: {
			border: `${theme.border.width.medium} solid ${colors.interaction.active.color}`
		},
		content: {
			border: `${theme.border.width.medium} solid ${colors.interaction.active.color}`
		},
		color: colors.variant.infoColor
	};
};

export const tooltipConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultTooltipConfig(theme), tooltipOverrides(theme));
