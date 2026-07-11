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

import { render } from "test-utils";
import { describe, expect, test, afterEach } from "vitest";
import { userEvent } from "vitest/browser";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { waitFor } from "@testing-library/dom";

import { DataRoles } from "../../common/main/data-roles.js";
import { Button } from "../../button/main/button.view.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import { TextField } from "../../input/text-field/main/template/text-field.tpl.view.js";
import { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";

import { AttachedPortal } from "../main/attached-portal.view.js";

const TEXTAREA_DATA_ROLE = "dropdown-textarea";

interface NestedPortalTestComponentProps {
	hideOnReferenceElementPositionChange?: boolean;
}

function NestedPortalTestComponent({
	hideOnReferenceElementPositionChange = false
}: NestedPortalTestComponentProps): ReactNode {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [showSecondPortal, setShowSecondPortal] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const getButtonRef = useCallback((ref: HTMLButtonElement | null) => {
		buttonRef.current = ref;
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		setShowSecondPortal(value.length > 0);
	}, []);

	const getInputRef = useCallback((ref: HTMLInputElement | null) => {
		inputRef.current = ref;
	}, []);

	return (
		<div>
			<Button buttonRef={getButtonRef} dataRole="trigger-button" onClick={() => setShow((prevState) => !prevState)}>
				Trigger Button
			</Button>
			{buttonRef.current && show && (
				<AttachedPortal
					hideOnReferenceElementPositionChange={hideOnReferenceElementPositionChange}
					onVisibilityChange={setShow}
					referenceElement={buttonRef.current}
				>
					<div
						data-testid="first-portal-content"
						style={{
							padding: "20px",
							backgroundColor: "white",
							border: "1px solid #ddd",
							borderRadius: "4px",
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
							minWidth: "300px"
						}}
					>
						<h4>First Portal</h4>
						<p>Type to open nested portal</p>
						<TextField
							id="nested-trigger-input"
							label="Type to open 2nd portal"
							value={inputValue}
							onChange={handleInputChange}
							inputRef={getInputRef}
							placeholder="Start typing..."
						/>

						{showSecondPortal && inputRef.current && (
							<AttachedPortal
								referenceElement={inputRef.current}
								orientation="bottom-start"
								onVisibilityChange={setShowSecondPortal}
								closeOnOutsideClick={{ exception: [inputRef.current] }}
								hideOnReferenceElementPositionChange={false}
							>
								<div
									data-testid="second-portal-content"
									style={{
										padding: "20px",
										backgroundColor: "lightgreen",
										border: "1px solid #00cc66",
										borderRadius: "4px",
										boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
										maxWidth: "200px"
									}}
								>
									<h4>Second Portal</h4>
									<p>Nested portal content</p>
								</div>
							</AttachedPortal>
						)}
					</div>
				</AttachedPortal>
			)}
		</div>
	);
}

function DropdownWithPreviewTestComponent(): ReactNode {
	const [inputValue, setInputValue] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [previewValue, setPreviewValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const dropdownItems: DropDownItem[] = useMemo(
		() => [
			{
				label: 'Apple - Fresh and crispy "Apple - Fresh and crispy "Apple - Fresh and crispy "Apple - Fresh and crispy',
				value: "Apple - Fresh and crispy"
			},
			{ label: "Banana - Rich in potassium", value: "Banana - Rich in potassium" },
			{ label: "Fig - Ancient sweetness", value: "Fig - Ancient sweetness" },
			{ label: "Grapefruit - Tangy citrus with vitamin C", value: "Grapefruit - Tangy citrus with vitamin C" },
			{ label: "Honeydew - Refreshing melon", value: "Honeydew - Refreshing melon" }
		],
		[]
	);

	const handleTextareaRef = useCallback((ref: HTMLTextAreaElement | null) => {
		textareaRef.current = ref;
	}, []);

	useEffect(() => {
		// Adjust height on mount and when input value changes
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

			// Force reflow before updating rect
			textareaRef.current.getBoundingClientRect();
		}
	}, [inputValue, previewValue, highlightedIndex]);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(event.target.value);
		setPreviewValue("");
	}, []);

	const handleInputFocus = useCallback(() => {
		setShowDropdown(true);
		setHighlightedIndex(-1);
		setPreviewValue("");
	}, []);

	const handlePreSelectItem = useCallback(
		(item: DropDownItem | undefined) => {
			if (item) {
				const index = dropdownItems.findIndex((dropdownItem) => dropdownItem.value === item.value);
				setHighlightedIndex(index);
				setPreviewValue(item.label);

				if (textareaRef.current) {
					textareaRef.current.style.height = "auto";
					textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

					textareaRef.current.getBoundingClientRect();
				}
			}
		},
		[dropdownItems]
	);

	return (
		<div>
			<textarea
				ref={handleTextareaRef}
				data-role={TEXTAREA_DATA_ROLE}
				value={previewValue || inputValue}
				onChange={handleInputChange}
				onFocus={handleInputFocus}
				placeholder="Click here to show dropdown, type to grow the input, use arrow keys to navigate..."
				style={{
					width: "200px",
					minHeight: "40px",
					resize: "none",
					overflow: "hidden",
					padding: "8px",
					fontSize: "14px",
					fontFamily: "inherit",
					lineHeight: "1.5"
				}}
			/>
			{textareaRef.current && showDropdown && (
				<AttachedPortal
					referenceElement={textareaRef.current}
					orientation="bottom-start"
					closeOnOutsideClick={{ exception: [textareaRef.current] }}
					onVisibilityChange={setShowDropdown}
				>
					<DropDown
						onPreselectedItemChange={handlePreSelectItem}
						items={dropdownItems}
						selectedItem={highlightedIndex >= 0 ? dropdownItems[highlightedIndex] : undefined}
						id="textarea-dropdown"
					/>
				</AttachedPortal>
			)}
		</div>
	);
}

