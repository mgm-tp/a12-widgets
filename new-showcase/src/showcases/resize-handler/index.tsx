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

import ResizeHandlerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/resizable/resize-handler.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { ResizeHandlerShowcase } from "./resize-handler.js";

import resizeHandlerCode from "!./resize-handler.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Resize Handler",
		description: (
			<>
				<p>
					The <strong>Resize Handler</strong> is designed to provide a flexible and user-friendly interface for resizing
					elements within a layout. It allows to add resizable functionality to specific elements, enabling dynamic
					adjustments to their width based on user interactions.
				</p>
				<p>
					Here are some necessary properties to ensure proper functionality and provide a seamless resizing experience:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>
						<code>targetRef</code>: A ref to the DOM element that will be resized. This is essential for the{" "}
						<strong>Resize Handler</strong> to identify and manipulate the target element during resizing.
					</BulletList.Item>
					<BulletList.Item>
						<code>minWidth</code> and <code>maxWidth</code>: These define the minimum and maximum width constraints for
						the resizable element. They ensure that the resizing stays within the desired bounds.
					</BulletList.Item>
				</BulletList.Unordered>
				<p>To view more examples of using the resize feature, check out:</p>
				<BulletList.Unordered>
					<BulletList.Item>
						<Link href="#/examples/sidebar-with-tab-panel">Sidebar with Tab Panel</Link>
					</BulletList.Item>
					<BulletList.Item>
						<Link href="#/examples/master-detail">Master Detail</Link>
					</BulletList.Item>
					<BulletList.Item>
						<Link href="#/widgets/layout/split-view">Split View</Link>
					</BulletList.Item>
				</BulletList.Unordered>
			</>
		),
		sections: [
			{
				content: <ResizeHandlerShowcase />,
				useDarkBackground: true,
				code: { name: "resize-handler.tsx", code: resizeHandlerCode }
			}
		]
	}
];

export default {
	label: "Resize Handler",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: {
					...ResizeHandlerAPI,
					children: ResizeHandlerAPI.children?.filter((child) => child.name !== "ResizeOptions")
				} as JSONOutput.DeclarationReflection
			}
		]
	}
};
