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

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

import type { TreeNodeModel as DefaultTreeNodeModel } from "../behavior/tree.behavior.api.js";
import type {
	TreeNodeTemplateModel as DefaultTreeNodeTemplateModel,
	TreeTemplateProps,
	TreeNodeRecursiveProps,
	TreeNodeProps
} from "../tpl/tree.tpl.api.js";

export interface InsertableTreeProps extends TreeTemplateProps {
	/**
	 * Root of the Tree.
	 */
	root: InsertableTreeProps.TreeNodeModel;

	/**
	 * Handler to insert a new node.
	 * @param position – where the new node will be placed.
	 * @param node – that the position belongs to. The new node will be inserted at top/bottom or as a child of this node.
	 */
	onInsert?(position: InsertableTreeProps.InsertPosition, node: InsertableTreeProps.TreeNodeTemplateModel): void;

	/**
	 * Custom titles for the insert buttons.
	 */
	buttonTitles?: Record<InsertableTreeProps.InsertPosition, string>;

	/**
	 * Whether the top-level node should be hidden.
	 */
	hideRoot?: boolean;
}

export namespace InsertableTreeProps {
	export type InsertPosition = "top" | "bottom" | "asChild";

	export interface TreeNodeModel extends DefaultTreeNodeModel {
		/**
		 * Handler to insert a new node.
		 * @param position – where the new node will be placed.
		 * @param node – that the position belongs to. The new node will be inserted at top/bottom or as a child of this node.
		 */
		onInsert?(position: InsertableTreeProps.InsertPosition, node: TreeNodeTemplateModel): void;

		/**
		 * To define more nesting nodes.
		 */
		children?: TreeNodeTemplateModel[];
	}

	export interface TreeNodeTemplateModel extends DefaultTreeNodeTemplateModel {
		onInsert?(position: InsertableTreeProps.InsertPosition, node: TreeNodeTemplateModel): void;

		children?: TreeNodeTemplateModel[];

		/**
		 * since 29.0.0 - the titles is translated (English/EN and German/DE) and handled by the widget base on the localization config.
		 */
		buttonTitles?: Record<InsertableTreeProps.InsertPosition, string>;
	}

	export interface InsertableTreeNodeRecursiveProps extends TreeNodeRecursiveProps {
		node: TreeNodeTemplateModel;
		buttonTitles?: Record<InsertableTreeProps.InsertPosition, string>;
	}

	export interface InsertableTreeNodeProps extends TreeNodeProps {
		onInsert?(position: InsertableTreeProps.InsertPosition, node: TreeNodeTemplateModel): void;
		node: TreeNodeTemplateModel;
		buttonTitles?: Record<InsertableTreeProps.InsertPosition, string>;
	}

	export interface InsertHintProps extends Identifiable, Styleable {
		position: InsertPosition;
		open: boolean;
		focus?: boolean;

		/**
		 * @internal
		 */
		level?: number;

		/**
		 * @deprecated since 31.0.0
		 */
		useLiTag?: boolean;
	}
}
