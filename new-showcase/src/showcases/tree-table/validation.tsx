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

import type { ReactNode, FC } from "react";
import { useState, useCallback, useMemo } from "react";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable, Icon, Range, HiddenText, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { getNodeById } from "./shared/data.js";

const COLUMNS: BaseTreeTableColumnType<ValidationFileNode>[] = [
	{
		label: <HiddenText>State of errors or warnings</HiddenText>,
		width: 0.3,
		pinning: "left",
		horizontalAlignment: "center",
		dataGetter: ({ row }): ReactNode => row.data.validationIcon
	},
	{
		label: "Folder",
		horizontalAlignment: "left",
		hierarchical: true,
		pinning: !provider.isDesktop() ? undefined : "left",
		width: 2,
		dataGetter: ({ row }): ReactNode => row.data.cells[0]
	},
	{ label: "Date modified", dataGetter: ({ row }): ReactNode => row.data.cells[1] },
	{ label: "Size", dataGetter: ({ row }): ReactNode => row.data.cells[2] },
	{ label: "Owner", dataGetter: ({ row }): ReactNode => row.data.cells[3] },
	{ label: "Group", dataGetter: ({ row }): ReactNode => row.data.cells[4] },
	{ label: "Date Added", dataGetter: ({ row }): ReactNode => row.data.cells[5] }
];

function createTableData(): ReactNode[] {
	return Array.from(new Range(8)).map((colIndex) => {
		switch (colIndex) {
			case 0:
				return "2021-11-11";
			case 1:
				return `${colIndex + 10024}KB`;
			case 2:
				return "Widgets";
			case 3:
				return "Software Engineer";
			case 4:
				return `${new Date().toISOString().split("T")[0]}`;
			default:
				return "Unknown";
		}
	});
}

