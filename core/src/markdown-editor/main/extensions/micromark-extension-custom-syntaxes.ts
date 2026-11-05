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
 * A micromark extension that teaches the parser the four inline formats markdown has no syntax for:
 * subscript, superscript, underline and highlight, each written as the HTML element that renders it.
 *
 * Plain micromark reports the delimiters as ordinary inline HTML, so `H<sub>2</sub>O` arrives as five
 * flat siblings and nothing says the two tags belong together.
 * Pairing them means walking the token tree afterwards and guessing which tags are really a pair.
 * This extension makes the parser report the run itself:
 *
 * ```
 * before                             after
 *
 * data           "H"                 data                       "H"
 * htmlText       "<sub>"             inlineSubscript
 * data           "2"                   customInlineFormatMarker "<sub>"
 * htmlText       "</sub>"              inlineSubscriptText      "2"
 * data           "O"                   customInlineFormatMarker "</sub>"
 *                                    data                       "O"
 * ```
 *
 * Nesting falls out of the same mechanism: `<mark>a <sub>b</sub></mark>` becomes an `inlineHighlight`
 * whose text contains an `inlineSubscript`, innermost pair resolved first.
 *
 * The matching happens while micromark parses, not in a second pass over the tokens it produced,
 * so micromark's normal rules still apply and we do not have to re-check any of these cases:
 *
 * ```
 * `<sub>x</sub>`   codeText, untouched — constructs never run inside code
 * \<sub>x\</sub>   characterEscape, untouched
 * <span>x</span>   htmlText, untouched — not one of ours
 * <sub>unclosed    data — a delimiter that never paired up is literal text
 * <sub></sub>      data — an empty pair is nothing to format
 * ```
 *
 * The delimiters are matched as literal strings and tagged open or closed at tokenize time,
 * then {@link resolveDelimiters} pairs them the way `micromark-extension-gfm-strikethrough` pairs `~~`.
 */

import { splice } from "micromark-util-chunked";
import { resolveAll } from "micromark-util-resolve-all";
import type { Code, Effects, Event, Extension, Resolver, State, Token, TokenizeContext } from "micromark-util-types";

import type { CustomInlineFormatEntry } from "../utils/constants.js";
import { CUSTOM_INLINE_FORMATS } from "../utils/constants.js";

declare module "micromark-util-types" {
	interface TokenTypeMap {
		customInlineFormatMarkerTemporary: "customInlineFormatMarkerTemporary";
		customInlineFormatMarker: "customInlineFormatMarker";
		inlineSubscript: "inlineSubscript";
		inlineSubscriptText: "inlineSubscriptText";
		inlineSuperscript: "inlineSuperscript";
		inlineSuperscriptText: "inlineSuperscriptText";
		inlineUnderline: "inlineUnderline";
		inlineUnderlineText: "inlineUnderlineText";
		inlineHighlight: "inlineHighlight";
		inlineHighlightText: "inlineHighlightText";
	}
}

const LESS_THAN_CODE = 60;

const TEMPORARY_TOKEN = "customInlineFormatMarkerTemporary";

const MARKER_TOKEN = "customInlineFormatMarker";

interface Delimiter {
	text: string;
	formatIndex: number;
	isOpen: boolean;
}

/**
 * The tags to watch for, longest first, so `</sub>` is tried before `<sub>`.
 *
 * `formatIndex` stays an index into the whole {@link CUSTOM_INLINE_FORMATS} list even when
 * only some formats are enabled, because {@link runEvents} looks the format up there.
 */
function buildDelimiters(enabledEntries: CustomInlineFormatEntry[]): Delimiter[] {
	return CUSTOM_INLINE_FORMATS.flatMap((format, formatIndex) =>
		enabledEntries.includes(format)
			? [
					{ text: format.open, formatIndex, isOpen: true },
					{ text: format.close, formatIndex, isOpen: false }
				]
			: []
	).sort((left, right) => right.text.length - left.text.length);
}

interface DelimiterToken extends Token {
	_formatIndex?: number;
	_isOpen?: boolean;
}

