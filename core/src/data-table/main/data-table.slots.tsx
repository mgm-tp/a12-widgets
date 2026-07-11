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

import type { ComponentType } from "react";
import { useMemo } from "react";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { DataTableSlots, ResolvedDataTableSlots } from "./data-table-slots.api.js";
import { DataTableDefaultSlots } from "./default-renderers.js";

/**
 * Resolution result for the orchestrator: the merged slot map plus a presence
 * probe for *consumer-provided* slots (gating opt-in structures like the
 * filter row and the footer must react to consumer provision, not to the
 * always-present defaults).
 *
 * @internal
 */
export interface UseDataTableSlotsResult<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	slots: ResolvedDataTableSlots<RowType, ColumnType>;
	hasConsumerSlot: (slot: keyof DataTableSlots<RowType, ColumnType>) => boolean;
}

/**
 * Merge the consumer {@link DataTableSlots} over {@link DataTableDefaultSlots}.
 *
 * Special case: group head cells keep the leaf-cell fallback — a consumer
 * providing only `headCell` customizes group cells too, unless a dedicated
 * `headCellGroup` is given.
 *
 * Suppression is expressed by a slot component that renders nothing or by the
 * structural props (`hideHeader`); an omitted slot always means "use the
 * default".
 *
 * @internal
 */
export function useDataTableSlots<RowType, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>>(
	consumerSlots: DataTableSlots<RowType, ColumnType> | undefined
): UseDataTableSlotsResult<RowType, ColumnType> {
	return useMemo<UseDataTableSlotsResult<RowType, ColumnType>>(() => {
		const consumerMap = consumerSlots as Record<string, ComponentType<any> | undefined> | undefined;
		const slots = { ...DataTableDefaultSlots } as unknown as Record<string, ComponentType<any> | undefined>;

		if (consumerMap) {
			for (const key of Object.keys(consumerMap)) {
				// Skip explicit `undefined` values so they don't clobber defaults.
				if (consumerMap[key]) {
					slots[key] = consumerMap[key];
				}
			}
		}

		if (!consumerMap?.headCellGroup && consumerMap?.headCell) {
			slots.headCellGroup = consumerMap.headCell;
		}

		const hasConsumerSlot = (slot: keyof DataTableSlots<RowType, ColumnType>): boolean =>
			!!consumerMap?.[slot as string];

		return {
			slots: slots as unknown as ResolvedDataTableSlots<RowType, ColumnType>,
			hasConsumerSlot
		};
	}, [consumerSlots]);
}
