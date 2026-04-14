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
import { describe, vi, expect, test } from "vitest";

import { Toast } from "../../main/toast/toast.view.js";
import { ToastGroupContext } from "../../main/toast-group.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

describe("com.mgmtp.a12.widgets.toast", () => {
	test("render with id, class, style, wrapperRef", () => {
		const id = "id";
		const customClass = "class";
		const style = { fontSize: "10px" };
		const wrapperRef = vi.fn();

		const { container } = render(<Toast id={id} style={style} className={customClass} wrapperRef={wrapperRef} />);
		const toast = getByDataRole(container, DataRoles.Toast);

		expect(container.firstChild).toMatchSnapshot();

		// Assert that wrapperRef is called with the toast element
		expect(wrapperRef).toHaveBeenCalledWith(toast);
	});

	test("onClose should be called after 3000ms by default", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		render(
			<ToastGroupContext.Provider
				value={{
					toastCount: 5,
					stackable: true,
					animationTimeout: 400
				}}
			>
				<Toast onClose={onClose} />
			</ToastGroupContext.Provider>
		);

		vi.advanceTimersByTime(2000);
		expect(onClose).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("config duration prop", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		const duration = 1000;
		render(
			<ToastGroupContext.Provider
				value={{
					toastCount: 5,
					stackable: true,
					animationTimeout: 400
				}}
			>
				<Toast onClose={onClose} duration={duration} />
			</ToastGroupContext.Provider>
		);

		vi.advanceTimersByTime(500);
		expect(onClose).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("render with permanent type", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		render(<Toast onClose={onClose} type="permanent" />);

		vi.advanceTimersByTime(10000);
		expect(onClose).not.toHaveBeenCalledTimes(1);
	});

	test("change from permanent type to temporary type", () => {
		const onClose = vi.fn();
		vi.useFakeTimers();
		const { rerender } = render(<Toast onClose={onClose} type="permanent" />);

		vi.advanceTimersByTime(10000);
		expect(onClose).not.toHaveBeenCalledTimes(1);

		rerender(
			<ToastGroupContext.Provider
				value={{
					toastCount: 5,
					stackable: true,
					animationTimeout: 400
				}}
			>
				<Toast onClose={onClose} type="temporary" />
			</ToastGroupContext.Provider>
		);
		vi.advanceTimersByTime(3000);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("should focus to toast by default", () => {
		const onClose = vi.fn();

		vi.useFakeTimers();

		const { container } = render(<Toast onClose={onClose} type="permanent" />);
		const toast = getByDataRole(container, DataRoles.Toast);

		expect(toast).toHaveFocus();
	});

	test("should not focus to toast when focusOnMount is disabled", () => {
		const onClose = vi.fn();

		vi.useFakeTimers();

		const { container } = render(<Toast onClose={onClose} type="permanent" focusOnMount={false} />);
		const toast = getByDataRole(container, DataRoles.Toast);

		expect(toast).not.toHaveFocus();
	});
});
