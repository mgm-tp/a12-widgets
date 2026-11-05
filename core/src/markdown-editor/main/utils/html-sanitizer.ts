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

/**
 * Which HTML the editor builds into real elements, and how attributes are cleaned first.
 *
 * Two questions, easy to mix up:
 *
 * 1. Block or inline? CommonMark decides — {@link COMMONMARK_BLOCK_TAGS}.
 * 2. Do we build it at all? We decide — {@link ALLOWED_TAGS}.
 *
 * A markdown file carries HTML from wherever the file came from, so a tag not on the list
 * is never built. It keeps its text.
 *
 * Measured against GFM's filtered tags (https://github.github.com/gfm/#disallowed-raw-html-extension-),
 * GitHub's own allowlist
 * (https://github.com/gjtorikian/html-pipeline/blob/main/lib/html_pipeline/sanitization_filter.rb)
 * and CommonMark (https://spec.commonmark.org/0.31.2/#html-blocks). Where we differ, the
 * list below says why.
 */

import type { TextFormatType } from "lexical";

import { ALLOWED_IMAGE_PROTOCOLS } from "./constants.js";

/**
 * The tag names CommonMark treats as block-level HTML — start condition 6, all 62 of them:
 * https://spec.commonmark.org/0.31.2/#html-blocks
 *
 * 0.31.2, not the 0.29 GFM is written against: 0.29 lists `source`, 0.31 swapped it for
 * `search`. We follow micromark, which is what actually reads the document. Neither name is
 * in {@link ALLOWED_TAGS}, so the difference never shows.
 */
const COMMONMARK_BLOCK_TAGS: ReadonlySet<string> = new Set(
	(
		"address article aside base basefont blockquote body caption center col " +
		"colgroup dd details dialog dir div dl dt fieldset figcaption figure " +
		"footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html " +
		"iframe legend li link main menu menuitem nav noframes ol optgroup " +
		"option p param search section summary table tbody td tfoot th thead " +
		"title tr track ul"
	).split(" ")
);

/**
 * The tags the editor builds as real elements.
 *
 * Left out on purpose:
 *
 * - tags markdown already writes (`p`, `h1`, `ul`, `table`, `a`, `b`) — they go to their own
 *   node instead, see {@link MARKDOWN_OWNED_TAGS}. Which tags those are was read off the
 *   specs: every example's output, minus what its input already held,
 * - tags that fetch, navigate or run (`script`, `iframe`, `form`) — never built at all.
 *
 * Twelve names here are not on GitHub's list: `address`, `article`, `aside`, `bdi`, `data`,
 * `footer`, `header`, `hgroup`, `main`, `nav`, `section`, `u`. GitHub's list predates HTML5
 * sectioning elements; none of them can load or run anything.
 *
 * `u`, `mark`, `sub` and `sup` are here for when their `features` key is off. With it on,
 * the parser claims the tag long before this list is read.
 */
export const ALLOWED_TAGS: ReadonlySet<string> = new Set([
	"abbr",
	"address",
	"article",
	"aside",
	"bdi",
	"bdo",
	"cite",
	"data",
	"dd",
	"details",
	"dfn",
	"div",
	"dl",
	"dt",
	"figcaption",
	"figure",
	"footer",
	"header",
	"hgroup",
	"ins",
	"kbd",
	"main",
	"mark",
	"nav",
	"q",
	"samp",
	"section",
	"small",
	"span",
	"sub",
	"summary",
	"sup",
	"time",
	"u",
	"var"
]);

/**
 * Tags handed to the node that already owns them, instead of being built generically.
 *
 * ```
 * <h1>x</h1>  ->  a real heading  ->  saved as "# x"
 * ```
 *
 * That is the point: the toolbar shows it as a heading, `#` shortcuts apply, a `<ul>` gets
 * list behaviour. The cost is the tag — it is written back in markdown's spelling.
 *
 * The test is not "does markdown write this tag". It is "does a node here already own it".
 * Markdown writes `<strong>`, never `<b>`, yet `<b>` is routed because `@lexical/html` maps
 * it to the bold format. Each one was checked by round-tripping it.
 *
 * Not here:
 *
 * - `del` — markdown writes it, but nothing claimed it, so routing dropped the tag and
 *   `<del>x</del>` came back as `x`. It is a format instead, see {@link HTML_TAG_TEXT_FORMATS}.
 * - `img`, `hr`, `br` — void, so they cannot be element nodes. They go to their own nodes in
 *   `mdast-html-element-extension.ts`.
 */
