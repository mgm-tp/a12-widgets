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
import { useState, useCallback } from "react";
import { faker as Faker } from "@faker-js/faker/locale/en";

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";
import { ResponsiveImageContainer, Range, Table, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { DATA } from "./setup.js";

export type StringRow = string[];

export const COLUMNS: BaseColumnType[] = [
	{ label: "Name", pinning: !provider.isDesktop() ? undefined : "left" },
	{ label: "Photo", fixedWidth: true, width: 0.6 },
	{ label: "Nationality", fixedWidth: true },
	{ label: "Profession", fixedWidth: true },
	{ label: "Project" },
	{ label: "Company", pinning: "right", width: !provider.isDesktop() ? 0.7 : 1 }
];
const ROWS_COUNT = 500;

const generateCustomerProject = () => {
	const data = [...DATA.CUSTOMER_PROJECT];
	const randomizedArrayLength = Math.round(Math.random() * (data.length - 2)) + 1;
	const randomizedArray = Array(randomizedArrayLength)
		.fill(null)
		.map(() => {
			const randomizedIndex = Math.round(Math.random() * (data.length - 1));
			const selectedItems = data.splice(randomizedIndex, 1);

			return selectedItems[0];
		});

	return randomizedArray.sort().join(", ");
};

function createTableData(): any[] {
	return Array.from(new Range(ROWS_COUNT)).map((v, rowIndex) => {
		return Array.from(new Range(COLUMNS.length)).map((colIndex) => {
			switch (colIndex) {
				case 0:
					return Faker.person.firstName() + " " + Faker.person.lastName();
				case 1:
					return (
						<ResponsiveImageContainer
							src={`images/user_avatar_${1 + Math.floor(Math.random() * 9)}.png`}
							alt={`User's avatar image ${rowIndex}`}
						/>
					);
				case 2:
					return DATA.NATIONALITIES[Math.floor(rowIndex % DATA.NATIONALITIES.length)];
				case 3:
					return "Software Engineer";
				case 4:
					return generateCustomerProject();
				default:
					return Faker.company.name();
			}
		});
	});
}

export const TABLE_DATA = createTableData();

// ----------------------- SHOWCASE --------------------------------------------- //

interface MasterViewProps {
	onClickRow?(selectRow: StringRow): void;
	data: StringRow[];
}

export const MasterView = (props: MasterViewProps): ReactElement => {
	const [selectedRow, setSelectedRow] = useState<StringRow | undefined>(undefined);
	const { onClickRow, data } = props;

	const onRowClick = useCallback(
		(row: StringRow): void => {
			setSelectedRow((prevState) => (prevState === row ? undefined : row));
			onClickRow?.(row);
		},
		[onClickRow]
	);

	return (
		<Table<StringRow>
			data={data}
			columns={COLUMNS}
			rowStyling={({ row }) => ({ selected: selectedRow === row, title: "Open detail" })}
			rowEventHandlers={({ row }) => ({
				onClick: () => onRowClick(row)
			})}
			virtualScrollOptions
		/>
	);
};
