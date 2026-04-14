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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type TagConfigType = {
	backgroundColor: string;
	borderRadius: string | number;
	content: {
		border: string;
		color: { active: string; default: string; focus: string; hover: string };
		focusBorderColor: string;
		fontFamily: string;
		fontSize: string;
		lineHeight: string;
		linkColor: string;
		padding: string;
	};
	exitTransition: { duration: string; margin: string };
	group: { margin: string };
	icon: { backgroundColor: string; color: string; contentPaddingLeft: string; fontSize: string; size: string };
	minHeight: string;
	removable: { closeButton: { fontSize: string; padding: string; size: string }; contentPaddingRight: string };
};

export const tagConfig = (theme: BaseThemeType): TagConfigType => {
	const { spacing, colors, typography } = theme;

	return {
		backgroundColor: colors.background.primaryBackground,
		borderRadius: "0.75rem",
		content: {
			border: `1px solid ${colors.divider.colorDark}`,
			color: {
				default: colors.text.color,
				focus: colors.interaction.focus.color,
				hover: colors.interaction.hover.color,
				active: colors.interaction.active.colorTouch
			},
			focusBorderColor: colors.interaction.focus.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			lineHeight: "1rem",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs - 1}px ${
				spacing.horizontalSpacing.horizWhiteSpacingxs
			}px`,
			linkColor: colors.interaction.secondaryInteractionColor
		},
		exitTransition: {
			margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			duration: "0.2s"
		},
		group: {
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`
		},
		icon: {
			backgroundColor: colors.placeHolderBackgroundLight,
			color: colors.text.invertedColor,
			size: `${spacing.spacing.spacingMd}px`,
			fontSize: typography.fontSize.smallFontSize,
			contentPaddingLeft: `${spacing.spacing.spacingMd + spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
		},
		minHeight: `${spacing.spacing.spacingMd}px`,
		removable: {
			contentPaddingRight: `${spacing.spacing.spacingMd + spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			closeButton: {
				fontSize: typography.fontSize.smallFontSize,
				size: `${spacing.spacing.spacingMd}px`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
			}
		}
	};
};