export const MARKDOWN_OWNED_TAGS: ReadonlySet<string> = new Set([
	"a",
	"b",
	"blockquote",
	"code",
	"em",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"i",
	"li",
	"ol",
	"p",
	"s",
	"strong",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tr",
	"ul"
]);

/**
 * Tags that are a text format rather than an element.
 *
 * `@lexical/html` already maps `b i s strong em code`. `<del>` is the gap: GFM renders
 * `~~x~~` as `<del>` (https://github.github.com/gfm/#strikethrough-extension-), so it is the
 * canonical HTML for strikethrough and nothing was reading it that way.
 *
 * Being a format is what reaches the toolbar. Caret inside `<del>x</del>`, the strikethrough
 * button lights up and pressing it takes the format off — same as `~~x~~`.
 */
export const HTML_TAG_TEXT_FORMATS: ReadonlyMap<string, TextFormatType> = new Map([["del", "strikethrough"]]);

/**
 * Attributes that may be copied onto a built element.
 *
 * `align dir id lang open title` are on GitHub's list too. `style` is ours: GitHub drops it
 * because its output renders inside GitHub's page, where a stray rule would clash with theirs.
 * Ours renders inside the host's document, where styling the block is most of the reason it was
 * hand-written. `class` is on the list for a smaller reason — see below, it is kept so the file
 * round-trips and never reaches the screen.
 *
 * No `hidden` and no `role`, and that follows GitHub rather than departing from it. Careful
 * here: the allowlist their old `html-pipeline` gem published does carry `role`, but the
 * renderer GitHub.com runs today does not. Ask it and see:
 *
 * ```sh
 * curl -sS -X POST https://api.github.com/markdown \
 *   -H 'Accept: application/vnd.github+json' \
 *   -d '{"mode":"gfm","text":"<div id=\"foo\" class=\"btn\" style=\"color:red\" hidden role=\"button\" aria-label=\"Sign in\" title=\"t\">Sign in</div>"}'
 * ```
 *
 * comes back `<div id="user-content-foo" title="t" dir="auto">Sign in</div>`. `hidden`, `role`
 * and the `aria-label` are all gone. {@link ALLOWED_ARIA_ATTRIBUTES} has the few `aria-` names
 * that do survive there.
 *
 * Why these two matter more here than on GitHub: each one lets a document hide a block or call
 * it something it is not, and unlike GitHub we do let a document style the box, filtered but
 * real. On its own each is small. Put together they are enough to paint something that looks
 * like part of the host's own screen and have a screen reader announce it as a button.
 *
 * Being on this list means the name is kept on the node and written back to the file. It does
 * not mean it reaches the element the reader sees: `style` is filtered first and `class` is left
 * off the screen altogether, because a class from a document would pick up the host's own
 * stylesheet rules. Both are in `html-element-node.ts`, which is the only place that builds an
 * element. Keeping them here is what stops the editor from deleting them from someone's file.
 *
 * `src` is the one whose *value* is checked, not just its name: it has to pass
 * {@link ALLOWED_IMAGE_PROTOCOLS}, so `javascript:` never reaches the page.
 *
 * No `href`, `srcset` or `formaction`. Links have their own syntax and their own node, which
 * already runs the check. `on…` names are refused in {@link isAllowedAttributeName}.
 */
const ALLOWED_ATTRIBUTES: ReadonlySet<string> = new Set([
	"align",
	"alt",
	"class",
	"dir",
	"height",
	"id",
	"lang",
	"open",
	"src",
	"style",
	"title",
	"width"
]);

/**
 * The `aria-` names a tag may carry, tag by tag.
 *
 * `aria-` used to be allowed as a whole prefix. That was too generous. It let a document write
 * `aria-hidden` on anything, which takes a block away from a screen reader while leaving it on
 * screen, and it let through `aria-controls`, `aria-owns` and `aria-labelledby`, which point at
 * an `id` and so can reach out of the document into the host's own page.
 *
 * GitHub is narrower, and narrower per tag. Ask the renderer:
 *
 * ```sh
 * curl -sS -X POST https://api.github.com/markdown \
 *   -H 'Accept: application/vnd.github+json' \
 *   -d '{"mode":"gfm","text":"<span aria-labelledby=\"x\">s</span>\n\n<summary aria-label=\"S\">sum</summary>"}'
 * ```
 *
 * and the span comes back bare while the summary keeps its `aria-label`. The same `aria-label`
 * survives on `<a>` and `<img>` and is dropped on `<div>`, `<span>`, `<td>` and `<kbd>`, and
 * `aria-hidden` is dropped on every tag tried. The rule behind it: a name may only be written
 * where the tag already has an accessible name of its own to replace.
 *
 * Which leaves one entry. GitHub keeps `aria-label` on `<a>` and `<img>` as well, and neither
 * reaches here: a link has its own node, and a picture becomes an `ImageNode`, which reads only
 * `src`, `alt`, `title` and the two sizes back out. `<summary>` is the one tag we build as
 * itself that already has a name of its own to replace.
 */
