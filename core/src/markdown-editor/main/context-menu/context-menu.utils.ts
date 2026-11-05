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

const TABLE_CELL_SELECTOR = "th, td";

/** What a right-click inside the editor landed on, when it landed on something with a menu. */
type ContextMenuTarget = { kind: "image"; element: HTMLImageElement } | { kind: "cell"; element: HTMLElement };

/**
 * What the `contextmenu` event landed on, or null when nothing here has a menu for it
 * and the browser's own menu is the right one — spell check, paste, translate.
 *
 * An image inside a table cell answers both questions, so the order decides it:
 * the picture is the more exact thing to have clicked, so its menu wins over the cell's.
 */
export function findContextMenuTarget(event: MouseEvent, root: HTMLElement): ContextMenuTarget | null {
	const { target } = event;
	const element = target instanceof HTMLElement ? target : (target as Node | null)?.parentElement;

	const image = element?.closest("img");

	if (image && root.contains(image)) {
		return { kind: "image", element: image };
	}

	const cell = element?.closest<HTMLElement>(TABLE_CELL_SELECTOR);

	if (cell && root.contains(cell)) {
		return { kind: "cell", element: cell };
	}

	return null;
}
