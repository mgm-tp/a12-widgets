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
 * https://github.com/micromark/micromark-extension-directive/blob/4.0.0/dev/lib/factory-label.js
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
 *   so this matches what upstream ships. The caller only enters here on a `[`.
 * - TypeScript types and our formatting.
 *
 * That is the whole list. The grammar is untouched.
 * See `enhanced-micromark-directive.ts`.
 *
 * That file is itself a fork of `micromark-factory-label`, so that labels may be
 * empty, brackets may balance (which nested directives need), the content is text
 * rather than a string, and line endings can be turned off.
 */

import { markdownLineEnding } from "micromark-util-character";
import { codes, constants, types } from "micromark-util-symbol";
import type { Code, Effects, State, Token, TokenType } from "micromark-util-types";

export function factoryLabel(
	effects: Effects,
	ok: State,
	nok: State,
	type: TokenType,
	markerType: TokenType,
	stringType: TokenType,
	disallowEol?: boolean
): State {
	let size = 0;
	let balance = 0;
	let previous: Token | undefined;

	return start;

	function start(code: Code): State | undefined {
		// Upstream asserts `code` is `[` here. Dropped, like in the package's own
		// published build, so we do not pull in `devlop`.
		effects.enter(type);
		effects.enter(markerType);
		effects.consume(code);
		effects.exit(markerType);

		return afterStart;
	}

	function afterStart(code: Code): State | undefined {
		if (code === codes.rightSquareBracket) {
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			effects.exit(type);

			return ok;
		}

		effects.enter(stringType);

		return lineStart(code);
	}

	function lineStart(code: Code): State | undefined {
		if (code === codes.rightSquareBracket && !balance) {
			return atClosingBrace(code);
		}

		const token = effects.enter(types.chunkText, {
			_contentTypeTextTrailing: true,
			contentType: constants.contentTypeText,
			previous
		});

		if (previous) {
			previous.next = token;
		}

		previous = token;

		return data(code);
	}

	function data(code: Code): State | undefined {
		if (code === codes.eof || size > constants.linkReferenceSizeMax) {
			return nok(code);
		}

		if (code === codes.leftSquareBracket && ++balance > constants.linkResourceDestinationBalanceMax) {
			return nok(code);
		}

		if (code === codes.rightSquareBracket && !balance--) {
			effects.exit(types.chunkText);

			return atClosingBrace(code);
		}

		if (markdownLineEnding(code)) {
			if (disallowEol) {
				return nok(code);
			}

			effects.consume(code);
			effects.exit(types.chunkText);

			return lineStart;
		}

		effects.consume(code);

		return code === codes.backslash ? dataEscape : data;
	}

	function dataEscape(code: Code): State | undefined {
		if (code === codes.leftSquareBracket || code === codes.backslash || code === codes.rightSquareBracket) {
			effects.consume(code);
			size++;

			return data;
		}

		return data(code);
	}

	function atClosingBrace(code: Code): State | undefined {
		effects.exit(stringType);
		effects.enter(markerType);
		effects.consume(code);
		effects.exit(markerType);
		effects.exit(type);

		return ok;
	}
}

// ===== END THIRD-PARTY SOURCE =====
