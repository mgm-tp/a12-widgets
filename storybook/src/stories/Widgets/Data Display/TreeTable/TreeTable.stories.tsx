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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { useRef } from "react";

import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.view.js";
import type {
	BaseTreeTableNode,
	BaseTreeTableColumnType,
	TreeTableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/index.js";

const COLUMNS: BaseTreeTableColumnType[] = [
	{ label: "Name", hierarchical: true, horizontalAlignment: "left" },
	{ label: "Type", horizontalAlignment: "left" },
	{ label: "Size", horizontalAlignment: "right" }
];

const TREE_ROOT: BaseTreeTableNode<string[]> = {
	id: 1,
	data: ["Root", "folder", "-"],
	children: [
		{ id: 2, data: ["Node 2", "file", "1 KB"] },
		{ id: 3, data: ["Node 3", "file", "2 KB"] },
		{ id: 4, data: ["Node 4", "file", "3 KB"] },
		{ id: 5, data: ["Node 5", "file", "4 KB"] },
		{ id: 6, data: ["Node 6", "file", "5 KB"] },
		{ id: 7, data: ["Node 7", "file", "6 KB"] },
		{ id: 8, data: ["Node 8", "file", "7 KB"] },
		{ id: 9, data: ["Node 9", "file", "8 KB"] },
		{ id: 10, data: ["Node 10", "file", "9 KB"] },
		{ id: 11, data: ["Node 11", "file", "10 KB"] },
		{ id: 12, data: ["Node 12", "file", "11 KB"] },
		{ id: 13, data: ["Node 13", "file", "12 KB"] },
		{ id: 14, data: ["Node 14", "file", "13 KB"] },
		{ id: 15, data: ["Node 15", "file", "14 KB"] }
	]
};

interface ScrollToNodeArgs {
	autoFocus: boolean;
}

const meta: Meta<ScrollToNodeArgs> = {
	title: "Widgets/Data Display/TreeTable",
	component: TreeTable as unknown as ComponentType<ScrollToNodeArgs>,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		autoFocus: {
			control: "boolean",
			description: "Automatically focus the target row after scrolling"
		}
	}
};

export default meta;
type Story = StoryObj<ScrollToNodeArgs>;

export const ScrollToNode: Story = {
	args: { autoFocus: false },
	render: ({ autoFocus }) => {
		const scrollHandlerRef = useRef<TreeTableScrollToNodeHandler | undefined>(undefined);

		const scrollTo = (nodeId: number) => scrollHandlerRef.current?.(nodeId, { autoFocus });

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 500 }}>
				<ButtonGroup>
					<Button onClick={() => scrollTo(2)}>Scroll to Node 2</Button>
					<Button onClick={() => scrollTo(8)}>Scroll to Node 8</Button>
					<Button onClick={() => scrollTo(15)}>Scroll to Node 15</Button>
				</ButtonGroup>

				<div style={{ height: 200, overflow: "auto", border: "1px solid #ccc" }}>
					<TreeTable
						id="scroll-to-node-tree-table"
						root={TREE_ROOT}
						columns={COLUMNS}
						scrollToNode={(handler) => {
							scrollHandlerRef.current = handler;
						}}
					/>
				</div>
			</div>
		);
	}
};
