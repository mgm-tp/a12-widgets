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

import type { MouseEvent } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { triggerPostMoveFlash } from "../../../common/main/dnd-flash/index.js";
import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";

/*
 * DOM-facing helpers shared by the drag source, the monitor and the keyboard
 * reorder path: probing the event target, snapshotting the dragged row for the
 * floating preview, and flashing a row after a committed move.
 */

/**
 * Whether a mouse event originated on an interactive child (button, checkbox)
 * of a draggable row, used to suppress dragging so the control stays usable.
 */
export function isInteractiveElement(event: MouseEvent<HTMLElement>): boolean {
	const target = event.target as HTMLElement;

	if (!target || !target.closest) {
		return false;
	}

	const interactive = target.closest("button, [role='button'], input[type='checkbox'], [role='checkbox']");

	return interactive !== null && !interactive.hasAttribute("disabled");
}

/**
 * Serialized snapshot of the dragged row, captured at drag start for the
 * default drag preview. Clones the source `<colgroup>` so the preview's native
 * `table-layout: fixed` reproduces the same per-column widths, and strips all
 * `id` attributes from the row clone: the markup is re-rendered verbatim in
 * the drag preview, so keeping ids would duplicate them in the live document
 * for the duration of the drag.
 *
 * Works for either layout. In card view `node` is the card `<div>`, there is no
 * enclosing `<table>` and so no `<colgroup>`, and the viewport is found from the card
 * root instead — which is also how the preview knows to host the snapshot directly
 * rather than inside a `<table>`.
 */
export function captureRowSnapshot(
	node: HTMLElement
): Pick<
	DataTableRenderPropsType.DragObject<unknown>,
	"width" | "rowWidth" | "scrollLeft" | "snapshotHTML" | "snapshotColgroupHTML"
> {
	const tableEl = node.closest("table");
	const viewportEl = (tableEl ?? node).closest<HTMLElement>(`[data-role="${DataRoles.Table.Viewport}"]`) ?? null;
	const colgroupHTML = tableEl?.querySelector("colgroup")?.outerHTML;

	const clone = node.cloneNode(true) as HTMLElement;
	clone.removeAttribute("id");
	clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
	// The source row is hidden in place for the duration of the drag (its freed
	// slot is what the shifted rows migrate); the preview clone must not inherit that.
	clone.style.visibility = "";
	const rowHTML = clone.outerHTML;

	const rowWidth = node.offsetWidth;

	return {
		width: viewportEl?.clientWidth ?? rowWidth,
		rowWidth,
		scrollLeft: viewportEl?.scrollLeft ?? 0,
		snapshotHTML: rowHTML,
		snapshotColgroupHTML: colgroupHTML
	};
}

/**
 * Flash the row that now sits at `index` on the next frame — after the consumer's
 * `onDrop` reorder has re-rendered and the row has re-registered at its new index.
 * A no-op when reduced motion is preferred (handled inside {@link triggerPostMoveFlash}).
 *
 * @internal
 */
export function flashRowAtIndex<RowType>(
	registry: DataTableRenderPropsType.DndRowRegistry<RowType>,
	index: number,
	color: string
): void {
	if (typeof requestAnimationFrame !== "function") {
		return;
	}

	requestAnimationFrame(() => {
		const element = registry.get(index)?.element;

		if (element?.isConnected) {
			triggerPostMoveFlash(element, { color });
		}
	});
}