const ALLOWED_ARIA_ATTRIBUTES: ReadonlyMap<string, ReadonlySet<string>> = new Map<string, ReadonlySet<string>>([
	["summary", new Set(["aria-label"])]
]);

/**
 * The CSS properties a `style` attribute may still carry once it has been cleaned.
 *
 * A list of what is allowed, not a list of what is banned. A property that is not here is
 * dropped, and so is every property CSS adds later. The browser reads the value first, so what
 * is checked here is always a longhand: `border: 1px solid red` arrives as `border-top-width`,
 * `border-top-style`, `border-top-color` and the rest, and `background: red url(p.gif)` arrives
 * as `background-color` next to `background-image`. That is what makes the list safe — the one
 * longhand that loads a file is not on it, and no shorthand can bring it back.
 *
 * The question for each property is "does it only paint inside the box the document already
 * has". Not on the list, and why:
 *
 * - `position`, `top`/`right`/`bottom`/`left`, `inset…`, `z-index`, `transform…` — they take the
 *   box out of the page flow and put it on top of the host's own screen. That is how a fake
 *   login box is made.
 * - every `…-image`, `cursor`, `content`, `filter` — they take a `url(…)`, and the browser loads
 *   it as soon as the document opens. The author then knows who read the file, and when.
 * - `box-shadow`, `text-shadow`, `outline…` — they load nothing, but they paint outside the box,
 *   so a big offset can draw the author's words on top of the host's toolbar.
 * - `display`, `visibility`, `opacity`, `overflow`, `clip-path`, `mask…` — they can hide content
 *   that is still in the file. Someone who reads the document would never see it.
 * - `mix-blend-mode`, `backdrop-filter`, `pointer-events` — they change what is seen, or what is
 *   clicked, under the element.
 * - `float` and `clear` — a float cannot leave its container, but the blocks after it are drawn
 *   under it, so one tall float can cover the rest of the document. The same overlay, one
 *   container deeper.
 * - `unicode-bidi` — `bidi-override` paints the characters in an order the file does not have,
 *   so an address or an amount can read as something it is not.
 * - `text-indent` — a big negative one pushes the text off the side of the screen, which is the
 *   oldest way to keep words in a file that no reader will see.
 * - `letter-spacing`, `word-spacing`, `vertical-align`, `text-underline-offset` — each takes a
 *   length, and a negative one paints where the box is not: letters on top of each other, an
 *   inline run dropped into the line below, an underline drawn outside. Checking the value would
 *   work too; dropping the property is less to get right.
 * - `direction` — it adds no danger the `dir` attribute does not already have, and `dir` is the
 *   one a screen reader also reads. Two ways to say one thing, so the CSS one goes.
 * - `font-feature-settings`, `font-kerning`, `font-stretch`, every `font-variant-…`,
 *   `hyphens`, `tab-size`, `text-align-last` — almost never written by hand, and the font ones
 *   pick glyphs, so a run of characters can be drawn as something it does not say.
 *   `font-variant-caps` is the one worth naming: `small-caps` is `font-feature-settings:
 *   "smcp"` in another spelling, and `unicase` draws lower case as capitals, so `paypal.com`
 *   can be painted `PAYPAL.COM`.
 * - `table-layout` — nothing built here is a table box. `table`, `td` and the rest go to the
 *   table node instead (see {@link MARKDOWN_OWNED_TAGS}), and without `display` no `div` can
 *   become one.
 * - `all` — one word that would turn everything above back on.
 * - flex and grid — not dangerous, only not needed yet. They go in when a document needs them.
 *
 * Two rules this list cannot hold by itself, so the code that uses it has to:
 *
 * - a negative `margin-…` moves the block on top of what is above it, which is the same overlay
 *   without `position`. Negative values are refused.
 * - `!important` would win against the host's own stylesheet, so the priority is removed.
 */
