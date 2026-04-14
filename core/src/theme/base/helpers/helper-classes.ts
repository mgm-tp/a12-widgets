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

import { backgroundColorHelper } from "./background-color.js";
import { displayHelper } from "./display.js";
import { floatHelper } from "./float.js";
import { fontColorHelper } from "./font-color.js";
import { fontSizeHelper } from "./font-size.js";
import { fontStyleHelper } from "./font-style.js";
import { fontWeightHelper } from "./font-weight.js";
import { lineHeightHelper } from "./line-height.js";
import { marginHelper } from "./margin.js";
import { paddingHelper } from "./padding.js";
import { textAlignHelper } from "./text-align.js";
import { textTransformHelper } from "./text-transform.js";
import { verticalAlignHelper } from "./vertical-align.js";
import { wordBreakHelper } from "./word_break.js";

export const helperClasses = css`
	${backgroundColorHelper}
	${displayHelper}
    ${floatHelper}
    ${fontColorHelper}
    ${fontSizeHelper}
    ${fontStyleHelper}
    ${fontWeightHelper}
    ${lineHeightHelper}
    ${marginHelper}
    ${paddingHelper}
    ${textAlignHelper}
    ${textTransformHelper}
    ${verticalAlignHelper}
    ${wordBreakHelper}
`;
