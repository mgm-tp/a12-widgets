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
 * https://github.com/micromark/micromark-extension-directive/blob/4.0.0/dev/lib/directive-container.js
 * Licensed under the MIT License.
 * Copyright (c) Titus Wormer <tituswormer@gmail.com>
 * Modified by mgm technology partners on 2026-09-11.
 *
 * Changed from upstream:
 *
 * - `sequenceOpen` wants a fence of exactly three colons. Upstream takes three or more,
 *   and remembers how many it took in `sizeOpen`.
 * - `sizeOpen` is therefore only read to reject a fence of the wrong width.
 *   State is kept over the whole block instead: `openInside`, plus `opaqueUntilLine`
 *   and `opaqueSealed`.
 * - `tokenizeClosingFence` is now `tokenizeBoundaryLine`. Upstream asks only whether
 *   a line closes this block; this one reads every content line, because a line that
 *   does not close it can still change who the next line of colons belongs to.
 *   Its states `closingPrefixAfter`, `closingSequence` and `closingSequenceEnd` are
 *   `afterPrefix`, `colonSequence` and `colonSequenceEnd` here, with the rest new.
 * - `colonSequence` wants exactly three colons, where upstream wants at least `sizeOpen`.
 * - `:::name` on a content line is pushed onto `openInside` and goes on as content, so
 *   the block it opens is read by the inner parse.
 * - A line of bare colons closes the innermost directive that is open: while
 *   `openInside` holds anything it pops instead of closing this block. That is what lets
 *   three colons nest.
 * - `openInside` is a stack, not a count, because a directive can also end without a
 *   fence of its own — the list item holding it ends. Each entry keeps the column a
 *   later line must reach to still be inside it, and entries left behind are dropped.
 * - Code blocks and raw HTML blocks are read through with CommonMark's own
 *   `codeFenced` and `htmlFlow`, taken from the live construct registry rather than
 *   copied, so a `:::name` line inside one is not counted. Inside a closed code block
 *   a fence line is not read either — showing this syntax in a code sample has to
 *   work. Raw HTML and an unclosed fence have no ending of their own, so there this
 *   block's fence still ends them.
 * - All three are read after a list marker as well (`- :::name`, `- ```", `- <div>`),
 *   since the line that ends them is read like any other. A marker that puts the
 *   item's content at column four is skipped, because that line is then out of reach.
 * - `isName` and `FENCE_SIZE` are new.
 * - TypeScript types, our formatting, and the dropped `devlop` assert.
 *
 * See `enhanced-micromark-directive.ts` for why the file was copied.
 */

import { factorySpace } from "micromark-factory-space";
import {
	asciiDigit,
	markdownLineEnding,
	markdownSpace,
	unicodePunctuation,
	unicodeWhitespace
} from "micromark-util-character";
import { codes, constants, types } from "micromark-util-symbol";
import type { Code, Construct, Effects, State, Token, TokenizeContext } from "micromark-util-types";

import { factoryAttributes } from "./factory-attributes.js";
import { factoryLabel } from "./factory-label.js";
import { factoryName } from "./factory-name.js";

/** A container fence is three colons. Not two, not four. */
const FENCE_SIZE = 3;

/** A directive that no column can reach past, only a line of colons. */
const NO_COLUMN = -1;

/**
 * The `:::name` block. Two changes from upstream, and they go together.
 *
 * A fence is three colons, always. Four or more is not a fence, it is text.
 *
 * And a line of three colons closes the innermost directive that is still open,
 * not this one. So directives nest without needing a longer fence:
 *
 * ```md
 * :::warning
 * :::info
 * info
 * :::
 * footer
 * :::
 * ```
 *
 * Upstream does the opposite. It accepts any fence of three colons or more
 * and each block compares a fence line with its own colon count. Nothing counts the directives
 * that opened in between, so the only way to nest is to give the outer block more colons.
 * Here the open ones are kept instead, in {@link openInside}.
 */
export const directiveContainer: Construct = {
	tokenize: tokenizeDirectiveContainer,
	concrete: true
};

/**
 * Whether a `:::` is followed by a directive name.
 *
 * The same check `factoryName` makes, so a line the inner parse will not read as a
 * directive — `:::-nope` — is not counted. Count it by mistake and the next line of
 * colons would go to a directive that never opened.
 *
 * `markdownSpace` is asked as well as `unicodeWhitespace`, because micromark hands a
 * tab over as its own code, not as the character. Without it `:::\t` would look like a
 * name and open a block nobody wrote.
 */
function isName(code: Code): boolean {
	return !(
		code === codes.eof ||
		markdownLineEnding(code) ||
		markdownSpace(code) ||
		unicodeWhitespace(code) ||
		unicodePunctuation(code)
	);
}

const label = { tokenize: tokenizeLabel, partial: true };
const attributes = { tokenize: tokenizeAttributes, partial: true };
const nonLazyLine = { tokenize: tokenizeNonLazyLine, partial: true };

function tokenizeDirectiveContainer(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
	// oxlint-disable-next-line typescript/no-this-alias -- micromark state functions are plain closures; they need the tokenize context captured
	const self = this;
	const tail = self.events[self.events.length - 1];
	const initialSize = tail && tail[1].type === types.linePrefix ? tail[2].sliceSerialize(tail[1], true).length : 0;
	let sizeOpen = 0;

	/**
	 * The `:::name` fences opened inside this block that are still open, innermost last.
	 * While it holds anything, a line of colons belongs to one of them, not to us.
	 *
	 * Each entry says how far in a later line has to start to still be inside that
	 * directive. A directive opened after a list marker lives in the list item, so its
	 * closing line sits at the item's content column; a line further left means the list
	 * has ended and took the directive with it. A directive opened on a line of our own
	 * has no such column — one to three spaces of indent are the same block level — so it
	 * stores `-1` and is only ever closed by a line of colons.
	 *
	 * That second case is why a plain count is not enough. A directive can end without a
	 * fence of its own, and a count has no way to drop it again.
	 */
	const openInside: number[] = [];

	/**
	 * The last line of the code block or raw HTML block we are inside, `0` when we are
	 * inside neither. Colons on those lines are content, not a fence.
	 */
	let opaqueUntilLine = 0;

	/**
	 * Whether a line inside that block is content and nothing else, so that not even a
	 * fence line ends this block.
	 *
	 * True for a code block that is closed: `:::` inside one is a code sample, and
	 * showing this very syntax in a code block has to work.
	 *
	 * False for raw HTML, and for a code fence left unclosed. Neither has an ending of
	 * its own in the document — an HTML block runs to the next blank line, an unclosed
	 * fence to the end of everything — so reading their lines as content would let a
	 * panel swallow the rest of the document. This block's fence ends them instead.
	 */
	let opaqueSealed = false;
	let previous: Token | undefined;

	return start;

	function start(code: Code): State | undefined {
		effects.enter("directiveContainer");
		effects.enter("directiveContainerFence");
		effects.enter("directiveContainerSequence");

		return sequenceOpen(code);
	}

	function sequenceOpen(code: Code): State | undefined {
		if (code === codes.colon) {
			effects.consume(code);
			sizeOpen++;

			return sequenceOpen;
		}

		if (sizeOpen !== FENCE_SIZE) {
			return nok(code);
		}

		effects.exit("directiveContainerSequence");

		return factoryName.call(self, effects, afterName, nok, "directiveContainerName")(code);
	}

	function afterName(code: Code): State | undefined {
		return code === codes.leftSquareBracket ? effects.attempt(label, afterLabel, afterLabel)(code) : afterLabel(code);
	}

	function afterLabel(code: Code): State | undefined {
		return code === codes.leftCurlyBrace
			? effects.attempt(attributes, afterAttributes, afterAttributes)(code)
			: afterAttributes(code);
	}

	function afterAttributes(code: Code): State | undefined {
		return factorySpace(effects, openAfter, types.whitespace)(code);
	}

	function openAfter(code: Code): State | undefined {
		effects.exit("directiveContainerFence");

		if (code === codes.eof) {
			return after(code);
		}

		if (markdownLineEnding(code)) {
			if (self.interrupt) {
				return ok(code);
			}

			return effects.attempt(nonLazyLine, contentStart, after)(code);
		}

		return nok(code);
	}

	function contentStart(code: Code): State | undefined {
		if (code === codes.eof) {
			return after(code);
		}

		if (markdownLineEnding(code)) {
			return effects.check(nonLazyLine, emptyContentNonLazyLineAfter, after)(code);
		}

		effects.enter("directiveContainerContent");

		return lineStart(code);
	}

	function lineStart(code: Code): State | undefined {
		return effects.attempt(
			{ tokenize: tokenizeBoundaryLine, partial: true },
			afterContent,
			initialSize ? factorySpace(effects, chunkStart, types.linePrefix, initialSize + 1) : chunkStart
		)(code);
	}

	function chunkStart(code: Code): State | undefined {
		if (code === codes.eof) {
			return afterContent(code);
		}

		if (markdownLineEnding(code)) {
			return effects.check(nonLazyLine, chunkNonLazyStart, afterContent)(code);
		}

		return chunkNonLazyStart(code);
	}

	function contentContinue(code: Code): State | undefined {
		if (code === codes.eof) {
			const t = effects.exit(types.chunkDocument);

			self.parser.lazy[t.start.line] = false;

			return afterContent(code);
		}

		if (markdownLineEnding(code)) {
			return effects.check(nonLazyLine, nonLazyLineAfter, lineAfter)(code);
		}

		effects.consume(code);

		return contentContinue;
	}

	function chunkNonLazyStart(code: Code): State | undefined {
		const token = effects.enter(types.chunkDocument, {
			contentType: constants.contentTypeDocument,
			previous
		});

		if (previous) {
			previous.next = token;
		}

		previous = token;

		return contentContinue(code);
	}

	function emptyContentNonLazyLineAfter(code: Code): State | undefined {
		effects.enter("directiveContainerContent");

		return lineStart(code);
	}

	function nonLazyLineAfter(code: Code): State | undefined {
		effects.consume(code);

		const t = effects.exit(types.chunkDocument);

		self.parser.lazy[t.start.line] = false;

		return lineStart;
	}

	function lineAfter(code: Code): State | undefined {
		const t = effects.exit(types.chunkDocument);

		self.parser.lazy[t.start.line] = false;

		return afterContent(code);
	}

	function afterContent(code: Code): State | undefined {
		effects.exit("directiveContainerContent");

		return after(code);
	}

	function after(code: Code): State | undefined {
		effects.exit("directiveContainer");

		return ok(code);
	}

	/**
	 * Reads one line of content and decides whether that line ends this block.
	 *
	 * Upstream only looks for a closing fence here. This version also watches for the
	 * lines that change who a later `:::` belongs to: a `:::name` that opens a directive
	 * inside this one, and a ``` fence that starts a code block, where colons are just
	 * text. Both are read after a list marker too (`- :::name`, `- ```").
	 *
	 * Only a line that really closes this block reaches `ok`. Every other line goes to
	 * `nok`. Micromark then drops the tokens this function made and reads the line as
	 * content instead. The two counters live outside this function, so they keep their
	 * values when that happens — and that is what makes the counting work.
	 */
	function tokenizeBoundaryLine(effects: Effects, ok: State, nok: State): State {
		let size = 0;
		let markerSpaces = 0;
		let markerTab = false;

		/** Where this line's text starts, after the indent the prefix above ate. */
		let prefixColumn = 0;

		/** Where a list item's content starts, for a directive opened on its marker line. */
		let markerColumn = 0;

		/** Whether this line sits inside a code or HTML block an earlier line opened. */
		let inOpaque = false;

		return factorySpace(
			effects,
			afterPrefix,
			types.linePrefix,
			self.parser.constructs.disable.null?.includes("codeIndented") ? undefined : constants.tabSize
		);

		function afterPrefix(code: Code): State | undefined {
			inOpaque = self.now().line <= opaqueUntilLine;
			prefixColumn = self.now().column - 1;

			// The line that opens a code block or a raw HTML block. Read it through to
			// learn which lines it covers, so those lines are not read as markdown.
			if (!inOpaque) {
				if (code === codes.graveAccent || code === codes.tilde) {
					return probeFor("codeFenced", code);
				}

				if (code === codes.lessThan) {
					return probeFor("htmlFlow", code);
				}
			}

			// A line inside a block that ends on its own is that block's content, whatever
			// it says. A block still waiting for its end is different: this block's fence
			// is what ends it, so a fence line is still read below.
			if (inOpaque && opaqueSealed) {
				return nok(code);
			}

			if (code === codes.colon) {
				effects.enter("directiveContainerFence");
				effects.enter("directiveContainerSequence");

				return colonSequence(code);
			}

			// A list marker can stand before the colons: `- :::inner`. The block that
			// opens there is still a block inside this one, and its closing `:::` sits at
			// the item's content column, which this function reads like any other line.
			// So the opener has to be counted, or the closer would be taken for ours.
			if (
				!inOpaque &&
				(code === codes.dash || code === codes.plusSign || code === codes.asterisk || asciiDigit(code))
			) {
				// Micromark asks that every character we read belongs to an open token.
				effects.enter(types.listItemPrefix);

				return asciiDigit(code) ? markerValue(code) : markerAfter(code);
			}

			return nok(code);
		}

		/**
		 * Runs one of CommonMark's own block constructs to see how far the block starting
		 * here reaches, then throws the run away and keeps only the answer.
		 *
		 * Reading code fences and the seven kinds of HTML block by hand would mean
		 * copying those grammars, and a wrong guess is worse than none: a paragraph line
		 * like `<https://example.test>` also starts with `<`. Borrowing the live
		 * constructs keeps the answer right, and follows whatever the host turned on or
		 * off.
		 */
		function probeFor(name: "codeFenced" | "htmlFlow", code: NonNullable<Code>): State | undefined {
			const hooks = self.parser.constructs.flow?.[code];
			const construct = ((Array.isArray(hooks) ? hooks : hooks ? [hooks] : []) as Construct[]).find(
				(candidate) => candidate.name === name
			);

			if (!construct) {
				return nok(code);
			}

			const probe: Construct = {
				partial: true,
				tokenize: (probeEffects, probeOk, probeNok) =>
					construct.tokenize.call(
						self,
						probeEffects,
						(after: Code) => {
							opaqueUntilLine = self.now().line;
							opaqueSealed = name === "codeFenced" && after !== codes.eof;

							return probeOk(after);
						},
						probeNok
					)
			};

			return effects.check(probe, afterProbe, afterProbe)(code);
		}

		/**
		 * The line opened a code or HTML block, or turned out not to. Either way it is
		 * not a boundary: the run above only recorded where that block ends.
		 */
		function afterProbe(code: Code): State | undefined {
			return nok(code);
		}

		/** The digits of an ordered list marker, before its `.` or `)`. */
		function markerValue(code: Code): State | undefined {
			if (asciiDigit(code)) {
				effects.consume(code);

				return markerValue;
			}

			if (code === codes.dot || code === codes.rightParenthesis) {
				return markerAfter(code);
			}

			effects.exit(types.listItemPrefix);

			return nok(code);
		}

		/** The last character of the marker, then the space that must follow it. */
		function markerAfter(code: Code): State | undefined {
			effects.consume(code);

			return markerSpace;
		}

		function markerSpace(code: Code): State | undefined {
			if (markdownSpace(code)) {
				effects.consume(code);
				markerSpaces++;

				// A tab after the marker puts the item's content at column four at the
				// earliest, and the prefix above is counted in characters, not columns, so
				// the closing line reads as one tab and stops short of the colons. The
				// column below does not see that, so the tab is remembered here.
				if (code === codes.horizontalTab || code === codes.virtualSpace) {
					markerTab = true;
				}

				return markerSpace;
			}

			// Without a space it is not a list marker, it is text: `-:::inner`.
			//
			// And the closing line of whatever opens after the marker has to be readable
			// by this same function, which stops at a prefix of three. If the item's
			// content starts further in, that closer is out of reach, so reading the
			// opener would leave a tally that never comes back down.
			if (markerSpaces === 0 || markerTab || self.now().column - 1 >= constants.tabSize) {
				effects.exit(types.listItemPrefix);

				return nok(code);
			}

			// A code block or a raw HTML block can start on the marker line: `- ```",
			// `- <div>`. The line that ends it sits at the item's content column, which
			// this function does read — and would take for an opener. So the opening line
			// has to be read here too, or the two swap around.
			if (code === codes.graveAccent || code === codes.tilde || code === codes.lessThan) {
				effects.exit(types.listItemPrefix);

				return probeFor(code === codes.lessThan ? "htmlFlow" : "codeFenced", code);
			}

			if (code !== codes.colon) {
				effects.exit(types.listItemPrefix);

				return nok(code);
			}

			markerColumn = self.now().column - 1;

			// The marker token stays open over the colons. Micromark asks that every
			// character we read belongs to an open token, and the whole line is dropped
			// on the way out anyway.
			return markerColonSequence(code);
		}

		/**
		 * The colons of a `:::name` that follows a list marker.
		 *
		 * This line can never close this block — it is inside a list item — so every path
		 * here ends in `nok`. The only thing it does is count.
		 */
		function markerColonSequence(code: Code): State | undefined {
			if (code === codes.colon) {
				effects.consume(code);
				size++;

				return markerColonSequence;
			}

			effects.exit(types.listItemPrefix);

			if (size === FENCE_SIZE && isName(code)) {
				openInside.push(markerColumn);
			}

			return nok(code);
		}

		function colonSequence(code: Code): State | undefined {
			if (code === codes.colon) {
				effects.consume(code);
				size++;

				return colonSequence;
			}

			// Four colons or more is text, the same as one or two.
			if (size !== FENCE_SIZE) {
				return nok(code);
			}

			// This line is colons at `prefixColumn`, so every directive that had to be
			// entered further in than that has been left by now — its list item or its
			// quote ended somewhere above. Drop those before reading the line, or the
			// tally would stay up for the rest of the document.
			if (!inOpaque) {
				while (openInside.length > 0 && openInside[openInside.length - 1] > prefixColumn) {
					openInside.pop();
				}
			}

			// A name right after the colons means a directive opens inside this one. Note
			// it, then send the line on as content so the inner parse reads it too.
			if (isName(code)) {
				// Inside a code or HTML block this is text, not a directive, so there is
				// nothing to note. The line may still end this block, as above.
				if (!inOpaque) {
					openInside.push(NO_COLUMN);
				}

				return nok(code);
			}

			effects.exit("directiveContainerSequence");

			return factorySpace(effects, colonSequenceEnd, types.whitespace)(code);
		}

		function colonSequenceEnd(code: Code): State | undefined {
			if (code !== codes.eof && !markdownLineEnding(code)) {
				return nok(code);
			}

			// Colons on their own. They close the innermost directive still open, and this
			// block only once none is left.
			if (openInside.length > 0) {
				openInside.pop();

				return nok(code);
			}

			effects.exit("directiveContainerFence");

			return ok(code);
		}
	}
}

function tokenizeLabel(effects: Effects, ok: State, nok: State): State {
	// Always a `[`.
	return factoryLabel(
		effects,
		ok,
		nok,
		"directiveContainerLabel",
		"directiveContainerLabelMarker",
		"directiveContainerLabelString",
		true
	);
}

function tokenizeAttributes(effects: Effects, ok: State, nok: State): State {
	// Always a `{`.
	return factoryAttributes(
		effects,
		ok,
		nok,
		"directiveContainerAttributes",
		"directiveContainerAttributesMarker",
		"directiveContainerAttribute",
		"directiveContainerAttributeId",
		"directiveContainerAttributeClass",
		"directiveContainerAttributeName",
		"directiveContainerAttributeInitializerMarker",
		"directiveContainerAttributeValueLiteral",
		"directiveContainerAttributeValue",
		"directiveContainerAttributeValueMarker",
		"directiveContainerAttributeValueData",
		true
	);
}

function tokenizeNonLazyLine(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
	// oxlint-disable-next-line typescript/no-this-alias -- micromark state functions are plain closures; they need the tokenize context captured
	const self = this;

	return start;

	function start(code: Code): State | undefined {
		effects.enter(types.lineEnding);
		effects.consume(code);
		effects.exit(types.lineEnding);

		return lineStart;
	}

	function lineStart(code: Code): State | undefined {
		return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
	}
}

// ===== END THIRD-PARTY SOURCE =====
