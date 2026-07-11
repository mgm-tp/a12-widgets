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
import { useState } from "react";
import { getByDataRole, render, setupDevice } from "test-utils";
import { beforeAll, describe, expect, test, vi } from "vitest";
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
import { TextField } from "../../input/text-field/main/template/text-field.tpl.view.js";
import { noop } from "../../common/main/utils.js";

import { ModalOverlay } from "../main/modal-overlay.view.js";

const getModalContentByText = (element: HTMLElement): HTMLElement => {
	return element.closest(`[data-role=${DataRoles.Modal.OverlayContent}]`) as HTMLElement;
};

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

		const parent = container.firstChild as HTMLElement;
		const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
		const modalContent = getByDataRole(container, DataRoles.Modal.OverlayContent);

		expect(parent.contains(modalOverlay)).toBe(true);
		expect(parent).toHaveStyle({ position: "relative", overflow: "hidden" });
		expect(modalContent).toBeTruthy();
	});

	test("fitToParent modal renders inside the parent element in the DOM", () => {
		const { container } = render(
			<div data-testid="modal-parent" style={{ height: "250px", width: "250px" }}>
				<ModalOverlay fitToParent>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const parent = container.querySelector("[data-testid='modal-parent']");
		const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);

		expect(parent?.contains(modalOverlay)).toBe(true);
	});

	test("fitToParent: Tab from a background element in the same parent should redirect focus to the modal", async () => {
		const { getByText, container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<button type="button">Background Button</button>
				<button type="button">Next Background Button</button>
				<ModalOverlay fitToParent focusOnOpen={false}>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const backgroundButton = getByText("Background Button") as HTMLButtonElement;
		const nextBackgroundButton = getByText("Next Background Button") as HTMLButtonElement;

		backgroundButton.focus();
		expect(backgroundButton).toHaveFocus();

		await userEvent.tab();

		const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
		expect(nextBackgroundButton).not.toHaveFocus();
		expect(document.activeElement === modalContainer || modalContainer.contains(document.activeElement)).toBe(true);
	});

	test("fitToParent: should focus on modal container when it opens", () => {
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay fitToParent>
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
						<p>Content</p>
					</ActionContentbox>
				</ModalOverlay>
			</div>
		);

		const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);

		expect(modalContainer?.matches(":focus")).toBe(true);
	});

	test("fitToParent: Tab from a background modal element should redirect focus to the top fitToParent modal", async () => {
		const { getByText } = render(
			<ModalOverlay focusOnOpen={false}>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Background modal" />}>
					<div style={{ height: "250px", width: "250px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<ActionContentbox headingElements={<ContentBoxElements.Title text="Nested modal" />}>
								<p>Nested modal content</p>
							</ActionContentbox>
						</ModalOverlay>
					</div>
					<button type="button">Background Button</button>
					<button type="button">Next Background Button</button>
				</ActionContentbox>
			</ModalOverlay>
		);

		const backgroundButton = getByText("Background Button") as HTMLButtonElement;
		const nextBackgroundButton = getByText("Next Background Button") as HTMLButtonElement;
		const nestedModalContent = getByText("Nested modal content").closest(
			`[data-role=${DataRoles.Modal.OverlayContent}]`
		) as HTMLElement;

		backgroundButton.focus();
		expect(backgroundButton).toHaveFocus();

		await userEvent.tab();

		expect(nextBackgroundButton).not.toHaveFocus();
		expect(document.activeElement === nestedModalContent || nestedModalContent.contains(document.activeElement)).toBe(
			true
		);
	});

	test("fitToParent: should jump to a nested regular modal and focus back to its reference element when closed", async () => {
		const NestedModalFromFitToParent = () => {
			const [fitToParentOpen, setFitToParentOpen] = useState(true);
			const [nestedModalOpen, setNestedModalOpen] = useState(false);

			return (
				<>
					<div tabIndex={0}>Reset Focus Target</div>
					<div style={{ height: "250px", width: "250px" }}>
						{fitToParentOpen && (
							<ModalOverlay fitToParent onClose={() => setFitToParentOpen(false)}>
								<div>
									<p>FitToParent modal content</p>
									<button type="button" onClick={() => setNestedModalOpen(true)}>
										Open regular modal
									</button>
								</div>
							</ModalOverlay>
						)}
					</div>
					{nestedModalOpen && (
						<ModalOverlay onClose={() => setNestedModalOpen(false)}>
							<div>
								<p>Nested regular modal content</p>
								<button type="button" onClick={() => setNestedModalOpen(false)}>
									Close nested regular modal
								</button>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		const { getByText } = render(<NestedModalFromFitToParent />);

		const resetFocusTarget = getByText("Reset Focus Target") as HTMLDivElement;
		const openRegularModalButton = getByText("Open regular modal") as HTMLButtonElement;

		await userEvent.click(openRegularModalButton);

		resetFocusTarget.focus();
		expect(resetFocusTarget).toHaveFocus();

		await userEvent.tab();

		const nestedRegularModalContent = getModalContentByText(getByText("Nested regular modal content"));
		expect(nestedRegularModalContent).toHaveFocus();

		await userEvent.tab();
		const closeNestedRegularModalButton = getByText("Close nested regular modal") as HTMLButtonElement;
		expect(closeNestedRegularModalButton).toHaveFocus();

		await userEvent.click(closeNestedRegularModalButton);
		expect(openRegularModalButton).toHaveFocus();
	});

	test("fitToParent: should keep reset-focus tab order on the active top modal and then move to its button", async () => {
		const BackgroundModalWithFitToParent = () => {
			const [fitToParentOpen, setFitToParentOpen] = useState(true);
			const [topModalOpen, setTopModalOpen] = useState(false);

			return (
				<ModalOverlay focusOnOpen={false}>
					<div>
						<button type="button">Background modal button</button>
						<div style={{ height: "250px", width: "250px" }}>
							{fitToParentOpen && (
								<ModalOverlay fitToParent onClose={() => setFitToParentOpen(false)}>
									<div>
										<p>FitToParent modal content</p>
										<button type="button" onClick={() => setTopModalOpen(true)}>
											Open top modal
										</button>
									</div>
								</ModalOverlay>
							)}
						</div>
					</div>
					{topModalOpen && (
						<ModalOverlay onClose={() => setTopModalOpen(false)}>
							<div>
								<p>Top modal content</p>
								<button type="button">Top modal action</button>
							</div>
						</ModalOverlay>
					)}
				</ModalOverlay>
			);
		};

		const { getByText } = render(<BackgroundModalWithFitToParent />);

		const backgroundModalButton = getByText("Background modal button") as HTMLButtonElement;

		backgroundModalButton.focus();
		expect(backgroundModalButton).toHaveFocus();

		await userEvent.tab();

		const fitToParentModalContent = getModalContentByText(getByText("FitToParent modal content"));
		expect(fitToParentModalContent).toHaveFocus();

		const openTopModalButton = getByText("Open top modal") as HTMLButtonElement;
		await userEvent.click(openTopModalButton);

		backgroundModalButton.focus();
		expect(backgroundModalButton).toHaveFocus();

		await userEvent.tab();

		const topModalContent = getModalContentByText(getByText("Top modal content"));
		expect(topModalContent).toHaveFocus();

		await userEvent.tab();
		expect(getByText("Top modal action")).toHaveFocus();
	});

	test("fitToParent: should redirect reset-focus tab order to the top fitToParent modal in the same parent", async () => {
		const StackedFitToParentModals = () => {
			const [topFitToParentOpen, setTopFitToParentOpen] = useState(false);

			return (
				<div style={{ height: "250px", width: "250px" }}>
					<div tabIndex={0}>Reset Focus Target</div>
					<ModalOverlay fitToParent focusOnOpen={false}>
						<div>
							<p>Base fitToParent modal content</p>
							<button type="button" onClick={() => setTopFitToParentOpen(true)}>
								Open top fitToParent modal
							</button>
						</div>
					</ModalOverlay>
					{topFitToParentOpen && (
						<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setTopFitToParentOpen(false)}>
							<div>
								<p>Top fitToParent modal content</p>
								<button type="button" onClick={() => setTopFitToParentOpen(false)}>
									Close top fitToParent modal
								</button>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		const { getByText } = render(<StackedFitToParentModals />);

		const resetFocusTarget = getByText("Reset Focus Target") as HTMLDivElement;
		const openTopFitToParentModalButton = getByText("Open top fitToParent modal") as HTMLButtonElement;

		await userEvent.click(openTopFitToParentModalButton);

		resetFocusTarget.focus();
		expect(resetFocusTarget).toHaveFocus();

		await userEvent.tab();

		const topFitToParentModalContent = getModalContentByText(getByText("Top fitToParent modal content"));
		expect(topFitToParentModalContent).toHaveFocus();

		await userEvent.tab();
		const closeTopFitToParentModalButton = getByText("Close top fitToParent modal") as HTMLButtonElement;
		expect(closeTopFitToParentModalButton).toHaveFocus();

		await userEvent.click(closeTopFitToParentModalButton);

		resetFocusTarget.focus();
		expect(resetFocusTarget).toHaveFocus();

		await userEvent.tab();

		const baseFitToParentModalContent = getModalContentByText(getByText("Base fitToParent modal content"));
		expect(baseFitToParentModalContent).toHaveFocus();
	});

	test("fitToParent: should keep focus trapped inside a fullscreen modal opened from fitToParent", async () => {
		const FullscreenModalFromFitToParent = () => {
			const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);

			return (
				<div style={{ height: "250px", width: "250px" }}>
					<ModalOverlay fitToParent>
						<div>
							<p>FitToParent modal content</p>
							<button type="button" onClick={() => setFullscreenModalOpen(true)}>
								Open fullscreen modal
							</button>
						</div>
					</ModalOverlay>
					{fullscreenModalOpen && (
						<ModalOverlay fullscreen onClose={() => setFullscreenModalOpen(false)}>
							<div>
								<p>Fullscreen modal content</p>
								<button type="button">Fullscreen first action</button>
								<button type="button">Fullscreen second action</button>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		const { getByText } = render(<FullscreenModalFromFitToParent />);

		await userEvent.click(getByText("Open fullscreen modal"));

		const fullscreenModalContent = getModalContentByText(getByText("Fullscreen modal content"));
		const fullscreenFirstAction = getByText("Fullscreen first action") as HTMLButtonElement;
		const fullscreenSecondAction = getByText("Fullscreen second action") as HTMLButtonElement;
		const openFullscreenModalButton = getByText("Open fullscreen modal") as HTMLButtonElement;

		expect(fullscreenModalContent).toHaveFocus();

		await userEvent.tab();
		expect(fullscreenFirstAction).toHaveFocus();

		await userEvent.tab();
		expect(fullscreenSecondAction).toHaveFocus();

		await userEvent.tab();
		expect(fullscreenModalContent).toHaveFocus();
		expect(openFullscreenModalButton).not.toHaveFocus();
	});

	test("fitToParent: should redirect Tab from another modal reference element back to that modal", async () => {
		const OtherModalReferenceElement = () => {
			const [otherModalOpen, setOtherModalOpen] = useState(false);

			return (
				<>
					<button type="button" onClick={() => setOtherModalOpen(true)}>
						Other modal trigger
					</button>
					<div style={{ height: "250px", width: "250px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<div>
								<p>FitToParent modal content</p>
							</div>
						</ModalOverlay>
					</div>
					{otherModalOpen && (
						<ModalOverlay focusOnOpen={false} onClose={() => setOtherModalOpen(false)}>
							<div>
								<p>Other modal content</p>
								<button type="button">Other modal action</button>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		const { getByText } = render(<OtherModalReferenceElement />);

		const otherModalTrigger = getByText("Other modal trigger") as HTMLButtonElement;
		const fitToParentModalContent = getModalContentByText(getByText("FitToParent modal content"));

		await userEvent.click(otherModalTrigger);
		otherModalTrigger.focus();
		expect(otherModalTrigger).toHaveFocus();

		await userEvent.tab();

		const otherModalContent = getModalContentByText(getByText("Other modal content"));
		expect(otherModalContent).toHaveFocus();
		expect(fitToParentModalContent).not.toHaveFocus();
		expect(fitToParentModalContent.contains(document.activeElement)).toBe(false);
	});

	test("fitToParent: Tab from common ancestor should target topmost active modal and not jump to background modals across 3 parents", async () => {
		const ThreeParentsWithNestedFitToParent = () => {
			const [parent1Nested1Open, setParent1Nested1Open] = useState(false);
			const [parent1Nested2Open, setParent1Nested2Open] = useState(false);
			const [parent2Nested1Open, setParent2Nested1Open] = useState(false);
			const [parent2Nested2Open, setParent2Nested2Open] = useState(false);
			const [parent3Nested1Open, setParent3Nested1Open] = useState(false);
			const [parent3Nested2Open, setParent3Nested2Open] = useState(false);

			return (
				<div tabIndex={0} id="ancestor-reset-target">
					{/* Parent container 1 */}
					<div id="parent1-container" tabIndex={0} style={{ height: "200px", width: "200px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<div>
								<p>Parent 1 base</p>
								<button type="button" onClick={() => setParent1Nested1Open(true)}>
									Open P1 nested 1
								</button>
							</div>
						</ModalOverlay>
						{parent1Nested1Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent1Nested1Open(false)}>
								<div>
									<p>Parent 1 nested 1</p>
									<button type="button" onClick={() => setParent1Nested2Open(true)}>
										Open P1 nested 2
									</button>
								</div>
							</ModalOverlay>
						)}
						{parent1Nested2Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent1Nested2Open(false)}>
								<div>
									<p>Parent 1 nested 2</p>
								</div>
							</ModalOverlay>
						)}
					</div>

					{/* Parent container 2 */}
					<div style={{ height: "200px", width: "200px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<div>
								<p>Parent 2 base</p>
								<button type="button" onClick={() => setParent2Nested1Open(true)}>
									Open P2 nested 1
								</button>
							</div>
						</ModalOverlay>
						{parent2Nested1Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent2Nested1Open(false)}>
								<div>
									<p>Parent 2 nested 1</p>
									<button type="button" onClick={() => setParent2Nested2Open(true)}>
										Open P2 nested 2
									</button>
								</div>
							</ModalOverlay>
						)}
						{parent2Nested2Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent2Nested2Open(false)}>
								<div>
									<p>Parent 2 nested 2</p>
								</div>
							</ModalOverlay>
						)}
					</div>

					{/* Parent container 3 */}
					<div style={{ height: "200px", width: "200px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<div>
								<p>Parent 3 base</p>
								<button type="button" onClick={() => setParent3Nested1Open(true)}>
									Open P3 nested 1
								</button>
							</div>
						</ModalOverlay>
						{parent3Nested1Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent3Nested1Open(false)}>
								<div>
									<p>Parent 3 nested 1</p>
									<button type="button" onClick={() => setParent3Nested2Open(true)}>
										Open P3 nested 2
									</button>
								</div>
							</ModalOverlay>
						)}
						{parent3Nested2Open && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setParent3Nested2Open(false)}>
								<div>
									<p>Parent 3 nested 2</p>
								</div>
							</ModalOverlay>
						)}
					</div>
				</div>
			);
		};

		const { getByText } = render(<ThreeParentsWithNestedFitToParent />);

		// Open both nested fitToParent modals in each of the 3 parent containers
		await userEvent.click(getByText("Open P1 nested 1"));
		await userEvent.click(getByText("Open P1 nested 2"));
		await userEvent.click(getByText("Open P2 nested 1"));
		await userEvent.click(getByText("Open P2 nested 2"));
		await userEvent.click(getByText("Open P3 nested 1"));
		await userEvent.click(getByText("Open P3 nested 2"));

		// Reset focus to the common ancestor that wraps all 3 parent containers
		const ancestorReset = document.getElementById("ancestor-reset-target") as HTMLDivElement;
		ancestorReset.focus();
		expect(ancestorReset).toHaveFocus();

		// Tab should redirect to the topmost active fitToParent modal (Parent 3 nested 2 — opened last)
		// and NOT jump to any background modal in other parents
		await userEvent.tab();

		const p3nested2Content = getModalContentByText(getByText("Parent 3 nested 2"));
		expect(p3nested2Content).toHaveFocus();

		// Verify focus did not land on modals in parent 1 or parent 2
		const p1nested2Content = getModalContentByText(getByText("Parent 1 nested 2"));
		const p2nested2Content = getModalContentByText(getByText("Parent 2 nested 2"));
		expect(p1nested2Content).not.toHaveFocus();
		expect(p2nested2Content).not.toHaveFocus();

		// Second reset: focus on Parent 1's container div (which has its own nested fitToParent open)
		// Tab should redirect to P1's own topmost modal (P1 nested 2) — per-container independence.
		// Even though P3 nested 2 is globally active, parent1-container is exclusively in P1's hierarchy.
		const p1ParentContainer = document.getElementById("parent1-container") as HTMLDivElement;
		p1ParentContainer.focus();
		expect(p1ParentContainer).toHaveFocus();

		await userEvent.tab();

		expect(p1nested2Content).toHaveFocus();
		expect(p3nested2Content).not.toHaveFocus();
	});

	test("fitToParent: each container independently traps Tab to its own modal regardless of other open modals", async () => {
		const ThreeIndependentContainers = () => {
			const [firstContainerOpen, setFirstContainerOpen] = useState(false);
			const [secondContainerOpen, setSecondContainerOpen] = useState(false);
			const [thirdContainerOpen, setThirdContainerOpen] = useState(false);

			return (
				<div>
					<div id="first-container" tabIndex={0} style={{ height: "200px", width: "200px" }}>
						<button type="button" onClick={() => setFirstContainerOpen(true)}>
							Open first container modal
						</button>
						{firstContainerOpen && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setFirstContainerOpen(false)}>
								<div>
									<p>First container modal content</p>
									<button type="button">First container action</button>
								</div>
							</ModalOverlay>
						)}
					</div>
					<div id="second-container" tabIndex={0} style={{ height: "200px", width: "200px" }}>
						<button type="button" onClick={() => setSecondContainerOpen(true)}>
							Open second container modal
						</button>
						{secondContainerOpen && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setSecondContainerOpen(false)}>
								<div>
									<p>Second container modal content</p>
									<button type="button">Second container action</button>
								</div>
							</ModalOverlay>
						)}
					</div>
					<div id="third-container" tabIndex={0} style={{ height: "200px", width: "200px" }}>
						<button type="button" onClick={() => setThirdContainerOpen(true)}>
							Open third container modal
						</button>
						{thirdContainerOpen && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setThirdContainerOpen(false)}>
								<div>
									<p>Third container modal content</p>
									<button type="button">Third container action</button>
								</div>
							</ModalOverlay>
						)}
					</div>
				</div>
			);
		};

		const { getByText } = render(<ThreeIndependentContainers />);
		const firstContainer = document.getElementById("first-container") as HTMLDivElement;
		const secondContainer = document.getElementById("second-container") as HTMLDivElement;
		const thirdContainer = document.getElementById("third-container") as HTMLDivElement;

		// Step 1: Open first container modal, reset focus to first-container → Tab → first container modal
		await userEvent.click(getByText("Open first container modal"));
		const firstContainerModalContent = getModalContentByText(getByText("First container modal content"));

		firstContainer.focus();
		expect(firstContainer).toHaveFocus();
		await userEvent.tab();
		expect(firstContainerModalContent).toHaveFocus();

		// Step 2: Keep first container open, open second container modal, reset focus to second-container → Tab → second container modal
		await userEvent.click(getByText("Open second container modal"));
		const secondContainerModalContent = getModalContentByText(getByText("Second container modal content"));

		secondContainer.focus();
		expect(secondContainer).toHaveFocus();
		await userEvent.tab();
		expect(secondContainerModalContent).toHaveFocus();

		// Step 3: Reset focus to first-container — second container modal is open but in a different container
		// Tab must redirect to the first container's own modal (per-container independence), NOT to background elements
		firstContainer.focus();
		expect(firstContainer).toHaveFocus();
		await userEvent.tab();
		expect(firstContainerModalContent).toHaveFocus();
		expect(secondContainerModalContent).not.toHaveFocus();
		expect(getByText("Open first container modal")).not.toHaveFocus();

		// Step 4: Open third container modal (first and second still open), reset focus to third-container → Tab → third container modal
		await userEvent.click(getByText("Open third container modal"));
		const thirdContainerModalContent = getModalContentByText(getByText("Third container modal content"));

		thirdContainer.focus();
		expect(thirdContainer).toHaveFocus();
		await userEvent.tab();
		expect(thirdContainerModalContent).toHaveFocus();
		expect(firstContainerModalContent).not.toHaveFocus();
		expect(secondContainerModalContent).not.toHaveFocus();

		// Step 5: Reset focus to second-container — third container modal is open but in a different container
		// Tab must redirect to the second container's own modal (per-container independence), NOT to background elements
		secondContainer.focus();
		expect(secondContainer).toHaveFocus();
		await userEvent.tab();
		expect(secondContainerModalContent).toHaveFocus();
		expect(thirdContainerModalContent).not.toHaveFocus();
		expect(getByText("Open second container modal")).not.toHaveFocus();

		// Step 6: Reset focus to first-container — second and third container modals are open in different containers
		// Tab must redirect to the first container's own modal (per-container independence), NOT jump to any other
		firstContainer.focus();
		expect(firstContainer).toHaveFocus();
		await userEvent.tab();
		expect(firstContainerModalContent).toHaveFocus();
		expect(secondContainerModalContent).not.toHaveFocus();
		expect(thirdContainerModalContent).not.toHaveFocus();
		expect(getByText("Open first container modal")).not.toHaveFocus();
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

	test("should call onClose when Escape key is pressed in a regular modal", async () => {
		const onClose = vi.fn();
		const { container } = render(
			<ModalOverlay onClose={onClose}>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);

		const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
		modalContainer.focus();
		await userEvent.keyboard("{Escape}");

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("should NOT call onClose when Escape key is pressed and closeOnEsc is false", async () => {
		const onClose = vi.fn();
		const { container } = render(
			<ModalOverlay onClose={onClose} closeOnEsc={false}>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);

		const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
		modalContainer.focus();
		await userEvent.keyboard("{Escape}");

		expect(onClose).not.toHaveBeenCalled();
	});

	test("fitToParent: should call onClose when Escape key is pressed inside the modal", async () => {
		const onClose = vi.fn();
		const { container } = render(
			<div style={{ height: "250px", width: "250px" }}>
				<ModalOverlay fitToParent onClose={onClose}>
					<div>
						<p>FitToParent modal content</p>
						<button type="button">Action</button>
					</div>
				</ModalOverlay>
			</div>
		);

		const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
		modalContainer.focus();
		await userEvent.keyboard("{Escape}");

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("should call onClose when clicking outside the modal (closeOnOutsideClick)", async () => {
		const onClose = vi.fn();
		const { container } = render(
			<ModalOverlay onClose={onClose} closeOnOutsideClick>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Content</p>
				</ActionContentbox>
			</ModalOverlay>
		);

		const backdrop = getByDataRole(container, DataRoles.Modal.Overlay);
		// Click the top-left corner of the backdrop — the centred dialog does not cover that area
		await userEvent.click(backdrop, { position: { x: 5, y: 5 } });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("should NOT call onClose when clicking inside modal content", async () => {
		const onClose = vi.fn();
		const { getByText } = render(
			<ModalOverlay onClose={onClose} closeOnOutsideClick>
				<ActionContentbox headingElements={<ContentBoxElements.Title text="Test modal" />}>
					<p>Inner content</p>
				</ActionContentbox>
			</ModalOverlay>
		);

		await userEvent.click(getByText("Inner content"));

		expect(onClose).not.toHaveBeenCalled();
	});

	test("regular modal: Tab from outside redirects focus to the modal content", async () => {
		const { getByText, container } = render(
			<>
				<button type="button">Outside button</button>
				<ModalOverlay focusOnOpen={false}>
					<div>
						<p>Modal content</p>
						<button type="button">Modal button</button>
					</div>
				</ModalOverlay>
			</>
		);

		const outsideButton = getByText("Outside button") as HTMLButtonElement;
		outsideButton.focus();
		expect(outsideButton).toHaveFocus();

		await userEvent.tab();

		const modalContent = getByDataRole(container, DataRoles.Modal.OverlayContent);
		expect(document.activeElement === modalContent || modalContent.contains(document.activeElement)).toBe(true);
	});

	test("regular modal: Tab cycles back to modal container after last focusable element", async () => {
		const { getByText, container } = render(
			<ModalOverlay>
				<div>
					<p>Modal content</p>
					<button type="button">First button</button>
					<button type="button">Last button</button>
				</div>
			</ModalOverlay>
		);

		const modalContent = getByDataRole(container, DataRoles.Modal.OverlayContent);
		const firstButton = getByText("First button") as HTMLButtonElement;
		const lastButton = getByText("Last button") as HTMLButtonElement;

		expect(modalContent).toHaveFocus();

		await userEvent.tab();
		expect(firstButton).toHaveFocus();

		await userEvent.tab();
		expect(lastButton).toHaveFocus();

		await userEvent.tab();
		expect(modalContent).toHaveFocus();
	});

	test("fitToParent: interacting with a second fitToParent modal while first is open — Tab stays in top modal", async () => {
		const TwoFitToParentModals = () => {
			const [secondOpen, setSecondOpen] = useState(false);

			return (
				<div style={{ height: "400px", width: "400px" }}>
					<ModalOverlay fitToParent focusOnOpen={false}>
						<div>
							<p>First fitToParent content</p>
							<button type="button" onClick={() => setSecondOpen(true)}>
								Open second fitToParent
							</button>
						</div>
					</ModalOverlay>
					{secondOpen && (
						<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setSecondOpen(false)}>
							<div>
								<p>Second fitToParent content</p>
								<button type="button">Second modal button</button>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		const { getByText } = render(<TwoFitToParentModals />);

		await userEvent.click(getByText("Open second fitToParent"));

		const secondModalContent = getModalContentByText(getByText("Second fitToParent content"));
		const secondModalButton = getByText("Second modal button") as HTMLButtonElement;

		secondModalContent.focus();
		await userEvent.tab();
		expect(secondModalButton).toHaveFocus();

		await userEvent.tab();
		// Should wrap back to second modal container, not escape to first modal
		expect(secondModalContent).toHaveFocus();
	});

	test("fitToParent: closing top fitToParent restores focus to the trigger button in the lower modal", async () => {
		const FitToParentStack = () => {
			const [topOpen, setTopOpen] = useState(false);

			return (
				<div style={{ height: "400px", width: "400px" }}>
					<ModalOverlay fitToParent>
						<div>
							<p>Base fitToParent content</p>
							<button type="button" onClick={() => setTopOpen(true)}>
								Open top fitToParent
							</button>
						</div>
					</ModalOverlay>
					{topOpen && (
						<ModalOverlay fitToParent onClose={() => setTopOpen(false)}>
							<div>
								<p>Top fitToParent content</p>
								<button type="button" onClick={() => setTopOpen(false)}>
									Close top
								</button>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		const { getByText } = render(<FitToParentStack />);

		const openTopButton = getByText("Open top fitToParent") as HTMLButtonElement;
		await userEvent.click(openTopButton);

		await userEvent.click(getByText("Close top"));

		await waitFor(() => {
			expect(openTopButton).toHaveFocus();
		});
	});
	test("fitToParent: saving in nested fitToParent closes both modals and restores focus to original trigger", async () => {
		const DoubleCloseOnSave = () => {
			const [baseOpen, setBaseOpen] = useState(false);
			const [topOpen, setTopOpen] = useState(false);

			const handleSave = (): void => {
				setTopOpen(false);
				setBaseOpen(false);
			};

			return (
				<div style={{ height: "400px", width: "400px" }}>
					<button type="button" onClick={() => setBaseOpen(true)}>
						Open base
					</button>
					{baseOpen && (
						<ModalOverlay fitToParent onClose={() => setBaseOpen(false)}>
							<div>
								<p>Base fitToParent content</p>
								<button type="button" onClick={() => setTopOpen(true)}>
									Open nested
								</button>
							</div>
						</ModalOverlay>
					)}
					{topOpen && (
						<ModalOverlay fitToParent onClose={() => setTopOpen(false)}>
							<div>
								<p>Nested fitToParent content</p>
								<button type="button" onClick={handleSave}>
									Save
								</button>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		const { getByText } = render(<DoubleCloseOnSave />);

		const openBaseButton = getByText("Open base") as HTMLButtonElement;

		// Open base fitToParent
		await userEvent.click(openBaseButton);
		expect(getByText("Base fitToParent content")).toBeTruthy();

		// Open nested fitToParent from within base
		await userEvent.click(getByText("Open nested"));
		expect(getByText("Nested fitToParent content")).toBeTruthy();

		// Clicking Save closes both modals simultaneously
		await userEvent.click(getByText("Save"));

		await waitFor(() => {
			expect(openBaseButton).toHaveFocus();
		});
	});
	test("fitToParent: regular modal on top hides fitToParent modal with aria-hidden", async () => {
		const FitToParentWithRegularOnTop = () => {
			const [regularOpen, setRegularOpen] = useState(false);

			return (
				<>
					<div style={{ height: "250px", width: "250px" }}>
						<ModalOverlay fitToParent focusOnOpen={false}>
							<div>
								<p>FitToParent modal content</p>
								<button type="button" onClick={() => setRegularOpen(true)}>
									Open regular modal
								</button>
							</div>
						</ModalOverlay>
					</div>
					{regularOpen && (
						<ModalOverlay onClose={() => setRegularOpen(false)}>
							<div>
								<p>Regular modal on top</p>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		const { getByText } = render(<FitToParentWithRegularOnTop />);

		await userEvent.click(getByText("Open regular modal"));

		await waitFor(() => {
			const fitToParentOverlay = getModalContentByText(getByText("FitToParent modal content")).closest(
				`[data-role=${DataRoles.Modal.Overlay}]`
			) as HTMLElement;
			expect(fitToParentOverlay.getAttribute("aria-hidden")).toBe("true");
		});
	});

	test("fitToParent: Tab from element outside parent and outside any modal does not redirect to fitToParent modal", async () => {
		const { getByText } = render(
			<>
				<button type="button">Totally outside button</button>
				<div style={{ height: "250px", width: "250px" }}>
					<ModalOverlay fitToParent focusOnOpen={false}>
						<div>
							<p>FitToParent modal content</p>
						</div>
					</ModalOverlay>
				</div>
			</>
		);

		const outsideButton = getByText("Totally outside button") as HTMLButtonElement;
		const fitToParentModalContent = getModalContentByText(getByText("FitToParent modal content"));

		outsideButton.focus();
		expect(outsideButton).toHaveFocus();

		await userEvent.tab();

		// Focus should NOT go to fitToParent modal — it lives outside the parent element
		expect(fitToParentModalContent).not.toHaveFocus();
		expect(fitToParentModalContent.contains(document.activeElement)).toBe(false);
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
			expect(outerIframe).toHaveFocus();

			// Simulate Tab: move focus to first input inside nested iframe
			await userEvent.tab();
			expect(nestedDoc.activeElement).toBe(input1);

			// Tab again: should focus input2
			await userEvent.tab();
			expect(nestedDoc.activeElement).toBe(input2);

			await userEvent.tab();
			expect(modalOverlay).toHaveFocus();

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

	test("fitToParent: should focus on modal container when opening in a container that appears earlier in the DOM than another container that already has its second fitToParent modal open", async () => {
		const TwoContainersSecondContainerHasTwoModals = () => {
			const [containerAOpen, setContainerAOpen] = useState(false);
			const [containerBMainOpen, setContainerBMainOpen] = useState(false);
			const [containerBConfirmOpen, setContainerBConfirmOpen] = useState(false);

			return (
				<div>
					<div id="container-a" style={{ height: "200px", width: "200px" }}>
						<button type="button" onClick={() => setContainerAOpen(true)}>
							Open container A modal
						</button>
						{containerAOpen && (
							<ModalOverlay fitToParent onClose={() => setContainerAOpen(false)}>
								<div>
									<p>Container A modal content</p>
								</div>
							</ModalOverlay>
						)}
					</div>
					<div id="container-b" style={{ height: "200px", width: "200px" }}>
						<button type="button" onClick={() => setContainerBMainOpen(true)}>
							Open container B main modal
						</button>
						{containerBMainOpen && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setContainerBMainOpen(false)}>
								<div>
									<p>Container B main content</p>
									<button type="button" onClick={() => setContainerBConfirmOpen(true)}>
										Open container B confirmation
									</button>
								</div>
							</ModalOverlay>
						)}
						{containerBConfirmOpen && (
							<ModalOverlay fitToParent focusOnOpen={false} onClose={() => setContainerBConfirmOpen(false)}>
								<div>
									<p>Container B confirmation content</p>
								</div>
							</ModalOverlay>
						)}
					</div>
				</div>
			);
		};

		const { getByText } = render(<TwoContainersSecondContainerHasTwoModals />);

		await userEvent.click(getByText("Open container B main modal"));
		await userEvent.click(getByText("Open container B confirmation"));
		await userEvent.click(getByText("Open container A modal"));

		const containerAModalContent = getModalContentByText(getByText("Container A modal content"));
		expect(containerAModalContent).toHaveFocus();
	});

	describe("Text selection within focused inputs", () => {
		const instrumentScrollWalkSentinel = (target: HTMLElement): ReturnType<typeof vi.fn> => {
			const walkEntered = vi.fn();
			Object.defineProperty(target, "scrollWidth", {
				configurable: true,
				get: () => {
					walkEntered();

					return 0;
				}
			});

			return walkEntered;
		};

		const dispatchTouchMove = (
			modalOverlay: HTMLElement,
			target: HTMLElement
		): { preventDefault: ReturnType<typeof vi.fn>; walkEntered: ReturnType<typeof vi.fn> } => {
			expect(typeof modalOverlay.ontouchmove).toBe("function");

			const walkEntered = instrumentScrollWalkSentinel(target);
			const preventDefault = vi.fn();
			const touch = { touchType: "direct" };
			const event = {
				target,
				touches: [touch],
				targetTouches: [touch],
				preventDefault
			} as unknown as TouchEvent;
			modalOverlay.ontouchmove?.(event);

			return { preventDefault, walkEntered };
		};

		const renderModalWithChild = (child: ReactElement): ReturnType<typeof render> =>
			render(
				<div style={{ height: "250px", width: "250px" }}>
					<ModalOverlay fitToParent>{child}</ModalOverlay>
				</div>
			);

		describe("non-iOS", () => {
			beforeAll(() => {
				setupDevice("phone", true);
			});

			test("should NOT bypass scroll-prevention when input has an active text selection", () => {
				const { container } = renderModalWithChild(<TextField value="some text" onChange={noop} />);

				const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
				const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

				input.focus();
				input.setSelectionRange(0, 4);

				const { walkEntered } = dispatchTouchMove(modalOverlay, input);

				expect(walkEntered).toHaveBeenCalled();
			});
		});

		describe("iOS", () => {
			beforeAll(() => {
				Object.defineProperty(navigator, "userAgent", {
					configurable: true,
					get: () =>
						"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
				});
			});

			test("should bypass scroll-prevention when input has an active text selection", () => {
				const { container } = renderModalWithChild(<TextField value="some text" onChange={noop} />);

				const modalOverlay = getByDataRole(container, DataRoles.Modal.Overlay);
				const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

				input.focus();
				input.setSelectionRange(0, 4);

				const { preventDefault, walkEntered } = dispatchTouchMove(modalOverlay, input);

				expect(walkEntered).not.toHaveBeenCalled();
				expect(preventDefault).not.toHaveBeenCalled();
			});
		});
	});
});

interface ModalOverlayExampleProps {
	closeOnOutsideClick?: boolean;
	onCloseESC?: boolean;
	focusBack?: boolean;
}

const ModalOverlayExample = ({
	closeOnOutsideClick,
	onCloseESC,
	focusBack
}: ModalOverlayExampleProps): ReactElement => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const showModal = (): void => setOpen(true);
	const closeModal = (): void => setOpen(false);

	return (
		<div className="-u-width-full -u-flex -u-justify-center">
			<Button label="Show Modal" primary onClick={showModal} />
			{isOpen && (
				<ModalOverlay
					focusBack={focusBack}
					closeOnOutsideClick={closeOnOutsideClick}
					closeOnEsc={onCloseESC}
					onClose={closeModal}
				>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={1} text="Simple Modal" />}
						headingButtons={<ContentBoxElements.CloseButton onClick={closeModal} />}
					>
						<p>This is a modal</p>
					</ActionContentbox>
				</ModalOverlay>
			)}
		</div>
	);
};

describe("Modal Overlay behavior tests", () => {
	test("should show modal when trigger button is clicked", async () => {
		render(<ModalOverlayExample />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]');
		expect(modalOverlay).toBeVisible();
	});

	test("should close modal when close button is clicked and focus back to the trigger element", async () => {
		render(<ModalOverlayExample />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]');
		expect(modalOverlay).toBeVisible();

		const closeButton = modalOverlay!.querySelector('[data-role="button"]') as HTMLElement;
		await userEvent.click(closeButton);

		await waitFor(() => {
			expect(document.body.querySelector('[data-role="modal-overlay"]')).not.toBeInTheDocument();
		});
		expect(showModalButton).toHaveFocus();
	});

	test("should close modal when clicking outside", async () => {
		render(<ModalOverlayExample closeOnOutsideClick={true} />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]') as HTMLElement;
		expect(modalOverlay).toBeVisible();

		// Dispatch mousedown + click directly on the overlay backdrop element so that
		// event.target equals the outer wrapper (simulates clicking the backdrop area
		// outside the inner modal content).
		modalOverlay.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		modalOverlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));

		await waitFor(() => {
			expect(document.body.querySelector('[data-role="modal-overlay"]')).not.toBeInTheDocument();
		});
		expect(showModalButton).toHaveFocus();
	});

	test("should not close modal when clicking outside", async () => {
		render(<ModalOverlayExample closeOnOutsideClick={false} />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]') as HTMLElement;
		expect(modalOverlay).toBeVisible();

		// Dispatch click directly on the overlay backdrop — should NOT close because closeOnOutsideClick is false
		modalOverlay.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		modalOverlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));

		expect(document.body.querySelector('[data-role="modal-overlay"]')).toBeVisible();
	});

	test("should close modal when pressing ESC", async () => {
		render(<ModalOverlayExample onCloseESC={true} />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]');
		expect(modalOverlay).toBeVisible();

		await userEvent.keyboard("{Escape}");

		await waitFor(() => {
			expect(document.body.querySelector('[data-role="modal-overlay"]')).not.toBeInTheDocument();
		});
		expect(showModalButton).toHaveFocus();
	});

	test("should not close modal when pressing ESC", async () => {
		render(<ModalOverlayExample onCloseESC={false} />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]');
		expect(modalOverlay).toBeVisible();

		await userEvent.keyboard("{Escape}");

		expect(document.body.querySelector('[data-role="modal-overlay"]')).toBeVisible();
	});

	test("should close modal and not focus back to the trigger element", async () => {
		render(<ModalOverlayExample focusBack={false} />);
		const showModalButton = document.body.querySelector('[data-role="button"]') as HTMLElement;

		await userEvent.click(showModalButton);

		const modalOverlay = document.body.querySelector('[data-role="modal-overlay"]');
		expect(modalOverlay).toBeVisible();

		const closeButton = modalOverlay!.querySelector('[data-role="button"]') as HTMLElement;
		await userEvent.click(closeButton);

		await waitFor(() => {
			expect(document.body.querySelector('[data-role="modal-overlay"]')).not.toBeInTheDocument();
		});
		expect(showModalButton).not.toHaveFocus();
	});
});
