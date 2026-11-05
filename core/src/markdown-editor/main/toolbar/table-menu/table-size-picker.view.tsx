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

import type { FC, KeyboardEvent } from "react";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { Key } from "ts-key-enum";

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import type { TableSize } from "../toolbar-command-registry.js";
import { DEFAULT_TABLE_SIZE } from "../toolbar-command-registry.js";

import {
	StyledMarkdownTablePicker,
	StyledMarkdownTablePickerCell,
	StyledMarkdownTablePickerGrid,
	StyledMarkdownTablePickerLabel,
	StyledMarkdownTablePickerOutline,
	StyledMarkdownTablePickerRow
} from "./table-menu.styled.js";

/** How far the grid can grow. Bigger tables are built by adding rows and columns afterwards. */
const MAX_SIZE: TableSize = { rows: 15, columns: 10 };

/**
 * How big the grid is before anything is picked.
 *
 * It then keeps one spare row and column past the pick, so there is always a square to move onto
 * and the full 15 x 10 is never drawn.
 */
const MIN_VISIBLE_SIZE: TableSize = { rows: 6, columns: 6 };

/**
 * The smallest table the grid offers: a header row, one body row and two columns.
 * A single row is a header with nothing under it, and a single column is a list.
 */
const MIN_SIZE: TableSize = { rows: 2, columns: 2 };

/** What each arrow key adds to the current size. */
const ARROW_STEPS: Record<string, TableSize> = {
	[Key.ArrowUp]: { rows: -1, columns: 0 },
	[Key.ArrowDown]: { rows: 1, columns: 0 },
	[Key.ArrowLeft]: { rows: 0, columns: -1 },
	[Key.ArrowRight]: { rows: 0, columns: 1 }
};

interface TableSizePickerProps {
	/** Runs with the picked size. `rows` counts the header row. */
	onPick: (size: TableSize) => void;
}

/** 1 … n, for rendering a row or a column of the grid. */
function buildRange(length: number): number[] {
	return Array.from({ length }, (_, index) => index + 1);
}

/** `size` held between the smallest table the grid offers and the edge of the grid. */
function clampToGrid(size: TableSize): TableSize {
	const within = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

	return {
		rows: within(size.rows, MIN_SIZE.rows, MAX_SIZE.rows),
		columns: within(size.columns, MIN_SIZE.columns, MAX_SIZE.columns)
	};
}

/** `size` moved by `step`, kept inside the grid. */
function resize(size: TableSize, step: TableSize): TableSize {
	return clampToGrid({ rows: size.rows + step.rows, columns: size.columns + step.columns });
}

/** How much of the grid to draw for `size`: one step ahead of it, within the grid's own limits. */
function getVisibleSize(size: TableSize): TableSize {
	const ahead = (picked: number, min: number, max: number): number => Math.min(Math.max(picked + 1, min), max);

	return {
		rows: ahead(size.rows, MIN_VISIBLE_SIZE.rows, MAX_SIZE.rows),
		columns: ahead(size.columns, MIN_VISIBLE_SIZE.columns, MAX_SIZE.columns)
	};
}

/**
 * The row-by-column grid the table button opens: move over it to size the table,
 * click to insert it.
 *
 * One `grid` with a moving `aria-activedescendant`, not a button per square. 60 buttons
 * would be 60 Tab stops, and a screen reader would read the size out of every one of them.
 * This way the grid is a single stop, the arrow keys size the table the same as the pointer
 * does, and the readout under it is the live region that says what Enter will insert.
 */
export const TableSizePicker: FC<TableSizePickerProps> = ({ onPick }) => {
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const [size, setSize] = useState<TableSize>(DEFAULT_TABLE_SIZE);
	const cellIdPrefix = useId();
	const gridRef = useRef<HTMLDivElement | null>(null);

	// The grid is the thing the arrow keys talk to, so it takes focus as it opens
	// rather than leaving the first keystroke to land on whatever held focus before.
	//
	// On a macrotask, not straight away: the click that opened the picker is still
	// running, and the browser settles focus when it finishes. Focusing during the
	// click is undone a moment later.
	useEffect(() => {
		const focusGrid = setTimeout(() => gridRef.current?.focus());

		return (): void => clearTimeout(focusGrid);
	}, []);

	const getCellId = (row: number, column: number): string => `${cellIdPrefix}-${row}-${column}`;

	/** Whether the square at `row`/`column` is inside the picked size. */
	const isCellPicked = (row: number, column: number): boolean => row <= size.rows && column <= size.columns;
	const visible = getVisibleSize(size);

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
		const step = ARROW_STEPS[event.key];

		if (step) {
			event.preventDefault();
			setSize(resize(size, step));

			return;
		}

		switch (event.key) {
			case Key.Home:
				event.preventDefault();
				setSize(MIN_SIZE);
				break;
			case Key.End:
				event.preventDefault();
				setSize(MAX_SIZE);
				break;
			case Key.Enter:
			case " ":
				event.preventDefault();
				onPick(size);
				break;
			default:
				break;
		}
	};

	return (
		<StyledMarkdownTablePicker data-role={DataRoles.MarkdownEditor.TablePicker.Wrapper}>
			<StyledMarkdownTablePickerGrid
				ref={gridRef}
				role="grid"
				tabIndex={0}
				aria-label={titles?.insertTable}
				aria-activedescendant={getCellId(size.rows, size.columns)}
				aria-rowcount={MAX_SIZE.rows}
				aria-colcount={MAX_SIZE.columns}
				onKeyDown={onKeyDown}
			>
				{buildRange(visible.rows).map((row) => (
					<StyledMarkdownTablePickerRow key={row} role="row" aria-rowindex={row}>
						{buildRange(visible.columns).map((column) => (
							<StyledMarkdownTablePickerCell
								key={column}
								id={getCellId(row, column)}
								role="gridcell"
								aria-colindex={column}
								aria-selected={isCellPicked(row, column)}
								$selected={isCellPicked(row, column)}
								data-role={DataRoles.MarkdownEditor.TablePicker.Cell}
								// Pointer down, not click: the editor keeps its selection,
								// the same way the toolbar buttons hold on to it.
								onMouseDown={(event) => {
									event.preventDefault();
									onPick(clampToGrid({ rows: row, columns: column }));
								}}
								onMouseEnter={() => setSize(clampToGrid({ rows: row, columns: column }))}
							/>
						))}
					</StyledMarkdownTablePickerRow>
				))}
				<StyledMarkdownTablePickerOutline $rows={size.rows} $columns={size.columns} />
			</StyledMarkdownTablePickerGrid>
			{/* Columns first, the way `4 x 3` reads: four wide, three tall. */}
			<StyledMarkdownTablePickerLabel aria-live="polite" data-role={DataRoles.MarkdownEditor.TablePicker.Label}>
				{`${size.columns} x ${size.rows}`}
			</StyledMarkdownTablePickerLabel>
		</StyledMarkdownTablePicker>
	);
};

TableSizePicker.displayName = "MarkdownTableSizePicker";
