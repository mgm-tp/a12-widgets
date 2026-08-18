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

import { useState, useCallback, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "styled-components";

import type {
	BaseColumnType,
	TableDragDropOptions,
	TableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, DefaultTableComponentRenderers, Icon, Table } from "@com.mgmtp.a12.widgets/widgets-core";

interface DataRow {
	id: number;
	name: string;
	department: string;
	role: string;
	status: string;
}

const BASE_ROWS: Omit<DataRow, "id">[] = [
	{ name: "Alice Smith", department: "Engineering", role: "Senior Engineer", status: "Active" },
	{ name: "Bob Johnson", department: "Sales", role: "Account Manager", status: "Active" },
	{ name: "Carol Williams", department: "Marketing", role: "Designer", status: "On Leave" },
	{ name: "David Brown", department: "Finance", role: "Analyst", status: "Active" },
	{ name: "Eve Davis", department: "Engineering", role: "Team Lead", status: "Active" },
	{ name: "Frank Miller", department: "HR", role: "Recruiter", status: "Active" },
	{ name: "Grace Wilson", department: "Legal", role: "Counsel", status: "On Leave" }
];

const ROWS: DataRow[] = BASE_ROWS.map((r, i) => ({ ...r, id: i + 1 }));

const BASE_COLUMNS: BaseColumnType<DataRow>[] = [
	{ label: "No", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

const DND_COLUMNS: BaseColumnType<DataRow>[] = [
	...BASE_COLUMNS,
	{ label: "", dataKey: "", actionColumn: true, pinning: "right" }
];

function DragAndDropDemo() {
	const [data, setData] = useState<DataRow[]>(ROWS);

	const onDrop: TableDragDropOptions<DataRow>["onDrop"] = useCallback<
		NonNullable<TableDragDropOptions<DataRow>["onDrop"]>
	>(
		({ dragItem, dropResult }) => {
			const next = [...data];
			const moved = next[dragItem.rowIndex];
			let targetIndex = dropResult.rowIndex;

			if (dragItem.rowIndex < dropResult.rowIndex) {
				targetIndex = dropResult.rowIndex - 1;
			}

			next.splice(dragItem.rowIndex, 1);
			next.splice(targetIndex, 0, moved);
			setData(next);
		},
		[data]
	);

	const bodyContentRenderer = useCallback(
		(props: Parameters<typeof DefaultTableComponentRenderers.bodyContentRenderer>[0]) => {
			if ((props.column as BaseColumnType<DataRow>).actionColumn) {
				return (
					<Button
						destructive
						icon={<Icon>delete</Icon>}
						title={`Delete ${(props.row as DataRow).name}`}
						onClick={(e) => e.stopPropagation()}
					/>
				);
			}

			return DefaultTableComponentRenderers.bodyContentRenderer(props);
		},
		[]
	);

	return (
		<Table<DataRow>
			data={data}
			columns={DND_COLUMNS}
			dragDropOptions={{ onDrop }}
			componentRenderers={{ bodyContentRenderer }}
		/>
	);
}

const VIRTUAL_ROWS: DataRow[] = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance", "HR"][i % 5],
	role: ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"][i % 5],
	status: i % 7 === 0 ? "On Leave" : "Active"
}));

const StyledVirtualContainer = styled.div`
	height: 500px;
`;

function VirtualizedScrollDemo() {
	return (
		<StyledVirtualContainer>
			<Table<DataRow> data={VIRTUAL_ROWS} columns={BASE_COLUMNS} virtualScrollOptions style={{ height: "100%" }} />
		</StyledVirtualContainer>
	);
}

const SCROLL_ROWS: DataRow[] = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance", "HR"][i % 5],
	role: ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"][i % 5],
	status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "On Leave" : "Pending"
}));

const StyledScrollContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const StyledScrollTableWrapper = styled.div`
	max-height: 400px;
	overflow: auto;
`;

function ScrollToNodeDemo() {
	const scrollToNodeRef = useRef<TableScrollToNodeHandler | undefined>(undefined);
	const [selectedRow, setSelectedRow] = useState<DataRow | undefined>();

	const rowStyling = useCallback(
		({ row }: { row: DataRow }) => ({
			selected: selectedRow === row,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	const rowEventHandlers = useCallback(
		({ row }: { row: DataRow }) => ({
			onClick: () => setSelectedRow((prev) => (prev === row ? undefined : row))
		}),
		[]
	);

	const scrollTo = useCallback((index: number) => {
		scrollToNodeRef.current?.(index, { autoFocus: true });
	}, []);

	return (
		<StyledScrollContainer>
			<ButtonGroup>
				<Button onClick={() => scrollTo(0)}>Row 1</Button>
				<Button onClick={() => scrollTo(9)}>Row 10</Button>
				<Button onClick={() => scrollTo(24)}>Row 25</Button>
				<Button onClick={() => scrollTo(49)}>Row 50</Button>
			</ButtonGroup>
			<StyledScrollTableWrapper>
				<Table<DataRow>
					data={SCROLL_ROWS}
					columns={BASE_COLUMNS}
					scrollToNode={(handler) => {
						scrollToNodeRef.current = handler;
					}}
					rowStyling={rowStyling}
					rowEventHandlers={rowEventHandlers}
				/>
			</StyledScrollTableWrapper>
		</StyledScrollContainer>
	);
}

const meta: Meta = {
	title: "Data Display/Table/Table Advanced",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DragAndDrop: Story = {
	name: "Drag and Drop",
	render: () => <DragAndDropDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Pass `dragDropOptions` with an `onDrop` handler to enable row reordering. The handler receives `dragItem.rowIndex` and `dropResult.rowIndex` to compute the new data order."
			}
		}
	}
};

export const VirtualizedScroll: Story = {
	name: "Virtualized Scroll",
	render: () => <VirtualizedScrollDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `virtualScrollOptions` (or pass an options object) to enable windowed rendering for large datasets. The table container must have an explicit height."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll To Node",
	render: () => <ScrollToNodeDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The `scrollToNode` prop exposes a handler function via callback. Call `handler(rowIndex, { autoFocus })` to programmatically scroll to and optionally focus a specific row."
			}
		}
	}
};
