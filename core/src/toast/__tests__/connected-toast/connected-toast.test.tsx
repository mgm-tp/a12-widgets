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

import { render, fireEvent, createReferenceElement, removeReferenceElement } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { ConnectedToast } from "../../main/connected-toast/connected-toast.view.js";

describe("com.mgmtp.a12.widgets.connected-toast", () => {
	test("verify the basic connected toast structure", () => {
		const referenceElement = createReferenceElement();
		const id = "id";
		const customClass = "class";
		const style = { fontSize: "10px" };
		const wrapperRef = vi.fn();
		const { container } = render(
			<ConnectedToast
				wrapperRef={wrapperRef}
				id={id}
				className={customClass}
				style={style}
				referenceElement={referenceElement}
			/>
		);
		expect(container).toMatchSnapshot();
		removeReferenceElement(referenceElement);
	});

	test("render with orientation", () => {
		const referenceElement = createReferenceElement();
		const orientation = "left-start";
		const { container } = render(<ConnectedToast orientation={orientation} referenceElement={referenceElement} />);

		expect(container).toMatchSnapshot();
		removeReferenceElement(referenceElement);
	});

	test("onClose should be called after 2000ms by default", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		const referenceElement = createReferenceElement();
		render(<ConnectedToast onClose={onClose} referenceElement={referenceElement} />);

		vi.advanceTimersByTime(1000);
		expect(onClose).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(onClose).toHaveBeenCalledTimes(1);
		removeReferenceElement(referenceElement);
	});

	test("config duration prop", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		const duration = 5000;
		const referenceElement = createReferenceElement();
		render(<ConnectedToast duration={duration} onClose={onClose} referenceElement={referenceElement} />);

		vi.advanceTimersByTime(3000);
		expect(onClose).not.toHaveBeenCalled();

		vi.advanceTimersByTime(2000);
		expect(onClose).toHaveBeenCalledTimes(1);
		removeReferenceElement(referenceElement);
	});

	test("onClose should be called when click outside", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		const referenceElement = createReferenceElement();
		render(<ConnectedToast onClose={onClose} referenceElement={referenceElement} />);
		const outerNode = document.createElement("div");
		document.body.appendChild(outerNode);
		fireEvent.mouseDown(outerNode, { bubbles: true });
		expect(onClose).toHaveBeenCalledTimes(1);
		removeReferenceElement(referenceElement);
	});
});
