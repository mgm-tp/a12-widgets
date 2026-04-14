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

import type {
	CollapsibleTreeNodeModel,
	SelectableTreeNodeModel,
	TreeNodeModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export interface FileNode extends TreeNodeModel, CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	children?: FileNode[];
	locked?: boolean;
	disabledNode?: boolean;
	flagged?: boolean;
	subFolder?: boolean;
	disconnected?: string;
	warning?: boolean;
	counter?: number;
}

export const DATA_STYLING_IN_TREE: FileNode = {
	id: 1,
	icon: <Icon>email</Icon>,
	label: "Home",
	counter: 33,
	initiallyExpanded: true,
	children: [
		{
			id: 2,
			icon: <Icon>inbox</Icon>,
			initiallyExpanded: true,
			label: "Inbox",
			counter: 23,
			children: [
				{
					id: 3,
					icon: <Icon>folder</Icon>,
					label: "Important",
					subFolder: true,
					counter: 2,
					warning: true
				},
				{
					id: 4,
					icon: <Icon>folder</Icon>,
					label: "Travel Plans",
					subFolder: true,
					counter: 5
				},
				{
					id: 5,
					icon: <Icon>folder</Icon>,
					label: "Newsletters",
					subFolder: true,
					counter: 16
				}
			]
		},
		{
			id: 6,
			icon: <Icon>flag</Icon>,
			label: "Flagged",
			flagged: true,
			counter: 4
		},
		{
			id: 7,
			icon: <Icon>delete</Icon>,
			label: "Trash"
		},
		{
			id: 8,
			icon: <Icon>send</Icon>,
			label: "Outbox"
		},
		{
			id: 9,
			icon: <Icon>insert_drive_file</Icon>,
			initiallyExpanded: true,
			label: "Draft",
			counter: 6,
			children: [
				{
					id: 10,
					icon: <Icon>folder</Icon>,
					label: "Holiday Invites",
					subFolder: true,
					counter: 4
				},
				{
					id: 11,
					icon: <Icon>folder</Icon>,
					label: "Surprise for Mariah",
					subFolder: true,
					counter: 2
				}
			]
		},
		{
			id: 12,
			icon: <Icon iconTheme="outlined">email</Icon>,
			label: "Work",
			disconnected: "disconnected",
			initiallyExpanded: true,
			children: [
				{
					id: 13,
					icon: <Icon>inbox</Icon>,
					label: "Inbox",
					disabledNode: true,
					subFolder: true
				},
				{
					id: 14,
					icon: <Icon>send</Icon>,
					label: "Outbox",
					disabledNode: true,
					subFolder: true
				}
			]
		}
	]
};
