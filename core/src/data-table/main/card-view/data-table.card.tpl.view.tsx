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

import type {
	CSSProperties,
	FocusEventHandler,
	HTMLAttributes,
	KeyboardEventHandler,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	Ref
} from "react";
import { useContext } from "react";
import { css, styled } from "styled-components";

import { A11YLanguageContext, HiddenText } from "../../../common/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";
import { useDataTableRowInteraction } from "../template/data-table.row-interaction.js";
import { parseBorder } from "../template/data-table.styled-utils.js";

/**
 * Compose a card's `box-shadow` from its resting elevation plus, optionally, an
 * interactive-state ring and the selected left accent.
 *
 * A card is one box, so both the state border and the selection accent are single
 * inset shadows on that box — the table layout's per-`<td>` shadow composition
 * (`composeCellShadow`) exists only because a `<tr>` cannot paint a border across
 * sticky pinned cells, and none of that applies here. The accent is listed before
 * the ring so it stays visible on the left edge when both are drawn.
 */
const composeCardShadow = (params: {
	resting: string;
	stateBorder?: string;
	accent?: { border: string; color?: string };
}): string => {
	const shadows: string[] = [];

	if (params.accent) {
		const parsed = parseBorder(params.accent.border);
		shadows.push(`inset ${parsed.width} 0 0 0 ${params.accent.color ?? parsed.color}`);
	}

	if (params.stateBorder) {
		const { width, color } = parseBorder(params.stateBorder);
		shadows.push(`inset 0 0 0 ${width} ${color}`);
	}

	shadows.push(params.resting);

	return shadows.join(", ");
};

export const StyledDataTableCard = styled.div.withConfig({ displayName: "StyledDataTableCard-sc-" })<{
	$selected?: boolean;
	$highlightVariant?: "success" | "info";
	$highlighted?: boolean;
	$disabled?: boolean;
	$interactive?: boolean;
}>(({ theme, $selected, $highlightVariant, $highlighted, $disabled, $interactive }) => {
	const { table } = theme.components;
	const { bodyRow, bodyRowDnD, cardView } = table;
	const resting = cardView.bodyRow.boxShadow;

	return css`
		position: relative;
		box-sizing: border-box;
		width: ${cardView.bodyRow.width};
		display: flex;
		flex-direction: column;
		gap: ${cardView.card.fieldGap};
		padding: ${cardView.card.padding};
		border-radius: ${cardView.bodyRow.borderRadius};
		background: ${bodyRow.background};
		box-shadow: ${resting};
		outline: none;

		/* Grab cursor for draggable cards (grabbing while a drag is held). The
		 * attribute selector outranks the $interactive \`cursor: pointer\` below. */
		&[draggable="true"] {
			cursor: grab;
		}
		&[draggable="true"]:active {
			cursor: grabbing;
		}

		${
			!$interactive &&
			!$disabled &&
			css`
				${hover(css`
					background: ${bodyRow.nonInteractive.hoverBG};
				`)}
				${active(css`
					background: ${bodyRow.nonInteractive.activeBG};
				`)}
				/* Focus background for non-interactive cards only. Interactive ones show the
			 * focus *ring* instead (below) and keep their selected / highlighted
			 * background — its higher \`:focus\` specificity would otherwise override
			 * those backgrounds when focused. */
				&:focus {
					background: ${bodyRow.nonInteractive.focusBG};
				}
			`
		}

		${
			$interactive &&
			!$disabled &&
			css`
				cursor: pointer;
				/* Interactive cards show hover/active/focus as a ring only, leaving the
			 * background untouched so a selected / highlighted card's tint stays
			 * visible while hovered. The ring is keyed off \`:focus\` (not
			 * \`:focus-visible\`) because the card is the focus unit — a roving
			 * \`tabIndex\` lands on it from both keyboard nav and pointer click.
			 *
			 * On a selected card the accent is tinted to the current state's color
			 * (keeping its thicker selected width) so the whole ring reads as one
			 * color rather than mixing with the selection blue. */
				${hover(css`
					box-shadow: ${composeCardShadow({
						resting,
						stateBorder: bodyRow.interactive.hoverBorder,
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.hoverBorderColor }
							: undefined
					})};
				`)}
				${active(css`
					box-shadow: ${composeCardShadow({
						resting,
						stateBorder: bodyRow.interactive.activeBorder,
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.activeBorderColor }
							: undefined
					})};
				`)}
				&:focus {
					box-shadow: ${composeCardShadow({
						resting,
						stateBorder: bodyRow.interactive.focusBorder,
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.focusBorderColor }
							: undefined
					})};
				}
			`
		}

		${
			$selected &&
			css`
				background: ${bodyRow.selected.background};
				box-shadow: ${composeCardShadow({ resting, accent: { border: bodyRow.selected.borderLeft } })};
			`
		}

		${
			!$highlightVariant &&
			$highlighted &&
			css`
				background: ${bodyRow.highlightedBG};
			`
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
			$disabled &&
			css`
				background: ${bodyRow.disabled.background};
				color: ${bodyRow.disabled.color};
				pointer-events: none;
			`
		}

		/* Drag drop slot: the dragged card keeps its box and rides into the projected
		 * gap (\`data-drop-slot\`, set imperatively by the DnD monitor). A dashed
		 * \`outline\` — layout-neutral, so it adds no size shift — draws the placeholder
		 * rectangle, and a negative \`outline-offset\` insets it so it stays inside the
		 * card's own box. The content is hidden so the slot reads as empty; the
		 * floating preview stands in for the card itself. */
		&[data-drop-slot] {
			background: none;
			box-shadow: none;
			color: transparent;
			outline: ${bodyRowDnD.slot.border};
			outline-offset: ${bodyRowDnD.slot.offset};
		}
		&[data-drop-slot] > * {
			visibility: hidden;
		}
	`;
});

