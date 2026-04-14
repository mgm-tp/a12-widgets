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

import { rgba } from "polished";
import type { CSSObject } from "styled-components";
import { css } from "styled-components";

/**
 * Active: Style for devices with hover-incapable pointing
 */
export const active = (style: ReturnType<typeof css>, selector?: CSSObject | string) => {
	if (selector) {
		return css`
			@media (pointer: coarse) {
				${selector}:active && {
					-webkit-tap-highlight-color: ${rgba(0, 0, 0, 0)};
					${style}
				}
			}
		`;
	}

	return css`
		@media (pointer: coarse) {
			&:active {
				-webkit-tap-highlight-color: ${rgba(0, 0, 0, 0)};
				${style}
			}
		}
	`;
};

/**
 * Hover: Style for devices with hover-capable pointing
 */
export const hover = (style: ReturnType<typeof css>, selector?: CSSObject | string) => {
	if (selector) {
		return css`
			@media (pointer: fine) {
				${selector}:hover && {
					${style}
				}
			}
		`;
	}

	return css`
		@media (pointer: fine) {
			&:hover {
				${style}
			}
		}
	`;
};

export const activeAndHover = (style: ReturnType<typeof css>, selector?: CSSObject | string) => css`
	${active(style, selector)}
	${hover(style, selector)}
`;

export const brightFocus = css`
	outline: ${({ theme }) => theme.focusStyles.focusedBoundaryLight};
`;

export const inputBrightFocus = css`
	outline: ${({ theme }) => theme.baseInputStyles.focusedBoundaryLight ?? theme.focusStyles.focusedBoundaryLight};
`;

export const darkFocus = css`
	outline: ${({ theme }) => theme.focusStyles.focusedBoundaryDark};
`;

export const inputDarkFocus = css`
	outline: ${({ theme }) => theme.baseInputStyles.focusedBoundaryDark ?? theme.focusStyles.focusedBoundaryDark};
`;
