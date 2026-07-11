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

import { render, queryByAttribute, waitFor, getByDataRole } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import { ProgressIndicator } from "../main/progress-indicator.view.js";

describe("com.mgmtp.a12.widgets.progress-indicator", () => {
	test("render basic progress indicator", () => {
		const { container } = render(<ProgressIndicator id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render medium progress indicator", () => {
		const { container } = render(<ProgressIndicator size="medium" id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render small progress indicator", () => {
		const { container } = render(<ProgressIndicator size="small" id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render bright outer & inner overlay progress indicator", () => {
		const { container } = render(
			<ProgressIndicator outerOverlayVariant="bright" innerOverlayVariant="bright" id="id-test" />
		);
		expect(container).toMatchSnapshot();
	});

	test("render transparent outer & inner overlay progress indicator", () => {
		const { container } = render(
			<ProgressIndicator outerOverlayVariant="transparent" innerOverlayVariant="transparent" id="id-test" />
		);
		expect(container).toMatchSnapshot();
	});

	test("render single overlay progress indicator", () => {
		const { container } = render(<ProgressIndicator singleOverlay id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render progress indicator with label", () => {
		const { container } = render(<ProgressIndicator label="loading" id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render horizontal progress indicator with label", () => {
		const { container } = render(<ProgressIndicator type="horizontal" label="loading" id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render progress indicator with loading dots", () => {
		const { container } = render(<ProgressIndicator useLoadingDots id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render fast appear progress indicator", () => {
		const { container } = render(<ProgressIndicator fastAppear id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render custom color progress indicator", () => {
		const { container } = render(<ProgressIndicator color="red" id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render progress indicator with hidden loading circle", () => {
		const { container } = render(<ProgressIndicator hideLoadingCircle id="id-test" />);
		expect(container).toMatchSnapshot();
	});

	test("render progress indicator with focusOnOpen", async () => {
		const { container } = render(
			<div style={{ width: "100px", height: "100px" }}>
				<ProgressIndicator focusOnOpen />
			</div>
		);

		await waitFor(() => {
			expect(getByDataRole(container, DataRoles.HiddenText)).toBeTruthy();
		});
		await waitFor(() => {
			const innerOverlay = getByDataRole(container, DataRoles.ProgressIndicator.InnerOverlay);
			expect(innerOverlay).toHaveFocus();
		});
	});

	test("render progress indicator with scrollIntoView", async () => {
		const scrollIntoViewMock = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		const { container } = render(<ProgressIndicator scrollIntoView />);

		let innerOverlay: HTMLElement | null = null;
		let hiddenText: HTMLElement | null = null;

		await waitFor(() => {
			hiddenText = queryByAttribute("data-role", container, "hidden-text");
			expect(hiddenText).toBeTruthy();
		});

		innerOverlay = queryByAttribute("data-role", container, "progress-indicator-inner-overlay");

		expect(innerOverlay).not.toHaveFocus();

		expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: "center" });
	});
});
