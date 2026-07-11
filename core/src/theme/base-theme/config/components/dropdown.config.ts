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

import { linearGradient, rgba } from "polished";
import type { Styles } from "polished/lib/types/style.js";

import type { BaseThemeCore } from "../../schema.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type DropdownConfigType = {
	background: string;
	boxShadow: string;
	outline: string;
	contentMaxHeight: string;
	fontFamily: string;
	graphic: { lineHeight: string; margin: string };
	hint: { height: string; minHeight: string; padding: string; background: string; color: string; fontSize: string };
	horizontal: {
		item: {
			activeColor: string;
			graphic: { fontSize: string; size: string };

			/** @deprecated since 37.2.3. Please use {@link hover.color} instead. */
			hoverColor?: string;
			hover: {
				color: string;
				fontStyle?: string;
			};
			label: { fontSize: string; width: string };
			padding: string;
		};
		selectedItem: {
			background: string;
			color: string;
			fontWeight?: string | number;
			graphicColor: string;
		};
	};
	item: {
		active: { border: string; color: string };
		border: string;
		borderBottom: string;
		color: string;
		disabledColor: string;
		extended: { fontWeight: number; minHeight: string };
		focusBorder: string;
		focusPreselectBorder: string;
		focusPreselectOutline: string;
		fontSize: string;
		hover: { border: string; color: string; fontStyle?: string };
		lineHeight: string;
		minHeight: string;
		padding: string;
		preselect: { background: string; color: string; fontWeight?: string | number };
		customFocusBorder?: CustomBorder;
		customFocusPreselectBorder?: CustomBorder;
		empty: { color: string; fontStyle: string; hover: { color: string } };
	};
	lightBG: string;
	secondaryText: { color: string; disabledColor: string; fontSize: string; margin: string };
	section: { background: string; color: string; fontWeight: number; fontSize: string };
	touch: { itemPadding: string; minHeight: string; secondaryTextMargin: string };
	footer: { horizontalAlignment: string; background: string; minHeight: string; padding: string };
	link: {
		item: {
			active: { border: string; color: string; backgroundImage: Styles; textDecoration: string };
			border: string;
			borderBottom: string;
			color: string;
			focusBorder: string;
			focusPreselectBorder: string;
			fontSize: string;
			hover: { border: string; color: string; backgroundImage: Styles; fontStyle?: string; textDecoration: string };
			lineHeight: string;
			minHeight: string;
			padding: string;
			preselect: { background: string; backgroundImage: Styles; color: string; fontWeight?: string | number };
			transitionTiming: string;
		};
		wrapper: {
			borderBottom: string;
			touchBorderBottom: string;
		};
	};
};

const defaultDropdownConfig = (theme: BaseThemeCore): DropdownConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const applicationStyles = theme.applicationStyles;
	const focusStyles = theme.focusStyles;

	return {
		background: colors.background.interactiveBackground,
		boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
		outline: `${theme.border.width.thin} solid ${colors.divider.colorSubtle}`,
		contentMaxHeight: `${3 * spacing.spacing.spacing2Xl}px`,
		fontFamily: typography.font.MAIN_FONT,
		graphic: {
			lineHeight: `${spacing.spacing.spacingMd - spacing.spacing.spacing3xs}px`,
			margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`
		},
		hint: {
			height: "auto",
			minHeight: `${spacing.spacing.spacingMd}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			background: colors.background.tertiaryBackground,
			color: colors.text.color,
			fontSize: typography.fontSize.tinyFontSize
		},
		horizontal: {
			item: {
				activeColor: colors.interaction.active.colorTouch,
				graphic: {
					fontSize: typography.fontSize.lgFontSize,
					size: `${spacing.spacing.spacingLg}px`
				},
				hover: {
					color: colors.interaction.hover.color
				},
				label: {
					fontSize: typography.fontSize.nanoFontSize,
					width: `${spacing.spacing.spacingLg + 4}px`
				},
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
			},
			selectedItem: {
				background: colors.interaction.selected.color,
				color: colors.text.color,
				graphicColor: colors.text.invertedColor
			}
		},
		item: {
			active: {
				border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
				color: colors.text.color
			},
			border: "none",
			borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
			color: colors.text.color,
			disabledColor: colors.interaction.disabled.colorDark,
			extended: {
				minHeight: `${2 * spacing.spacing.spacingMd}px`,
				fontWeight: typography.fontWeight.semiBoldFontWeight
			},
			focusBorder: `${theme.border.width.thin} dotted ${colors.text.headlineColor}`,
			focusPreselectBorder: `${theme.border.width.medium} solid ${colors.interaction.selected.color}`,
			focusPreselectOutline: focusStyles.focusedBoundaryDark,
			fontSize: typography.fontSize.tinyFontSize,
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
				color: colors.text.color
			},
			lineHeight: "1rem",
			minHeight: `${spacing.spacing.spacingMd}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			preselect: {
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor
			},
			empty: {
				color: colors.text.secondaryColorDark,
				fontStyle: "italic",
				hover: {
					color: colors.text.secondaryColorDark
				}
			}
		},
		lightBG: colors.background.primaryBackground,
		link: {
			item: {
				active: {
					border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
					backgroundImage: linearGradient({
						colorStops: [colors.interaction.active.colorTouch, colors.interaction.active.colorTouch]
					}),
					color: colors.interaction.active.colorTouch,
					textDecoration: "none"
				},
				border: "none",
				borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
				color: colors.text.color,
				focusBorder: `${theme.border.width.thin} dotted ${colors.text.headlineColor}`,
				focusPreselectBorder: `${theme.border.width.medium} solid ${colors.interaction.selected.color}`,
				fontSize: typography.fontSize.tinyFontSize,
				hover: {
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
					backgroundImage: linearGradient({
						colorStops: [colors.interaction.hover.color, colors.interaction.hover.color]
					}),
					color: colors.interaction.hover.color,
					textDecoration: "none"
				},
				lineHeight: "1rem",
				minHeight: `${spacing.spacing.spacingMd}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				preselect: {
					background: colors.interaction.selected.color,
					backgroundImage: linearGradient({
						colorStops: [colors.text.invertedColor, colors.text.invertedColor]
					}),
					color: colors.text.invertedColor
				},
				transitionTiming: theme.motion.duration.slow
			},
			wrapper: {
				borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
				touchBorderBottom: `${theme.border.width.thin} solid ${colors.divider.colorDark}`
			}
		},
		secondaryText: {
			color: colors.secondaryColor,
			disabledColor: colors.interaction.disabled.colorDark,
			fontSize: typography.fontSize.tinyFontSize,
			margin: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0 0 0`
		},
		section: {
			background: colors.secondaryColor,
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.boldFontWeight
		},
		touch: {
			itemPadding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			minHeight: `${2 * spacing.spacing.spacingMd}px`,
			secondaryTextMargin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0 0`
		},
		footer: {
			horizontalAlignment: "center",
			background: colors.background.tertiaryBackground,
			minHeight: applicationStyles.input.height,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		}
	};
};

export const dropdownOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		hint: {
			background: colors.background.secondaryBackground
		},
		secondaryText: {
			color: colors.text.color
		},
		section: {
			color: colors.text.color
		},
		footer: {
			background: colors.background.secondaryBackground
		}
	};
};

export const dropdownConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultDropdownConfig(theme), dropdownOverrides(theme));
