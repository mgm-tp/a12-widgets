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

import { useState, useCallback } from "react";
import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { SplitViewProps } from "../main/split-view.api.js";
import { SplitView } from "../main/split-view.view.js";

const properties: Partial<SplitViewProps> = {
	id: "test-id",
	className: "test-class",
	style: { color: "red" }
};

describe("com.mgmtp.a12.widgets.layout.split-view", () => {
	test("render default Split View Area", () => {
		const { container } = render(
			<SplitView.Area id={properties.id} className={properties.className} style={properties.style}>
				Split View Area
			</SplitView.Area>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Split View Area with custom width", () => {
		const { container } = render(<SplitView.Area width={100}>Split View Area with custom width</SplitView.Area>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Split View", () => {
		const { container } = render(
			<SplitView.Area id={properties.id} className={properties.className} style={properties.style}>
				Split View
			</SplitView.Area>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});

function ExampleSplitView({
	singleArea,
	widthConfigs,
	resizableOptions
}: {
	singleArea?: boolean;
	widthConfigs?: { firstWidth?: number; secondWidth?: number; containerWidth?: number };
	resizableOptions?: { first?: SplitViewProps.ResizeOptions; second?: SplitViewProps.ResizeOptions };
}) {
	const [openRightArea, setOpenRightArea] = useState(!singleArea);
	const toggleLeftMenu = useCallback(() => setOpenRightArea((prev) => !prev), []);

	return (
		<div style={{ width: widthConfigs?.containerWidth }}>
			<SplitView>
				<SplitView.Area resizableOptions={resizableOptions?.first} width={widthConfigs?.firstWidth}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={2} text="Left Area" />}
						headingButtons={
							<ContentBoxElements.HeadingActionButton
								icon={<Icon>menu</Icon>}
								onClick={toggleLeftMenu}
								title="Toggle Area"
								id="toggle-button"
							/>
						}
					>
						Left content
					</ActionContentbox>
				</SplitView.Area>
				{openRightArea && (
					<SplitView.Area resizableOptions={resizableOptions?.second} width={widthConfigs?.secondWidth}>
						<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
							Right content
						</ActionContentbox>
					</SplitView.Area>
				)}
			</SplitView>
		</div>
	);
}

describe("com.mgmtp.a12.widgets.layout.split-view.resize", () => {
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

	describe("First View", () => {
		test("Should not resize below minWidth", async () => {
			const firstViewWidth = 300;
			const { container } = render(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600, firstWidth: firstViewWidth }}
				/>
			);

			const areas = container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`);
			const firstArea = areas[0] as HTMLElement;
			const resizeHandler = container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;

			await waitFor(() => expect(firstArea.getBoundingClientRect().width).toBe(firstViewWidth), { timeout: 2000 });

			// Try to resize below minWidth (200)
			await moveResize(resizeHandler, { x: firstViewWidth - 100 - firstViewWidth });

			await waitFor(
				() => {
					expect(firstArea.getBoundingClientRect().width).toBe(200);
				},
				{ timeout: 2000 }
			);
		});

		test("Should not resize exceed maxWidth", async () => {
			const firstViewWidth = 200;
			const { container } = render(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600, firstWidth: firstViewWidth }}
				/>
			);

			const areas = container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`);
			const firstArea = areas[0] as HTMLElement;
			const resizeHandler = container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;

			// Try to resize to maxWidth (70% of 600 = 420)
			await moveResize(resizeHandler, { x: firstViewWidth + 220 - firstViewWidth });

			await waitFor(
				() => {
					expect(firstArea.getBoundingClientRect().width).toBe(420);
				},
				{ timeout: 2000 }
			);

			// Try again beyond maxWidth
			await moveResize(resizeHandler, { x: 100 });

			await waitFor(
				() => {
					expect(firstArea.getBoundingClientRect().width).toBe(420);
				},
				{ timeout: 2000 }
			);
		});

		test("Resizable should work when last element is updated", async () => {
			const firstViewWidth = 300;
			const { container } = render(
				<ExampleSplitView
					singleArea
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600, firstWidth: firstViewWidth }}
				/>
			);

			const areas = container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`);
			const toggleButton = container.querySelector("#toggle-button") as HTMLElement;
			await userEvent.click(toggleButton);

			await waitFor(
				() => {
					expect(container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`).length).toBe(2);
				},
				{ timeout: 2000 }
			);

			const firstArea = areas[0] as HTMLElement;
			const resizeHandler = container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;

			const newWidth = firstViewWidth + 100;
			await moveResize(resizeHandler, { x: newWidth - firstViewWidth });

			await waitFor(
				() => {
					expect(firstArea.getBoundingClientRect().width).toBe(newWidth);
				},
				{ timeout: 2000 }
			);
		});
	});

	describe("Second View", () => {
		test("Should not resize below minWidth", async () => {
			const firstViewWidth = 300;
			const { container } = render(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ second: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600, secondWidth: firstViewWidth }}
				/>
			);

			const areas = container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`);
			const secondArea = areas[areas.length - 1] as HTMLElement;
			const resizeHandler = container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;

			await waitFor(() => expect(secondArea.getBoundingClientRect().width).toBe(firstViewWidth), { timeout: 2000 });

			await moveResize(resizeHandler, { x: firstViewWidth + 100 - firstViewWidth });

			await waitFor(
				() => {
					expect(secondArea.getBoundingClientRect().width).toBe(200);
				},
				{ timeout: 2000 }
			);

			const currentWidth = secondArea.getBoundingClientRect().width;
			await moveResize(resizeHandler, { x: currentWidth + 100 - currentWidth });

			await waitFor(
				() => {
					expect(secondArea.getBoundingClientRect().width).toBe(200);
				},
				{ timeout: 2000 }
			);
		});

		test("Should not resize exceed maxWidth", async () => {
			const secondViewWidth = 400;
			const { container } = render(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ second: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ secondWidth: secondViewWidth, containerWidth: 600 }}
				/>
			);

			const areas = container.querySelectorAll(`[data-role="${DataRoles.SplitView.Area}"]`);
			const secondArea = areas[areas.length - 1] as HTMLElement;
			const resizeHandler = container.querySelector(`[data-role="${DataRoles.ResizableHandler}"]`) as HTMLElement;

			// Move left to expand second view to maxWidth (70% of 600 = 420)
			await moveResize(resizeHandler, { x: secondViewWidth - 220 - secondViewWidth });

			await waitFor(
				() => {
					expect(secondArea.getBoundingClientRect().width).toBe(420);
				},
				{ timeout: 2000 }
			);

			await moveResize(resizeHandler, { x: -120 });

			await waitFor(
				() => {
					expect(secondArea.getBoundingClientRect().width).toBe(420);
				},
				{ timeout: 2000 }
			);
		});
	});
});
