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
import { useState, useCallback, useMemo } from "react";
import { styled, css, ThemeProvider, useTheme } from "styled-components";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	TreeTableRenderPropsType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	DefaultTreeTableComponentRenderers,
	TreeTable,
	createTheme,
	generateUid,
	StyledTreeNodeArrow
} from "@com.mgmtp.a12.widgets/widgets-core";

const StyledThemeTreeTable = styled(TreeTable)`
	height: 500px;
	& ${StyledTreeNodeArrow} {
		margin-top: 2px;
	}
`;

const StyledThemeValueCellWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 6px;
`;

const StyledThemeValueCellColorSpan = styled.span<{ $background: string }>(({ $background }) => {
	return css`
		background: ${$background};
		border: 1px solid #000;
		height: 14px;
		margin: auto;
		width: 14px;
	`;
});

const StyledThemeTypeCellSpan = styled.span`
	color: ${({ theme }) => theme.colors.text.secondaryColorDark};
	font-style: italic;
`;

interface ThemeNode {
	[themeKey: string]: number | string | ThemeNode;
}

function toTreeNode(obj: ThemeNode, groupName: string): BaseTreeTableNode {
	if (typeof obj !== "object") {
		return { id: generateUid(), data: [obj, typeof obj] };
	}

	const children = [];

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "object") {
			children.push(toTreeNode(value, key));
		} else {
			children.push({
				id: generateUid(),
				data: [key, typeof value, String(value).toLowerCase()],
				label: String(value).toLowerCase()
			});
		}
	}

	return { id: generateUid(), data: [groupName, "object"], children };
}

const customTheme = createTheme({
	components: {
		tree: {
			nodeContent: { minHeight: "20px" },
			nodeArrow: { marginLeft: "-20px", button: { size: "16px", fontSize: "14px" } },
			node: { indentPaddingLeft: 10, titleSpacingLeft: "10px" },
			nodeName: { fontSize: "14px" }
		},
		table: {
			bodyCell: { minHeight: "20px", padding: "0", fontSize: "14px" }
		},
		treeTable: { bodyRow: { minHeight: "20px" }, bodyCell: { padding: "0 0 0 8px" } }
	}
});

const COLUMNS: BaseTreeTableColumnType[] = [
	{
		label: "Property",
		horizontalAlignment: "left",
		verticalAlignment: "middle",
		hierarchical: true,
		pinning: "left",
		width: 2
	},
	{ label: "Type", verticalAlignment: "middle" },
	{ label: "Value", verticalAlignment: "middle" }
];

export function ThemeVariablesShowcase() {
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});
	const [selectedNode, setSelectedNode] = useState<string | undefined>();

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			},
			onClick(): void {
				setSelectedNode(row.id);
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => ({
			selected: row.id === selectedNode,
			collapsed: !!collapsedNodes[row.id]
		}),
		[collapsedNodes, selectedNode]
	);

	const bodyContentRenderer = useCallback((props: TreeTableRenderPropsType.HierarchicalBodyContentProps): ReactNode => {
		if (props.column.label === "Value" && props.row.label?.includes("#")) {
			return (
				<StyledThemeValueCellWrapper>
					<StyledThemeValueCellColorSpan $background={props.row.label.match(/#\w+/)?.[0] ?? ""} />
					{props.row.label}
				</StyledThemeValueCellWrapper>
			);
		}

		if (props.column.label === "Type" && Array.isArray(props.row.data)) {
			return <StyledThemeTypeCellSpan>{props.row.data[1]}</StyledThemeTypeCellSpan>;
		}

		return DefaultTreeTableComponentRenderers.bodyContentRenderer(props);
	}, []);

	const theme = useTheme();
	const root = useMemo(() => toTreeNode(theme as any, "theme"), [theme]);

	return (
		<ThemeProvider theme={customTheme}>
			<StyledThemeTreeTable
				virtualScrollOptions={{ rowHeight: 24 }}
				root={root}
				columns={COLUMNS}
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
				componentRenderers={{ bodyContentRenderer }}
				id="theme-variables-tree"
			/>
		</ThemeProvider>
	);
}
