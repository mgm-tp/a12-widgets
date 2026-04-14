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

export const width = css`
	${({ theme }) => {
		const { fontSize } = theme.typography;

		return css`
			.${addPrefix("-u")} {
				&-width-auto {
					&& {
						width: auto;
					}
				}
				&-width-px {
					&& {
						width: 1px;
					}
				}
				&-width-1 {
					&& {
						width: calc(0.25 * ${fontSize.mediumFontSize});
					}
				}
				&-width-2 {
					&& {
						width: calc(0.5 * ${fontSize.mediumFontSize});
					}
				}
				&-width-3 {
					&& {
						width: ${fontSize.tinyFontSize};
					}
				}
				&-width-4 {
					&& {
						width: ${fontSize.mediumFontSize};
					}
				}
				&-width-5 {
					&& {
						width: ${fontSize.bigFontSize};
					}
				}
				&-width-6 {
					&& {
						width: ${fontSize.hugeFontSize};
					}
				}
				&-width-8 {
					&& {
						width: calc(2 * ${fontSize.mediumFontSize});
					}
				}
				&-width-10 {
					&& {
						width: calc(2.5 * ${fontSize.mediumFontSize});
					}
				}
				&-width-12 {
					&& {
						width: ${fontSize["5XlFontSize"]};
					}
				}
				&-width-16 {
					&& {
						width: calc(4 * ${fontSize.mediumFontSize});
					}
				}
				&-width-24 {
					&& {
						width: calc(6 * ${fontSize.mediumFontSize});
					}
				}
				&-width-32 {
					&& {
						width: calc(8 * ${fontSize.mediumFontSize});
					}
				}
				&-width-48 {
					&& {
						width: calc(12 * ${fontSize.mediumFontSize});
					}
				}
				&-width-64 {
					&& {
						width: calc(16 * ${fontSize.mediumFontSize});
					}
				}
				&-width-1-2 {
					&& {
						width: 50%;
					}
				}
				&-width-1-3 {
					&& {
						width: 33.33333%;
					}
				}
				&-width-2-3 {
					&& {
						width: 66.66667%;
					}
				}
				&-width-1-4 {
					&& {
						width: 25%;
					}
				}
				&-width-3-4 {
					&& {
						width: 75%;
					}
				}
				&-width-1-5 {
					&& {
						width: 20%;
					}
				}
				&-width-2-5 {
					&& {
						width: 40%;
					}
				}
				&-width-3-5 {
					&& {
						width: 60%;
					}
				}
				&-width-4-5 {
					&& {
						width: 80%;
					}
				}
				&-width-1-6 {
					&& {
						width: 16.66667%;
					}
				}
				&-width-5-6 {
					&& {
						width: 83.33333%;
					}
				}
				&-width-full {
					&& {
						width: 100%;
					}
				}
				&-width-screen {
					&& {
						width: 100vw;
					}
				}
			}
		`;
	}}
`;
