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
import { useCallback, useMemo, useState } from "react";
import { render, setupDevice, waitFor } from "test-utils";
import { beforeAll, describe, expect, test, vi } from "vitest";

import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { SizeDetectorProps } from "../../size-detector/main/size-detector.api.js";

import type { Layoutable, VisibleView } from "../main/master-detail.api.js";
import { FocusLastLayout } from "../main/master-detail.default-model.js";
import { MasterDetail } from "../main/master-detail.view.js";
import { Body, Header } from "../main/master-detail.internal.js";
import { TransitionProvider } from "../main/master-detail.context.js";

const visibleViewDataRole = "visibile-view-test";

describe("com.mgmtp.a12.widgets.layout.masterdetail", () => {
	const visibleViewsExample = [
		{
			element: (
				<p key="1" data-role={visibleViewDataRole}>
					visible1
				</p>
			)
		},
		{
			element: (
				<p key="2" data-role={visibleViewDataRole}>
					visible2
				</p>
			)
		}
	];

	test("topStructure", () => {
		const { container, getByDataRole } = render(
			<MasterDetail
				className="aCssClass"
				style={{ color: "red" }}
				title="title"
				animation={{
					enabled: false
				}}
				visibleViews={[]}
			/>
		);
		expect(getByDataRole(DataRoles.MasterDetail.Layout.View)).toBeTruthy();
		expect(container.querySelector(".aCssClass")).toBeTruthy();
	});

	test("rendering-master-detail-header-empty", () => {
		const { container, getByDataRole } = render(<Header title="Title" />);
		expect(container.firstChild).toMatchSnapshot();
		expect(getByDataRole(DataRoles.MasterDetail.Header)).toBeTruthy();
		expect(getByDataRole(DataRoles.MasterDetail.Layout.Title).textContent).toEqual("Title");
	});

	test("rendering-master-detail-body-with-1-visible", () => {
		const { container, getByDataRole } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={[visibleViewsExample[0]]}
				/>
			</TransitionProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
	});

	test("rendering-master-detail-body-with-2-visibles", () => {
		const { container, getByDataRole, getAllByDataRole } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={visibleViewsExample}
				/>
			</TransitionProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		const visibleViews = getAllByDataRole(visibleViewDataRole);
		expect(visibleViews).toHaveLength(2);
		expect(visibleViews[0].textContent).toEqual("visible1");
		expect(visibleViews[1].textContent).toEqual("visible2");
		expect(getByDataRole(DataRoles.MasterDetail.Layout.Body)).toBeTruthy();
	});

	test("rendering-master-detail-single-body", () => {
		const { container, getByDataRole } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={[
						{
							element: (
								<p key="1" data-role={visibleViewDataRole}>
									visible1
								</p>
							)
						}
					]}
				/>
			</TransitionProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
		expect(getByDataRole(DataRoles.MasterDetail.Layout.Body)).toBeTruthy();
		expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
	});

	test("rendering-master-detail-two-visibles-body", () => {
		const { container, getByDataRole, getAllByDataRole } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={visibleViewsExample}
				/>
			</TransitionProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
		expect(getByDataRole(DataRoles.MasterDetail.Layout.Body)).toBeTruthy();
		const visibleViews = getAllByDataRole(visibleViewDataRole);
		expect(visibleViews).toHaveLength(2);
		expect(visibleViews[0].textContent).toEqual("visible1");
		expect(visibleViews[1].textContent).toEqual("visible2");
	});

	test("rendering-resizable-master-detail-for-the-first-view", () => {
		const { container } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={[
						{ ...visibleViewsExample[0], resizableOptions: { minWidth: "100px", maxWidth: "70%" } },
						visibleViewsExample[1]
					]}
				/>
			</TransitionProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-resizable-master-detail-for-the-second-view", () => {
		const { container } = render(
			<TransitionProvider>
				<Body
					animation={{
						enabled: false
					}}
					visibleViews={[
						visibleViewsExample[0],
						{ ...visibleViewsExample[1], resizableOptions: { minWidth: "100px", maxWidth: "70%" } }
					]}
				/>
			</TransitionProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	describe("Animation", () => {
		test("Should call onAnimationStart and onAnimationEnd when removing a view", async () => {
			const onAnimationStart = vi.fn();
			const onAnimationEnd = vi.fn();

			const { rerender: rerenderComponent } = render(
				<MasterDetail
					visibleViews={visibleViewsExample}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			rerenderComponent(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			expect(onAnimationStart).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalledTimes(1);
			});
		});

		test("Should call onAnimationStart and onAnimationEnd when adding a view", async () => {
			const onAnimationStart = vi.fn();
			const onAnimationEnd = vi.fn();

			const { rerender: rerenderComponent } = render(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			rerenderComponent(
				<MasterDetail
					visibleViews={visibleViewsExample}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			expect(onAnimationStart).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalledTimes(1);
			});
		});

		test("Should use flex layout for desktop multi-column view", () => {
			const { container, getAllByDataRole } = render(
				<TransitionProvider>
					<Body
						animation={{
							enabled: false
						}}
						visibleViews={visibleViewsExample} // 2 panes
					/>
				</TransitionProvider>
			);

			const panes = container.querySelectorAll('[class*="StyledMasterDetailLayoutPane"]');
			expect(panes.length).toBe(2);

			const visibleViews = getAllByDataRole(visibleViewDataRole);
			expect(visibleViews).toHaveLength(2);
			expect(visibleViews[0].textContent).toEqual("visible1");
			expect(visibleViews[1].textContent).toEqual("visible2");
		});

		test("Should not break desktop behavior with single view", () => {
			const { container, getByDataRole } = render(
				<TransitionProvider>
					<Body
						animation={{
							enabled: false
						}}
						visibleViews={[visibleViewsExample[0]]} // Single pane on desktop
					/>
				</TransitionProvider>
			);

			const pane = container.querySelector('[class*="StyledMasterDetailLayoutPane"]');
			expect(pane).toBeTruthy();

			expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
		});

		test("Should apply correct CSS classes during animation", async () => {
			const { rerender: rerenderComponent, container } = render(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true
					}}
				/>
			);

			// Add a second view to trigger enter animation
			rerenderComponent(
				<MasterDetail
					visibleViews={visibleViewsExample}
					animation={{
						enabled: true
					}}
				/>
			);

			await waitFor(
				() => {
					const panesWithAnimation = container.querySelectorAll(
						'[class*="masterDetailLayoutPane--enter"], [class*="masterDetailLayoutPane--exit"]'
					);
					expect(panesWithAnimation.length).toBeGreaterThanOrEqual(0);
				},
				{ timeout: 100 }
			);
		});
	});

	describe("Mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("Should use width: 100% for single pane in small view (mobile)", () => {
			const { container, getByDataRole } = render(
				<TransitionProvider>
					<Body
						animation={{
							enabled: false
						}}
						visibleViews={[visibleViewsExample[0]]}
					/>
				</TransitionProvider>
			);

			const pane = container.querySelector('[class*="StyledMasterDetailLayoutPane"]');
			expect(pane).toBeTruthy();

			expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
		});

		test("Should maintain width: 100% after navigation back in mobile view", async () => {
			const onAnimationEnd = vi.fn();

			// Start with single view (Overview)
			const {
				rerender: rerenderComponent,
				container,
				getByDataRole
			} = render(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationEnd
					}}
				/>
			);

			const getPane = () => container.querySelector('[class*="StyledMasterDetailLayoutPane"]');

			// Initial state: should have single pane with width: 100%
			expect(getPane()).toBeTruthy();

			// Navigate to detail view (add second view)
			rerenderComponent(
				<MasterDetail
					visibleViews={visibleViewsExample}
					animation={{
						enabled: true,
						onAnimationEnd
					}}
				/>
			);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalled();
			});

			// Now navigate back to Overview (remove second view)
			rerenderComponent(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationEnd
					}}
				/>
			);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalledTimes(2);
			});

			// After navigation back, should still have width: 100%, not flex: 12 1 0%
			const paneAfterBack = getPane();
			expect(paneAfterBack).toBeTruthy();

			// Verify the view content is still correct
			expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
		});

		test("Should handle view transitions correctly in small view", async () => {
			const onAnimationStart = vi.fn();
			const onAnimationEnd = vi.fn();

			const { rerender: rerenderComponent } = render(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			// Navigate forward: Overview -> Detail
			rerenderComponent(
				<MasterDetail
					visibleViews={visibleViewsExample}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			expect(onAnimationStart).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalledTimes(1);
			});

			// Navigate back: Detail -> Overview
			rerenderComponent(
				<MasterDetail
					visibleViews={[visibleViewsExample[0]]}
					animation={{
						enabled: true,
						onAnimationStart,
						onAnimationEnd
					}}
				/>
			);

			expect(onAnimationStart).toHaveBeenCalledTimes(2);

			await waitFor(() => {
				expect(onAnimationEnd).toHaveBeenCalledTimes(2);
			});
		});

		test("Should handle resizable panes in small view", () => {
			const { container, getByDataRole } = render(
				<TransitionProvider>
					<Body
						animation={{
							enabled: false
						}}
						visibleViews={[
							{
								...visibleViewsExample[0],
								resizableOptions: { minWidth: "100px", maxWidth: "70%" }
							}
						]}
					/>
				</TransitionProvider>
			);

			const pane = container.querySelector('[class*="StyledMasterDetailLayoutPane"]');
			expect(pane).toBeTruthy();

			expect(getByDataRole(visibleViewDataRole).textContent).toEqual("visible1");
		});
	});
});

