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

import type { FC, ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Key } from "ts-key-enum";
import { fireEvent, getAllByDataRole, getByDataRole, queryByDataRole, render, setupDevice, waitFor } from "test-utils";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { Button } from "../../button/main/button.view.js";
import { HeaderTrigger } from "../../button/main/header-trigger/header-trigger.view.js";
import { List } from "../../list/main/list.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import { ModalNotification } from "../../modal-notification/main/modal-notification.view.js";
import { ApplicationFrame } from "../../layout/application-frame/main/application-frame.view.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";

import { PopUpMenu } from "../main/pop-up-menu.view.js";
import { PopupMenuConfigContext } from "../main/popup-menu-context.js";

// Story components for popup menu interaction tests
const ExamplePopUpMenu: FC<{ enableA11YMobileDesign: boolean; focusOnTriggerElementAfterClose?: boolean }> = ({
	enableA11YMobileDesign,
	focusOnTriggerElementAfterClose = true
}): ReactNode => {
	const [isOpenModal, setOpenModal] = useState(false);

	return (
		<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: enableA11YMobileDesign }}>
			<PopUpMenu
				icon={<Icon>arrow_drop_up</Icon>}
				headerTitle="title test"
				focusOnTriggerElementAfterClose={focusOnTriggerElementAfterClose}
			>
				<List data-testid="list-test">
					<List.Item text="List item 1" onClick={() => setOpenModal(true)} />
					<List.Item text="List item 2" />
					<List.Item text="List item 3" />
				</List>
			</PopUpMenu>

			{isOpenModal && (
				<ModalNotification title="Modal notification" onClose={() => setOpenModal(false)} enableCloseButton>
					<p>The A12 widget library is part of the A12 Business Application Platform.</p>
				</ModalNotification>
			)}
		</PopupMenuConfigContext.Provider>
	);
};

const ExamplePopUpMenuWithApplicationFrame = (): ReactNode => {
	const properties = {
		id: "test-id",
		className: "test-class",
		style: { color: "red" },
		main: <div>main</div>,
		content: <ExamplePopUpMenu enableA11YMobileDesign={true} />
	};

	return (
		<ApplicationFrame
			main={{ content: properties.main, style: properties.style }}
			content={{ content: properties.content, style: properties.style }}
		/>
	);
};

