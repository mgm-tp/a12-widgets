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

import { getByDataRole, render, setupDevice } from "test-utils";
import { beforeAll, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { waitFor } from "@testing-library/dom";

import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { TabPanel } from "../../tab-panel/main/tab-panel.view.js";
import { TabPanelTemplate } from "../../tab-panel/main/template/tab-panel.tpl.view.js";
import type { TabPanelTemplateProps } from "../../tab-panel/main/template/tab-panel.tpl.api.js";
import { Icon } from "../../icon/main/icon.view.js";
import { Button } from "../../button/main/button.view.js";

import { ModalOverlay } from "../main/modal-overlay.view.js";

describe("com.mgmtp.a12.widgets.modal-overlay", () => {
	test("test render basic modal-overlay", () => {
		const { container } = render(
			<ModalOverlay>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render fullscreen modal-overlay", () => {
		const { container } = render(
			<ModalOverlay fullscreen noGutter>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render fullscreen with gutter modal-overlay", () => {
		const { container } = render(
			<ModalOverlay fullscreen>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render fitToParent modal-overlay", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay fitToParent>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("should focus on container by default", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const modalOverlay = getByDataRole(container, DataRoles.Modal.OverlayContent);

		expect(modalOverlay?.matches(":focus")).toBe(true);
	});

	test("should not focus on container when focusOnOpen is set to false", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay focusOnOpen={false}>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);

		expect(modalOverlay?.matches(":focus")).toBe(false);
	});

	test("should not have unnecessary empty space when heading is invisible", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay focusOnOpen={false}>
					<ActionContentbox componentRenderers={{ heading: <HiddenText>this is hidden test</HiddenText> }}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
		const contentBoxHeader = getByDataRole(modalOverlay, DataRoles.Contentbox.Header);

		expect(contentBoxHeader).not.toHaveStyle({ minHeight: "48px" });
	});

	test("should have minHeight when the heading is visible", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay focusOnOpen={false}>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
		const contentBoxHeader = getByDataRole(modalOverlay, DataRoles.Contentbox.Header);
		const contentBoxHeading = getByDataRole(modalOverlay, DataRoles.Contentbox.Heading);

		expect(contentBoxHeader).not.toHaveStyle({ minHeight: "48px" });
		expect(contentBoxHeading).toHaveStyle({ minHeight: "48px" });
	});

	test("Modal Overlay with `containerAttributes` property", () => {
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<ModalOverlay
				id="test-modal"
				containerAttributes={{
					"aria-label": ariaLabel
				}}
			>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p id="modal-description">This is a modal with custom attributes</p>
				</ActionContentbox>
			</ModalOverlay>
		);

		const modalContainer = getByDataRole(DataRoles.Modal.OverlayContent);
		expect(modalContainer).toBeTruthy();
		expect(modalContainer.getAttribute("aria-label")).toBe(ariaLabel);
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("should not have unnecessary empty space when heading is invisible", () => {
			const { container } = render(
				<div style={{ height: "250px", width: "250px" }}>
					<ModalOverlay focusOnOpen={false}>
						<ActionContentbox componentRenderers={{ heading: <HiddenText>this is hidden test</HiddenText> }}>
							<p>Content</p>
						</ActionContentbox>
					</ModalOverlay>
				</div>
			);

			const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
			const contentBoxHeader = getByDataRole(modalOverlay, DataRoles.Contentbox.Header);

			expect(contentBoxHeader).not.toHaveStyle({ minHeight: "48px" });
		});

		test("should have minHeight when the heading is visible", () => {
			const { container } = render(
				<div style={{ height: "250px", width: "250px" }}>
					<ModalOverlay focusOnOpen={false}>
						<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
							<p>Content</p>
						</ActionContentbox>
					</ModalOverlay>
				</div>
			);

			const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
			const contentBoxHeader = getByDataRole(modalOverlay, DataRoles.Contentbox.Header);
			const contentBoxHeading = getByDataRole(modalOverlay, DataRoles.Contentbox.Heading);

			expect(contentBoxHeader).not.toHaveStyle({ minHeight: "48px" });
			expect(contentBoxHeading).toHaveStyle({ minHeight: "48px" });
		});
	});

	describe("Tab cycle behavior", () => {
		const tabs: TabPanelTemplateProps.TabProps[] = [
			{
				icon: <Icon>web</Icon>,
				value: "Tab 1",
				id: "tab1",
				title: "Nested iframes"
			}
		];

		interface NestedIframeContentProps {
			outerIframeRef: { current: HTMLIFrameElement | null };
			nestedIframeRef: { current: HTMLIFrameElement | null };
			input1Ref: { current: HTMLInputElement | null };
			input2Ref: { current: HTMLInputElement | null };
			title?: string;
		}

		const NestedIframeContent = ({
			outerIframeRef,
			nestedIframeRef,
			input1Ref,
			input2Ref,
			title = "Outer iframe with nested content"
		}: NestedIframeContentProps) => {
			const handleIframeLoad = (iframe: HTMLIFrameElement | null) => {
				if (!iframe || !iframe.contentDocument) {
					return;
				}

				outerIframeRef.current = iframe;

				const doc = iframe.contentDocument;
				const body = doc.body;

				// Create nested iframe inside outer iframe
				const nestedIframe = doc.createElement("iframe");
				nestedIframe.title = "Nested inner iframe";
				nestedIframe.style.cssText = "width: 400px; height: 150px; border: 2px solid blue;";
				body.appendChild(nestedIframe);
				nestedIframeRef.current = nestedIframe;

				// Add 2 inputs to nested iframe
				nestedIframe.onload = (): void => {
					const nestedDoc = nestedIframe.contentDocument;

					if (nestedDoc) {
						const input1 = nestedDoc.createElement("input");
						input1.type = "text";
						input1.id = "First input";
						nestedDoc.body.appendChild(input1);
						input1Ref.current = input1;

						const input2 = nestedDoc.createElement("input");
						input2.type = "text";
						input2.id = "Second input";
						nestedDoc.body.appendChild(input2);
						input2Ref.current = input2;
					}
				};
			};

			return (
				<iframe
					ref={handleIframeLoad}
					title={title}
					style={{ width: "100%", height: "250px", border: "1px solid black" }}
				/>
			);
		};

		test("should focus inputs inside nested iframe when tabbing", async () => {
			const outerIframeRef = { current: null as HTMLIFrameElement | null };
			const nestedIframeRef = { current: null as HTMLIFrameElement | null };
			const input1Ref = { current: null as HTMLInputElement | null };
			const input2Ref = { current: null as HTMLInputElement | null };

			const { container } = render(
				<ModalOverlay focusOnOpen={false}>
					<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={1} />}>
						<div style={{ height: "600px", width: "800px" }}>
							<TabPanel
								value="Tab 1"
								tabs={tabs}
								id="iframe-test-panel"
								header={
									<TabPanelTemplate.PanelHeader
										heading="iframe Tab Cycle Test"
										suffixes={[<Button invert icon={<Icon>close</Icon>} title="Close" />]}
									/>
								}
							>
								<NestedIframeContent
									outerIframeRef={outerIframeRef}
									nestedIframeRef={nestedIframeRef}
									input1Ref={input1Ref}
									input2Ref={input2Ref}
								/>
							</TabPanel>
						</div>
					</ActionContentbox>
				</ModalOverlay>
			);

			const modalOverlay = getByDataRole(container, DataRoles.Modal.OverlayContent);

			const outerIframe = outerIframeRef.current;
			expect(outerIframeRef.current).toBeTruthy();

			const nestedIframe = nestedIframeRef.current;
			expect(nestedIframe).toBeTruthy();

			(nestedIframe as any).onload?.({} as unknown as Event);
			// Wait for inputs to exist inside nested iframe
			const nestedDoc = (nestedIframe as any).contentDocument!;
			const input1 = await waitFor(() => nestedDoc.getElementById("First input"));
			const input2 = await waitFor(() => nestedDoc.getElementById("Second input"));

			expect(input1).toBeInTheDocument();
			expect(input2).toBeInTheDocument();

			// Focus outer iframe first
			(outerIframe as any).focus();
			expect(document.activeElement).toBe(outerIframe);

			// Simulate Tab: move focus to first input inside nested iframe
			await userEvent.tab();
			expect(nestedDoc.activeElement).toBe(input1);

			// Tab again: should focus input2
			await userEvent.tab();
			expect(nestedDoc.activeElement).toBe(input2);

			await userEvent.tab();
			expect(document.activeElement).toBe(modalOverlay);

			// Shift+Tab backward to iframe
			await userEvent.tab({ shift: true });

			// Shift+Tab backward to iframe
			await userEvent.tab({ shift: true });
			expect(nestedDoc.activeElement).toBe(input2);

			// Shift+Tab again to input1
			await userEvent.tab({ shift: true });
			expect(nestedDoc.activeElement).toBe(input1);
		});
	});
});