/**
 * Host for the optional per-row overlay slot, covering the whole card. The table
 * layout has to render this as an absolutely-positioned `<td>` so it consumes no
 * column; here it is simply an absolutely-positioned child of the (already
 * `position: relative`) card.
 */
export const StyledDataTableCardOverlay = styled.div.withConfig({
	displayName: "StyledDataTableCardOverlay-sc-"
})`
	position: absolute;
	inset: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;

	/* Re-enable interaction for the consumer's overlay content (a busy veil that
	   should block clicks sets its own \`pointer-events\`). */
	> * {
		pointer-events: auto;
	}
`;

/**
 * Subset of `RowStyles` applied to the card DOM. Selection / interactivity /
 * disabled variants are passed separately as transient flags.
 */
export interface DataTableCardTplStyles {
	/** Optional class name forwarded to the card. */
	className?: string;

	/** Optional inline style forwarded to the card. */
	style?: CSSProperties;

	/** Optional `title` attribute (browser-native tooltip). */
	title?: string;
}

/**
 * Props accepted by {@link DataTableCardTpl}.
 *
 * @experimental
 */
export interface DataTableCardTplProps {
	/**
	 * Visual styling forwarded to the card (`className`, `style`, `title`).
	 * Selection / interactivity / disabled flags are passed separately.
	 */
	styles?: DataTableCardTplStyles;

	/**
	 * Zero-based data index, driving the roving `tabIndex` for card-level
	 * arrow-key navigation. Omit it and the card falls back to the static
	 * `interactive ? 0 : -1` tab stop.
	 */
	rowIndex?: number;

	/** Whether the card is selected — drives `$selected` and the announced card state. */
	selected?: boolean;

	/** Variant highlight color — drives `$highlightVariant` and the announced card state. */
	highlightVariant?: "success" | "info";

	/** Whether the card is visually highlighted — drives `$highlighted` as a fallback. */
	highlighted?: boolean;

	/** Whether the card is disabled — drives `$disabled` and the announced card state. */
	disabled?: boolean;

	/** Whether the card reacts to user interaction (hover/active/focus). */
	interactive?: boolean;

	/**
	 * Expansion state of an expandable card: `true` when its additional content is
	 * showing, `false` when it is collapsible but collapsed, `undefined` when the card
	 * cannot expand. Announced as part of the card state (see {@link DataTableCardTpl}).
	 */
	ariaExpanded?: boolean;

	/** Inline style overrides from a windowed body, merged on top of `styles?.style`. */
	virtualStyle?: CSSProperties;

	/** Optional `id` attribute forwarded to the card. */
	id?: string;

	/**
	 * `tabIndex` forwarded to the card. Defaults to `0` for interactive enabled
	 * cards, `-1` for non-interactive enabled cards, omitted for disabled cards.
	 */
	tabIndex?: number;

	/** Click handler — forwarded to the card. */
	onClick?: MouseEventHandler<HTMLDivElement>;

	/**
	 * Keydown handler on the card. Pressing Enter on the card triggers `onClick`
	 * before delegating to this callback.
	 */
	onKeyDown?: KeyboardEventHandler<HTMLDivElement>;

	/** Focus handler — forwarded as-is to the card. */
	onFocus?: FocusEventHandler<HTMLDivElement>;

	/** Blur handler — forwarded as-is to the card. */
	onBlur?: FocusEventHandler<HTMLDivElement>;

	/** Context-menu handler — forwarded as-is to the card. */
	onContextMenu?: MouseEventHandler<HTMLDivElement>;

	/** `mouseover` handler — forwarded as-is (DnD preview wiring). */
	onMouseOver?: MouseEventHandler<HTMLElement>;

	/** Additional HTML attributes spread onto the card. */
	htmlAttributes?: HTMLAttributes<HTMLDivElement>;

	/** Ref to the underlying card element. */
	forwardedRef?: Ref<HTMLDivElement>;

	/** The card's fields. */
	children?: ReactNode;
}

