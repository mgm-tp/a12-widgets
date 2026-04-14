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

import type { ReactNode, ReactElement } from "react";
import { useMemo, useState } from "react";
import { faker as Faker } from "@faker-js/faker/locale/en";

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table, Range, Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

export type Cell = ReactNode;
export type Row = Cell[];

const disabledRows = [2, 3, 4, 7, 8];
const COLUMNS: BaseColumnType[] = [
	{ label: "Name" },
	{ label: "Profession" },
	{ label: "Company" },
	{
		label: "Extended Action",
		actionColumn: true,
		pinning: "right",
		verticalAlignment: "middle",
		specificHorizontalAlignment: { head: "center" }
	}
];

function createTableData(right?: boolean): Row[] {
	return Array.from(new Range(20)).map((v, rowIndex) => {
		const isDisabled = right
			? false
			: rowIndex === 2 || rowIndex === 3 || rowIndex === 4 || rowIndex === 7 || rowIndex === 8;

		return Array.from(new Range(COLUMNS.length)).map((colIndex) => {
			switch (colIndex) {
				case 0:
					return Faker.person.firstName() + " " + Faker.person.lastName();
				case 1:
					return Faker.person.jobType();
				case 2:
					return Faker.company.name();
				default:
					if (right) {
						return <Button icon={<Icon>remove_circle</Icon>} disabled={isDisabled} title="Remove" />;
					}

					return <Button icon={<Icon>add_circle</Icon>} disabled={isDisabled} title="Add" />;
			}
		});
	});
}

interface TableDataProps {
	right?: boolean;
}

export function TableData(props: TableDataProps): ReactElement<TableDataProps> {
	const data = useMemo(() => createTableData(props.right), [props.right]);
	const [selectedRow, setSelectedRow] = useState<Row | undefined>(undefined);

	return (
		<Table<Row>
			columns={COLUMNS}
			data={props.right ? data.filter((d, i) => disabledRows.includes(i)) : data}
			rowStyling={({ row, rowIndex }) => ({
				selected: row === selectedRow,
				disabled: props.right ? undefined : disabledRows.includes(rowIndex)
			})}
			rowEventHandlers={({ row }) => ({
				onClick: () => {
					setSelectedRow(selectedRow === row ? undefined : row);
				}
			})}
		/>
	);
}
