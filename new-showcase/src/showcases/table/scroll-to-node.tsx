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

import type { ReactElement } from "react";
import { useState, useCallback, useRef } from "react";
import { styled } from "styled-components";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/index.js";
import type {
	BaseColumnType,
	TableScrollToNodeHandler,
	RowStyles
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";
import { Table } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";

const StyledScrollContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 12px;
`;

const StyledTableWrapper = styled.div`
	max-height: 400px;
	overflow: auto;
`;

interface UserDataType {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	status: string;
}

const data: UserDataType[] = Array.from({ length: 50 }, (_, index) => ({
	id: index + 1,
	firstName: `FirstName${index + 1}`,
	lastName: `LastName${index + 1}`,
	email: `user${index + 1}@example.com`,
	status: index % 3 === 0 ? "Active" : index % 3 === 1 ? "Inactive" : "Pending"
}));

const columns: BaseColumnType<UserDataType>[] = [
	{
		label: "ID",
		dataKey: "id",
		width: 0.5,
		verticalAlignment: "middle"
	},
	{
		label: "First name",
		dataKey: "firstName",
		width: 1,
		verticalAlignment: "middle"
	},
	{
		label: "Last name",
		dataKey: "lastName",
		width: 1,
		verticalAlignment: "middle"
	},
	{
		label: "Email",
		dataKey: "email",
		width: 2,
		verticalAlignment: "middle"
	},
	{
		label: "Status",
		dataKey: "status",
		width: 1,
		verticalAlignment: "middle"
	}
];

export function ScrollToNodeTableShowcase(): ReactElement {
	const scrollToNodeRef = useRef<TableScrollToNodeHandler | undefined>(undefined);
	const [selectedRow, setSelectedRow] = useState<UserDataType | undefined>();

	const handleScrollToNode = useCallback((nodeId: number, autoFocus?: boolean) => {
		if (scrollToNodeRef.current) {
			scrollToNodeRef.current(nodeId, { autoFocus });
		}
	}, []);

	const rowStyling = useCallback(
		(params: { row: UserDataType }): RowStyles => {
			const isRowSelected = selectedRow === params.row;

			return {
				selected: isRowSelected,
				title: isRowSelected ? "Selected" : "Selectable"
			};
		},
		[selectedRow]
	);

	const rowEventHandlers = useCallback(
		(params: { row: UserDataType }) => ({
			onClick: (): void => setSelectedRow((selectedRow) => (selectedRow === params.row ? undefined : params.row))
		}),
		[]
	);

	return (
		<StyledScrollContainer>
			<ButtonGroup>
				<Button onClick={() => handleScrollToNode(0, true)}>Scroll to First Row </Button>
				<Button onClick={() => handleScrollToNode(4, true)}>Scroll to Row 5 </Button>
				<Button onClick={() => handleScrollToNode(24, true)}>Scroll to Row 25 </Button>
				<Button onClick={() => handleScrollToNode(49, true)}>Scroll to Row 50</Button>
			</ButtonGroup>

			<StyledTableWrapper>
				<Table<UserDataType>
					data={data}
					columns={columns}
					scrollToNode={(handler) => {
						scrollToNodeRef.current = handler;
					}}
					rowStyling={rowStyling}
					rowEventHandlers={rowEventHandlers}
				/>
			</StyledTableWrapper>
		</StyledScrollContainer>
	);
}
