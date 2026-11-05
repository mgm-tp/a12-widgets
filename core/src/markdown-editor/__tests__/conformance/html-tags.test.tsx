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
import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { defineMarkdownEditorExtension } from "../../main/extensions.js";
import { resolveFeatures } from "../../main/optional-features.js";
import {
	ALLOWED_TAGS,
	HTML_TAG_TEXT_FORMATS,
	isAllowedHtmlTag,
	isInlineHtmlTag,
	MARKDOWN_OWNED_TAGS
} from "../../main/utils/html-sanitizer.js";
import { ControlledEditor, getSurfaceByMode, getToolbarItem, INLINE_FORMAT_FEATURES } from "../utils/index.js";

/**
 * Every tag the editor treats specially, round-tripped one by one.
 *
 * The two lists in `html-sanitizer.ts` say what the editor does with a tag, but saying it
 * is not the same as it working. `<del>` was on the routed list for a while and no import
 * rule anywhere claimed it, so the tag was quietly dropped and `<del>x</del>` came back as
 * `x` — the words survived, the meaning did not. A test that only checked "the text is
 * still there" would have passed.
 *
 * So each tag is pinned to the exact markdown it produces, and the tables below are
 * checked against the real sets: add a tag to either list without a case here and the
 * coverage test fails before anything else gets a chance to go quiet.
 */
/** Everything here is about the `htmlTags` feature, which is off unless a host asks for it. */
const HTML_TAGS_ON = defineMarkdownEditorExtension(resolveFeatures({ htmlTags: true }));

function roundTrip(markdown: string): string {
	const editor = buildEditorFromExtensions(HTML_TAGS_ON);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	return editor.read(() => $convertToMarkdownString());
}

/** `[tag, what a document holds, what the editor writes back]`. */
const ROUTED: [string, string, string][] = [
	["a", '<a href="https://e.com">TXT</a>', "[TXT](https://e.com)"],
	["b", "<b>TXT</b>", "**TXT**"],
	["blockquote", "<blockquote>TXT</blockquote>", "> TXT"],
	["code", "<code>TXT</code>", "`TXT`"],
	["em", "<em>TXT</em>", "*TXT*"],
	["h1", "<h1>TXT</h1>", "# TXT"],
	["h2", "<h2>TXT</h2>", "## TXT"],
	["h3", "<h3>TXT</h3>", "### TXT"],
	["h4", "<h4>TXT</h4>", "#### TXT"],
	["h5", "<h5>TXT</h5>", "##### TXT"],
	["h6", "<h6>TXT</h6>", "###### TXT"],
	["i", "<i>TXT</i>", "*TXT*"],
	["li", "<ul><li>TXT</li></ul>", "- TXT"],
	["ol", "<ol><li>TXT</li></ol>", "1. TXT"],
	["p", "<p>TXT</p>", "TXT"],
	["s", "<s>TXT</s>", "~~TXT~~"],
	["strong", "<strong>TXT</strong>", "**TXT**"],
	["table", "<table><tr><td>TXT</td></tr></table>", "| TXT |\n| --- |"],
	["tbody", "<table><tbody><tr><td>TXT</td></tr></tbody></table>", "| TXT |\n| --- |"],
	["td", "<table><tr><td>TXT</td></tr></table>", "| TXT |\n| --- |"],
	[
		"tfoot",
		"<table><tbody><tr><td>TXT</td></tr></tbody><tfoot><tr><td>F</td></tr></tfoot></table>",
		"| TXT |\n| --- |\n| F   |"
	],
	["th", "<table><thead><tr><th>TXT</th></tr></thead></table>", "| TXT |\n| --- |"],
	[
		"thead",
		"<table><thead><tr><th>TXT</th></tr></thead><tbody><tr><td>B</td></tr></tbody></table>",
		"| TXT |\n| --- |\n| B   |"
	],
	["tr", "<table><tr><td>TXT</td></tr></table>", "| TXT |\n| --- |"],
	["ul", "<ul><li>TXT</li></ul>", "- TXT"]
];

/** A tag that is built as itself needs no expected markdown: it writes itself back. */
const BUILT_SAMPLE: Record<string, string> = {
	details: "<details><summary>S</summary>\n\nTXT\n\n</details>",
	dd: "<dl><dt>T</dt><dd>TXT</dd></dl>",
	dt: "<dl><dt>TXT</dt><dd>D</dd></dl>",
	summary: "<details><summary>TXT</summary>\n\nB\n\n</details>"
};

function builtSample(tag: string): string {
	return BUILT_SAMPLE[tag] ?? `<${tag}>TXT</${tag}>`;
}

describe("MarkdownEditor HTML tags — every tag the lists name", () => {
	test("the routed cases cover MARKDOWN_OWNED_TAGS exactly", () => {
		expect(ROUTED.map(([tag]) => tag).sort()).toEqual([...MARKDOWN_OWNED_TAGS].sort());
	});

	test.each(ROUTED)("%s is handed to the node that owns it", (_tag, markdown, written) => {
		// Pinned to the exact output: a tag that loses its meaning still keeps its words, so
		// only the written markdown shows whether the right node took it.
		expect(roundTrip(markdown)).toBe(written);

		// And saving twice writes the same thing twice.
		expect(roundTrip(written)).toBe(written);
	});

	test.each([...ALLOWED_TAGS].sort())("%s is built as itself and keeps its tag", (tag) => {
		const markdown = builtSample(tag);
		const once = roundTrip(markdown);

		// The tag survives. Without this, a tag nothing claims is hoisted away and only its
		// content comes back — which is exactly how `<del>` went missing.
		expect(once).toContain(`<${tag}`);
		expect(once).toContain("TXT");
		expect(roundTrip(once)).toBe(once);
	});
});

