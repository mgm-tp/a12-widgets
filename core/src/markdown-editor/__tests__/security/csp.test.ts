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

import { buildEditorFromExtensions } from "@lexical/extension";
import { describe, expect, test } from "vitest";

import { defineMarkdownEditorExtension } from "../../main/extensions.js";
import { $createHtmlElementNode } from "../../main/nodes/html-element-node.js";
import { resolveFeatures } from "../../main/optional-features.js";

const HTML_TAGS_ON = defineMarkdownEditorExtension(resolveFeatures({ htmlTags: true }));

/** What a build left on the element, and every attribute name it wrote on the way. */
interface Built {
	element: HTMLElement;
	attributeNames: string[];
}

/**
 * The element an `HtmlElementNode` builds, for the screen or for the way out, with every
 * `setAttribute` name it used written down.
 *
 * Watching the call and not the result is the point: the element ends up with a `style`
 * attribute either way, because the CSSOM writes one too. What a policy cares about is which
 * road the declarations took to get there.
 */
function elementFor(attributes: Record<string, string>, forExport: boolean): Built {
	const attributeNames: string[] = [];
	const setAttribute = Element.prototype.setAttribute;

	// Only `<div>`, and by hand instead of with `vi.spyOn`. The editor builds a div here, and
	// leaving `Element.prototype` alone keeps the patch away from the script and link elements
	// the test runner loads its own modules with.
	Object.defineProperty(HTMLDivElement.prototype, "setAttribute", {
		configurable: true,
		value: function (this: Element, name: string, value: string) {
			attributeNames.push(name);
			setAttribute.call(this, name, value);
		},
		writable: true
	});

	try {
		const editor = buildEditorFromExtensions(HTML_TAGS_ON);
		let built: HTMLElement | null = null;

		editor.update(
			() => {
				const node = $createHtmlElementNode("div", attributes);

				built = forExport ? (node.exportDOM(editor).element as HTMLElement) : node.createDOM(editor._config, editor);
			},
			{ discrete: true }
		);

		expect(built).not.toBeNull();

		return { element: built as unknown as HTMLElement, attributeNames };
	} finally {
		Reflect.deleteProperty(HTMLDivElement.prototype, "setAttribute");
	}
}

describe("MarkdownEditor sanitization — the road a style takes onto the element", () => {
	/*
	 * A `style` attribute counts as an inline style under a Content Security Policy. The same
	 * declarations set through `element.style` do not, because a policy has no say over the
	 * CSSOM.
	 *
	 * It matters because our own CSP guide tells consumers to hash their style tag and run on
	 * `style-src 'self' 'sha256-…'`, with no `unsafe-inline`. On such a host, an editor that
	 * wrote the attribute would show every hand-written `<div style="…">` with no styling at
	 * all, fill the console with violation reports, and drop the styling from the file on save.
	 *
	 * What is pinned here is the road the declarations take, because that is the half we own.
	 * The browser's half is not tested: a policy cannot be put on the test page after it has
	 * loaded, and a second document to hold one means an iframe, which the browser-mode runner
	 * already uses for every test file — adding one of ours breaks the whole run. To check that
	 * end, serve a page with the policy in the showcase or by hand.
	 */
	test("the element built for the screen carries its styling without the attribute", () => {
		const { element, attributeNames } = elementFor({ style: "color: red; position: fixed", id: "x" }, false);

		// One declaration at a time, so what is allowed is on the element…
		expect(element.style.color).toBe("red");

		// …and what would take the block out of the page flow never was.
		expect(element.style.position).toBe("");

		// The road it took: never the attribute, which is the one a policy would refuse. Other
		// attributes still go that way, and that is fine — a policy is about inline style, not
		// about attributes.
		expect(attributeNames).not.toContain("style");
		expect(attributeNames).toContain("id");
	});

	test("the element built for export carries the whole style without the attribute", () => {
		const { element, attributeNames } = elementFor({ style: "color: red; position: fixed" }, true);

		// Everything the author wrote, because this element is written back into the file
		// instead of being shown.
		expect(element.style.color).toBe("red");
		expect(element.style.position).toBe("fixed");

		// Through `cssText`, so a host with a strict policy can still save a document with
		// its styling kept.
		expect(attributeNames).not.toContain("style");
	});
});
