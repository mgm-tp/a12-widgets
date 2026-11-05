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

import { describe, test, expect, vi, afterEach } from "vitest";

/** A phone's user agent, so a polyfill that gated itself on Android would install itself here. */
const ANDROID_USER_AGENT =
	"Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36";

function pretendToBeAndroid(): () => void {
	Object.defineProperty(window.navigator, "userAgent", { get: () => ANDROID_USER_AGENT, configurable: true });

	return () => delete (window.navigator as { userAgent?: string }).userAgent;
}

describe("com.mgmtp.a12.widgets.android-scroll-input-into-view-if-needed", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.resetModules();
	});

	/**
	 * The module used to listen for `resize` — which on Android is every time the on-screen keyboard
	 * opens or closes — and call `scrollIntoView(true)` on the focused field, pinning it to the top of
	 * the viewport behind any fixed page header, and overriding the scroll position widgets had just
	 * set on purpose. The browser does this itself, so nothing may be installed here.
	 */
	test("installs no resize listener, Android or not", async () => {
		const restoreUserAgent = pretendToBeAndroid();
		const addEventListener = vi.spyOn(window, "addEventListener");

		try {
			await (
				await import("../main/polyfills/android-scroll-input-into-view-if-needed.js")
			).AndroidScrollInputIntoViewIfNeeded;

			expect(addEventListener.mock.calls.filter(([type]) => type === "resize")).toHaveLength(0);
		} finally {
			restoreUserAgent();
		}
	});

	/** A focused field must be left exactly where the page has it, resize or no resize. */
	test("leaves the page where it stands when a focused field's viewport resizes", async () => {
		const restoreUserAgent = pretendToBeAndroid();
		const spacer = document.createElement("div");
		const input = document.createElement("input");
		const trailingSpacer = document.createElement("div");

		spacer.style.height = trailingSpacer.style.height = "4000px";
		document.body.append(spacer, input, trailingSpacer);

		try {
			await (
				await import("../main/polyfills/android-scroll-input-into-view-if-needed.js")
			).AndroidScrollInputIntoViewIfNeeded;
			input.focus({ preventScroll: true });
			window.scrollTo(0, 500);

			expect(window.scrollY).toBe(500);

			window.dispatchEvent(new Event("resize"));
			await new Promise((resolve) => setTimeout(resolve, 50));

			expect(window.scrollY).toBe(500);
		} finally {
			// Only what this test added — clearing the whole body would take the harness's own nodes with it.
			spacer.remove();
			input.remove();
			trailingSpacer.remove();
			window.scrollTo(0, 0);
			restoreUserAgent();
		}
	});
});