describe("com.mgmtp.a12.widgets.popup-menu", () => {
	describe("desktop", () => {
		test("Rendering list as children", () => {
			const triggerElementRefSpy = vi.fn();
			const onTriggerElementClickSpy = vi.fn();

			const { container } = render(
				<PopUpMenu
					icon={<Icon>arrow_drop_up</Icon>}
					triggerElementRef={triggerElementRefSpy}
					onTriggerElementClick={onTriggerElementClickSpy}
				>
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			expect(triggerElementRefSpy).toBeCalled();
			expect(container.firstChild).toMatchSnapshot();

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);
			expect(onTriggerElementClickSpy).toBeCalled();

			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			expect(portal.firstChild).toMatchSnapshot();
		});

		test("Rendering button as children", () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<Button label="Button 1" icon={<Icon>edit</Icon>} />
					<Button label="Button 2" />
					<Button label="Button 3" icon={<Icon>add</Icon>} />
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			expect(portal.firstChild).toMatchSnapshot();
		});

		test("ESC to close popup", () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);
			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			fireEvent.keyDown(portal, { key: Key.Escape });
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toEqual(null);
		});

		test("TAB cycle when all list items are interactive", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeDefined();

			const listItems = getAllByDataRole(popupMenu, DataRoles.List.Item.Content);
			expect(listItems).toHaveLength(3);

			// When popup opens, focus auto-moves to the 1st item
			await waitFor(() => expect(listItems[0]).toHaveFocus());

			// Tab from 1st item goes to the 2nd item
			await userEvent.tab();
			expect(listItems[1]).toHaveFocus();

			// Next tab goes to the last item
			await userEvent.tab();
			expect(listItems[2]).toHaveFocus();

			// Next tab from the last item goes to the 1st item
			await userEvent.tab();
			expect(listItems[0]).toHaveFocus();

			// Shift-tab from the 1st item goes to the last item
			await userEvent.tab({ shift: true });
			expect(listItems[2]).toHaveFocus();

			// ESC closes the portal
			await userEvent.keyboard("{Escape}");
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
		});

		test("TAB cycle when the first and last items are disabled", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List>
						<List.Item text="List item 1" disabled />
						<List.Item text="List item 2" />
						<List.Item text="List item 3" disabled />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeDefined();

			const listItems = getAllByDataRole(popupMenu, DataRoles.List.Item.Content);

			// Shift-tab from the portal goes to the interactive element
			await userEvent.tab({ shift: true });
			expect(listItems[1]).toHaveFocus();
			expect(document.activeElement?.textContent).toEqual("List item 2");

			// Next tab will keep the focus on the current interactive item
			await userEvent.tab();
			expect(listItems[1]).toHaveFocus();

			// ESC closes the portal
			await userEvent.keyboard("{Escape}");
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
		});

		test("TAB cycle when all list items are disabled", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List>
						<List.Item text="List item 1" disabled />
						<List.Item text="List item 2" disabled />
						<List.Item text="List item 3" disabled />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeDefined();

			const allInteractiveElement = getAllByDataRole(popupMenu, DataRoles.List.Item.Content).filter(
				(element) => element.getAttribute("tabindex") !== null && element.getAttribute("tabindex") !== "-1"
			);
			expect(allInteractiveElement).toHaveLength(0);

			// Keep focus on the portal when pressing TAB or SHIFT-TAB
			await userEvent.tab();
			expect(popupMenu).toHaveFocus();

			await userEvent.tab({ shift: true });
			expect(popupMenu).toHaveFocus();

			// ESC closes the portal
			await userEvent.keyboard("{Escape}");
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
		});

		test("TAB cycle with the list of items rendered as buttons", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<Button label="Item 1" disabled />
					<Button label="Item 2" />
					<Button label="Item 3" />
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeDefined();

			const itemButtons = popupMenu.querySelectorAll("button");
			expect(itemButtons).toHaveLength(3);

			// Focus on open lands on first interactive (non-disabled) item, skipping Item 1
			await waitFor(() => expect(itemButtons.item(1)).toHaveFocus());

			// Tab from Item 2 goes to Item 3
			await userEvent.tab();
			expect(itemButtons.item(2)).toHaveFocus();

			// Tab from Item 3 wraps back to Item 2 (TabSandbox cycles within the popup)
			await userEvent.tab();
			expect(itemButtons.item(1)).toHaveFocus();

			// Shift-tab from Item 2 goes back to Item 3
			await userEvent.tab({ shift: true });
			expect(itemButtons.item(2)).toHaveFocus();

			// ESC closes the portal
			await userEvent.keyboard("{Escape}");
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
		});

		test("onVisibilityChange", () => {
			const onVisibilityChangeSpy = vi.fn();

			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} onVisibilityChange={onVisibilityChangeSpy}>
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);
			expect(onVisibilityChangeSpy).toHaveBeenCalledTimes(1);

			fireEvent.click(buttonTrigger);
			expect(onVisibilityChangeSpy).toHaveBeenCalledTimes(2);
		});

		test("Rendering button as children", () => {
			const buttonsWithIcon = [
				{ label: "Edit", icon: <Icon>edit</Icon> },
				{ label: "Copy", icon: <Icon>content_copy</Icon> },
				{ label: "Delete", icon: <Icon>delete</Icon> }
			].map((item) => {
				return (
					<Button
						label={item.label}
						onClick={() => alert("Button with label " + item.label + " was clicked")}
						key={item.label}
						icon={item.icon}
					/>
				);
			});

			const { container } = render(<PopUpMenu icon={<Icon>more_vert</Icon>}>{buttonsWithIcon}</PopUpMenu>);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			expect(portal.firstChild).toMatchSnapshot();
		});

		test("Should set position of the popup menu", () => {
			const { container } = render(
				<PopUpMenu orientation="top">
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);
			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			expect(portal).toMatchSnapshot();
		});

		test("Close the popup when pressing Enter on an element that has a focus handler", async () => {
			const { container } = render(
				<>
					<Button dataRole="focusable-button" title="focusable-button" />
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
						<List>
							<List.Item
								text="List item 1"
								onClick={() => {
									const button = getByDataRole(container, "focusable-button");
									button.focus();
								}}
							/>
							<List.Item text="List item 2" />
							<List.Item text="List item 3" disabled />
						</List>
					</PopUpMenu>
				</>
			);

			// Click trigger button to open popup
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);
			const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
			const popupFirstItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];

			// Focus on 1st item and press enter
			popupFirstItem.focus();
			await userEvent.keyboard("{Enter}");

			// Popup closed
			expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();

			// Focus on the trigger element after the popup is closed
			expect(buttonTrigger).toHaveFocus();
		});

		test("Should focus on modal container when opening a fitToParent modal from a popup item", async () => {
			const TestComponent = (): ReactElement => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<div style={{ height: "400px", width: "400px" }}>
						<PopUpMenu icon={<Icon>more_vert</Icon>}>
							<List>
								<List.Item text="Preview" onClick={() => setIsOpen(true)} />
								<List.Item text="Share" />
							</List>
						</PopUpMenu>
						{isOpen && (
							<ModalOverlay fitToParent onClose={() => setIsOpen(false)}>
								<ActionContentbox headingElements={<ContentBoxElements.Title text="Modal" />}>
									<p>Modal content</p>
								</ActionContentbox>
							</ModalOverlay>
						)}
					</div>
				);
			};

			const { container } = render(<TestComponent />);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);

			// Open the popup
			await userEvent.click(buttonTrigger);
			expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeTruthy();

			// Click the "Preview" item which opens a fitToParent modal
			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const previewItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];
			await userEvent.click(previewItem);

			// Popup closed
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();

			// Modal opened — focus must be on the modal container, NOT the trigger button
			const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
			expect(document.activeElement === modalContainer || modalContainer.contains(document.activeElement)).toBe(true);
			expect(buttonTrigger).not.toHaveFocus();
		});

		test("Should focus back to trigger button after closing a fitToParent modal opened from a popup item", async () => {
			const TestComponent = (): ReactElement => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<div style={{ height: "400px", width: "400px" }}>
						<PopUpMenu icon={<Icon>more_vert</Icon>}>
							<List>
								<List.Item text="Preview" onClick={() => setIsOpen(true)} />
								<List.Item text="Share" />
							</List>
						</PopUpMenu>
						{isOpen && (
							<ModalOverlay fitToParent onClose={() => setIsOpen(false)}>
								<ActionContentbox headingElements={<ContentBoxElements.Title text="Modal" />}>
									<p>Modal content</p>
								</ActionContentbox>
							</ModalOverlay>
						)}
					</div>
				);
			};

			const { container } = render(<TestComponent />);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);

			// Open popup and click Preview item to open modal
			await userEvent.click(buttonTrigger);
			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const previewItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];
			await userEvent.click(previewItem);

			// Modal should be open with focus inside it
			expect(getByDataRole(container, DataRoles.Modal.OverlayContent)).toBeTruthy();

			// Close the modal via Escape
			await userEvent.keyboard("{Escape}");

			// Focus must return to the popup trigger button
			expect(queryByDataRole(container, DataRoles.Modal.OverlayContent)).toBeNull();
			expect(buttonTrigger).toHaveFocus();
		});

		test("Should redirect Tab to fitToParent modal when focus is reset to an ancestor wrapper element", async () => {
			const TestComponent = (): ReactElement => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					// Simulates the showcase contentWrapperRef: a focusable ancestor that wraps the modal parent
					<div tabIndex={0} id="ancestor-wrapper">
						<div style={{ height: "400px", width: "400px" }}>
							<PopUpMenu icon={<Icon>more_vert</Icon>}>
								<List>
									<List.Item text="Preview" onClick={() => setIsOpen(true)} />
									<List.Item text="Share" />
								</List>
							</PopUpMenu>
							{isOpen && (
								<ModalOverlay fitToParent onClose={() => setIsOpen(false)}>
									<ActionContentbox headingElements={<ContentBoxElements.Title text="Modal" />}>
										<p>Modal content</p>
										<Button label="Modal action" />
									</ActionContentbox>
								</ModalOverlay>
							)}
						</div>
					</div>
				);
			};

			const { container } = render(<TestComponent />);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			const ancestorWrapper = document.getElementById("ancestor-wrapper") as HTMLDivElement;

			// Open popup and click Preview item to open the fitToParent modal
			await userEvent.click(buttonTrigger);
			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const previewItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];
			await userEvent.click(previewItem);

			// Modal should be open
			const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
			expect(modalContainer).toBeTruthy();

			// Simulate "Reset focus" — move focus to the ancestor wrapper (outside the modal parent)
			ancestorWrapper.focus();
			expect(ancestorWrapper).toHaveFocus();

			// Tab should redirect to the fitToParent modal, not jump to the background
			await userEvent.tab();
			expect(modalContainer).toHaveFocus();
		});
		test("Should apply CSS class names to the corresponding elements", () => {
			const { container } = render(
				<PopUpMenu className="custom-popup" portalClassName="custom-portal" menuClassName="custom-menu">
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const popup = getByDataRole(document.body, DataRoles.Popup);
			expect(popup).toHaveClass("custom-popup");

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			const portal = getByDataRole(document.body, DataRoles.AttachedPortal);
			expect(portal).toHaveClass("custom-portal");

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toHaveClass("custom-menu");
		});

		test("Should restore focus to trigger element when clicking on a non-interactive element outside the popup", async () => {
			const { container } = render(
				<>
					<div id="non-interactive-div">Non-interactive area</div>
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);
			const nonInteractiveDiv = document.getElementById("non-interactive-div") as HTMLElement;

			await userEvent.click(popupTriggerElement);
			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeTruthy();

			// Click on non-interactive div to close the popup
			// And restore focus to the popup's trigger button
			await userEvent.click(nonInteractiveDiv);
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			expect(popupTriggerElement).toHaveFocus();

			// Open the popup again
			await userEvent.click(popupTriggerElement);
			expect(popupMenu).toBeTruthy();

			// Click on another non-interactive area to close the popup
			// And restore focus to the popup's trigger button
			await userEvent.click(document.body);
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			expect(popupTriggerElement).toHaveFocus();
		});

		test("Should NOT restore focus to trigger element when clicking on an interactive element outside the popup", async () => {
			const { container } = render(
				<>
					<Button label="Interactive Button" />
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);
			const interactiveButton = getByDataRole(container, DataRoles.Button);

			await userEvent.click(popupTriggerElement);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeTruthy();

			// Click on interactive button to close the popup
			// And NOT restore focus to the trigger button
			// Focus should be on the interactive button
			await userEvent.click(interactiveButton);
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			expect(popupTriggerElement).not.toHaveFocus();
			expect(interactiveButton).toHaveFocus();
		});

		describe("interaction hint", () => {
			test("should update the hint after opening the popup menu", async () => {
				const { container } = render(
					<InteractionHintConfigProvider enableInteractionHint>
						<PopUpMenu key="version" triggerElement={<HeaderTrigger graphic="info" />}>
							<List paddedRight>
								<List.Item readonly />
							</List>
						</PopUpMenu>
					</InteractionHintConfigProvider>
				);

				const triggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

				expect(triggerElement.getAttribute("aria-label")).toEqual("Open menu");

				fireEvent.focus(triggerElement);

				await waitFor(() => {
					const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

					expect(interactionHint).toBeTruthy();
					expect(interactionHint?.textContent).toEqual("Open menu");
				});

				fireEvent.click(triggerElement);

				expect(getByDataRole(container, DataRoles.Popup.Menu)).toBeTruthy();

				fireEvent.mouseOver(triggerElement);

				await waitFor(() => {
					const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

					expect(triggerElement.getAttribute("aria-label")).toEqual("Close menu");
					expect(interactionHint?.textContent).toEqual("Close menu");
				});
			});
		});

		test("Should close popup menu when click outside and the focus is set back to the trigger element", async () => {
			render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List data-testid="list-test">
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			// Click the trigger element to open popup menu
			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			await userEvent.click(document.body);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
			render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={false}>
					<List data-testid="list-test">
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			await userEvent.click(document.body);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(buttonTrigger).not.toHaveFocus();
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onItemClick is false", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={{ onItemClick: false }}>
					<List>
						<List.Item text="List item 1" />
						<List.Item text="List item 2" />
					</List>
				</PopUpMenu>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(popupTriggerElement);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const firstItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];

			firstItem.focus();
			await userEvent.keyboard("{Enter}");

			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			expect(popupTriggerElement).not.toHaveFocus();
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onOutsideClick is false", async () => {
			vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });

			const { container } = render(
				<>
					<div id="non-interactive-div">Non-interactive area</div>
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={{ onOutsideClick: false }}>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);
			const nonInteractiveDiv = document.getElementById("non-interactive-div") as HTMLElement;

			await userEvent.click(popupTriggerElement);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			expect(popupMenu).toBeTruthy();

			// Click outside
			await userEvent.click(nonInteractiveDiv);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			// Flush the requestAnimationFrame scheduled by focus restoration.
			vi.advanceTimersByTime(500);

			expect(popupTriggerElement).not.toHaveFocus();

			vi.useRealTimers();
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onProgrammatic is false", async () => {
			vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });

			let closePopupFromOutside: (() => void) | undefined;

			const { container } = render(
				<PopUpMenu
					icon={<Icon>arrow_drop_up</Icon>}
					close={(closePopup) => {
						closePopupFromOutside = closePopup;
					}}
					focusOnTriggerElementAfterClose={{ onProgrammatic: false }}
				>
					<List>
						<List.Item text="List item 1" />
						<List.Item text="List item 2" />
					</List>
				</PopUpMenu>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(popupTriggerElement);

			closePopupFromOutside?.();

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			// Flush the requestAnimationFrame scheduled by focus restoration.
			vi.advanceTimersByTime(500);

			expect(popupTriggerElement).not.toHaveFocus();

			vi.useRealTimers();
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onSpace is false", async () => {
			const { container } = render(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={{ onSpace: false }}>
					<button type="button" aria-pressed="false">
						Action
					</button>
				</PopUpMenu>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(popupTriggerElement);

			await userEvent.keyboard("{Space}");

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			expect(popupTriggerElement).not.toHaveFocus();
		});

		test("Should respect multiple focusOnTriggerElementAfterClose close reason configs", async () => {
			const { container } = render(
				<>
					<div id="non-interactive-div">Non-interactive area</div>
					<PopUpMenu
						icon={<Icon>arrow_drop_up</Icon>}
						focusOnTriggerElementAfterClose={{
							onItemClick: false,
							onOutsideClick: false
						}}
					>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);
			const nonInteractiveDiv = document.getElementById("non-interactive-div") as HTMLElement;

			// Open the popup menu.
			await userEvent.click(popupTriggerElement);

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const firstItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];

			// Close by item click, focusOnTriggerElementAfterClose.onItemClick is false, so focus should not return.
			await userEvent.click(firstItem);
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			expect(popupTriggerElement).not.toHaveFocus();

			// Reopen the popup menu.
			await userEvent.click(popupTriggerElement);

			// Close by outside click, focusOnTriggerElementAfterClose.onOutsideClick is false, so focus should not return.
			await userEvent.click(nonInteractiveDiv);
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			expect(popupTriggerElement).not.toHaveFocus();

			// Reopen the popup menu.
			await userEvent.click(popupTriggerElement);

			// Close by ESC, focusOnTriggerElementAfterClose.onEscape is not configured, so it defaults to true.
			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			expect(popupTriggerElement).toHaveFocus();
		});
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("Should display header for popup menu on mobile", () => {
			const { container } = render(
				<PopUpMenu orientation="top" headerTitle="menu">
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			expect(getByDataRole(container, DataRoles.Popup.HeaderTitle).textContent).toBe("menu");
			expect(getByDataRole(container, DataRoles.Popup.Menu)).toMatchSnapshot();
		});

		test("Should close popup menu when click close button on header", async () => {
			const { container } = render(
				<PopUpMenu orientation="top" headerTitle="menu">
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);

			expect(getByDataRole(container, DataRoles.Popup.Menu)).toBeTruthy();

			const closeButton = getByDataRole(container, DataRoles.Popup.CloseButton);
			await userEvent.click(closeButton);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();
			});
		});

		test("Should display popup menu on mobile without header", () => {
			const { container } = render(
				<PopUpMenu orientation="top">
					<List>
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			expect(queryByDataRole(container, "typography-headline-label")).toBeNull();
			expect(getByDataRole(container, DataRoles.Popup.Menu)).toMatchSnapshot();
		});

		test("Focus on the trigger element when setting focusOnTriggerElementAfterClose to false then closing the popup by ESC on mobile", async () => {
			const { container } = render(
				<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: true }}>
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={false}>
						<List>
							<List.Item text="List item 1" disabled />
							<List.Item text="List item 2" />
							<List.Item text="List item 3" disabled />
						</List>
					</PopUpMenu>
				</PopupMenuConfigContext.Provider>
			);

			// Click trigger button to open popup
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(buttonTrigger);
			expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeTruthy();

			// press ESC to close the portal
			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();
				// Focus on the trigger element after the popup is closed
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should focus on modal container when opening a fitToParent modal from a popup item", async () => {
			const TestComponent = (): ReactElement => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<div style={{ height: "400px", width: "400px" }}>
						<PopUpMenu icon={<Icon>more_vert</Icon>}>
							<List>
								<List.Item text="Preview" onClick={() => setIsOpen(true)} />
								<List.Item text="Share" />
							</List>
						</PopUpMenu>
						{isOpen && (
							<ModalOverlay fitToParent onClose={() => setIsOpen(false)}>
								<ActionContentbox headingElements={<ContentBoxElements.Title text="Modal" />}>
									<p>Modal content</p>
								</ActionContentbox>
							</ModalOverlay>
						)}
					</div>
				);
			};

			const { container } = render(<TestComponent />);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);
			expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeTruthy();

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const previewItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];
			await userEvent.click(previewItem);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			await waitFor(() => {
				const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
				expect(document.activeElement === modalContainer || modalContainer.contains(document.activeElement)).toBe(true);
				expect(buttonTrigger).not.toHaveFocus();
			});

			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.OverlayContent)).toBeNull();
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should focus on modal container when opening a modal from a popup item", async () => {
			const TestComponent = (): ReactElement => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<div style={{ height: "400px", width: "400px" }}>
						<PopUpMenu icon={<Icon>more_vert</Icon>}>
							<List>
								<List.Item text="Preview" onClick={() => setIsOpen(true)} />
								<List.Item text="Share" />
							</List>
						</PopUpMenu>
						{isOpen && (
							<ModalOverlay onClose={() => setIsOpen(false)}>
								<ActionContentbox headingElements={<ContentBoxElements.Title text="Modal" />}>
									<p>Modal content</p>
								</ActionContentbox>
							</ModalOverlay>
						)}
					</div>
				);
			};

			const { container } = render(<TestComponent />);
			const buttonTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);
			expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeTruthy();

			const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
			const previewItem = getAllByDataRole(popupMenu, DataRoles.List.Item.Content)[0];
			await userEvent.click(previewItem);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			await waitFor(() => {
				const modalContainer = getByDataRole(container, DataRoles.Modal.OverlayContent);
				expect(document.activeElement === modalContainer || modalContainer.contains(document.activeElement)).toBe(true);
				expect(buttonTrigger).not.toHaveFocus();
			});

			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.OverlayContent)).toBeNull();
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onEscape is false", async () => {
			const { container } = render(
				<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: true }}>
					<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={{ onEscape: false }}>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</PopupMenuConfigContext.Provider>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(popupTriggerElement);
			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();
			});

			expect(popupTriggerElement).not.toHaveFocus();
		});

		test("Should NOT restore focus to trigger element when focusOnTriggerElementAfterClose.onCloseButton is false", async () => {
			vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });

			const { container } = render(
				<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: true }}>
					<PopUpMenu orientation="top" headerTitle="menu" focusOnTriggerElementAfterClose={{ onCloseButton: false }}>
						<List>
							<List.Item text="List item 1" />
							<List.Item text="List item 2" />
						</List>
					</PopUpMenu>
				</PopupMenuConfigContext.Provider>
			);

			const popupTriggerElement = getByDataRole(container, DataRoles.Popup.TriggerElement);

			await userEvent.click(popupTriggerElement);

			const closeButton = getByDataRole(container, DataRoles.Popup.CloseButton);

			await userEvent.click(closeButton);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();
			});
			// Flush the requestAnimationFrame scheduled by focus restoration.
			vi.advanceTimersByTime(500);

			expect(popupTriggerElement).not.toHaveFocus();

			vi.useRealTimers();
		});

		describe("without A11YMobileDesign", () => {
			test("Should close popup menu when click outside and the focus is set back to the trigger element", async () => {
				render(<ExamplePopUpMenu enableA11YMobileDesign={false} />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				await userEvent.click(document.body);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
					expect(buttonTrigger).toHaveFocus();
				});
			});

			test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
				render(<ExamplePopUpMenu enableA11YMobileDesign={false} focusOnTriggerElementAfterClose={false} />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				await userEvent.click(document.body);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});
				expect(buttonTrigger).not.toHaveFocus();
			});
		});

		describe("with A11YMobileDesign", () => {
			test("Should close popup menu when click close button and the focus is set back to the trigger element", async () => {
				render(<ExamplePopUpMenu enableA11YMobileDesign={true} />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
				await userEvent.click(closeButton);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
					expect(buttonTrigger).toHaveFocus();
				});
			});

			test("Should close popup menu when click close button and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
				render(<ExamplePopUpMenu enableA11YMobileDesign={true} focusOnTriggerElementAfterClose={false} />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
				await userEvent.click(closeButton);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});
				expect(buttonTrigger).not.toHaveFocus();
			});

			test("Should disabled elements in background when opening", async () => {
				render(<ExamplePopUpMenuWithApplicationFrame />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
				const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

				expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
				expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");
			});

			test("Should enable elements in background by clicking close button to close", async () => {
				render(<ExamplePopUpMenuWithApplicationFrame />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
				const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

				expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
				expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

				const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
				await userEvent.click(closeButton);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});
				expect(applicationFrame).not.toHaveAttribute("aria-hidden");
				expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
			});

			test("Should enable elements in background by press Escape to close", async () => {
				render(<ExamplePopUpMenuWithApplicationFrame />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
				const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

				expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
				expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

				await userEvent.keyboard("{Escape}");

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});
				expect(applicationFrame).not.toHaveAttribute("aria-hidden");
				expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
			});

			test("Should enable elements in background by selecting item and close popup", async () => {
				render(<ExamplePopUpMenuWithApplicationFrame />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
				const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

				expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
				expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

				const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
				const secondItem = getAllByDataRole(popupMenu, DataRoles.List.Item)[1];
				await userEvent.click(secondItem);

				await waitFor(() => {
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});
				expect(applicationFrame).not.toHaveAttribute("aria-hidden");
				expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
			});

			test("Should disabled elements background by clicking the item to open modal overlay and enable after closing modal overlay", async () => {
				render(<ExamplePopUpMenuWithApplicationFrame />);

				const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

				await userEvent.click(buttonTrigger);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
				});

				const popupMenu = getByDataRole(document.body, DataRoles.Popup.Menu);
				const firstItem = getAllByDataRole(popupMenu, DataRoles.List.Item)[0];
				await userEvent.click(firstItem);

				await waitFor(() => {
					expect(getByDataRole(document.body, DataRoles.Modal.Overlay)).toBeVisible();
					expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				});

				const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
				const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

				expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
				expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

				const modalOverlayContent = getByDataRole(document.body, DataRoles.Modal.OverlayContent);
				const modalButton = getByDataRole(modalOverlayContent, DataRoles.Button);
				await userEvent.click(modalButton);

				await waitFor(() => {
					expect(applicationFrame).not.toHaveAttribute("aria-hidden");
					expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
				});
			});
		});
	});
});

