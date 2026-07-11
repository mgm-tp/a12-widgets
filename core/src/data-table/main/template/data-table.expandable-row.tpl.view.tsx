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
import { useEffect, useRef } from "react";
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
	const { table } = theme.components;
	const { bodyRow } = table;

	return css`
		background: ${bodyRow.background};
		outline: none;

		> td {
			padding: ${table.bodyCell.padding};
			border-bottom: ${bodyRow.borderBottom};
		}

		${$highlightVariant === "info" &&
		css`
			background: ${bodyRow.infoBG};
		`}

		${$highlightVariant === "success" &&
		css`
			background: ${bodyRow.successBG};
		`}

		${$selected &&
		css`
			background: ${bodyRow.selected.background};

			/* The table uses \`border-collapse: separate\`, under which borders on
			 * \`<tr>\` are ignored — paint the selected left accent as an inset
			 * shadow on the spanning cell instead (same technique as the body row). */
			> td {
				box-shadow: ${composeCellShadow({ accent: { border: bodyRow.selected.borderLeft } })};
			}
		`}
	`;
});

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
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const leafCount = useDataTableContext((ctx) => ctx.leafPinning.length) || 1;

	useEffect(() => {
		if (focusOnMount) {
			expandedRowRef.current?.focus();
		}
	}, [focusOnMount]);

	return (
		<StyledDataTableExpandableRow
			data-role={DataRoles.Table.Expandable.Row}
			role={cardView ? "presentation" : undefined}
			ref={expandedRowRef}
			tabIndex={focusOnMount ? -1 : undefined}
			aria-selected={selected || undefined}
			$selected={!!selected}
			$highlightVariant={highlightVariant}
			onBlur={onBlur}
			onFocus={onFocus}
		>
			<td colSpan={leafCount}>{children}</td>
		</StyledDataTableExpandableRow>
	);
}

DataTableExpandableRowTpl.displayName = "DataTableExpandableRowTpl";
