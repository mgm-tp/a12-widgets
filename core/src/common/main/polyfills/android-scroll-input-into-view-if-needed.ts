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

import MobileDetect from "mobile-detect";

import { isBrowser } from "../is-browser.js";

/**
 * On Android devices the input is not always scrolled into view when focus as iOS would do it.
 * This polyfill fills this gap.
 */

/*
 * The instantiation relies on the fact that the window variable is accessible. However, this is not the
 * case in node environment (e.g. for testing), therefore the construction is guarded behind `isBrowser`.
 *
 * `mobile-detect` is a CommonJS/UMD module. It is imported statically (like in `device-detector.ts`) so the
 * bundler interop resolves the default export to the constructor. A dynamic `import("mobile-detect")` produces
 * a namespace whose `.default` is not reliably the constructor across bundlers, which throws at runtime.
 */

export const AndroidScrollInputIntoViewIfNeeded = isBrowser
	? import("../utils.js").then(({ Throttler }) => {
			const mobileDetect = new MobileDetect(window.navigator.userAgent);

			if (mobileDetect.is("AndroidOS")) {
				const throttler = new Throttler(() => {
					const { activeElement } = document;

					if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
						activeElement.scrollIntoView(true);
					}
				});
				window.addEventListener("resize", () => {
					throttler.execute();
				});
			}
		})
	: Promise.resolve();
