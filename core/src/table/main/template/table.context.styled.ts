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

import type { SetStateAction, Dispatch } from "react";
import { useMemo } from "react";

import { createContext, useContextSelector } from "../../../context/index.js";

import type { TableTemplateProps } from "./table.tpl.api.js";

export type StyledTableContextType = {
	rowSegmentType?: TableTemplateProps.RowSegmentType;
	row?: {
		subInfo?: boolean;
		highlighted?: boolean;
		highlightVariant?: TableTemplateProps.TableHighlightVariant;
		selected?: boolean;
		disabled?: boolean;
		noEffect?: boolean;
		interactive?: boolean;
		contextMenuOpen?: boolean;
		setContextMenuOpen?: Dispatch<SetStateAction<boolean>>;
	};
	header?: {
		filterRow?: boolean;
	};
};

export const StyledTableContext = createContext<StyledTableContextType>({});

/** @internal */
export const StyledTableContextProvider = StyledTableContext.Provider;

/** @internal */
export function useStyledTableContext<
	Selector extends (context: StyledTableContextType) => any = (context: StyledTableContextType) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(StyledTableContext, selector);
}

/** @internal */
export function useOptimalTableContextValue(object: Partial<StyledTableContextType>): StyledTableContextType {
	const subInfo = useStyledTableContext((context) => context.row?.subInfo);
	const highlighted = useStyledTableContext((context) => context.row?.highlighted);
	const highlightVariant = useStyledTableContext((context) => context.row?.highlightVariant);
	const selected = useStyledTableContext((context) => context.row?.selected);
	const disabled = useStyledTableContext((context) => context.row?.disabled);
	const noEffect = useStyledTableContext((context) => context.row?.noEffect);
	const interactive = useStyledTableContext((context) => context.row?.interactive);
	const contextMenuOpen = useStyledTableContext((context) => context.row?.contextMenuOpen);
	const setContextMenuOpen = useStyledTableContext((context) => context.row?.setContextMenuOpen);

	const row = useMemo<StyledTableContextType["row"]>(() => {
		return {
			subInfo: object.row?.subInfo ?? subInfo,
			highlighted: object.row?.highlighted ?? highlighted,
			highlightVariant: object.row?.highlightVariant ?? highlightVariant,
			selected: object.row?.selected ?? selected,
			disabled: object.row?.disabled ?? disabled,
			noEffect: object.row?.noEffect ?? noEffect,
			interactive: object.row?.interactive ?? interactive,
			contextMenuOpen: object.row?.contextMenuOpen ?? contextMenuOpen,
			setContextMenuOpen: object.row?.setContextMenuOpen ?? setContextMenuOpen
		};
	}, [
		contextMenuOpen,
		disabled,
		highlightVariant,
		highlighted,
		interactive,
		noEffect,
		selected,
		setContextMenuOpen,
		subInfo,
		object.row?.contextMenuOpen,
		object.row?.disabled,
		object.row?.highlightVariant,
		object.row?.highlighted,
		object.row?.interactive,
		object.row?.noEffect,
		object.row?.selected,
		object.row?.setContextMenuOpen,
		object.row?.subInfo
	]);

	const filterRow = useStyledTableContext((context) => context.header?.filterRow);
	const rowSegmentType = useStyledTableContext((context) => context.rowSegmentType);

	return useMemo<StyledTableContextType>(
		() => ({
			row,
			rowSegmentType: object.rowSegmentType ?? rowSegmentType,
			header: { filterRow: object.header?.filterRow ?? filterRow }
		}),
		[row, object.rowSegmentType, object.header?.filterRow, rowSegmentType, filterRow]
	);
}
