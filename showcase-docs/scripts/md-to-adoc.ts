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

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Blockquote, Code, List, ListItem, PhrasingContent, Root, RootContent, Table, TableRow } from "mdast";

const HARD_BREAK_OUTPUT = " +\n";
const HTML_PASSTHROUGH_OPEN = "++++";
const HTML_PASSTHROUGH_CLOSE = "++++";
const QUOTE_BLOCK_DELIMITER = "____";
const CODE_BLOCK_DELIMITER = "----";
const TABLE_DELIMITER = "|===";

/**
 * Hooks the caller exposes to the renderer to influence link output and collect diagnostics.
 */
export interface LinkRewriterApi {
	/** Append a diagnostic surfaced in {@link MdToAdocResult.warnings}. */
	warn(message: string): void;
}

/**
 * Callback that maps a Markdown link to its AsciiDoc representation. Return a string to override
 * the default `link:url[label]` rendering, or `undefined` to fall back to it.
 */
export type LinkRewriter = (url: string, label: string, api: LinkRewriterApi) => string | undefined;

export interface MdToAdocOptions {
	/**
	 * Hook invoked for every Markdown link. Lets callers map domain-specific URLs (e.g. SPA routes
	 * or wiki shortcuts) to AsciiDoc cross-references or attribute-substituted links.
	 *
	 * @example
	 * ```ts
	 * const routeToAnchor = new Map([
	 *   ["/get-started/migration-notes", "_migration_notes"]
	 * ]);
	 * mdToAdoc("[notes](#/get-started/migration-notes)", {
	 *   linkRewriter: (url, label) => {
	 *     if (!url.startsWith("#/")) return undefined;
	 *     const route = url.slice(1).split("#")[0];
	 *     const anchor = routeToAnchor.get(route);
	 *     return anchor ? `<<${anchor},${label}>>` : undefined;
	 *   }
	 * });
	 * ```
	 */
	linkRewriter?: LinkRewriter;
}

export interface MdToAdocResult {
	/** AsciiDoc rendering of the input Markdown. */
	adoc: string;

	/** Diagnostics emitted via {@link LinkRewriterApi.warn}. */
	warnings: string[];
}

interface RenderContext {
	/**
	 * Number of `<list>` ancestors already entered; `0` at the document root. The list currently
	 * being rendered is at depth `ancestorListCount + 1`, which determines how many times the
	 * AsciiDoc list marker (`*` or `.`) is repeated.
	 */
	ancestorListCount: number;

	/** Subtract this from every heading depth so the shallowest source heading renders as `=`. */
	headingShift: number;

	/** Per-call link rewriter; see {@link MdToAdocOptions.linkRewriter}. */
	linkRewriter: LinkRewriter | undefined;

	/** Diagnostics accumulated during rendering. */
	warnings: string[];
}

/**
 * Converts Markdown (CommonMark + GFM) to AsciiDoc by walking the mdast tree.
 * Handles headings, paragraphs, ordered/unordered lists (nested), blockquotes,
 * fenced code, inline code, emphasis/strong, links, images, tables, hr, html.
 * Heading levels are normalized so the lowest heading in the input becomes `=`.
 */
export function mdToAdoc(markdown: string, options: MdToAdocOptions = {}): MdToAdocResult {
	const tree: Root = unified().use(remarkParse).use(remarkGfm).parse(markdown);
	const headingShift = computeHeadingShift(tree);
	const context: RenderContext = {
		ancestorListCount: 0,
		headingShift,
		linkRewriter: options.linkRewriter,
		warnings: []
	};

	const adoc = renderBlockChildren(tree.children, context).trimEnd() + "\n";

	return { adoc, warnings: context.warnings };
}

/**
 * Find the shallowest heading depth so that the document's top-level heading renders as `=`,
 * regardless of whether the source used `#`, `##`, or deeper.
 */
function computeHeadingShift(tree: Root): number {
	let minimumDepth = Number.POSITIVE_INFINITY;

	for (const node of tree.children) {
		if (node.type === "heading" && node.depth < minimumDepth) {
			minimumDepth = node.depth;
		}
	}

	if (!Number.isFinite(minimumDepth)) {
		return 0;
	}

	return minimumDepth - 1;
}

function renderBlockChildren(nodes: RootContent[], context: RenderContext): string {
	const renderedBlocks: string[] = [];

	for (const node of nodes) {
		const rendered = renderBlock(node, context);

		if (rendered !== "") {
			renderedBlocks.push(rendered);
		}
	}

	return renderedBlocks.join("\n\n");
}

function renderBlock(node: RootContent, context: RenderContext): string {
	switch (node.type) {
		case "heading": {
			const depth = Math.max(1, node.depth - context.headingShift);

			return "=".repeat(depth) + " " + renderInlineChildren(node.children, context);
		}

		case "paragraph":
			return renderInlineChildren(node.children, context);
		case "thematicBreak":
			return "'''";
		case "blockquote":
			return renderBlockquote(node, context);
		case "code":
			return renderCodeBlock(node);
		case "list":
			return renderList(node, context);
		case "table":
			return renderTable(node, context);
		case "html":
			return `${HTML_PASSTHROUGH_OPEN}\n${node.value}\n${HTML_PASSTHROUGH_CLOSE}`;
		case "definition":
		case "yaml":
			return "";
		default:
			return "";
	}
}

function renderInlineChildren(nodes: PhrasingContent[], context: RenderContext): string {
	return nodes.map((node) => renderInline(node, context)).join("");
}

