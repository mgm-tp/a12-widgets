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

import type { FC } from "react";
import { useRef, useState } from "react";
import { styled } from "styled-components";
import { getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { ResizeHandlerProps } from "../resize-handler.api.js";
import { ResizeHandler } from "../resize-handler.view.js";

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

const StyledContainer = styled.div`
	width: 100%;
	height: 700px;
	display: flex;
`;

const StyledFirstView = styled.div<{ $width: number }>`
	width: ${({ $width }) => $width}px;
	flex-shrink: 1;
	background-color: pink;
`;

const StyledSecondView = styled.div`
	flex: 1;
	background-color: red;
`;

const ExampleResizeHandler: FC<Omit<ResizeHandlerProps, "targetRef">> = (props) => {
	const targetRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(300);

	return (
		<StyledContainer>
			<ResizeHandler {...props} targetRef={targetRef} onResizeStop={(_event, data) => setWidth(data.width)}>
				<StyledFirstView ref={targetRef} id="test-div-1" $width={width}>
					div 1
				</StyledFirstView>
			</ResizeHandler>
			<StyledSecondView id="test-div-2">div 2</StyledSecondView>
		</StyledContainer>
	);
};

describe("com.mgmtp.a12.widgets.layout.resizable.resize-handler", () => {
	test("Should resize the component and verify the new width matches the expected value", async () => {
		const { container } = render(<ExampleResizeHandler />);

		const resizeHandlerEl = getByDataRole(container, DataRoles.ResizableHandler) as HTMLElement;
		const firstView = container.querySelector("#test-div-1") as HTMLElement;

		const initialWidth = firstView.getBoundingClientRect().width;
		expect(initialWidth).toBe(300);

		const newWidth = 100;
		await moveResize(resizeHandlerEl, { x: newWidth - initialWidth });

		await waitFor(
			() => {
				expect(firstView.getBoundingClientRect().width).toBe(newWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should not go under minWidth when resizing", async () => {
		const minWidth = 200;
		const { container } = render(<ExampleResizeHandler minWidth={minWidth} maxWidth={500} />);

		const resizeHandlerEl = getByDataRole(container, DataRoles.ResizableHandler) as HTMLElement;
		const firstView = container.querySelector("#test-div-1") as HTMLElement;

		const initialWidth = firstView.getBoundingClientRect().width;
		expect(initialWidth).toBe(300);

		// Attempt to resize below minWidth (try to reach 100px)
		await moveResize(resizeHandlerEl, { x: 100 - initialWidth, steps: 3 });

		await waitFor(
			() => {
				const width = firstView.getBoundingClientRect().width;
				expect(width).toBeGreaterThanOrEqual(minWidth);
				expect(width).toBeLessThan(initialWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Should not exceed maxWidth when resizing", async () => {
		const maxWidth = 500;
		const { container } = render(<ExampleResizeHandler minWidth={200} maxWidth={maxWidth} />);

		const resizeHandlerEl = getByDataRole(container, DataRoles.ResizableHandler) as HTMLElement;
		const firstView = container.querySelector("#test-div-1") as HTMLElement;

		const initialWidth = firstView.getBoundingClientRect().width;
		expect(initialWidth).toBe(300);

		// Attempt to resize above maxWidth (try to reach 600px)
		await moveResize(resizeHandlerEl, { x: 600 - initialWidth, steps: 3 });

		await waitFor(
			() => {
				const width = firstView.getBoundingClientRect().width;
				expect(width).toBeLessThanOrEqual(maxWidth);
				expect(width).toBeGreaterThan(initialWidth);
			},
			{ timeout: 2000 }
		);
	});
});