const TREE: ValidationFileNode = {
	id: "validation-1",
	data: { cells: ["root", ...createTableData()] },
	children: [
		{
			id: "validation-2",
			data: {
				variant: "warning",
				released: "24.1.0",
				cells: ["Chart", ...createTableData()]
			},
			children: [
				{
					id: "validation-3",
					data: {
						released: "24.1.0",
						cells: ["Bar Chart", ...createTableData()]
					}
				},
				{
					id: "validation-4",
					data: {
						released: "24.1.0",
						cells: ["Line Chart", ...createTableData()]
					}
				},
				{
					id: "validation-5",
					data: {
						released: "24.1.0",
						cells: ["Pie Chart", ...createTableData()]
					}
				}
			]
		},
		{
			id: "validation-6",
			data: {
				released: "23.10.0",
				cells: ["Comment Container", ...createTableData()],
				variant: "error"
			},
			children: [
				{
					id: "validation-7",
					data: {
						released: "23.8.0",
						cells: ["Single Comment", ...createTableData()]
					}
				},
				{
					id: "validation-8",
					data: {
						released: "23.8.0",
						cells: ["Comment List", ...createTableData()]
					}
				}
			]
		},
		{
			id: "validation-9",
			data: {
				released: "24.0.0",
				cells: ["Faceted Search", ...createTableData()]
			},
			children: [
				{
					id: "validation-10",
					data: {
						released: "23.16.0",
						cells: ["Filter", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-11",
					data: {
						released: "23.16.0",
						cells: ["Filter Bar", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-12",
					data: {
						released: "24.0.0",
						cells: ["Filter Selector", ...createTableData()],
						variant: "warning"
					}
				}
			]
		},
		{
			id: "validation-13",
			data: {
				released: "21.1.0",
				cells: ["Menu", ...createTableData()]
			},
			children: [
				{
					id: "validation-14",
					data: {
						released: "21.1.0",
						cells: ["Flyout Menu", ...createTableData()],
						variant: "error"
					}
				},
				{
					id: "validation-15",
					data: {
						released: "21.1.0",
						cells: ["Sliding Menu", ...createTableData()],
						variant: "error"
					}
				}
			]
		},
		{
			id: "validation-16",
			data: {
				released: "21.1.0",
				cells: ["Notification", ...createTableData()],
				variant: "warning"
			},
			children: [
				{
					id: "validation-17",

					data: {
						released: "23.16.0",
						cells: ["Badge", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-18",

					data: {
						released: "23.6.0",
						cells: ["Toast", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-19",

					data: {
						released: "23.14.0",
						cells: ["Modal Notification", ...createTableData()],
						variant: "warning"
					}
				}
			]
		},
		{
			id: "validation-20",
			data: {
				released: "23.16.0",
				cells: ["Picker", ...createTableData()],
				variant: "warning"
			},
			children: [
				{
					id: "validation-21",
					data: {
						released: "< 21.0.0",
						cells: ["Date Picker", ...createTableData()],
						variant: "error"
					}
				},
				{
					id: "validation-22",
					data: {
						released: "23.2.0",
						cells: ["Time Picker", ...createTableData()],
						variant: "error"
					}
				}
			]
		},
		{
			id: "validation-23",
			data: {
				released: "23.3.0",
				cells: ["Plugin Editor", ...createTableData()],
				variant: "error"
			},
			children: [
				{
					id: "validation-24",
					data: {
						released: "23.3.0",
						cells: ["Link Plugin", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-25",
					data: {
						released: "23.3.0",
						cells: ["Mention Plugin", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-26",
					data: {
						cells: ["SpellCheck Plugin", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-27",
					data: {
						released: "23.3.0",
						cells: ["Static Toolbar Plugin", ...createTableData()],
						variant: "warning"
					}
				}
			]
		},
		{
			id: "validation-28",
			data: {
				released: "23.7.0",
				cells: ["Tag", ...createTableData()],
				variant: "error"
			},
			children: [
				{
					id: "validation-29",
					data: {
						released: "23.7.0",
						cells: ["Tag", ...createTableData()],
						variant: "error"
					}
				},
				{
					id: "validation-30",
					data: {
						released: "23.7.0",
						cells: ["Tag Group", ...createTableData()],
						variant: "error"
					}
				},
				{
					id: "validation-31",
					data: {
						released: "23.15.0",
						cells: ["Tag Input", ...createTableData()],
						variant: "error"
					}
				}
			]
		},
		{
			id: "validation-32",
			data: {
				released: "22.0.0",
				cells: ["Tooltip", ...createTableData()],
				variant: "warning"
			},
			children: [
				{
					id: "validation-33",
					data: {
						released: "22.0.0",
						cells: ["Hint", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-34",
					data: {
						released: "22.0.0",
						cells: ["Warning", ...createTableData()],
						variant: "error"
					}
				},
				{
					id: "validation-35",
					data: {
						released: "22.0.0",
						cells: ["Error", ...createTableData()],
						variant: "error"
					}
				}
			]
		},
		{
			id: "validation-36",
			data: {
				released: "< 21.0.0",
				cells: ["Input", ...createTableData()],
				variant: "error"
			},
			children: [
				{
					id: "validation-37",
					data: {
						released: "22.2.0",
						cells: ["Autocomplete", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-38",
					data: {
						released: "< 21.0.0",
						cells: ["TextLine", ...createTableData()],
						variant: "warning"
					}
				},
				{
					id: "validation-39",
					data: {
						released: "< 21.0.0",
						cells: ["TextArea", ...createTableData()],
						variant: "error"
					}
				}
			]
		}
	]
};

interface ValidationFileNodeData {
	validationIcon?: ReactNode;
	variant?: "error" | "warning";
	released?: string;
	cells: ReactNode[];
}

type ValidationFileNode = BaseTreeTableNode<ValidationFileNodeData>;

export const Validation: FC = () => {
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({
		"validation-6": true,
		"validation-16": true,
		"validation-26": true,
		"validation-28": true,
		"validation-36": true
	});
	const rowEventHandlers = useCallback<TreeTableRowEventHandlers>(({ row }) => {
		return {
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, TREE);

			return { collapsed: node?.children ? !!collapsedNodes[row.id] : undefined };
		},
		[collapsedNodes]
	);

	const getNodeIcon = useCallback(
		(row: ValidationFileNode): ReactNode => {
			const childNodes = row.children;
			const collapsed = collapsedNodes[row.id];
			let variant = row.data.variant;

			if (variant && (!collapsed || childNodes === undefined)) {
				return (
					<Icon
						variant={variant}
						iconTheme={variant === "error" ? "custom" : undefined}
						title={variant === "error" ? "Error" : "Warning found in entry"}
					>
						{variant}
					</Icon>
				);
			}

			const flattenVariant = (node: ValidationFileNode): (boolean | undefined)[] => {
				const ret: (boolean | undefined)[] = [];
				ret.push(node.data.variant && node.data.variant === "error");

				if (node.children) {
					for (const child of node.children) {
						ret.push(...flattenVariant(child));
					}
				}

				return ret;
			};

			let iconName: string | undefined = variant;

			if (collapsed) {
				const flattenVariants = flattenVariant(row);
				const errorState = flattenVariants.reduce((prev, curr) => prev || curr);
				const warningState = !errorState && flattenVariants.some((item) => item === false);
				const manyInvalidStates =
					(errorState || warningState) && flattenVariants.filter((i) => i !== undefined).length > 1;

				variant = errorState ? "error" : warningState ? "warning" : undefined;
				iconName = variant;

				if (manyInvalidStates && iconName) {
					iconName += "_collapsed";
				}
			}

			const title =
				iconName === "error"
					? "Error"
					: iconName?.includes("error")
						? "There are errors for entries underneath"
						: "There are warnings for entries underneath";

			return (
				variant && (
					<Icon variant={variant} iconTheme={iconName !== "warning" ? "custom" : undefined} title={title}>
						{iconName}
					</Icon>
				)
			);
		},
		[collapsedNodes]
	);

	const root: ValidationFileNode = useMemo(() => {
		function recurse(node: ValidationFileNode): ValidationFileNode {
			const validationIcon = getNodeIcon(node);

			return {
				...node,
				data: { ...node.data, validationIcon },
				children: node.children?.map((node) => recurse(node))
			};
		}

		return recurse(TREE);
	}, [getNodeIcon]);

	return (
		<TreeTable<ValidationFileNode>
			root={root}
			columns={COLUMNS}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
			id="tree-table-validation"
		/>
	);
};
