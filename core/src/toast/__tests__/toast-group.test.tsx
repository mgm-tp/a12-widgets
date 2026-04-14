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

import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { ToastGroup } from "../main/toast-group.view.js";
import { Toast } from "../main/toast/toast.view.js";
import type { ToastGroupProps } from "../main/toast-group.api.js";

describe("com.mgmtp.a12.widgets.toast-group", () => {
	const toasts = [
		<Toast message="message 1" id="1" key={1} />,
		<Toast message="message 2" id="2" key={2} />,
		<Toast message="message 3" id="3" key={3} />
	];

	test("verify the basic toast group structure", () => {
		const { container } = render(<ToastGroup>{toasts}</ToastGroup>);
		expect(container).toMatchSnapshot();
	});

	test("render with id, className and style", () => {
		const id = "test-id";
		const customClass = "test-class";
		const style = { fontSize: "10px" };
		const { container } = render(
			<ToastGroup id={id} className={customClass} style={style}>
				{toasts}
			</ToastGroup>
		);
		expect(container).toMatchSnapshot();
	});

	test("render with WrapperRef", () => {
		const wrapperRef = vi.fn();
		render(<ToastGroup wrapperRef={wrapperRef}>{toasts}</ToastGroup>);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("render with default direction", () => {
		const position: ToastGroupProps.Position[] = ["top-left", "top-right", "bottom-left", "bottom-right"];
		position.forEach((pos: ToastGroupProps.Position) => {
			const { container } = render(<ToastGroup position={pos}>{toasts}</ToastGroup>);
			expect(container).toMatchSnapshot();
		});
	});

	test("render with config direction", () => {
		const position: ToastGroupProps.Position = "top-left";
		const direction: ToastGroupProps.Direction = "bottom-up";
		const { container } = render(
			<ToastGroup position={position} direction={direction}>
				{toasts}
			</ToastGroup>
		);
		expect(container).toMatchSnapshot();
	});

	test("render mobile Toast Group", () => {
		const { container } = render(<ToastGroup mobile>{toasts}</ToastGroup>);
		expect(container).toMatchSnapshot();
	});

	test("render stackable Toast Group", () => {
		const { container } = render(
			<ToastGroup stackable={{ toolbarTitle: "Test", toolbarItems: <Button label="test button" /> }}>
				{toasts}
			</ToastGroup>
		);
		expect(container).toMatchSnapshot();

		const toastGroupWrapperElement = getByDataRole(container, DataRoles.Toast.Group);
		fireEvent.mouseEnter(toastGroupWrapperElement);
		expect(container).toMatchSnapshot();
	});
});
