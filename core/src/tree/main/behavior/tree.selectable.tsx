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
 * Selectable behavior.
 *
 * Call {@link Selectable} to obtain a component that has the props of the given component plus
 * {@link SelectableTreeProps}.
 *
 * Collapses tree nodes by (temporarily) removing them from the tree. The target behavior will therefore receive
 * only expanded nodes. The expansion state is managed internally, but you can define the initial expansion state
 * by passing the respective prop.
 *
 * Also passes a callback to the target behavior to toggle the expansion. This is supposed to be used by
 * {@TreeAdapter} to translate the event to the template tree callback.
 *
 * See the respective showcase code for a full example of how to use it.
 * @module
 */

import type { ComponentType, ReactNode } from "react";
import { Component } from "react";

import { isVisibleOnScreen, bindMethods, addPrefix } from "../../../common/main/utils.js";

import type { TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

import type { SelectableTreeNodeModel, SelectableTreeProps, TreeProps } from "./tree.behavior.api.js";

export function Selectable<InProps extends TreeProps, OutProps extends InProps & SelectableTreeProps>(
	Target: ComponentType<InProps>
): ComponentType<OutProps> {
	return class Selectable extends Component<OutProps> {
		static displayName = "Selectable";
		private treeRef: HTMLElement | null;

		constructor(props: OutProps) {
			super(props);

			this.treeRef = null;

			bindMethods(this);
		}

		componentDidMount(): void {
			if (this.props.scrollSelectedNodeIntoView) {
				this.scrollSelectedNodeIntoView();
			}
		}

		componentDidUpdate(): void {
			if (this.props.scrollSelectedNodeIntoView) {
				this.scrollSelectedNodeIntoView();
			}
		}

		render(): ReactNode {
			return (
				<Target
					{...this.props}
					root={addBehavior(this.props.root, this.props)}
					tplTreeNode={(n, chained) => this.props.tplTreeNode(n, tplTreeNode(n, chained))}
					getDOMRef={this.getTreeRef}
				/>
			);
		}

		private getTreeRef(ref: HTMLElement | null): void {
			this.treeRef = ref;

			if (this.props.getDOMRef) {
				this.props.getDOMRef(ref);
			}
		}

		private scrollSelectedNodeIntoView(): void {
			if (this.treeRef) {
				const selectedNodes = this.treeRef.getElementsByClassName(addPrefix("treeWidget__nodeContent--selected"));

				if (selectedNodes && selectedNodes.length > 0) {
					const selectedNode = selectedNodes[0];

					if (selectedNode && !isVisibleOnScreen(selectedNode as HTMLElement)) {
						selectedNode.scrollIntoView();
					}
				}
			}
		}
	};
}

function addBehavior(node: SelectableTreeNodeModel, treeProps: SelectableTreeProps): SelectableTreeNodeModel {
	const clone: SelectableTreeNodeModel = {
		...node,
		onToggleSelection: () => {
			treeProps.onToggleSelection(node);
		},
		children: node.children ? node.children.map((child) => addBehavior(child, treeProps)) : undefined,
		id: node.id
	};

	return clone;
}

function tplTreeNode(node: SelectableTreeNodeModel, chained: TreeNodeTemplateModel): TreeNodeTemplateModel {
	return {
		...chained,
		onTitleClick: node.onToggleSelection,
		selected: node.selected,
		id: node.id
	};
}
