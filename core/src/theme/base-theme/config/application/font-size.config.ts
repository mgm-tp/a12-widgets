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

import type { Font, FontSize } from "../../../schema/typography.api.js";

export const FontSizeConfig = (fontConfig: Font): FontSize => {
	return createFontSizeConfig(fontConfig.BASE_FONT_SIZE);
};

export const createFontSizeConfig = (baseFontSize: number): FontSize => {
	return {
		"5XlFontSize": `${3 * baseFontSize}rem`,
		"4XlFontSize": `${2.25 * baseFontSize}rem`,
		"3XlFontSize": `${1.875 * baseFontSize}rem`,
		hugeFontSize: `${1.5 * baseFontSize}rem`,
		bigFontSize: `${1.25 * baseFontSize}rem`,
		lgFontSize: `${1.125 * baseFontSize}rem`,
		mediumFontSize: `${1 * baseFontSize}rem`,
		smallFontSize: `${0.875 * baseFontSize}rem`,
		tinyFontSize: `${0.75 * baseFontSize}rem`,
		nanoFontSize: `${0.625 * baseFontSize}rem`
	};
};
