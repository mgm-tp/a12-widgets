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

import { contentBoxConfig, contentBoxOverrides } from "./contentbox.config.js";

export type ValidationBarConfigType = {
	content: {
		background: string;
		borderRadius: string | number;
		color: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		spacingBottom: string;
	};
	graphic: {
		fontSize: string;
		margin: string;
		padding: number;
	};
	header: { minHeight: string; padding: string };
	mobile: {
		borderRadius: string | number;
		content: { background: string; height: string; padding: string };
		graphic: {
			content: { fontFamily: string; fontSize: string; fontWeight: number };
			gap: string;
			icon: { fontSize: string; margin: string };
		};
		overview: {
			minHeight: string;
			padding: string;
			right: { fontSize: string };
		};
		previewList: {
			background: string;
			item: {
				borderBottom: string;
				graphicFontSize: string;
				graphicHeight: string;
				graphicMargin: string;
				metaFontSize: string;
				metaMargin: string;
				padding: string;
				textFontSize: string;
			};
		};
	};
	padding: number;
	pagination: { margin: string };
	primaryTitle: { fontFamily: string; fontSize: string; fontWeight: number };
	secondaryTitle: { fontFamily: string; fontSize: string; fontWeight: number };
	title: { lineHeight: string; margin: string; padding: string };
	variant: {
		error: string;
		info: string;
		warning: string;
		text: {
			error: string;
			info: string;
			warning: string;
		};
	};
};

const defaultValidationBarConfig = (theme: BaseThemeCore): ValidationBarConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		padding: 0,
		variant: {
			error: colors.variant.errorColor,
			info: colors.variant.infoColor,
			warning: colors.variant.warningColor,
			text: {
				error: colors.variant.text.error,
				info: colors.variant.text.info,
				warning: colors.variant.text.warning
			}
		},
		graphic: {
			padding: 0,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`,
			fontSize: typography.fontSize.bigFontSize
		},
		pagination: {
			margin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		header: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			minHeight: `${spacing.spacing.spacingMd * 2}px`
		},
		title: {
			lineHeight: "1rem",
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			margin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		primaryTitle: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.extraBoldFontWeight
		},
		secondaryTitle: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight
		},
		content: {
			background: colors.background.primaryBackground,
			borderRadius: "3px",
			color: colors.text.color,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px ${spacing.verticalSpacing.vertWhiteSpacing3xs}px`,
			height: `${spacing.spacing.spacingMd * 7.5}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px 0`,
			spacingBottom: `${spacing.verticalSpacing.vertWhiteSpacingxs}px`
		},
		mobile: {
			borderRadius: contentBoxConfig(theme).contentBoxBorderRadius,
			overview: {
				minHeight: `${2 * spacing.spacing.spacingMd}px`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
				right: {
					fontSize: typography.fontSize.bigFontSize
				}
			},
			graphic: {
				gap: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				icon: {
					margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`,
					fontSize: typography.fontSize.bigFontSize
				},
				content: {
					fontFamily: typography.font.MAIN_FONT,
					fontSize: typography.fontSize.tinyFontSize,
					fontWeight: typography.fontWeight.boldFontWeight
				}
			},
			content: {
				background: colors.background.primaryBackground,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px 0`,
				height: `${spacing.spacing.spacingMd}px`
			},
			previewList: {
				background: colors.background.primaryBackground,
				item: {
					padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
					borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
					graphicHeight: `${spacing.spacing.spacingMd}px`,
					graphicMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`,
					graphicFontSize: typography.fontSize.bigFontSize,
					textFontSize: typography.fontSize.tinyFontSize,
					metaFontSize: typography.fontSize.hugeFontSize,
					metaMargin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
				}
			}
		}
	};
};

export const validationBarOverrides = (theme: BaseThemeCore) => {
	return {
		mobile: {
			borderRadius: contentBoxOverrides(theme).contentBoxBorderRadius
		}
	};
};

export const validationBarConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultValidationBarConfig(theme), validationBarOverrides(theme));
