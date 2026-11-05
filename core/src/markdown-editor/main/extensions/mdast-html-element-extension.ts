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

import { $createHorizontalRuleNode, configExtension } from "@lexical/extension";
import {
	contextValue,
	defineImportRule,
	DOMImportExtension,
	ImportTextFormat,
	InlineSchema,
	NestedBlockSchema,
	sel
} from "@lexical/html";
import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { $exportViaDOM, ImportContextMarkdown, MdastHtmlExtension, MdastImportExtension } from "@lexical/mdast";
import type { LexicalNode } from "lexical";
import {
	$createLineBreakNode,
	$getState,
	$isLineBreakNode,
	$setState,
	createState,
	defineExtension,
	TEXT_TYPE_TO_FORMAT
} from "lexical";
import type { Html, Literal, MdeRawHtml, Parent, Root } from "mdast";
import type { Handle, Options as ToMarkdownExtension } from "mdast-util-to-markdown";

import { $createHtmlCommentNode, $isHtmlCommentNode, HtmlCommentNode } from "../nodes/html-comment-node.js";
import { $createHtmlElementNode, $isHtmlElementNode, HtmlElementNode } from "../nodes/html-element-node.js";
import type { ImageNode } from "../nodes/image-node.js";
import { $createImageNode, $isImageNode, readSize } from "../nodes/image-node.js";
import { $createRawHtmlTextNode, $isRawHtmlTextNode, RawHtmlTextNode } from "../nodes/raw-html-text-node.js";
import {
	HTML_TAG_TEXT_FORMATS,
	isAllowedHtmlTag,
	isInlineHtmlTag,
	MARKDOWN_OWNED_TAGS,
	sanitizeHtmlAttributes
} from "../utils/html-sanitizer.js";

import { $exportImage } from "./mdast-image-extension.js";

/** The zero-width space `MdastHtmlExtension` puts inside an inline placeholder. */
const ZERO_WIDTH_SPACE = "\u200b";

/**
 * Whether `element` is a marker `MdastHtmlExtension` put where embedded markdown goes back in,
 * rather than something the document wrote.
 *
 * The markers are `<span>`s and `<template>`s, so this rule would claim them and the markdown
 * would be lost. But the attribute alone is not proof of one: it is read off HTML the document
 * supplied, so a document can write `<span data-mdast-child="0">x</span>` itself, and then the
 * span is handed on to the placeholder rule — which finds no batch under that number, returns
 * nothing, and the author's tag and text are gone from the saved file.
 *
 * So the shape is checked as well as the name. `MdastHtmlExtension` writes exactly three
 * things, and nothing else counts:
 *
 * - `<template data-mdast-child="N"></template>`, empty,
 * - `<span data-mdast-child="N">&#8203;</span>`, holding that one character and nothing else,
 * - `<span data-mdast-inline-root="true">`, the element the whole inline value is parsed into,
 *   so it sits directly under `<body>`. A copy the document wrote is inside that one instead.
 *
 * `N` is the index of a child the extension collected, so it is digits. Anything else with
 * these names is the document's own, and goes through the normal path, where
 * {@link sanitizeHtmlAttributes} drops the forged attribute.
 */
function isMdastPlaceholder(element: Element): boolean {
	const child = element.getAttribute("data-mdast-child");

	if (child !== null) {
		if (!/^\d+$/.test(child)) {
			return false;
		}

		const tag = element.tagName.toLowerCase();

		return (
			// A `<template>`'s children hang off its content fragment, which is what `innerHTML`
			// reads, so an empty string is the real test for an empty one.
			(tag === "template" && element.innerHTML === "") ||
			(tag === "span" && element.childElementCount === 0 && element.textContent === ZERO_WIDTH_SPACE)
		);
	}

	return (
		element.hasAttribute("data-mdast-inline-root") &&
		element.tagName.toLowerCase() === "span" &&
		element.parentElement?.tagName.toLowerCase() === "body"
	);
}

/**
 * A value that is nothing but comments.
 *
 * Steps a character at a time rather than `[\s\S]*?`, so a value full of comments cannot backtrack.
 */
const COMMENT_ONLY = /^\s*(?:<!--(?:[^-]|-(?!->))*-->\s*)+$/;

