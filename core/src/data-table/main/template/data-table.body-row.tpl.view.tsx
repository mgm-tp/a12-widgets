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
import { Key } from "ts-key-enum";
import { darken } from "polished";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";

import { useDataTableContext } from "../data-table.context.js";

import { composeCellShadow } from "./data-table.styled-utils.js";

/**
 * Box-shadow rules painting one interactive row state (hover/active/focus) on
 * every cell via {@link composeCellShadow}: the state border on all cells,
 * left/right edges on the first/last cells, and pinned-edge variants that
 * additionally layer the column-separator shadow.
 */
const stateShadowRules = (params: {
	stateBorder: string;
	accent?: { border: string; color?: string };
	pinned: { leftColumn: { boxShadow: string }; rightColumn: { boxShadow: string } };
}): ReturnType<typeof css> => {
	const { stateBorder, accent, pinned } = params;

	return css`
		> td {
			box-shadow: ${composeCellShadow({ stateBorder })};
		}
		> td:first-child {
			box-shadow: ${composeCellShadow({ stateBorder, stateEdge: "left", accent })};
		}
		> td:last-child {
			box-shadow: ${composeCellShadow({ stateBorder, stateEdge: "right" })};
		}
		> td[data-pinned-edge="left"] {
			box-shadow: ${composeCellShadow({ stateBorder, separatorShadow: pinned.leftColumn.boxShadow })};
		}
		> td[data-pinned-edge="left"]:first-child {
			box-shadow: ${composeCellShadow({
				stateBorder,
				stateEdge: "left",
				accent,
				separatorShadow: pinned.leftColumn.boxShadow
			})};
		}
		> td[data-pinned-edge="right"] {
			box-shadow: ${composeCellShadow({ stateBorder, separatorShadow: pinned.rightColumn.boxShadow })};
		}
		> td[data-pinned-edge="right"]:last-child {
			box-shadow: ${composeCellShadow({
				stateBorder,
				stateEdge: "right",
				separatorShadow: pinned.rightColumn.boxShadow
			})};
		}
	`;
};

