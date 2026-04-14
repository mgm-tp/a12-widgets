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

import type { JSONOutput } from "typedoc";

import ResponsiveImageContainerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/responsive-image-container/main/responsive-image-container.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { ResponsiveImageContainerShowcase } from "./basic.js";

import basicCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Responsive Image Container",
		description: (
			<p>
				The <strong>Responsive Image Container</strong> Widget is used to display an image that can be scaled to fit the
				parent. If the intrinsic size of the image is smaller than the parent, it will not be enlarged to keep the
				quality.
			</p>
		),
		sections: [
			{
				content: <ResponsiveImageContainerShowcase />,
				useConfiguration: true,
				code: { name: "basic.tsx", code: basicCode },
				toggleBetweenPartialAndFullCode: true
			}
		]
	}
];

export default {
	label: "Responsive Image Container",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ResponsiveImageContainerAPI as JSONOutput.DeclarationReflection }],
		themingConfiguration: "responsiveImageContainer"
	}
};
