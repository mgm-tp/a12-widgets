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

import type { ThemeRegistration } from "@shikijs/core";
import { bundledThemesInfo } from "shiki/themes";

/**
 * Name of the code theme the editor hands to Shiki.
 *
 * It is not one of Shiki's own themes. It paints every token with a CSS variable
 * instead of a fixed colour, so the widgets theme stays in charge of the palette.
 */
export const A12_SHIKI_THEME_NAME = "a12-shiki-theme";

/** Every CSS variable the theme writes gets this in front of it. */
export const A12_SHIKI_CSS_VAR_PREFIX = "--a12-code-";

/** Whether the theme is already in Shiki's bundle list. */
let registered = false;

/** The `var()` a token of that role is painted with. */
function slot(role: string): string {
	return `var(${A12_SHIKI_CSS_VAR_PREFIX}${role})`;
}

/**
 * The theme itself.
 *
 * A Shiki theme maps TextMate scopes onto colours, and a grammar emits a lot of scopes
 * (`entity.name.function.js`, `punctuation.definition.string.begin.markdown`, ...).
 * Every rule here points at a CSS variable rather than a colour, so the stylesheet owns
 * the palette and a consumer re-colours code through the normal theme config.
 *
 * This started as Shiki's own `createCssVariablesTheme`, which offers 13 token slots.
 * The extra rules below split its catch-alls apart, so numbers, types, tags, attributes,
 * variables, properties, operators and regexes each get their own slot.
 *
 * A scope appears in one rule only. TextMate picks the longest matching scope, so a rule
 * for `entity.name.tag` still loses to the more exact `entity.name.tag.yaml` above it.
 */
