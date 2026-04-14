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
		spacing3xs: Math.round(0.125 * baseSpacing), // 2px
		spacing2xs: Math.round(0.25 * baseSpacing), // 4px
		spacingXs: Math.round(0.5 * baseSpacing), // 8px
		spacingSm: Math.round(0.75 * baseSpacing), // 12px
		spacingMd: Math.round(1.5 * baseSpacing), // 24px
		spacingLg: Math.round(2 * baseSpacing), // 32px
		spacingXl: Math.round(3.25 * baseSpacing), // 52px
		spacing2Xl: Math.round(5.25 * baseSpacing) // 84px
	};
};

/*------------------------------------*\
         HORIZONTAL WHITE SPACING
\*------------------------------------*/
export const HorizontalSpacingConfig = (baseSpacing: number): HorizontalSpacing => {
	return {
		horizWhiteSpacing3xs: Math.round(0.125 * baseSpacing), // 2px
		horizWhiteSpacing2xs: Math.round(0.25 * baseSpacing), // 4px
		horizWhiteSpacingxs: Math.round(0.5 * baseSpacing), // 8px
		horizWhiteSpacingsm: Math.round(1 * baseSpacing), // 16px
		horizWhiteSpacingmd: Math.round(1.5 * baseSpacing), // 24px
		horizWhiteSpacinglg: Math.round(2 * baseSpacing), // 32px
		horizWhiteSpacingxl: Math.round(2.5 * baseSpacing), // 40px
		horizWhiteSpacing2xl: Math.round(3 * baseSpacing), // 48px
		horizWhiteSpacing3xl: Math.round(3.5 * baseSpacing), // 56px
		horizWhiteSpacing4xl: Math.round(4 * baseSpacing), // 64px
		horizWhiteSpacing5xl: Math.round(4.5 * baseSpacing), // 72px
		horizWhiteSpacing6xl: Math.round(5 * baseSpacing) // 80px
	};
};

/*------------------------------------*\
         VERTICAL WHITE SPACING
\*------------------------------------*/
export const VerticalSpacingConfig = (baseSpacing: number): VerticalSpacing => {
	return {
		vertWhiteSpacing3xs: Math.round(0.125 * baseSpacing), // 2px
		vertWhiteSpacing2xs: Math.round(0.25 * baseSpacing), // 4px
		vertWhiteSpacingxs: Math.round(0.5 * baseSpacing), // 8px
		vertWhiteSpacingsm: Math.round(1 * baseSpacing), // 16px
		vertWhiteSpacingmd: Math.round(1.5 * baseSpacing), // 24px
		vertWhiteSpacinglg: Math.round(2 * baseSpacing), // 32px
		vertWhiteSpacingxl: Math.round(2.5 * baseSpacing), // 40px
		vertWhiteSpacing2xl: Math.round(3 * baseSpacing), // 48px
		vertWhiteSpacing3xl: Math.round(3.5 * baseSpacing), // 56px
		vertWhiteSpacing4xl: Math.round(4 * baseSpacing), // 64px
		vertWhiteSpacing5xl: Math.round(4.5 * baseSpacing), // 72px
		vertWhiteSpacing6xl: Math.round(5 * baseSpacing) // 80px
	};
};
