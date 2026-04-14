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

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { FontShowcaseContent } from "./font.js";
import { FontSizeShowcaseContent } from "./font-size.js";
import { FontWeightShowcaseContent } from "./font-weight.js";

const showcases: Showcase[] = [
	{
		label: "Fonts",
		description: (
			<>
				<p>
					Widgets provides a <strong>Font System</strong> which is used to define the font family, font sizes and font
					weights.
				</p>
				<p>
					There are <strong>3</strong> font variables used to control the typography of Widgets:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/fonts#font">Font</StyledShowcaseLink>
					</BulletList.Item>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/fonts#font-size">Font Size</StyledShowcaseLink>
					</BulletList.Item>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/fonts#font-weight">Font Weight</StyledShowcaseLink>
					</BulletList.Item>
				</BulletList.Unordered>

				<p>
					See more about theming and changing Plasma variables{" "}
					<StyledShowcaseLink href="#/get-started/use-and-configure-widgets-style">here</StyledShowcaseLink>.
				</p>
			</>
		),
		sections: [
			{
				label: "Font",
				content: <FontShowcaseContent />
			},
			{
				label: "Font Size",
				content: <FontSizeShowcaseContent />
			},
			{
				label: "Font Weight",
				content: <FontWeightShowcaseContent />
			}
		]
	}
];

export default {
	label: "Fonts",
	structure: showcases
};
