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

import { DIRECTION, spacingValue, SPACING_MODIFIERS } from "./utils.js";

const marginGenerator = (direction: string, modifier: string) => {
	const suffix = modifier.slice(0, 1) === "-" ? modifier.slice(1) : modifier;

	switch (direction) {
		case "horizontal":
			return css`
				&-x-${suffix} {
					&& {
						margin-left: ${spacingValue(direction, modifier)};
						margin-right: ${spacingValue(direction, modifier)};
					}
				}
			`;
		case "vertical":
			return css`
				&-y-${suffix} {
					&& {
						margin-top: ${spacingValue(direction, modifier)};
						margin-bottom: ${spacingValue(direction, modifier)};
					}
				}
			`;
		case "all":
			return css`
				&-${suffix} {
					&& {
						margin: ${spacingValue("horizontal", modifier)} ${spacingValue("vertical", modifier)};
					}
				}
			`;
		default:
			return css`
				&-${direction.slice(0, 1)}-${suffix} {
					&&{
					  margin-${direction}: ${spacingValue(direction, modifier)}
					}
				}
			`;
	}
};

export const margin = DIRECTION.map((direct) => {
	return css`
		.${addPrefix("-u-margin")} {
			${[...SPACING_MODIFIERS, "auto"].map((modifier) => {
				return marginGenerator(direct, modifier);
			})}
		}
		.${addPrefix("-u-negative-margin")} {
			${SPACING_MODIFIERS.filter((modifier) => modifier !== "0").map((modifier) => {
				return marginGenerator(direct, `-${modifier}`);
			})}
		}
	`;
});
