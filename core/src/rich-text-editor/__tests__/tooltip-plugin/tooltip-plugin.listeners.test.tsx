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

import { findByDataRole, render } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { TooltipPluginConfig } from "../../main/plugins/index.js";
import { prepopulatedRichText } from "../../main/utils/common.js";
import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import { tooltipWordsSampleText } from "../data.js";

/**
 * A scroll listener the tooltip plugin currently holds on `document`.
 *
 * `capture` is normalised from both call styles (`true` and `{capture: true}`)
 * because `removeEventListener` only matches a registration when the capture
 * flag is identical — passing it to `add` but not to `remove` silently leaks
 * the listener.
 */
interface ScrollRegistration {
	listener: EventListenerOrEventListenerObject;
	capture: boolean;
}

const toCapture = (options?: boolean | AddEventListenerOptions | EventListenerOptions): boolean =>
	typeof options === "boolean" ? options : Boolean(options?.capture);

/** The plugin's handler is a named arrow function, which scopes this test to it. */
const isTooltipScrollHandler = (listener: EventListenerOrEventListenerObject): boolean =>
	typeof listener === "function" && listener.name === "scrollHandle";

const tooltipPluginConfig: TooltipPluginConfig = {
	triggerMode: "focus",
	customTerms: [
		{
			regex: /\bmgm-tp\b/,
			render: () => undefined
		}
	]
};

describe("com.mgmtp.a12.widgets.rich-text-editor.tooltip-plugin listeners", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("removes its capture-phase scroll listener when unmounted", async () => {
		const live: ScrollRegistration[] = [];

		const originalAdd = document.addEventListener.bind(document);
		const originalRemove = document.removeEventListener.bind(document);

		vi.spyOn(document, "addEventListener").mockImplementation((type, listener, options) => {
			if (type === "scroll" && isTooltipScrollHandler(listener)) {
				live.push({ listener, capture: toCapture(options) });
			}

			originalAdd(type, listener, options);
		});

		vi.spyOn(document, "removeEventListener").mockImplementation((type, listener, options) => {
			if (type === "scroll" && isTooltipScrollHandler(listener)) {
				const index = live.findIndex((entry) => entry.listener === listener && entry.capture === toCapture(options));

				if (index !== -1) {
					live.splice(index, 1);
				}
			}

			originalRemove(type, listener, options);
		});

		const { container, unmount } = render(
			<DefaultRichTextEditor
				initialConfig={{ editorState: prepopulatedRichText(tooltipWordsSampleText), namespace: "TooltipLeak" }}
				tooltipPluginConfig={tooltipPluginConfig}
			/>
		);

		await findByDataRole(container, DataRoles.RichTextEditor.Input);

		// Guards the test itself: if the plugin stops registering the listener,
		// the assertion below would pass for the wrong reason.
		expect(live).toHaveLength(1);
		expect(live[0]?.capture).toBe(true);

		unmount();

		expect(live).toEqual([]);
	});
});
