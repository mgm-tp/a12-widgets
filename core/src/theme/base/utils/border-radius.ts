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

const DIRECTION = ["all", "top", "bottom", "right", "left", "top-left", "top-right", "bottom-left", "bottom-right"];
const MODIFIERS = ["none", "sm", "default", "lg", "full"];

const borderRadiusValue = (modifier: string) => css`
	${({ theme }) => {
		const { fontSize } = theme.typography;

		if (modifier === "sm") {
			return `calc(0.125 * ${fontSize.mediumFontSize})`;
		}

		if (modifier === "default") {
			return `calc(0.25 * ${fontSize.mediumFontSize})`;
		}

		if (modifier === "lg") {
			return `calc(0.5 * ${fontSize.mediumFontSize})`;
		}

		if (modifier === "full") {
			return "9999px";
		}

		return 0;
	}}
`;

const borderRadiusGenerator = (direct: string, modifier: string) => {
	const modifierSuffix = modifier === "default" ? "" : `-${modifier}`;
	const radiusValue = borderRadiusValue(modifier);

	switch (direct) {
		case "top":
			return css`
				&-t${modifierSuffix} {
					&& {
						border-top-left-radius: ${radiusValue};
						border-top-right-radius: ${radiusValue};
					}
				}
			`;
		case "bottom":
			return css`
				&-b${modifierSuffix} {
					&& {
						border-bottom-left-radius: ${radiusValue};
						border-bottom-right-radius: ${radiusValue};
					}
				}
			`;
		case "left":
			return css`
				&-l${modifierSuffix} {
					&& {
						border-top-left-radius: ${radiusValue};
						border-bottom-left-radius: ${radiusValue};
					}
				}
			`;
		case "right":
			return css`
				&-r${modifierSuffix} {
					&& {
						border-top-right-radius: ${radiusValue};
						border-bottom-right-radius: ${radiusValue};
					}
				}
			`;
		case "top-left":
			return css`
				&-tl${modifierSuffix} {
					&& {
						border-top-left-radius: ${radiusValue};
					}
				}
			`;
		case "top-right":
			return css`
				&-tr${modifierSuffix} {
					&& {
						border-top-right-radius: ${radiusValue};
					}
				}
			`;
		case "bottom-left":
			return css`
				&-bl${modifierSuffix} {
					&& {
						border-bottom-left-radius: ${radiusValue};
					}
				}
			`;
		case "bottom-right":
			return css`
				&-br${modifierSuffix} {
					&& {
						border-bottom-right-radius: ${radiusValue};
					}
				}
			`;
		default:
			return css`
				&${modifierSuffix} {
					&& {
						border-radius: ${radiusValue};
					}
				}
			`;
	}
};

export const borderRadius = css`
	.${addPrefix("-u-rounded")} {
		${DIRECTION.map((direct) => MODIFIERS.map((modifier) => borderRadiusGenerator(direct, modifier)))}
	}
`;
