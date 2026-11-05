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

export type ColumnVisibilityPanelConfigType = {
	/** The width the panel does not shrink below, so that column names stay readable. */
	minWidth: string;

	/** The width the panel does not grow beyond, so that long column names wrap instead. */
	maxWidth: string;

	/** The width the panel does not grow beyond in the modal presentation. */
	modalMaxWidth: string;

	/**
	 * The inline padding the title, the search field, the rows and the footer share. The panel's own,
	 * the way the filter selector keeps its own measure instead of a page-level box's.
	 */
	horizontalPadding: string;

	/**
	 * The line that closes the header off against the list. The panel's own, because the base theme
	 * turns `contentBox.heading.borderBottom` off.
	 */
	header: { borderBottom: string };

	/** The scrollable list of columns. Once it reaches `maxHeight`, header and footer stay pinned. */
	list: { maxHeight: string };

	/** The message shown in place of the list when a search matches no column. */
	noResults: { color: string; paddingVertical: string };
};

export const columnVisibilityPanelConfig = (theme: BaseThemeType): ColumnVisibilityPanelConfigType => {
	const { colors, divisionLineStyles, spacing } = theme;

	return {
		minWidth: "320px",
		maxWidth: "560px",
		modalMaxWidth: "560px",
		horizontalPadding: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
		header: {
			borderBottom: `${divisionLineStyles.lineHeight} solid ${colors.divider.color}`
		},
		list: {
			maxHeight: `${9 * spacing.spacing.spacingXl}px`
		},
		noResults: {
			color: colors.text.secondaryColorDark,
			paddingVertical: `${spacing.spacing.spacingMd}px`
		}
	};
};
