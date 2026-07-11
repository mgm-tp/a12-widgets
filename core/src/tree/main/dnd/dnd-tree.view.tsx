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

import type { ReactNode } from "react";
import { PureComponent } from "react";

import { addPrefix, bindMethods, joinClassNames } from "../../../common/main/utils.js";

import { TreeContainer } from "../tpl/tree-elements.tpl.js";

import type { DnDTreeProps } from "./dnd-tree.api.js";
import { DnDRootNode } from "./dnd-tree.internal.js";

const baseClassName = addPrefix("treeWidget");

/**
 * @deprecated since 39.0.0. Use `TreeView` with its `dragDrop` prop instead — pragmatic-drag-and-drop
 * reparenting (before/after/inside) replaces the react-dnd-based `DnDTree`.
 */
export class DnDTree extends PureComponent<DnDTreeProps> {
	static displayName = "DnDTree";
	constructor(props: DnDTreeProps) {
		super(props);

		bindMethods(this);
	}

	render(): ReactNode {
		return (
			<TreeContainer
				className={joinClassNames(`${baseClassName}--dnd`, this.props.className)}
				style={this.props.style}
				id={this.props.id}
				wrapperRef={this.getWrapperRef}
				fitToParent={this.props.fitToParent}
				dnd
			>
				<DnDRootNode
					root={this.props.root}
					id={this.props.root.id}
					hideRoot={this.props.hideRoot}
					type={this.props.type}
				/>
			</TreeContainer>
		);
	}

	private getWrapperRef(ref: HTMLElement | null): void {
		if (this.props.getDOMRef) {
			this.props.getDOMRef(ref);
		}
	}
}
