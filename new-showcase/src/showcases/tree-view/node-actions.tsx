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

import type { ReactElement } from "react";
import { useRef, useState } from "react";

import { Button, ButtonGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { TreeViewScrollToNodeHandler } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./basic.js";
import { fileIcon } from "./basic.js";

// Eight folders of five files each — enough to overflow the 240px host below. Keys are prefixed per
// example, since node keys must be unique document-wide (a node's DOM id is derived from its key).
const FILE_TREE: FileNode[] = Array.from({ length: 8 }, (_unused, group): FileNode => ({
	id: `actions-batch-${group}`,
	label: `batch-${group}`,
	kind: "folder",
	children: Array.from({ length: 5 }, (_u, index): FileNode => ({
		id: `actions-batch-${group}-run-${index}`,
		label: `run-${group}${index}.log`,
		kind: "file"
	}))
}));

/**
 * `getActions` renders trailing controls at the end of a node — here a download button per file. Stop
 * the click from propagating so it does not also select the node, and name the button after its node.
 * `isDisabled` greys a node out and makes it non-interactive. `fitToParent` makes the tree fill and
 * scroll within its host, and the `scrollToNode` handle brings a node into view by key.
 */
export function NodeActionsTreeView(): ReactElement {
	const scrollRef = useRef<TreeViewScrollToNodeHandler | null>(null);
	const [lastAction, setLastAction] = useState("Nothing downloaded yet");

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => scrollRef.current?.("actions-batch-0-run-0", { autoFocus: true })}>
					Scroll to first
				</Button>
				<Button onClick={() => scrollRef.current?.("actions-batch-4-run-2", { autoFocus: true })}>
					Scroll to run-42
				</Button>
				<Button onClick={() => scrollRef.current?.("actions-batch-7-run-4", { autoFocus: true })}>
					Scroll to last
				</Button>
			</ButtonGroup>
			<div style={{ height: 240 }}>
				<TreeView<FileNode>
					id="node-actions-tree-view"
					tree={FILE_TREE}
					rowKey="id"
					getChildren={(node) => node.children}
					getLabel={(node) => node.label}
					getIcon={fileIcon}
					defaultExpandAll
					fitToParent
					selectionMode="single"
					isDisabled={(node) => node.id === "actions-batch-2"}
					getActions={(node) =>
						node.kind === "file" ? (
							<Button
								icon={<Icon>download</Icon>}
								title={`Download ${node.label}`}
								onClick={(event): void => {
									// Keep the click from also selecting the node.
									event.stopPropagation();
									setLastAction(`Downloaded ${node.label}`);
								}}
							/>
						) : undefined
					}
					scrollToNode={(handler) => {
						scrollRef.current = handler;
					}}
				/>
			</div>
			<output>{lastAction}</output>
		</div>
	);
}
