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
import { useRef } from "react";

import { Tree } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree/main/tpl/tree.tpl.view.js";
import type { TreeNodeTemplateModel } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree/main/tpl/tree.tpl.api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/index.js";

const TREE_ROOT: TreeNodeTemplateModel = {
	id: "1",
	label: "Root",
	children: [
		{ id: "2", label: "Node 2" },
		{ id: "3", label: "Node 3" },
		{ id: "4", label: "Node 4" },
		{ id: "5", label: "Node 5" },
		{ id: "6", label: "Node 6" },
		{ id: "7", label: "Node 7" },
		{ id: "8", label: "Node 8" },
		{ id: "9", label: "Node 9" },
		{ id: "10", label: "Node 10" },
		{ id: "11", label: "Node 11" },
		{ id: "12", label: "Node 12" },
		{ id: "13", label: "Node 13" },
		{ id: "14", label: "Node 14" },
		{ id: "15", label: "Node 15" }
	]
};

const meta: Meta<typeof Tree> = {
	title: "Widgets/Data Display/Tree",
	component: Tree,
	parameters: {
		layout: "centered"
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollToNode: Story = {
	render: () => {
		const scrollHandlerRef = useRef<((nodeId: string | number) => void) | undefined>(undefined);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
				<ButtonGroup>
					<Button onClick={() => scrollHandlerRef.current?.("2")}>Scroll to Node 2</Button>
					<Button onClick={() => scrollHandlerRef.current?.("8")}>Scroll to Node 8</Button>
					<Button onClick={() => scrollHandlerRef.current?.("15")}>Scroll to Node 15</Button>
				</ButtonGroup>

				<div style={{ height: 200, overflow: "auto", border: "1px solid #ccc" }}>
					<Tree
						id="scroll-to-node-tree"
						root={TREE_ROOT}
						scrollToNode={(handler) => {
							scrollHandlerRef.current = handler;
						}}
					/>
				</div>
			</div>
		);
	}
};
