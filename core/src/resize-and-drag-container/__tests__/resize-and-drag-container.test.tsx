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

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
	createReferenceElement,
	fireEvent,
	getByDataRole,
	queryByDataRole,
	removeReferenceElement,
	render,
	waitFor
} from "test-utils";
import { userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { ResizeAndDragContainer } from "../main/resize-and-drag-container.view.js";

describe("com.mgmtp.a12.widgets.resize-and-drag-container", () => {
	let triggerElement: HTMLElement;
	beforeEach(() => {
		triggerElement = createReferenceElement();
	});
	afterEach(() => {
		if (triggerElement) {
			removeReferenceElement(triggerElement);
		}
	});
	test("resize-container-with-initial-size", () => {
		const { container } = render(
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				disableDragging
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
			>
				Something
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		fireEvent.click(triggerElement);
		const content = getByDataRole(container, DataRoles.Portal);
		expect(content).toMatchSnapshot();
	});

	test("draggable-container-with-draggable-button", () => {
		const { container } = render(
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				disableResizing
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
			>
				<Button invert title="Move" className="handle" />
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		fireEvent.click(triggerElement);
		const content = getByDataRole(container, DataRoles.Portal);
		expect(content).toMatchSnapshot();
	});

	test('Render ResizeAndDragContainer with "auto" as the value for initialSize height and width', () => {
		const { container } = render(
			<ResizeAndDragContainer referenceElement={triggerElement} initialSize={{ width: "auto", height: "auto" }}>
				<Button invert title="Close" />
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		fireEvent.click(triggerElement);

		const draggableElement = getByDataRole(container, DataRoles.Portal).getElementsByClassName(
			"react-draggable"
		)[0] as HTMLElement;

		expect(draggableElement.style.height).toBe("auto");
		expect(draggableElement.style.width).toBe("auto");
	});

	test("draggable-container-with-exception-of-button", () => {
		const { container } = render(
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				cancel="button"
				disableResizing
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
			>
				<Button invert title="Close" />
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		fireEvent.click(triggerElement);

		const content = getByDataRole(container, DataRoles.Portal);
		expect(content).toMatchSnapshot();
	});

	test("customization-resizer-styles", () => {
		const { container } = render(
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				cancel="button"
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
				resizeHandleStyles={{
					right: {
						width: "20px",
						cursor: "ns-resize"
					}
				}}
			>
				<Button invert title="Close" />
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		fireEvent.click(triggerElement);

		const content = getByDataRole(container, DataRoles.Portal);
		expect(content).toMatchSnapshot();
	});

	test("resize-container-with-animation", async () => {
		const renderResizeAndDragContainer = (show: boolean) => (
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				disableDragging
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
				animation
				show={show}
			>
				Something
			</ResizeAndDragContainer>
		);

		const { container, rerender } = render(renderResizeAndDragContainer(false));

		expect(container).toBeTruthy();
		expect(queryByDataRole(container, DataRoles.Portal)).toBeFalsy();

		rerender(renderResizeAndDragContainer(true));

		const content = getByDataRole(container, DataRoles.Portal);
		const resizeAndDragContainer = getByDataRole(content, DataRoles.ResizeAndDragContainer);

		await waitFor(() => {
			expect(resizeAndDragContainer.className.includes("-enter-done")).toBeTruthy();
		});
		expect(content).toMatchSnapshot();
	});

	test("resize and drag container with `htmlAttributes` property", async () => {
		const headerId = "container-header-title";
		const { container } = render(
			<ResizeAndDragContainer
				key="container"
				referenceElement={triggerElement}
				minHeight={200}
				minWidth={200}
				initialSize={{ width: 300, height: 400 }}
				htmlAttributes={{
					"aria-labelledby": headerId
				}}
			>
				<div>
					<h2 id={headerId}>Container Title</h2>
					<p>Content with accessibility support</p>
				</div>
			</ResizeAndDragContainer>
		);

		expect(container).toBeTruthy();

		await userEvent.click(triggerElement);

		const portalContent = getByDataRole(container, DataRoles.Portal);
		const resizeAndDragContainer = getByDataRole(portalContent, DataRoles.ResizeAndDragContainer);

		// Verify that the aria-labelledby attribute is correctly applied
		expect(resizeAndDragContainer.getAttribute("aria-labelledby")).toBe(headerId);
	});
});
