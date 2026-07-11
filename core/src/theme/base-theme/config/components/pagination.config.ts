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

export type PaginationConfigType = {
	buttonIconFontSize: string;
	select: {
		arrow: { color: string; disabledColor: string; fontSize: string; iconWidth: string };
		background: string;
		title: {
			activeBorder: string;
			border: { radius: string | number; width: string };
			focusBorder: string;
			height: string;
			hoverBorder: string;
		};
		width: string;
	};
	simple: {
		border: string;
		borderRadius: string | number;
		button: {
			active: { background: string; border: string };
			color: string;
			disabledColor: string;
			focus: { background: string; border: string; color: string };
			hover: { background: string; border: string };
			iconFontSize: string;
			padding: string;
		};
		color: string;
		label: { fontFamily: string; fontSize: string; margin: string; minWidth: string };
	};
};

const defaultPaginationConfig = (theme: BaseThemeCore): PaginationConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		buttonIconFontSize: typography.fontSize.lgFontSize,
		select: {
			arrow: {
				color: colors.secondaryColor,
				disabledColor: colors.interaction.disabled.colorDark,
				fontSize: typography.fontSize.hugeFontSize,
				iconWidth: spacing.spacing.spacingMd + "px"
			},
			background: colors.background.interactiveBackground,
			title: {
				activeBorder: `${theme.border.width.medium} solid ${colors.interaction.active.color}`,
				border: {
					radius: theme.border.radius.sm,
					width: "2px"
				},
				focusBorder: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
				height: `calc(${spacing.spacing.spacingXs}px + ${typography.fontSize.mediumFontSize})`,
				hoverBorder: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			},
			width: `calc(${spacing.spacing.spacingLg}px + 3.25rem)`
		},
		simple: {
			border: `${theme.border.width.thin} solid ${colors.divider.colorLight}`,
			borderRadius: theme.border.radius.sm,
			button: {
				active: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouchInverted}`
				},
				color: colors.text.invertedColor,
				disabledColor: colors.text.invertedColor,
				focus: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.colorInverted}`,
					color: colors.interaction.focus.colorInverted
				},
				hover: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.colorInverted}`
				},
				iconFontSize: typography.fontSize.lgFontSize,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`
			},
			color: colors.text.invertedColor,
			label: {
				fontFamily: typography.font.MAIN_FONT,
				fontSize: typography.fontSize.tinyFontSize,
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				minWidth: 2.5 * spacing.baseSpacing.BASE + "px"
			}
		}
	};
};

export const paginationOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		select: {
			arrow: {
				color: colors.interaction.color,
				fontSize: typography.fontSize.lgFontSize
			},
			background: colors.interaction.colorBG,
			title: {
				activeBorder: `${theme.border.width.medium} solid ${colors.interaction.color}`,
				border: {
					width: `${spacing.spacing.spacing3xs}px`
				},
				focusBorder: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
				hoverBorder: `${theme.border.width.medium} solid ${colors.interaction.color}`
			}
		}
	};
};

export const paginationConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultPaginationConfig(theme), paginationOverrides(theme));
