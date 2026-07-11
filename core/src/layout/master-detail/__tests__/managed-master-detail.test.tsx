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

import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { ManagedMasterDetail } from "../main/managed-master-detail/managed-master-detail.view.js";

async function moveResize(handler: HTMLElement, options: { x?: number; steps?: number }): Promise<void> {
	const { x = 0, steps = 1 } = options;
	const rect = handler.getBoundingClientRect();
	const startX = rect.left;
	const startY = rect.top;

	handler.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: startX, clientY: startY }));

	for (let i = 1; i <= steps; i++) {
		document.dispatchEvent(
			new MouseEvent("mousemove", { bubbles: true, clientX: startX + x * (i / steps), clientY: startY })
		);
	}

	document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, clientX: startX + x, clientY: startY }));
}

const VIEWS = [
	{ id: "managed-pane_1", label: "Pane 1" },
	{ id: "managed-pane_2", label: "Pane 2" }
];

function ManagedMasterDetailExample({
	resizeOptions
}: {
	resizeOptions: { minWidth: string | number; maxWidth: string | number };
}) {
	return (
		<ManagedMasterDetail
			style={{ maxHeight: 600, width: "100%" }}
			title="Managed Master Detail Layout"
			views={VIEWS.map((view, i) => ({
				id: view.id,
				label: view.label,
				key: view.id,
				content: () => (
					<ActionContentbox padding={true} role="form" ariaLabel="Detail form" tabIndex={-1}>
						Content {i + 1}
					</ActionContentbox>
				)
			}))}
			columnCount={2}
			startIndex={1}
			firstViewResizableOptions={resizeOptions}
		/>
	);
}

function getFirstPane(container: HTMLElement): HTMLElement {
	return container.querySelectorAll(`[data-role="${DataRoles.MasterDetail.Layout.Pane}"]`)[0] as HTMLElement;
}

function getSecondPane(container: HTMLElement): HTMLElement {
	return container.querySelectorAll(`[data-role="${DataRoles.MasterDetail.Layout.Pane}"]`)[1] as HTMLElement;
}

function getResizeHandler(container: HTMLElement): HTMLElement {
	return container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;
}

describe("com.mgmtp.a12.widgets.layout.managed-master-detail.resize", () => {
	test("Should resize to maxWidth on first attempt without issues", async () => {
		const { container } = render(
			<ManagedMasterDetailExample resizeOptions={{ maxWidth: "2000px", minWidth: "300px" }} />
		);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const resizeHandler = getResizeHandler(container);
		const initialWidth = firstPane.getBoundingClientRect().width;

		await moveResize(resizeHandler, { x: 2000 - initialWidth, steps: 10 });

		await waitFor(
			() => {
				const finalWidth = firstPane.getBoundingClientRect().width;
				expect(finalWidth).toBeGreaterThan(initialWidth);
				expect(finalWidth).toBeLessThanOrEqual(2000);
			},
			{ timeout: 2000 }
		);
	});

	test("Should maintain consistent behavior between first and subsequent resizes", async () => {
		const { container } = render(
			<ManagedMasterDetailExample resizeOptions={{ maxWidth: "1500px", minWidth: "300px" }} />
		);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const resizeHandler = getResizeHandler(container);

		const firstMoveDistance = 400;
		await moveResize(resizeHandler, { x: firstMoveDistance, steps: 5 });
		await waitFor(() => expect(firstPane.getBoundingClientRect().width).toBeGreaterThan(0), { timeout: 2000 });
		const firstResizeWidth = firstPane.getBoundingClientRect().width;

		await moveResize(resizeHandler, { x: firstMoveDistance, steps: 5 });
		await waitFor(() => expect(firstPane.getBoundingClientRect().width).toBeGreaterThan(0), { timeout: 2000 });
		const secondResizeWidth = firstPane.getBoundingClientRect().width;

		await moveResize(resizeHandler, { x: -200, steps: 5 });

		await waitFor(
			() => {
				expect(firstResizeWidth).toBeLessThan(secondResizeWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should respect minWidth constraints properly", async () => {
		const minWidth = 350;
		const { container } = render(
			<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: `${minWidth}px` }} />
		);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const resizeHandler = getResizeHandler(container);
		const initialWidth = firstPane.getBoundingClientRect().width;

		await moveResize(resizeHandler, { x: -(initialWidth - 100), steps: 10 });

		await waitFor(
			() => {
				expect(firstPane.getBoundingClientRect().width).toBeGreaterThanOrEqual(minWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should respect maxWidth constraints properly", async () => {
		const maxWidth = 800;
		const { container } = render(
			<ManagedMasterDetailExample resizeOptions={{ maxWidth: `${maxWidth}px`, minWidth: "200px" }} />
		);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const resizeHandler = getResizeHandler(container);

		await moveResize(resizeHandler, { x: maxWidth + 500, steps: 10 });

		await waitFor(
			() => {
				expect(firstPane.getBoundingClientRect().width).toBeLessThanOrEqual(maxWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should handle percentage-based maxWidth correctly", async () => {
		const { container } = render(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "60%", minWidth: "250px" }} />);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const resizeHandler = getResizeHandler(container);

		const parentContainer = container.querySelector(
			`[data-role="${DataRoles.MasterDetail.Layout.Body}"]`
		) as HTMLElement;
		const parentWidth = parentContainer.getBoundingClientRect().width;
		const expectedMaxWidth = parentWidth * 0.6;

		const initialWidth = firstPane.getBoundingClientRect().width;
		await moveResize(resizeHandler, { x: expectedMaxWidth - initialWidth + 200, steps: 10 });

		await waitFor(
			() => {
				expect(firstPane.getBoundingClientRect().width).toBeLessThanOrEqual(expectedMaxWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should maintain proper sibling coordination during resize", async () => {
		const { container } = render(
			<ManagedMasterDetailExample resizeOptions={{ maxWidth: "1200px", minWidth: "300px" }} />
		);

		await waitFor(() => expect(getFirstPane(container)).toBeTruthy(), { timeout: 2000 });

		const firstPane = getFirstPane(container);
		const secondPane = getSecondPane(container);
		const resizeHandler = getResizeHandler(container);

		const initialFirstWidth = firstPane.getBoundingClientRect().width;
		const initialSecondWidth = secondPane.getBoundingClientRect().width;
		const initialTotal = initialFirstWidth + initialSecondWidth;

		const resizeOperations = [300, -150, 200, -100];

		for (const delta of resizeOperations) {
			await moveResize(resizeHandler, { x: delta, steps: 5 });

			await waitFor(
				() => {
					const currentFirst = firstPane.getBoundingClientRect().width;
					const currentSecond = secondPane.getBoundingClientRect().width;
					const currentTotal = currentFirst + currentSecond;

					expect(Math.abs(currentTotal - initialTotal)).toBeLessThan(5);
					expect(currentFirst).toBeGreaterThan(50);
					expect(currentSecond).toBeGreaterThan(50);
				},
				{ timeout: 2000 }
			);
		}
	});
});
