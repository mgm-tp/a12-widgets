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

import { ExternalLink, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { BetweenTreeAndTable } from "./between-tree-and-table.js";
import { BetweenTreeAndTreeTable } from "./between-tree-and-treetable.js";
import { SimpleDnDExample } from "./simple.js";
import { BetweenTwoTrees } from "./between-two-trees.js";
import { IFrameExample } from "./iframe.js";

import treeTableCode from "!./main/tree-table.tsx?raw";
import treeCode from "!./main/tree.tsx?raw";
import tableCode from "!./main/table.tsx?raw";
import betweenTreeAndTableCode from "!./between-tree-and-table.tsx?raw";
import betweenTreeAndTreeTableCode from "!./between-tree-and-treetable.tsx?raw";
import simpleDnDExampleCode from "!./simple.tsx?raw";
import betweenTwoTreesCode from "!./between-two-trees.tsx?raw";
import iFrameCode from "!./iframe.tsx?raw";
import dragAndDropAPICode from "!./main/showcase-drag-and-drop.api.ts?raw";
import sharedTreeCode from "!./shared/tree.ts?raw";
import sharedTableCode from "!./shared/table.ts?raw";
import dndStyledCode from "!./shared/dnd.styled.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Drag and Drop Examples",
		description: (
			<p>
				You can find different examples that combine the usage of Widgets and{" "}
				<ExternalLink href="https://react-dnd.github.io/react-dnd/docs/overview">react-dnd</ExternalLink>.
			</p>
		),
		sections: [
			{
				label: "Simple Example",
				content: <SimpleDnDExample />,
				description: (
					<p>
						This is a simple example to show you how to use react-dnd. For more detailed information, please refer to
						the <ExternalLink href="https://react-dnd.github.io/react-dnd/docs/overview">react-dnd</ExternalLink>{" "}
						documentation.
					</p>
				),
				code: [
					{ name: "simple.tsx", code: simpleDnDExampleCode },
					{ name: "shared/dnd.styled.tsx", code: dndStyledCode }
				]
			},
			{
				label: "Between Two Trees",
				content: <BetweenTwoTrees />,
				description: (
					<p>This example shows you how to implement a complex drag & drop behavior between two Tree widgets.</p>
				),
				useDarkBackground: true,
				code: [
					{ name: "between-two-trees.tsx", code: betweenTwoTreesCode },
					{ name: "main/showcase-drag-and-drop.api.ts", code: dragAndDropAPICode },
					{ name: "main/tree.tsx", code: treeCode },
					{ name: "shared/tree.ts", code: sharedTreeCode }
				],
				fullSize: true,
				fitToSection: true
			},
			{
				label: "Between Tree and Table",
				content: <BetweenTreeAndTable />,
				description: (
					<>
						<p>
							This example shows you how to implement a complex drag & drop behavior between Tree and Table widgets. The
							tree on the left shows a team (e.g A12) that includes a list of people. The table on the right includes a
							list of unassigned people.
						</p>
						<p>We also introduce some constraints between entities to make use of the drag & drop API:</p>
						<ul>
							<li>A team can have many people.</li>
							<li>A person can only belong to a team.</li>
							<li>A person can not belong to any person.</li>
						</ul>
						<p>Try to drag & drop people around to arrange your own team.</p>
					</>
				),
				useDarkBackground: true,
				code: [
					{ name: "between-tree-and-table.tsx", code: betweenTreeAndTableCode },
					{ name: "main/showcase-drag-and-drop.api.ts", code: dragAndDropAPICode },
					{ name: "main/tree.tsx", code: treeCode },
					{ name: "main/table.tsx", code: tableCode },
					{ name: "shared/tree.ts", code: sharedTreeCode },
					{ name: "shared/table.ts", code: sharedTableCode }
				],
				fullSize: true,
				fitToSection: true
			},
			{
				label: "Between Tree and Tree Table",
				content: <BetweenTreeAndTreeTable />,
				description: (
					<>
						<p>
							This example shows you how to implement a complex drag & drop behavior between Tree and Tree Table
							widgets. The tree on the left shows a team (e.g. A12) that includes a list of people. The tree table on
							the right includes a list of onboarding people.
						</p>
						<p>We also introduce some constraints between entities to make use of the drag & drop API:</p>
						<ul>
							<li>A team can have many people.</li>
							<li>A person can only belong to a team.</li>
							<li>A person can not belong to any person.</li>
						</ul>
						<p>Try to drag & drop people around to arrange your own team.</p>
					</>
				),
				useDarkBackground: true,
				code: [
					{ name: "between-tree-and-treetable.tsx", code: betweenTreeAndTreeTableCode },
					{ name: "main/showcase-drag-and-drop.api.ts", code: dragAndDropAPICode },
					{ name: "main/tree-table.tsx", code: treeTableCode },
					{ name: "main/tree.tsx", code: treeCode },
					{ name: "shared/tree.ts", code: sharedTreeCode },
					{ name: "shared/tree-table.ts", code: sharedTableCode }
				],
				fullSize: true,
				fitToSection: true
			},

			{
				label: "iFrame",
				content: !provider.hasTouch() ? <IFrameExample /> : undefined,
				code: [
					{ name: "iframe.tsx", code: iFrameCode },
					{ name: "dnd.styled.tsx", code: dndStyledCode }
				],
				description: (
					<>
						<p>
							This example demonstrates drag & drop from/to iFrame and currently only supports{" "}
							<strong>non-touch</strong> devices. Currently, it's not officially supported by React-DnD since we are
							using the private method of HTML5Backend. However, it's the only solution we can find right now.
						</p>
						<p>
							In general, the iFrame needs a node where we can hook our drag and drop code into it. For example, in the
							below code is a div with <code>id="topframe-root"</code>.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Drag And Drop",
	structure: showcases
};
