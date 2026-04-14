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

import SplitViewAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/split-view/main/split-view.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { SplitViewShowcase } from "./split-view.js";

import basicCode from "!./split-view.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Split View",
		description: (
			<>
				<p>
					The <strong>Split View</strong> Widget manages the presentation of multiple adjacent panes of content, each of
					which can contain a variety of components, including tables, images, and so on. It works as a container for{" "}
					<code>SplitView.Area</code>. We can easily make an <code>Area</code> hidden using React state.
				</p>
				<p>
					Providing a <code>resizableOptions</code> object enables customization to control the resizing behavior,
					including specifying minimum and maximum widths, as well as handling resize events effectively.
				</p>
				<p>
					To control the resizing behavior, use the <code>resizableOptions</code> property. Setting it to{" "}
					<code>true</code> enables the default resizing functionality. Alternatively, providing a{" "}
					<code>resizableOptions</code> object allows for advanced customization, such as setting <code>minWidth</code>{" "}
					and <code>maxWidth</code>, as well as handling resize events for precise control.
				</p>
				<p>
					For detailed guidance on customizing resizing behavior, refer to the{" "}
					<Link href="#/widgets/layout/resize-handler">Resize Handler</Link>.
				</p>
			</>
		),
		sections: [
			{
				content: <SplitViewShowcase />,
				code: { name: "split-view.tsx", code: basicCode },
				useDarkBackground: true
			}
		]
	}
];

export default {
	label: "Split View",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: SplitViewAPI as JSONOutput.DeclarationReflection }],
		themingConfiguration: "splitView"
	}
};
