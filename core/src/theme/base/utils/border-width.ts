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

import { css } from "styled-components";

import { addPrefix } from "../../../common/main/utils.js";

import { DIRECTION } from "./utils.js";

const setBorder = (width: number) => {
	if (width === 1) {
		return css`
			&& {
				border-width: 1px;
			}
		`;
	}

	return css`
		&-${width} {
			&& {
				border-width: ${width}px;
			}
		}
	`;
};

const borderWidthGenerator = (direct: string) => {
	const directionSuffix = direct.slice(0, 1);

	return [0, 1, 2, 4, 8].map((value) => {
		if (direct === "all") {
			return setBorder(value);
		}

		if (value === 1) {
			return css`
				&-${directionSuffix} {
				  && {
				    border-${direct}-width: 1px;
				  }
				}
			`;
		}

		return css`
				&-${directionSuffix}-${value} {
				  && {
				    border-${direct}-width: ${value}px;
				  }
				}
			`;
	});
};

export const borderWidth = DIRECTION.filter((value) => value !== "horizontal" && value !== "vertical").map((direct) => {
	return css`
		.${addPrefix("-u-border")} {
			${borderWidthGenerator(direct)}
		}
	`;
});
