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

export type LayoutGridConfigType = {
	cell: { border: string };
	column: { marginBottom: string; padding: string };
	container: { padding: string };
	fit: {
		columnChildMarginBottom: string;
		columnGap: string;
		gap: string;
		mobileColumnChildMargin: string;
		rowGap: string;
	};
	row: { gap: string; marginBottom: string; spanOffsetMargin: string };
};

const commonConfigs = (theme: BaseThemeType) => {
	const { horizontalSpacing } = theme.spacing;

	return {
		rowGap: `${horizontalSpacing.horizWhiteSpacingsm}`,
		columnGap: 2 * horizontalSpacing.horizWhiteSpacingsm
	};
};

export const layoutGridConfig = (theme: BaseThemeType): LayoutGridConfigType => {
	const { horizontalSpacing, verticalSpacing } = theme.spacing;
	const generalConfigs = commonConfigs(theme);
	const gap = `${generalConfigs.rowGap}px ${generalConfigs.columnGap}px`;

	return {
		row: {
			marginBottom: `${verticalSpacing.vertWhiteSpacingsm}px`,
			spanOffsetMargin: `0 -${horizontalSpacing.horizWhiteSpacingsm}px`,
			gap
		},
		column: {
			marginBottom: `${verticalSpacing.vertWhiteSpacingsm}px`,
			padding: `0 ${horizontalSpacing.horizWhiteSpacingsm}px`
		},
		container: {
			padding: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingsm}px 0`
		},
		fit: {
			columnChildMarginBottom: `${generalConfigs.rowGap}px`, // to make sure there is spacing when scroll to bottom
			columnGap: gap,
			gap,
			mobileColumnChildMargin: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
			rowGap: gap
		},
		cell: {
			border: `1px solid ${theme.colors.divider.colorDark}`
		}
	};
};
