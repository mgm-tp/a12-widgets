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

import { getByDataRole, queryByDataRole, findByDataRole, render } from "test-utils";
import { useRef } from "react";
import { userEvent } from "vitest/browser";
import { describe, test, expect } from "vitest";
import { waitFor } from "@testing-library/dom";

import { DataRoles } from "../../common/main/data-roles.js";

import { InteractionHint } from "../main/interaction-hint.view.js";

const title = "This is a hint";

const InteractionHintExample = (props: { variant?: "hint" | "success" | "warning" | "error" }) => {
	const mockReferenceElementRef = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			<button ref={mockReferenceElementRef} data-role="mock-trigger-element">
				Hover or focus me
			</button>
			<InteractionHint title={title} referenceElementRef={mockReferenceElementRef} variant={props.variant} />
		</>
	);
};

describe("com.mgmtp.a12.widgets.interaction-hint", () => {
	test("render interaction hint with the giving title", async () => {
		const { container } = render(<InteractionHintExample />);

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