function renderInline(node: PhrasingContent, context: RenderContext): string {
	switch (node.type) {
		case "text":
			return node.value;
		case "strong":
			return "*" + renderInlineChildren(node.children, context) + "*";
		case "emphasis":
			return "_" + renderInlineChildren(node.children, context) + "_";
		case "delete":
			return "[.line-through]#" + renderInlineChildren(node.children, context) + "#";
		case "inlineCode":
			return renderInlineCode(node.value);
		case "break":
			return HARD_BREAK_OUTPUT;
		case "link":
			return renderLink(node.url, renderInlineChildren(node.children, context), context);
		case "image":
			return `image:${node.url}[${node.alt ?? ""}]`;
		case "html":
			return node.value;
		case "footnoteReference":
			return `footnote:[${node.identifier}]`;
		case "linkReference":
			// Reference-style links are unsupported; render the visible label only.
			return renderInlineChildren(node.children, context);
		case "imageReference":
			// Reference-style images are unsupported; render the alt text only.
			return node.alt ?? "";
		default:
			return "";
	}
}

/**
 * Render Markdown inline code as monospace AsciiDoc with passthrough so that characters such as
 * `*`, `_`, or `+` inside the code span are not reinterpreted as inline formatting markers.
 * Defaults to `+...+` passthrough; falls back to `++...++` when the value contains `+`,
 * and to `pass:[<code>...</code>]` when the value contains `++`.
 */
function renderInlineCode(value: string): string {
	if (!value.includes("+")) {
		return "`+" + value + "+`";
	}

	if (!value.includes("++")) {
		return "`++" + value + "++`";
	}

	const escaped = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

	return "pass:[<code>" + escaped + "</code>]";
}

/**
 * Render a Markdown link as AsciiDoc. Delegates to the caller-supplied {@link LinkRewriter} first;
 * falls back to the default `link:url[label]` form when the rewriter declines or is absent.
 */
function renderLink(url: string, label: string, context: RenderContext): string {
	if (context.linkRewriter) {
		const api: LinkRewriterApi = { warn: (message) => context.warnings.push(message) };
		const rewritten = context.linkRewriter(url, label, api);

		if (rewritten !== undefined) {
			return rewritten;
		}
	}

	return `link:${url}[${label}]`;
}

function renderList(node: List, context: RenderContext): string {
	// Depth of THIS list = ancestors already entered + this one.
	const currentListDepth = context.ancestorListCount + 1;
	const markerChar = node.ordered ? "." : "*";
	const itemMarker = markerChar.repeat(currentListDepth);
	const childContext: RenderContext = { ...context, ancestorListCount: currentListDepth };

	return node.children.map((item) => renderListItem(item, itemMarker, childContext)).join("\n");
}

function renderListItem(item: ListItem, itemMarker: string, context: RenderContext): string {
	const itemLines: string[] = [];
	let firstParagraphConsumed = false;

	for (const child of item.children) {
		if (!firstParagraphConsumed && child.type === "paragraph") {
			itemLines.push(`${itemMarker} ${renderInlineChildren(child.children, context)}`);
			firstParagraphConsumed = true;
			continue;
		}

		if (child.type === "list") {
			itemLines.push(renderList(child, context));
		} else if (child.type === "code") {
			itemLines.push("+");
			itemLines.push(renderCodeBlock(child));
		} else if (child.type === "paragraph") {
			itemLines.push("+");
			itemLines.push(renderInlineChildren(child.children, context));
		} else {
			itemLines.push(renderBlock(child, context));
		}
	}

	if (!firstParagraphConsumed) {
		itemLines.unshift(itemMarker);
	}

	return itemLines.join("\n");
}

function renderBlockquote(node: Blockquote, context: RenderContext): string {
	const innerContent = renderBlockChildren(node.children, context);

	return `[quote]\n${QUOTE_BLOCK_DELIMITER}\n${innerContent}\n${QUOTE_BLOCK_DELIMITER}`;
}

function renderCodeBlock(node: Code): string {
	const sourceAttribute = node.lang ? `[source,${node.lang}]` : "[source]";

	return `${sourceAttribute}\n${CODE_BLOCK_DELIMITER}\n${node.value}\n${CODE_BLOCK_DELIMITER}`;
}

function renderTable(node: Table, context: RenderContext): string {
	const rows: TableRow[] = node.children;

	if (rows.length === 0) {
		return "";
	}

	const headerRow = rows[0];
	const bodyRows = rows.slice(1);
	const columnCount = headerRow.children.length;
	const equalColumnSpec = Array(columnCount).fill("1").join(",");

	const tableLines: string[] = [];
	tableLines.push(`[cols="${equalColumnSpec}",options="header"]`);
	tableLines.push(TABLE_DELIMITER);
	tableLines.push(renderTableRow(headerRow, context));

	for (const row of bodyRows) {
		tableLines.push(renderTableRow(row, context));
	}

	tableLines.push(TABLE_DELIMITER);

	return tableLines.join("\n");
}

function renderTableRow(row: TableRow, context: RenderContext): string {
	return row.children.map((cell) => "| " + escapeTableCell(renderInlineChildren(cell.children, context))).join(" ");
}

/**
 * Escape literal `|` characters inside a rendered table cell. AsciiDoc treats `|` as the cell
 * delimiter even within `+...+` passthrough spans, so an unescaped pipe (e.g. from an inline code
 * span like `number | string`) would split the cell and corrupt the row. `\|` renders as a literal
 * pipe inside the cell.
 */
function escapeTableCell(value: string): string {
	return value.replaceAll("|", "\\|");
}
