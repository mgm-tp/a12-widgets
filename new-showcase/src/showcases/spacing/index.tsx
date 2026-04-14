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
import { StyledShowcaseBulletList, StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { HorizontalSpacingShowcase } from "./horiz_spacing.js";
import { SpacingShowcase } from "./spacing.js";
import { VerticalSpacingShowcase } from "./vert_spacing.js";

const showcases: Showcase[] = [
	{
		label: "Spacing",
		description: (
			<>
				<p>
					Widgets provides a <strong>Spacing System</strong> which is used to define the sizes of all components as well
					as the spacing between them.
				</p>
				<p>
					There are <strong>3</strong> Plasma spacing variables used to control spacing of all Widgets:
				</p>
				<StyledShowcaseBulletList>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/spacing#spacing">Spacing</StyledShowcaseLink>
					</BulletList.Item>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/spacing#vertical-spacing">Vertical Spacing</StyledShowcaseLink>
					</BulletList.Item>
					<BulletList.Item>
						<StyledShowcaseLink href="#/basics/theme/spacing#horizontal-spacing">Horizontal Spacing</StyledShowcaseLink>
					</BulletList.Item>
				</StyledShowcaseBulletList>
				<p>These variables are also used to further our current Widgets themes:</p>

				<strong>Default & Flat theme:</strong>
				<StyledShowcaseBulletList>
					<BulletList.Item>Spacing: 16px</BulletList.Item>
					<BulletList.Item>Vertical Spacing: 16px</BulletList.Item>
					<BulletList.Item>Horizontal Spacing: 16px</BulletList.Item>
				</StyledShowcaseBulletList>

				<strong>Compact & Flat-Compact theme:</strong>
				<StyledShowcaseBulletList>
					<BulletList.Item>Spacing: 12px</BulletList.Item>
					<BulletList.Item>Vertical Spacing: 12px</BulletList.Item>
					<BulletList.Item>Horizontal Spacing: 12px</BulletList.Item>
				</StyledShowcaseBulletList>

				<p>
					See more about theming and changing Plasma variables{" "}
					<StyledShowcaseLink href="#/get-started/use-and-configure-widgets-style">here</StyledShowcaseLink>.
				</p>
			</>
		),
		sections: [
			{
				label: "Spacing",
				content: <SpacingShowcase />,
				description: (
					<>
						<p>
							<strong>Spacing</strong> is used to adjust the width and height of an element. The <code>spacing</code>{" "}
							values are calculated based on the <code>BaseSpacingConfig.BASE</code>.
						</p>
						<p>
							The following example shows how the <code>spacing</code> values are calculated based on a specific{" "}
							<code>BaseSpacingConfig.BASE</code> value.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Vertical Spacing",
				content: <VerticalSpacingShowcase />,
				description: (
					<>
						<p>
							<strong>Vertical Spacing</strong> is used to define the vertical margin and vertical padding of an
							element. The <code>verticalSpacing</code> values are calculate based on{" "}
							<code>BaseSpacingConfig.BASE_VERTICAL_WHITE_SPACING</code>.
						</p>
						<p>
							The following example shows how the <code>verticalSpacing</code> values are calculated based on a specific{" "}
							<code>BaseSpacingConfig.BASE_VERTICAL_WHITE_SPACING</code> value.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Horizontal Spacing",
				content: <HorizontalSpacingShowcase />,
				description: (
					<>
						<p>
							<strong>Horizontal Spacing</strong> is used to define the horizontal margin and horizontal padding of an
							element.The <code>horizontalSpacing</code> values are calculate based on{" "}
							<code>BaseSpacingConfig.BASE_HORIZONTAL_WHITE_SPACING</code>.
						</p>
						<p>
							The following example shows how the <code>horizontalSpacing</code> values are calculated based on a
							specific <code>BaseSpacingConfig.BASE_HORIZONTAL_WHITE_SPACING</code> value.
						</p>
					</>
				),
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Spacing",
	structure: showcases
};
