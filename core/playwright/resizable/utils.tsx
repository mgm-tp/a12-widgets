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

import type { Page, Locator } from "playwright";

export async function resizeElement(
	resizeHandler: { hover: () => Promise<void> },
	page: Page,
	x: number,
	y?: number,
	steps: number = 1
): Promise<void> {
	await resizeHandler.hover();
	await page.mouse.down();
	await page.mouse.move(x, y ?? 0, { steps });
	await page.mouse.up();
}

export async function moveResizeElement(
	resizeHandler: Locator,
	page: Page,
	options: {
		x?: number;
		y?: number;
		steps?: number;
	}
): Promise<void> {
	const { x = 0, y = 0, steps = 1 } = options;
	const resizeHandlerBox = await resizeHandler.boundingBox();
	const xOffset = (resizeHandlerBox?.x ?? 0) + x;
	const yOffset = (resizeHandlerBox?.y ?? 0) + y;
	await resizeHandler.hover({
		position: {
			x: 0,
			y: 0
		}
	});
	await page.mouse.down();
	await page.mouse.move(xOffset, yOffset, { steps });
	await page.mouse.up();
}