describe("Popup Menu desktop behavior", () => {
	test("Should close popup menu when click outside and the focus is set back to the trigger element", async () => {
		render(
			<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
				<List data-testid="list-test">
					<List.Item text="List item" />
					<List.Item text="List item" />
					<List.Item text="List item" />
				</List>
			</PopUpMenu>
		);

		const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

		// Click the trigger element to open popup menu
		await userEvent.click(buttonTrigger);

		await waitFor(() => {
			expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
		});

		await userEvent.click(document.body);

		await waitFor(() => {
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			expect(buttonTrigger).toHaveFocus();
		});
	});

	test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
		render(
			<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={false}>
				<List data-testid="list-test">
					<List.Item text="List item" />
					<List.Item text="List item" />
					<List.Item text="List item" />
				</List>
			</PopUpMenu>
		);

		const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

		await userEvent.click(buttonTrigger);

		await waitFor(() => {
			expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
		});

		await userEvent.click(document.body);

		await waitFor(() => {
			expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
		});
		expect(buttonTrigger).not.toHaveFocus();
	});
});

describe("Popup Menu mobile behavior", () => {
	beforeAll(() => {
		setupDevice();
	});

	describe("without A11YMobileDesign", () => {
		test("Should close popup menu when click outside and the focus is set back to the trigger element", async () => {
			render(<ExamplePopUpMenu enableA11YMobileDesign={false} />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			await userEvent.click(document.body);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
			render(<ExamplePopUpMenu enableA11YMobileDesign={false} focusOnTriggerElementAfterClose={false} />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			await userEvent.click(document.body);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(buttonTrigger).not.toHaveFocus();
		});
	});

	describe("with A11YMobileDesign", () => {
		test("Should close popup menu when click close button and the focus is set back to the trigger element", async () => {
			render(<ExamplePopUpMenu enableA11YMobileDesign={true} />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
			await userEvent.click(closeButton);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
				expect(buttonTrigger).toHaveFocus();
			});
		});

		test("Should close popup menu when click close button and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async () => {
			render(<ExamplePopUpMenu enableA11YMobileDesign={true} focusOnTriggerElementAfterClose={false} />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
			await userEvent.click(closeButton);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(buttonTrigger).not.toHaveFocus();
		});

		test("Should disabled elements in background when opening", async () => {
			render(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
			const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

			expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");
		});

		test("Should enable elements in background by clicking close button to close", async () => {
			render(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
			const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

			expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			const closeButton = getByDataRole(document.body, DataRoles.Popup.CloseButton);
			await userEvent.click(closeButton);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should enable elements in background by press Escape to close", async () => {
			render(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
			const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

			expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should enable elements in background by selecting item and close popup", async () => {
			render(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
			const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

			expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			const secondItem = getAllByDataRole(getByDataRole(document.body, DataRoles.Popup.Menu), DataRoles.List.Item)[1];
			await userEvent.click(secondItem);

			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});
			expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should disabled elements background by clicking the item to open modal overlay and enable after closing modal overlay", async () => {
			render(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTrigger = getByDataRole(document.body, DataRoles.Popup.TriggerElement);

			await userEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Popup.Menu)).toBeVisible();
			});

			const firstItem = getAllByDataRole(getByDataRole(document.body, DataRoles.Popup.Menu), DataRoles.List.Item)[0];
			await userEvent.click(firstItem);

			await waitFor(() => {
				expect(getByDataRole(document.body, DataRoles.Modal.Overlay)).toBeVisible();
				expect(queryByDataRole(document.body, DataRoles.Popup.Menu)).toBeNull();
			});

			const applicationFrame = getByDataRole(document.body, DataRoles.ApplicationFrame);
			const applicationFrameHeader = getByDataRole(document.body, DataRoles.ApplicationFrame.Header);

			expect(applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			const modalOverlayContent = getByDataRole(document.body, DataRoles.Modal.OverlayContent);
			const modalButton = getByDataRole(modalOverlayContent, DataRoles.Button);
			await userEvent.click(modalButton);

			await waitFor(() => {
				expect(applicationFrame).not.toHaveAttribute("aria-hidden");
				expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
			});
		});
	});
});

describe("com.mgmtp.a12.widgets.popup-menu", () => {
	describe("arrow key navigation", () => {
		beforeAll(() => {
			setupDevice("desktop");
		});

		const items = (
			<List>
				<List.Item text="Action 1" onClick={() => undefined} />
				<List.Item text="Action 2" onClick={() => undefined} />
				<List.Item text="Action 3" onClick={() => undefined} />
			</List>
		);

		test("focuses the first item when popup opens", async () => {
			const { container } = render(<PopUpMenu>{items}</PopUpMenu>);
			const trigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
			await userEvent.click(trigger);
			await waitFor(() => {
				const firstItem = document.querySelector(`[data-role="${DataRoles.List.Item.Content}"]`) as HTMLElement;
				expect(firstItem).toHaveFocus();
			});
		});

		test("moves focus down with ArrowDown", async () => {
			const { container } = render(<PopUpMenu>{items}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			const allItems = () => document.querySelectorAll(`[data-role="${DataRoles.List.Item.Content}"]`);
			await waitFor(() => expect(allItems()[0]).toHaveFocus());
			await userEvent.keyboard("{ArrowDown}");
			expect(allItems()[1]).toHaveFocus();
		});

		test("moves focus up with ArrowUp, wrapping to last item", async () => {
			const { container } = render(<PopUpMenu>{items}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			const allItems = () => document.querySelectorAll(`[data-role="${DataRoles.List.Item.Content}"]`);
			await waitFor(() => expect(allItems()[0]).toHaveFocus());
			await userEvent.keyboard("{ArrowUp}");
			expect(allItems()[2]).toHaveFocus();
		});

		test("closes popup on Tab in arrow-only mode", async () => {
			const { KeyboardNavigationConfigProvider } =
				await import("../../keyboard-navigation/main/keyboard-navigation-context.js");
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<PopUpMenu>{items}</PopUpMenu>
				</KeyboardNavigationConfigProvider>
			);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			const firstItem = () => document.querySelector(`[data-role="${DataRoles.List.Item.Content}"]`) as HTMLElement;
			await waitFor(() => expect(firstItem()).toHaveFocus());
			await userEvent.tab();
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).not.toBeInTheDocument();
			});
		});

		test("does not close popup on Tab in default mode", async () => {
			const { container } = render(<PopUpMenu>{items}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			const firstItem = () => document.querySelector(`[data-role="${DataRoles.List.Item.Content}"]`) as HTMLElement;
			await waitFor(() => expect(firstItem()).toHaveFocus());
			await userEvent.tab();
			expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeInTheDocument();
		});

		test("closes popup on Shift+Tab in arrow-only mode and focuses trigger", async () => {
			const { KeyboardNavigationConfigProvider } =
				await import("../../keyboard-navigation/main/keyboard-navigation-context.js");
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<PopUpMenu>{items}</PopUpMenu>
				</KeyboardNavigationConfigProvider>
			);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			const firstItem = () => document.querySelector(`[data-role="${DataRoles.List.Item.Content}"]`) as HTMLElement;
			await waitFor(() => expect(firstItem()).toHaveFocus());
			await userEvent.tab({ shift: true });
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Popup.Menu)).not.toBeInTheDocument();
			});
			expect(getByDataRole(container, DataRoles.Popup.TriggerElement)).toHaveFocus();
		});
	}); // arrow key navigation

	describe("arrow key navigation — mixed list with readonly items and embedded button", () => {
		beforeAll(() => {
			setupDevice("desktop");
		});

		// Mirrors the with-header-trigger showcase structure:
		//   [0] readonly  "Peter Parker"        — has NO tabIndex → not focusable
		//   [1] SubHeader "Language"            — non-interactive
		//   [2] interactive "English (USA)"     — tabIndex=0
		//   [3] interactive "German (Germany)"  — tabIndex=0
		//   [4] readonly  item with <Button>Logout</Button>  — list item not focusable, but button IS
		const mixedList = (
			<List>
				<List.Item text="Peter Parker" secondaryText="Logged in as:" readonly />
				<List.SubHeader>Language</List.SubHeader>
				<List.Item text="English (USA)" onClick={() => undefined} />
				<List.Item text="German (Germany)" onClick={() => undefined} />
				<List.Item
					readonly
					text={
						<Button primary destructive dataRole="logout-button">
							Logout
						</Button>
					}
				/>
			</List>
		);

		test("focuses first interactive item on open, skipping readonly first item", async () => {
			const { container } = render(<PopUpMenu>{mixedList}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				const englishItem = allContents.find((el) => el.textContent?.includes("English"));
				expect(englishItem).toHaveFocus();
			});
		});

		test("ArrowDown from last interactive item reaches button inside readonly item", async () => {
			const { container } = render(<PopUpMenu>{mixedList}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));

			// Wait for focus to land on "English (USA)"
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				const englishItem = allContents.find((el) => el.textContent?.includes("English"));
				expect(englishItem).toHaveFocus();
			});

			// ArrowDown → "German (Germany)"
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				const germanItem = allContents.find((el) => el.textContent?.includes("German"));
				expect(germanItem).toHaveFocus();
			});

			// ArrowDown → Logout button (inside readonly item)
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const logoutButton = document.querySelector<HTMLElement>("[data-role='logout-button']");
				expect(logoutButton).toHaveFocus();
			});
		});

		test("ArrowDown from Logout button wraps to first interactive item", async () => {
			const { container } = render(<PopUpMenu>{mixedList}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));

			// Navigate to Logout button: English → German → Logout
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				expect(allContents.find((el) => el.textContent?.includes("English"))).toHaveFocus();
			});
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{ArrowDown}");

			// Now on Logout button
			await waitFor(() => {
				const logoutButton = document.querySelector<HTMLElement>("[data-role='logout-button']");
				expect(logoutButton).toHaveFocus();
			});

			// ArrowDown wraps → back to "English (USA)"
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				const englishItem = allContents.find((el) => el.textContent?.includes("English"));
				expect(englishItem).toHaveFocus();
			});
		});

		test("ArrowUp from first interactive item wraps to Logout button", async () => {
			const { container } = render(<PopUpMenu>{mixedList}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));

			// Wait for focus on "English (USA)" — first interactive item
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				expect(allContents.find((el) => el.textContent?.includes("English"))).toHaveFocus();
			});

			// ArrowUp wraps → Logout button (last focusable in popup)
			await userEvent.keyboard("{ArrowUp}");
			await waitFor(() => {
				const logoutButton = document.querySelector<HTMLElement>("[data-role='logout-button']");
				expect(logoutButton).toHaveFocus();
			});
		});

		test("readonly items without focusable children are never visited by arrow keys", async () => {
			const listWithBareReadonly = (
				<List>
					<List.Item text="Header info" readonly />
					<List.Item text="Item A" onClick={() => undefined} />
					<List.Item text="Item B" onClick={() => undefined} />
				</List>
			);
			const { container } = render(<PopUpMenu>{listWithBareReadonly}</PopUpMenu>);
			await userEvent.click(getByDataRole(container, DataRoles.Popup.TriggerElement));

			// Focus should land on "Item A" (first interactive), not "Header info"
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				const itemA = allContents.find((el) => el.textContent?.includes("Item A"));
				expect(itemA).toHaveFocus();
			});

			// ArrowDown → "Item B"
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				expect(allContents.find((el) => el.textContent?.includes("Item B"))).toHaveFocus();
			});

			// ArrowDown → wraps to "Item A" (readonly "Header info" is never visited)
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const allContents = Array.from(
					document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.List.Item.Content}"]`)
				);
				expect(allContents.find((el) => el.textContent?.includes("Item A"))).toHaveFocus();
			});
		});
	}); // arrow key navigation — mixed list
}); // com.mgmtp.a12.widgets.popup-menu
