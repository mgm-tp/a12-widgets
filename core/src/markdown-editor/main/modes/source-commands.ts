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

export interface SourceSelection {
	/** All the markdown text in the editor, not just the part that is selected. */
	value: string;

	/** Where the selection starts. Same as `selectionEnd` when it is only a caret. */
	selectionStart: number;

	/** Where the selection ends. Always the same as `selectionStart` or after it. */
	selectionEnd: number;
}

export type LinePrefixKind =
	| "heading1"
	| "heading2"
	| "heading3"
	| "heading4"
	| "heading5"
	| "heading6"
	| "paragraph"
	| "blockquote"
	| "bulletList"
	| "orderedList"
	| "taskList";

// A heading marker: one to six hashes and a space, like `## Title`.
const HEADING_REGEX = /^(#{1,6}) /;

// A blockquote marker, like `> quote`.
const BLOCKQUOTE_REGEX = /^> /;

// A task item: a bullet, then a checkbox, like `- [ ] todo` or `* [x] done`.
const TASK_REGEX = /^[-*+] \[[ xX]\] /;

// A plain bullet. Markdown allows `-`, `*` and `+`
// and the lookahead keeps task items out, because they start the same way.
const BULLET_REGEX = /^[-*+] (?!\[[ xX]\] )/;

// A numbered item. Markdown numbers with either `1.` or `1)`, so both count.
const ORDERED_REGEX = /^\d+[.)] /;

// The bullet character a line already uses, so a toggle can write the same one back
// instead of swapping the author's `*` for a `-`.
const BULLET_CHAR_REGEX = /^([-*+]) /;

// The delimiter a numbered line already uses, `.` or `)`. Same reason as above.
const ORDERED_DELIMITER_REGEX = /^\d+([.)]) /;

// One step of indentation to take away: a tab, or up to two spaces.
const OUTDENT_REGEX = /^(\t| {1,2})/;

// The spaces or tabs a line starts with. This is what makes a list item nested,
// so the line transforms always put it back as it was.
const INDENT_REGEX = /^[\t ]*/;

// A marker built from repeated emphasis characters: `*`, `**`, `_`, `__`.
// These get counted rather than compared, because a single `*` is also half of a `**`.
const EMPHASIS_REGEX = /^(\*+|_+)$/;

function replaceRange(value: string, start: number, end: number, text: string): string {
	return value.slice(0, start) + text + value.slice(end);
}

/** The two delimiters of one inline format, and how they have to be matched. */
interface InlineDelimiters {
	/** Written in front of the selection, like `**` or `<mark>`. */
	open: string;

	/** Written after it. Same as `open`, except for the HTML tag formats. */
	close: string;

	/**
	 * `*` or `_` when the pair is emphasis, `undefined` otherwise. A lone `*` looks like
	 * half of a `**`, so emphasis is matched by run length instead of by text.
	 */
	emphasisChar: string | undefined;
}

function getInlineDelimiters(open: string, close: string): InlineDelimiters {
	return { open, close, emphasisChar: open === close && EMPHASIS_REGEX.test(open) ? open[0] : undefined };
}

/** How many `char` sit right before `index`. In `**bold**`, index 2 gives 2. */
function countRunCharBefore(value: string, index: number, char: string): number {
	let count = 0;

	while (count < index && value[index - count - 1] === char) {
		count += 1;
	}

	return count;
}

/** How many `char` start at `index`. In `**bold**`, index 6 gives 2. */
function countRunCharAfter(value: string, index: number, char: string): number {
	let count = 0;

	while (value[index + count] === char) {
		count += 1;
	}

	return count;
}

/**
 * Do runs of `before` and `after` emphasis characters hold a marker `width` wide?
 * `**bold**` has a run of 2 on each side: that holds `**`, but no `*`.
 */
function hasMarkerInRuns(before: number, after: number, width: number): boolean {
	if (width === 1) {
		// Italic. Bold takes the run in pairs, so only an odd run has a `*` to spare:
		// `**a**` is bold alone, `***a***` is bold and italic.
		return before % 2 === 1 && after % 2 === 1;
	}

	// Bold. Two characters to spare on each side is all it needs.
	return before >= width && after >= width;
}

