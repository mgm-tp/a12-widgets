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

import type { FlatThemeType } from "../../../schema.js";

export const tableFlatConfig = (theme: FlatThemeType) => {
	const { colors, spacing } = theme;

	return {
		bodyRow: {
			subBGRatio: 0.02
		},
		bodyCell: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			firstMarginLeft: `${spacing.horizontalSpacing.horizWhiteSpacinglg}px`
		},
		headCell: {
			color: colors.text.color,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			sortable: {
				color: colors.interaction.color,
				activeColor: colors.interaction.color,
				hoverColor: colors.interaction.color
			}
		},
		headRowGroup: {
			borderTop: `1px solid ${colors.divider.color}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		headCellGroup: {
			borderRight: `2px solid ${colors.interaction.colorBG}`
		},
		pinned: {
			leftColumn: {
				boxShadow: `inset -1px 0px 0px 0px ${colors.divider.colorSubtle}, inset -2px 0px 0px 0px ${colors.divider.colorSubtle}`,
				hoverBoxShadow: `inset -1px 0px 0px 0px ${colors.divider.colorSubtle}, inset -2px 0px 0px 0px ${colors.divider.colorSubtle}`
			},
			rightColumn: {
				boxShadow: `inset 1px 0px 0px 0px ${colors.divider.colorSubtle}, inset 2px 0px 0px 0px ${colors.divider.colorSubtle}`,
				hoverBoxShadow: `inset 1px 0px 0px 0px ${colors.divider.colorSubtle}, inset 2px 0px 0px 0px ${colors.divider.colorSubtle}`
			}
		},
		expandable: {
			body: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			}
		},
		footRow: {
			boxShadow: `inset 0 1px 0 0 ${colors.divider.colorSubtle}, inset 0px 2px 0px 0px ${colors.divider.colorSubtle}`
		}
	};
};