/** Start condition 1: a block whose content is literal text, not markup to parse. */
const LITERAL_TEXT_BLOCK = /^<(?:pre|script|style|textarea)(?=[\s/>]|$)/i;

/** The mdast types such a node is renamed to, so nothing else claims them. */
const RAW_HTML = "mdeRawHtml";
const HTML_COMMENT = "mdeHtmlComment";

declare module "mdast" {
	interface MdeRawHtml extends Literal {
		type: "mdeRawHtml";
	}
	interface MdeHtmlComment extends Literal {
		type: "mdeHtmlComment";
	}
	interface BlockContentMap {
		mdeRawHtml: MdeRawHtml;
		mdeHtmlComment: MdeHtmlComment;
	}
	interface PhrasingContentMap {
		mdeRawHtml: MdeRawHtml;
		mdeHtmlComment: MdeHtmlComment;
	}
	interface RootContentMap {
		mdeRawHtml: MdeRawHtml;
		mdeHtmlComment: MdeHtmlComment;
	}
}

/**
 * Claims raw HTML before `MdastHtmlExtension` hands it to the DOM, because it must never
 * become elements. Two kinds, both CommonMark block start conditions
 * (https://spec.commonmark.org/0.31.2/#html-blocks):
 *
 * - comments (condition 2), which the DOM path deletes — losing `<!-- prettier-ignore -->`
 *   and anything like it,
 * - `<pre>`, `<script>`, `<style>`, `<textarea>` (condition 1), which hold literal text.
 *   `DOMParser` files `<script>` and `<style>` under `<head>`, which the walk never visits,
 *   so those blocks simply disappeared.
 *
 * Keeping them out of the DOM is also what GFM does: it escapes the leading `<` when it *renders*
 * (https://github.github.com/gfm/#disallowed-raw-html-extension-)
 * and leaves the source alone. The source is what this editor produces.
 */
function markRawHtml(parent: Parent): void {
	parent.children.forEach((child, index) => {
		if (child.type === "html") {
			if (COMMENT_ONLY.test(child.value)) {
				parent.children[index] = { type: HTML_COMMENT, value: child.value, position: child.position };
			} else if (LITERAL_TEXT_BLOCK.test(child.value.trimStart())) {
				parent.children[index] = { type: RAW_HTML, value: child.value, position: child.position };
			}

			return;
		}

		// In mdast, nested nodes only ever live in `children`.
		if ("children" in child) {
			markRawHtml(child);
		}
	});
}

/**
 * Runs before the reassembly `MdastHtmlExtension` contributes, because this extension sits
 * closer to the editor root and the rules merged later are put first.
 */
const rawHtmlFromMarkdown = {
	transforms: [
		(tree: Root): void => {
			markRawHtml(tree);
		}
	]
};

/** Writes such a node back as itself, for the trees that are frozen rather than exported. */
const rawHtmlToMarkdown: ToMarkdownExtension = {
	handlers: {
		[RAW_HTML]: ((node: Literal) => node.value) as Handle,
		[HTML_COMMENT]: ((node: Literal) => node.value) as Handle
	}
};

/**
 * Elements with no closing tag: HTML's void elements
 * (https://html.spec.whatwg.org/multipage/syntax.html#void-elements) plus `param`, dropped
 * from the spec but still in old documents. CommonMark has no such list to borrow.
 */
const VOID_TAGS: ReadonlySet<string> = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);

/** Writes an opening tag: `<a href="x" class="y">`. */
function openingTag(tag: string, attributes: Iterable<[string, string]>): string {
	const written = Array.from(attributes)
		.map(([name, value]) => ` ${name}="${value.replaceAll('"', "&quot;")}"`)
		.join("");

	return `<${tag}${written}>`;
}

/** An element's attributes as name/value pairs, in the order they were written. */
function attributePairsOf(element: Element): [string, string][] {
	return Array.from(element.attributes).map(({ name, value }) => [name, value] as [string, string]);
}

/** The same, for an element that has not been turned into a node yet. */
function openingTagOf(element: Element, tag: string): string {
	return openingTag(tag, attributePairsOf(element));
}

/**
 * Turns an allowed HTML element into an {@link HtmlElementNode}, keeping its tag and cleaned
 * attributes, and imports what was inside as its children.
 *
 * Registered as a wildcard so it sees every element, and ahead of `@lexical/html`'s own
 * wildcard, which would throw the tag away.
 */
