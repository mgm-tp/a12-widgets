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

import type { Tokenizer } from "@lexical/code-shiki";
import { CodeShikiExtension, ShikiTokenizer } from "@lexical/code-shiki";
import { configExtension, HorizontalRuleExtension } from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
	MdastAutolinkLiteralExtension,
	MdastCommonMarkExtension,
	MdastExtension,
	MdastShadowRootQuoteExtension,
	MdastShortcutsExtension,
	MdastStrikethroughExtension,
	MdastTaskListExtension
} from "@lexical/mdast";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import type { AnyLexicalExtensionArgument } from "lexical";
import { defineExtension } from "lexical";

import { MdastHtmlElementExtension } from "./extensions/mdast-html-element-extension.js";
import { MdastImageExtension } from "./extensions/mdast-image-extension.js";
import {
	defineInlineFormatsExtension,
	MdastSerializerDefaultsExtension
} from "./extensions/mdast-inline-formats-extension.js";
import { MdastTableAlignmentExtension } from "./extensions/mdast-table-extension.js";
import { MdastUnknownDirectiveExtension } from "./extensions/mdast-unknown-directive-extension.js";
import type { ResolvedFeatures } from "./optional-features.js";
import {
	DEFAULT_MARKDOWN_EDITOR_FEATURES,
	getEnabledInlineFormats,
	MARKDOWN_EDITOR_FEATURE_KEYS
} from "./optional-features.js";
import { A12_SHIKI_THEME_NAME, registerA12ThemeInShiki } from "./register-shiki-theme.js";
import { MARKDOWN_EDITOR_THEME } from "./theme.js";

registerA12ThemeInShiki();

/**
 * Shiki highlighting without the built-in `javascript` fallback, painted from the widgets theme.
 *
 * `@lexical/code-shiki` writes its `defaultLanguage` onto every code block that carries none,
 * so a fence with no info string would show up as `data-language="javascript"`,
 * get colored as JavaScript and be written back with a `javascript` info string the next time
 * the editor produces markdown. `null` leaves those blocks alone, so the empty info string survives.
 *
 * `defaultTheme` replaces Shiki's `one-light` with {@link A12_SHIKI_THEME_NAME}.
 * That theme gives each token a CSS variable instead of a fixed color.
 * `markdown-editor.styled.tsx` sets those variables from `theme.components.markdownEditor.richSurface.codeBlock`,
 * so code is recolored through `createTheme` like everything else.
 * It also skips a download: Shiki no longer fetches a theme chunk for the first code block on the page.
 */
const defaultCodeShikiTokenizer: Tokenizer = {
	...ShikiTokenizer,
	defaultLanguage: null,
	defaultTheme: A12_SHIKI_THEME_NAME
};

/**
 * The root extension for {@link MarkdownEditor}.
 *
 * Where a transformer-based editor assembles a `TRANSFORMERS` array
 * and mounts a matching set of React plugins, this one declares both at once:
 * each `Mdast*` extension ships its nodes together with the micromark/mdast import
 * and `mdast-util-to-markdown` export rules for the construct it owns,
 * so parsing and serialization are configured purely by composition.
 *
 * It MUST be a stable reference. `LexicalExtensionComposer` recreates the
 * underlying editor whenever the extension argument changes,
 * so this is defined at module scope; consumer-supplied extensions are layered on
 * via {@link defineMarkdownEditorExtension}, which the view memoizes.
 *
 * Behavior extensions supply what a React plugin stack would
 * otherwise mount inside a `RichTextPlugin`:
 * - {@link RichTextExtension} — text insertion, Enter/selection handling.
 *   The `Mdast*` extensions only contribute nodes and mapping rules,
 *   so this is what actually makes the surface typeable.
 * - {@link HistoryExtension} — undo/redo.
 * - {@link ListExtension} / {@link CheckListExtension} — list commands and the checkbox click target.
 * - {@link LinkExtension}, {@link TableExtension}, {@link HorizontalRuleExtension}.
 * - {@link CodeShikiExtension} — Shiki token coloring inside fenced code blocks,
 *   set up with {@link defaultCodeShikiTokenizer}.
 *   Fenced code already imports as a `CodeNode`, so this only adds the highlighting.
 *
 * No `TabIndentationExtension`: `registerTabIndentation` calls `preventDefault()` on Tab
 * for any range selection, which traps the keyboard (WCAG 2.1.2).
 * Its own doc comment warns against it for that reason —
 * `@lexical/extension` 0.48.0, `src/TabIndentationExtension.ts`.
 * Indent and Outdent still work: `registerRichText` registers
 * both `INDENT_CONTENT_COMMAND` and `OUTDENT_CONTENT_COMMAND` — `@lexical/rich-text` 0.48.0.
 *
 * Markdown extensions supply the round-trip:
 * - {@link MdastCommonMarkExtension} — headings, blockquote, lists, code, links,
 *   thematic break.
 * - {@link MdastShadowRootQuoteExtension} — lets a blockquote hold blocks, the way a table cell does.
 *   Without it a quote only holds inline content, so a list, a code fence or a second paragraph
 *   inside `> ` comes back as one run of text. It must come after {@link MdastCommonMarkExtension},
 *   because its blockquote import rule has to be the later one to win.
 * - {@link MdastExtension} — the import **and** export bundle.
 * - {@link MdastShortcutsExtension} — live typing shortcuts (`# `, `- `, `**…**`).
 *
 * These are ours, because `@lexical/mdast` ships no rule for any of them:
 * - {@link MdastImageExtension} — `![alt](src)` ⇄ `ImageNode`.
 * - {@link MdastUnknownDirectiveExtension} — placeholders for directives nothing recognizes.
 *
 * Everything the `features` prop can switch off lives in {@link getFeatureExtensions} instead.
 */
