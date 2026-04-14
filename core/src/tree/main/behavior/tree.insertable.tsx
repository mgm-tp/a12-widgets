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

import type { ComponentType, ReactNode } from "react";
import { Component } from "react";

import type { InsertableTreeProps } from "../insertable/insertable-tree.api.js";
import type { TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

import type { TreeProps, MapTreeNode, TreeNodeModel } from "./tree.behavior.api.js";

export function Insertable<InProps extends TreeProps, OutProps extends InProps & InsertableTreeProps>(
	Target: ComponentType<InProps>
): ComponentType<OutProps> {
	return class WrappedWithInsertable extends Component<OutProps> {
		static displayName = "Insertable";
		render(): ReactNode {
			return <Target {...this.props} root={this.props.root} tplTreeNode={this.tplTreeNode} />;
		}

		private tplTreeNode: MapTreeNode = (n: TreeNodeModel, chained: TreeNodeTemplateModel) => {
			return this.props.tplTreeNode(n, tplTreeNode(n, chained, this.props.buttonTitles, this.props.onInsert));
		};
	};
}

function tplTreeNode(
	node: TreeNodeModel,
	chained: TreeNodeTemplateModel,
	buttonTitles?: Record<InsertableTreeProps.InsertPosition, string>,
	onInsert?: (position: InsertableTreeProps.InsertPosition, node: InsertableTreeProps.TreeNodeTemplateModel) => void
): InsertableTreeProps.TreeNodeTemplateModel {
	return {
		...chained,
		onInsert,
		buttonTitles,
		children: node.children
			? node.children.map((child) => tplTreeNode(child, chained, buttonTitles, onInsert))
			: undefined,
		id: node.id
	};
}
