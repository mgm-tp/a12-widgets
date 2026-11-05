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

import { waitFor } from "@testing-library/dom";
import { useRef } from "react";
import { getByDataRole, queryByDataRole, findByDataRole, render } from "test-utils";
import { describe, test, expect } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHint } from "../main/interaction-hint.view.js";

const title = "This is a hint";

/** Mirrors the `showDelay` default of `InteractionHint`. */
const PRODUCTION_SHOW_DELAY = 500;

const InteractionHintExample = (props: { variant?: "hint" | "success" | "warning" | "error"; showDelay?: number }) => {
	const mockReferenceElementRef = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			<button ref={mockReferenceElementRef} data-role="mock-trigger-element">
				Hover or focus me
			</button>
			<InteractionHint
				title={title}
				referenceElementRef={mockReferenceElementRef}
				variant={props.variant}
				showDelay={props.showDelay}
			/>
		</>
	);
};

describe("com.mgmtp.a12.widgets.interaction-hint", () => {
	// Snapshots the arrow's computed position, so it needs the production `showDelay` rather than the instant
	// delay tests inherit: with no delay the hint renders before the IntersectionObserver reports the
	// reference element's rect, which shifts the arrow by 1px.
	test("render interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample showDelay={PRODUCTION_SHOW_DELAY} />);

		await userEvent.click(getByDataRole(container, "mock-trigger-element"));

		const hint = await findByDataRole(container, DataRoles.InteractionHint);

		expect(hint).toHaveTextContent(title);
		expect(hint).toMatchSnapshot();
	});

	test("render info interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample variant="hint" />);

		await userEvent.tab();

		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		expect(hint).toMatchSnapshot();
	});

	test("render success interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample variant="success" />);
		await userEvent.tab();
		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		expect(hint).toMatchSnapshot();
	});

	test("render warning interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample variant="warning" />);
		await userEvent.tab();

		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		expect(hint).toMatchSnapshot();
	});

	test("render error interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample variant="error" />);
		await userEvent.tab();

		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		expect(hint).toMatchSnapshot();
	});

	test("display hint when hovering over hint", async () => {
		const { container } = render(<InteractionHintExample />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		await userEvent.hover(referenceElement);

		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		await userEvent.hover(hint);
	});

	test("waits for showDelay before displaying the hint on hover", async () => {
		const showDelay = 300;
		const { container } = render(<InteractionHintExample showDelay={showDelay} />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		await userEvent.hover(referenceElement);

		// Still within the delay window, so the hint must not be mounted yet.
		expect(queryByDataRole(container, DataRoles.InteractionHint)).not.toBeInTheDocument();

		await waitFor(() => expect(getByDataRole(container, DataRoles.InteractionHint)).toBeInTheDocument(), {
			timeout: showDelay * 4
		});

		// Park the pointer away from the trigger so the next test still receives a fresh mouseover on it.
		await userEvent.unhover(referenceElement);
	});

	test("a shorter showDelay displays the hint sooner than the default would allow", async () => {
		const { container } = render(<InteractionHintExample showDelay={50} />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		const hoveredAt = performance.now();
		await userEvent.hover(referenceElement);

		expect(await findByDataRole(container, DataRoles.InteractionHint)).toBeInTheDocument();
		expect(performance.now() - hoveredAt).toBeLessThan(PRODUCTION_SHOW_DELAY);

		await userEvent.unhover(referenceElement);
	});

	test("display hint when focusing to open hint and hovering over hint", async () => {
		const { container } = render(<InteractionHintExample />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		await userEvent.click(referenceElement);

		const hint = await findByDataRole(container, DataRoles.InteractionHint);
		expect(hint).toBeInTheDocument();
		await userEvent.hover(hint);
	});

	test("hide hint when clicking to the reference element", async () => {
		const { container } = render(<InteractionHintExample />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		await userEvent.click(referenceElement);

		expect(await findByDataRole(container, DataRoles.InteractionHint)).toBeInTheDocument();

		await userEvent.click(referenceElement);

		const hint = queryByDataRole(container, DataRoles.InteractionHint);

		expect(hint).toBeFalsy();
	});

	test("do not show the hint when the focus leaves before the hint is mounted", async () => {
		const { container } = render(<InteractionHintExample />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		// Keep the pointer away from the trigger, so only the dispatched focus events can open the hint.
		await userEvent.unhover(referenceElement);

		// Focus and focus loss can be processed in one batch, i.e. while the hint's portal is not mounted
		// yet. `focusout` then reports no `relatedTarget` and the portal is not around to be compared to,
		// which must not be mistaken for the focus moving into the hint.
		referenceElement.dispatchEvent(new FocusEvent("focus"));
		referenceElement.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));

		await expect(findByDataRole(container, DataRoles.InteractionHint)).rejects.toThrow();
	});

	test("hint portal position is consistent on repeated opens", async () => {
		const { container } = render(<InteractionHintExample />);
		const referenceElement = getByDataRole(container, "mock-trigger-element");

		// First hover to open
		await userEvent.hover(referenceElement);
		await findByDataRole(container, DataRoles.InteractionHint);

		const firstPortal = queryByDataRole(container, DataRoles.AttachedPortal) as HTMLElement;
		const firstPortalStyle = {
			top: firstPortal?.style.top,
			left: firstPortal?.style.left
		};

		// Unhover to close
		await userEvent.unhover(referenceElement);
		await waitFor(() => {
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		// Second hover to open again
		await userEvent.hover(referenceElement);
		await findByDataRole(container, DataRoles.InteractionHint);

		const secondPortal = queryByDataRole(container, DataRoles.AttachedPortal) as HTMLElement;

		expect(secondPortal?.style.top).toBe(firstPortalStyle.top);
		expect(secondPortal?.style.left).toBe(firstPortalStyle.left);
	});
});
