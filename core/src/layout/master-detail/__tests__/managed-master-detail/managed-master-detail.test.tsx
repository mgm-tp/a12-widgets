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

import { render } from "test-utils";
import { describe, expect, test } from "vitest";

import { ManagedMasterDetail } from "../../main/managed-master-detail/managed-master-detail.view.js";
import type { SizeDetectorProps } from "../../../size-detector/main/size-detector.api.js";

const visibleViewDataRole = "visibile-view-test";

describe("com.mgmtp.a12.widgets.layout.managed-master-detail", () => {
	const baseDataRole = "master-detail-layout";

	test("fullscreenView", () => {
		const { container } = render(
			<ManagedMasterDetail
				title="title"
				columnCount={2}
				startIndex={2}
				views={[
					{
						label: "View 1",
						content: () => <p>View 1</p>
					},
					{
						label: "View 2",
						content: () => <p>View 2</p>
					},
					{
						label: "View 3",
						content: () => <p>View 3</p>
					},
					{
						label: "View 4",
						content: () => <p>View 4</p>
					}
				]}
				fullScreenable
				fullscreen
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
		const contents = container.querySelectorAll(`[data-role=${baseDataRole}-pane] p`);
		expect(contents.length).toEqual(1);
		expect(contents[0].textContent).toEqual("View 3");
	});

	test("normal-view-without-fullscreen", () => {
		const { container } = render(
			<ManagedMasterDetail
				title="title"
				columnCount={2}
				startIndex={2}
				views={[
					{
						label: "View 1",
						content: () => <p data-role={visibleViewDataRole}>View 1</p>
					},
					{
						label: "View 2",
						content: () => <p data-role={visibleViewDataRole}>View 2</p>
					},
					{
						label: "View 3",
						content: () => <p data-role={visibleViewDataRole}>View 3</p>
					},
					{
						label: "View 4",
						content: () => <p data-role={visibleViewDataRole}>View 4</p>
					}
				]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
		const contents = container.querySelectorAll(`[data-role=${visibleViewDataRole}]`);
		expect(contents.length).toEqual(2);
	});

	test("resizable-for-the-first-view", () => {
		const { container } = render(
			<ManagedMasterDetail
				title="title"
				columnCount={2}
				fullScreenable
				views={[
					{
						label: "View 1",
						content: () => <p data-role={visibleViewDataRole}>View 1</p>,
						resizableOptions: {
							minWidth: "100px",
							maxWidth: "70%"
						}
					},
					{
						label: "View 2",
						content: () => <p data-role={visibleViewDataRole}>View 2</p>
					}
				]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("resizable-for-the-second-view", () => {
		const { container } = render(
			<ManagedMasterDetail
				title="title"
				columnCount={2}
				fullScreenable
				views={[
					{
						id: "view1",
						label: "View 1",
						content: () => <p data-role={visibleViewDataRole}>View 1</p>
					},
					{
						id: "view2",
						label: "View 2",
						content: () => <p data-role={visibleViewDataRole}>View 2</p>,
						resizableOptions: {
							minWidth: "100px",
							maxWidth: "70%"
						}
					}
				]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("custom-breakpoints", () => {
		const breakpoints: SizeDetectorProps.BreakPoint[] = [{ width: 900, size: "lg" }];
		const { container } = render(
			<ManagedMasterDetail
				title="title"
				views={[
					{
						label: "View 1",
						content: () => <p>View 1</p>
					}
				]}
				breakPoints={breakpoints}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
