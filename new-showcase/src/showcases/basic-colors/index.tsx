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

import type { Showcase } from "../../helpers/definitions.js";

import { MainColorsShowcase } from "./main-colors.js";
import { TextColorsShowcase } from "./text-colors.js";
import { BackgroundColorsShowcase } from "./background-colors.js";
import { DividerColorsShowcase } from "./dividers-colors.js";
import { InteractionColorsShowcase } from "./interaction-colors.js";
import { InteractionStatesColorsShowcase } from "./interaction-states-colors.js";
import { MessageColorsShowcase } from "./message-colors.js";
import { DecorationColorsShowcase } from "./decoration-colors.js";
import { HightlightColorsShowcase } from "./hightlight-colors.js";
import { StatusColorsShowcase } from "./status-colors.js";

const showcases: Showcase[] = [
	{
		label: "Colors",
		description: (
			<p>
				Our color set consists of the following colors. By using semantic terms instead of explicit color definitions,
				we guarantee sustainability, maintainability, and consistency throughout our widgets.
			</p>
		),
		sections: [
			{
				label: "Main Colors",
				content: <MainColorsShowcase />
			},
			{
				label: "Text Colors",
				content: <TextColorsShowcase />
			},
			{
				label: "Background Colors",
				content: <BackgroundColorsShowcase />
			},
			{
				label: "Divider Colors",
				content: <DividerColorsShowcase />
			},
			{
				label: "Interaction Colors",
				content: <InteractionColorsShowcase />
			},
			{
				label: "Interaction States",
				content: <InteractionStatesColorsShowcase />
			},
			{
				label: "Message Colors",
				content: <MessageColorsShowcase />
			},
			{
				label: "Decoration Colors",
				content: <DecorationColorsShowcase />
			},
			{
				label: "Highlight Colors",
				content: <HightlightColorsShowcase />
			},
			{
				label: "Status Colors",
				content: <StatusColorsShowcase />
			}
		]
	}
];

export default {
	label: "Colors",
	structure: showcases
};