export const StyledDataTableBodyRow = styled.tr.withConfig({ displayName: "StyledDataTableBodyRow-sc-" })<{
	$selected?: boolean;
	$highlightVariant?: "success" | "info";
	$highlighted?: boolean;
	$disabled?: boolean;
	$interactive?: boolean;
	$cellHighlighting?: boolean;
	$crossTabulation?: boolean;
}>(
	({
		theme,
		$selected,
		$highlightVariant,
		$highlighted,
		$disabled,
		$interactive,
		$cellHighlighting,
		$crossTabulation
	}) => {
		const { table } = theme.components;
		const { bodyRow, pinned, header } = table;
		// Tree-table reparent (AS_CHILD) drop-target wash, keyed off `data-drop-target`
		// set by the DataTreeTable DnD wrapper. Inert for the flat DataTable.
		const treeNode = theme.components.treeTable.node;

		return css`
			position: relative;
			outline: none;

			/* Move cursor for draggable rows. The attribute selector outranks the
			 * $interactive \`cursor: pointer\` below. */
			&[draggable="true"] {
				cursor: move;
			}

			/* No \`::before\`/\`::after\` row overlays: generated content on a
			 * \`display: table-row\` gets wrapped in an anonymous table cell that
			 * consumes a real column, mis-aligning every body \`<td>\` against the
			 * header. All row-state visuals (hover/active/focus borders, selected
			 * left accent, focus ring) are painted on the cells via
			 * \`composeCellShadow\` box-shadows instead. */

			${!$interactive &&
			!$disabled &&
			!($cellHighlighting && $crossTabulation) &&
			css`
				${hover(css`
					> td {
						background: ${bodyRow.nonInteractive.hoverBG};
					}
				`)}
				${active(css`
					> td {
						background: ${bodyRow.nonInteractive.activeBG};
					}
				`)}
				/* Focus background for non-interactive rows only. Interactive rows
				 * show the focus *ring* instead (below) and keep their selected /
				 * highlighted background — its higher \`:focus\` specificity would
				 * otherwise override those backgrounds when focused. */
				&:focus > td {
					background: ${bodyRow.nonInteractive.focusBG};
				}
			`}

			${$interactive &&
			!$disabled &&
			css`
				cursor: pointer;
				/* Interactive rows show hover/active as the state border only (cell
				 * box-shadows), leaving the background untouched so a selected /
				 * highlighted row's tint stays visible while hovered. */
				${hover(css`
					${stateShadowRules({
						stateBorder: bodyRow.interactive.hoverBorder,
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.hoverBorderColor }
							: undefined,
						pinned
					})}
				`)}
				${active(css`
					${stateShadowRules({
						stateBorder: bodyRow.interactive.activeBorder,
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.activeBorderColor }
							: undefined,
						pinned
					})}
				`)}
			`}

			${$interactive &&
			!$disabled &&
			css`
				/* Row-scoped focus ring. The row is the focus unit (roving \`tabIndex\`
				 * on the \`<tr>\`), so the ring is keyed off \`:focus\` (not
				 * \`:focus-visible\`) to fire on both keyboard nav and pointer click.
				 * Gated to \`$interactive\` rows so non-interactive rows aren't emphasized.
				 *
				 * Drawn with \`stateShadowRules\` cell box-shadows, not a row \`::before\`
				 * (spawns a phantom cell, see above) or a row \`outline\` (hidden behind
				 * the cells' opaque/sticky backgrounds). The box-shadows travel with every
				 * cell, including pinned ones, so the ring wraps the whole row. */
				&:focus {
					${stateShadowRules({
						stateBorder: bodyRow.interactive.focusBorder,
						// On a selected row, tint the left accent to the focus color (keeping
						// its thicker selected width) so the whole ring is one color — focus
						// takes visual priority over the selection's blue accent rather than
						// the two mixing. Mirrors the hover/active rings above.
						accent: $selected
							? { border: bodyRow.selected.borderLeft, color: bodyRow.selected.focusBorderColor }
							: undefined,
						pinned
					})}
				}
			`}

		${$selected &&
			css`
				> td {
					background: ${bodyRow.selected.background};
				}
				/*
			 * Selected left accent, drawn as an inset left shadow on the first cell
			 * (travels with the cell across the sticky pinned-left region; no phantom
			 * cell). \`:first-child\` covers the non-pinned case; the pinned rules win
			 * when the first cell is pinned and additionally layer the column
			 * separator — split in two so the separator only lands on the edge cell.
			 */
				> td:first-child {
					box-shadow: ${composeCellShadow({
						accent: { border: bodyRow.selected.borderLeft }
					})};
				}
				> td[data-pinned="left"]:first-child {
					box-shadow: ${composeCellShadow({
						accent: { border: bodyRow.selected.borderLeft }
					})};
				}
				> td[data-pinned-edge="left"]:first-child {
					box-shadow: ${composeCellShadow({
						accent: { border: bodyRow.selected.borderLeft },
						separatorShadow: pinned.leftColumn.boxShadow
					})};
				}
			`}

		${!$highlightVariant &&
			$highlighted &&
			css`
				> td {
					background: ${bodyRow.highlightedBG};
				}
			`}

		${$highlightVariant === "info" &&
			css`
				> td {
					background: ${bodyRow.infoBG};
				}
			`}

		${$highlightVariant === "success" &&
			css`
				> td {
					background: ${bodyRow.successBG};
				}
			`}

		${$disabled &&
			css`
				> td {
					background: ${bodyRow.disabled.background};
					color: ${bodyRow.disabled.color};
					pointer-events: none;
				}
			`}

			${$cellHighlighting &&
			$crossTabulation &&
			!$disabled &&
			css`
				${hover(css`
					> th[data-pinned="left"]:not(:hover),
					> td[data-pinned="left"]:not(:hover) {
						background-color: ${darken(bodyRow.subBGRatio, header.background)};
					}
				`)}
			`}

			/* Tree-table reparent (AS_CHILD) drop target, keyed off \`data-drop-target\`
			 * set by the DataTreeTable DnD wrapper: a light row wash plus a thick left
			 * accent, painted on the cells (not a row pseudo, see above). Placed last so
			 * the wash wins over the resting/hover/selected cell backgrounds during a drag. */
			&[data-drop-target="droppable"] > td {
				background: ${treeNode.droppableBG};
			}
			&[data-drop-target="droppable"] > td:first-child {
				box-shadow: ${composeCellShadow({
					accent: { border: treeNode.borderLeft, color: treeNode.droppableBorderColor }
				})};
			}
			&[data-drop-target="droppable"] > td[data-pinned-edge="left"]:first-child {
				box-shadow: ${composeCellShadow({
					accent: { border: treeNode.borderLeft, color: treeNode.droppableBorderColor },
					separatorShadow: pinned.leftColumn.boxShadow
				})};
			}
			&[data-drop-target="forbidden"] > td {
				background: ${treeNode.forbiddenBG};
			}
			&[data-drop-target="forbidden"] > td:first-child {
				box-shadow: ${composeCellShadow({
					accent: { border: treeNode.borderLeft, color: treeNode.forbiddenBorderColor }
				})};
			}
			&[data-drop-target="forbidden"] > td[data-pinned-edge="left"]:first-child {
				box-shadow: ${composeCellShadow({
					accent: { border: treeNode.borderLeft, color: treeNode.forbiddenBorderColor },
					separatorShadow: pinned.leftColumn.boxShadow
				})};
			}
		`;
	}
);

