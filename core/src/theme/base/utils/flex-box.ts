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

export const flexBox = css`
	.${addPrefix("-u")} {
		&-flex {
			&& {
				display: flex;
			}
		}
		&-inline-flex {
			&& {
				display: inline-flex;
			}
		}

		// Flex direction
		&-flex-row {
			&& {
				flex-direction: row;
			}
		}
		&-flex-row-reverse {
			&& {
				flex-direction: row-reverse;
			}
		}
		&-flex-col {
			&& {
				flex-direction: column;
			}
		}
		&-flex-col-reverse {
			&& {
				flex-direction: column-reverse;
			}
		}

		// Flex wrap
		&-flex-wrap {
			&& {
				flex-wrap: wrap;
			}
		}
		&-flex-wrap-reverse {
			&& {
				flex-wrap: wrap-reverse;
			}
		}
		&-flex-no-wrap {
			&& {
				flex-wrap: nowrap;
			}
		}

		// Align items
		&-items-start {
			&& {
				align-items: flex-start;
			}
		}
		&-items-end {
			&& {
				align-items: flex-end;
			}
		}
		&-items-center {
			&& {
				align-items: center;
			}
		}
		&-items-baseline {
			&& {
				align-items: baseline;
			}
		}
		&-items-stretch {
			&& {
				align-items: stretch;
			}
		}

		// Align self
		&-self-auto {
			&& {
				align-self: auto;
			}
		}
		&-self-start {
			&& {
				align-self: flex-start;
			}
		}
		&-self-end {
			&& {
				align-self: flex-end;
			}
		}
		&-self-center {
			&& {
				align-self: center;
			}
		}
		&-self-stretch {
			&& {
				align-self: stretch;
			}
		}

		// Justify content
		&-justify-start {
			&& {
				justify-content: flex-start;
			}
		}
		&-justify-end {
			&& {
				justify-content: flex-end;
			}
		}
		&-justify-center {
			&& {
				justify-content: center;
			}
		}
		&-justify-between {
			&& {
				justify-content: space-between;
			}
		}
		&-justify-around {
			&& {
				justify-content: space-around;
			}
		}

		// Align content
		&-content-center {
			&& {
				align-content: center;
			}
		}
		&-content-start {
			&& {
				align-content: flex-start;
			}
		}
		&-content-end {
			&& {
				align-content: flex-end;
			}
		}
		&-content-between {
			&& {
				align-content: space-between;
			}
		}
		&-content-around {
			&& {
				align-content: space-around;
			}
		}

		// Flex, Grow, Shrink
		&-flex-1 {
			&& {
				flex: 1;
			}
		}
		&-flex-auto {
			&& {
				flex: auto;
			}
		}
		&-flex-initial {
			&& {
				flex: initial;
			}
		}
		&-flex-none {
			&& {
				flex: none;
			}
		}
		&-flex-grow {
			&& {
				flex-grow: 1;
			}
		}
		&-flex-shrink {
			&& {
				flex-shrink: 1;
			}
		}
		&-flex-no-grow {
			&& {
				flex-grow: 0;
			}
		}
		&-flex-no-shrink {
			&& {
				flex-shrink: 0;
			}
		}
	}
`;
