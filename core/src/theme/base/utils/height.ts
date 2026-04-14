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

export const height = css`
	${({ theme }) => {
		const { typography } = theme;

		return css`
			.${addPrefix("-u")} {
				&-height-auto {
					&& {
						height: auto;
					}
				}
				&-height-px {
					&& {
						height: 1px;
					}
				}
				&-height-1 {
					&& {
						height: calc(0.25 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-2 {
					&& {
						height: calc(0.5 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-3 {
					&& {
						height: ${typography.fontSize.tinyFontSize};
					}
				}
				&-height-4 {
					&& {
						height: ${typography.fontSize.mediumFontSize};
					}
				}
				&-height-5 {
					&& {
						height: ${typography.fontSize.bigFontSize};
					}
				}
				&-height-6 {
					&& {
						height: ${typography.fontSize.hugeFontSize};
					}
				}
				&-height-8 {
					&& {
						height: calc(2 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-10 {
					&& {
						height: calc(2.5 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-12 {
					&& {
						height: ${typography.fontSize["5XlFontSize"]};
					}
				}
				&-height-16 {
					&& {
						height: calc(4 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-24 {
					&& {
						height: calc(6 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-32 {
					&& {
						height: calc(8 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-48 {
					&& {
						height: calc(12 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-64 {
					&& {
						height: calc(16 * ${typography.fontSize.mediumFontSize});
					}
				}
				&-height-full {
					&& {
						height: 100%;
					}
				}
				&-height-screen {
					&& {
						height: 100vh;
					}
				}
			}
		`;
	}}
`;
