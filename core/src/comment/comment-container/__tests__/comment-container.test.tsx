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

import type { ReactNode } from "react";
import {
	render,
	getByDataRole,
	queryByDataRole,
	fireEvent,
	createReferenceElement,
	removeReferenceElement,
	setupDevice,
	within
} from "test-utils";
import { describe, vi, expect, test, beforeEach, afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/index.js";
import { addPrefix } from "../../../common/main/utils.js";
import type { CommentContainerProps } from "../main/comment-container.api.js";
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

	describe("behavior", () => {
		const INSIDE_LABEL = "inside";
		const smallViewClassName = addPrefix("comment-container--smallView");
		const getCallout = (): HTMLElement => getByDataRole(document.body, DataRoles.Callout);
		const queryCallout = (): HTMLElement | null => queryByDataRole(document.body, DataRoles.Callout);
		const getInsideButton = (): HTMLElement => within(document.body).getByRole("button", { name: INSIDE_LABEL });
		const renderContainer = (props: Partial<CommentContainerProps> = {}, children: ReactNode = "body") =>
			render(
				<CommentContainer referenceElement={referenceElement} header="Comments" {...props}>
					{children}
				</CommentContainer>
			);
		const insideButton = <button type="button">{INSIDE_LABEL}</button>;
		// The Attached Portal registers its window click listener in a timeout after mounting, and the container
		// measures itself in a timeout after mounting as well.
		const waitForTimeouts = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

		afterEach(() => {
			vi.restoreAllMocks();
		});

		describe("rendering and prop updates", () => {
			test("wraps a plain header in a callout header title", () => {
				renderContainer({ header: "Comments" });

				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Comments");
				expect(queryByDataRole(document.body, DataRoles.Callout.Header.Prefix)).toBeNull();
				expect(queryByDataRole(document.body, DataRoles.Callout.Header.Suffix)).toBeNull();
				expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("body");
			});

			test("uses an element header as the title", () => {
				renderContainer({ header: <em>Element header</em> });

				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Element header");
			});

			test("passes a callout header object through with prefix and suffix and renders the footer", () => {
				renderContainer({
					header: { title: "Comments", prefix: <span>prefix</span>, suffix: <span>suffix</span> },
					footer: <span>footer</span>
				});

				expect(getByDataRole(document.body, DataRoles.Callout.Header.Prefix)).toHaveTextContent("prefix");
				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Comments");
				expect(getByDataRole(document.body, DataRoles.Callout.Header.Suffix)).toHaveTextContent("suffix");
				expect(getByDataRole(document.body, DataRoles.Callout.Footer)).toHaveTextContent("footer");
			});

			test("updates header, footer and children after mount", () => {
				const { rerender } = renderContainer({ header: "First" }, <p>first</p>);

				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("First");
				expect(queryByDataRole(document.body, DataRoles.Callout.Footer)).toBeNull();

				rerender(
					<CommentContainer referenceElement={referenceElement} header="Second" footer="Late footer">
						<p>second</p>
					</CommentContainer>
				);

				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Second");
				expect(getByDataRole(document.body, DataRoles.Callout.Footer)).toHaveTextContent("Late footer");
				expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("second");
			});

			test("updates id, className, style and htmlAttributes after mount", () => {
				const { rerender } = renderContainer({
					id: "first-id",
					className: "first-class",
					style: { color: "rgb(255, 0, 0)" },
					htmlAttributes: { "aria-label": "first label" }
				});

				expect(getCallout()).toHaveAttribute("id", "first-id");
				expect(getCallout()).toHaveClass("first-class");
				expect(getCallout()).toHaveStyle({ color: "rgb(255, 0, 0)" });
				expect(getCallout()).toHaveAttribute("aria-label", "first label");

				rerender(
					<CommentContainer
						referenceElement={referenceElement}
						header="Comments"
						id="second-id"
						className="second-class"
						style={{ color: "rgb(0, 0, 255)" }}
						htmlAttributes={{ "aria-label": "second label" }}
					>
						body
					</CommentContainer>
				);

				expect(getCallout()).toHaveAttribute("id", "second-id");
				expect(getCallout()).toHaveClass("second-class");
				expect(getCallout()).not.toHaveClass("first-class");
				expect(getCallout()).toHaveStyle({ color: "rgb(0, 0, 255)" });
				expect(getCallout()).toHaveAttribute("aria-label", "second label");
			});

			test("shows the pointer by default and hides it with isPointerVisible={false}", () => {
				const { rerender } = renderContainer();

				expect(getByDataRole(document.body, DataRoles.Callout.Pointer)).toBeTruthy();

				rerender(
					<CommentContainer referenceElement={referenceElement} header="Comments" isPointerVisible={false}>
						body
					</CommentContainer>
				);

				expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();
			});

			test("keeps the class compatibility surface: defaultProps", () => {
				expect(CommentContainer.defaultProps.closeOnClickReferenceElement).toBe(true);
				expect(CommentContainer.defaultProps.padding).toBe(false);
				expect(CommentContainer.defaultProps.isPointerVisible).toBe(true);
				expect(typeof CommentContainer.defaultProps.closeOnOutsideClick).toBe("boolean");
			});
		});

		describe("small view", () => {
			test("marks a container below the default min height as small view after mount", async () => {
				renderContainer();

				expect(getCallout()).not.toHaveClass(smallViewClassName);
				await vi.waitFor(() => expect(getCallout()).toHaveClass(smallViewClassName));
			});

			test("keeps the small view class across updates while the container stays small", async () => {
				const { rerender } = renderContainer();
				await vi.waitFor(() => expect(getCallout()).toHaveClass(smallViewClassName));

				rerender(
					<CommentContainer referenceElement={referenceElement} header="Comments" className="custom">
						updated body
					</CommentContainer>
				);

				expect(getCallout()).toHaveClass(smallViewClassName);
				expect(getCallout()).toHaveClass("custom");
			});

			test("leaves a container taller than the min height out of the small view", async () => {
				renderContainer({ minHeight: 1 });
				await waitForTimeouts();

				expect(getCallout()).not.toHaveClass(smallViewClassName);
			});

			test("does not apply the small view with resize and drag options", async () => {
				renderContainer({ resizeAndDragOptions: {} });
				await waitForTimeouts();

				expect(getCallout()).not.toHaveClass(smallViewClassName);
				expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();
				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Comments");
			});
		});

		describe("closing", () => {
			test("calls onClose when the reference element is clicked by default", async () => {
				const onClose = vi.fn();
				renderContainer({ onClose });
				await waitForTimeouts();

				await userEvent.click(referenceElement);

				expect(onClose).toHaveBeenCalledTimes(1);
			});

			test("does not close on a reference element click when closeOnClickReferenceElement is false", async () => {
				const onClose = vi.fn();
				renderContainer({ onClose, closeOnClickReferenceElement: false });
				await waitForTimeouts();

				await userEvent.click(referenceElement);

				expect(onClose).not.toHaveBeenCalled();
				expect(getCallout()).toBeTruthy();
			});

			test("does not call onClose on a click inside the container", async () => {
				const onClose = vi.fn();
				renderContainer({ onClose }, insideButton);
				await waitForTimeouts();

				await userEvent.click(getInsideButton());

				expect(onClose).not.toHaveBeenCalled();
				expect(getCallout()).toBeTruthy();
			});

			test("calls onClose when Escape is pressed inside the container", async () => {
				const onClose = vi.fn();
				renderContainer({ onClose }, insideButton);

				getInsideButton().focus();
				await userEvent.keyboard("{Escape}");

				expect(onClose).toHaveBeenCalledTimes(1);
			});

			test("calls the onClose handler that is current when closing", async () => {
				const staleOnClose = vi.fn();
				const currentOnClose = vi.fn();
				const { rerender } = renderContainer({ onClose: staleOnClose }, insideButton);

				rerender(
					<CommentContainer referenceElement={referenceElement} header="Comments" onClose={currentOnClose}>
						{insideButton}
					</CommentContainer>
				);

				getInsideButton().focus();
				await userEvent.keyboard("{Escape}");

				expect(staleOnClose).not.toHaveBeenCalled();
				expect(currentOnClose).toHaveBeenCalledTimes(1);
			});

			test("removes the container from the DOM and stops reacting to clicks after unmount", async () => {
				const onClose = vi.fn();
				const { unmount } = renderContainer({ onClose });
				await waitForTimeouts();

				expect(getCallout()).toBeTruthy();
				unmount();

				expect(queryCallout()).toBeNull();
				expect(queryByDataRole(document.body, DataRoles.AttachedPortal)).toBeNull();

				await userEvent.click(referenceElement);
				expect(onClose).not.toHaveBeenCalled();
			});
		});

		describe("phone", () => {
			beforeEach(() => {
				setupDevice("phone");
			});

			test("renders in a modal overlay without a pointer and closes on Escape", async () => {
				const onClose = vi.fn();
				renderContainer({ onClose }, insideButton);

				expect(getByDataRole(document.body, DataRoles.Modal.OverlayContent)).toBeTruthy();
				expect(queryByDataRole(document.body, DataRoles.AttachedPortal)).toBeNull();
				expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Comments");
				expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();

				getInsideButton().focus();
				await userEvent.keyboard("{Escape}");

				await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
			});
		});
	});
});
