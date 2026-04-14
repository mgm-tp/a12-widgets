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

import type { CompactThemeType } from "../../../schema.js";
import { typographyHeadlineCalculation } from "../../../default/config/components/typography.config.js";

export const typographyCompactConfig = (theme: CompactThemeType) => {
	const compactConfig = {
		headlineColor: "#596573",
		lineHeight: 1.35
	};
	const { spacing } = theme;

	return {
		graphic: {
			iconSize: "1.2rem"
		},
		headline1: {
			color: compactConfig.headlineColor,
			height: typographyHeadlineCalculation(2.95, compactConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline2: {
			color: compactConfig.headlineColor,
			fontSize: typographyHeadlineCalculation(1.3, compactConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(2, compactConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline3: {
			color: compactConfig.headlineColor,
			fontSize: typographyHeadlineCalculation(1.2, compactConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.7, compactConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline4: {
			color: compactConfig.headlineColor,
			fontSize: typographyHeadlineCalculation(1, compactConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.6, compactConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline5: {
			color: "#4e5865",
			fontSize: typographyHeadlineCalculation(0.9, compactConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.6, compactConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		wrapper: {
			minHeight: spacing.baseSpacing.BASE * 2.5 + "px"
		}
	};
};