const markdownEditorCoreExtension = defineExtension({
	name: "@a12/MarkdownEditor/Core",
	theme: MARKDOWN_EDITOR_THEME,
	dependencies: [
		RichTextExtension,
		configExtension(CodeShikiExtension, { tokenizer: defaultCodeShikiTokenizer }),
		HistoryExtension,
		ListExtension,
		LinkExtension,
		HorizontalRuleExtension,
		MdastCommonMarkExtension,
		MdastShadowRootQuoteExtension,
		MdastExtension,
		MdastShortcutsExtension,
		MdastImageExtension,
		MdastUnknownDirectiveExtension,
		MdastSerializerDefaultsExtension
	]
});

/**
 * The extensions one feature set asks for.
 *
 * A feature needs two of them, and they go in together:
 * - the `Mdast*` one reads the syntax from markdown and writes it back,
 * - the other one makes the construct editable (its node, its commands).
 *
 * Leaving the `Mdast*` one out is what stops the syntax from being recognized.
 * Push `TableExtension` without it and the toolbar can still build a table,
 * but nothing knows how to write it back — so it returns as loose paragraphs
 * the next time the editor produces markdown.
 */
function getFeatureExtensions(features: ResolvedFeatures): AnyLexicalExtensionArgument[] {
	const extensions: AnyLexicalExtensionArgument[] = [];

	if (features.strikethrough) {
		extensions.push(MdastStrikethroughExtension);
	}

	if (features.taskList) {
		extensions.push(MdastTaskListExtension, CheckListExtension);
	}

	if (features.table) {
		extensions.push(MdastTableAlignmentExtension, TableExtension);
	}

	if (features.autolink) {
		extensions.push(MdastAutolinkLiteralExtension);
	}

	if (features.htmlTags) {
		extensions.push(MdastHtmlElementExtension);
	}

	const inlineFormats = getEnabledInlineFormats(features);

	if (inlineFormats.length > 0) {
		extensions.push(defineInlineFormatsExtension(inlineFormats));
	}

	return extensions;
}

/** The editor as it comes: CommonMark and GFM, no consumer extensions. */
export const markdownEditorExtension = defineExtension({
	name: "@a12/MarkdownEditor",
	dependencies: [markdownEditorCoreExtension, ...getFeatureExtensions(DEFAULT_MARKDOWN_EDITOR_FEATURES)]
});

/**
 * Builds the root extension: the always-on core, whatever this feature set asks for,
 * then the consumer's own extensions on top.
 *
 * Default features and no extra extensions hand back the shared {@link markdownEditorExtension}
 * — the same object every time, so the usual case costs nothing.
 *
 * Anything else builds a new object, and the caller has to memoize it.
 * Lexical throws the editor away and builds a new one whenever this object changes,
 * which loses any edit the host has not been told about yet.
 */
export function defineMarkdownEditorExtension(
	features: ResolvedFeatures = DEFAULT_MARKDOWN_EDITOR_FEATURES,
	extraExtensions: AnyLexicalExtensionArgument[] = []
): AnyLexicalExtensionArgument {
	// Compared key by key, not by identity: the view resolves `features` into
	// a fresh object every time it changes, so it is never the default constant itself.
	const isDefaultSet = MARKDOWN_EDITOR_FEATURE_KEYS.every(
		(key) => features[key] === DEFAULT_MARKDOWN_EDITOR_FEATURES[key]
	);

	if (extraExtensions.length === 0 && isDefaultSet) {
		return markdownEditorExtension;
	}

	return defineExtension({
		name: "@a12/MarkdownEditor/Configured",
		// The built-ins come first,
		// so a consumer extension can build on anything the editor already registers.
		dependencies: [markdownEditorCoreExtension, ...getFeatureExtensions(features), ...extraExtensions]
	});
}