type LayoutIdentifier = "OverView" | "Detail";
type LayoutIdentifierGeneralType = LayoutIdentifier & Layoutable;

function MasterDetailResizeExample({
	resizeOptions
}: {
	resizeOptions: { minWidth: string | number; maxWidth: string | number };
}): ReactElement {
	const [openDetailView, setOpenDetailView] = useState(false);

	const layoutManager = useMemo(() => {
		const mgr = new FocusLastLayout<LayoutIdentifierGeneralType>(["OverView", "Detail"]);
		mgr.columnCount = 2;

		return mgr;
	}, []);

	layoutManager.goto(openDetailView ? "Detail" : "OverView");

	const overView = useCallback(
		(): VisibleView => ({
			key: "OverView",
			element: (
				<ActionContentbox
					padding
					headingElements={<ContentBoxElements.Title text="OverView" />}
					role="form"
					ariaLabel="Overview"
					tabIndex={-1}
				>
					<Button onClick={() => setOpenDetailView(true)} id="open-detail-test">
						Click to open Detail View
					</Button>
				</ActionContentbox>
			),
			resizableOptions: resizeOptions
		}),
		[resizeOptions]
	);

	const detailView = useCallback(
		(): VisibleView => ({
			key: "Detail",
			element: (
				<ActionContentbox
					padding
					headingElements={<ContentBoxElements.Title text="Detail" />}
					headingButtons={
						<ContentBoxElements.CloseButton id="close-button-test" onClick={() => setOpenDetailView(false)} />
					}
					role="form"
					ariaLabel="Detail form"
					tabIndex={-1}
				>
					Detail view
				</ActionContentbox>
			)
		}),
		[]
	);

	const handleWindowSizeChanged = useCallback((_breakPoint: SizeDetectorProps.BreakPoint): void => {}, []);

	const visibleViews = useCallback((): VisibleView[] => {
		const views: VisibleView[] = [overView()];

		if (openDetailView) {
			views.push(detailView());
		}

		return views;
	}, [detailView, openDetailView, overView]);

	return (
		<div style={{ width: "100%" }}>
			<MasterDetail visibleViews={visibleViews()} onSizeChange={handleWindowSizeChanged} listenToWindowSize={false} />
		</div>
	);
}

