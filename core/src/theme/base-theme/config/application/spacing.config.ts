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

/*------------------------------------*\
            SPACING SCALE
\*------------------------------------*/

/*
 * The amount of space between elements which calculate based on $a12_baseSpacing.
 * If you want to override $a12_baseSpacing that is located from config/public/common/base/spacing.config.styl
 */

import type { HorizontalSpacing, Spacing, VerticalSpacing } from "../../../schema/spacing.api.js";

export const SpacingConfig = (baseSpacing: number): Spacing => {
	return {
		spacing3xs: Math.round(0.125 * baseSpacing),
		spacing2xs: Math.round(0.25 * baseSpacing),
		spacingXs: Math.round(0.5 * baseSpacing),
		spacingSm: Math.round(0.75 * baseSpacing),
		spacingMd: Math.round(1.5 * baseSpacing),
		spacingLg: Math.round(2 * baseSpacing),
		spacingXl: Math.round(3.25 * baseSpacing),
		spacing2Xl: Math.round(5.25 * baseSpacing)
	};
};

/*------------------------------------*\
         HORIZONTAL WHITE SPACING
\*------------------------------------*/
export const HorizontalSpacingConfig = (baseSpacing: number): HorizontalSpacing => {
	return {
		horizWhiteSpacing3xs: Math.round(0.125 * baseSpacing),
		horizWhiteSpacing2xs: Math.round(0.25 * baseSpacing),
		horizWhiteSpacingxs: Math.round(0.5 * baseSpacing),
		horizWhiteSpacingsm: Math.round(1 * baseSpacing),
		horizWhiteSpacingmd: Math.round(1.5 * baseSpacing),
		horizWhiteSpacinglg: Math.round(2 * baseSpacing),
		horizWhiteSpacingxl: Math.round(2.5 * baseSpacing),
		horizWhiteSpacing2xl: Math.round(3 * baseSpacing),
		horizWhiteSpacing3xl: Math.round(3.5 * baseSpacing),
		horizWhiteSpacing4xl: Math.round(4 * baseSpacing),
		horizWhiteSpacing5xl: Math.round(4.5 * baseSpacing),
		horizWhiteSpacing6xl: Math.round(5 * baseSpacing)
	};
};

/*------------------------------------*\
         VERTICAL WHITE SPACING
\*------------------------------------*/
export const VerticalSpacingConfig = (baseSpacing: number): VerticalSpacing => {
	return {
		vertWhiteSpacing3xs: Math.round(0.125 * baseSpacing),
		vertWhiteSpacing2xs: Math.round(0.25 * baseSpacing),
		vertWhiteSpacingxs: Math.round(0.5 * baseSpacing),
		vertWhiteSpacingsm: Math.round(1 * baseSpacing),
		vertWhiteSpacingmd: Math.round(1.5 * baseSpacing),
		vertWhiteSpacinglg: Math.round(2 * baseSpacing),
		vertWhiteSpacingxl: Math.round(2.5 * baseSpacing),
		vertWhiteSpacing2xl: Math.round(3 * baseSpacing),
		vertWhiteSpacing3xl: Math.round(3.5 * baseSpacing),
		vertWhiteSpacing4xl: Math.round(4 * baseSpacing),
		vertWhiteSpacing5xl: Math.round(4.5 * baseSpacing),
		vertWhiteSpacing6xl: Math.round(5 * baseSpacing)
	};
};
