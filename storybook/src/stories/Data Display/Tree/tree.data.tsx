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

import type { CollapsibleTreeNodeModel, SelectableTreeNodeModel } from "@com.mgmtp.a12.widgets/widgets-core";
import { Tree, TreeAdapter, Collapsible, Selectable, walkTreeNode, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export default {};
export interface FileNode extends CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	type: "computer" | "drive" | "folder" | "file";
	children?: FileNode[];
}

export const ICONS = {
	COMPUTER: <Icon>computer</Icon>,
	DRIVE: <Icon>storage</Icon>,
	FOLDER: <Icon>folder</Icon>,
	FILE: <Icon>insert_drive_file</Icon>
};

export const FILE_SYSTEM: FileNode = {
	id: "1",
	label: "My Computer",
	icon: ICONS.COMPUTER,
	type: "computer",
	initiallyExpanded: true,
	children: [
		{
			id: "2",
			label: "C:",
			icon: ICONS.DRIVE,
			type: "drive",
			initiallyExpanded: true,
			children: [
				{ id: "3", label: "Programs", type: "folder", icon: ICONS.FOLDER },
				{
					id: "4",
					label: "Windows",
					type: "folder",
					icon: ICONS.FOLDER,
					initiallyExpanded: true,
					selected: true,
					children: [
						{
							id: "5",
							label: "System32",
							type: "folder",
							icon: ICONS.FOLDER,
							children: [{ id: "6", label: "sasser.dll", type: "file", icon: ICONS.FILE, disabled: true }]
						}
					]
				},
				{ id: "7", label: "swap.sys", type: "file", icon: ICONS.FILE }
			]
		},
		{ id: "8", label: "D:", type: "drive", icon: ICONS.DRIVE },
		{
			id: "9",
			label: "E: (Recovery)",
			type: "drive",
			icon: ICONS.DRIVE,
			disabled: true,
			children: [{ id: "10", label: "autostart.bat", type: "file", icon: ICONS.FILE }]
		}
	]
};

export const HIGHLIGHTED_FILE_SYSTEM: FileNode = {
	id: "h1",
	label: "My Computer",
	icon: ICONS.COMPUTER,
	type: "computer",
	initiallyExpanded: true,
	children: [
		{
			id: "h2",
			label: "C:",
			icon: ICONS.DRIVE,
			type: "drive",
			initiallyExpanded: true,
			highlightVariant: "success",
			children: [
				{ id: "h3", label: "Programs", type: "folder", icon: ICONS.FOLDER },
				{
					id: "h4",
					label: "Windows",
					type: "folder",
					icon: ICONS.FOLDER,
					initiallyExpanded: true,
					highlightVariant: "success",
					children: [{ id: "h5", label: "System32", type: "folder", icon: ICONS.FOLDER }]
				},
				{ id: "h6", label: "swap.sys", type: "file", icon: ICONS.FILE }
			]
		},
		{ id: "h7", label: "D:", type: "drive", icon: ICONS.DRIVE }
	]
};

export const InteractiveTree = Selectable(Collapsible(TreeAdapter(Tree)));

export function collectExpandedIds(root: FileNode): Set<string> {
	const ids = new Set<string>();

	walkTreeNode(root, (node) => {
		const fileNode = node as FileNode;

		if (fileNode.children && fileNode.initiallyExpanded) {
			ids.add(String(fileNode.id));
		}
	});

	return ids;
}
