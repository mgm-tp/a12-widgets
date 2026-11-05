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

import { configExtension } from "@lexical/extension";
import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { MdastImportExtension, MdastTableExtension } from "@lexical/mdast";
import {
	$createTableCellNode,
	$createTableNode,
	$createTableRowNode,
	$isTableCellNode,
	$isTableNode,
	$isTableRowNode,
	TableCellHeaderStates
} from "@lexical/table";
import type { ElementFormatType, LexicalNode } from "lexical";
import { $createParagraphNode, $isElementNode, defineExtension } from "lexical";
import type { AlignType, PhrasingContent, Table, TableCell, TableRow } from "mdast";

/**
 * GFM table alignment, kept on the cells so it can be seen and changed.
 *
 * A GFM table declares one alignment per column in its delimiter row, `| :- | :-: | -: |` —
 * https://github.github.com/gfm/#tables-extension-
 *
 * `@lexical/mdast` reads that list and puts it on the table node under a state key it does not
 * export. Nothing could read it back, so the alignment survived a save but was never drawn,
 * and there was no way to set one. (A second `createState` with the same key is not a way in:
 * Lexical rejects two configs sharing a key.)
 *
 * So these rules take over `table`, and the alignment goes where Lexical already knows what to
 * do with it — the format of the paragraph inside each cell. The browser then aligns the text,
 * and the toolbar changes it with the same element-alignment command every other block uses.
 *
 * Everything else is `@lexical/mdast`'s own logic, kept as it is, so the two stay in step:
 * the same header-row rule, the same one-paragraph-per-cell shape, the same skipping of rows a
 * selection export does not reach, and the same joining of a cell's extra blocks with a break.
 * Its `$importTable` and `$exportTable` are byte-identical in 0.48 and 0.50.
 *
 * The rules are registered ahead of the ones `MdastTableExtension` contributes, because the
 * registry keeps the first rule it is given for a type. It stays a dependency, so its grammar
 * (`gfmTable`) and its serializer (`gfmTableToMarkdown`) still do their half of the work.
 */

/** The alignments GFM can write. Anything else is a column with no alignment of its own. */
const ALIGNMENTS: ReadonlySet<string> = new Set(["center", "left", "right"]);

/** The alignment a column declared, as the format an element node carries. */
function formatOf(align: AlignType | undefined): ElementFormatType {
	return align != null && ALIGNMENTS.has(align) ? align : "";
}

/** The alignment a cell carries, read back off the paragraph inside it. */
function alignOf(cell: LexicalNode): AlignType {
	const [first] = $isElementNode(cell) ? cell.getChildren() : [];
	const format = $isElementNode(first) ? first.getFormatType() : "";

	return ALIGNMENTS.has(format) ? (format as AlignType) : null;
}

const $importTable: MdastImportHandler<Table> = (node, ctx) => {
	const table = $createTableNode();

	node.children.forEach((row, rowIndex) => {
		const rowNode = $createTableRowNode();

		row.children.forEach((cell, columnIndex) => {
			// The first row is the header row: a GFM table is a header, a delimiter row and the
			// rest. Only the rows are headers, never the first column.
			const cellNode = $createTableCellNode(
				rowIndex === 0 ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS
			);
			const paragraph = $createParagraphNode();

			// The one line that is ours: the column's alignment, on every cell of the column.
			paragraph.setFormat(formatOf(node.align?.[columnIndex]));
			paragraph.append(...ctx.importChildren(cell));
			cellNode.append(paragraph);
			rowNode.append(cellNode);
		});

		table.append(rowNode);
	});

	return table;
};

const $exportTable: MdastExportHandler = (node, ctx) => {
	if (!$isTableNode(node)) {
		return null;
	}

	const rows: TableRow[] = [];

	for (const row of node.getChildren()) {
		// Structural iteration steps past the walk's selection filter, so a row a selection
		// export does not reach is skipped here. The cells of a row that is kept all stay:
		// dropping one would shift the rest into other columns.
		if (!$isTableRowNode(row) || !ctx.isIncluded(row)) {
			continue;
		}

		const cells: TableCell[] = [];

		for (const cell of row.getChildren()) {
			if (!$isTableCellNode(cell)) {
				continue;
			}

			const children: PhrasingContent[] = [];

			for (const child of cell.getChildren()) {
				if ($isElementNode(child)) {
					// A GFM cell holds one line of phrasing content. More than one block — the
					// paragraphs an Enter inside the cell makes — are joined with a hard break,
					// which the table serializer writes as a space inside the cell.
					if (children.length > 0) {
						children.push({ type: "break" });
					}

					children.push(...(ctx.exportInline(child) as PhrasingContent[]));
				}
			}

			cells.push({ children, type: "tableCell" });
		}

		rows.push({ children: cells, type: "tableRow" });
	}

	// The other line that is ours. The delimiter row describes the columns, and the header row
	// is the one that names them, so its cells are the ones asked.
	const header = node.getFirstChild();

	return {
		align: ($isTableRowNode(header) ? header.getChildren() : []).map((cell) => alignOf(cell)),
		children: rows,
		type: "table"
	};
};

/** GFM tables whose column alignment is drawn on screen and can be changed. */
export const MdastTableAlignmentExtension = defineExtension({
	name: "@a12/mdast/TableAlignment",
	dependencies: [
		MdastTableExtension,
		configExtension(MdastImportExtension, {
			exportRules: [{ type: "table", $export: $exportTable }],
			importRules: [{ type: "table", $import: $importTable }]
		})
	]
});
