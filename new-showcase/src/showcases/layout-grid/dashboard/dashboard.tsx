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

import { BulletList, noop, Tile, TextField, LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core";

import { PieChartExample } from "./pie-charts.js";
import { BarChartsExample } from "./bar-charts.js";

const { Grid, Row, Column } = LayoutGrid;

export function DashboardShowcase(): ReactElement {
	return (
		<Grid fitToParent cellBorder>
			<Row>
				<Column size={{ sm: 9, md: 8, lg: 9 }}>
					<Tile title="What is a Dashboard layout?" color="#056294" icon="info">
						{dashboardDescription}
					</Tile>
				</Column>
				<Column size={{ sm: 3, md: 4, lg: 3 }}>
					<Row>
						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<Tile title="Calendar" color="#00686b" icon="event" />
						</Column>
					</Row>
					<Row>
						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<Tile title="Notes" color="#00686b" />
						</Column>
					</Row>
				</Column>
			</Row>
			<Row>
				<Column size={{ sm: 6, md: 4, lg: 4 }}>
					<Tile title="Assign tasks" color="#bb006c" icon="next_week">
						<Grid>
							<Row>
								<Column size={{ sm: 4, md: 4, lg: 4 }}>
									<TextField label="First name" onChange={noop} />
								</Column>
								<Column size={{ sm: 4, md: 4, lg: 4 }}>
									<TextField label="Middle name" onChange={noop} />
								</Column>
								<Column size={{ sm: 4, md: 4, lg: 4 }}>
									<TextField label="Last name" onChange={noop} />
								</Column>
							</Row>
							<Row>
								<Column size={{ sm: 6, md: 6, lg: 6 }}>
									<TextField label="Position" onChange={noop} />
								</Column>
								<Column size={{ sm: 6, md: 3, lg: 3 }}>
									<TextField label="Faculty" onChange={noop} />
								</Column>
								<Column size={{ sm: 12, md: 3, lg: 3 }}>
									<TextField label="Task content" onChange={noop} />
								</Column>
							</Row>
						</Grid>
					</Tile>
				</Column>
				<Column size={{ sm: 6, md: 4, lg: 4 }}>
					<Tile title="Chart" color="#6b28d7" icon="insert_chart">
						<PieChartExample height={300} />
					</Tile>
				</Column>
				<Column size={{ sm: 12, md: 4, lg: 4 }}>
					<Tile title="Charts Comparison" icon="multiline_chart">
						<BarChartsExample height={300} />
					</Tile>
				</Column>
			</Row>
		</Grid>
	);
}

const dashboardDescription = (
	<div>
		<p>
			We can create a Dashboard Layout by using <code>LayoutGrid</code>.
		</p>
		<p>In this example, we use:</p>
		<BulletList.Unordered>
			<BulletList.Item>
				<code>fitToParent</code>: stretch to fill the container. In addition, you are still able to set a specific
				height to a <code>Row</code> or <code>Column</code> by passing the <code>height</code> property in the
				respective component.
			</BulletList.Item>
			<BulletList.Item>
				<code>cellBorder</code>: add a border around the content of a <code>Column</code>.
			</BulletList.Item>
		</BulletList.Unordered>
		<p>
			The <code>ContentBox</code> widget is also used in this example with the modifier <code>tile</code> to provide a
			nice look and feel.
		</p>
	</div>
);
