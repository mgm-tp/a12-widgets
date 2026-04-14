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

import type { BaseThemeType } from "../../../schema/base-theme.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

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

export const timePickerConfig = (theme: BaseThemeType): TimePickerConfigType => {
	const {
		spacing: { horizontalSpacing, verticalSpacing, spacing },
		colors,
		typography: { fontSize, fontWeight }
	} = theme;
	const clockNumSize = `${spacing.spacingMd}px`;

	return {
		dialog: {
			background: colors.background.primaryBackground,
			borderRadius: 0,
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`
		},
		header: {
			background: colors.primaryColor,
			borderRadius: 0,
			minHeight: `${2 * spacing.spacingMd}px`,
			padding: `0 ${horizontalSpacing.horizWhiteSpacingsm}px`,
			iconFontSize: fontSize.lgFontSize
		},
		text: {
			color: colors.text.invertedColor,
			fontSize: fontSize.smallFontSize,
			fontWeight: fontWeight.boldFontWeight
		},
		clock: {
			color: colors.text.color,
			size: `${spacing.spacing2Xl + 160}px`,
			pointer: {
				background: colors.interaction.selected.color,
				initialBackground: colors.graphicSecondaryColorDark,
				innerDot: {
					size: `${spacing.spacingXs}px`
				},
				outerDot: {
					size: clockNumSize,
					padding: `${verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing.horizWhiteSpacing3xs}px`,
					content: {
						color: colors.text.invertedColor,
						fontSize: fontSize.smallFontSize
					}
				}
			},
			num: {
				fontSize: fontSize.smallFontSize,
				size: clockNumSize,
				padding: `${verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing.horizWhiteSpacing3xs}px`
			}
		},
		body: {
			padding: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingsm}px`
		},
		setting: {
			fontSize: fontSize.smallFontSize,
			padding: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
			itemBorder: {
				default: "2px solid transparent",
				active: `2px solid ${colors.interaction.active.colorTouch}`,
				hover: `2px solid ${colors.interaction.hover.color}`
			}
		},
		timeValue: {
			background: colors.background.interactiveBackground,
			borderRadius: "2px",
			size: `${spacing.spacingXs + 28}px`,
			margin: `0 ${horizontalSpacing.horizWhiteSpacing3xs}px`,
			selectedBorderColor: colors.interaction.selected.color,
			fontWeight: fontWeight.semiBoldFontWeight
		},
		format: {
			fontWeight: fontWeight.semiBoldFontWeight,
			size: `${spacing.spacingLg}px`,
			selected: {
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor
			}
		}
	};
};
