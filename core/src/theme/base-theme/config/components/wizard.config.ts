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

export type WizardConfigType = {
	content: {
		wrapper: { nonIconPadding: string; padding: string };
		background: string;
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		gap: string;
		iconFontSize: string;
		margin: string;
		nonInteractiveColor: string;
		padding: number;
	};
	minHeight: string;
	navigator: {
		active: { border: string; color: string };
		background: string;
		color: string;
		disabledColor: string;
		focus: { border: string; color: string; outline: string };
		fontSize: string;
		hover: { border: string; color: string };
		margin: string;
		padding: string;
	};
	step: {
		activeColor: string;
		border: string;
		disabledColor: string;
		focusColor: string;
		hover: { background: string; color: string };
		leftOut: { background: string; padding: number };
		margin: string;
		minWidth: string;
		selected: {
			active: { background: string; color: string };
			background: string;
			color: string;
			finishedBG: string;
			focus: { background: string; color: string };
			hover: { background: string; color: string };
		};
	};
	tip: { color: string; width: string };
};

const defaultWizardConfig = (theme: BaseThemeCore): WizardConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	return {
		navigator: {
			active: {
				border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
				color: colors.interaction.active.color
			},
			background: colors.background.interactiveBackground,
			color: colors.interaction.secondaryInteractionColor,
			disabledColor: colors.interaction.disabled.colorDark,
			focus: {
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
				color: colors.interaction.focus.color,
				outline: focusStyles.focusedBoundaryLight
			},
			fontSize: typography.fontSize.lgFontSize,
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
				color: colors.interaction.hover.color
			},
			margin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		content: {
			wrapper: {
				nonIconPadding: `${spacing.horizontalSpacing.horizWhiteSpacingxs + 2}px 0`,
				padding: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0`
			},
			background: colors.background.interactiveBackground,
			color: colors.interaction.secondaryInteractionColor,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			iconFontSize: typography.fontSize.lgFontSize,
			gap: spacing.horizontalSpacing.horizWhiteSpacing2xs + "px",
			margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${
				spacing.horizontalSpacing.horizWhiteSpacingxs + spacing.spacing.spacingSm
			}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			nonInteractiveColor: colors.text.color,
			padding: 0
		},
		minHeight: 2 * spacing.spacing.spacingMd + "px",
		step: {
			activeColor: colors.interaction.active.color,
			border: `${theme.border.width.thin} solid ${colors.divider.colorDark}`,
			disabledColor: colors.interaction.disabled.colorDark,
			focusColor: colors.interaction.focus.color,
			hover: {
				background: colors.background.interactiveBackground,
				color: colors.interaction.hover.color
			},
			leftOut: {
				background: colors.background.secondaryBackground,
				padding: 0
			},
			margin: `0 ${-spacing.spacing.spacingSm}px 0 0`,
			minWidth: 1.5 * spacing.spacing.spacingXl + "px",
			selected: {
				active: {
					background: colors.interaction.active.colorTouch,
					color: colors.text.invertedColor
				},
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor,
				finishedBG: colors.variant.successColor,
				focus: {
					background: colors.interaction.focus.color,
					color: colors.interaction.focus.colorInverted
				},
				hover: {
					background: colors.interaction.hover.color,
					color: colors.text.invertedColor
				}
			}
		},
		tip: {
			color: colors.divider.colorDark,
			width: spacing.spacing.spacingSm + "px"
		}
	};
};

export const wizardOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		navigator: {
			background: colors.interaction.colorBG,
			color: colors.interaction.color
		},
		content: {
			background: colors.interaction.colorBG
		},
		step: {
			selected: {
				active: {
					background: colors.interaction.color
				},
				background: colors.interaction.color,
				focus: {
					background: colors.interaction.color
				}
			}
		}
	};
};

export const wizardConfig = (theme: BaseThemeCore) => mergeConfig(defaultWizardConfig(theme), wizardOverrides(theme));
