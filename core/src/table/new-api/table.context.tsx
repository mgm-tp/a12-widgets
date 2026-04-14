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

import type { Dispatch, SetStateAction } from "react";

import { createContext, useContextSelector } from "../../context/index.js";

import type { BaseColumnType } from "./column.api.js";
import type { TableContextType } from "./table.api.js";

/** @internal */
export const TableContext = createContext<TableContextType<any, any>>({} as TableContextType);
export const TableContextProvider = TableContext.Provider;

/**
 * This hook is to get the {@link TableContext}.
 * This should be used instead of `React.useContext` because it's more type-safe.
 */
export function useTableContext<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>,
	Selector extends (context: TableContextType<RowType, ColumnType>) => any = (
		context: TableContextType<RowType, ColumnType>
	) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(TableContext, selector);
}

/**
 * Hold dynamic prop values using for Cross-Hovering that are shared through all table components
 */
interface CellHighlightingTableContextType<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	hoveringColumn?: ColumnType;
	setHoveringColumn?: Dispatch<SetStateAction<ColumnType> | undefined>;
}

const CellHighlightingTableContext = createContext<CellHighlightingTableContextType<any, any>>({});

/** @internal */
export const CellHighlightingTableContextProvider = CellHighlightingTableContext.Provider;

/**
 * @internal
 * This hook is to get the {@link CellHighlightingTableContext}.
 * This should be used for performance purpose in CellHighlighting mode
 */
export function useCellHighlightingTableContext<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>,
	Selector extends (context: CellHighlightingTableContextType<RowType, ColumnType>) => any = (
		context: CellHighlightingTableContextType<RowType, ColumnType>
	) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(CellHighlightingTableContext, selector);
}
