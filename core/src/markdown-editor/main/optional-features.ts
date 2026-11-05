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

import type { CustomInlineFormatEntry } from "./utils/constants.js";
import { CUSTOM_INLINE_FORMATS } from "./utils/constants.js";

/**
 * The config to turn markdown features on and off.
 *
 * ```tsx
 * <MarkdownEditor value={markdown} onChange={setMarkdown} features={{ table: false, highlight: true }} />
 * ```
 */
export interface MarkdownEditorOptionalFeatures {
	/** GFM `~~strikethrough~~`. @default true */
	strikethrough?: boolean;

	/** GFM task lists — `- [x] done`. Plain lists are CommonMark, so they stay on. @default true */
	taskList?: boolean;

	/** GFM tables. @default true */
	table?: boolean;

	/** GFM bare links — a plain `https://…` in a sentence becomes a link. @default true */
	autolink?: boolean;

	/** HTML written in the markdown. Off, it is plain text. @default false */
	htmlTags?: boolean;

	/** `<mark>highlight</mark>`. Written as HTML, because markdown has no syntax for it. @default false */
	highlight?: boolean;

	/** `<u>underline</u>`. Written as HTML, because markdown has no syntax for it. @default false */
	underline?: boolean;

	/** `<sub>subscript</sub>`. Written as HTML, because markdown has no syntax for it. @default false */
	subscript?: boolean;

	/** `<sup>superscript</sup>`. Written as HTML, because markdown has no syntax for it. @default false */
	superscript?: boolean;
}

/** The name of one feature, such as `"table"`. */
export type MarkdownEditorFeatureKey = keyof MarkdownEditorOptionalFeatures;

/** The same list, but every feature answered — no key left undecided. */
export type ResolvedFeatures = Required<MarkdownEditorOptionalFeatures>;

/**
 * What you get when you pass no `features` at all: CommonMark plus GFM.
 *
 * The four HTML-tag formats start off.
 * Markdown has no syntax for them, so you ask for them by name.
 */
export const DEFAULT_MARKDOWN_EDITOR_FEATURES: ResolvedFeatures = {
	strikethrough: true,
	taskList: true,
	table: true,
	autolink: true,
	htmlTags: false,
	highlight: false,
	underline: false,
	subscript: false,
	superscript: false
};

/**
 * The feature names, in the order the defaults above list them.
 *
 * Read from the defaults so there is only one list to keep up to date.
 * Add a feature to the interface and TypeScript makes you give it a default, which lands it here too.
 *
 * The order matters, because {@link getFeaturesKey} walks this list to build its string.
 */
export const MARKDOWN_EDITOR_FEATURE_KEYS = Object.keys(DEFAULT_MARKDOWN_EDITOR_FEATURES) as MarkdownEditorFeatureKey[];

/**
 * Writes the feature set as a row of `1`s and `0`s, one character per feature.
 *
 * Why bother: `features={{ table: false }}` written inline is a brand new object on every
 * render, and a new object would rebuild the editor every render.
 * The same features always produce the same string,
 * so the editor watches the string and rebuilds only when a feature REALLY FLIPS.
 */
export function getFeaturesKey(features: MarkdownEditorOptionalFeatures | undefined): string {
	return MARKDOWN_EDITOR_FEATURE_KEYS.map((key) =>
		(features?.[key] ?? DEFAULT_MARKDOWN_EDITOR_FEATURES[key]) ? "1" : "0"
	).join("");
}

/** Reads one of those strings back into the feature set it stands for. */
export function parseFeaturesKey(key: string): ResolvedFeatures {
	const resolved = {} as ResolvedFeatures;

	MARKDOWN_EDITOR_FEATURE_KEYS.forEach((name, index) => {
		resolved[name] = key[index] === "1";
	});

	return resolved;
}

/** Fills in whatever the caller left out, so every feature has an answer. */
export function resolveFeatures(features: MarkdownEditorOptionalFeatures | undefined): ResolvedFeatures {
	return parseFeaturesKey(getFeaturesKey(features));
}

/**
 * The `<mark>`, `<u>`, `<sub>` and `<sup>` entries this set turns on.
 *
 * Each entry stores its Lexical format name — `"highlight"`, `"underline"` and so on,
 * and those are spelled exactly like the feature keys, so one looks up the other.
 */
export function getEnabledInlineFormats(features: ResolvedFeatures): CustomInlineFormatEntry[] {
	return CUSTOM_INLINE_FORMATS.filter((entry) => features[entry.format]);
}