/**
 * Builds the card's screen-reader state prefix.
 *
 * The table layout can put this state in ARIA: `<tr>` maps to `role="row"`, which
 * supports `aria-selected` and `aria-expanded`, and its first cell carries a badge
 * (with a `title`) for the disabled / success / info states. A card is a
 * `role="listitem"` — a structure role that supports *none* of `aria-selected`,
 * `aria-disabled` or `aria-expanded`, so assistive technology drops them, and card
 * view renders no badge cell either. Emitting the attributes anyway announced
 * nothing; conveying the state properly through ARIA instead would mean claiming a
 * widget role the card is not (`option` inside a `listbox` makes selection the list's
 * purpose and forbids the action buttons a card may hold; `button` on the card is not
 * a valid `list` child).
 *
 * So the state is announced as text, which is what the production `Table` already
 * does for selection and row highlighting (`selectedRowTitles` / `successRowTitles`
 * in a `HiddenText`). Labels come from `A11YLanguageContext` (localized en/de) with
 * English fallbacks, and each part is trimmed of the trailing separators some of
 * those legacy label strings carry so the joined result reads as one list.
 */
function useCardStateText(params: {
	selected?: boolean;
	disabled?: boolean;
	highlightVariant?: "success" | "info";
	ariaExpanded?: boolean;
}): string {
	const { selected, disabled, highlightVariant, ariaExpanded } = params;
	const { tableTitles } = useContext(A11YLanguageContext);
	const parts: string[] = [];

	if (selected) {
		parts.push(tableTitles?.selectedRowTitles ?? "Selected row");
	}

	if (ariaExpanded === true) {
		parts.push(tableTitles?.rowExpandedLabel ?? "Expanded");
	} else if (ariaExpanded === false) {
		parts.push(tableTitles?.rowCollapsedLabel ?? "Collapsed");
	}

	if (disabled) {
		parts.push(tableTitles?.rowDisabledBadgeLabel ?? "Disabled");
	}

	if (highlightVariant === "success") {
		parts.push(tableTitles?.rowSuccessBadgeLabel ?? "Success");
	} else if (highlightVariant === "info") {
		parts.push(tableTitles?.rowInfoBadgeLabel ?? "Info");
	}

	return parts
		.map((part) => part.trim().replace(/,$/, ""))
		.filter(Boolean)
		.join(", ");
}

/**
 * DataTable card-view row: one `role="listitem"` card stacking its fields
 * vertically. The card-layout counterpart of `DataTableBodyRowTpl`, owning the same
 * `selected` / `highlightVariant` / `highlighted` / `disabled` / `interactive`
 * variants and the same focus/keyboard contract (shared via
 * `useDataTableRowInteraction`), but painting them on a single box.
 *
 * Row state that the table layout puts in `aria-selected` / `aria-expanded` (and in
 * its first cell's badge) is announced here as a screen-reader-only prefix instead —
 * see {@link useCardStateText} for why a `listitem` cannot carry it as ARIA.
 *
 * It keeps `data-role="table-body-row"` so row selectors resolve in both layouts.
 *
 * Two things the table layout needs are deliberately absent: a fixed row height
 * (cards must grow to their stacked content — the `rowHeight` prop is documented as
 * having no effect in card view) and column pinning (there is no column axis).
 *
 * @experimental
 */
export function DataTableCardTpl({
	styles,
	rowIndex,
	selected,
	highlightVariant,
	highlighted,
	disabled,
	interactive,
	ariaExpanded,
	virtualStyle,
	id,
	tabIndex,
	onClick,
	onKeyDown,
	onFocus,
	onBlur,
	onContextMenu,
	onMouseOver,
	htmlAttributes,
	forwardedRef,
	children
}: DataTableCardTplProps): ReactElement {
	const interaction = useDataTableRowInteraction<HTMLDivElement>({
		rowIndex,
		disabled,
		interactive,
		tabIndex,
		onClick,
		onKeyDown,
		onFocus,
		htmlAttributes
	});
	const mergedStyle: CSSProperties | undefined = virtualStyle ? { ...styles?.style, ...virtualStyle } : styles?.style;
	const stateText = useCardStateText({ selected, disabled, highlightVariant, ariaExpanded });

	return (
		<StyledDataTableCard
			{...htmlAttributes}
			ref={forwardedRef}
			data-role={DataRoles.Table.Body.Row}
			data-interactive={interactive || undefined}
			role="listitem"
			id={id}
			className={styles?.className}
			style={mergedStyle}
			title={styles?.title}
			tabIndex={interaction.tabIndex}
			// Row state as data attributes, not ARIA: a `listitem` supports neither
			// `aria-selected`/`aria-disabled` nor `aria-expanded` (see `useCardStateText`,
			// which announces the same state as text). These keep the state queryable for
			// consumer tests and CSS, mirroring `data-interactive` above.
			data-selected={selected || undefined}
			data-disabled={disabled || undefined}
			data-expanded={ariaExpanded}
			$selected={!!selected}
			$highlightVariant={highlightVariant}
			$highlighted={!!highlighted}
			$disabled={!!disabled}
			$interactive={!!interactive}
			onClick={disabled ? undefined : onClick}
			onKeyDown={interaction.onKeyDown}
			onFocus={interaction.onFocus}
			onBlur={onBlur}
			onContextMenu={onContextMenu}
			onMouseOver={onMouseOver}
		>
			{stateText ? <HiddenText>{stateText}</HiddenText> : null}
			{children}
		</StyledDataTableCard>
	);
}

DataTableCardTpl.displayName = "DataTableCardTpl";
