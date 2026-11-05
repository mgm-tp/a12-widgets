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

import { describe, test, expect, beforeAll } from "vitest";

import { installTranslationCrashGuard } from "../main/translation-crash-guard.js";

describe("com.mgmtp.a12.widgets.translation-crash-guard", () => {
	beforeAll(installTranslationCrashGuard);

	/**
	 * Reproduces what Google Translate does: it pulls a text node out of its original
	 * parent and re-parents it inside an injected wrapper element.
	 *
	 * React later tries to remove that text node from the original parent during
	 * an unmount or variant switch, which natively throws. The guard must turn that
	 * operation into a safe no-op.
	 */
	test("removeChild does not throw when the node was re-parented by a translator", () => {
		const reactParent = document.createElement("div");
		const textNode = document.createTextNode("Group Button");

		reactParent.appendChild(textNode);

		// Simulate the translator moving the text node into an injected <font> wrapper.
		const translatorWrapper = document.createElement("font");
		translatorWrapper.appendChild(textNode);

		// The text node is no longer a direct child of the parent React expects.
		expect(textNode.parentNode).toBe(translatorWrapper);

		// React still tries to remove it from the original parent.
		// The guard should prevent the native NotFoundError.
		expect(() => reactParent.removeChild(textNode)).not.toThrow();
	});

	/**
	 * An insertBefore call whose reference node no longer belongs to the expected
	 * parent must also become a safe no-op.
	 */
	test("insertBefore does not throw when the reference node was re-parented", () => {
		const reactParent = document.createElement("div");
		const referenceNode = document.createTextNode("reference");

		reactParent.appendChild(referenceNode);

		// Simulate the translator moving the reference node into an injected wrapper.
		const translatorWrapper = document.createElement("font");
		translatorWrapper.appendChild(referenceNode);

		const newNode = document.createElement("span");

		// React tries to insert before a node that is no longer a direct child
		// of the expected parent. The guard should prevent the native error.
		expect(() => reactParent.insertBefore(newNode, referenceNode)).not.toThrow();
	});

	/**
	 * Normal DOM operations must continue working exactly as before.
	 */
	test("native removeChild / insertBefore still work for real children", () => {
		const parent = document.createElement("div");
		const first = document.createElement("span");
		const second = document.createElement("span");

		parent.appendChild(second);

		// Valid insertBefore calls must preserve native DOM behavior.
		parent.insertBefore(first, second);
		expect(parent.firstChild).toBe(first);

		// Valid removeChild calls must also preserve native DOM behavior.
		parent.removeChild(first);
		expect(parent.contains(first)).toBe(false);
		expect(parent.firstChild).toBe(second);
	});
});