/**
 * Builds the tokenizer for one set of enabled formats. A tag whose format is off is not in `delimiters`,
 * so nothing matches it and it stays the inline HTML micromark already sees.
 */
function createDelimiterTokenizer(delimiters: Delimiter[]) {
	return function tokenizeDelimiter(effects: Effects, ok: State, nok: State): State {
		let candidates = delimiters;
		let size = 0;

		const inside = (code: Code): State | undefined => {
			const matching = candidates.filter(
				(delimiter) => size < delimiter.text.length && delimiter.text.charCodeAt(size) === code
			);

			if (matching.length === 0) {
				return nok(code);
			}

			candidates = matching;
			effects.consume(code);
			size++;

			const complete = candidates.find((delimiter) => delimiter.text.length === size);

			if (complete === undefined) {
				return inside;
			}

			const token: DelimiterToken = effects.exit(TEMPORARY_TOKEN);

			token._formatIndex = complete.formatIndex;
			token._isOpen = complete.isOpen;

			return ok;
		};

		return (code: Code): State | undefined => {
			effects.enter(TEMPORARY_TOKEN);

			return inside(code);
		};
	};
}

function isMatchingOpener(event: Event, closer: DelimiterToken): boolean {
	const token: DelimiterToken = event[1];

	return (
		event[0] === "exit" &&
		token.type === TEMPORARY_TOKEN &&
		token._isOpen === true &&
		token._formatIndex === closer._formatIndex
	);
}

function runEvents(events: Event[], open: number, close: number, context: TokenizeContext): Event[] {
	const opener: DelimiterToken = events[open]![1];
	const closer: DelimiterToken = events[close]![1];
	const format = CUSTOM_INLINE_FORMATS[opener._formatIndex!]!;

	opener.type = MARKER_TOKEN;
	closer.type = MARKER_TOKEN;

	const run: Token = { type: format.tokenType, start: { ...opener.start }, end: { ...closer.end } };
	const text: Token = { type: `${format.tokenType}Text`, start: { ...opener.end }, end: { ...closer.start } };

	const paired: Event[] = [
		["enter", run, context],
		["enter", opener, context],
		["exit", opener, context],
		["enter", text, context]
	];

	const insideSpan = context.parser.constructs.insideSpan.null;

	if (insideSpan) {
		splice(paired, paired.length, 0, resolveAll(insideSpan, events.slice(open + 1, close), context));
	}

	splice(paired, paired.length, 0, [
		["exit", text, context],
		["enter", closer, context],
		["exit", closer, context],
		["exit", run, context]
	]);

	return paired;
}

const resolveDelimiters: Resolver = (events, context) => {
	let index = -1;

	while (++index < events.length) {
		const closer: DelimiterToken = events[index]![1];

		if (events[index]![0] !== "enter" || closer.type !== TEMPORARY_TOKEN || closer._isOpen === true) {
			continue;
		}

		let open = index;

		while (open--) {
			if (!isMatchingOpener(events[open]!, closer)) {
				continue;
			}

			if (events[open]![1].end.offset === closer.start.offset) {
				break;
			}

			const paired = runEvents(events, open, index, context);

			splice(events, open - 1, index - open + 3, paired);
			index = open + paired.length - 2;
			break;
		}
	}

	index = -1;

	while (++index < events.length) {
		if (events[index]![1].type === TEMPORARY_TOKEN) {
			events[index]![1].type = "data";
		}
	}

	return events;
};

/**
 * @param enabledEntries which of the four formats to recognize. The rest keep
 * the plain inline-HTML treatment micromark gives any other tag,
 * so `<mark>x</mark>` with highlight off survives a round-trip as the literal text it is.
 */
export function micromarkCustomInlineSyntaxes(
	enabledEntries: CustomInlineFormatEntry[] = CUSTOM_INLINE_FORMATS
): Extension {
	const tokenizer = {
		name: "customInlineFormat",
		tokenize: createDelimiterTokenizer(buildDelimiters(enabledEntries)),
		resolveAll: resolveDelimiters
	};

	return {
		text: { [LESS_THAN_CODE]: tokenizer },
		insideSpan: { null: [tokenizer] }
	};
}
