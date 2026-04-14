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

import type { FC } from "react";
import { useState, useMemo, useCallback } from "react";
import { styled, css } from "styled-components";

import type { MapTreeNode, TreeNodeModel } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ActionContentbox,
	ContentBoxElements,
	Collapsible,
	find,
	findById,
	Selectable,
	Tree,
	TreeAdapter,
	GeneralColorsConfig
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { FileNode } from "./data.js";
import { DATA_STYLING_IN_TREE } from "./data.js";

const TreeExample = Selectable(Collapsible(TreeAdapter(Tree)));

const StyledLabel = styled.span<{
	subFolder?: boolean;
	flagged?: boolean;
	disconnected?: boolean;
	$disabled?: boolean;
}>(({ subFolder, theme, flagged, disconnected, $disabled }) => {
	const { typography, colors } = theme;

	return css`
		color: ${$disabled
			? colors.interaction.disabled.color
			: flagged
				? GeneralColorsConfig.yellow
				: disconnected
					? colors.variant.errorColor
					: undefined};
		font-weight: ${subFolder ? typography.fontWeight.regularFontWeight : typography.fontWeight.boldFontWeight};
	`;
});

const StyledCounter = styled.span<{ warning?: boolean; flagged?: boolean }>(({ theme, warning, flagged }) => {
	const { colors, typography } = theme;

	return css`
		color: ${flagged
			? GeneralColorsConfig.yellow
			: warning
				? colors.variant.warningColor
				: colors.text.secondaryColorDark};
		font-weight: ${warning ? typography.fontWeight.boldFontWeight : typography.fontWeight.regularFontWeight};
	`;
});

const StyledIcon = styled.span<{ flagged?: boolean; $disabled?: boolean }>(({ theme, flagged, $disabled }) => {
	const { colors } = theme;

	return css`
		color: ${$disabled ? colors.interaction.disabled.color : flagged ? GeneralColorsConfig.yellow : colors.text.color};
		[data-role="plasma-icon"] {
			color: inherit;
		}
	`;
});

const convertNode = (node: FileNode): FileNode => {
	const newNode = Object.assign({}, node);
	newNode.icon = (
		<StyledIcon flagged={node.flagged} $disabled={node.disabledNode}>
			{newNode.icon}
		</StyledIcon>
	);
	newNode.label = (
		<>
			<StyledLabel
				subFolder={newNode.subFolder}
				flagged={newNode.flagged}
				$disabled={node.disabledNode}
				as={node.disabledNode ? "i" : "span"}
			>
				{newNode.label}
			</StyledLabel>
			{newNode.counter && (
				<StyledCounter flagged={node.flagged} warning={node.warning}>
					&nbsp;({newNode.counter})
				</StyledCounter>
			)}
			{newNode.disconnected && (
				<StyledLabel disconnected={!!node.disconnected}>&nbsp;- {newNode.disconnected}</StyledLabel>
			)}
		</>
	);

	if (newNode.children?.length) {
		newNode.children = newNode.children.map((n) => {
			return convertNode(n);
		});
	}

	return newNode;
};

const tplTreeNode: MapTreeNode = (n, chained) => {
	return {
		...chained,
		fileNode: n
	};
};

export const StylingInTree: FC = () => {
	const [selectedNode, setSelectedNode] = useState(
		find(convertNode(DATA_STYLING_IN_TREE), (node) => !!node.selected)?.id
	);
	const treeNode = useMemo(() => convertNode(DATA_STYLING_IN_TREE), []);

	const updateSelectedNode = useCallback(
		(node: TreeNodeModel): void => {
			const newNode = findById(treeNode, node.id) as FileNode;
			newNode.selected = true;

			if (selectedNode) {
				const prevNode = findById(treeNode, selectedNode) as FileNode;
				prevNode.selected = false;
			}

			if (selectedNode === node.id) {
				return;
			}

			setSelectedNode(node.id);
		},
		[selectedNode, treeNode]
	);

	return (
		<ActionContentbox padding={false} headingElements={<ContentBoxElements.Title text="Styling in Tree" />}>
			<TreeExample root={treeNode} id="basic-tree" tplTreeNode={tplTreeNode} onToggleSelection={updateSelectedNode} />
		</ActionContentbox>
	);
};
