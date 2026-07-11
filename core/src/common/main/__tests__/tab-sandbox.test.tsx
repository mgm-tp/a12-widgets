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

import { describe, test, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "test-utils";
import { userEvent } from "vitest/browser";

import { TabSandbox } from "../tab-sandbox.view.js";

describe("com.mgmtp.a12.widgets.tab-sandbox", () => {
	test("does not trap Tab when disableTabTrapping=true", async () => {
		const onOutsideFocus = vi.fn();
		render(
			<div>
				<TabSandbox disableTabTrapping>
					<button>inside</button>
				</TabSandbox>
				<button onFocus={onOutsideFocus}>outside</button>
			</div>
		);
		const insideBtn = screen.getByText("inside");
		await userEvent.click(insideBtn);
		await userEvent.tab();
		expect(onOutsideFocus).toHaveBeenCalledOnce();
	});

	test("traps Tab from last focusable element back to the wrapper", async () => {
		render(
			<TabSandbox>
				<div>
					<button>first</button>
					<button>second</button>
					<button>last</button>
				</div>
			</TabSandbox>
		);
		const lastBtn = screen.getByText("last");
		await userEvent.click(lastBtn);
		await userEvent.tab();
		// Focus should have wrapped back inside the sandbox (not escaped to document.body)
		expect(document.activeElement).not.toBe(document.body);
		expect(screen.getByText("first").parentElement).toContain(document.activeElement);
	});

	test("traps Shift+Tab from first focusable element to last", async () => {
		render(
			<TabSandbox>
				<div>
					<button>alpha</button>
					<button>beta</button>
					<button>gamma</button>
				</div>
			</TabSandbox>
		);
		const firstBtn = screen.getByText("alpha");
		await userEvent.click(firstBtn);
		await userEvent.tab({ shift: true });
		expect(screen.getByText("gamma")).toHaveFocus();
	});

	test("refocuses previous element when focusBack=true and component unmounts", async () => {
		function Host() {
			const [show, setShow] = useState(true);

			return (
				<div>
					<button id="trigger" onClick={() => setShow(false)}>
						open
					</button>
					{show && (
						<TabSandbox focusBack>
							<button id="inner">inner</button>
						</TabSandbox>
					)}
				</div>
			);
		}

		render(<Host />);
		const triggerBtn = screen.getByText("open");
		triggerBtn.focus();
		// Click the trigger (which also hides the TabSandbox)
		await userEvent.click(triggerBtn);
		// After unmount, focus should return to the trigger
		expect(triggerBtn).toHaveFocus();
	});
});
