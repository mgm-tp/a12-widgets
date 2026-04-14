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

import type { BaseThemeType } from "../../../../schema/base-theme.js";

export type FormConfigType = {
	collapsiblePanel: {
		h3: {
			background: { activeAndHover: string; normalAndFocus: string };
			color: string;
			fontSize: string;
			margin: string;
			padding: string;
		};
		h4: {
			background: string;
			borderBottom: string;
			fontSize: string;
			margin: string;
			padding: { default: string; formSection: string };
		};
	};
	contentBox: { color: { error: string; iconAndLabel: string; warning: string }; padding: string };
	message: { color: { default: string; highlighted: string }; fontWeight: number };
	repeat: {
		sectionTitle: {
			background: string;
			borderBottom: string;
			color: string;
			fontWeight: number;
			height: string;
			textTransform: string;
		};
	};
	screen: { marginBottom: string; marginTop: string };
	section: {
		contentTitle: {
			background: string;
			borderBottom: string;
			color: string;
			fontSize: string;
			fontWeight: number;
			height: string;
			margin: string;
			padding: string;
			textTransform: string;
		};
		padding: string;
		title: {
			background: string;
			color: string;
			disabledColor: string;
			fontWeight: number;
			margin: string;
			minHeight: string;
			padding: string;
		};
		width: string;
	};
	text: {
		cell: { color: { default: string; disabled: string }; fontWeight: number };
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
	};
	title: {
		background: string;
		color: string;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		width: string;
	};
};

export const formConfig = (theme: BaseThemeType): FormConfigType => {
	const { colors, typography, spacing } = theme;

	return {
		contentBox: {
			color: {
				iconAndLabel: colors.text.invertedColor,
				error: colors.variant.errorColor,
				warning: colors.variant.warningColor
			},
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px`
		},
		collapsiblePanel: {
			h3: {
				background: {
					activeAndHover: colors.interaction.active.colorTouch,
					normalAndFocus: colors.secondaryColor
				},
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.tinyFontSize,
				margin: `0 -${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			h4: {
				background: colors.secondaryColor,
				borderBottom: "none",
				fontSize: typography.fontSize.tinyFontSize,
				margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
				padding: {
					default: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
					formSection: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
				}
			}
		},
		message: {
			color: {
				default: colors.text.secondaryColorDark,
				highlighted: colors.interaction.active.color
			},
			fontWeight: typography.fontWeight.semiBoldFontWeight
		},
		screen: {
			marginTop: `-${spacing.verticalSpacing.vertWhiteSpacingmd}px`,
			marginBottom: `${spacing.verticalSpacing.vertWhiteSpacingsm}px`
		},
		section: {
			contentTitle: {
				background: "transparent",
				borderBottom: `2px solid ${colors.primaryColor}`,
				color: colors.primaryColor,
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				height: "auto",
				margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
				padding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
				textTransform: "uppercase"
			},
			padding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			title: {
				background: colors.secondaryColor,
				color: colors.text.invertedColor,
				disabledColor: colors.secondaryColor,
				fontWeight: typography.fontWeight.boldFontWeight,
				minHeight: "auto",
				margin: `0 -${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			},
			width: "100%"
		},
		repeat: {
			sectionTitle: {
				background: "transparent",
				borderBottom: `2px solid ${colors.primaryColor}`,
				color: colors.primaryColor,
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				height: "auto",
				textTransform: "uppercase"
			}
		},
		text: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			cell: {
				color: {
					default: colors.text.headlineColor,
					disabled: colors.secondaryColor
				},
				fontWeight: typography.fontWeight.regularFontWeight
			}
		},
		title: {
			background: "transparent",
			color: colors.text.color,
			height: "auto",
			margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			textTransform: "uppercase",
			width: "100%"
		}
	};
};
