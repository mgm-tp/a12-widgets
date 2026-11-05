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

import type { FocusEventHandler, ReactElement, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useDataTableContext } from "../data-table.context.js";

import { composeCellShadow } from "./data-table.styled-utils.js";

/**
 * Expanded-content row spanning all columns via a single `<td colSpan>` so the
 * inner content is free-form. Adopts the parent row's selected / highlightVariant
 * styling when those flags are forwarded.
 */
export const StyledDataTableExpandableRow = styled.tr.withConfig({ displayName: "StyledDataTableExpandableRow-sc-" })<{
	$selected?: boolean;
	$highlightVariant?: "success" | "info";
}>(({ theme, $selected, $highlightVariant }) => {
	const { bodyRow } = theme.components.table;

	return css`
		background: ${bodyRow.background};
		outline: none;

		> td {
			padding: 0;
			border-bottom: ${bodyRow.borderBottom};
		}

		${
			$highlightVariant === "info" &&
			css`
				background: ${bodyRow.infoBG};
			`
		}

		${
			$highlightVariant === "success" &&
			css`
				background: ${bodyRow.successBG};
			`
		}

		${
			$selected &&
			css`
				background: ${bodyRow.selected.background};

				/* The table uses \`border-collapse: separate\`, under which borders on
			 * \`<tr>\` are ignored — paint the selected left accent as an inset
			 * shadow on the spanning cell instead (same technique as the body row). */
				> td {
					box-shadow: ${composeCellShadow({ accent: { border: bodyRow.selected.borderLeft } })};
				}
			`
		}
	`;
});

const StyledDataTableExpandableRowContent = styled.div.withConfig({
	displayName: "StyledDataTableExpandableRowContent-sc-"
})`
	position: sticky;
	inset-inline-start: 0;
	box-sizing: border-box;
	max-width: 100%;
`;

/**
 * Holds `element` at the scroll viewport's visible width. Sticky cannot be pushed past
 * its containing block's edge, so any excess over `clientWidth` becomes drift at the
 * end of the scroll range.
 */
function useVisibleWidth(elementRef: { current: HTMLDivElement | null }): void {
	useLayoutEffect(() => {
		const element = elementRef.current;
		const viewport = element?.closest(`[data-role="${DataRoles.Table.Viewport}"]`);

		if (!element || !viewport) {
			return;
		}

		const measure = (): void => {
			element.style.width = `${viewport.clientWidth}px`;
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(viewport);

		return (): void => observer.disconnect();
	}, [elementRef]);
}

/**
 * Props accepted by {@link DataTableExpandableRowTpl}.
 */
export interface DataTableExpandableRowTplProps {
	/** Expanded content, rendered inside the grid-spanning `<tr>`. */
	children?: ReactNode;

	/**
	 * Whether the row is visually selected — drives a selected background and
	 * left-edge accent. Typically forwarded from the parent body row's selection.
	 */
	selected?: boolean;

	/** Variant highlight color matching the body-row variants. */
	highlightVariant?: "success" | "info";

	/** Auto-focus the expanded row after mount (the `<tr>` gets `tabIndex={-1}`). */
	focusOnMount?: boolean;

	/** Blur handler forwarded to the `<tr>`. */
	onBlur?: FocusEventHandler<HTMLTableRowElement>;

	/** Focus handler forwarded to the `<tr>`. */
	onFocus?: FocusEventHandler<HTMLTableRowElement>;
}

/**
 * DataTable expanded `<tr>` (a single `<td colSpan>` spanning all columns) wrapping
 * the expanded content of a body row, with `selected` / `highlightVariant` /
 * `focusOnMount` props.
 *
 * @experimental
 */
export function DataTableExpandableRowTpl({
	children,
	selected,
	highlightVariant,
	focusOnMount,
	onBlur,
	onFocus
}: DataTableExpandableRowTplProps): ReactElement {
	const expandedRowRef = useRef<HTMLTableRowElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const gridRole = useDataTableContext().gridRole;
	const leafCount = useDataTableContext().leafPinning.length || 1;

	useVisibleWidth(contentRef);

	useEffect(() => {
		if (focusOnMount) {
			expandedRowRef.current?.focus();
		}
	}, [focusOnMount]);

	// (tree)grid mode overrides the table role, dropping the native `<tr>`/`<td>`
	// mappings — restate them so the expanded row keeps its semantics.
	const rowRole = gridRole ? "row" : undefined;

	return (
		<StyledDataTableExpandableRow
			data-role={DataRoles.Table.Expandable.Row}
			role={rowRole}
			ref={expandedRowRef}
			tabIndex={focusOnMount ? -1 : undefined}
			aria-selected={selected || undefined}
			$selected={!!selected}
			$highlightVariant={highlightVariant}
			onBlur={onBlur}
			onFocus={onFocus}
		>
			<td colSpan={leafCount} role={gridRole ? "gridcell" : undefined}>
				<StyledDataTableExpandableRowContent ref={contentRef}>{children}</StyledDataTableExpandableRowContent>
			</td>
		</StyledDataTableExpandableRow>
	);
}

DataTableExpandableRowTpl.displayName = "DataTableExpandableRowTpl";
