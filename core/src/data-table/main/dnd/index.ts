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
 * Flat-table drag & drop, split by concern:
 *
 *   constants     protocol keys and DOM attributes shared across the path
 *   geometry      the row-shift arithmetic and logical-rect hit-testing (no DOM writes)
 *   dom           row snapshot, interactive-target probe, post-move flash
 *   shift-engine  the imperative writer that opens the drop gap
 *   monitor       the per-table pragmatic monitor driving the engine
 *   keyboard      grab-and-move, the non-pointer path to the same outcome
 *   slots         the React slot components (drag source, preview)
 *
 * The tree table's own DnD (`../data-tree-table/data-tree-table.dnd.tsx`) reuses
 * the constants and the `dom` helpers but has its own monitor and instructions.
 */

export * from "./data-table.dnd.constants.js";
export * from "./data-table.dnd.dom.js";
export * from "./data-table.dnd.geometry.js";
export * from "./data-table.dnd.keyboard.js";
export * from "./data-table.dnd.monitor.js";
export * from "./data-table.dnd.shift-engine.js";
export * from "./data-table.dnd.slots.js";
