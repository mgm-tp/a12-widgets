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

import type { Showcase } from "../../../helpers/definitions.js";

import { GalleryExample } from "./gallery.js";

import galleryCode from "!./gallery.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Gallery Example",
		description: (
			<p>
				This example shows how you can create a Gallery with supporting searching data and visualizing data by modifying
				the height of the image preview area.
			</p>
		),
		sections: [
			{
				content: <GalleryExample />,
				code: { name: "gallery.tsx", code: galleryCode },
				useDarkBackground: true
			}
		],
		featuredWidgets: [
			{
				name: "Layout Grid",
				url: "#/widgets/layout/layout-grid",
				description: "displays gallery by responsive grid-based layout."
			},
			{
				name: "Content Box",
				url: "#/widgets/layout/content-box",
				description: "displays gallery with data and search area."
			},
			{
				name: "Slider",
				url: "#/experimental/slider",
				description: "modifies the height of the image preview area."
			},
			{
				name: "Card",
				url: "#/widgets/data-display/card",
				description:
					"used along with Responsive Image Container to display gallery items according to the value of the Slider."
			}
		]
	}
];

export default {
	label: "Gallery",
	structure: showcases,
	useFullPageLayout: true
};