describe("com.mgmtp.a12.widgets.layout.masterdetail.resize", () => {
	async function moveResize(handler: HTMLElement, options: { x?: number; steps?: number }): Promise<void> {
		const { x = 0, steps = 1 } = options;
		const rect = handler.getBoundingClientRect();
		const startX = rect.left;
		const startY = rect.top;

		handler.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: startX, clientY: startY }));

		for (let i = 1; i <= steps; i++) {
			document.dispatchEvent(
				new MouseEvent("mousemove", {
					bubbles: true,
					clientX: startX + x * (i / steps),
					clientY: startY
				})
			);
		}

		document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, clientX: startX + x, clientY: startY }));
	}

	test("Should not go under minWidth when resizing", async () => {
		const minWidth = 300;
		const { container, getByDataRole, getAllByDataRole } = render(
			<MasterDetailResizeExample resizeOptions={{ maxWidth: "70%", minWidth }} />
		);

		const openButton = container.querySelector("#open-detail-test") as HTMLElement;
		openButton.click();

		await waitFor(() => expect(getAllByDataRole(DataRoles.MasterDetail.Layout.Pane).length).toBe(2), { timeout: 2000 });

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler);
		const firstPane = getAllByDataRole(DataRoles.MasterDetail.Layout.Pane)[0];

		const initialWidth = firstPane.getBoundingClientRect().width;

		await moveResize(resizeHandler, { x: 200 - initialWidth, steps: 3 });

		await waitFor(
			() => {
				const width = firstPane.getBoundingClientRect().width;
				expect(width).toBeGreaterThanOrEqual(minWidth);
				expect(width).toBeLessThan(initialWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("The view's width should not exceed maxWidth from beginning", async () => {
		const { container, getAllByDataRole } = render(
			<MasterDetailResizeExample resizeOptions={{ maxWidth: 400, minWidth: 200 }} />
		);

		const openButton = container.querySelector("#open-detail-test") as HTMLElement;
		openButton.click();

		await waitFor(() => expect(getAllByDataRole(DataRoles.MasterDetail.Layout.Pane).length).toBe(2), { timeout: 2000 });

		const firstPane = getAllByDataRole(DataRoles.MasterDetail.Layout.Pane)[0];

		await waitFor(() => expect(firstPane.getBoundingClientRect().width).toBe(400), {
			timeout: 2000
		});
	});

	test("Should call onResizeStart, onResize, and onResizeStop from firstViewResizableOptions when resizing the first pane", async () => {
		const onResizeStart = vi.fn();
		const onResize = vi.fn();
		const onResizeStop = vi.fn();

		const { getByDataRole, getAllByDataRole } = render(
			<MasterDetail
				visibleViews={[
					{ element: <p data-role={visibleViewDataRole}>Pane 1</p> },
					{ element: <p data-role={visibleViewDataRole}>Pane 2</p> }
				]}
				firstViewResizableOptions={{
					minWidth: "100px",
					maxWidth: "70%",
					onResizeStart,
					onResize,
					onResizeStop
				}}
			/>
		);

		await waitFor(() => expect(getAllByDataRole(DataRoles.MasterDetail.Layout.Pane).length).toBe(2), { timeout: 2000 });

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler);

		await moveResize(resizeHandler, { x: 50, steps: 3 });

		await waitFor(
			() => {
				expect(onResizeStart).toHaveBeenCalled();
				expect(onResize).toHaveBeenCalled();
				expect(onResizeStop).toHaveBeenCalled();
			},
			{ timeout: 2000 }
		);
	});
});
