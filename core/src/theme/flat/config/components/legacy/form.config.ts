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

import type { FlatColorsConfig } from "../../base/colors.config.js";
import type { FlatThemeType } from "../../../../schema.js";

export const formFlatConfig = (theme: FlatThemeType) => {
	const { typography, spacing, colors } = theme;
	const flatColors = colors as typeof FlatColorsConfig;

	return {
		contentBox: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		collapsiblePanel: {
			h3: {
				background: {
					normalAndFocus: "none"
				},
				color: flatColors.text.titleColor,
				fontSize: typography.fontSize.mediumFontSize,
				margin: `0 -${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px -${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			h4: {
				borderBottom: "none",
				fontSize: typography.fontSize.mediumFontSize,
				margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingmd}px 0`,
				padding: {
					default: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
					formSection: `0`
				}
			}
		},
		screen: {
			marginTop: `-${spacing.verticalSpacing.vertWhiteSpacingmd}px`
		},
		section: {
			contentTitle: {
				background: "transparent",
				borderBottom: `none`,
				color: flatColors.text.titleColor,
				fontSize: typography.fontSize.smallFontSize,
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingmd}px 0`,
				padding: `0`,
				textTransform: "initial"
			},
			padding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			title: {
				background: "none",
				color: flatColors.text.titleColor,
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				margin: `0 -${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px -${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			}
		},
		repeat: {
			sectionTitle: {
				borderBottom: "none",
				color: flatColors.text.titleColor
			}
		},
		text: {
			fontSize: typography.fontSize.mediumFontSize
		},
		title: {
			margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		}
	};
};
