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

import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

const COLUMNS: DataTableColumn<Employee>[] = [...BASIC_COLUMNS, { label: "Status", dataKey: "status", width: 1 }];

type FilterMap = Record<string, string>;

function FilterRowDemo() {
	const [filters, setFilters] = useState<FilterMap>({});

	const filteredData = useMemo(() => {
		return EMPLOYEES.filter((row) =>
			Object.entries(filters).every(([key, query]) => {
				if (!query) {
					return true;
				}

				const value = (row as unknown as Record<string, unknown>)[key];

				return String(value ?? "")
					.toLowerCase()
					.includes(query.toLowerCase());
			})
		);
	}, [filters]);

	const columns = useMemo<DataTableColumn<Employee>[]>(
		() =>
			COLUMNS.map((column) => {
				const dataKey = column.dataKey as string | undefined;

				if (!dataKey) {
					return column;
				}

				return {
					...column,
					renderFilter: () => (
						<TextField
							label={`Filter ${column.label}`}
							hideLabel
							value={filters[dataKey] ?? ""}
							onChange={(ev) => setFilters((prev) => ({ ...prev, [dataKey]: ev.target.value }))}
						/>
					)
				};
			}),
		[filters]
	);

	return <DataTable<Employee> ariaLabel="Filter row demo" data={filteredData} columns={columns} rowKey="id" />;
}

const meta: Meta<typeof FilterRowDemo> = {
	title: "Data Display/DataTable/Filter Row",
	component: FilterRowDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <FilterRowDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide `renderFilter` on a column (or any of the `filter*` slots) to render a sticky filter row between the header and body. The filter row only renders when at least one column has `renderFilter` or a filter slot is provided."
			}
		}
	}
};