interface TogglePortalTestComponentProps {
	children?: ReactNode;
}

function TogglePortalTestComponent({ children }: TogglePortalTestComponentProps): ReactNode {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);

	const getButtonRef = useCallback((ref: HTMLButtonElement | null) => {
		buttonRef.current = ref;
	}, []);

	return (
		<div>
			<Button buttonRef={getButtonRef} dataRole="toggle-button" onClick={() => setShow((prev) => !prev)}>
				Toggle
			</Button>
			{buttonRef.current && show && (
				<AttachedPortal referenceElement={buttonRef.current} onVisibilityChange={setShow}>
					{children}
				</AttachedPortal>
			)}
		</div>
	);
}

describe("AttachedPortal - Position Consistency", () => {
	test("portal position is consistent between first and second opens", async () => {
		const { getByDataRole: getByRole, queryAllByDataRole } = render(
			<TogglePortalTestComponent>
				<div data-testid="portal-content" style={{ padding: "20px" }}>
					Portal content
				</div>
			</TogglePortalTestComponent>
		);

		const toggleButton = getByRole("toggle-button") as HTMLButtonElement;

		// First open
		await userEvent.click(toggleButton);
		await waitFor(() => expect(queryAllByDataRole(DataRoles.AttachedPortal).length).toBe(1));

		const firstPortal = queryAllByDataRole(DataRoles.AttachedPortal)[0] as HTMLElement;
		const firstPortalStyle = { top: firstPortal.style.top, left: firstPortal.style.left };

		// Close
		await userEvent.click(toggleButton);
		await waitFor(() => expect(queryAllByDataRole(DataRoles.AttachedPortal).length).toBe(0));

		// Second open
		await userEvent.click(toggleButton);
		await waitFor(() => expect(queryAllByDataRole(DataRoles.AttachedPortal).length).toBe(1));

		const secondPortal = queryAllByDataRole(DataRoles.AttachedPortal)[0] as HTMLElement;

		expect(secondPortal.style.top).toBe(firstPortalStyle.top);
		expect(secondPortal.style.left).toBe(firstPortalStyle.left);
	});
});

