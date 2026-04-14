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

import type { LexicalEditor } from "lexical";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

import type { TextMatcherResult } from "../plugins/plugin.internal.api.js";

import {
	END_WITH_DOT_REGEX,
	LINK_SUFFIX_REGEX,
	PUNCTUATION_OR_SPACE,
	START_WITH_LINK_SUFFIX_REGEX
} from "./constants.js";

export function textSearchByRegex(textInput: string, regex: RegExp): TextMatcherResult | null {
	const result = textInput.match(regex);

	if (!result) {
		return null;
	}

	const firstMatch = result[0];

	if (!firstMatch) {
		return null;
	}

	return {
		index: result.index ?? -1,
		length: firstMatch.length,
		text: result.toString()
	};
}

export function findFirstMatch<T extends (text: string) => K | null, K extends TextMatcherResult | null>(
	text: string,
	matchers: Array<T>
): K | null {
	const matchResults = matchers.map((match) => match(text));

	const smallestIndex = Math.min(...matchResults.map((el) => el?.index ?? Infinity));
	// Filter results to only those with the smallest index
	const smallestIndexMatchResults = matchResults.filter((el) => (el?.index ?? Infinity) === smallestIndex);

	// Search the longest match first
	const maxLength = Math.max(...smallestIndexMatchResults.map((el) => el?.length ?? 0).filter((el) => el !== 0));

	return smallestIndexMatchResults.find((el) => (el?.length ?? 0) === maxLength) ?? null;
}

export function isSeparator(char: string): boolean {
	return PUNCTUATION_OR_SPACE.test(char);
}

export function endsWithSeparator(textContent: string): boolean {
	return isSeparator(textContent[textContent.length - 1]);
}

export function startsWithSeparator(textContent: string): boolean {
	return isSeparator(textContent[0]);
}

export function startWithLinkSuffix(text: string): boolean {
	return START_WITH_LINK_SUFFIX_REGEX.test(text);
}

export function endsWithDot(text: string): boolean {
	return END_WITH_DOT_REGEX.test(text);
}

export function isLinkSuffix(text: string): boolean {
	return LINK_SUFFIX_REGEX.test(text);
}

export function prepopulatedRichText(text: string): () => void {
	return () => {
		const root = $getRoot();

		if (root.getFirstChild() === null) {
			const paragraph = $createParagraphNode();
			paragraph.append($createTextNode(text));
			root.append(paragraph);
		}
	};
}

/** @internal */
export const editorHasContent = (editor: LexicalEditor): boolean => {
	let result = false;

	editor.getEditorState().read(() => {
		const root = $getRoot();
		result = root.getTextContent().trim().length > 0;
	});

	return result;
};