/**
 * A tag that stands for a text format has to reach the toolbar, not just the markdown.
 *
 * Round-tripping is only half of it. `<del>x</del>` survived a save perfectly while it was
 * built as a plain element — and the caret inside it left the strikethrough control dark,
 * because a generic element is not a format. So each of these is driven the way a person
 * would: put the caret in, read the control, select the word, press it, and check the
 * format came off.
 */
describe("MarkdownEditor HTML tags — formats reach the toolbar", () => {
	async function placeCaret(surface: HTMLElement): Promise<void> {
		await userEvent.click(surface.querySelector<HTMLElement>("[data-lexical-text]") ?? surface);
		await userEvent.keyboard("{Home}");
	}

	test.each([
		["<del>text</del>", "strikethrough"],
		["<s>text</s>", "strikethrough"],
		["<b>text</b>", "bold"],
		["<strong>text</strong>", "bold"],
		["<i>text</i>", "italic"],
		["<em>text</em>", "italic"],
		["<mark>text</mark>", "highlight"],
		["<u>text</u>", "underline"],
		["<sub>text</sub>", "subscript"],
		["<sup>text</sup>", "superscript"],
		// The markdown spellings, as the baseline every HTML one has to match.
		["~~text~~", "strikethrough"],
		["**text**", "bold"],
		["*text*", "italic"]
	])("%s lights %s, and pressing it takes the format off", async (markdown, control) => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor
				initialValue={markdown}
				features={{ ...INLINE_FORMAT_FEATURES, htmlTags: true }}
				onChange={onChange}
				emitMode="change"
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("text"));

		// The caret alone is enough to light it — no selection needed.
		await userEvent.click(surface.querySelector<HTMLElement>("[data-lexical-text]") ?? surface);

		expect(getToolbarItem(container, control)).toHaveAttribute("aria-pressed", "true");

		// Then select the word and press, the way a person takes a format off.
		await placeCaret(surface);
		await userEvent.keyboard("{Shift>}{End}{/Shift}");
		await userEvent.click(getToolbarItem(container, control));

		await waitFor(() => expect(onChange).toHaveBeenCalled());
		expect(String(onChange.mock.calls.at(-1)?.[0])).toBe("text");
	});

	test("the tags this editor maps itself are the ones @lexical/html leaves out", () => {
		// `b i s strong em code` already carry a format bit upstream. Anything here is a gap
		// the editor fills in, and every one of them is exercised above.
		expect([...HTML_TAG_TEXT_FORMATS.keys()]).toEqual(["del"]);
	});
});

/**
 * The lists in `html-sanitizer.ts` against the two specs, so they cannot quietly disagree.
 *
 * Each check is a rule the specs set, or a rule the lists set for themselves. A tag that
 * lands in two lists, or in none, is how `<del>` went missing.
 */
describe("MarkdownEditor HTML tags — the lists agree with the specs", () => {
	/** GFM "Disallowed Raw HTML": https://github.github.com/gfm/#disallowed-raw-html-extension- */
	const GFM_FILTERED = ["title", "textarea", "style", "xmp", "iframe", "noembed", "noframes", "script", "plaintext"];

	/**
	 * Tags markdown syntax generates, read off the example outputs of both specs: every tag
	 * an example's HTML holds that its markdown did not.
	 */
	const MARKDOWN_GENERATES = [
		"p",
		"a",
		"code",
		"pre",
		"em",
		"li",
		"ul",
		"strong",
		"blockquote",
		"hr",
		"ol",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"img",
		"br",
		"table",
		"thead",
		"tbody",
		"tr",
		"th",
		"td",
		"input",
		"del"
	];

	/** Handled in the import rule itself, before any list is read. */
	const HANDLED_BY_RULE = ["img", "hr", "br", "pre"];

	test("no tag is in two lists at once", () => {
		expect([...MARKDOWN_OWNED_TAGS].filter((tag) => ALLOWED_TAGS.has(tag))).toEqual([]);
		expect(
			[...HTML_TAG_TEXT_FORMATS.keys()].filter((tag) => ALLOWED_TAGS.has(tag) || MARKDOWN_OWNED_TAGS.has(tag))
		).toEqual([]);
	});

	test("nothing GFM filters is ever built", () => {
		// GFM escapes these nine when it renders. Building any of them would put something on
		// the page that GitHub refuses to.
		expect(GFM_FILTERED.filter((tag) => isAllowedHtmlTag(tag) || MARKDOWN_OWNED_TAGS.has(tag))).toEqual([]);
	});

	test("every tag markdown can generate is handled somewhere", () => {
		// Otherwise a construct the editor writes itself would come back as plain text.
		const unhandled = MARKDOWN_GENERATES.filter(
			(tag) =>
				!isAllowedHtmlTag(tag) &&
				!MARKDOWN_OWNED_TAGS.has(tag) &&
				!HTML_TAG_TEXT_FORMATS.has(tag) &&
				!HANDLED_BY_RULE.includes(tag)
		);

		// `<input>` is the one left out: GFM makes one for `- [x]`, and a document should not
		// be able to put a form control on the page. It keeps its text.
		expect(unhandled).toEqual(["input"]);
	});

	test("block and inline follow CommonMark's list, not our taste", () => {
		// Start condition 6 decides: https://spec.commonmark.org/0.31.2/#html-blocks
		expect(["div", "section", "p", "hr", "table"].filter(isInlineHtmlTag)).toEqual([]);

		// Everything else is inline, including names nobody has heard of.
		expect(["span", "br", "mark", "x-widget"].every(isInlineHtmlTag)).toBe(true);
	});
});