/** Do the delimiters sit just outside the selection? In `**[bold]**`, yes. */
function hasOuterWrap(
	value: string,
	start: number,
	end: number,
	{ open, close, emphasisChar }: InlineDelimiters
): boolean {
	// `*` and `**` are built from the same character, so count the run either side.
	if (emphasisChar !== undefined) {
		return hasMarkerInRuns(
			countRunCharBefore(value, start, emphasisChar),
			countRunCharAfter(value, end, emphasisChar),
			open.length
		);
	}

	// Every other marker is one of a kind, so matching the text is enough.
	return (
		start >= open.length &&
		value.slice(start - open.length, start) === open &&
		value.slice(end, end + close.length) === close
	);
}

/** Are the delimiters inside the selection? In `[**bold**]`, yes. */
function hasInnerWrap(selectedText: string, { open, close, emphasisChar }: InlineDelimiters): boolean {
	// Too short to hold both delimiters, so there is nothing wrapped in there.
	if (selectedText.length < open.length + close.length) {
		return false;
	}

	// `*` and `**` are built from the same character, so count the run at each end.
	if (emphasisChar !== undefined) {
		const lead = countRunCharAfter(selectedText, 0, emphasisChar);
		const trail = countRunCharBefore(selectedText, selectedText.length, emphasisChar);

		// A selection of only stars, like `***`, would count the same ones twice.
		return lead + trail <= selectedText.length && hasMarkerInRuns(lead, trail, open.length);
	}

	// Every other marker is one of a kind, so matching the ends is enough.
	return selectedText.startsWith(open) && selectedText.endsWith(close);
}

/**
 * Adds a marker pair around the selection, or takes it off if it is already there.
 * `close` differs from `marker` only for tag formats like `<sub>`.
 *
 * With `**`, writing the selection as `[]` and the caret as `|`:
 *
 * - `**[bold]**` and `[**bold**]` both give `[bold]`
 * - `[bold]` gives `**[bold]**`
 * - `a|b` gives `a**|**b`, and clicking again gives back `a|b`
 */
export function toggleInlineWrap(input: SourceSelection, marker: string, close = marker): SourceSelection {
	const { value, selectionStart: start, selectionEnd: end } = input;
	const pair = getInlineDelimiters(marker, close);
	const openLen = marker.length;
	const closeLen = close.length;
	const selectedText = value.slice(start, end);

	// `**[bold]**` -> `[bold]`
	if (hasOuterWrap(value, start, end, pair)) {
		return {
			value: replaceRange(value, start - openLen, end + closeLen, selectedText),
			selectionStart: start - openLen,
			selectionEnd: end - openLen
		};
	}

	// `[**bold**]` -> `[bold]`
	if (hasInnerWrap(selectedText, pair)) {
		const inner = selectedText.slice(openLen, selectedText.length - closeLen);

		return {
			value: replaceRange(value, start, end, inner),
			selectionStart: start,
			selectionEnd: start + inner.length
		};
	}

	// `[bold]` -> `**[bold]**`, and `a|b` -> `a**|**b`
	return {
		value: replaceRange(value, start, end, marker + selectedText + close),
		selectionStart: start + openLen,
		selectionEnd: (start === end ? start : end) + openLen
	};
}

/**
 * Runs `rewrite` over every whole line the selection touches, then selects the lines
 * it gave back. Half a line still counts as the whole line, so a caret in the middle
 * of `text` rewrites all of `text`.
 */
function rewriteSelectedLines(input: SourceSelection, rewrite: (lines: string[]) => string[]): SourceSelection {
	const { value, selectionStart, selectionEnd } = input;
	// Grow out to the line ends. `lastIndexOf` returns -1 at the very start, and the +1
	// turns that into offset 0, which is the right answer there.
	const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
	const nextBreak = value.indexOf("\n", selectionEnd);
	const lineEnd = nextBreak === -1 ? value.length : nextBreak;
	const block = rewrite(value.slice(lineStart, lineEnd).split("\n")).join("\n");

	return {
		value: replaceRange(value, lineStart, lineEnd, block),
		selectionStart: lineStart,
		selectionEnd: lineStart + block.length
	};
}

/**
 * Splits off the leading spaces: `  - a` gives indent `  ` and content `- a`.
 * The indent is what nests a list item, so it goes back on untouched.
 */
function splitIndent(line: string): { indent: string; content: string } {
	const indent = INDENT_REGEX.exec(line)?.[0] ?? "";

	return { indent, content: line.slice(indent.length) };
}

/** Takes off any list marker: `- [ ] a`, `* a` and `1) a` all become `a`. */
function stripListMarkers(content: string): string {
	return content.replace(TASK_REGEX, "").replace(BULLET_REGEX, "").replace(ORDERED_REGEX, "");
}