const A12_THEME: ThemeRegistration = {
	name: A12_SHIKI_THEME_NAME,

	// Required by the type, but nothing reads it: light or dark is decided by
	// whatever the widgets theme puts in the variables.
	type: "light",
	colors: {
		"editor.foreground": slot("foreground"),
		"editor.background": slot("background"),

		// Only an ```ansi fence uses these. We leave them unset in the stylesheet,
		// so such a block falls back to the plain foreground.
		"terminal.ansiBlack": slot("ansi-black"),
		"terminal.ansiRed": slot("ansi-red"),
		"terminal.ansiGreen": slot("ansi-green"),
		"terminal.ansiYellow": slot("ansi-yellow"),
		"terminal.ansiBlue": slot("ansi-blue"),
		"terminal.ansiMagenta": slot("ansi-magenta"),
		"terminal.ansiCyan": slot("ansi-cyan"),
		"terminal.ansiWhite": slot("ansi-white"),
		"terminal.ansiBrightBlack": slot("ansi-bright-black"),
		"terminal.ansiBrightRed": slot("ansi-bright-red"),
		"terminal.ansiBrightGreen": slot("ansi-bright-green"),
		"terminal.ansiBrightYellow": slot("ansi-bright-yellow"),
		"terminal.ansiBrightBlue": slot("ansi-bright-blue"),
		"terminal.ansiBrightMagenta": slot("ansi-bright-magenta"),
		"terminal.ansiBrightCyan": slot("ansi-bright-cyan"),
		"terminal.ansiBrightWhite": slot("ansi-bright-white")
	},
	tokenColors: [
		{
			// Plain text that sits inside something coloured, like the parts of a
			// template literal that are not the expression.
			scope: [
				"keyword.operator.accessor",
				"meta.group.braces.round.function.arguments",
				"meta.template.expression",
				"markup.fenced_code meta.embedded.block"
			],
			settings: { foreground: slot("foreground") }
		},
		{
			scope: ["emphasis", "markup.italic.markdown"],
			settings: { fontStyle: "italic" }
		},
		{
			scope: ["strong", "markup.heading.markdown", "markup.bold.markdown"],
			settings: { fontStyle: "bold" }
		},
		{
			scope: "meta.link.inline.markdown",
			settings: { fontStyle: "underline", foreground: slot("token-link") }
		},
		{
			scope: ["markup.underline.link", "punctuation.definition.metadata.markdown"],
			settings: { foreground: slot("token-link") }
		},
		{
			scope: ["comment", "string.quoted.docstring.multi"],
			settings: { foreground: slot("token-comment") }
		},
		{
			scope: ["string", "markup.fenced_code", "markup.inline", "beginning.punctuation.definition.list.markdown"],
			settings: { foreground: slot("token-string") }
		},
		{
			scope: [
				"string.quoted",
				"string.interpolated",
				"string.template",
				"string.unquoted.plain.out.yaml",
				"keyword.other.template"
			],
			settings: { foreground: slot("token-string-expression") }
		},
		{
			scope: "string.regexp",
			settings: { foreground: slot("token-regex") }
		},
		{
			scope: "constant.numeric",
			settings: { foreground: slot("token-number") }
		},
		{
			scope: [
				"constant.language",
				"constant.other.placeholder",
				"constant.character.format.placeholder",
				"variable.language.this",
				"variable.other.constant",
				"meta.property-value",
				"support"
			],
			settings: { foreground: slot("token-constant") }
		},
		{
			scope: ["variable.other.object", "variable.other.class", "variable.other.readwrite"],
			settings: { foreground: slot("token-variable") }
		},
		{
			// Object and JSON keys, CSS property names.
			scope: ["meta.property-name", "variable.other.property", "support.type.property-name", "meta.object-literal.key"],
			settings: { foreground: slot("token-property") }
		},
		{
			scope: [
				"keyword",
				"storage.type",
				"storage.modifier",
				"storage.control.clojure",
				"entity.name.function.clojure",
				"entity.name.tag.yaml",
				"support.function.node",
				"punctuation.separator.key-value",
				"punctuation.definition.template-expression"
			],
			settings: { foreground: slot("token-keyword") }
		},
		{
			scope: "keyword.operator",
			settings: { foreground: slot("token-operator") }
		},
		{
			scope: ["entity.name.type", "entity.other.inherited-class", "support.type", "support.class"],
			settings: { foreground: slot("token-type") }
		},
		{
			scope: ["variable.parameter", "variable.parameter.function"],
			settings: { foreground: slot("token-parameter") }
		},
		{
			scope: [
				"support.function",
				"meta.function-call",
				"meta.instance.constructor",
				"entity.name.function",
				"constant.keyword.clojure"
			],
			settings: { foreground: slot("token-function") }
		},
		{
			// JSX writes a component name as `support.class.component`, which would otherwise
			// land on the type slot.
			scope: ["entity.name.tag", "support.class.component"],
			settings: { foreground: slot("token-tag") }
		},
		{
			scope: "entity.other.attribute-name",
			settings: { foreground: slot("token-attribute") }
		},
		{
			scope: [
				"punctuation.definition.arguments",
				"punctuation.definition.dict",
				"punctuation.separator",
				"meta.function-call.arguments"
			],
			settings: { foreground: slot("token-punctuation") }
		},
		{
			// The quotes and brackets around a markdown link.
			scope: [
				"punctuation.definition.string.begin.markdown",
				"punctuation.definition.string.end.markdown",
				"string.other.link.title.markdown",
				"string.other.link.description.markdown"
			],
			settings: { foreground: slot("token-keyword") }
		},
		{
			scope: ["markup.inserted", "meta.diff.header.to-file", "punctuation.definition.inserted"],
			settings: { foreground: slot("token-inserted") }
		},
		{
			scope: ["markup.deleted", "meta.diff.header.from-file", "punctuation.definition.deleted"],
			settings: { foreground: slot("token-deleted") }
		},
		{
			scope: ["markup.changed", "punctuation.definition.changed"],
			settings: { foreground: slot("token-changed") }
		}
	]
};

/**
 * Shiki paints a code token with an inline `style`, which no class can beat.
 * This theme keeps the inline style but makes the value a `var()`, so
 * `color: var(--a12-code-token-keyword)` lands on the token and the stylesheet
 * decides what that variable holds. That is how a consumer re-colours code:
 * through the normal theme config, not by fighting inline styles.
 *
 * `@lexical/code-shiki` keeps its Shiki instance module-private and only loads a theme
 * it can find in Shiki's own `bundledThemesInfo`, so adding an entry there is the only
 * way to hand it a theme we built ourselves. The list is a plain array, and an entry
 * carries its own loader, so ours resolves straight to the object with no network
 * and no extra chunk.
 *
 * Call this before the editor mounts. It runs once; later calls do nothing.
 */
export function registerA12ThemeInShiki(): void {
	if (registered) {
		return;
	}

	registered = true;

	bundledThemesInfo.push({
		id: A12_SHIKI_THEME_NAME,
		displayName: "A12",
		// Required by `BundledThemeInfo`, but nothing here reads it:
		// `@lexical/code-shiki` only uses `id`, `displayName` and `import`.
		type: "light",
		import: () => Promise.resolve({ default: A12_THEME })
	});
}
