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

import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { sanitizeAttributeRecord, sanitizeHtmlTag } from "../../main/utils/html-sanitizer.js";
import { ControlledEditor, lastEmittedMarkdown, pasteHtmlIntoSurface, getSurfaceByMode } from "../utils/index.js";

describe("MarkdownEditor sanitization — raw HTML in the host's value", () => {
	/*
	 * Markdown allows HTML, and this editor renders the tags it knows how to render. The
	 * list lives in `html-sanitizer.ts` and it is short on purpose: a tag that is not on
	 * it is never built, and keeps its text the way markdown itself passes raw HTML
	 * through.
	 *
	 * So there are two properties to pin. What IS built must be built with nothing
	 * dangerous on it, and what is NOT built must still survive — a document that loses
	 * its markup on open is broken just as surely as one that runs it.
	 */
	test("an allowed HTML block becomes a real element and reaches the host unchanged", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue='<div id="note">a note</div>' onChange={onChange} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("a note"));

		// `div` and `id` are both on the allowlist, so this is a real element.
		expect(container.querySelector("div#note")).not.toBeNull();

		// And loading it was not an edit, so nothing was rewritten on the way in.
		expect(onChange).not.toHaveBeenCalled();
	});

	test("a class is kept in the file but never put on the element", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<div class="note" id="keep">x</div>'
				onChange={onChange}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#keep");

		expect(built).not.toBeNull();

		// The host writes `.note { … }` for its own page. A document that says `class="note"`
		// would help itself to those rules, so the class never reaches the element.
		expect(built?.getAttribute("class")).toBeNull();

		// The file is not touched for it, though — see the round-trip tests in
		// `conformance/html.test.tsx`. Loading is no edit either way.
		expect(onChange).not.toHaveBeenCalled();
	});

	test("an element is built without the attributes that could run something", async () => {
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue='<div onclick="alert(1)" id="keep">x</div>' />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		// Asked structurally on purpose: the payload's characters show up in `innerHTML`
		// either way — as a real attribute if live, escaped if text — so searching the
		// markup for "onclick" would prove nothing.
		expect(container.querySelector("[onclick]")).toBeNull();

		// The harmless attribute is still there, so the cleaning is by name, not wholesale.
		expect(container.querySelector("div#keep")).not.toBeNull();
	});

	test("a style keeps what only paints and loses what would fetch", async () => {
		// Two attacks in one attribute. `position`, `inset` and `z-index` turn the block into
		// a sheet over the whole app, which is how a fake login box is made. The `url(…)` is
		// loaded as soon as the document opens, so the author knows who read it.
		const style =
			"background: red; position: fixed; inset: 0; z-index: 99999; " + "background-image: url(https://t.example/p.gif)";
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={`<div id="box" style="${style}">x</div>`} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();

		// What paints inside the box the document already has is kept, because styling the
		// block is why someone writes HTML in markdown at all.
		expect(built?.style.backgroundColor).toBe("red");

		// What would take it out of the page flow is not.
		expect(built?.style.position).toBe("");
		expect(built?.style.zIndex).toBe("");
		expect(built?.style.top).toBe("");

		// And nothing left in the attribute can load a file, so opening the document tells
		// no one.
		expect(built?.style.backgroundImage).toBe("");
		expect(built?.getAttribute("style")).not.toContain("url(");
	});

	test("a negative margin cannot slide the block over what sits above it", async () => {
		// The same overlay without `position`: -400px moves the block up, on top of whatever
		// the host draws above the editor.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<div id="box" style="margin-top: -400px; margin-left: 8px">x</div>'
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built?.style.marginTop).toBe("");

		// Spacing that moves nothing on top of anything is still allowed.
		expect(built?.style.marginLeft).toBe("8px");
	});

	test("an !important in the document does not beat the host's own stylesheet", async () => {
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<div id="box" style="color: red !important">x</div>'
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		// The colour arrives; the priority that would beat the host's own stylesheet does
		// not.
		expect(built?.style.color).toBe("red");
		expect(built?.style.getPropertyPriority("color")).toBe("");
	});

	test("a style cannot take the block off the screen while its words stay in the file", async () => {
		// The quiet half of the same attack. Nothing moves and nothing is fetched — the block
		// is simply not drawn, so someone reviewing the document in the editor never reads
		// words that are still in the markdown and still go to whoever gets the file.
		const style =
			"display: none; visibility: hidden; opacity: 0; overflow: hidden; clip-path: inset(100%); text-indent: -9999px";
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={`<div id="box" style="${style}">x</div>`} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.style.display).toBe("");
		expect(built?.style.visibility).toBe("");
		expect(built?.style.opacity).toBe("");
		expect(built?.style.overflow).toBe("");
		expect(built?.style.clipPath).toBe("");
		expect(built?.style.textIndent).toBe("");
	});

	test("a style cannot paint outside the box the document already has", async () => {
		// Four more ways to the same overlay, none of them needing `position`. `transform`
		// moves the painted box anywhere; `filter` and `backdrop-filter` take a `url(…)` and
		// change what is seen under the element; a tall `float` has the blocks after it drawn
		// underneath; `box-shadow` paints as far outside the box as its offset says.
		const style =
			"transform: translate(-300px, -300px); filter: blur(2px); backdrop-filter: invert(1); " +
			"float: left; box-shadow: 0 -400px 0 0 red; pointer-events: none; mix-blend-mode: difference";
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`<div id="box" style="${style}; color: red; padding-left: 4px; font-weight: bold; text-align: center; border-top-width: 1px">x</div>`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.style.transform).toBe("");
		expect(built?.style.filter).toBe("");
		expect(built?.style.backdropFilter).toBe("");
		expect(built?.style.float).toBe("");
		expect(built?.style.boxShadow).toBe("");
		expect(built?.style.pointerEvents).toBe("");
		expect(built?.style.mixBlendMode).toBe("");

		// And what only paints inside the box still arrives, which is the whole point of
		// keeping `style` at all.
		expect(built?.style.color).toBe("red");
		expect(built?.style.paddingLeft).toBe("4px");
		expect(built?.style.fontWeight).toBe("bold");
		expect(built?.style.textAlign).toBe("center");
		expect(built?.style.borderTopWidth).toBe("1px");
	});

	test("a <style> element is never built, whatever it holds", async () => {
		// A stylesheet has selectors, so a rule can read the page rather than paint one box:
		// `input[value^="a"] { background: url(…) }` leaks what it matched. Keeping the tag
		// out of `ALLOWED_TAGS` is what makes an unfiltered `style` attribute an easy call.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<style>input[value^="a"] { background: red }</style>'
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("input"));

		expect(surface.querySelector("style")).toBeNull();
	});

	test("a tag that is not built keeps its text, and is not an element", async () => {
		const rawHtml = '<iframe src="https://evil.example" onload="alert(1)"></iframe>';
		const { container } = render(<ControlledEditor features={{ htmlTags: true }} initialValue={rawHtml} />);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toBeTruthy());

		// `iframe` is not on the allowlist, so no element exists to load or fire anything.
		expect(container.querySelector("iframe")).toBeNull();
		expect(container.querySelector("[onload]")).toBeNull();

		// Nothing was stripped either. A document that legitimately holds HTML is not
		// quietly emptied by being opened.
		expect(surface.textContent).toContain("onload");
		expect(surface.textContent).toContain("<iframe");
	});

	test("an HTML comment is hidden, and takes nothing with it", async () => {
		// Hidden is what a browser does with a comment, so the editor does the same. What
		// must not happen is a dropped `-->`, which would swallow the rest of the document
		// the next time this markdown is rendered somewhere that interprets HTML.
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={"<!-- hidden -->\n\nvisible"} onChange={onChange} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("visible"));

		expect(surface.textContent).not.toContain("hidden");

		// Invisible, not gone: loading it was no edit, so the comment is still in the value.
		expect(onChange).not.toHaveBeenCalled();
	});

	test("a document cannot write the markers Lexical reads back", async () => {
		// `data-lexical-decorator-boundary` marks the zero-size anchor Lexical parks beside a
		// block decorator. A forged one does not hide the text, but `getFirstChildAnchor` steps
		// over the child that carries it, so Lexical counts the DOM children wrong from there on
		// and later edits land on the wrong one.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<div id="box" data-lexical-decorator-boundary="true" data-note="keep">hidden text</div>'
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("hidden text"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.hasAttribute("data-lexical-decorator-boundary")).toBe(false);

		// A `data-` name nobody reads is still the author's to write.
		expect(built?.getAttribute("data-note")).toBe("keep");
	});

	test("a document cannot write the editor's own markers either", async () => {
		// Each of these is read by something: the info panel walks up to the nearest
		// `[data-panel-type]`, `data-token` paints the block in the colour the editor uses for
		// markup it wrote itself, `data-selected` draws the selection ring, and `data-role` is
		// how a consuming project's test finds an A12 widget.
		const attributes =
			'data-panel-type="warning" data-token="atxHeading" data-selected="true" data-role="MarkdownEditor"';
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={`<div id="box" ${attributes}>x</div>`} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.hasAttribute("data-panel-type")).toBe(false);
		expect(built?.hasAttribute("data-token")).toBe(false);
		expect(built?.hasAttribute("data-selected")).toBe(false);
		expect(built?.hasAttribute("data-role")).toBe(false);
	});

	test("a marker nothing reads today is refused as well, and a plain author name is not", async () => {
		// `data-gutter`, `data-raw-html` and `data-testid` are written by the editor or its
		// libraries and read by nothing right now. They are refused anyway: a name with no
		// reader today gets one later, and a list that covers everything we write is one less
		// thing to keep in step. `data-temporary-table-cell-lexical-key` is `@lexical/table`'s,
		// with the owner's name in the middle rather than at the front — which is why the two
		// library names are matched anywhere in the name.
		const attributes =
			'data-gutter="1" data-raw-html="true" data-testid="submit" data-temporary-table-cell-lexical-key="7"';
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`<div id="box" ${attributes} data-id="a" data-type="note">x</div>`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.hasAttribute("data-gutter")).toBe(false);
		expect(built?.hasAttribute("data-raw-html")).toBe(false);
		expect(built?.hasAttribute("data-testid")).toBe(false);
		expect(built?.hasAttribute("data-temporary-table-cell-lexical-key")).toBe(false);

		// Names nothing here reads stay the author's to write.
		expect(built?.getAttribute("data-id")).toBe("a");
		expect(built?.getAttribute("data-type")).toBe("note");
	});

	test("a document cannot hide a block or call it something it is not", async () => {
		// `hidden` takes the block off the screen while its words stay in the markdown, and
		// `role` plus `aria-label` let a plain box be read out as a button named something else.
		// Next to the `style` this editor does put on the element, that is enough to paint a fake
		// piece of the host’s own screen and have it announced as a control. GitHub drops all
		// three: asking `api.github.com/markdown` to render this same div gives back
		// `<div id="user-content-box" title="t" dir="auto">Sign in</div>`.
		const attributes = 'hidden role="button" aria-label="Sign in" aria-hidden="true" title="t"';
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`<div id="box" class="card" ${attributes}>Sign in</div>`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("Sign in"));

		const built = container.querySelector<HTMLElement>("div#box");

		expect(built).not.toBeNull();
		expect(built?.hasAttribute("hidden")).toBe(false);
		expect(built?.hasAttribute("role")).toBe(false);
		expect(built?.hasAttribute("aria-label")).toBe(false);
		expect(built?.hasAttribute("aria-hidden")).toBe(false);

		// What GitHub keeps, we keep.
		expect(built?.getAttribute("title")).toBe("t");

		// `class` is a separate call and an older one: it survives sanitizing and is written
		// back on save, but never reaches the screen element, so a document cannot help itself
		// to the host’s own stylesheet. See the `class` branch in `html-element-node.ts`.
		expect(built?.hasAttribute("class")).toBe(false);
	});

	test("no `aria-` name reaches a tag that has no accessible name to replace", async () => {
		// `aria-` used to be allowed as a whole prefix. `aria-controls`, `aria-owns` and
		// `aria-labelledby` are the reason that was too much: each points at an `id`, so a
		// document could reach out of its own block and speak for an element of the host’s page.
		const attributes = 'aria-labelledby="host-el" aria-controls="host-el" aria-owns="host-el" aria-live="polite"';
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={`<span id="box" ${attributes}>x</span>`} />
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("x"));

		const built = container.querySelector<HTMLElement>("span#box");

		expect(built).not.toBeNull();
		expect(built?.hasAttribute("aria-labelledby")).toBe(false);
		expect(built?.hasAttribute("aria-controls")).toBe(false);
		expect(built?.hasAttribute("aria-owns")).toBe(false);
		expect(built?.hasAttribute("aria-live")).toBe(false);
	});

	test("`<summary>` keeps its `aria-label`, the one place GitHub keeps one", async () => {
		// A summary already has a name of its own — its text — so writing a better one over it
		// renames something the reader can see either way. That is the line GitHub draws: the
		// same `aria-label` survives on `<summary>` and is dropped on `<span>` and `<div>`.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue='<details><summary id="sum" aria-label="Show the details">more</summary></details>'
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("more"));

		const built = container.querySelector<HTMLElement>("summary#sum");

		expect(built).not.toBeNull();
		expect(built?.getAttribute("aria-label")).toBe("Show the details");
	});

	test("an `aria-` name is judged against the tag the element becomes", () => {
		// `<button>` is not an allowed tag, so a stored state asking for one is built as a
		// `<span>`. The name has to be read against the span it became. Reading it against the
		// `button` it asked for would hand a document the label it wanted on the element it got.
		expect(sanitizeAttributeRecord({ "aria-label": "Sign in" }, sanitizeHtmlTag("button"))).toEqual({});

		// On the one tag that has a name of its own to replace, it stays.
		expect(sanitizeAttributeRecord({ "aria-label": "Show the details" }, "summary")).toEqual({
			"aria-label": "Show the details"
		});
	});
});

