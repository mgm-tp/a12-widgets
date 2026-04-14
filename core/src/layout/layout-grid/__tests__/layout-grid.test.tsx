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

import { getByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import type { SizeDetectorProps } from "../../size-detector/main/size-detector.api.js";

import { LayoutGrid } from "../main/layout-grid.view.js";

const { Grid, Column, Row, LayoutGridTemplate } = LayoutGrid;

const gridDataRole = "layout-grid";
const rowDataRole = `${gridDataRole}-row`;
const columnDataRole = `${gridDataRole}-column`;

describe("com.mgmtp.a12.widgets.layout-grid", () => {
	const alignments: ("top" | "middle" | "bottom")[] = ["top", "middle", "bottom"];

	test("render layout grid", () => {
		const { container } = render(
			<Grid id="test-grid-id" className="test-grid-class">
				<Row id="test-row-id" className="test-row-class">
					<Column id="test-column-id" className="test-column-class" size={{ lg: 1, md: 1, sm: 1 }} />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render layout grid at different breakpoints", () => {
		(["xs", "sm", "md", "lg"] as SizeDetectorProps.Size[]).forEach((val) => {
			const { container } = render(<LayoutGridTemplate size={val} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("render layout grid with disabledNegativeMargin", () => {
		const { container } = render(
			<Grid disableNegativeMargin>
				<Row>
					<Column size={{ lg: 1, md: 1, sm: 1 }} />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render fit layout grid", () => {
		const { container } = render(
			<Grid fitToParent>
				<Row>
					<Column size={{ lg: 1, md: 1, sm: 1 }} />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render layout grid with no gutter", () => {
		const { container } = render(
			<Grid noGutter>
				<Row>
					<Column size={{ lg: 1, md: 1, sm: 1 }} />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render nested layout grid", () => {
		const { container } = render(
			<Grid fitToParent>
				<Row>
					<Column size={{ lg: 6, md: 6, sm: 1 }}>
						<Grid>
							<Row>
								<Column size={{ lg: 1, md: 1, sm: 1 }} />
							</Row>
						</Grid>
					</Column>
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render spacer column", () => {
		const { container } = render(<Column size={{ lg: 1, md: 1, sm: 1 }} spacerColumn />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("test grid alignment", () => {
		alignments.forEach((val) => {
			const { container } = render(
				<Grid verticalAlignment={val}>
					<Row>
						<Column size={{ lg: 1, md: 1, sm: 1 }} />
					</Row>
				</Grid>
			);
			expect(getByDataRole(container, rowDataRole)).toHaveStyle({
				alignItems: val === "top" ? "flex-start" : val === "middle" ? "center" : "flex-end"
			});
		});
	});

	test("test row alignment", () => {
		alignments.forEach((val) => {
			const { container } = render(
				<Grid>
					<Row verticalAlignment={val}>
						<Column size={{ lg: 1, md: 1, sm: 1 }} />
					</Row>
				</Grid>
			);
			expect(getByDataRole(container, rowDataRole)).toHaveStyle({
				alignItems: val === "top" ? "flex-start" : val === "middle" ? "center" : "flex-end"
			});
		});
	});

	test("test column alignment", () => {
		alignments.forEach((val) => {
			const { container } = render(
				<Grid>
					<Row>
						<Column verticalAlignment={val} size={{ lg: 1, md: 1, sm: 1 }} />
					</Row>
				</Grid>
			);
			expect(getByDataRole(container, columnDataRole)).toHaveStyle({
				alignSelf: val === "top" ? "flex-start" : val === "middle" ? "center" : "flex-end"
			});
		});
	});

	test("render row with layout config", () => {
		const { container } = render(
			<Grid>
				<Row
					layoutConfig={{
						layout: { lg: [3, 3, 3], md: [6, 6, 6], sm: [12, 12, 12] }
					}}
				>
					<Column />
					<Column />
					<Column />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render row with fallback layout config", () => {
		const { container } = render(
			<Grid>
				<Row
					layoutConfig={{
						layout: { lg: [3, 9], sm: [6, 6] }
					}}
				>
					<Column />
					<Column />
				</Row>
			</Grid>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render row with custom offset", () => {
		const { container } = render(
			<Row
				layoutConfig={{
					layout: { lg: [3, 3, 6], md: [6, 6, 6], sm: [6, 6, 12] },
					offsets: { lg: [0, 0], md: [1, 0], sm: [0, 1] }
				}}
			>
				<Column />
				<Column />
			</Row>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render row with custom span", () => {
		const { container } = render(
			<Row
				layoutConfig={{
					layout: { lg: [3, 3, 3], md: [3, 3, 6], sm: [6, 6, 6] },
					spans: { lg: [1, 2], md: [2, 1], sm: [2, 1] }
				}}
			>
				<Column />
				<Column />
			</Row>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