/**
 * Host cell for the optional per-row overlay slot. Rendered as the last child of
 * the body `<tr>` (which is already `position: relative`) and taken out of table
 * flow with `position: absolute`, so it covers the whole row without consuming a
 * column — the same reason the row avoids `::before`/`::after` overlays (a flowed
 * non-`<td>` child spawns a phantom cell and mis-aligns every column). `colSpan`
 * is cosmetic here (the cell is out of flow); the layer is sized via `inset: 0`.
 */
export const StyledDataTableRowOverlayCell = styled.td.withConfig({
	displayName: "StyledDataTableRowOverlayCell-sc-"
})`
	position: absolute;
	inset: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
	background: none;
	pointer-events: none;

	/* Re-enable interaction for the consumer's overlay content (a busy veil that
	 * should block clicks sets its own \`pointer-events\`). */
	> * {
		pointer-events: auto;
	}
`;

/**
 * Subset of `RowStyles` applied to the `<tr>` DOM. Selection / interactivity /
 * disabled variants are passed separately as transient flags.
 */
export interface DataTableBodyRowTplStyles {
	/** Optional class name forwarded to the `<tr>`. */
	className?: string;

	/** Optional inline style forwarded to the `<tr>`. */
	style?: CSSProperties;

	/** Optional `title` attribute (browser-native tooltip). */
	title?: string;
}

/**
 * Props accepted by {@link DataTableBodyRowTpl}.
 *
 * @experimental
 */
export interface DataTableBodyRowTplProps {
	/**
	 * Visual styling forwarded to the `<tr>` (`className`, `style`, `title`).
	 * Selection / interactivity / disabled flags are passed separately.
	 */
	styles?: DataTableBodyRowTplStyles;

	/**
	 * Zero-based data index, driving the roving `tabIndex` for row-level
	 * arrow-key navigation. Omit it and the row falls back to the static
	 * `interactive ? 0 : -1` tab stop.
	 */
	rowIndex?: number;

	/** Whether the row is selected — drives `$selected` and `aria-selected`. */
	selected?: boolean;

	/** Variant highlight color — drives `$highlightVariant`. */
	highlightVariant?: "success" | "info";

	/** Whether the row is visually highlighted — drives `$highlighted` as a fallback. */
	highlighted?: boolean;

	/** Whether the row is disabled — drives `$disabled` and `aria-disabled`. */
	disabled?: boolean;

	/** Whether the row reacts to user interaction (hover/active/focus). */
	interactive?: boolean;

	/** Value emitted as `aria-expanded` (only for expandable rows). */
	ariaExpanded?: boolean;

	/** Inline style overrides from virtualization, merged on top of `styles?.style`. */
	virtualStyle?: CSSProperties;

	/** 1-based row index for `aria-rowindex`. */
	ariaRowIndex?: number;

	/** Optional `id` attribute forwarded to the `<tr>`. */
	id?: string;

	/**
	 * `tabIndex` forwarded to the `<tr>`. Defaults to `0` for interactive enabled
	 * rows, `-1` for non-interactive enabled rows, omitted for disabled rows.
	 */
	tabIndex?: number;

	/** Click handler — forwarded to the `<tr>`. */
	onClick?: MouseEventHandler<HTMLTableRowElement>;

	/**
	 * Keydown handler on the `<tr>`. Pressing Enter on the row triggers
	 * `onClick` before delegating to this callback.
	 */
	onKeyDown?: KeyboardEventHandler<HTMLTableRowElement>;

	/** Focus handler — forwarded as-is to the `<tr>`. */
	onFocus?: FocusEventHandler<HTMLTableRowElement>;

	/** Blur handler — forwarded as-is to the `<tr>`. */
	onBlur?: FocusEventHandler<HTMLTableRowElement>;

	/** Context-menu handler — forwarded as-is to the `<tr>`. */
	onContextMenu?: MouseEventHandler<HTMLTableRowElement>;

	/** `mouseover` handler — forwarded as-is (DnD preview wiring). */
	onMouseOver?: MouseEventHandler<HTMLElement>;

	/** Additional HTML attributes spread onto the `<tr>`. */
	htmlAttributes?: HTMLAttributes<HTMLTableRowElement>;

	/** Ref to the underlying `<tr>`. */
	forwardedRef?: Ref<HTMLTableRowElement>;

	/** Body cells for this row. */
	children?: ReactNode;
}

