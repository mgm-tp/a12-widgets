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

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { EMPLOYEES } from "../Table/table.data.js";

const ALIGNMENT_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID (right)", dataKey: "id", width: 0.5, fixedWidth: true, horizontalAlignment: "right", pinning: "left" },
	{ label: "Name (left)", dataKey: "firstName", width: 1, horizontalAlignment: "left", pinning: "left" },
	{ label: "Dept (center)", dataKey: "department", width: 1.5, horizontalAlignment: "center" },
	{ label: "Role", dataKey: "role", width: 1.5 }
];

const FIXED_VS_FLUID_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID (fixed 60px)", dataKey: "id", width: 0.4, fixedWidth: true, pinning: "left" },
	{ label: "Name (fluid 1fr)", dataKey: "firstName", width: 1, pinning: "left" },
	{ label: "Department (fluid 2fr)", dataKey: "department", width: 2 },
	{ label: "Role (fluid 1fr)", dataKey: "role", width: 1 }
];

const SUBINFO_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1 },
	{ label: "Last Name", dataKey: "lastName", width: 1, subInfo: true },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5, subInfo: true }
];

function AlignmentDemo() {
	return (
		<DataTable<Employee> ariaLabel="Alignment variants" data={EMPLOYEES} columns={ALIGNMENT_COLUMNS} rowKey="id" />
	);
}

function FixedVsFluidDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Fixed vs fluid widths"
			data={EMPLOYEES}
			columns={FIXED_VS_FLUID_COLUMNS}
			rowKey="id"
		/>
	);
}

function SubInfoDemo() {
	return <DataTable<Employee> ariaLabel="Sub info columns" data={EMPLOYEES} columns={SUBINFO_COLUMNS} rowKey="id" />;
}

const meta: Meta<typeof AlignmentDemo> = {
	title: "Data Display/DataTable/Columns",
	component: AlignmentDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Alignment: Story = {
	render: () => <AlignmentDemo />,
	parameters: {
		docs: {
			description: {
				story: "Per-column `horizontalAlignment` controls cell text alignment — left, center, or right."
			}
		}
	}
};

export const FixedVsFluid: Story = {
	name: "Fixed vs Fluid Widths",
	render: () => <FixedVsFluidDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`fixedWidth` columns use a px-width track (`width × 150px`); fluid columns use a `minmax(0, Nfr)` track."
			}
		}
	}
};

export const SubInfo: Story = {
	name: "Sub-Info Columns",
	render: () => <SubInfoDemo />,
	parameters: {
		docs: {
			description: {
				story: "Setting `subInfo: true` renders the cell with the de-emphasized secondary color."
			}
		}
	}
};
