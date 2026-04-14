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

import { render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { Tree } from "../main/tpl/tree.tpl.view.js";
import type { TreeNodeTemplateModel } from "../main/tpl/tree.tpl.api.js";

const TREE_ROOT: TreeNodeTemplateModel = {
	id: "1",
	label: "Root",
	children: [
		{ id: "2", label: "Node 2" },
		{ id: "3", label: "Node 3" },
		{ id: "4", label: "Node 4" },
		{ id: "5", label: "Node 5" },
		{ id: "6", label: "Node 6" }
	]
};

describe("com.mgmtp.a12.widgets.tree.scroll-to-node", () => {
	test("scrollToNode handler is registered once on mount", () => {
		let scrollHandler: ((nodeId: string | number) => void) | undefined;
		const scrollToNodeFn = vi.fn((handler: (nodeId: string | number) => void) => {
			scrollHandler = handler;
		});

		render(<Tree id="test-scroll" root={TREE_ROOT} scrollToNode={scrollToNodeFn} />);

		expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
		expect(scrollHandler).toBeDefined();
	});

	test("scrollToNode scrolls and focuses node when not visible on screen", () => {
		let scrollHandler: ((nodeId: string | number) => void) | undefined;
		const scrollToNodeFn = vi.fn((handler: (nodeId: string | number) => void) => {
			scrollHandler = handler;
		});

		const scrollIntoViewMock = vi.fn();
		const focusMock = vi.fn();

		render(
			// Set the container height to 100 so that the 6th item overflows the container and not visible on screen.
			<div style={{ height: 100, overflow: "auto" }}>
				<Tree id="test-scroll" root={TREE_ROOT} scrollToNode={scrollToNodeFn} />
			</div>
		);

		const nodeWrapperEl = document.getElementById("tree-node-6");
		const nodeEl = document.getElementById("tree-node-name-6");

		if (nodeEl) {
			nodeEl.scrollIntoView = scrollIntoViewMock;
		}

		if (nodeWrapperEl) {
			nodeWrapperEl.focus = focusMock;
		}

		scrollHandler?.(6);

		expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
		expect(focusMock).toHaveBeenCalledTimes(1);
	});

	test("scrollToNode scrolls and focuses node should not call when visible on screen", () => {
		let scrollHandler: ((nodeId: string | number) => void) | undefined;
		const scrollToNodeFn = vi.fn((handler: (nodeId: string | number) => void) => {
			scrollHandler = handler;
		});

		vi.useFakeTimers();

		const scrollIntoViewMock = vi.fn();
		const focusMock = vi.fn();

		render(
			// Set the container height to 100 so that the 6th item overflows the container and not visible on screen.
			<div style={{ height: 100, overflow: "auto" }}>
				<Tree id="test-scroll" root={TREE_ROOT} scrollToNode={scrollToNodeFn} />
			</div>
		);

		const nodeWrapperEl = document.getElementById("tree-node-2");
		const nodeEl = document.getElementById("tree-node-name-2");

		if (nodeEl) {
			nodeEl.scrollIntoView = scrollIntoViewMock;
		}

		if (nodeWrapperEl) {
			nodeWrapperEl.focus = focusMock;
		}

		scrollHandler?.(2);

		vi.runAllTimers();

		expect(scrollIntoViewMock).not.toHaveBeenCalled();
		expect(focusMock).not.toHaveBeenCalled();
	});
});
