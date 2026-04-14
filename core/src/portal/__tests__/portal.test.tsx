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
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";

import { Portal } from "../main/portal.view.js";

describe("com.mgmtp.a12.widgets.portal", () => {
	test("portal-should-not-close-on-outside-click-but-call-onClickOutside", () => {
		const onClickOutsideSpy = vi.fn();
		const onCloseSpy = vi.fn();
		const outerNode = document.createElement("div");
		document.body.appendChild(outerNode);
		render(<Portal onClickOutside={onClickOutsideSpy} onClose={onCloseSpy} />, {
			container: outerNode
		});

		fireEvent.mouseDown(outerNode);

		//onClose should not be called when clicking outside of portal, since closeOnOutsideClick is not set
		expect(onCloseSpy).toHaveBeenCalledTimes(0);

		//onClickOutsideSpy should be called when clicking outside of portal
		expect(onClickOutsideSpy).toHaveBeenCalledTimes(1);

		document.body.removeChild(outerNode);
	});

	test("portal-close-on-outside-click", () => {
		const onClickOutsideSpy = vi.fn();
		const onCloseSpy = vi.fn();
		const outerNode = document.createElement("div");
		document.body.appendChild(outerNode);
		render(<Portal onClickOutside={onClickOutsideSpy} onClose={onCloseSpy} closeOnOutsideClick></Portal>, {
			container: outerNode
		});

		fireEvent.mouseDown(outerNode);

		// //onClose should be called when clicking outside of portal
		expect(onCloseSpy).toHaveBeenCalledTimes(1);

		//onClickOutsideSpy should be called when clicking outside of portal
		expect(onClickOutsideSpy).toHaveBeenCalledTimes(1);
		document.body.removeChild(outerNode);
	});

	test("portal-close-on-esc", async () => {
		const onCloseSpy = vi.fn();

		render(
			<Portal onClose={onCloseSpy} closeOnEsc>
				<button data-role="button" />
			</Portal>
		);

		const buttonElement = getByDataRole(document.body, "button");
		fireEvent.keyDown(buttonElement, { key: Key.Escape });

		//onClose should be called when ESC is pressed
		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});

	test("portal-will-not-close-with-a-click-inside", async () => {
		const onCloseSpy = vi.fn();
		const { getByDataRole } = render(
			<Portal onClose={onCloseSpy} closeOnOutsideClick>
				<button data-role="button" />
			</Portal>
		);

		const buttonElement = getByDataRole("button");
		fireEvent.mouseDown(buttonElement);

		//onClose should not be called if clicking inside of portal
		expect(onCloseSpy).toHaveBeenCalledTimes(0);
	});
});
