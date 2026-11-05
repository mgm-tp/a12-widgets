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
 * How the editor holds up as the document gets bigger. Counted, not timed.
 *
 * Two things are checked here:
 *
 * - The editor still works well at about 100,000 characters / 25,000 words.
 * - Typing one character does not cost more just because the markdown is long.
 *
 * **Nothing here uses a clock, and that is on purpose.** A test that checks milliseconds
 * checks the computer as much as the code. The same numbers pass on a laptop and fail on a
 * CI machine three times slower, so the test only tells you which computer you are on.
 * Instead this file counts the work the editor asks for: how many times the tokenizer runs,
 * how many characters it gets, how many blocks are built again, and how many times the host
 * is asked to save. Those counts are the same on every computer, so a failure here is always
 * a real change in the editor.
 *
 * What this cannot do: it cannot tell you a keystroke *feels* fast. It shows the reason it
 * stays fast, which is that the work for one keystroke does not grow with the document. If
 * you want real milliseconds, run a benchmark that prints them. A test that has to pass
 * everywhere is the wrong place for it.
 */

import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { ControlledEditor, getSurfaceByMode } from "../utils/index.js";
import {
	blockKeys,
	createLiveEditor,
	createTokenizerCounter,
	placeCaretAtBlockEnd,
	replacedBlocks,
	setDocument,
	typeText
} from "../utils/source-document-harness.js";

/** The size the editor is documented as handling: about 100,000 characters, about 25,000 words. */
const SMOOTH_CEILING = { chars: 100000, words: 25000 } as const;

/** What separates two paragraphs in markdown. */
const BLANK_LINE = "\n\n";

/** Words the way a person counts them, which is how the ceiling above is written. */
function countWordsInText(text: string): number {
	return text.split(/\s+/u).filter(Boolean).length;
}

/** One paragraph of the test document. */
function buildParagraph(index: number): string {
	return `Paragraph ${index} with **bold**, *italic* and some plain words in it.`;
}

/** A document of `count` paragraphs, split by blank lines, so it holds 2 * count - 1 blocks. */
function generateParagraphs(count: number): string {
	return Array.from({ length: count }, (_, index) => buildParagraph(index)).join(BLANK_LINE);
}

/**
 * A document big enough to reach both halves of the ceiling.
 *
 * The count is worked out from the size of one paragraph, so there is no guessing and no
 * loop. Both halves are needed because they do not arrive together: this prose runs about
 * six characters to a word, so 25,000 words is reached later than 100,000 characters. We
 * take whichever count is larger.
 *
 * Paragraph 0 is the shortest one, since later ones carry a longer number. Measuring the
 * shortest can only ask for too many paragraphs, never too few, and the first test below
 * checks the result really did reach the ceiling.
 */
function buildCeilingDocument(): string {
	const firstParagraph = buildParagraph(0);
	const charsPerParagraph = firstParagraph.length + BLANK_LINE.length;
	const wordsPerParagraph = countWordsInText(firstParagraph);

	const paragraphsForChars = Math.ceil(SMOOTH_CEILING.chars / charsPerParagraph);
	const paragraphsForWords = Math.ceil(SMOOTH_CEILING.words / wordsPerParagraph);

	return generateParagraphs(Math.max(paragraphsForChars, paragraphsForWords));
}

/** The three document sizes every keystroke check runs against. */
const SMALL_DOCUMENT = generateParagraphs(20);
const LARGE_DOCUMENT = generateParagraphs(200);
const CEILING_DOCUMENT = buildCeilingDocument();

/** Named so a failing test says which size it was measuring. */
const DOCUMENT_SIZES = [
	{ name: "20 paragraphs", markdown: SMALL_DOCUMENT },
	{ name: "200 paragraphs", markdown: LARGE_DOCUMENT },
	{ name: "the documented ceiling", markdown: CEILING_DOCUMENT }
];

/** What one keystroke asked the editor to do. Every field is a count, never a duration. */
interface KeystrokeWork {
	/** How many times the tokenizer ran. */
	tokenizerCalls: number;

	/** How many characters the tokenizer was given in total. */
	parsedCharacters: number;

	/** How many blocks were thrown away and built again. */
	rebuiltBlocks: number;
}

/**
 * Types one character into `markdown` and reports the work it caused.
 *
 * The caret goes at the end of the last block, which is a paragraph. Blocks with an odd index
 * are the blank lines between paragraphs. Typing into a blank line joins three blocks into
 * one, and that is a bigger change than the plain keystroke we want to measure.
 */
function measureOneKeystroke(markdown: string): KeystrokeWork {
	const counter = createTokenizerCounter();
	const editor = createLiveEditor(counter.tokenize);

	// Load the document first. This parse is setup, not the keystroke.
	setDocument(editor, markdown, counter.tokenize);

	// Remember the block nodes so we can see afterwards which ones survived.
	const blocksBeforeTyping = blockKeys(editor);

	// Start counting only now, so the numbers below belong to the keystroke alone.
	counter.reset();

	placeCaretAtBlockEnd(editor, blocksBeforeTyping.length - 1);
	typeText(editor, "X");

	return {
		tokenizerCalls: counter.calls,
		parsedCharacters: counter.chars,
		rebuiltBlocks: replacedBlocks(blocksBeforeTyping, blockKeys(editor))
	};
}