const HtmlElementRule = defineImportRule({
	$import: (ctx, element, $next) => {
		const tag = element.tagName.toLowerCase();

		if (isMdastPlaceholder(element)) {
			return $next();
		}

		// `<hr>` and `<br>` are void, so neither can be an element node. Both go to the node
		// that draws them: the spec names these exact tags as what each construct renders to,
		// so a reader sees a rule and a broken line either way.
		//
		// - thematic break -> `<hr />`  https://spec.commonmark.org/0.31.2/#thematic-breaks
		// - hard break     -> `<br />`  https://spec.commonmark.org/0.31.2/#hard-line-breaks
		if ((tag === "hr" || tag === "br") && ctx.get(ImportContextMarkdown)) {
			if (tag === "hr") {
				// No tag kept: every markdown spelling of a rule means the same thing, so it
				// settles into the one the serializer writes.
				return [$createHorizontalRuleNode()];
			}

			// A break does keep its tag. A bare newline is a soft break, which does not break
			// the line at all, so `<br>` has to survive as itself.
			const node = $createLineBreakNode();

			$setState(node, htmlVoidTag, openingTagOf(element, tag));

			return [node];
		}

		if (tag === "img" && ctx.get(ImportContextMarkdown)) {
			const image = $importImageElement(element);

			if (image !== null) {
				return image;
			}
		}

		// A format tag becomes that format, so the toolbar sees it: the caret inside
		// `<del>x</del>` lights the strikethrough button. Fills the gap `@lexical/html` leaves.
		const format = HTML_TAG_TEXT_FORMATS.get(tag);

		if (format !== undefined) {
			return ctx.$importChildren(element, {
				context: [contextValue(ImportTextFormat, ctx.get(ImportTextFormat) | TEXT_TYPE_TO_FORMAT[format])]
			});
		}

		// A tag markdown owns goes to the node that owns it: `$next()` is the rest of the
		// chain — paragraph, heading, list, table, inline-format rules.
		//
		// An `<a>` with no `href` is the exception. Markdown cannot write a link with no
		// address, so routing it turns `<a>22</a>` into `[22]()` — a different document.
		if (MARKDOWN_OWNED_TAGS.has(tag) && (tag !== "a" || element.hasAttribute("href"))) {
			return $next();
		}

		if (!isAllowedHtmlTag(tag)) {
			// From the clipboard there is no markdown to preserve, so the usual rules apply.
			if (!ctx.get(ImportContextMarkdown)) {
				return $next();
			}

			// From a document the tags stay as text and what sat between them is imported
			// normally, so `<p>hello *world*</p>` keeps both tags and still italicises
			// `*world*`. GitHub does the same with the tags it refuses.
			//
			// Rebuilt from the element, not read off `outerHTML` — by now that holds
			// `MdastHtmlExtension`'s markers, which must never reach the document.
			const opening = $createRawHtmlTextNode(openingTagOf(element, tag));

			return VOID_TAGS.has(tag)
				? [opening]
				: [opening, ...ctx.$importChildren(element), $createRawHtmlTextNode(`</${tag}>`)];
		}

		const node = $createHtmlElementNode(tag, sanitizeHtmlAttributes(element, tag));

		// `NestedBlockSchema` leaves an inline run alone instead of wrapping it in a
		// paragraph, so `<div>text</div>` stays one line.
		node.append(...ctx.$importChildren(element, { schema: isInlineHtmlTag(tag) ? InlineSchema : NestedBlockSchema }));

		return [node];
	},
	match: sel.any(),
	name: "@a12/markdown-editor/html-element"
});

/**
 * Raw HTML that never became an element — an unclosed tag, a tag nobody builds — kept as
 * characters rather than as ordinary text, so it is not escaped on the way out.
 */
const $importRawHtml: MdastImportHandler<Html | MdeRawHtml> = (node) => $createRawHtmlTextNode(node.value);

/** Writes the tag back exactly as it came in, with no escaping. */
const $exportRawHtmlText: MdastExportHandler = (node) =>
	$isRawHtmlTextNode(node) ? { type: "html", value: node.getTextContent() } : null;

