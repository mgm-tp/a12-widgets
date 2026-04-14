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

export type BaseSpacing = { BASE: number; BASE_HORIZONTAL_WHITE_SPACING: number; BASE_VERTICAL_WHITE_SPACING: number };

export type Spacing = {
	spacing2Xl: number;
	spacing2xs: number;
	spacing3xs: number;
	spacingLg: number;
	spacingMd: number;
	spacingSm: number;
	spacingXl: number;
	spacingXs: number;
};

export type HorizontalSpacing = {
	horizWhiteSpacing2xl: number;
	horizWhiteSpacing2xs: number;
	horizWhiteSpacing3xl: number;
	horizWhiteSpacing3xs: number;
	horizWhiteSpacing4xl: number;
	horizWhiteSpacing5xl: number;
	horizWhiteSpacing6xl: number;
	horizWhiteSpacinglg: number;
	horizWhiteSpacingmd: number;
	horizWhiteSpacingsm: number;
	horizWhiteSpacingxl: number;
	horizWhiteSpacingxs: number;
};

export type VerticalSpacing = {
	vertWhiteSpacing2xl: number;
	vertWhiteSpacing2xs: number;
	vertWhiteSpacing3xl: number;
	vertWhiteSpacing3xs: number;
	vertWhiteSpacing4xl: number;
	vertWhiteSpacing5xl: number;
	vertWhiteSpacing6xl: number;
	vertWhiteSpacinglg: number;
	vertWhiteSpacingmd: number;
	vertWhiteSpacingsm: number;
	vertWhiteSpacingxl: number;
	vertWhiteSpacingxs: number;
};

export type BaseThemeSpacingType = {
	baseSpacing: BaseSpacing;
	spacing: Spacing;
	horizontalSpacing: HorizontalSpacing;
	verticalSpacing: VerticalSpacing;
};
