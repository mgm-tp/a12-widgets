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

import type { ToMarkdownOptions } from "mdast-util-directive";
import { directiveToMarkdown } from "mdast-util-directive";
import type { Handle, Options as ToMarkdownExtension } from "mdast-util-to-markdown";
import { directive } from "micromark-extension-directive";
import { codes } from "micromark-util-symbol";
import type { Construct, Extension } from "micromark-util-types";

import { directiveContainer } from "./directive-container.js";

/** `:::` and nothing else, at any depth. */
const CONTAINER_FENCE = ":::";

/**
 * The `:::` grammar, where a container fence is always three colons and blocks nest.
 *
 * The same as `directive()` from `micromark-extension-directive`,
 * except for the container block, which comes from {@link directiveContainer}.
 * Leaf (`::name`) and text (`:name[…]`) directives are upstream's, unchanged.
 *
 * There is one spelling and it is three colons:
 *
 * ```md
 * :::warning
 * heads up
 *
 * :::info
 * detail
 * :::
 *
 * footer
 * :::
 * ```
 *
 * Upstream would need `::::` on the outer block here, and it would also accept it.
 * This does neither: four colons or more is a paragraph, not a fence.
 * Documents from tools that widen the outer fence — Docusaurus, MDX — read as text instead of panels.
 *
 * Always use {@link enhancedDirectiveToMarkdown} to write markdown back.
 * Without it the serializer widens the outer fence, and the document it wrote would not read again.
 *
 * ## Why the code was copied
 *
 * Only {@link directiveContainer} needed changing. It calls `factoryName`,
 * `factoryLabel` and `factoryAttributes`, which sit in the package's `lib/` folder
 * and the package's `exports` map does not publish `lib/` — so they cannot be imported
 * and had to be copied too. Patching the installed package does not work either:
 * a patch stays in this repo, so it would never reach anyone who installs `widgets-core`.
 *
 * Each file names the upstream file it came from. When `micromark-extension-directive` is updated,
 * diff the four against the new `dev/lib/` and copy the changes across.
 *
 * ## Lines that only look like fences
 *
 * The count is made by reading each line on its own, so a `:::name` line that is not markdown
 * at all still has to be recognised as such:
 *
 * ```md
 * :::a
 * <div>
 * :::b
 * </div>
 * :::
 * ```
 *
 * Here `:::b` is raw HTML, not a block that opens. Counting it would hand the last line
 * to a block nobody wrote, and `a` would stay open to the end of the document.
 * Code blocks hide colons the same way.
 *
 * Because the closing is last in, first out, one miscounted line is not one wrong block:
 * every `:::` after it goes to the wrong level for the rest of the document.
 * So both kinds of block are read through in {@link directiveContainer}, using CommonMark's
 * own `codeFenced` and `htmlFlow` rather than a copy of them. A paragraph line
 * like `<https://example.test>` is then not mistaken for HTML either.
 *
 * A block has to have an ending of its own before its lines are treated as content and
 * nothing else. A closed code block does, so `:::` inside one stays a code sample.
 * Raw HTML ends at the next blank line and an unclosed fence never ends at all,
 * so there the panel's own fence is what ends them — otherwise a half-typed code block would
 * run away with the rest of the document.
 */
export function enhancedDirective(): Extension {
	const upstream = directive();
	// Upstream puts `[directiveContainer, directiveLeaf]` under `:` in `flow` - in that order,
	// and `directiveText` under `:` in `text`.
	// Replace the container and keep the rest, `text` included — it is spread over untouched.
	// See `micromark-extension-directive/lib/syntax.js`.
	const atColon = upstream.flow?.[codes.colon] as Construct[];

	return { ...upstream, flow: { ...upstream.flow, [codes.colon]: [directiveContainer, ...atColon.slice(1)] } };
}

/**
 * Writes every container directive with three colons, however deep it sits.
 *
 * `mdast-util-directive` adds one colon per level of nesting, so a panel inside a panel
 * is written as `::::`.
 * {@link enhancedDirective} does not read four colons as a fence,
 * so without this the serializer would write documents that cannot be read back.
 *
 * Only the block's own fence is changed here. Its children went through this same function first,
 * so they already have three colons by the time we see the text.
 */
export function enhancedDirectiveToMarkdown(options?: ToMarkdownOptions): ToMarkdownExtension {
	const upstream = directiveToMarkdown(options);
	const upstreamContainer = upstream.handlers?.containerDirective as Handle;

	const handleContainer: Handle = (node, parent, state, info) =>
		upstreamContainer(node, parent, state, info)
			.replace(/^:+/, CONTAINER_FENCE)
			.replace(/\n:+$/, `\n${CONTAINER_FENCE}`);

	return { ...upstream, handlers: { ...upstream.handlers, containerDirective: handleContainer } };
}