describe("AttachedPortal - Nested Portals with Scrolling", () => {
	afterEach(() => {
		// Clean up any dynamically created elements from document.body
		const scrollContainers = document.body.querySelectorAll('div[style*="height: 500px"]');
		scrollContainers.forEach((container) => {
			document.body.removeChild(container);
		});
	});

	test("nested portal should update position after scrolling when hideOnReferenceElementPositionChange is false", async () => {
		// Create scroll container
		const scrollContainer = document.createElement("div");
		scrollContainer.style.height = "500px";
		scrollContainer.style.width = "800px";
		scrollContainer.style.overflow = "auto";
		scrollContainer.style.position = "relative";
		document.body.appendChild(scrollContainer);

		const spacer = document.createElement("div");
		spacer.style.height = "2000px";
		scrollContainer.appendChild(spacer);

		const { getByDataRole, queryAllByDataRole } = render(
			<NestedPortalTestComponent hideOnReferenceElementPositionChange={false} />,
			{ container: scrollContainer }
		);

		// Open first portal
		const triggerButton = getByDataRole("trigger-button") as HTMLButtonElement;
		await userEvent.click(triggerButton);

		expect(queryAllByDataRole(DataRoles.AttachedPortal).length).toBe(1);

		const firstPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
		const firstPortalInitialTop = firstPortal.getBoundingClientRect().top;

		// Type to open nested portal
		const input = getByDataRole(DataRoles.TextField.Input) as HTMLInputElement;
		await userEvent.type(input, "test");

		const portals = queryAllByDataRole(DataRoles.AttachedPortal);
		expect(portals.length).toBe(2);

		const secondPortal = portals[1] as HTMLElement;

		const secondPortalInitialTop = secondPortal.getBoundingClientRect().top;

		scrollContainer.scrollTop = 100;
		scrollContainer.dispatchEvent(new Event("scroll", { bubbles: true }));

		await waitFor(() => {
			const firstAfter = firstPortal.getBoundingClientRect().top;
			const secondAfter = secondPortal.getBoundingClientRect().top;

			expect(firstAfter).not.toBe(firstPortalInitialTop);
			expect(secondAfter).not.toBe(secondPortalInitialTop);
		});

		document.body.removeChild(scrollContainer);
	});

	test("dropdown portal should update position when textarea height changes from preview values", async () => {
		const { getByDataRole, queryAllByDataRole } = render(<DropdownWithPreviewTestComponent />);

		const textarea = getByDataRole(TEXTAREA_DATA_ROLE) as HTMLTextAreaElement;
		expect(textarea).not.toBeNull();

		await userEvent.click(textarea);

		const portals = queryAllByDataRole(DataRoles.AttachedPortal);
		expect(portals.length).toBe(1);

		await userEvent.keyboard("{ArrowDown}");
		const portal = getByDataRole(DataRoles.AttachedPortal);
		const initialTextArea = textarea?.getBoundingClientRect();
		const initialPortalRect = portal.getBoundingClientRect();

		await userEvent.keyboard("{ArrowDown}");

		const textareaAfterRect = getByDataRole(TEXTAREA_DATA_ROLE)?.getBoundingClientRect();

		await waitFor(() => {
			const portalAfterRect = getByDataRole(DataRoles.AttachedPortal).getBoundingClientRect();

			expect(textareaAfterRect?.height).not.toEqual(initialTextArea?.height);
			// expect(initialPortalRect?.top).toBeGreaterThanOrEqual(initialTextArea?.height);
			expect(portalAfterRect.top).not.toEqual(initialPortalRect.top);
			expect(portalAfterRect.top).toBeGreaterThanOrEqual(textareaAfterRect?.height);
		});
	});
});

// --- Additional interaction scenarios ---

function ExampleAttachedPortal({
	hideOnReferenceElementPositionChange,
	hasReferenceElement,
	position,
	hasSubPortal,
	title,
	hasPortal = true
}: {
	hideOnReferenceElementPositionChange?: boolean;
	hasReferenceElement?: boolean;
	position?: { top: number; left: number };
	hasSubPortal?: boolean;
	title?: string;
	hasPortal?: boolean;
}): ReactNode {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);
	const [addNewElement, setAddNewElement] = useState(false);
	const [openSubPortal, setOpenSubPortal] = useState(false);
	const buttonSubPortalRef = useRef<HTMLButtonElement | null>(null);

	const getSubButtonRef = (ref: HTMLButtonElement): void => {
		buttonSubPortalRef.current = ref;
	};

	const getButtonRef = (ref: HTMLButtonElement): void => {
		buttonRef.current = ref;
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
		if (event.key === "Enter" && buttonRef.current) {
			buttonRef.current.style.position = "absolute";
			buttonRef.current.style.top = "200px";
			buttonRef.current.style.left = "200px";
		}
	};

	return (
		<InteractionHintConfigProvider enableInteractionHint>
			<Button dataRole="trigger-change-position" onClick={() => setAddNewElement((prevState) => !prevState)}>
				Change Position
			</Button>
			{addNewElement && <div style={{ height: "100px", width: "100px", backgroundColor: "pink" }} />}
			<Button
				buttonRef={getButtonRef}
				dataRole="trigger-button"
				title={title}
				onClick={() => setShow((prevState) => !prevState)}
				onKeyDown={handleKeyDown}
			>
				Trigger Button
			</Button>
			{buttonRef.current && show && hasPortal && (
				<AttachedPortal
					hideOnReferenceElementPositionChange={hideOnReferenceElementPositionChange}
					onVisibilityChange={setShow}
					referenceElement={hasReferenceElement ? buttonRef.current : undefined}
					position={position}
				>
					<div style={{ height: "500px", width: "500px", backgroundColor: "green" }} data-role="portal-element" />
					{hasSubPortal && !openSubPortal && (
						<Button
							dataRole="sub-menu-button"
							buttonRef={getSubButtonRef}
							onClick={() => setOpenSubPortal((prevState) => !prevState)}
						>
							Open sub portal
						</Button>
					)}
				</AttachedPortal>
			)}
			{hasSubPortal && buttonSubPortalRef.current && openSubPortal && (
				<AttachedPortal onVisibilityChange={setShow} position={{ top: 0, left: 0 }}>
					<div style={{ height: "300px", width: "300px", backgroundColor: "pink" }} />
				</AttachedPortal>
			)}
		</InteractionHintConfigProvider>
	);
}

