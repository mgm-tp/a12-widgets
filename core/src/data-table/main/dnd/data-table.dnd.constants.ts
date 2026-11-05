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

import { DataRoles } from "../../../common/main/data-roles.js";

/**
 * Default `acceptType` when `dragDropOptions.acceptType` is not set. Exported so the
 * tree-table DnD path stamps the same payload type the orchestrator's monitor matches on.
 *
 * @internal
 */
export const DEFAULT_ACCEPT_TYPE = "DataTableDnDRow";

/**
 * Key carrying the drag's accept type inside the pragmatic-drag-and-drop payload.
 * Drag sources stamp it in `getInitialData`; drop targets and monitors compare it
 * in `canDrop`/`canMonitor`. Two DataTables with the same `acceptType` accept each
 * other's rows.
 */
export const DRAG_TYPE_KEY = "dataTableDnDType";

/**
 * Transition applied to rows while they shift apart to open the projected drop
 * gap (and back together when it moves on). Targets only the `translate`
 * property so nothing else animates; the row's own themed transitions are
 * restored when the drag ends.
 */
export const SHIFT_TRANSITION = "translate 200ms cubic-bezier(0.25, 1, 0.5, 1)";

/**
 * Marks the dragged source row as the dashed drop-slot placeholder while a flat-table
 * row drag is in flight. The row keeps its box (so its dashed outline paints a
 * full-width rectangle that rides into the projected gap); `StyledDataTableBodyRow`
 * owns the outline and the content hiding, keyed off this attribute.
 *
 * @internal
 */
export const DROP_SLOT_ATTRIBUTE = "data-drop-slot";

/**
 * Attribute marking a row as a rejected ("forbidden") drop target. Styled in the
 * body-row template, shared with the tree table's reparent affordance.
 *
 * @internal
 */
export const DROP_TARGET_ATTRIBUTE = "data-drop-target";

/** Value of {@link DROP_TARGET_ATTRIBUTE} for a rejected drop target. */
export const DROP_TARGET_FORBIDDEN = "forbidden";

/**
 * Stringified role of the inline expansion row that may follow a body row.
 *
 * @internal
 */
export const EXPANDABLE_ROW_ROLE = `${DataRoles.Table.Expandable.Row}`;

/**
 * A viewport-relative point. Used for pointer positions throughout the DnD path.
 *
 * @internal
 */
export interface ClientOffset {
	x: number;
	y: number;
}
