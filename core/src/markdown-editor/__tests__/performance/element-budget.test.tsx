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
 * How many DOM elements the source surface spends on a document.
 *
 * A count, not a clock, so nothing here can be flaky on a slow machine.
 *
 * The number matters because the source surface re-renders on every keystroke.
 * Wrapping every `#`, every `**` and every word in its own `<span>` roughly doubles the element count,
 * and everything downstream — the diff, layout, paint — pays for it on each key.
 * The shape that keeps the count down is asserted in
 * `component/source-dom-shape.test.tsx`; this pins what it adds up to.
 */

import { getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import { ControlledEditor } from "../utils/index.js";

describe("MarkdownEditor source mode — element budget", () => {
	test("a whole document stays under its element budget", async () => {
		const markdown = [
			"# Project title",
			"Some intro **bold** with *italic*, `inline code`, and a [link](https://example.com/docs).",
			"- First item with **emphasis**",
			"> A blockquote with **bold** text"
		].join("\n\n");

		const { container } = render(<ControlledEditor initialMode="source" initialValue={markdown} />);
		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await waitFor(() => expect(source.textContent).toContain("Project title"));

		// 100 before the fold, 57 after. The budget leaves room for a token type or two
		// without a rewrite, but not for the wrapper-per-leaf shape to come back.
		expect(source.querySelectorAll("span").length).toBeLessThan(70);
	});
});