export const ALLOWED_STYLE_PROPERTIES: ReadonlySet<string> = new Set([
	// Text. Nothing here can load a file: a web font needs an `@font-face` rule,
	// which needs a stylesheet, and `<style>` is not a tag we build.
	"color",
	"font-family",
	"font-size",
	"font-style",
	"font-weight",
	"line-height",
	"overflow-wrap",
	"text-align",
	"text-decoration-color",
	"text-decoration-line",
	"text-decoration-style",
	"text-decoration-thickness",
	"text-transform",
	"text-underline-position",
	"white-space",
	"word-break",

	// `white-space` is being split into these. New browsers report the new names, older ones
	// report the old, so both spellings are here and the same declaration works on both.
	"text-wrap-mode",
	"text-wrap-style",
	"white-space-collapse",

	// The box itself. `background-color` is the only background: the rest of that shorthand is
	// how a picture is loaded.
	"background-color",
	"box-sizing",
	"height",
	"margin-bottom",
	"margin-left",
	"margin-right",
	"margin-top",
	"max-height",
	"max-width",
	"min-height",
	"min-width",
	"padding-bottom",
	"padding-left",
	"padding-right",
	"padding-top",
	"width",

	// Borders, every longhand except `border-image-…` — its `source` takes a `url(…)`.
	"border-bottom-color",
	"border-bottom-left-radius",
	"border-bottom-right-radius",
	"border-bottom-style",
	"border-bottom-width",
	"border-left-color",
	"border-left-style",
	"border-left-width",
	"border-right-color",
	"border-right-style",
	"border-right-width",
	"border-top-color",
	"border-top-left-radius",
	"border-top-right-radius",
	"border-top-style",
	"border-top-width",

	// Lists and tables. Every one of these is inherited, which is the only way they land:
	// a `<div style="…">` around markdown's own list or table. `list-style-image` is missing
	// for the same reason as the backgrounds.
	"border-collapse",
	"border-spacing",
	"caption-side",
	"empty-cells",
	"list-style-position",
	"list-style-type"
]);

/**
 * The properties whose value may not be negative.
 *
 * A negative margin moves the block on top of what is above it. No `position` needed: it is the
 * same overlay with another spelling. `calc()` can work out a negative number too, so a value
 * with a bracket is refused together with one that has a minus.
 */
const NON_NEGATIVE_STYLE_PROPERTIES: ReadonlySet<string> = new Set([
	"margin-bottom",
	"margin-left",
	"margin-right",
	"margin-top"
]);

/** The element whose `style` is borrowed to read a declaration. Detached, never shown. */
let styleProbe: HTMLElement | undefined;

/**
 * Whether a value may be kept, once its property already passed {@link ALLOWED_STYLE_PROPERTIES}.
 *
 * `url(` is checked on every property, not only the ones known to hold a picture. The property
 * list is what stops the tracking request; this is a second lock, in case CSS gives some other
 * property a `url()` later.
 */
