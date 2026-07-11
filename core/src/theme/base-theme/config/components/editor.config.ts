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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type EditorConfigType = {
	customizedUnstyledBlockMargin: string;
	listItem: { beforeMargin: string; dashBeforeMargin: string };
	mention: {
		decoratorFontWeight: number;
		suggestionItem: { activeBG: string; focusBG: string; padding: string };
		suggestions: {
			background: string;
			border: string;
			borderRadius: string | number;
			boxShadow: string;
			maxWidth: string;
			minWidth: string;
		};
	};
	misspelledWord: { activeBG: string; hoverBG: string };
	singleLine: {
		contentMargin: string;
	};
	toolbar: {
		background: string;
		borderRadius: string;
		boxShadow: string;
		item: {
			borderRadius: string | number;
			dropdownIcon: { fontSize: string; width: string };
			groupIconPadding: string;
			height: string;
			icon: {
				active: {
					activeBG: string;
					background: string;
					border: string;
					color: string;
					focusBG: string;
					hoverBG: string;
					selector: { background: string; color: string };
				};
				color: string;
				focus: { background: string; border: string; color: string };
				fontSize: string;
				hover: { background: string; border: string; color: string };
				padding: string;
			};
			padding: string;
			width: string;
		};
		minHeight: string;
		padding: string;
		separator: { background: string; height: string; margin: string; width: string };
	};
	tooltip: { arrowSize: number; background: string; border: string; borderRadius: string | number; boxShadow: string };
	input?: {
		focus?: {
			customBorder?: CustomBorder;
		};
	};
};

const defaultEditorConfig = (theme: BaseThemeCore): EditorConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		customizedUnstyledBlockMargin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
		listItem: {
			beforeMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs * 3}px 0 ${
				spacing.horizontalSpacing.horizWhiteSpacing3xs * -8
			}px`,
			dashBeforeMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs * 3}px 0 ${
				spacing.horizontalSpacing.horizWhiteSpacing3xs * -6
			}px`
		},
		mention: {
			decoratorFontWeight: typography.fontWeight.boldFontWeight,
			suggestionItem: {
				activeBG: colors.background.tertiaryBackground,
				focusBG: colors.background.tertiaryBackground,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px`
			},
			suggestions: {
				background: colors.background.interactiveBackground,
				border: `${theme.border.width.thin} solid ${colors.divider.color}`,
				borderRadius: theme.border.radius.sm,
				boxShadow: `0 4px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
				maxWidth: 5 * spacing.spacing.spacing2Xl + "px",
				minWidth: 2.5 * spacing.spacing.spacing2Xl + "px"
			}
		},
		misspelledWord: {
			activeBG: rgba(colors.variant.errorColor, theme.opacity.medium),
			hoverBG: rgba(colors.variant.errorColor, theme.opacity.medium)
		},
		singleLine: {
			contentMargin: "0"
		},
		toolbar: {
			background: colors.background.tertiaryBackground,
			borderRadius: "0",
			boxShadow: "none",
			minHeight: 3 * spacing.baseSpacing.BASE + "px",
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			item: {
				borderRadius: theme.border.radius.sm,
				groupIconPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 ${
					spacing.verticalSpacing.vertWhiteSpacing2xs
				}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs + spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
				height: 3 * spacing.baseSpacing.BASE + "px",
				dropdownIcon: {
					fontSize: typography.fontSize.smallFontSize,
					width: spacing.baseSpacing.BASE + "px"
				},
				icon: {
					active: {
						activeBG: colors.interaction.active.colorTouch,
						background: colors.interaction.selected.color,
						border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
						color: colors.text.invertedColor,
						focusBG: colors.interaction.focus.color,
						hoverBG: colors.interaction.active.colorTouch,
						selector: {
							background: colors.background.interactiveBackground,
							color: colors.interaction.active.colorTouch
						}
					},
					color: colors.text.color,
					focus: {
						background: colors.background.interactiveBackground,
						border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
						color: colors.interaction.focus.color
					},
					fontSize: typography.fontSize.mediumFontSize,
					hover: {
						background: colors.background.interactiveBackground,
						border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
						color: colors.interaction.hover.color
					},
					padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
				},
				padding: "0",
				width: spacing.spacing.spacingLg + spacing.spacing.spacing3xs + "px"
			},
			separator: {
				background: colors.divider.colorDark,
				height: spacing.spacing.spacingLg + "px",
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				width: spacing.spacing.spacing3xs + "px"
			}
		},
		tooltip: {
			arrowSize: spacing.spacing.spacingXs,
			background: colors.background.primaryBackground,
			border: `${theme.border.width.thin} solid ${colors.interaction.active.color}`,
			borderRadius: theme.border.radius.sm,
			boxShadow: `1px 2px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
		}
	};
};

export const editorOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		toolbar: {
			background: colors.background.groupBackground
		}
	};
};

export const editorConfig = (theme: BaseThemeCore) => mergeConfig(defaultEditorConfig(theme), editorOverrides(theme));
