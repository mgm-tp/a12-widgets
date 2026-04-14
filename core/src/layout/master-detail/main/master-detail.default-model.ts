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

import type { LayoutResult, MasterDetailLayout, Layoutable, ViewWidth } from "./master-detail.api.js";

/**
 * MasterDetailLayout that layouts items based on a configurable number
 * of columns (visible items) and a given last item that shall be visible (head).
 */
export class FocusLastLayout<T extends Layoutable> implements MasterDetailLayout<T> {
	public columnCount = 2;
	private head!: T;

	constructor(private views: T[]) {
		this.goto(views[0]);
	}

	layout(): LayoutResult<T> {
		const last = this.views.indexOf(this.head);
		const first = Math.max(last - this.columnCount + 1, 0);
		const result: LayoutResult<T> = {
			items: []
		};
		const visibleCount = last - first + 1;

		for (let i = 0; i < first; i++) {
			result.items.push({
				layoutable: this.views[i],
				width: undefined
			});
		}

		for (let i = first; i <= last; i++) {
			const lastPreferredWidth = this.views[last].preferredWidth;
			const width = lastPreferredWidth
				? i === last
					? lastPreferredWidth
					: 12 - lastPreferredWidth
				: 12 / visibleCount;
			result.items.push({
				layoutable: this.views[i],
				width: width as ViewWidth
			});
		}

		return result;
	}

	goto(view: T): void {
		if (this.views.indexOf(view) < 0) {
			throw new Error("view not in list of views");
		}

		this.head = view;
	}
}
