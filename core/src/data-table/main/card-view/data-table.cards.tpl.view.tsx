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

import type { CSSProperties, FocusEvent, HTMLProps, ReactElement, ReactNode, Ref } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { baseClassName } from "../template/data-table.styled-utils.js";

/**
 * Scroll viewport for the card layout. Mirrors the table layout's viewport, minus
 * the horizontal scroller: cards stack to the viewport's width and their fields
 * wrap, so there is no column axis to scroll and `overflow-x` stays hidden rather
 * than exposing a scrollbar that could never be used.
 */
export const StyledDataTableCardsViewport = styled.div.withConfig({
	displayName: "StyledDataTableCardsViewport-sc-"
})<{ $maxHeight?: number | string }>(({ theme, $maxHeight }) => {
	const { table } = theme.components;
	const maxHeightValue = typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;

	return css`
		position: relative;
		display: block;
		height: 100%;
		max-height: ${maxHeightValue ?? "100%"};
		overflow-x: hidden;
		overflow-y: auto;
		border: ${table.body.border};
		/* The same surface the table layout's viewport paints, which is also what the
		 * production \`Table\` puts behind its cards — deliberately not a contrasting
		 * backdrop, so switching a table to \`cardView\` changes no surface color. */
		background: ${table.bodyRow.background};
		width: 100%;
		isolation: isolate;
	`;
});

/**
 * Card-layout root — the card view's counterpart to the `<table>` element, and the
 * element carrying `data-role="table"` plus `data-card-view="true"`. Owns only the
 * inherited typography; the stack itself is the card list inside it.
 */
export const StyledDataTableCards = styled.div.attrs({ className: baseClassName }).withConfig({
	displayName: "StyledDataTableCards-sc-"
})(({ theme }) => {
	const { table } = theme.components;

	return css`
		display: block;
		width: 100%;
		font-family: ${table.bodyCell.fontFamily};
		font-size: ${table.cardView.bodyCell.fontSize};
		color: ${table.color};
	`;
});

export interface DataTableCardsTplProps {
	/**
	 * Max-height on the viewport. Defaults to `100%` (fits a bounded parent,
	 * scrolls vertically on overflow); pass a value to cap the height directly.
	 */
	maxHeight?: number | string;

	/** `aria-label` applied to both the viewport region and the card root. */
	ariaLabel?: string;

	/** `aria-labelledby` applied to both the viewport region and the card root. */
	ariaLabelledby?: string;

	/** `aria-hidden` for the card root. */
	ariaHidden?: boolean;

	/**
	 * Additional props spread onto the card root. Framework-owned attributes
	 * (refs, `data-*` flags, aria wiring) win over entries here.
	 */
	domProps?: HTMLProps<HTMLElement>;

	/** `id` for the viewport element. */
	id?: string;

	/**
	 * `data-role` for the viewport element. Defaults to
	 * {@link DataRoles.Table.Viewport}.
	 */
	dataRole?: string;

	/** `className` for the card root. */
	className?: string;

	/** Inline style for the card root. */
	style?: CSSProperties;

	/** Forwarded ref to the viewport `<div>` (scroll-element wiring). */
	viewportRef?: Ref<HTMLDivElement>;

	/**
	 * Forwarded ref to the card root. Declared as a plain callback rather than
	 * `Ref<HTMLDivElement>` so the orchestrator's element-agnostic ref channel
	 * (`HTMLElement`) attaches without a cast.
	 */
	rootRef?: (node: HTMLElement | null) => void;

	/** `onBlur` forwarded to the card root. */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/** The card list. Card view draws no header or footer, so this is its only child. */
	children?: ReactNode;
}

/**
 * DataTable card-view root: a scrollable viewport wrapping the card stack.
 *
 * This is the card layout's replacement for `DataTableTpl`, not a variant of it —
 * the two are mutually exclusive and share no CSS. Because the card layout never
 * builds a `<table>`, none of the table-layout machinery has to be neutralized
 * here: there is no `<colgroup>` to hide, no `table-layout: fixed` to override, no
 * sticky `<thead>` to suppress and no `position: sticky` column pinning to reset.
 *
 * `data-card-view="true"` and `data-role="table"` both stay on this root so
 * selectors and tests written against the table layout keep resolving when the
 * same `DataTable` switches to `cardView`.
 *
 * @experimental
 */
export function DataTableCardsTpl({
	maxHeight,
	ariaLabel,
	ariaLabelledby,
	ariaHidden,
	domProps,
	id,
	dataRole,
	className,
	style,
	viewportRef,
	rootRef,
	onBlur,
	children
}: DataTableCardsTplProps): ReactElement {
	return (
		<StyledDataTableCardsViewport
			ref={viewportRef}
			id={id}
			$maxHeight={maxHeight}
			data-role={dataRole ?? DataRoles.Table.Viewport}
			// Only expose the scroll container as a landmark region when it has an
			// accessible name — an unnamed `role="region"` is a landmark-name violation
			// and adds landmark noise. The name lives on the card root regardless.
			role={ariaLabel || ariaLabelledby ? "region" : undefined}
			aria-label={ariaLabel || ariaLabelledby ? ariaLabel : undefined}
			aria-labelledby={ariaLabel || ariaLabelledby ? ariaLabelledby : undefined}
		>
			<StyledDataTableCards
				{...domProps}
				ref={rootRef}
				className={className}
				style={style}
				data-role={DataRoles.Table}
				data-card-view="true"
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-hidden={ariaHidden}
				onBlur={onBlur}
			>
				{children}
			</StyledDataTableCards>
		</StyledDataTableCardsViewport>
	);
}

DataTableCardsTpl.displayName = "DataTableCardsTpl";
