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
 * ===== BEGIN THIRD-PARTY SOURCE: micromark-extension-directive (https://github.com/micromark/micromark-extension-directive),
 * https://github.com/micromark/micromark-extension-directive/blob/4.0.0/dev/lib/factory-attributes.js
 * Licensed under the MIT License.
 * Copyright (c) Titus Wormer <tituswormer@gmail.com>
 * Modified by mgm technology partners on 2026-09-11.
 *
 * Copied because the package's `exports` map keeps `lib/` private.
 *
 * Changed from upstream:
 *
 * - The `devlop` assert in `start()` is dropped. `devlop` does not resolve from
 *   `core/`, and upstream's own published `lib/` build has no asserts either,
 *   so this matches what upstream ships. The caller only enters here on a `{`.
 * - TypeScript types and our formatting.
 *
 * That is the whole list. The grammar is untouched.
 * See `enhanced-micromark-directive.ts`.
 */

import { factorySpace } from "micromark-factory-space";
import { factoryWhitespace } from "micromark-factory-whitespace";
import {
	markdownLineEnding,
	markdownLineEndingOrSpace,
	markdownSpace,
	unicodePunctuation,
	unicodeWhitespace
} from "micromark-util-character";
import { codes, types } from "micromark-util-symbol";
import type { Code, Effects, State, TokenType } from "micromark-util-types";

export function factoryAttributes(
	effects: Effects,
	ok: State,
	nok: State,
	attributesType: TokenType,
	attributesMarkerType: TokenType,
	attributeType: TokenType,
	attributeIdType: TokenType,
	attributeClassType: TokenType,
	attributeNameType: TokenType,
	attributeInitializerType: TokenType,
	attributeValueLiteralType: TokenType,
	attributeValueType: TokenType,
	attributeValueMarker: TokenType,
	attributeValueData: TokenType,
	disallowEol?: boolean
): State {
	let type: TokenType;
	let marker: Code | undefined;

	return start;

	function start(code: Code): State | undefined {
		// Upstream asserts `code` is `{` here. Dropped, like in the package's own
		// published build, so we do not pull in `devlop`.
		effects.enter(attributesType);
		effects.enter(attributesMarkerType);
		effects.consume(code);
		effects.exit(attributesMarkerType);

		return between;
	}

	function between(code: Code): State | undefined {
		if (code === codes.numberSign) {
			type = attributeIdType;

			return shortcutStart(code);
		}

		if (code === codes.dot) {
			type = attributeClassType;

			return shortcutStart(code);
		}

		if (disallowEol && markdownSpace(code)) {
			return factorySpace(effects, between, types.whitespace)(code);
		}

		if (!disallowEol && markdownLineEndingOrSpace(code)) {
			return factoryWhitespace(effects, between)(code);
		}

		if (
			code === codes.eof ||
			markdownLineEnding(code) ||
			unicodeWhitespace(code) ||
			(unicodePunctuation(code) && code !== codes.dash && code !== codes.underscore)
		) {
			return end(code);
		}

		effects.enter(attributeType);
		effects.enter(attributeNameType);
		effects.consume(code);

		return name;
	}

	function shortcutStart(code: Code): State | undefined {
		// Assume it's registered.
		const markerType = (type + "Marker") as TokenType;

		effects.enter(attributeType);
		effects.enter(type);
		effects.enter(markerType);
		effects.consume(code);
		effects.exit(markerType);

		return shortcutStartAfter;
	}

	function shortcutStartAfter(code: Code): State | undefined {
		if (
			code === codes.eof ||
			code === codes.quotationMark ||
			code === codes.numberSign ||
			code === codes.apostrophe ||
			code === codes.dot ||
			code === codes.lessThan ||
			code === codes.equalsTo ||
			code === codes.greaterThan ||
			code === codes.graveAccent ||
			code === codes.rightCurlyBrace ||
			markdownLineEndingOrSpace(code)
		) {
			return nok(code);
		}

		// Assume it's registered.
		const valueType = (type + "Value") as TokenType;

		effects.enter(valueType);
		effects.consume(code);

		return shortcut;
	}

	function shortcut(code: Code): State | undefined {
		if (
			code === codes.eof ||
			code === codes.quotationMark ||
			code === codes.apostrophe ||
			code === codes.lessThan ||
			code === codes.equalsTo ||
			code === codes.greaterThan ||
			code === codes.graveAccent
		) {
			return nok(code);
		}

		if (
			code === codes.numberSign ||
			code === codes.dot ||
			code === codes.rightCurlyBrace ||
			markdownLineEndingOrSpace(code)
		) {
			// Assume it's registered.
			const valueType = (type + "Value") as TokenType;

			effects.exit(valueType);
			effects.exit(type);
			effects.exit(attributeType);

			return between(code);
		}

		effects.consume(code);

		return shortcut;
	}

	function name(code: Code): State | undefined {
		if (
			code === codes.eof ||
			markdownLineEnding(code) ||
			unicodeWhitespace(code) ||
			(unicodePunctuation(code) &&
				code !== codes.dash &&
				code !== codes.dot &&
				code !== codes.colon &&
				code !== codes.underscore)
		) {
			effects.exit(attributeNameType);

			if (disallowEol && markdownSpace(code)) {
				return factorySpace(effects, nameAfter, types.whitespace)(code);
			}

			if (!disallowEol && markdownLineEndingOrSpace(code)) {
				return factoryWhitespace(effects, nameAfter)(code);
			}

			return nameAfter(code);
		}

		effects.consume(code);

		return name;
	}

	function nameAfter(code: Code): State | undefined {
		if (code === codes.equalsTo) {
			effects.enter(attributeInitializerType);
			effects.consume(code);
			effects.exit(attributeInitializerType);

			return valueBefore;
		}

		// Attribute without a value.
		effects.exit(attributeType);

		return between(code);
	}

	function valueBefore(code: Code): State | undefined {
		if (
			code === codes.eof ||
			code === codes.lessThan ||
			code === codes.equalsTo ||
			code === codes.greaterThan ||
			code === codes.graveAccent ||
			code === codes.rightCurlyBrace ||
			(disallowEol && markdownLineEnding(code))
		) {
			return nok(code);
		}

		if (code === codes.quotationMark || code === codes.apostrophe) {
			effects.enter(attributeValueLiteralType);
			effects.enter(attributeValueMarker);
			effects.consume(code);
			effects.exit(attributeValueMarker);
			marker = code;

			return valueQuotedStart;
		}

		if (disallowEol && markdownSpace(code)) {
			return factorySpace(effects, valueBefore, types.whitespace)(code);
		}

		if (!disallowEol && markdownLineEndingOrSpace(code)) {
			return factoryWhitespace(effects, valueBefore)(code);
		}

		effects.enter(attributeValueType);
		effects.enter(attributeValueData);
		effects.consume(code);
		marker = undefined;

		return valueUnquoted;
	}

	function valueUnquoted(code: Code): State | undefined {
		if (
			code === codes.eof ||
			code === codes.quotationMark ||
			code === codes.apostrophe ||
			code === codes.lessThan ||
			code === codes.equalsTo ||
			code === codes.greaterThan ||
			code === codes.graveAccent
		) {
			return nok(code);
		}

		if (code === codes.rightCurlyBrace || markdownLineEndingOrSpace(code)) {
			effects.exit(attributeValueData);
			effects.exit(attributeValueType);
			effects.exit(attributeType);

			return between(code);
		}

		effects.consume(code);

		return valueUnquoted;
	}

	function valueQuotedStart(code: Code): State | undefined {
		if (code === marker) {
			effects.enter(attributeValueMarker);
			effects.consume(code);
			effects.exit(attributeValueMarker);
			effects.exit(attributeValueLiteralType);
			effects.exit(attributeType);

			return valueQuotedAfter;
		}

		effects.enter(attributeValueType);

		return valueQuotedBetween(code);
	}

	function valueQuotedBetween(code: Code): State | undefined {
		if (code === marker) {
			effects.exit(attributeValueType);

			return valueQuotedStart(code);
		}

		if (code === codes.eof) {
			return nok(code);
		}

		// Blank lines cannot exist in content.
		if (markdownLineEnding(code)) {
			return disallowEol ? nok(code) : factoryWhitespace(effects, valueQuotedBetween)(code);
		}

		effects.enter(attributeValueData);
		effects.consume(code);

		return valueQuoted;
	}

	function valueQuoted(code: Code): State | undefined {
		if (code === marker || code === codes.eof || markdownLineEnding(code)) {
			effects.exit(attributeValueData);

			return valueQuotedBetween(code);
		}

		effects.consume(code);

		return valueQuoted;
	}

	function valueQuotedAfter(code: Code): State | undefined {
		return code === codes.rightCurlyBrace || markdownLineEndingOrSpace(code) ? between(code) : end(code);
	}

	function end(code: Code): State | undefined {
		if (code === codes.rightCurlyBrace) {
			effects.enter(attributesMarkerType);
			effects.consume(code);
			effects.exit(attributesMarkerType);
			effects.exit(attributesType);

			return ok;
		}

		return nok(code);
	}
}

// ===== END THIRD-PARTY SOURCE =====
