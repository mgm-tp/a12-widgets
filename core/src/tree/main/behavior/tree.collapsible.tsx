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
 * Collapsible behavior.
 *
 * Call {@link Collapsible} to obtain a component that has the props of the given component plus
 * {@link CollapsibleTreeProps}.
 *
 * Collapses tree nodes by (temporarily) removing them from the tree. The target behavior will therefore receive
 * only expanded nodes. The expansion state is managed internally, but you can define the initial expansion state
 * by passing the respective prop.
 *
 * Also passes a callback to the target behavior to toggle the expansion. This is supposed to be used by
 * {@link TreeAdapter} to translate the event to the template tree callback.
 *
 * See the respective showcase code for a full example of how to use it.
 * @module
 */

import type { ComponentType, ReactNode } from "react";
import { Component } from "react";

import { bindMethods } from "../../../common/main/utils.js";

import type { TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

import type {
	TreeProps,
	TreeNodeModel,
	CollapsibleTreeProps,
	CollapsibleTreeNodeModel,
	IdType
} from "./tree.behavior.api.js";

export interface TreeState {
	expandedNodes: any[];
	draggingOverNode: boolean;
}

/**
 * Collapsible behavior factory. Call this function to obtain a collapsible tree. The resulting tree will have the
 * props of the given component plus {@link CollapsibleTreeProps}.
 * @param Target – Original tree to which the collapsible behavior should be added
 * @deprecated since 39.0.0. Use `TreeView` instead — its built-in expansion (controlled/uncontrolled,
 * lazy `loadChildren`) replaces the `Collapsible` behavior HOC.
 */
export function Collapsible<InProps extends TreeProps, OutProps extends InProps & CollapsibleTreeProps>(
	Target: ComponentType<InProps>
): ComponentType<OutProps> {
	return class Collapsible extends Component<OutProps, TreeState> {
		static displayName = "Collapsible";
		private timeout: number | null = null;
		private hoveringNode: CollapsibleTreeNodeModel | null = null;

		constructor(props: OutProps) {
			super(props);
			this.state = TreeState.initial(props);

			bindMethods(this);
			props.collapseNodeHandler?.((id: IdType) => {
				this.setState((state) => {
					if (state.expandedNodes.indexOf(id) === -1) {
						return { expandedNodes: [...state.expandedNodes, id] };
					}

					return { expandedNodes: state.expandedNodes };
				});
			});
			props.expandNodeHandler?.((id: IdType) => {
				this.setState((state) => {
					return { expandedNodes: state.expandedNodes.filter((nodeId) => nodeId !== id) };
				});
			});
		}

		componentWillUnmount(): void {
			this.clearDragOverTimeout();
		}

		render(): ReactNode {
			return (
				<Target
					{...this.props}
					root={this.addBehavior(this.props.root, true)}
					tplTreeNode={(n, chained) => this.props.tplTreeNode(n, this.tplTreeNode(n, chained))}
				/>
			);
		}

		private onToggleExpansion(node: TreeNodeModel): void {
			this.setState((prevState) => {
				if (node.id === undefined) {
					throw new Error("cannot toggle expansion of node: missing ID");
				}

				if (prevState.expandedNodes.indexOf(node.id) >= 0) {
					return {
						expandedNodes: prevState.expandedNodes.filter((id) => id !== node.id)
					};
				} else {
					return {
						expandedNodes: [...prevState.expandedNodes, node.id]
					};
				}
			});
		}

		private handleDragOver(node: CollapsibleTreeNodeModel): void {
			if (!this.props.autoExpandOnDragOverTimeout) {
				return;
			}

			const id = node.id;

			if (id === undefined || id === null || this.state.draggingOverNode || this.state.expandedNodes.indexOf(id) >= 0) {
				return;
			}

			if (this.hoveringNode && id !== this.hoveringNode.id) {
				this.clearDragOverTimeout();
			}

			this.hoveringNode = node;

			this.setState({
				draggingOverNode: true
			});
			this.timeout = window.setTimeout(this.handleDragOverTimeout, this.props.autoExpandOnDragOverTimeout);
		}

		private handleDragOverTimeout(): void {
			if (!this.hoveringNode) {
				this.resetDragOverState();

				return;
			}

			const nodeId = this.hoveringNode.id;

			if (
				nodeId !== undefined &&
				nodeId !== null &&
				this.timeout &&
				this.state.expandedNodes.indexOf(nodeId) < 0 &&
				this.state.draggingOverNode
			) {
				this.onToggleExpansion(this.hoveringNode);
				this.resetDragOverState();
			}
		}

		private resetDragOverState(): void {
			this.setState({
				draggingOverNode: false
			});
			this.hoveringNode = null;
			this.clearDragOverTimeout();
		}

		private handleDragLeave(): void {
			this.resetDragOverState();
		}

		private clearDragOverTimeout(): void {
			if (this.timeout !== null) {
				window.clearTimeout(this.timeout);
			}

			this.timeout = null;
		}

		private addBehavior(node: CollapsibleTreeNodeModel, root?: boolean): CollapsibleTreeNodeModel {
			let children: CollapsibleTreeNodeModel[] | undefined;

			if (node.children && node.id !== undefined) {
				const isExpanded = this.state.expandedNodes.indexOf(node.id) >= 0;

				if (isExpanded || (this.props.hideRoot && root)) {
					children = node.children.map((child) => this.addBehavior(child, false));
				}
			}

			return {
				...node,
				children,
				onToggleExpansion:
					node.children && node.children.length > 0
						? () => {
								this.onToggleExpansion(node);
								node.onToggleExpansion?.();
							}
						: undefined
			};
		}

		private tplTreeNode(node: CollapsibleTreeNodeModel, chained: TreeNodeTemplateModel): TreeNodeTemplateModel {
			return {
				...chained,
				onArrowClick: node.onToggleExpansion,
				onDragOver: () => {
					this.handleDragOver(node);
				},
				onDragLeave: this.handleDragLeave
			};
		}
	};
}

// Tree state management functionality. Internal.
namespace TreeState {
	/*
	 * Recursion.
	 *
	 * If a node has been expanded previously (and it has children *now*), then it should also be expanded in the
	 * next state.
	 */
	const mergeRecursively = (node: CollapsibleTreeNodeModel, prevState: TreeState, nextState: TreeState): void => {
		if (node.id !== undefined) {
			if (prevState.expandedNodes.indexOf(node.id) >= 0 && node.children && node.children.length > 0) {
				nextState.expandedNodes.push(node.id);
			} else if (node.initiallyExpanded) {
				nextState.expandedNodes.push(node.id);
			}
		}

		if (node.children) {
			for (const child of node.children) {
				mergeRecursively(child, prevState, nextState);
			}
		}
	};

	// Merge props and previous state into a new state.
	export function merge(props: TreeProps, prevState: TreeState): TreeState {
		const newState: TreeState = {
			expandedNodes: [],
			draggingOverNode: false
		};
		mergeRecursively(props.root, prevState, newState);

		return newState;
	}

	// Construct the initial state from props, taking expansion from props into account.
	export function initial(props: TreeProps): TreeState {
		return merge(props, { expandedNodes: [], draggingOverNode: false });
	}
}