/**
 * DataTable table body `<tr>`. Owns the `selected`/`highlightVariant`/
 * `highlighted`/`disabled`/`interactive` styled-component variants, virtual-style
 * merging, `aria-rowindex` / `aria-selected` / `aria-disabled` / `aria-expanded`
 * emission, and forwarding of the row-level event handlers. Cells via `children`.
 */
export function DataTableBodyRowTpl({
	styles,
	rowIndex,
	selected,
	highlightVariant,
	highlighted,
	disabled,
	interactive,
	ariaExpanded,
	virtualStyle,
	ariaRowIndex,
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
}: DataTableBodyRowTplProps): ReactElement {
	const cellHighlighting = useDataTableContext((ctx) => ctx.cellHighlighting);
	const crossTabulation = useDataTableContext((ctx) => ctx.crossTabulation);
	// Card view's `role="list"` root makes each row a `listitem`. (tree)grid mode
	// overrides the table role, dropping the native `<tr>` mapping, so restate it as
	// `role="row"`. Default view uses the implicit role.
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);
	const rowRole = cardView ? "listitem" : gridRole ? "row" : undefined;
	// Row-level roving tabindex: when active, exactly one row carries `tabIndex=0`
	// and the rest `-1`; `onRowFocusChange` keeps it in sync as focus lands.
	// Disabled rows stay non-focusable.
	const arrowNavActive = useDataTableContext((ctx) => ctx.arrowNavActive);
	const isRowFocused = useDataTableContext((ctx) => ctx.isRowFocused);
	const onRowFocusChange = useDataTableContext((ctx) => ctx.onRowFocusChange);
	const rovingTabIndex =
		arrowNavActive && !disabled && rowIndex !== undefined ? (isRowFocused?.(rowIndex) ? 0 : -1) : undefined;
	const mergedStyle: CSSProperties | undefined = virtualStyle ? { ...styles?.style, ...virtualStyle } : styles?.style;
	const resolvedTabIndex = tabIndex ?? rovingTabIndex ?? (disabled ? undefined : interactive ? 0 : -1);
	const handleOnFocus: FocusEventHandler<HTMLTableRowElement> | undefined =
		arrowNavActive && rowIndex !== undefined
			? (event) => {
					if (event.target === event.currentTarget) {
						onRowFocusChange?.(rowIndex, event.currentTarget);
					}

					onFocus?.(event);
				}
			: onFocus;
	// A keydown handler may also arrive via `htmlAttributes` (the channel slot
	// consumers / wrappers use to layer per-row accelerators). It is spread onto
	// the `<tr>` below but would be clobbered by the explicit `onKeyDown` prop, so
	// compose it here: native Enter-activation first, then the dedicated prop, then
	// the external handler.
	const externalOnKeyDown = htmlAttributes?.onKeyDown;
	const handleOnKeyDown: KeyboardEventHandler<HTMLTableRowElement> | undefined =
		onClick || onKeyDown || externalOnKeyDown
			? (event) => {
					if (!disabled && event.key === Key.Enter && event.target === event.currentTarget) {
						// Dispatch a native click so `onClick` gets a real MouseEvent.
						event.currentTarget.click();
					}

					onKeyDown?.(event);
					externalOnKeyDown?.(event);
				}
			: undefined;

	return (
		<StyledDataTableBodyRow
			{...htmlAttributes}
			ref={forwardedRef}
			data-role={DataRoles.Table.Body.Row}
			// DOM marker for interactive rows; scopes the focused-first-row
			// header-underline suppression (see the table tpl) to rows that paint a ring.
			data-interactive={interactive || undefined}
			role={rowRole}
			id={id}
			className={styles?.className}
			style={mergedStyle}
			title={styles?.title}
			tabIndex={resolvedTabIndex}
			aria-rowindex={ariaRowIndex}
			aria-selected={selected || undefined}
			aria-disabled={disabled || undefined}
			aria-expanded={ariaExpanded}
			$selected={!!selected}
			$highlightVariant={highlightVariant}
			$highlighted={!!highlighted}
			$disabled={!!disabled}
			$interactive={!!interactive}
			$cellHighlighting={!!cellHighlighting}
			$crossTabulation={!!crossTabulation}
			onClick={disabled ? undefined : onClick}
			onKeyDown={disabled ? undefined : handleOnKeyDown}
			onFocus={handleOnFocus}
			onBlur={onBlur}
			onContextMenu={onContextMenu}
			onMouseOver={onMouseOver}
		>
			{children}
		</StyledDataTableBodyRow>
	);
}

DataTableBodyRowTpl.displayName = "DataTableBodyRowTpl";
