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

import { getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { ControlledEditor } from "../utils/index.js";

/**
 * A token whose whole content is text needs no element around it: the text node paints
 * the token's class itself.
 *
 * Easy to lose by accident, and losing it puts a second `<span>` around every `#`, every
 * `**` and every word — so the shape is pinned here rather than left to the eye.
 */
describe("MarkdownEditor source mode — DOM shape", () => {
	test("a token that is all text is one element, not two", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue="### Hello world" />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await waitFor(() => {
			const sequence = source.querySelector(".mde-token--atxHeadingSequence");

			expect(sequence?.textContent).toBe("###");
			// The characters sit straight in the token's own element.
			expect(sequence?.children.length).toBe(0);
			expect(sequence?.getAttribute("data-lexical-text")).toBe("true");
		});

		// Same for the heading's text, which micromark wraps in a `data` token the
		// normalizer folds away.
		const text = source.querySelector(".mde-token--atxHeadingText");

		expect(text?.textContent).toBe("Hello world");
		expect(text?.children.length).toBe(0);
		expect(source.querySelector(".mde-token--data")).toBeNull();
	});

	test("a heading keeps its element, because its delimiter is a child", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue="### Hello world" />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await waitFor(() => {
			const heading = source.querySelector(".mde-token--atxHeading");

			// The level lives on the element and the CSS sizes the whole run by it.
			expect(heading?.getAttribute("data-token-level")).toBe("3");
			expect(heading?.children.length).toBe(3);
		});
	});

	test("a run's class follows its type when an edit changes it", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue="" />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);
		await userEvent.type(source, "*word*");

		// The text is `word` either way; only the type around it changed, and the diff
		// has to notice that and not leave the old class on screen.
		await waitFor(() => {
			expect(source.querySelector(".mde-token--emphasis")).not.toBeNull();
			expect(source.querySelector(".mde-token--emphasisText")?.textContent).toBe("word");
		});

		// Take the closing delimiter away and the run is plain text again.
		await userEvent.keyboard("{Backspace}");

		await waitFor(() => {
			expect(source.querySelector(".mde-token--emphasis")).toBeNull();
			expect(source.querySelector(".mde-token--emphasisText")).toBeNull();
		});
	});

	test("Enter at the end of an open fence adds one line, not none", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue="" />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);
		await userEvent.type(source, "```");

		await waitFor(() => expect(source.querySelector(".mde-token--codeFenced")).not.toBeNull());

		await userEvent.keyboard("{Enter}");

		// An unclosed fence keeps the newline in its own block, so the `<br>` has to end the
		// block itself. Inside the fence's `<span>` the browser drops it and Enter needs
		// pressing twice.
		await waitFor(() => {
			const block = source.querySelector(".mde-source-block");

			expect(block?.lastElementChild?.tagName).toBe("BR");
			// Lexical adds a second, managed `<br>` after a block-ending line break —
			// the one that actually paints the empty line.
			expect(block?.querySelectorAll("br").length).toBe(2);
			expect(block?.querySelector(".mde-token--codeFenced br")).toBeNull();
		});
	});

	test("Enter at the end of an open container directive adds one line, not none", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue="" />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);
		await userEvent.type(source, ":::info");

		await waitFor(() => expect(source.querySelector(".mde-token--directiveContainer")).not.toBeNull());

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const block = source.querySelector(".mde-source-block");

			expect(block?.lastElementChild?.tagName).toBe("BR");
			expect(block?.querySelectorAll("br").length).toBe(2);
			expect(block?.querySelector(".mde-token--directiveContainer br")).toBeNull();
		});
	});

	test("a directive name with no markup inside folds into a text node", async () => {
		const { container } = render(<ControlledEditor initialMode="source" initialValue={":::info\nheads up\n:::"} />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		// `directiveContainerName` holds nothing but `info`, so it is a text node now.
		// Anything reading the covering token has to walk text nodes as well as
		// elements, or it misses the name entirely.
		await waitFor(() => {
			const name = source.querySelector(".mde-token--directiveContainerName");

			expect(name?.textContent).toBe("info");
			expect(name?.children.length).toBe(0);
		});
	});
});
