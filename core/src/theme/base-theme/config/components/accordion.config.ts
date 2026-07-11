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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type AccordionConfigType = {
	details: { background: string; fontSize?: string; menu: { paddingLeft: string } };
	fontFamily: string;
	graphic: { color: string; fontSize: string; padding: string };
	summary: {
		active: { border: string };
		border: string;
		borderRadius?: string;
		focus: { border: string; outline: string; customBorder?: CustomBorder };
		hover: { border: string; fontStyle?: string };
		minHeight: string;
		padding: string;
		selected: {
			background: string;
			borderLeft: { active: string; focus: string; hover: string; nonActive: string };
			hover?: {
				color: string;
				fontWeight: string | number;
			};
			color?: string;
		};
		icon: {
			variant: {
				open: string;
				info: string;
				error: string;
				warning: string;
				inProgress?: string;
				done: string;
			};
		};
	};
	text: {
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		padding: string;
		expanded?: { fontWeight: number };
	};
};

const defaultAccordionConfig = (theme: BaseThemeCore): AccordionConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		details: {
			background: colors.background.secondaryBackground,
			fontSize: typography.fontSize.tinyFontSize,
			menu: {
				paddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacinglg + 2 * spacing.spacing.spacing3xs}px`
			}
		},
		fontFamily: typography.font.MAIN_FONT,
		graphic: {
			color: colors.graphicSecondaryColorDark,
			fontSize: typography.fontSize.lgFontSize,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0 0`
		},
		summary: {
			active: {
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			},
			border: `${theme.border.width.thin} solid ${colors.divider.color}`,
			borderRadius: "0",
			focus: {
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
				outline: theme.focusStyles.focusedBoundaryDark
			},
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			},
			minHeight: `${3 * spacing.baseSpacing.BASE}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			selected: {
				background: colors.interaction.selected.colorLight,
				borderLeft: {
					active: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouch}`,
					focus: `${theme.border.width.thick} solid ${colors.interaction.focus.color}`,
					hover: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouch}`,
					nonActive: `${theme.border.width.thick} solid ${colors.interaction.selected.color}`
				},
				color: colors.text.color
			},
			icon: {
				variant: {
					open: colors.text.color,
					info: colors.variant.infoColor,
					error: colors.variant.errorColor,
					warning: colors.variant.warningColorDark,
					inProgress: colors.variant.infoColorDark,
					done: colors.variant.successColor
				}
			}
		},
		text: {
			color: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: "0",
			expanded: {
				fontWeight: typography.fontWeight.semiBoldFontWeight
			}
		}
	};
};

export const accordionOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		summary: {
			selected: {
				background: colors.interaction.selected.colorInverted,
				color: colors.interaction.primaryInteractionColor
			},
			active: {
				border: `${theme.border.width.medium} solid ${colors.interaction.color}`
			},
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.color}`
			}
		},
		graphic: {
			color: colors.interaction.color
		},
		text: {
			color: colors.interaction.primaryInteractionColor
		}
	};
};

export const accordionConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultAccordionConfig(theme), accordionOverrides(theme));