describe("the documented ceiling", () => {
	test("the test document really is that big", () => {
		// Checked first. Every size comparison below means nothing if the biggest document
		// turns out to be smaller than the size we promise.
		expect(CEILING_DOCUMENT.length).toBeGreaterThanOrEqual(SMOOTH_CEILING.chars);
		expect(countWordsInText(CEILING_DOCUMENT)).toBeGreaterThanOrEqual(SMOOTH_CEILING.words);
	});
});

describe("one keystroke costs the same however long the document is", () => {
	/** A keystroke may parse the block it is in and the few around it, but no more. */
	const MAX_TOKENIZER_CALLS = 4;

	/** A few blocks worth of characters. A whole document is far past this at every size. */
	const MAX_PARSED_CHARACTERS = 500;

	for (const documentSize of DOCUMENT_SIZES) {
		test(`${documentSize.name}: the tokenizer only sees the edited block`, () => {
			const work = measureOneKeystroke(documentSize.markdown);

			// If a keystroke ever started parsing the whole document again,
			// both of these would grow with the document instead of staying flat.
			expect(work.tokenizerCalls).toBeLessThanOrEqual(MAX_TOKENIZER_CALLS);
			expect(work.parsedCharacters).toBeLessThan(MAX_PARSED_CHARACTERS);
		});

		test(`${documentSize.name}: no block is built again`, () => {
			const work = measureOneKeystroke(documentSize.markdown);

			// The text of the edited block changed, but its node did not.
			// The new highlighting goes into the block that is already on screen, so nothing else is rebuilt.
			expect(work.rebuiltBlocks).toBe(0);
		});
	}

	test("a document 50 times longer does not cost more per keystroke", () => {
		const smallDocumentWork = measureOneKeystroke(SMALL_DOCUMENT);
		const ceilingDocumentWork = measureOneKeystroke(CEILING_DOCUMENT);

		// First make sure the two documents really are very different sizes,
		// or the comparison below proves nothing.
		expect(CEILING_DOCUMENT.length).toBeGreaterThan(SMALL_DOCUMENT.length * 50);

		// Then check that none of the three counts grew along with them.
		expect(ceilingDocumentWork.tokenizerCalls).toBe(smallDocumentWork.tokenizerCalls);
		expect(ceilingDocumentWork.parsedCharacters).toBeLessThan(smallDocumentWork.parsedCharacters + 100);
		expect(ceilingDocumentWork.rebuiltBlocks).toBe(smallDocumentWork.rebuiltBlocks);
	});
});

/*
 * Saving is the other half. Writing the document back to markdown always costs more for a
 * bigger document, because the editor has to go through all of it. So the point is not that a
 * save is cheap. The point is that a save does not happen on every keystroke: the default emit
 * mode ("debounced") waits until typing stops and then writes once, so that cost is paid one
 * time for the whole burst instead of once per character.
 */
describe("a burst of typing saves once, not once per keystroke", () => {
	/** Long enough that one save per keystroke would be obvious. */
	const KEYSTROKES_IN_A_BURST = 12;

	/**
	 * Wider than the default 300 ms, so a slow keystroke on a loaded CI machine cannot split
	 * the burst into two windows. The burst behaviour is the same at any length.
	 */
	const DEBOUNCE_MS = 1000;

	/** Types a burst into a new editor and returns how many times the host was told to save. */
	async function countSavesForOneBurst(markdown: string): Promise<number> {
		const onChange = vi.fn();
		const { container, unmount } = render(
			<ControlledEditor label="Notes" initialValue={markdown} emitDebounceMs={DEBOUNCE_MS} onChange={onChange} />
		);

		// Wait for the editor to appear, then put the caret in it.
		const surface = await waitFor(() => {
			const editable = getSurfaceByMode(container, "edit");
			expect(editable).toHaveAttribute("contenteditable", "true");

			return editable;
		});
		await userEvent.click(surface);

		// Type without pausing, so the whole burst falls inside one debounce window.
		for (let keystroke = 0; keystroke < KEYSTROKES_IN_A_BURST; keystroke += 1) {
			await userEvent.keyboard("x");
		}

		// The debounce holds one timer, so once it has fired no further save is pending.
		await waitFor(() => expect(onChange).toHaveBeenCalled(), { timeout: DEBOUNCE_MS * 5 });

		const saves = onChange.mock.calls.length;

		unmount();

		return saves;
	}

	test("twelve keystrokes cause one save", async () => {
		// One save, no matter how many characters were typed.
		expect(await countSavesForOneBurst(LARGE_DOCUMENT)).toBe(1);
	});

	test("the number of saves does not grow with the document", async () => {
		const savesForLarge = await countSavesForOneBurst(LARGE_DOCUMENT);
		const savesForSmall = await countSavesForOneBurst(SMALL_DOCUMENT);

		expect(savesForLarge).toBe(savesForSmall);
	});
});
