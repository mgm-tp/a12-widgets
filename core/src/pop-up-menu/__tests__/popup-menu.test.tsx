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

import { PopUpMenu } from "../main/pop-up-menu.view.js";
import { PopupMenuConfigContext } from "../main/popup-menu-context.js";

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

			const listItems = document.querySelectorAll(`[data-role=${DataRoles.List.Item.Content}]`);
			expect(listItems).toHaveLength(3);

			// Tab from the portal goes to the 1st item
			await userEvent.tab();
			expect(document.activeElement === listItems.item(0)).toBeTruthy();

			// Next tab goes to the 2nd item
			await userEvent.tab();
			expect(document.activeElement === listItems.item(1)).toBeTruthy();

			// Next tab goes to the last item
			await userEvent.tab();
			expect(document.activeElement === listItems.item(2)).toBeTruthy();

			// Next tab from the last item goes to the 1st item
			await userEvent.tab();
			expect(document.activeElement === listItems.item(0)).toBeTruthy();

			// Shift-tab from the 1st item goes to the last item
			await userEvent.tab({ shift: true });
			expect(document.activeElement === listItems.item(2)).toBeTruthy();

			// ESC closes the portal
			await userEvent.keyboard("[Escape]");
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

			const listItems = document.querySelectorAll(`[data-role=${DataRoles.List.Item.Content}]`);

			// Shift-tab from the portal goes to the interactive element
			await userEvent.tab({ shift: true });
			expect(document.activeElement === listItems.item(1)).toBeTruthy();
			expect(document.activeElement?.textContent).toEqual("List item 2");

			// Next tab will keep the focus on the current interactive item
			await userEvent.tab();
			expect(document.activeElement === listItems.item(1)).toBeTruthy();

			// ESC closes the portal
			await userEvent.keyboard("[Escape]");
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

			const allInteractiveElement = document.querySelectorAll(
				`[data-role=${DataRoles.List.Item.Content}][tabindex]:not([tabindex="-1"])`
			);
			expect(allInteractiveElement).toHaveLength(0);

			// Keep focus on the portal when pressing TAB or SHIFT-TAB
			await userEvent.tab();
			expect(document.activeElement === popupMenu).toBeTruthy();

			await userEvent.tab({ shift: true });
			expect(document.activeElement === popupMenu).toBeTruthy();

			// ESC closes the portal
			await userEvent.keyboard("[Escape]");
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

			// Tab from the portal goes to the first interactive item
			await userEvent.tab();
			expect(document.activeElement === itemButtons.item(1)).toBeTruthy();

			// Next tab goes to the last item
			await userEvent.tab();
			expect(document.activeElement === itemButtons.item(2)).toBeTruthy();

			// Next tab from the last item goes back to the first interactive item
			await userEvent.tab();
			expect(document.activeElement === itemButtons.item(1)).toBeTruthy();

			// Shift-tab from the 2nd item goes to the last item
			await userEvent.tab({ shift: true });
			expect(document.activeElement === itemButtons.item(2)).toBeTruthy();

			// ESC closes the portal
			await userEvent.keyboard("[Escape]");
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
					<button data-role="focusable-button" />
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
			const popupFirstItem = getAllByDataRole(popupMenu, "list-item-content")[0];

			// Focus on 1st item and press enter
			popupFirstItem.focus();
			await userEvent.keyboard("{Enter}");

			// Popup closed
			expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull();

			// Focus on the trigger element after the popup is closed
			expect(document.activeElement === buttonTrigger).toBeTruthy();
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
	});
});
