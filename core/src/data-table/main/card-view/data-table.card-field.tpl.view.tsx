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

import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";

/**
 * One label/value pair inside a card. A flex column with a real `gap`, which is why
 * the card layout needs none of the negative-margin correction the table layout's
 * inline card label used to apply against the cell's own padding.
 */
export const StyledDataTableCardField = styled.div.withConfig({ displayName: "StyledDataTableCardField-sc-" })<{
	$subInfo?: boolean;
}>(({ theme, $subInfo }) => {
	const { table } = theme.components;

	return css`
		display: flex;
		flex-direction: column;
		gap: ${table.cardView.field.labelGap};
		min-width: 0;

		${
			$subInfo &&
			css`
				color: ${table.bodyCell.subInfo.color};
			`
		}
	`;
});

/**
 * The column label shown above a field's value, standing in for the `<thead>` the
 * card layout does not render. A real element, not a CSS `::before`, so
 * `ReactNode` / JSX labels display and the label is exposed to assistive technology.
 */
export const StyledDataTableCardFieldLabel = styled.div.withConfig({
	displayName: "StyledDataTableCardFieldLabel-sc-"
})(({ theme }) => {
	const { table } = theme.components;

	return css`
		font-size: ${table.cardView.bodyCell.dataTitleFontSize};
		color: ${table.bodyCell.dataColor};
	`;
});

/** The field's value. Owns word-breaking, alignment and the `<p>` margin reset. */
export const StyledDataTableCardFieldValue = styled.div.withConfig({
	displayName: "StyledDataTableCardFieldValue-sc-"
})<{ $horizontalAlignment?: "left" | "center" | "right" }>(({ $horizontalAlignment }) => {
	const justify =
		$horizontalAlignment === "center" ? "center" : $horizontalAlignment === "right" ? "flex-end" : "flex-start";

	return css`
		display: flex;
		min-width: 0;
		justify-content: ${justify};
		text-align: ${$horizontalAlignment ?? "left"};
		${breakWord}

		// Reset default <p> margins so they don't inflate the field height.
		p {
			&:first-child {
				margin-top: 0;
			}
			&:last-child {
				margin-bottom: 0;
			}
		}
	`;
});

/**
 * Resolved cell-styling result (subset of `CellStyles`) consumed by
 * {@link DataTableCardFieldTpl}.
 */
export interface DataTableCardFieldTplStyles {
	/** Optional class name forwarded to the field. */
	className?: string;

	/** Optional inline style forwarded to the field. */
	style?: CSSProperties;

	/**
	 * Screen-reader-only label injected after the value via {@link HiddenText}.
	 * Renders nothing when omitted.
	 */
	secondaryCellTitle?: string;
}

export interface DataTableCardFieldTplProps {
	/**
	 * The column's label, shown above the value. Supports any `ReactNode`. When
	 * omitted the field renders its value alone.
	 */
	cellLabel?: ReactNode;

	/** Resolved horizontal alignment for the value. */
	horizontalAlignment?: "left" | "center" | "right";

	/**
	 * Whether this field belongs to a sub-info column (secondary text color).
	 * Also enabled when consumer cell styling sets `useSecondaryColor`.
	 */
	subInfo?: boolean;

	/** Whether this field belongs to an action column (inline layout, no label). */
	actionColumn?: boolean;

	/** Resolved cell-styling result for this field. */
	cellStyles?: DataTableCardFieldTplStyles;

	/**
	 * Sanitized consumer-provided `htmlAttributes` from `column.htmlAttributes`
	 * (framework-owned keys already stripped by the orchestrator).
	 */
	htmlAttributes?: HTMLAttributes<HTMLDivElement>;

	/** The field's value content. */
	children?: ReactNode;
}

/**
 * DataTable card-view cell: one field of a card, stacking the column label above
 * the value.
 *
 * The card-layout counterpart of `DataTableBodyCellTpl`, and deliberately much
 * smaller: with no table layout to participate in there is no pinning, no
 * `colSpan`, no `vertical-align`, no fixed-height clamp and no `role` override to
 * resolve — a field is a plain `<div>` inside a `listitem`.
 *
 * It keeps `data-role="table-body-cell"` so cell selectors resolve in both layouts.
 *
 * @experimental
 */
export function DataTableCardFieldTpl({
	cellLabel,
	horizontalAlignment,
	subInfo,
	actionColumn,
	cellStyles,
	htmlAttributes,
	children
}: DataTableCardFieldTplProps): ReactElement {
	return (
		<StyledDataTableCardField
			{...htmlAttributes}
			data-role={DataRoles.Table.Body.Cell}
			className={cellStyles?.className}
			style={cellStyles?.style}
			$subInfo={!!subInfo}
		>
			{!actionColumn && cellLabel ? (
				<StyledDataTableCardFieldLabel data-role={DataRoles.Table.Body.Cell.CardLabel}>
					{cellLabel}
					<HiddenText>, </HiddenText>
				</StyledDataTableCardFieldLabel>
			) : null}
			<StyledDataTableCardFieldValue $horizontalAlignment={horizontalAlignment}>
				{children}
				{cellStyles?.secondaryCellTitle ? <HiddenText>{cellStyles.secondaryCellTitle}</HiddenText> : null}
			</StyledDataTableCardFieldValue>
		</StyledDataTableCardField>
	);
}

DataTableCardFieldTpl.displayName = "DataTableCardFieldTpl";
