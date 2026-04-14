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

import { render, fireEvent, getByDataRole } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";

import { ModalNotification } from "../../main/modal-notification.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

describe("com.mgmtp.a12.widgets.modal-notification", () => {
	test("test rendering default modal notification", () => {
		const { container } = render(<ModalNotification id="test-id" footer="footer" title="title" />);
		expect(container).toMatchSnapshot();
	});

	test("test rendering success modal notification", () => {
		const { container } = render(<ModalNotification variant="success" id="test-id" footer="footer" title="title" />);
		expect(container).toMatchSnapshot();
	});

	test("test rendering error modal notification", () => {
		const { container } = render(<ModalNotification variant="error" id="test-id" footer="footer" title="title" />);
		expect(container).toMatchSnapshot();
	});

	test("test rendering warning modal notification", () => {
		const { container } = render(<ModalNotification variant="warning" id="test-id" footer="footer" title="title" />);
		expect(container).toMatchSnapshot();
	});

	test("test rendering modal notification with custom icon & padding", () => {
		const { container } = render(
			<ModalNotification id="test-id" footer="footer" title="title" icon="icon" padding={24} />
		);
		expect(container).toMatchSnapshot();
	});

	test("test modal notification standard onClose runs only once when closing the modal", () => {
		const onCloseSpy = vi.fn();

		const { container, unmount } = render(<ModalNotification id="test-id" enableCloseButton onClose={onCloseSpy} />);
		const closeBtn = getByDataRole(container, DataRoles.Button);
		fireEvent.click(closeBtn);
		expect(onCloseSpy).toHaveBeenCalledTimes(1);
		unmount();
		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});

	test("test modal notification close on escape key event", () => {
		const onCloseSpy = vi.fn();

		const { container } = render(<ModalNotification id="test-id" onClose={onCloseSpy} closeOnEsc />);
		const modalElement = getByDataRole(container, DataRoles.Modal.Overlay);

		fireEvent.keyDown(modalElement, { key: Key.Escape });

		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});

	test("should display close button when enableCloseButton is true", () => {
		const onCloseSpy = vi.fn();

		const { container } = render(<ModalNotification id="test-id" onClose={onCloseSpy} enableCloseButton />);
		const modalElement = getByDataRole(container, DataRoles.Modal.Overlay);
		const closeButton = getByDataRole(modalElement, DataRoles.Button);

		expect(closeButton).toBeInTheDocument();

		fireEvent.click(closeButton);

		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});

	test("Modal Notification with `htmlAttributes` and `containerAttributes` property", () => {
		const htmlAriaLabel = "Test Custom Label";
		const containerAriaLabel = "Test Custom Container Label";
		const { getByDataRole } = render(
			<ModalNotification
				id="notification-test"
				variant="success"
				title="Success"
				htmlAttributes={{
					"aria-label": htmlAriaLabel
				}}
				containerAttributes={{
					"aria-label": containerAriaLabel
				}}
			>
				<p id="notification-description">Your action was successful.</p>
			</ModalNotification>
		);

		// Modal Notification is displayed by Modal Overlay, so the attributes should be applied to the Modal Overlay element.
		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		expect(modalOverlay).toBeTruthy();
		expect(modalOverlay.getAttribute("aria-label")).toBe(htmlAriaLabel);

		const modalOverlayContainer = getByDataRole(DataRoles.Modal.OverlayContent);
		expect(modalOverlayContainer).toBeTruthy();
		expect(modalOverlayContainer.getAttribute("aria-label")).toBe(containerAriaLabel);
	});
});
