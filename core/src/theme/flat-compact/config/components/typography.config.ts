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

import { lighten } from "polished";

import type { FlatCompactThemeType } from "../../../schema.js";

export const typographyFlatCompactConfig = (theme: FlatCompactThemeType) => {
	const flatCompactConfig = {
		borderTop: "none",
		fontWeight: 600,
		padding: 0
	};

	return {
		headline1: {
			color: lighten(0.05, theme.colors.text.headlineColor),
			...flatCompactConfig,
			fontWeight: 400
		},
		headline2: {
			...flatCompactConfig,
			color: "#333",
			fontSize: "18px",
			margin: "24px 0 12px 0"
		},
		headline3: {
			...flatCompactConfig,
			color: "#333",
			fontSize: "14px",
			margin: "20px 0 12px 0",
			height: "30px"
		},
		headline4: {
			...flatCompactConfig,
			color: "#767676",
			height: "32px",
			fontSize: "12px",
			margin: "20px 0 12px 0",
			textTransform: "uppercase"
		},
		headline5: {
			...flatCompactConfig,
			height: "30px"
		},
		wrapper: {
			padding: 0
		}
	};
};
