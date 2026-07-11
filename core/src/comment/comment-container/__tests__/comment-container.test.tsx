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

import { render, getByDataRole, fireEvent, createReferenceElement, removeReferenceElement } from "test-utils";
import { describe, vi, expect, test, beforeEach, afterEach } from "vitest";

import { DataRoles } from "../../../common/index.js";

import { CommentContainer } from "../main/comment-container.view.js";

describe("com.mgmtp.a12.widgets.comment.comment-container", () => {
	let referenceElement: HTMLElement;
	beforeEach(() => {
		referenceElement = createReferenceElement();
	});
	afterEach(() => {
		removeReferenceElement(referenceElement);
	});
	test("rendering-comment-container", async () => {
		const body = "body";
		const { container } = render(
			<CommentContainer referenceElement={referenceElement} header={{ title: <p>header</p> }}>
				{body}
			</CommentContainer>
		);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(referenceElement);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toMatchSnapshot();
	});

	test("comment-container-will-close-after-clicking-outside", () => {
		const body = "body";
		const outerNode = document.createElement("div");
		const onCloseSpy = vi.fn();
		render(
			<CommentContainer
				closeOnOutsideClick
				onClose={onCloseSpy}
				referenceElement={referenceElement}
				header={{ title: <p>header</p> }}
			>
				{body}
			</CommentContainer>,
			{
				container: document.body.appendChild(outerNode)
			}
		);

		fireEvent.mouseDown(outerNode);

		expect(onCloseSpy).toHaveBeenCalledTimes(1);
		document.body.removeChild(outerNode);
	});

	test("comment-container-will-NOT-close-after-clicking-outside", () => {
		const body = "body";
		const outerNode = document.createElement("div");
		const onCloseSpy = vi.fn();
		render(
			<CommentContainer
				closeOnOutsideClick={false}
				onClose={onCloseSpy}
				referenceElement={referenceElement}
				header={{ title: <p>header</p> }}
			>
				{body}
			</CommentContainer>,
			{
				container: document.body.appendChild(outerNode)
			}
		);

		fireEvent.mouseDown(outerNode);

		expect(onCloseSpy).toHaveBeenCalledTimes(0);
		document.body.removeChild(outerNode);
	});

	test("Comment Container with `htmlAttributes` property", () => {
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<CommentContainer
				referenceElement={referenceElement}
				header={{ title: <p id="comment-header">Comments</p> }}
				htmlAttributes={{
					"aria-label": ariaLabel
				}}
			>
				Comment content
			</CommentContainer>
		);

		// Comment Container uses Callout to display the content, so the attributes should be applied to the Callout element.
		const calloutElement = getByDataRole(DataRoles.Callout);
		expect(calloutElement).toBeTruthy();
		expect(calloutElement.getAttribute("aria-label")).toBe(ariaLabel);
	});
});
