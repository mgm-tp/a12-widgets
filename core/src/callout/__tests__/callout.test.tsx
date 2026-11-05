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

import type { ReactElement } from "react";
import { createRef, useState } from "react";
import {
	createReferenceElement,
	getAllByDataRole,
	getByDataRole,
	queryByDataRole,
	removeReferenceElement,
	render,
	setupDevice,
	within
} from "test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";
import type { CalloutProps } from "../main/callout.api.js";
import { Callout } from "../main/callout.view.js";
import { CalloutTpl } from "../main/template/callout.tpl.view.js";

const baseClass = "callout";

describe("com.mgmtp.a12.widgets.callout.template", () => {
	const headerTitle = "header";
	const headerPrefix = <Button icon={<Icon>chevron_left</Icon>} />;
	const headerSuffix = <Button icon={<Icon>close</Icon>} />;
	const body = "body";
	const footer = "footer";

	const properties = {
		id: "test-id",
		className: "test-class",
		style: {
			color: "red"
		},
		isPointerVisible: true
	};

	test("rendering-callout-template", () => {
		const { container } = render(<CalloutTpl />);
		expect(getAllByDataRole(container, `${baseClass}`)).toBeTruthy();
		expect(getAllByDataRole(container, `${baseClass}-inner`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-body`)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-inner-container", () => {
		const { container } = render(
			<CalloutTpl header={{ title: headerTitle, suffix: headerSuffix, prefix: headerPrefix }} footer={footer}>
				{body}
			</CalloutTpl>
		);

		expect(getAllByDataRole(container, `${baseClass}-header`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-prefix`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-title`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-suffix`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-footer`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-footer`)[0].textContent).toEqual(footer);
		expect(getAllByDataRole(container, `${baseClass}-body`)[0].textContent).toEqual(body);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-properties", () => {
		const { container } = render(<CalloutTpl {...properties} />);
		expect(getAllByDataRole(container, `${baseClass}-pointer`)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-resizeAndDrag", () => {
		const { container } = render(<CalloutTpl resizeAndDrag header={{ title: headerTitle }} />);
		expect(container.querySelectorAll(".handle")).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-define-padding", () => {
		const { container } = render(<CalloutTpl padding={10} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-zero-padding", () => {
		const { container } = render(<CalloutTpl padding={false} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("get-wrapper-ref", () => {
		const wrapperRef = vi.fn();
		render(<CalloutTpl wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("Callout Template with `htmlAttributes` property", () => {
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<CalloutTpl
				id="callout-with-attrs"
				htmlAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const calloutElement = getByDataRole(DataRoles.Callout);
		expect(calloutElement).toBeTruthy();
		expect(calloutElement.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("com.mgmtp.a12.widgets.callout", () => {
	let referenceElement: HTMLElement;
	let outsideElement: HTMLElement;

	const INSIDE_LABEL = "inside";
	const getInsideButton = (): HTMLElement => within(document.body).getByRole("button", { name: INSIDE_LABEL });
	const getCallout = (): HTMLElement => getByDataRole(document.body, DataRoles.Callout);
	const queryCallout = (): HTMLElement | null => queryByDataRole(document.body, DataRoles.Callout);
	const renderCallout = (props: Partial<CalloutProps> = {}) =>
		render(
			<Callout referenceElement={referenceElement} {...props}>
				<button type="button">{INSIDE_LABEL}</button>
			</Callout>
		);
	// The Attached Portal registers its window click listener in a timeout after mounting.
	const waitForPortalListeners = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

	beforeEach(() => {
		referenceElement = createReferenceElement();
		outsideElement = document.createElement("button");
		outsideElement.textContent = "outside";
		// Keep it far away from the callout, which opens below the reference element in the top-left corner.
		outsideElement.style.cssText = "position: fixed; right: 0; bottom: 0;";
		document.body.appendChild(outsideElement);
	});
	afterEach(() => {
		removeReferenceElement(referenceElement);
		document.body.removeChild(outsideElement);
		vi.restoreAllMocks();
	});
	test("rendering-default-callout", async () => {
		const { container } = render(
			<Callout referenceElement={referenceElement} closeOnOutsideClick closeOnEsc orientationList={["bottom", "top"]}>
				<p>body</p>
			</Callout>
		);
		expect(getByDataRole(container, DataRoles.Portal)).toMatchSnapshot();
	});

	test("rendering-callout-with-resizeAndDrag", async () => {
		const { container } = render(
			<Callout
				referenceElement={referenceElement}
				closeOnOutsideClick
				closeOnEsc
				orientationList={["bottom", "top"]}
				resizeAndDragOptions={{
					referenceElement: referenceElement,
					minWidth: 320,
					minHeight: 250
				}}
			/>
		);

		expect(getByDataRole(container, DataRoles.Portal)).toMatchSnapshot();
	});

	test("Callout with `htmlAttributes` property", async () => {
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<Callout
				referenceElement={referenceElement}
				id="callout-test"
				htmlAttributes={{
					"aria-label": ariaLabel
				}}
			>
				<p>Callout content</p>
			</Callout>
		);

		const calloutElement = getByDataRole(DataRoles.Callout);
		expect(calloutElement).toBeTruthy();
		expect(calloutElement.getAttribute("aria-label")).toBe(ariaLabel);
	});

	describe("rendering and prop updates", () => {
		test("renders header, body and footer from the public props", () => {
			render(
				<Callout
					referenceElement={referenceElement}
					header={{ title: "Title", prefix: <span>prefix</span>, suffix: <span>suffix</span> }}
					footer={<span>footer</span>}
				>
					<p>body</p>
				</Callout>
			);

			expect(getByDataRole(document.body, DataRoles.Callout.Header.Prefix)).toHaveTextContent("prefix");
			expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Title");
			expect(getByDataRole(document.body, DataRoles.Callout.Header.Suffix)).toHaveTextContent("suffix");
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("body");
			expect(getByDataRole(document.body, DataRoles.Callout.Footer)).toHaveTextContent("footer");
		});

		test("adds, updates and removes header, footer and children after mount", () => {
			const { rerender } = render(
				<Callout referenceElement={referenceElement}>
					<p>first</p>
				</Callout>
			);

			expect(queryByDataRole(document.body, DataRoles.Callout.Header)).toBeNull();
			expect(queryByDataRole(document.body, DataRoles.Callout.Footer)).toBeNull();
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("first");

			rerender(
				<Callout referenceElement={referenceElement} header={{ title: "Late title" }} footer="Late footer">
					<p>second</p>
				</Callout>
			);

			expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveTextContent("Late title");
			expect(getByDataRole(document.body, DataRoles.Callout.Footer)).toHaveTextContent("Late footer");
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("second");

			rerender(
				<Callout referenceElement={referenceElement}>
					<p>third</p>
				</Callout>
			);

			expect(queryByDataRole(document.body, DataRoles.Callout.Header)).toBeNull();
			expect(queryByDataRole(document.body, DataRoles.Callout.Footer)).toBeNull();
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("third");
		});

		test("updates id, className, style and htmlAttributes after mount", () => {
			const { rerender } = render(
				<Callout
					referenceElement={referenceElement}
					id="first"
					className="one"
					style={{ color: "rgb(255, 0, 0)" }}
					htmlAttributes={{ "aria-label": "First" }}
				/>
			);

			expect(getCallout()).toHaveAttribute("id", "first");
			expect(getCallout()).toHaveClass("one");
			expect(getCallout()).toHaveStyle({ color: "rgb(255, 0, 0)" });
			expect(getCallout()).toHaveAttribute("aria-label", "First");

			rerender(
				<Callout
					referenceElement={referenceElement}
					id="second"
					className="two"
					style={{ color: "rgb(0, 0, 255)" }}
					htmlAttributes={{ "aria-label": "Second" }}
				/>
			);

			expect(getCallout()).toHaveAttribute("id", "second");
			expect(getCallout()).toHaveClass("two");
			expect(getCallout()).not.toHaveClass("one");
			expect(getCallout()).toHaveStyle({ color: "rgb(0, 0, 255)" });
			expect(getCallout()).toHaveAttribute("aria-label", "Second");
		});

		test("applies the body padding and updates it after mount", () => {
			const { rerender } = render(<Callout referenceElement={referenceElement} padding={false} />);
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveStyle({ padding: "0px" });

			rerender(<Callout referenceElement={referenceElement} padding={12} />);
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveStyle({ padding: "12px" });

			rerender(<Callout referenceElement={referenceElement} padding="4px 8px" />);
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveStyle({ padding: "4px 8px" });
		});

		test("toggles the pointer with isPointerVisible after mount", () => {
			const { rerender } = render(<Callout referenceElement={referenceElement} />);
			expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();

			rerender(<Callout referenceElement={referenceElement} isPointerVisible />);
			expect(getByDataRole(document.body, DataRoles.Callout.Pointer)).toBeTruthy();

			rerender(<Callout referenceElement={referenceElement} />);
			expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();
		});

		test("uses an automatic width when bound to a contentbox", () => {
			render(<Callout referenceElement={referenceElement} boundToContentbox />);
			expect(getCallout().style.width).toBe("auto");
		});

		test("lets the consumer style override the automatic width", () => {
			render(<Callout referenceElement={referenceElement} boundToContentbox style={{ width: 250 }} />);
			expect(getCallout().style.width).toBe("250px");
		});
	});

	describe("accessibility", () => {
		test("labels the callout by its header title when an id is given", () => {
			const { rerender } = render(
				<Callout referenceElement={referenceElement} id="labelled" header={{ title: "Heading" }} />
			);

			expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveAttribute(
				"id",
				"labelled-header-title"
			);
			expect(getCallout()).toHaveAttribute("aria-labelledby", "labelled-header-title");

			rerender(<Callout referenceElement={referenceElement} id="labelled" />);
			expect(getCallout()).not.toHaveAttribute("aria-labelledby");
		});

		test("does not reference a header title without an id", () => {
			render(<Callout referenceElement={referenceElement} header={{ title: "Heading" }} />);

			expect(getCallout()).not.toHaveAttribute("aria-labelledby");
			expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).not.toHaveAttribute("id");
		});
	});

	describe("refs", () => {
		test("calls wrapperRef once with the callout element and with null on unmount", () => {
			const wrapperRef = vi.fn();
			const { rerender, unmount } = render(
				<Callout referenceElement={referenceElement} wrapperRef={wrapperRef}>
					<p>first</p>
				</Callout>
			);

			expect(wrapperRef).toHaveBeenCalledTimes(1);
			expect(wrapperRef).toHaveBeenLastCalledWith(getCallout());

			rerender(
				<Callout referenceElement={referenceElement} wrapperRef={wrapperRef}>
					<p>second</p>
				</Callout>
			);
			expect(wrapperRef).toHaveBeenCalledTimes(1);

			unmount();
			expect(wrapperRef).toHaveBeenCalledTimes(2);
			expect(wrapperRef).toHaveBeenLastCalledWith(null);
		});

		test("keeps the class compatibility surface: instance ref and defaultProps", () => {
			const ref = createRef<Callout>();
			render(
				<Callout ref={ref} referenceElement={referenceElement}>
					<p>body</p>
				</Callout>
			);

			expect(ref.current).toBeInstanceOf(Callout);
			expect(Callout.defaultProps.closeOnEsc).toBe(true);
		});

		test("binds the methods of a subclass to the instance", () => {
			class CustomCallout extends Callout {
				getReferenceElement(): CalloutProps["referenceElement"] {
					return this.props.referenceElement;
				}
			}

			const ref = createRef<CustomCallout>();
			render(
				<CustomCallout ref={ref} referenceElement={referenceElement}>
					<p>body</p>
				</CustomCallout>
			);

			const { getReferenceElement } = ref.current!;
			expect(getReferenceElement()).toBe(referenceElement);
		});
	});

	describe("closing", () => {
		test("does not call onClose while the callout stays open", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose });

			await waitForPortalListeners();
			await userEvent.click(getInsideButton());

			expect(onClose).not.toHaveBeenCalled();
			expect(getCallout()).toBeTruthy();
		});

		test("calls onClose when Escape is pressed inside the callout", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose });

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("ignores Escape while closeOnEsc is false and honours it once enabled", async () => {
			const onClose = vi.fn();
			const { rerender } = renderCallout({ onClose, closeOnEsc: false });

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");
			expect(onClose).not.toHaveBeenCalled();

			rerender(
				<Callout referenceElement={referenceElement} onClose={onClose} closeOnEsc>
					<button type="button">{INSIDE_LABEL}</button>
				</Callout>
			);

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("calls the onClose handler that is current when closing", async () => {
			const staleOnClose = vi.fn();
			const currentOnClose = vi.fn();
			const { rerender } = renderCallout({ onClose: staleOnClose });

			rerender(
				<Callout referenceElement={referenceElement} onClose={currentOnClose}>
					<button type="button">{INSIDE_LABEL}</button>
				</Callout>
			);

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");

			expect(staleOnClose).not.toHaveBeenCalled();
			expect(currentOnClose).toHaveBeenCalledTimes(1);
		});

		test("calls onClose on an outside click by default", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose });

			await waitForPortalListeners();
			await userEvent.click(outsideElement);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("does not call onClose on an outside click when closeOnOutsideClick is false", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose, closeOnOutsideClick: false });

			await waitForPortalListeners();
			await userEvent.click(outsideElement);

			expect(onClose).not.toHaveBeenCalled();
			expect(getCallout()).toBeTruthy();
		});

		test("calls onClose when the reference element is clicked by default", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose });

			await waitForPortalListeners();
			await userEvent.click(referenceElement);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("does not call onClose on a reference element click when closeOnClickReferenceElement is false", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose, closeOnClickReferenceElement: false });

			await waitForPortalListeners();
			await userEvent.click(referenceElement);

			expect(onClose).not.toHaveBeenCalled();
			expect(getCallout()).toBeTruthy();
		});

		test("removes the callout from the DOM and stops reacting to clicks after unmount", async () => {
			const onClose = vi.fn();
			const { unmount } = renderCallout({ onClose });
			await waitForPortalListeners();

			expect(getCallout()).toBeTruthy();
			unmount();

			expect(queryCallout()).toBeNull();
			expect(queryByDataRole(document.body, DataRoles.AttachedPortal)).toBeNull();

			await userEvent.click(outsideElement);
			await userEvent.click(referenceElement);
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe("keyboard", () => {
		test("keeps keydown events other than Tab and Escape inside the callout", async () => {
			const onKeyDown = vi.fn();
			render(
				<div onKeyDown={onKeyDown}>
					<Callout referenceElement={referenceElement}>
						<button type="button">{INSIDE_LABEL}</button>
					</Callout>
				</div>
			);

			getInsideButton().focus();
			await userEvent.keyboard("{Enter}");
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("a");
			expect(onKeyDown).not.toHaveBeenCalled();

			getInsideButton().focus();
			await userEvent.keyboard("{Tab}");
			expect(onKeyDown).toHaveBeenCalledTimes(1);

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");
			expect(onKeyDown).toHaveBeenCalledTimes(2);
		});
	});

	describe("focus", () => {
		test("makes an overflowing body focusable", async () => {
			render(
				<Callout referenceElement={referenceElement} style={{ height: 80 }}>
					<div style={{ minHeight: 600 }}>tall content</div>
				</Callout>
			);

			await vi.waitFor(() =>
				expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveAttribute("tabindex", "0")
			);
		});

		test("leaves a fitting body out of the tab order", async () => {
			render(
				<Callout referenceElement={referenceElement}>
					<p>short content</p>
				</Callout>
			);

			await waitForPortalListeners();
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).not.toHaveAttribute("tabindex");
		});

		test("returns focus to the previously focused element when the consumer closes the callout", async () => {
			const Harness = (): ReactElement | null => {
				const [open, setOpen] = useState(true);

				return open ? (
					<Callout referenceElement={referenceElement} onClose={() => setOpen(false)}>
						<button type="button">{INSIDE_LABEL}</button>
					</Callout>
				) : null;
			};

			referenceElement.focus();
			render(<Harness />);

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");

			expect(queryCallout()).toBeNull();
			expect(referenceElement).toHaveFocus();
		});
	});

	describe("resize and drag", () => {
		test("renders inside the resize and drag container with a draggable header title", () => {
			render(
				<Callout
					referenceElement={referenceElement}
					header={{ title: "Drag me" }}
					resizeAndDragOptions={{ referenceElement, minWidth: 320, minHeight: 250 }}
				>
					<p>body</p>
				</Callout>
			);

			expect(getByDataRole(document.body, DataRoles.ResizeAndDragContainer)).toBeTruthy();
			expect(queryByDataRole(document.body, DataRoles.AttachedPortal)).toBeNull();
			expect(getByDataRole(document.body, DataRoles.Callout.Header.Title)).toHaveClass("handle");
			expect(getByDataRole(document.body, DataRoles.Callout.Body)).toHaveTextContent("body");
		});

		test("uses an automatic width when the initial size defines a width", () => {
			render(
				<Callout
					referenceElement={referenceElement}
					resizeAndDragOptions={{ referenceElement, initialSize: { width: 400, height: 300 } }}
				/>
			);

			expect(getCallout().style.width).toBe("auto");
		});

		test("calls onClose when Escape is pressed inside the resizable callout", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose, resizeAndDragOptions: { referenceElement, minWidth: 320, minHeight: 250 } });

			// The container only reacts to Escape after it has finished positioning itself, so retry until it closes.
			await vi.waitFor(async () => {
				if (!onClose.mock.calls.length) {
					getInsideButton().focus();
					await userEvent.keyboard("{Escape}");
				}

				expect(onClose).toHaveBeenCalledTimes(1);
			});
			expect(queryByDataRole(document.body, DataRoles.ResizeAndDragContainer)).toBeNull();
		});
	});

	describe("phone", () => {
		beforeEach(() => {
			setupDevice("phone");
		});

		test("renders in a modal overlay without a pointer and closes on Escape", async () => {
			const onClose = vi.fn();
			renderCallout({ onClose, isPointerVisible: true });

			expect(getByDataRole(document.body, DataRoles.Modal.OverlayContent)).toBeTruthy();
			expect(queryByDataRole(document.body, DataRoles.AttachedPortal)).toBeNull();
			expect(getCallout()).toBeTruthy();
			expect(queryByDataRole(document.body, DataRoles.Callout.Pointer)).toBeNull();

			getInsideButton().focus();
			await userEvent.keyboard("{Escape}");

			await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
		});
	});
});
