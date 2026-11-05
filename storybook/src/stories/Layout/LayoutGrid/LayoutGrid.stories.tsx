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

import { LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core";

const { Grid, Row, Column } = LayoutGrid;

const cellStyle: React.CSSProperties = {
	background: "#e3f2fd",
	border: "1px solid #90caf9",
	borderRadius: "4px",
	padding: "16px",
	textAlign: "center",
	fontSize: "14px"
};

const meta: Meta<typeof Grid> = {
	title: "Layout/LayoutGrid",
	component: Grid,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		noGutter: {
			control: "boolean",
			description: "Remove all spacing between rows and columns"
		},
		fitToParent: {
			control: "boolean",
			description: "Stretch rows to fill the container height"
		},
		cellBorder: {
			control: "boolean",
			description: "Add a border around each column's content"
		},
		verticalAlignment: {
			control: "select",
			options: ["top", "middle", "bottom"],
			description: "Vertical alignment of column content"
		},
		disableNegativeMargin: {
			control: "boolean",
			description: "Wrap the grid in a div so it keeps a spacing around instead of using negative margins"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		noGutter: false,
		fitToParent: false,
		cellBorder: false
	},
	render: (args) => (
		<Grid {...args}>
			<Row>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>Column 1 (4/12)</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>Column 2 (4/12)</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>Column 3 (4/12)</div>
				</Column>
			</Row>
		</Grid>
	)
};

export const ColumnSizes: Story = {
	render: () => (
		<Grid>
			<Row>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>4/12</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>4/12</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>4/12</div>
				</Column>
			</Row>
			<Row>
				<Column size={{ lg: 6 }}>
					<div style={cellStyle}>6/12</div>
				</Column>
				<Column size={{ lg: 6 }}>
					<div style={cellStyle}>6/12</div>
				</Column>
			</Row>
			<Row>
				<Column size={{ lg: 3 }}>
					<div style={cellStyle}>3/12</div>
				</Column>
				<Column size={{ lg: 6 }}>
					<div style={cellStyle}>6/12 (main content)</div>
				</Column>
				<Column size={{ lg: 3 }}>
					<div style={cellStyle}>3/12</div>
				</Column>
			</Row>
		</Grid>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Each `Column` takes a `size` per breakpoint on a 12-unit scale. A `Grid` can contain multiple `Row`s, each with its own column split."
			}
		}
	}
};

export const ResponsiveColumns: Story = {
	render: () => (
		<div>
			<p style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
				Columns are full-width at sm, half-width at md, and one-third at lg.
			</p>
			<Grid>
				<Row>
					<Column size={{ sm: 12, md: 6, lg: 4 }}>
						<div style={cellStyle}>sm:12 md:6 lg:4</div>
					</Column>
					<Column size={{ sm: 12, md: 6, lg: 4 }}>
						<div style={cellStyle}>sm:12 md:6 lg:4</div>
					</Column>
					<Column size={{ sm: 12, md: 6, lg: 4 }}>
						<div style={cellStyle}>sm:12 md:6 lg:4</div>
					</Column>
				</Row>
			</Grid>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`size` accepts a value per breakpoint (`sm`, `md`, `lg`). The grid tracks its own container width — not the viewport — so resizing the panel switches breakpoints."
			}
		}
	}
};

export const RowLayoutConfig: Story = {
	render: () => (
		<Grid>
			<Row
				layoutConfig={{
					layout: { lg: [3, 6, 3], md: [6, 6, 12], sm: [12, 12, 12] }
				}}
			>
				<Column>
					<div style={cellStyle}>lg:3 md:6 sm:12</div>
				</Column>
				<Column>
					<div style={cellStyle}>lg:6 md:6 sm:12</div>
				</Column>
				<Column>
					<div style={cellStyle}>lg:3 md:12 sm:12</div>
				</Column>
			</Row>
		</Grid>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Instead of sizing each column individually, `layoutConfig` on a `Row` declares the whole layout per breakpoint — columns inside then need no `size` prop."
			}
		}
	}
};

export const NoGutter: Story = {
	render: () => (
		<Grid noGutter>
			<Row>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>No gutter col 1</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>No gutter col 2</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={cellStyle}>No gutter col 3</div>
				</Column>
			</Row>
		</Grid>
	),
	parameters: {
		docs: {
			description: {
				story: "`noGutter` removes all spacing between rows and columns."
			}
		}
	}
};

export const VerticalAlignment: Story = {
	render: () => (
		<Grid>
			<Row verticalAlignment="middle">
				<Column size={{ lg: 4 }}>
					<div style={{ ...cellStyle, height: "80px" }}>Short</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={{ ...cellStyle, height: "160px" }}>Tall — neighbors are middle-aligned</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={{ ...cellStyle, height: "80px" }}>Short</div>
				</Column>
			</Row>
		</Grid>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`verticalAlignment` (`top`, `middle`, `bottom`) can be set on the `Grid`, a `Row` or a single `Column`. Without it, columns stretch to the row height."
			}
		}
	}
};

export const WithCellBorder: Story = {
	render: () => (
		<Grid cellBorder>
			<Row>
				<Column size={{ lg: 4 }}>
					<div style={{ padding: "16px" }}>Cell border col 1</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={{ padding: "16px" }}>Cell border col 2</div>
				</Column>
				<Column size={{ lg: 4 }}>
					<div style={{ padding: "16px" }}>Cell border col 3</div>
				</Column>
			</Row>
		</Grid>
	),
	parameters: {
		docs: {
			description: {
				story: "`cellBorder` draws a border around the content of every column."
			}
		}
	}
};
