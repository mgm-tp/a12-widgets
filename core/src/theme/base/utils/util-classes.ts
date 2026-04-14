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

import { backgroundAttachment } from "./background-attachment.js";
import { backgroundColor } from "./background-color.js";
import { backgroundPosition } from "./background-position.js";
import { backgroundRepeat } from "./background-repeat.js";
import { backgroundSize } from "./background-size.js";
import { borderColor } from "./border-color.js";
import { borderRadius } from "./border-radius.js";
import { borderStyle } from "./border-style.js";
import { borderWidth } from "./border-width.js";
import { display } from "./display.js";
import { flexBox } from "./flex-box.js";
import { float } from "./float.js";
import { fontSize } from "./font-size.js";
import { fontWeight } from "./font-weight.js";
import { height } from "./height.js";
import { hyphens } from "./hyphens.js";
import { lineHeight } from "./line-height.js";
import { list } from "./list.js";
import { margin } from "./margin.js";
import { maxHeight } from "./max-height.js";
import { maxWidth } from "./max-width.js";
import { minHeight } from "./min-height.js";
import { minWidth } from "./min-width.js";
import { outlineColor } from "./outline-color.js";
import { outlineOffset } from "./outline-offset.js";
import { outlineStyle } from "./outline-style.js";
import { outlineWidth } from "./outline-width.js";
import { overflowUtils } from "./overflow.js";
import { padding } from "./padding.js";
import { position } from "./position.js";
import { textAlign } from "./text-align.js";
import { textColor } from "./text-color.js";
import { textStyle } from "./text-style.js";
import { typography } from "./typography.js";
import { userSelect } from "./user-select.js";
import { verticalAlign } from "./vertical-align.js";
import { visibility } from "./visibility.js";
import { width } from "./width.js";

export const utilClasses = css`
	${backgroundAttachment}
	${backgroundColor}
  	${backgroundPosition}
	${backgroundRepeat}
	${backgroundSize}
	${borderColor}
	${borderRadius}
	${borderStyle}
	${borderWidth}
	${display}
	${flexBox}
	${float}
	${fontSize}
	${fontWeight}
	${height}
	${hyphens}
	${lineHeight}
	${list}
	${margin}
	${maxHeight}
	${maxWidth}
	${minHeight}
	${minWidth}
	${outlineColor}
	${outlineOffset}
	${outlineStyle}
	${outlineWidth}
	${overflowUtils}
	${padding}
	${position}
	${textAlign}
	${textColor}
	${textStyle}
	${typography}
	${userSelect}
	${verticalAlign}
	${visibility}
	${width}
`;
