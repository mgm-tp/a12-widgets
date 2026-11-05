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

import { parse, postprocess, preprocess } from "micromark";
import type { Event, Extension } from "micromark-util-types";

import type { SourceToken } from "./source-token.js";

export type SourceTokenizer = (markdown: string) => SourceToken[];

/**
 * Copies the characters from `from` up to `until` into `tokens`
 * and returns `until` so the caller knows how far it has got. An empty range copies nothing.
 *
 *     pushText("# Hi", tokens, 2, 4)   adds { kind: "text", text: "Hi" }   returns 4
 *     pushText("# Hi", tokens, 2, 2)   adds nothing                        returns 2
 *
 * This is the only place a text token is created, so every character in the tree passes here.
 */
function pushText(source: string, tokens: SourceToken[], from: number, until: number): number {
	if (until <= from) {
		return from;
	}

	tokens.push({ kind: "text", text: source.slice(from, until) });

	return until;
}

/**
 * Turns micromark's flat list of events into a tree.
 *
 * Micromark reports a token as two events, an `enter` and an `exit`, in one flat list.
 * Nothing says which token is inside which — a token is a child of another when it opens and closes
 * between that one's `enter` and `exit`. For `Hello **world**`:
 *
 *      0 enter content        0-15        8 enter data           8-13
 *      1 enter paragraph      0-15        9 exit  data           8-13
 *      2 enter data           0-6        10 exit  strongText     8-13
 *      3 exit  data           0-6        11 enter strongSequence 13-15
 *      4 enter strong         6-15       12 exit  strongSequence 13-15
 *      5 enter strongSequence 6-8        13 exit  strong         6-15
 *      6 exit  strongSequence 6-8        14 exit  paragraph      0-15
 *      7 enter strongText     8-13       15 exit  content        0-15
 *
 * becomes:
 *
 *     content
 *       paragraph
 *         data              "Hello "
 *         strong
 *           strongSequence  "**"
 *           strongText
 *             data          "world"
 *           strongSequence  "**"
 *
 * `collect` reads the list once and recurses: an `enter` means descend,
 * an `exit` means the current token is finished. `index` is shared by every call,
 * because a nested call reads events on its caller's behalf and the caller has to carry on where it stopped.
 *
 * A token with no children — `data` above — is where text comes from.
 * Its `collect` call meets an `exit` straight away, so the whole of its span is still unwritten
 * and the final {@link pushText} writes it.
 */
function getSourceTokensFromEvents(source: string, events: Event[]): SourceToken[] {
	let index = 0;

	function collect(from: number, to: number): SourceToken[] {
		const tokens: SourceToken[] = [];
		let cursor = from;

		while (index < events.length) {
			const [kind, token] = events[index]!;

			if (kind === "exit") {
				break;
			}

			index += 1;

			// A fence inside a list item reports its `listItemIndent` after the line holding
			// it was read, so the token starts behind the cursor.
			// Reading from there would write those indent spaces twice.
			const start = Math.max(token.start.offset, cursor);
			const end = Math.max(token.end.offset, start);

			cursor = pushText(source, tokens, cursor, start);

			const children = collect(start, end);

			index += 1;

			if (children.length > 0) {
				tokens.push({ kind: "element", type: token.type, children });
			}

			cursor = Math.max(cursor, end);
		}

		pushText(source, tokens, cursor, to);

		return tokens;
	}

	return collect(0, source.length);
}

export function createSourceTokenizer(extensions: Extension[] = []): SourceTokenizer {
	return (markdown) => {
		// An empty document has nothing to tokenize. A host with no markdown yet often passes
		// `undefined` or `null` instead of `""`. The rich editor takes those as empty, so this does too.
		if (!markdown) {
			return [];
		}

		const input = preprocess()(markdown, undefined, true);
		const events = parse({ extensions }).document().write(input);
		const processedEvents = postprocess(events);

		return getSourceTokensFromEvents(markdown, processedEvents);
	};
}