/**
 * The tag a void element was written with, when it was written as HTML.
 *
 * `<img>`, `<hr>` and `<br>` cannot be {@link HtmlElementNode}s — Lexical deletes an inline
 * element with no children, and says so: "Empty inline elements are removed from the
 * EditorState". So each goes to the node that draws it, and the original tag rides here so
 * the document is not rewritten as `![](…)` or `***` on the way out.
 */
const htmlVoidTag = createState("mdeHtmlVoidTag", {
	parse: (value): string => (typeof value === "string" ? value : "")
});

/** Whether `value` is one stored attribute: a pair of strings. */
function isAttributePair(value: unknown): value is [string, string] {
	return Array.isArray(value) && value.length === 2 && typeof value[0] === "string" && typeof value[1] === "string";
}

/**
 * The attributes an `<img>` arrived with, in the order they were written.
 *
 * Held as data rather than read back out of {@link htmlVoidTag} on the way out. The export
 * rebuilds the tag from the node, so the attributes the editor cannot change — a `class`, an
 * `id`, a `style` — have to survive somewhere, and this is that somewhere. Parsing them back
 * out of the stored tag would mean running an HTML parser over whatever the document held.
 *
 * This is state, so it is also whatever a saved editor state says it is. Anything that is not
 * a pair of strings is dropped on the way in.
 */
const htmlImageAttributes = createState("mdeHtmlImageAttributes", {
	parse: (value): [string, string][] => (Array.isArray(value) ? value.filter(isAttributePair) : []),
	isEqual: (one, other) =>
		one.length === other.length && one.every(([name, value], at) => name === other[at]![0] && value === other[at]![1])
});

/** The picture for an `<img>` from a document, or `null` when its `src` was refused. */
function $importImageElement(element: Element): LexicalNode[] | null {
	const attributes = sanitizeHtmlAttributes(element, "img");
	const src = attributes.src;

	if (src === undefined) {
		// No `src`, or a `src` the protocol check refused. Keep the tag as the text it is
		// rather than drawing a broken picture or quietly dropping the line.
		return null;
	}

	const image = $createImageNode({
		src,
		altText: attributes.alt ?? "",
		title: attributes.title,
		width: readSize(attributes.width),
		height: readSize(attributes.height)
	});

	$setState(image, htmlVoidTag, openingTagOf(element, "img"));
	$setState(image, htmlImageAttributes, attributePairsOf(element));

	return [image];
}

/** Puts `value` on the tag, or takes the attribute off when there is nothing to write. */
function writeAttribute(attributes: Map<string, string>, name: string, value: string | undefined): void {
	if (value === undefined || value === "") {
		attributes.delete(name);
	} else {
		attributes.set(name, value);
	}
}

/**
 * The `<img>` tag a picture is written back as: the attributes it arrived with, with what the
 * node says now written over them.
 *
 * {@link htmlImageAttributes} alone is not enough. The right-click menu's dialog and `setSize`
 * change the node, not the stored attributes, so writing those back as they came would throw
 * the changes away — a new address typed into the dialog would be gone the moment the document
 * was saved.
 *
 * Anything the tag carried that the editor cannot change — a `class`, an `id`, a `style` — is
 * left where it was, so only the fields it can change ever move.
 */
function $imageTag(node: ImageNode): string {
	const attributes = new Map($getState(node, htmlImageAttributes));
	const width = node.getWidth();
	const height = node.getHeight();

	attributes.set("src", node.getSrc());

	// An empty `alt` means something of its own — "this picture is decoration" — so it is
	// kept when the tag came with one. Everywhere else an empty value is no value.
	if (node.getAltText() !== "" || attributes.has("alt")) {
		attributes.set("alt", node.getAltText());
	}

	writeAttribute(attributes, "title", node.getTitle());
	writeAttribute(attributes, "width", width === undefined ? undefined : String(width));
	writeAttribute(attributes, "height", height === undefined ? undefined : String(height));

	return openingTag("img", attributes);
}

/**
 * Writes a picture back as its original `<img>` tag, or as `![alt](src)` when the document
 * used that. Both live here because only one handler runs per node type.
 */
const $exportImageOrHtml: MdastExportHandler = (node, ctx) => {
	if ($isImageNode(node)) {
		const tag = $getState(node, htmlVoidTag);

		if (tag !== "") {
			return { type: "html", value: $imageTag(node) };
		}
	}

	return $exportImage(node, ctx);
};

