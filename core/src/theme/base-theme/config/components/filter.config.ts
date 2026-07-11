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

export type FilterConfigType = {
	actionButton: { borderLeft: string; icon: { fontSize: string } };
	background: string;
	borderRadius: string | number;
	content: {
		active: { border: string; color: string };
		focus: { border: string; color: string };
		hover: { border: string; color: string };
		maxWidth: string;
		minWidth: string;
		padding: string;
	};
	height: string;
	indicator: {
		active: {
			activeBackground: string;
			background: string;
			disabledBackground: string;
			focusBackground: string;
			hoverBackground: string;
			width: string;
		};
	};
	margin: string;
	marginRight: string;
	maxWidth: string;
	name: {
		arrow: { borderBottomColor: { active: string; default: string; focus: string; hover: string }; size: string };
		color: string;
		fontFamily: string;
		fontSize: string;
		lineHeight: string;
		text: { margin: string };
	};
	options: {
		color: string;
		disabledColor: string;
		fontFamily: string;
		fontSize: string;
		fontStyle: string;
		lineHeight: string;
		padding: string;
	};
	prefix: {
		background: string;
		borderRadius: string | number;
		color: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		marginRight: string;
		width: string;
	};
};

const defaultFilterConfig = (theme: BaseThemeCore): FilterConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	const filterBarContentSpacingBottom = `${spacing.verticalSpacing.vertWhiteSpacingxs - 2}px`;
	const filterMarginRight = `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`;
	const filterMargin = `${filterBarContentSpacingBottom} ${filterMarginRight} 0 0`;

	return {
		background: colors.background.primaryBackground,
		borderRadius: theme.border.radius.md,
		height: `${spacing.spacing.spacingLg + 8}px`,
		margin: filterMargin,
		marginRight: filterMarginRight,
		maxWidth: `calc(100% - ${filterMarginRight})`,
		options: {
			color: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontStyle: "italic",
			lineHeight: `${typography.lineHeight.base}`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px 0 0`,
			disabledColor: colors.interaction.disabled.colorDark
		},
		content: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			maxWidth: `${5.25 * spacing.spacing.spacingXl + spacing.spacing.spacingXs}px`,
			minWidth: `${2 * spacing.spacing.spacingMd + spacing.spacing.spacingXs}px`,
			active: {
				color: colors.interaction.active.colorTouch,
				border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`
			},
			hover: {
				color: colors.interaction.hover.color,
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			},
			focus: {
				color: colors.interaction.focus.color,
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
			}
		},
		indicator: {
			active: {
				width: `${spacing.spacing.spacing2xs}px`,
				background: colors.variant.infoColor,
				disabledBackground: colors.interaction.disabled.colorDark,
				activeBackground: colors.interaction.active.colorTouch,
				hoverBackground: colors.interaction.hover.color,
				focusBackground: colors.interaction.focus.color
			}
		},
		name: {
			color: colors.text.secondaryColorDark,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			lineHeight: `${typography.lineHeight.tight}`,
			text: {
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
			},
			arrow: {
				size: theme.border.width.thick,
				borderBottomColor: {
					default: colors.graphicSecondaryColorDark,
					active: colors.interaction.active.colorTouch,
					hover: colors.interaction.hover.color,
					focus: colors.interaction.focus.color
				}
			}
		},
		prefix: {
			width: `${spacing.spacing.spacingMd + 4}px`,
			height: `${spacing.spacing.spacingMd + 4}px`,
			marginRight: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			borderRadius: theme.border.radius.md,
			background: colors.background.secondaryBackground,
			color: colors.text.color,
			fontSize: typography.fontSize.smallFontSize,
			fontWeight: typography.fontWeight.boldFontWeight
		},
		actionButton: {
			borderLeft: `${theme.border.width.thin} solid ${colors.divider.color}`,
			icon: {
				fontSize: typography.fontSize.lgFontSize
			}
		}
	};
};

export const filterOverrides = () => {
	return {
		actionButton: {
			borderLeft: "none"
		}
	};
};

export const filterConfig = (theme: BaseThemeCore): FilterConfigType =>
	mergeConfig(defaultFilterConfig(theme), filterOverrides());