describe("AttachedPortal interaction behavior", () => {
	describe("has given position", () => {
		test("should not close when open another portal and it covers the trigger element", async () => {
			const { getByDataRole } = render(<ExampleAttachedPortal hasSubPortal position={{ top: 100, left: 100 }} />);

			await userEvent.click(getByDataRole("trigger-button") as HTMLElement);

			const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
			expect(attachedPortal).toBeVisible();

			await userEvent.click(getByDataRole("sub-menu-button") as HTMLElement);
			expect(attachedPortal).toBeVisible();
		});
	});

	describe("has referenceElement", () => {
		test("should not close when open another portal and it covers the trigger element", async () => {
			const { getByDataRole } = render(<ExampleAttachedPortal hasSubPortal hasReferenceElement />);

			await userEvent.click(getByDataRole("trigger-button") as HTMLElement);

			const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
			expect(attachedPortal).toBeVisible();

			await userEvent.click(getByDataRole("sub-menu-button") as HTMLElement);
			expect(attachedPortal).toBeVisible();
		});
	});

	test("should close if the trigger element's position changes and hideOnReferenceElementPositionChange is set to true", async () => {
		const { getByDataRole } = render(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange hasReferenceElement />
		);

		await userEvent.click(getByDataRole("trigger-button") as HTMLElement);
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
		expect(attachedPortal).toBeVisible();

		await userEvent.click(getByDataRole("trigger-change-position") as HTMLElement);
		await waitFor(() => {
			expect(attachedPortal).not.toBeVisible();
		});
	});

	test("should not close if the trigger element's position changes and hideOnReferenceElementPositionChange is set to false", async () => {
		const { getByDataRole } = render(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={false} hasReferenceElement />
		);

		await userEvent.click(getByDataRole("trigger-button") as HTMLElement);
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
		expect(attachedPortal).toBeVisible();

		const boundingBox = attachedPortal.getBoundingClientRect();

		await userEvent.click(getByDataRole("trigger-change-position") as HTMLElement);

		await waitFor(
			() => {
				const boundingBoxAfter = attachedPortal.getBoundingClientRect();
				expect(boundingBoxAfter.top).not.toEqual(boundingBox.top);
				expect(boundingBoxAfter.left).not.toEqual(boundingBox.left);
			},
			{ timeout: 2000 }
		);

		expect(attachedPortal).toBeVisible();
	});

	test("should display the portal at the specified position", async () => {
		const { getByDataRole } = render(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={false} position={{ top: 100, left: 100 }} />
		);

		await userEvent.click(getByDataRole("trigger-button") as HTMLElement);
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
		expect(attachedPortal).toBeVisible();

		const boundingBox = attachedPortal.getBoundingClientRect();
		expect(boundingBox.top).toEqual(100);
		expect(boundingBox.left).toEqual(100);
	});

	test("should update the position of portal when the trigger element changes the position", async () => {
		const { getByDataRole } = render(<ExampleAttachedPortal hasReferenceElement title="Interaction Hint" />);

		const triggerElement = getByDataRole("trigger-button") as HTMLElement;
		triggerElement.focus();

		const interactionHint = await waitFor(() => getByDataRole(DataRoles.InteractionHint) as HTMLElement);
		expect(interactionHint).toBeVisible();

		await userEvent.click(triggerElement);
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal) as HTMLElement;
		expect(attachedPortal).toBeVisible();

		await waitFor(() => {
			expect(interactionHint).not.toBeVisible();
		});

		const attachedPortalRect = attachedPortal.getBoundingClientRect();

		await userEvent.click(getByDataRole("trigger-change-position") as HTMLElement);

		await waitFor(
			() => {
				const rectAfter = attachedPortal.getBoundingClientRect();
				expect(rectAfter.top).not.toEqual(attachedPortalRect.top);
				expect(rectAfter.left).not.toEqual(attachedPortalRect.left);
			},
			{ timeout: 3000 }
		);

		expect(attachedPortal).toBeVisible();
	});
});