function isSafeStyleValue(property: string, value: string): boolean {
	if (value === "" || value.toLowerCase().includes("url(")) {
		return false;
	}

	return !NON_NEGATIVE_STYLE_PROPERTIES.has(property) || !/[-(]/.test(value);
}

/**
 * The declarations in a `style` attribute that may be painted, as property/value pairs.
 *
 * The browser does the reading: the value is given to a detached element and read back. What
 * comes back is always longhands, so `background: red url(p.gif)` arrives as `background-color`
 * next to `background-image`, and each one is checked on its own — the colour is kept, the
 * picture is not on {@link ALLOWED_STYLE_PROPERTIES}, and nothing is loaded. No shorthand can
 * hide anything, and whatever the browser could not read is already gone.
 *
 * The priority is never read, so an `!important` the author wrote is removed. It would win
 * against the host's own stylesheet, which is not a document's business.
 */
export function sanitizeStyleValue(value: string): [string, string][] {
	styleProbe ??= document.createElement("div");

	// Assigning replaces the whole block, so nothing is left over from the element before.
	styleProbe.style.cssText = value;

	const declarations: [string, string][] = [];

	for (let index = 0; index < styleProbe.style.length; index++) {
		const property = styleProbe.style.item(index);
		const declared = styleProbe.style.getPropertyValue(property);

		if (ALLOWED_STYLE_PROPERTIES.has(property) && isSafeStyleValue(property, declared)) {
			declarations.push([property, declared]);
		}
	}

	styleProbe.style.cssText = "";

	return declarations;
}

/** Whether a `src` may be kept: a picture is fetched, so only real web protocols pass. */
function isSafeImageSource(value: string): boolean {
	try {
		return ALLOWED_IMAGE_PROTOCOLS.has(new URL(value, document.baseURI).protocol);
	} catch {
		return false;
	}
}

/** Whether the editor may build this tag as a real element. */
export function isAllowedHtmlTag(tag: string): boolean {
	return ALLOWED_TAGS.has(tag);
}

/**
 * Whether this tag flows inside a line of text rather than standing on its own.
 *
 * "Not on the block list" is the whole test. The spec puts no limit on an inline tag name —
 * "not limited to current HTML tags, so custom tags … may be used",
 * https://spec.commonmark.org/0.31.2/#raw-html — so an unknown name lands on the inline
 * side, which is where the spec puts it too.
 */
export function isInlineHtmlTag(tag: string): boolean {
	return !COMMONMARK_BLOCK_TAGS.has(tag);
}

/**
 * `data-` names that something reads back. A document must not be able to write these.
 *
 * They are not decoration, they are instructions, and whoever reads them believes the editor
 * put them there. Matched as prefixes, so a longer name built on one of them is refused too.
 *
 * Every name the editor or one of its libraries writes is here, not only the ones something
 * reads back today. A marker that is write-only now gets a reader later, and a list that is
 * complete is one less thing to keep in step.
 *
 * - `data-role` (and `data-roles`), `data-testid` — how an A12 widget or a test hook is found.
 *   A document that ships its own would make a consuming project's test pick the wrong element.
 * - `data-panel-…` — the info panel. `data-panel-type` is read by its `importDOM`, and the
 *   selection code walks up to the nearest `[data-panel-type]`, so a forged one turns a plain
 *   block into a panel and breaks the panel above it.
 * - `data-token…` — the markdown source tokens. A forged one paints the author's own words in
 *   the colour the editor uses for markup it wrote itself.
 * - `data-selected` — the selection ring on an image, a directive or a panel.
 * - `data-language`, `data-highlight-language`, `data-theme` — read back by the code node when
 *   a `<pre>` is imported.
 * - `data-is-checklist`, `data-mso-list` — how `@lexical/list` decides that a list is a
 *   checklist, or that a paste came from Word.
 * - `data-gutter` — the line numbers drawn next to a code block.
 * - `data-raw-html` — the mark on markup the editor kept as text instead of building.
 *
 * Plain author names such as `data-id` or `data-type` stay allowed. Nothing here reads them,
 * and a hand-written document is where they belong.
 */
const RESERVED_ATTRIBUTE_PREFIXES: readonly string[] = [
	"data-gutter",
	"data-highlight-language",
	"data-is-checklist",
	"data-language",
	"data-mso-list",
	"data-panel-",
	"data-raw-html",
	"data-role",
	"data-selected",
	"data-testid",
	"data-theme",
	"data-token"
];

/**
 * The two libraries that keep their state in the DOM, matched anywhere in the name rather than
 * at the front.
 *
 * `data-lexical-…` and `data-mdast-…` are the usual shape, but not the only one:
 * `@lexical/table` writes `data-temporary-table-cell-lexical-key`, with the owner's name in the
 * middle. Matching the word wherever it sits catches that one, and the next one they add.
 *
 * What these do when a document forges them. Neither hides anything — the text still renders —
 * but each makes a library read the DOM wrong:
 *
 * - `data-lexical-decorator-boundary` marks the zero-size anchor Lexical parks beside a block
 *   decorator. `ElementDOMSlot.getFirstChildAnchor` steps over a first child carrying it, so
 *   Lexical’s idea of which DOM child is which shifts by one and the reconciler goes on to edit
 *   the wrong one. `LexicalMutations` also exempts the name from the sweep that throws out
 *   foreign DOM, so a forged one stays where anything else would be taken away.
 * - `data-mdast-child` names a marker `MdastHtmlExtension` puts where embedded markdown goes
 *   back in. The placeholder rule checks the element’s shape now and not just the name, so a
 *   forged one is no longer claimed. Blocking the name here is the second lock on that door.
 */
const RESERVED_ATTRIBUTE_WORDS: readonly string[] = ["lexical", "mdast"];

/** Whether this name belongs to us or to a library rather than to the author. */
function isReservedAttributeName(name: string): boolean {
	return (
		RESERVED_ATTRIBUTE_PREFIXES.some((prefix) => name.startsWith(prefix)) ||
		RESERVED_ATTRIBUTE_WORDS.some((word) => name.includes(word))
	);
}

/**
 * Whether this attribute name may be copied.
 *
 * `on…` is refused as a group before the list is read — the browser compiles those values
 * into a function and calls it
 * (https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-content-attributes),
 * so one miss would be enough. {@link isReservedAttributeName} is refused as a group for the
 * same reason: the `data-*` prefix below would otherwise hand a document the names the editor
 * and its libraries read back.
 *
 * `data-*` is still a prefix. `aria-*` is not: it is read off {@link ALLOWED_ARIA_ATTRIBUTES},
 * which asks the tag as well as the name. `tag` must be the tag the element will really be
 * built with — the one {@link sanitizeHtmlTag} gave back, not the one the document asked for.
 * A `<button aria-label="…">` becomes a `<span>`, and a span may not carry that name.
 *
 * The name is not checked against what `setAttribute` will take. HTML allows far more than it
 * looks — letters from any script, colons, dots — so a pattern narrow enough to be safe would
 * throw away attributes a person legitimately wrote. A name the browser refuses is caught where
 * the element is built instead.
 */
export function isAllowedAttributeName(name: string, tag: string): boolean {
	if (name.startsWith("on") || isReservedAttributeName(name)) {
		return false;
	}

	if (name.startsWith("aria-")) {
		return ALLOWED_ARIA_ATTRIBUTES.get(tag)?.has(name) === true;
	}

	return ALLOWED_ATTRIBUTES.has(name) || name.startsWith("data-");
}

/**
 * A tag from {@link ALLOWED_TAGS}, whatever was asked for. One that is not on the list
 * becomes a plain box of the same shape, so the text inside it still reads as written.
 *
 * Markdown is not the only way in. A tag can also come from saved state: a paste,
 * or an editor state the host stored and loaded again. This blocks `<script src="…">`
 * and `<iframe>` on those ways in too.
 */
export function sanitizeHtmlTag(tag: string): string {
	const lowercased = tag.toLowerCase();

	if (isAllowedHtmlTag(lowercased)) {
		return lowercased;
	}

	return isInlineHtmlTag(lowercased) ? "span" : "div";
}

/**
 * The name/value pairs among `entries` that may be kept, cleaned and lower-cased.
 *
 * Takes pairs rather than an element so that attributes which never were an element — the
 * ones in a saved editor state — are held to the same rules. Anything that is not a pair of
 * strings is dropped: this runs on JSON, which is only the shape it claims to be.
 */
export function sanitizeAttributeEntries(
	entries: Iterable<readonly [unknown, unknown]>,
	tag: string
): Record<string, string> {
	const attributes: Record<string, string> = {};

	for (const [name, value] of entries) {
		if (typeof name !== "string" || typeof value !== "string") {
			continue;
		}

		const lowercased = name.toLowerCase();

		if (!isAllowedAttributeName(lowercased, tag)) {
			continue;
		}

		if (lowercased === "src") {
			if (isSafeImageSource(value)) {
				attributes.src = value;
			}

			continue;
		}

		attributes[lowercased] = value;
	}

	return attributes;
}

/**
 * The attributes of `element` that may be kept, cleaned and lower-cased.
 *
 * `tag` is the tag the element will be built with, which is not always its own: see
 * {@link isAllowedAttributeName}.
 */
export function sanitizeHtmlAttributes(element: Element, tag: string): Record<string, string> {
	return sanitizeAttributeEntries(
		Array.from(element.attributes).map(({ name, value }) => [name, value] as const),
		tag
	);
}

/**
 * The same, for attributes that are already a record — one restored from JSON, say.
 *
 * `Object.entries` throws on `null` and `undefined` and gives back nothing useful for a
 * number or a string, so a state whose `attributes` is not an object ends up with none
 * rather than throwing on the way in.
 */
export function sanitizeAttributeRecord(attributes: unknown, tag: string): Record<string, string> {
	if (typeof attributes !== "object" || attributes === null) {
		return {};
	}

	return sanitizeAttributeEntries(Object.entries(attributes), tag);
}
