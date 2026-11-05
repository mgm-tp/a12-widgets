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
 * Directives the editor does not know.
 *
 * Markdown a host stores may carry constructs from somewhere else — another tool's
 * `:::spoiler`, a template engine's `::include`. The editor cannot render those, but it must
 * not eat them either: what comes in has to go back out character for character, or opening a
 * document in this editor and saving it would quietly delete a part of it.
 *
 * So an unknown directive becomes a read-only box holding the parsed directive as JSON.
 * The box is what the user sees; the JSON is what gets written back.
 */

import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
	ControlledEditor,
	getSurfaceByMode,
	getUnknownDirective,
	queryUnknownDirective,
	switchMode
} from "../utils/index.js";

/** The three directive shapes, with the marker each one is drawn with. */
const CONTAINER = ":::spoiler\nhidden\n:::";

const LEAF = "::figure";

const TEXT = "a :abbr[HTML] b";

/** Renders `markdown` and hands back the placeholder box it drew for the directive. */
async function renderDirective(markdown: string, props: { mode?: "edit" | "view" } = {}): Promise<HTMLElement> {
	const { container } = render(<ControlledEditor initialValue={markdown} initialMode={props.mode ?? "edit"} />);

	return waitFor(() => getUnknownDirective(container));
}

describe("unknown directives — how they look", () => {
	test("a container directive becomes a box showing its marker and name", async () => {
		const box = await renderDirective(CONTAINER);

		expect(box.querySelector("code")).toHaveTextContent(":::spoiler");
		// The text inside the directive is shown next to the badge, so the box says what it holds.
		expect(box).toMatchTextContent("hidden");
	});

	test("each shape keeps its own marker", async () => {
		expect((await renderDirective(LEAF)).querySelector("code")).toHaveTextContent("::figure");
		expect((await renderDirective(TEXT)).querySelector("code")).toHaveTextContent(":abbr");
	});

	test("a text directive is drawn inline, the block shapes are not", async () => {
		expect((await renderDirective(TEXT)).tagName).toBe("SPAN");
		expect((await renderDirective(CONTAINER)).tagName).toBe("DIV");
	});

	test("the box carries a title, so hovering it explains what it is", async () => {
		expect(await renderDirective(CONTAINER)).toHaveAttribute("title");
	});

	test("it renders in view mode too", async () => {
		const box = await renderDirective(CONTAINER, { mode: "view" });

		expect(box.querySelector("code")).toHaveTextContent(":::spoiler");
	});

	test("the box itself cannot be typed into", async () => {
		const box = await renderDirective(CONTAINER);

		// A decorator node: Lexical marks the element holding it as not editable, so a
		// keystroke aimed at the box never reaches the unknown content.
		expect(box.closest('[contenteditable="false"]')).not.toBeNull();
	});
});

describe("unknown directives — surviving a round trip", () => {
	/** Renders, types a word into the paragraph before the directive, returns the emitted markdown. */
	async function editAround(markdown: string): Promise<string> {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue={markdown} onChange={onChange} emitMode="change" />);

		await waitFor(() => getUnknownDirective(container));

		const surface = getSurfaceByMode(container);
		const paragraph = surface.querySelector("p");

		await userEvent.click(paragraph ?? surface);
		await userEvent.keyboard("!");

		await waitFor(() => expect(onChange).toHaveBeenCalled());

		return String(onChange.mock.calls.at(-1)?.[0]);
	}

	test("an edit elsewhere gives the directive back untouched", async () => {
		const markdown = await editAround(`before\n\n${CONTAINER}\n\nafter`);

		expect(markdown).toContain(":::spoiler");
		expect(markdown).toContain("hidden");
		expect(markdown).toContain("before!");
	});

	test("its attributes come back too", async () => {
		const markdown = await editAround(`before\n\n:::spoiler{title="Boo" open}\nhidden\n:::\n\nafter`);

		expect(markdown).toContain('title="Boo"');
		expect(markdown).toContain("open");
	});

	test("switching to source and back leaves it as it was", async () => {
		const source = `before\n\n${CONTAINER}\n\nafter`;
		const { container } = render(<ControlledEditor initialValue={source} />);

		await waitFor(() => getUnknownDirective(container));

		await switchMode(container, "source");

		// Source mode shows the raw markdown, which is the one place an unknown directive
		// can actually be edited.
		await waitFor(() => expect(getSurfaceByMode(container, "source").textContent).toContain(":::spoiler"));

		await switchMode(container, "edit");

		await waitFor(() => expect(getUnknownDirective(container)).toBeInTheDocument());
	});
});

describe("unknown directives — removing one", () => {
	test("clicking selects the box and Backspace takes it out", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={`before\n\n${CONTAINER}\n\nafter`} onChange={onChange} emitMode="change" />
		);

		const box = await waitFor(() => getUnknownDirective(container));

		await userEvent.click(box);
		await waitFor(() => expect(box).toHaveAttribute("data-selected"));

		await userEvent.keyboard("{Backspace}");

		await waitFor(() => {
			const markdown = String(onChange.mock.calls.at(-1)?.[0]);

			expect(markdown).not.toContain(":::spoiler");
			// Only the directive goes; what surrounded it stays.
			expect(markdown).toContain("before");
			expect(markdown).toContain("after");
		});

		expect(queryUnknownDirective(container)).toBeNull();
	});
});
