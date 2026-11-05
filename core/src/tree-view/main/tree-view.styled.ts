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

import { css, styled } from "styled-components";

import { StyledTreeContainer } from "../../tree/main/tpl/tree-elements.styled.js";

/**
 * Sibling-insertion band drawn at the top or bottom edge of a {@link TreeView} node while a drag hovers
 * it (`reorder-top` / `reorder-bottom`). The band starts at the label offset of the level it is indented
 * to — the same `padding-left` formula the node content uses — so it lines up with the prospective
 * sibling's label, and is filled and outlined like `DataTreeTable`'s insertion band. It reads the tree's
 * `dropHint` tokens so consumer themes for the legacy tree still apply.
 *
 * The reparent ("inside") affordance is not drawn here — it washes the node content itself via its
 * `$dragOver` / `$dropForbidden` props.
 *
 * Purely visual — the drop target is the node container, so the band never intercepts pointer events.
 */
export const StyledTreeViewDropBand = styled.div.withConfig({ displayName: "StyledTreeViewDropBand-sc-" })<{
	$position: "top" | "bottom";
	$active?: boolean;
	$forbidden?: boolean;
	$level: number;
}>(({ theme, $position, $active, $forbidden, $level }) => {
	const { dropHint, hintHeight, node } = theme.components.tree;
	const { contentBoxHorizontalPadding } = theme.components.contentBox;

	return css`
		display: ${$active ? "block" : "none"};
		position: absolute;
		${$position}: 0;
		left: calc(${contentBoxHorizontalPadding} + ${node.indentPaddingLeft * (1 + $level)}px + ${node.titleSpacingLeft});
		right: 0;
		height: ${hintHeight};
		box-sizing: border-box;
		background-color: ${$forbidden ? dropHint.forbidden.background : dropHint.background};
		border: ${$forbidden ? dropHint.forbidden.border : dropHint.openedBorder};
		pointer-events: none;
		z-index: 1;
	`;
});

/**
 * {@link TreeView} root container: the legacy tree container plus the root drop zone feedback. While a
 * drag hovers the empty area below the last node, `useTreeViewRootDropZone` sets `data-drop-target`
 * (`droppable` / `forbidden`) on it, and the container draws a 2px frame around itself — the same frame
 * `DataTreeTable` draws around its body, borrowing the tree table's node-droppable border tokens so both
 * root zones look alike. No wash: the nodes have transparent backgrounds, so any background would recolour
 * the whole tree rather than mark the empty area.
 */
export const StyledTreeViewContainer = styled(StyledTreeContainer).withConfig({
	displayName: "StyledTreeViewContainer-sc-"
})(({ theme }) => {
	const { node } = theme.components.treeTable;

	return css`
		position: relative;

		&[data-drop-target]::after {
			content: "";
			position: absolute;
			inset: 0;
			border: 2px solid ${node.droppableBorderColor};
			pointer-events: none;
			z-index: 1;
		}

		&[data-drop-target="forbidden"]::after {
			border-color: ${node.forbiddenBorderColor};
		}
	`;
});
