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

/**
 * Adapter from the template to the behavioral model.
 *
 * Pass a tree template component to this behavior to obtain a component that has behavioral tree props.
 *
 * You also need to pass the {@link mapTreeNode} function and translate the props there.
 * @module
 */

import type { ComponentType, FunctionComponent } from "react";

import type { TreeTemplateProps, TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

import type { TreeProps, TreeNodeModel } from "./tree.behavior.api.js";

export function TreeAdapter(Target: ComponentType<TreeTemplateProps>): ComponentType<TreeProps> {
	const AdaptedTree: FunctionComponent<TreeProps> = (props) => {
		return (
			<Target
				scrollToNode={props.scrollToNode}
				id={props.id}
				getDOMRef={props.getDOMRef}
				hideRoot={props.hideRoot}
				root={tplTreeRecursively(props.root, (n) => props.tplTreeNode(n, tplTreeNode(n)))}
			/>
		);
	};

	AdaptedTree.displayName = "AdaptedTree";

	return AdaptedTree;
}

TreeAdapter.displayName = "TreeAdapter";

interface CreateTreeNode<TplType extends TreeNodeTemplateModel = TreeNodeTemplateModel> {
	(treeNode: TreeNodeModel): TplType;
}

function tplTreeRecursively(node: TreeNodeModel, createTreeNode: CreateTreeNode): TreeNodeTemplateModel {
	const tplTree = createTreeNode(node);

	if (node.children) {
		tplTree.children = node.children.map((child) => tplTreeRecursively(child, createTreeNode));
	}

	return tplTree;
}

function tplTreeNode(node: TreeNodeModel): TreeNodeTemplateModel {
	return {
		label: node.label,
		icon: node.icon,
		id: node.id,
		highlightVariant: node.highlightVariant,
		disabled: node.disabled,
		level: node.level
	};
}
