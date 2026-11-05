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

/*
 * Tree drag-and-drop core, shared by `TreeView` and `DataTreeTable`.
 *
 * Both render a flattened tree and support the same before / after / inside drop
 * model on the pragmatic tree-item hitbox, so the instruction translation, the
 * cycle guard and the keyboard grab-and-move arithmetic are identical between
 * them — they were literal copies of each other until this module.
 *
 * Everything here is pure and DOM-free. What stays with each component is what
 * genuinely differs: the pragmatic adapter bindings, the indicator rendering, the
 * accept type and pragmatic data keys, and the key bindings (TreeView roves focus
 * over node content, DataTreeTable over table rows).
 *
 * It lives under `tree-view/` rather than somewhere neutral because
 * `data-table/main/data-tree-table/` already imports `tree-view/main/model/` — the
 * dependency edge exists and points this way. The reverse (`tree-view` importing
 * `data-table`) would be a cycle.
 *
 * Internal: deliberately NOT re-exported from `tree-view/main/index.ts`, for the
 * same reason `./model/` is not — a public re-export of an `@internal` symbol
 * breaks API report generation under `stripInternal`.
 *
 * @module
 */

export * from "./tree-dnd.instructions.js";
export * from "./tree-dnd.keyboard.js";
export * from "./tree-dnd.types.js";
