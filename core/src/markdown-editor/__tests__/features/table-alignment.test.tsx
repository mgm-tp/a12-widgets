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

import { buildEditorFromExtensions } from "@lexical/extension";
import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/mdast";
import { $getRoot, $isElementNode } from "lexical";
import type { ElementFormatType, LexicalNode } from "lexical";
import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { defineMarkdownEditorExtension } from "../../main/extensions.js";
import { createRichCommands } from "../../main/modes/rich-commands.js";
import { resolveFeatures } from "../../main/optional-features.js";
import { DEFAULT_TOOLBAR_STATE } from "../../main/toolbar/toolbar-state.js";
import { ControlledEditor, getSurfaceByMode } from "../utils/index.js";

/**
 * GFM column alignment — https://github.github.com/gfm/#tables-extension-
 *
 * A table declares one alignment per column in its delimiter row, `| :- | :-: | -: |`.
 * It is kept as the format of the paragraph inside each cell, which is what Lexical already draws as
 * `text-align`, so the alignment is visible and the toolbar can change it.
 */
const EXTENSION = defineMarkdownEditorExtension(resolveFeatures({}));

/** Reads a document in, hands back the markdown it writes out. */
function save(markdown: string): string {
	const editor = buildEditorFromExtensions(EXTENSION);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	return editor.read(() => $convertToMarkdownString());
}

/** The alignment every cell of the first row carries. */
function headerAlignments(markdown: string): string[] {
	const editor = buildEditorFromExtensions(EXTENSION);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	return editor.read(() => {
		const table = $getRoot().getFirstChild();
		const row = $isElementNode(table) ? table.getFirstChild() : null;

		return ($isElementNode(row) ? row.getChildren() : []).map((cell: LexicalNode) => {
			const paragraph = $isElementNode(cell) ? cell.getFirstChild() : null;

			return $isElementNode(paragraph) ? paragraph.getFormatType() : "";
		});
	});
}

describe("GFM table column alignment", () => {
	test("the delimiter row is read onto every cell of its column", () => {
		expect(headerAlignments("| a | b | c |\n| :- | :-: | -: |\n| 1 | 2 | 3 |\n")).toStrictEqual([
			"left",
			"center",
			"right"
		]);
	});

	test("a column the delimiter row says nothing about carries no alignment", () => {
		expect(headerAlignments("| a | b |\n| - | - |\n| 1 | 2 |\n")).toStrictEqual(["", ""]);
	});

	test.each([
		["| a | b | c |\n| :- | :-: | -: |\n| 1 | 2 | 3 |\n", ":-", ":-:", "-:"],
		["| h |\n| -: |\n| x |\n", "-:", "-:", "-:"]
	])("a save keeps the delimiter row of %j", (markdown, ...markers) => {
		const written = save(markdown);

		for (const marker of markers) {
			expect(written).toContain(marker);
		}
	});

	test("a table with no alignment stays byte for byte", () => {
		expect(save("| a | b |\n| - | - |\n| 1 | 2 |\n")).toBe("| a | b |\n| - | - |\n| 1 | 2 |");
	});

	test("the alignment reaches the page as a real text-align", async () => {
		const { container } = render(
			<ControlledEditor initialValue={"| a | b | c |\n| :- | :-: | -: |\n| 1 | 2 | 3 |\n"} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.querySelector("table")).not.toBeNull());

		const drawn = Array.from(surface.querySelectorAll("td, th")).map((cell) => {
			const paragraph = cell.querySelector("p") ?? cell.firstElementChild;

			return paragraph instanceof HTMLElement ? paragraph.style.textAlign : "";
		});

		expect(drawn).toStrictEqual(["left", "center", "right", "left", "center", "right"]);
	});

	test.each<[ElementFormatType, string]>([
		["left", ":-"],
		["center", ":-:"],
		["right", "-:"]
	])("aligning a column to %s writes %j and comes back", (alignment, marker) => {
		const editor = buildEditorFromExtensions(EXTENSION);

		editor.update(
			() => {
				$convertFromMarkdownString("| a | b |\n| - | - |\n| 1 | 2 |\n");
			},
			{ discrete: true }
		);

		// The caret goes into the second column, which is the one that has to move.
		editor.update(
			() => {
				const table = $getRoot().getFirstChild();
				const row = $isElementNode(table) ? table.getFirstChild() : null;
				const cell = $isElementNode(row) ? row.getChildren()[1] : null;
				const paragraph = $isElementNode(cell) ? cell.getFirstChild() : null;

				if ($isElementNode(paragraph)) {
					paragraph.selectEnd();
				}
			},
			{ discrete: true }
		);

		createRichCommands(editor, DEFAULT_TOOLBAR_STATE).setColumnAlignment(alignment);
		// A second, empty update lets the command's own update commit before the read.
		editor.update(() => undefined, { discrete: true });

		const written = editor.read(() => $convertToMarkdownString());

		expect(written).toContain(marker);
		expect(headerAlignments(written)).toStrictEqual(["", alignment]);
	});
});