function firstCapture(contents: string[], pattern: RegExp, fallback: string): string {
	for (const content of contents) {
		const capture = pattern.exec(content)?.[1];

		if (capture !== undefined) {
			return capture;
		}
	}

	return fallback;
}

function isCarriedByAll(contents: string[], hasPrefix: (content: string) => boolean): boolean {
	return contents.length > 0 && contents.every(hasPrefix);
}

type HeadingKind = Extract<LinePrefixKind, `heading${number}`>;

function isHeadingKind(kind: LinePrefixKind): kind is HeadingKind {
	return kind.startsWith("heading");
}

const LIST_MARKER_REGEX = { taskList: TASK_REGEX, bulletList: BULLET_REGEX, orderedList: ORDERED_REGEX } as const;

type LineRewrite = (content: string, ordinal: number) => string;

/**
 * Builds the rewrite for one `kind`, given the lines it is used on.
 * Add or remove is decided once here for the whole block: it only removes
 * when every line already has the prefix. So `- a` plus `b` becomes `- a` and `- b`, not `a` and `- b`.
 */
function lineRewrite(kind: LinePrefixKind, contents: string[]): LineRewrite {
	// Paragraph is the heading menu's level 0, so it only strips: `## a` -> `a`.
	if (kind === "paragraph") {
		return (content) => content.replace(HEADING_REGEX, "");
	}

	// Quotes stack on top of headings and lists, so only the `>` counts: `- a` -> `> - a`.
	if (kind === "blockquote") {
		const strip = isCarriedByAll(contents, (content) => BLOCKQUOTE_REGEX.test(content));

		return (content) => (strip ? content.replace(BLOCKQUOTE_REGEX, "") : `> ${content}`);
	}

	// Levels replace each other, so strip first: `## a` -> `### a` for heading3.
	if (isHeadingKind(kind)) {
		const marker = `${"#".repeat(Number(kind.slice("heading".length)))} `;
		const strip = isCarriedByAll(contents, (content) => content.startsWith(marker));

		return (content) => {
			const base = content.replace(HEADING_REGEX, "");

			return strip ? base : marker + base;
		};
	}

	// The three list kinds swap out each other's marker: `- a` -> `- [ ] a` for a task list,
	// `* a` -> `1. a` for a numbered one.
	const strip = isCarriedByAll(contents, (content) => LIST_MARKER_REGEX[kind].test(content));
	const bullet = firstCapture(contents, BULLET_CHAR_REGEX, "-");
	const delimiter = firstCapture(contents, ORDERED_DELIMITER_REGEX, ".");

	return (content, ordinal) => {
		const base = stripListMarkers(content);

		if (strip) {
			return base;
		}

		if (kind === "taskList") {
			return `${bullet} [ ] ${base}`;
		}

		return kind === "bulletList" ? `${bullet} ${base}` : `${ordinal}${delimiter} ${base}`;
	};
}

export function applyLinePrefix(input: SourceSelection, kind: LinePrefixKind): SourceSelection {
	return rewriteSelectedLines(input, (lines) => {
		const parts = lines.map(splitIndent);
		const contents = parts.map((part) => part.content).filter((content) => content !== "");
		const rewrite = lineRewrite(kind, contents);
		let ordinal = 0;

		return parts.map(({ indent, content }) => {
			if (content === "") {
				return indent;
			}

			ordinal += 1;

			return indent + rewrite(content, ordinal);
		});
	});
}

export function indentLines(input: SourceSelection, unit = "  "): SourceSelection {
	return rewriteSelectedLines(input, (lines) => lines.map((line) => (line === "" ? line : unit + line)));
}

export function outdentLines(input: SourceSelection): SourceSelection {
	return rewriteSelectedLines(input, (lines) => lines.map((line) => line.replace(OUTDENT_REGEX, "")));
}

export function insertText(input: SourceSelection, text: string): SourceSelection {
	const { value, selectionStart, selectionEnd } = input;
	const caret = selectionStart + text.length;

	return {
		value: replaceRange(value, selectionStart, selectionEnd, text),
		selectionStart: caret,
		selectionEnd: caret
	};
}

/**
 * Newlines needed to leave a blank line in front of a block.
 *
 * Insert a rule at the end of `text` and it needs two, giving `text\n\n---`.
 * With one newline, `text\n---` is not a rule at all: markdown reads it as a heading `text`,
 * underlined by the dashes.
 */
