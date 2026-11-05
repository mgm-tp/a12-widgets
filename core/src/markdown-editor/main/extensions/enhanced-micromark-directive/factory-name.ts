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
 * https://github.com/micromark/micromark-extension-directive/blob/4.0.0/dev/lib/factory-name.js
 * Licensed under the MIT License.
 * Copyright (c) Titus Wormer <tituswormer@gmail.com>
 * Modified by mgm technology partners on 2026-09-11.
 *
 * Copied because the package's `exports` map keeps `lib/` private.
 *
 * Changed from upstream:
 *
 * - TypeScript types and our formatting.
 *
 * That is the whole list. The grammar is untouched, and upstream has no `devlop`
 * assert in this file to drop.
 * See `enhanced-micromark-directive.ts`.
 */

import { markdownLineEnding, unicodePunctuation, unicodeWhitespace } from "micromark-util-character";
import { codes } from "micromark-util-symbol";
import type { Code, Effects, State, TokenizeContext, TokenType } from "micromark-util-types";

export function factoryName(this: TokenizeContext, effects: Effects, ok: State, nok: State, type: TokenType): State {
	// oxlint-disable-next-line typescript/no-this-alias -- micromark state functions are plain closures; they need the tokenize context captured
	const self = this;

	return start;

	function start(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code) || unicodePunctuation(code) || unicodeWhitespace(code)) {
			return nok(code);
		}

		effects.enter(type);
		effects.consume(code);

		return name;
	}

	function name(code: Code): State | undefined {
		if (
			code === codes.eof ||
			markdownLineEnding(code) ||
			unicodeWhitespace(code) ||
			(unicodePunctuation(code) && code !== codes.dash && code !== codes.underscore)
		) {
			effects.exit(type);

			return self.previous === codes.dash || self.previous === codes.underscore ? nok(code) : ok(code);
		}

		effects.consume(code);

		return name;
	}
}

// ===== END THIRD-PARTY SOURCE =====
