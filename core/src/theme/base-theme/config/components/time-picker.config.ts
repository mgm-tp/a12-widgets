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

export type TimePickerConfigType = {
	body: { padding: string };
	clock: {
		color: string;
		num: { fontSize: string; padding: string; size: string };
		pointer: {
			background: string;
			initialBackground: string;
			innerDot: { size: string };
			outerDot: { content: { color: string; fontSize: string }; padding: string; size: string };
		};
		size: string;
	};
	dialog: { background: string; borderRadius: number | string; boxShadow: string };
	format: { fontWeight: number; selected: { background: string; color: string }; size: string };
	header: { background: string; borderRadius: number; iconFontSize: string; minHeight: string; padding: string };
	setting: { fontSize: string; itemBorder: { active: string; default: string; hover: string }; padding: string };
	text: { color: string; fontSize: string; fontWeight: number };
	timeValue: {
		background: string;
		borderRadius: string | number;
		fontWeight: number;
		margin: string;
		selectedBorderColor: string;
		size: string;
	};
	input?: {
		focus?: {
			customBorder?: CustomBorder;
		};
	};
};

const defaultTimePickerConfig = (theme: BaseThemeCore): TimePickerConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const clockNumSize = `${spacing.spacing.spacingMd}px`;

	return {
		dialog: {
			background: colors.background.primaryBackground,
			borderRadius: 0,
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
		},
		header: {
			background: colors.primaryColor,
			borderRadius: 0,
			minHeight: `${2 * spacing.spacing.spacingMd}px`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			iconFontSize: typography.fontSize.lgFontSize
		},
		text: {
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.smallFontSize,
			fontWeight: typography.fontWeight.boldFontWeight
		},
		clock: {
			color: colors.text.color,
			size: `${spacing.spacing.spacing2Xl + 160}px`,
			pointer: {
				background: colors.interaction.selected.color,
				initialBackground: colors.graphicSecondaryColorDark,
				innerDot: {
					size: `${spacing.spacing.spacingXs}px`
				},
				outerDot: {
					size: clockNumSize,
					padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
					content: {
						color: colors.text.invertedColor,
						fontSize: typography.fontSize.smallFontSize
					}
				}
			},
			num: {
				fontSize: typography.fontSize.smallFontSize,
				size: clockNumSize,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`
			}
		},
		body: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		setting: {
			fontSize: typography.fontSize.smallFontSize,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			itemBorder: {
				default: `${theme.border.width.medium} solid transparent`,
				active: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
				hover: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			}
		},
		timeValue: {
			background: colors.background.interactiveBackground,
			borderRadius: theme.border.radius.sm,
			size: `${2 * spacing.spacing.spacingMd}px`,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			selectedBorderColor: colors.interaction.selected.color,
			fontWeight: typography.fontWeight.semiBoldFontWeight
		},
		format: {
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			size: `${spacing.spacing.spacingLg + spacing.spacing.spacingXs}px`,
			selected: {
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor
			}
		}
	};
};

export const timePickerOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		text: {
			color: colors.text.color
		}
	};
};

export const timePickerConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultTimePickerConfig(theme), timePickerOverrides(theme));