function padBefore(value: string, index: number): string {
	return index === 0 ? "" : "\n".repeat(Math.max(0, 2 - countRunCharBefore(value, index, "\n")));
}

/**
 * Newlines needed after a block, on top of the one `insertBlock` always writes.
 * So one at most, never two.
 *
 * Insert a table in front of `after` and it needs that one, giving `| a |\n\nafter`.
 * Without it, `| a |\nafter` makes `after` one more row of the table.
 */
function padAfter(value: string, index: number): string {
	return index >= value.length ? "" : "\n".repeat(Math.max(0, 1 - countRunCharAfter(value, index, "\n")));
}

function insertBlock(input: SourceSelection, block: string): { value: string; blockStart: number; blockEnd: number } {
	const { value, selectionStart, selectionEnd } = input;
	const lead = padBefore(value, selectionStart);
	const trail = padAfter(value, selectionEnd);
	const blockStart = selectionStart + lead.length;

	return {
		value: replaceRange(value, selectionStart, selectionEnd, `${lead}${block}\n${trail}`),
		blockStart,
		blockEnd: blockStart + block.length + 1
	};
}

export function insertHorizontalRule(input: SourceSelection): SourceSelection {
	const { value, blockEnd } = insertBlock(input, "---");

	return { value, selectionStart: blockEnd, selectionEnd: blockEnd };
}

/**
 * Puts the selected text between an opening and a closing line, and keeps it selected.
 *
 * Select `body`, pass the two lines, and get:
 *
 *     <open>
 *     body
 *     <close>
 *
 * They are separate arguments because they usually differ:
 * a fenced code block opens with a language after its backticks and closes with bare ones.
 * `insertCodeBlock` passes that pair; an extension inserting a fence of its own passes its own.
 */
function wrapSelectionInBlock(input: SourceSelection, open: string, close: string): SourceSelection {
	const body = input.value.slice(input.selectionStart, input.selectionEnd);
	const { value, blockStart } = insertBlock(input, `${open}\n${body}\n${close}`);
	// Past the opening line and its break, so the body is what stays selected.
	const bodyStart = blockStart + open.length + 1;

	return { value, selectionStart: bodyStart, selectionEnd: bodyStart + body.length };
}

export function insertCodeBlock(input: SourceSelection, options: { language?: string } = {}): SourceSelection {
	return wrapSelectionInBlock(input, `\`\`\`${options.language ?? ""}`, "```");
}

/**
 * Inserts a table of placeholder cells, 3 by 2 by default:
 *
 * ```
 * | Column 1 | Column 2 | Column 3 |
 * | -------- | -------- | -------- |
 * | Cell 1-1 | Cell 1-2 | Cell 1-3 |
 * | Cell 2-1 | Cell 2-2 | Cell 2-3 |
 * ```
 */
export function insertTable(
	input: SourceSelection,
	options: { columns?: number; rows?: number } = {}
): SourceSelection {
	const columns = Math.max(1, options.columns ?? 3);
	const bodyRows = Math.max(1, options.rows ?? 2);

	const header = Array.from({ length: columns }, (_, column) => `Column ${column + 1}`);
	const body = Array.from({ length: bodyRows }, (_, row) =>
		Array.from({ length: columns }, (_, column) => `Cell ${row + 1}-${column + 1}`)
	);

	// Pad every cell of a column to its widest text, so the source lines up as a grid.
	const widths = header.map((cell, column) => Math.max(cell.length, ...body.map((row) => row[column].length)));
	const toRow = (cells: string[]): string =>
		`| ${cells.map((cell, column) => cell.padEnd(widths[column])).join(" | ")} |`;
	const divider = widths.map((width) => "-".repeat(width));

	const table = [toRow(header), toRow(divider), ...body.map(toRow)].join("\n");
	const { value, blockStart } = insertBlock(input, table);

	// Skip the row's opening `| ` to select `Column 1`, so typing replaces it.
	const firstCellStart = blockStart + 2;

	return { value, selectionStart: firstCellStart, selectionEnd: firstCellStart + header[0].length };
}

/** Builds a link: `A12` and `https://geta12.com` give `[A12](https://geta12.com)`. */
export function composeLink(text: string, url: string): string {
	return `[${text}](${url})`;
}

/** Builds an image: `![logo](logo.png)`, or `![logo](logo.png "A12")` with a title. */
export function composeImage(alt: string, url: string, title?: string): string {
	const suffix = title ? ` "${title}"` : "";

	return `![${alt}](${url}${suffix})`;
}