describe("MarkdownEditor sanitization — foreign HTML arriving by paste", () => {
	/*
	 * A paste takes the other route: Lexical builds nodes from the pasted DOM, so the
	 * markup is read rather than kept. That filters by construction — only markup a
	 * registered node claims becomes anything, and the rest drops to its text or nothing.
	 *
	 * These cases pin what falls out of that, because "whatever Lexical happens to do" is
	 * not something a host can build on.
	 */
	test("a pasted style block does not restyle the editor", async () => {
		const { container } = render(<ControlledEditor />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, "<style>body { display: none }</style><p>after</p>", "after");

		await waitFor(() => expect(surface.textContent).toContain("after"));

		expect(container.querySelector("style")).toBeNull();
	});

	test("pasted presentational markup loses its styling and keeps its words", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} />);
		const surface = getSurfaceByMode(container, "edit");

		// The shape a word processor or a web page really puts on the clipboard.
		await pasteHtmlIntoSurface(
			surface,
			'<p><span style="color: red; font-size: 40px">loud</span> and quiet</p>',
			"loud and quiet"
		);

		await waitFor(() => expect(surface.textContent).toContain("loud"));

		// The words arrive; the colour and size do not follow, because markdown has
		// nowhere to put them.
		const markdown = await lastEmittedMarkdown(onChange);
		expect(markdown).toContain("loud and quiet");
		expect(markdown).not.toContain("color");
		expect(markdown).not.toContain("40px");
	});

	test("a pasted form control does not become an input", async () => {
		const { container } = render(<ControlledEditor />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, '<p>after</p><input name="password" type="password">', "after");

		await waitFor(() => expect(surface.textContent).toContain("after"));

		// A real input inside the surface would be a credential-shaped hole in the middle
		// of a document field.
		expect(surface.querySelector("input")).toBeNull();
	});
});
