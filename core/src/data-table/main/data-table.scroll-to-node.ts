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

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { focusEnsuringTabIndex } from "../../common/main/utils.js";

import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";

export interface UseScrollToNodeParams {
	dataLength: number;
	scrollToNode: ((handler: TableScrollToNodeHandler) => void) | undefined;
	isVirtualizedMode: boolean;
}

/**
 * Owns the per-row element ref array, keeps it trimmed to the current row count
 * and, for the non-virtualized body, registers a `scrollToNode` handler that
 * scrolls a row into view (optionally focusing it). Virtualized/infinite bodies
 * own their own scrolling, so the handler is not registered in that mode.
 *
 * Returns the `rowRefs` array the caller attaches to each rendered row.
 */
export function useScrollToNode(params: UseScrollToNodeParams): RefObject<(HTMLTableRowElement | null)[]> {
	const { dataLength, scrollToNode, isVirtualizedMode } = params;
	const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

	useEffect(() => {
		rowRefs.current = rowRefs.current.slice(0, dataLength);
	}, [dataLength]);

	useEffect(() => {
		if (!scrollToNode || isVirtualizedMode) {
			return;
		}

		scrollToNode((nodeIndex, options) => {
			const el = rowRefs.current[nodeIndex];

			if (!el) {
				return;
			}

			el.scrollIntoView({ block: "center" });

			if (options?.autoFocus) {
				focusEnsuringTabIndex(el);
			}
		});
	}, [scrollToNode, isVirtualizedMode]);

	return rowRefs;
}