/**
 * Writes a line break back as the `<br>` it came from.
 *
 * `null` for a break the author typed — two trailing spaces or a backslash — so the handler
 * that knows which spelling they used still gets it. Without this a `<br>` came back as a
 * bare newline, which markdown reads as a soft break: the line stopped breaking at all.
 */
const $exportLineBreakOrHtml: MdastExportHandler = (node) => {
	const tag = $isLineBreakNode(node) ? $getState(node, htmlVoidTag) : "";

	return tag === "" ? null : { type: "html", value: tag };
};

/** Writes a comment back exactly as it was written. */
const $exportHtmlComment: MdastExportHandler = (node) =>
	$isHtmlCommentNode(node) ? { type: "html", value: node.getComment() } : null;

/**
 * Writes an {@link HtmlElementNode} back as the HTML it stands for.
 *
 * A block element goes through `$exportViaDOM`, which renders the node's own `exportDOM`
 * and puts the children back in as markdown, set off by blank lines. That is the shape
 * CommonMark needs for an HTML block — https://spec.commonmark.org/0.31.2/#html-blocks.
 *
 * An inline element cannot use that. `$exportViaDOM` breaks the line around the content it
 * embeds, which is right for a `<summary>` on its own but wrong in the middle of a
 * sentence — and worse, the extra lines make the next save produce a different document
 * than the last one. So an inline element is written the way the spec describes raw inline
 * HTML instead: the two tags as raw HTML, the content between them as ordinary markdown —
 * https://spec.commonmark.org/0.31.2/#raw-html. Nothing is added, so saving twice writes the
 * same thing twice.
 */
const $exportHtmlElement: MdastExportHandler = (node, ctx) => {
	if (!$isHtmlElementNode(node)) {
		return null;
	}

	if (!node.isInline()) {
		return $exportViaDOM(node, ctx);
	}

	const tag = node.getTag();

	return [
		{ type: "html", value: openingTag(tag, Object.entries(node.getAttributes())) },
		...ctx.exportInline(node),
		{ type: "html", value: `</${tag}>` }
	];
};

/**
 * Renders the HTML written in markdown, instead of showing it as text.
 *
 * Off unless the `htmlTags` feature is on. With it off the editor has no HTML support at all,
 * and raw HTML is what markdown says it is without one: text. It is escaped once on the way out
 * — `\<div>` — and stays that way.
 *
 * ```md
 * <div style="background: red">text</div>
 * ```
 *
 * With it on, that is a real `<div>` with a red background and the word `text` editable inside,
 * written back as the same line. One node type covers every tag:
 * {@link HtmlElementNode} holds the tag name and attributes as data, so there is no class per tag.
 *
 * {@link MdastHtmlExtension} does the reading — CommonMark breaks an HTML block at every
 * blank line, so it counts tags to glue the pieces back, parses with `DOMParser`, and puts
 * the markdown that sat between the tags back in place. That is what makes `<details>` work.
 *
 * Nothing is trusted: only the tags and attributes in `html-sanitizer.ts` are built,
 * every `on…` is refused, and anything not built keeps its text — unescaped, so the tags a
 * document arrived with are the tags it leaves with.
 */
export const MdastHtmlElementExtension = defineExtension({
	name: "@a12/mdast/HtmlElement",
	nodes: [HtmlCommentNode, HtmlElementNode, RawHtmlTextNode],

	dependencies: [
		MdastHtmlExtension,
		configExtension(DOMImportExtension, { rules: [HtmlElementRule] }),
		configExtension(MdastImportExtension, {
			importRules: [
				{ type: RAW_HTML, $import: $importRawHtml },
				{ type: HTML_COMMENT, $import: (node: Literal): HtmlCommentNode => $createHtmlCommentNode(node.value) },
				{ type: "html", $import: $importRawHtml }
			],
			exportRules: [
				{ type: "mde-html-element", $export: $exportHtmlElement },
				{ type: "mde-raw-html-text", $export: $exportRawHtmlText },
				{ type: "mde-image", $export: $exportImageOrHtml },
				{ type: "linebreak", $export: $exportLineBreakOrHtml },
				{ type: "mde-html-comment", $export: $exportHtmlComment }
			],
			mdastExtensions: [rawHtmlFromMarkdown],
			toMarkdownExtensions: [rawHtmlToMarkdown]
		})
	]
});
