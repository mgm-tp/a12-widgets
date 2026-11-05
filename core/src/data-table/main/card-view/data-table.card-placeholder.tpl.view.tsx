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

import type { CSSProperties, ReactElement, ReactNode } from "react";
import type { DefaultTheme } from "styled-components";
import { css, keyframes, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

const shimmer = keyframes`
	0% {
		background-position: 100% 0;
	}
	100% {
		background-position: -100% 0;
	}
`;

/** Shared card box for both placeholder variants — the same geometry as a real card. */
const placeholderCardBase = (theme: DefaultTheme): ReturnType<typeof css> => {
	const { cardView } = theme.components.table;

	return css`
		box-sizing: border-box;
		width: ${cardView.bodyRow.width};
		border-radius: ${cardView.bodyRow.borderRadius};
		padding: ${cardView.card.padding};
		box-shadow: ${cardView.bodyRow.boxShadow};
	`;
};

/**
 * Loading placeholder card, rendered while windowed (virtual / infinite-scroll) data
 * is still being fetched. Uses the same subtle gradient sweep as the table layout's
 * placeholder row to communicate "loading".
 */
export const StyledDataTableCardPlaceholder = styled.div.withConfig({
	displayName: "StyledDataTableCardPlaceholder-sc-"
})(({ theme }) => {
	const { table } = theme.components;

	return css`
		${placeholderCardBase(theme)}
		display: flex;
		flex-direction: column;
		gap: ${table.cardView.card.fieldGap};
		background: linear-gradient(
			90deg,
			${table.bodyRow.background} 0%,
			${table.header.background} 50%,
			${table.bodyRow.background} 100%
		);
		background-size: 200% 100%;
		animation: ${shimmer} 1.4s ease-in-out infinite;
		pointer-events: none;
	`;
});

/** Empty-state card — the "No data" message, centered in a single card. */
export const StyledDataTableCardEmptyState = styled.div.withConfig({
	displayName: "StyledDataTableCardEmptyState-sc-"
})(({ theme }) => {
	const { table } = theme.components;

	return css`
		${placeholderCardBase(theme)}
		background: ${table.bodyRow.background};
		text-align: center;
	`;
});

/**
 * Props accepted by {@link DataTableCardPlaceholderTpl}.
 */
export interface DataTableCardPlaceholderTplProps {
	/** Inline style overrides for the loading variant (windowed positioning). */
	virtualStyle?: CSSProperties;

	/**
	 * Presence selects the empty-state variant (a single card holding the label);
	 * when omitted the shimmering loading variant renders `children` as its fields.
	 *
	 * Named for parity with the table layout's placeholder row, where the value is
	 * the `<td>`'s `colSpan`. A card has no columns to span, so the count itself is
	 * unused — only whether it was supplied.
	 */
	columnCount?: number;

	/** The empty-state label, or the per-column placeholder fields. */
	children?: ReactNode;
}

/**
 * DataTable card-view placeholder, in two variants mirroring the table layout's
 * placeholder row:
 *
 * - Loading (`columnCount` omitted) — a shimmering card with `aria-busy="true"`
 *   whose `children` are the per-column placeholder fields.
 * - Empty state (`columnCount` set) — a single card containing the label.
 *
 * Both render as `role="listitem"`: they are the card list's only children in those
 * states, and a `role="list"` may not hold a non-`listitem` child.
 *
 * @experimental
 */
export function DataTableCardPlaceholderTpl({
	virtualStyle,
	columnCount,
	children
}: DataTableCardPlaceholderTplProps): ReactElement {
	if (columnCount === undefined) {
		return (
			<StyledDataTableCardPlaceholder
				data-role={DataRoles.Table.Body.Content.Placeholder}
				role="listitem"
				style={virtualStyle}
				aria-busy="true"
			>
				{children}
			</StyledDataTableCardPlaceholder>
		);
	}

	return (
		<StyledDataTableCardEmptyState data-role={DataRoles.Table.Body.Row} role="listitem">
			<span data-role={DataRoles.Table.Body.Content.Placeholder}>{children}</span>
		</StyledDataTableCardEmptyState>
	);
}

DataTableCardPlaceholderTpl.displayName = "DataTableCardPlaceholderTpl";

/**
 * One field's worth of placeholder content inside a loading card — the card-layout
 * counterpart of the placeholder `<td>`. Layout only; the shimmer bar itself comes
 * from the `placeholderContent` slot.
 *
 * @experimental
 */
export function DataTableCardPlaceholderFieldTpl({ children }: { children?: ReactNode }): ReactElement {
	return <div data-role={DataRoles.Table.Body.Cell}>{children}</div>;
}

DataTableCardPlaceholderFieldTpl.displayName = "DataTableCardPlaceholderFieldTpl";
