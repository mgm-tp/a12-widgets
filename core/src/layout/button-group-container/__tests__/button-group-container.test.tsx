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
import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	queryAllByDataRole,
	queryByDataRole,
	render,
	waitFor,
	within
} from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import type { ButtonProps } from "../../../button/main/button.api.js";
import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { ButtonGroupContainerProps } from "../main/button-group-container.api.js";
import { ButtonGroupContainer } from "../main/button-group-container.view.js";

const leftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ label: "Left 1" },
	{
		mainAction: <Button label="Left 2" primary id="left-2-main-action" />,
		actionItems: [
			{
				id: "left-2.1",
				text: "Left 2.1"
			},
			{
				id: "left-2.2",
				text: "Left 2.2"
			}
		],
		id: "left-2",
		primary: true
	},
	{ label: "Left 3", disabled: true }
];
const rightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ label: "Right 1" },
	{
		mainAction: <Button label="Right 2" primary id="right-2-main-action" />,
		actionItems: [
			{
				id: "right-2.1",
				text: "Right 2.1"
			},
			{
				id: "right-2.2",
				text: "Right 2.2"
			}
		],
		id: "Right-2",
		primary: true
	}
];
const leftSlotProps: ButtonGroupContainerProps.ButtonGroup = {
	className: "left",
	id: "left-id",
	style: { color: "hotpink" }
};
const rightSlotProps: ButtonGroupContainerProps.ButtonGroup = {
	className: "right",
	id: "right-id",
	style: { color: "red" }
};

describe("com.mgmtp.a12.widgets.button-group-container", () => {
	test("rendering-button-group-container", () => {
		const { container } = render(
			<ButtonGroupContainer
				leftSlotButtons={leftSlotButtons}
				leftSlotProps={leftSlotProps}
				className="test-class"
				id="test-id"
				style={{ color: "yellow" }}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-responsive-button-group-container", () => {
		const { container } = render(
			<ButtonGroupContainer
				leftSlotButtons={leftSlotButtons}
				leftSlotProps={leftSlotProps}
				rightSlotButtons={rightSlotButtons}
				rightSlotProps={rightSlotProps}
				responsive
				className="test-class"
				id="test-id"
				style={{ color: "yellow" }}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("should render list menu in popup which keeping the semantic of buttons", () => {
		const leftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
			{ title: "Disabled", icon: <Icon>block</Icon>, disabled: true, id: "icon-disabled" },
			{ title: "Active", icon: <Icon>bookmark</Icon>, active: true, id: "icon-active" },
			{ title: "Destructive", icon: <Icon>delete</Icon>, destructive: true, id: "icon-destructive" },
			{ title: "Default", icon: <Icon>home</Icon>, id: "icon-default" },
			{ label: "Disabled", secondary: true, disabled: true, id: "text-secondary-disabled" },
			{ label: "Active", secondary: true, active: true, id: "text-secondary-active" },
			{ label: "Destructive", secondary: true, destructive: true, id: "text-secondary-destructive" },
			{ label: "Default", secondary: true, id: "text-secondary" },
			{ label: "Disabled", primary: true, disabled: true, id: "text-primary-disabled" },
			{ label: "Active", primary: true, active: true, id: "text-primary-active" },
			{ label: "Destructive", primary: true, destructive: true, id: "text-primary-destructive" },
			{ label: "Default", primary: true, id: "text-primary" }
		];

		const rightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
			{
				mainAction: <Button label="Save" primary id="qa-secondary-main" />,
				actionItems: [
					{ id: "qa-secondary-1", text: "Save" },
					{ id: "qa-secondary-2", text: "Save and Close" }
				],
				id: "qa-secondary",
				primary: true
			},
			{
				mainAction: <Button label="Save" primary destructive id="qa-primary-main" />,
				actionItems: [
					{ id: "qa-primary-1", text: "Save" },
					{ id: "qa-primary-2", text: "Save and Close" }
				],
				id: "qa-primary",
				primary: true,
				destructive: true
			}
		];

		const { container } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer
					popupMenuHeaderTitle="Menu"
					responsive
					leftSlotButtons={leftSlotButtons}
					rightSlotButtons={rightSlotButtons}
					preserveSemanticStyles
				/>
			</div>
		);

		const popupTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);

		fireEvent.click(popupTrigger);

		const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
		expect(popupMenu).toMatchSnapshot();
	});

	test("should merge popupListAttributes styles with computed portal styles", async () => {
		const { getByDataRole, findByDataRole } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer
					popupMenuHeaderTitle="Menu"
					responsive
					leftSlotButtons={leftSlotButtons}
					popupListAttributes={{
						style: {
							position: "fixed",
							backgroundColor: "red",
							border: "1px solid blue"
						}
					}}
				/>
			</div>
		);

		const popupTrigger = getByDataRole(DataRoles.Popup.TriggerElement);
		await userEvent.click(popupTrigger);

		const portal = await findByDataRole(DataRoles.AttachedPortal);

		// Custom styles should be applied
		expect(portal.style.position).toBe("fixed");
		expect(portal.style.backgroundColor).toBe("red");
		expect(portal.style.border).toBe("1px solid blue");

		expect(portal.style.top).toBeDefined();
		expect(portal.style.left).toBeDefined();
		expect(portal.style.maxHeight).toBeDefined();
		expect(portal.style.maxWidth).toBeDefined();
		expect(portal.style.visibility).toBeDefined();
	});
});

describe("responsive behavior (new API)", () => {
	const responsiveLeftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
		{
			label: "Hidden label",
			primary: true,
			icon: <Icon>cloud</Icon>,
			id: "left-1",
			labelHidden: true,
			title: "Left 1"
		},
		{
			mainAction: <Button label="Left 2" primary id="left-2-main-action" />,
			actionItems: [
				{ id: "left-2.1", text: "Left 2.1" },
				{ id: "left-2.2", text: "Left 2.2" }
			],
			id: "left-2",
			primary: true
		},
		{ label: "Left 3", primary: true, disabled: true, id: "left-3" }
	];

	const responsiveRightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
		{
			label: "Right 1",
			primary: true,
			destructive: true,
			icon: <Icon>delete</Icon>,
			id: "right-1"
		},
		{
			mainAction: <Button label="Right 2" primary destructive id="right-2-main-action" />,
			actionItems: [
				{ id: "right-2.1", text: "Right 2.1" },
				{ id: "right-2.2", text: "Right 2.2" }
			],
			id: "right-2",
			primary: true,
			destructive: true
		}
	];

	test("collapses buttons into popup menu in narrow container", () => {
		const { container } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer
					responsive
					leftSlotButtons={responsiveLeftSlotButtons}
					rightSlotButtons={responsiveRightSlotButtons}
					popupMenuHeaderTitle="Menu"
				/>
			</div>
		);

		const popupTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
		fireEvent.click(popupTrigger);

		const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
		const listItems = getAllByDataRole(popupMenu, DataRoles.List.Item.Content);
		// Hidden label, Left 2.1, Left 2.2, Left 3, Right 1, Right 2.1, Right 2.2
		expect(listItems).toHaveLength(7);
	});

	test("collapses buttons right-to-left into popup menu in narrow container", () => {
		const { container } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer
					responsive
					leftSlotButtons={responsiveLeftSlotButtons}
					rightSlotButtons={responsiveRightSlotButtons}
					popupMenuHeaderTitle="Menu"
					collapsingDirection="right-to-left"
				/>
			</div>
		);

		const popupTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
		fireEvent.click(popupTrigger);

		const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
		const listItems = getAllByDataRole(popupMenu, DataRoles.List.Item.Content);
		expect(listItems).toHaveLength(7);
		expect(within(popupMenu).getByText("Left 2.1")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Left 2.2")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Left 3")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Right 1")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Right 2.1")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Right 2.2")).toBeInTheDocument();
	});
});

describe("responsive behavior (legacy API)", () => {
	const leftSlot = [
		<Button key="delete" label="Delete" labelHidden={true} secondary icon={<Icon>delete</Icon>} />,
		<Button key="add" label="Add" labelHidden={true} secondary icon={<Icon>add</Icon>} />
	];
	const rightSlot = [
		<Button key="btn3" label="test button 3" primary />,
		<Button key="btn4" label="test button 4" secondary />
	];

	test("collapses buttons into popup menu in narrow container", () => {
		const { container } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer leftSlot={leftSlot} rightSlot={rightSlot} responsive />
			</div>
		);

		const popupTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
		fireEvent.click(popupTrigger);

		const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
		expect(within(popupMenu).getByText("Delete")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Add")).toBeInTheDocument();
		expect(within(popupMenu).getByText("test button 3")).toBeInTheDocument();
		expect(within(popupMenu).getByText("test button 4")).toBeInTheDocument();
	});

	test("collapses buttons right-to-left into popup menu in narrow container", () => {
		const { container } = render(
			<div style={{ width: "32px" }}>
				<ButtonGroupContainer
					leftSlot={leftSlot}
					rightSlot={rightSlot}
					responsive
					collapsingDirection="right-to-left"
				/>
			</div>
		);

		const popupTrigger = getByDataRole(container, DataRoles.Popup.TriggerElement);
		fireEvent.click(popupTrigger);

		const popupMenu = getByDataRole(container, DataRoles.Popup.Menu);
		expect(within(popupMenu).getByText("Delete")).toBeInTheDocument();
		expect(within(popupMenu).getByText("Add")).toBeInTheDocument();
		expect(within(popupMenu).getByText("test button 3")).toBeInTheDocument();
		expect(within(popupMenu).getByText("test button 4")).toBeInTheDocument();
	});
});

// Six default buttons need roughly 380px including gaps, so they fit at WIDE_WIDTH, partly collapse at
// PARTIAL_WIDTH and collapse completely at NARROW_WIDTH, with plenty of margin for font metric differences.
const WIDE_WIDTH = 1200;
const PARTIAL_WIDTH = 300;
const NARROW_WIDTH = 32;
const BUTTON_COUNT = 6;

function createLabels(prefix: string, count: number): string[] {
	return Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`);
}

function createButtons(prefix: string, count: number, onClick?: () => void): ButtonProps[] {
	return createLabels(prefix, count).map((label, index) => ({
		label,
		id: `${prefix.toLowerCase()}-${index + 1}`,
		onClick
	}));
}

function createSlot(prefix: string, count: number, onClick?: () => void): ReactElement[] {
	return createLabels(prefix, count).map((label) => <Button key={label} label={label} onClick={onClick} />);
}

function renderInWidth(element: ReactElement, width: number) {
	return render(<div style={{ width: `${width}px` }}>{element}</div>);
}

function getRoot(container: HTMLElement): HTMLElement {
	return getByDataRole(container, DataRoles.ButtonGroupContainer);
}

function getButtonLabels(element: HTMLElement): string[] {
	return queryAllByDataRole(element, DataRoles.Button).map((button) => button.textContent?.trim() ?? "");
}

function getVisibleLabels(container: HTMLElement): string[] {
	return getButtonLabels(getRoot(container));
}

function queryTrigger(container: HTMLElement): HTMLElement | null {
	return queryByDataRole(getRoot(container), DataRoles.Popup.TriggerElement);
}

function getTrigger(container: HTMLElement): HTMLElement {
	return getByDataRole(getRoot(container), DataRoles.Popup.TriggerElement);
}

async function openPopup(container: HTMLElement): Promise<HTMLElement> {
	await userEvent.click(getTrigger(container));

	return getByDataRole(container, DataRoles.Popup.Menu);
}

function getPopupItemLabels(popupMenu: HTMLElement): string[] {
	return getAllByDataRole(popupMenu, DataRoles.List.Item.Content).map((item) => item.textContent?.trim() ?? "");
}

function precedes(first: HTMLElement, second: HTMLElement): boolean {
	return (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function nextMacrotask(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * The container measures synchronously on mount, but its resize detector delivers the ResizeObserver's initial
 * notification asynchronously (observer callback, then a `setTimeout(0)`), which re-measures the buttons once more with
 * the popup trigger width now known. Subscribing our own observer to the same element gets us notified in the same
 * broadcast, so after two more macrotasks that deferred measurement has been applied.
 */
async function waitForInitialMeasurement(container: HTMLElement): Promise<void> {
	await new Promise<void>((resolve) => {
		const observer = new ResizeObserver(() => {
			observer.disconnect();
			resolve();
		});
		observer.observe(getRoot(container));
	});
	await nextMacrotask();
	await nextMacrotask();
}

describe("non-responsive rendering (new API)", () => {
	test("renders both slots with their group props and keeps the button order", () => {
		const { container } = render(
			<ButtonGroupContainer
				leftSlotButtons={createButtons("Left", 2)}
				rightSlotButtons={createButtons("Right", 1)}
				leftSlotProps={{ className: "left", id: "left-id", style: { color: "rgb(255, 0, 0)" } }}
				rightSlotProps={{ className: "right", id: "right-id", style: { color: "rgb(0, 128, 0)" } }}
				className="test-class"
				id="test-id"
				style={{ color: "rgb(0, 0, 255)" }}
			/>
		);

		const root = getRoot(container);
		expect(root).toHaveAttribute("id", "test-id");
		expect(root).toHaveClass("test-class");
		expect(root).toHaveStyle({ color: "rgb(0, 0, 255)" });
		expect(queryTrigger(container)).toBeNull();

		const groups = getAllByDataRole(root, DataRoles.ButtonGroup);
		expect(groups).toHaveLength(2);
		expect(groups[0]).toHaveAttribute("id", "left-id");
		expect(groups[0]).toHaveClass("left");
		expect(groups[0]).toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(getButtonLabels(groups[0])).toEqual(["Left 1", "Left 2"]);
		expect(groups[1]).toHaveAttribute("id", "right-id");
		expect(groups[1]).toHaveClass("right");
		expect(groups[1]).toHaveStyle({ color: "rgb(0, 128, 0)" });
		expect(getButtonLabels(groups[1])).toEqual(["Right 1"]);
	});

	test("renders only the groups that have buttons", () => {
		const { container } = render(
			<ButtonGroupContainer leftSlotButtons={[]} rightSlotButtons={createButtons("Right", 2)} />
		);

		const groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups).toHaveLength(1);
		expect(getButtonLabels(groups[0])).toEqual(["Right 1", "Right 2"]);
	});

	test("renders children instead of the slot groups", () => {
		const { container } = render(
			<ButtonGroupContainer leftSlotButtons={createButtons("Left", 2)}>
				<span>custom content</span>
			</ButtonGroupContainer>
		);

		const root = getRoot(container);
		expect(root).toHaveTextContent("custom content");
		expect(queryAllByDataRole(root, DataRoles.ButtonGroup)).toHaveLength(0);
		expect(getButtonLabels(root)).toEqual([]);
	});

	test("passes ids and button refs through to the rendered buttons", () => {
		const buttonRef = vi.fn();
		const { container } = render(
			<ButtonGroupContainer leftSlotButtons={[{ label: "Left 1", id: "left-button", buttonRef }]} />
		);

		const button = within(getRoot(container)).getByRole("button", { name: "Left 1" });
		expect(button).toHaveAttribute("id", "left-button");
		expect(buttonRef).toHaveBeenCalledWith(button);
	});

	test("forwards clicks to the button handlers and ignores clicks on disabled buttons", async () => {
		const onClick = vi.fn();
		const onDisabledClick = vi.fn();
		const { container } = render(
			<ButtonGroupContainer
				leftSlotButtons={[
					{ label: "Enabled", onClick },
					{ label: "Disabled", onClick: onDisabledClick, disabled: true }
				]}
			/>
		);

		const root = getRoot(container);
		await userEvent.click(within(root).getByRole("button", { name: "Enabled" }));
		expect(onClick).toHaveBeenCalledTimes(1);

		const disabledButton = within(root).getByRole("button", { name: "Disabled" });
		expect(disabledButton).toBeDisabled();
		fireEvent.click(disabledButton);
		expect(onDisabledClick).not.toHaveBeenCalled();
	});

	test("updates the rendered buttons and the container attributes after mount", () => {
		const { container, rerender } = render(
			<ButtonGroupContainer leftSlotButtons={createButtons("Left", 2)} id="first" className="one" />
		);

		expect(getRoot(container)).toHaveAttribute("id", "first");
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);

		rerender(
			<ButtonGroupContainer
				leftSlotButtons={createButtons("Changed", 1)}
				rightSlotButtons={createButtons("Right", 1)}
				id="second"
				className="two"
			/>
		);

		const root = getRoot(container);
		expect(root).toHaveAttribute("id", "second");
		expect(root).toHaveClass("two");
		expect(root).not.toHaveClass("one");
		expect(getVisibleLabels(container)).toEqual(["Changed 1", "Right 1"]);
	});
});

describe("non-responsive rendering (legacy API)", () => {
	test("renders the slot elements with their group props and keeps the order", () => {
		const { container } = render(
			<ButtonGroupContainer
				leftSlot={createSlot("Left", 2)}
				rightSlot={createSlot("Right", 1)}
				leftSlotProps={{ className: "left", id: "left-id" }}
				rightSlotProps={{ className: "right", id: "right-id" }}
				id="legacy-id"
			/>
		);

		const root = getRoot(container);
		expect(root).toHaveAttribute("id", "legacy-id");
		expect(queryTrigger(container)).toBeNull();

		const groups = getAllByDataRole(root, DataRoles.ButtonGroup);
		expect(groups).toHaveLength(2);
		expect(groups[0]).toHaveAttribute("id", "left-id");
		expect(groups[0]).toHaveClass("left");
		expect(getButtonLabels(groups[0])).toEqual(["Left 1", "Left 2"]);
		expect(groups[1]).toHaveAttribute("id", "right-id");
		expect(groups[1]).toHaveClass("right");
		expect(getButtonLabels(groups[1])).toEqual(["Right 1"]);
	});

	test("renders children instead of the slot groups", () => {
		const { container } = render(
			<ButtonGroupContainer leftSlot={createSlot("Left", 2)}>
				<span>custom content</span>
			</ButtonGroupContainer>
		);

		const root = getRoot(container);
		expect(root).toHaveTextContent("custom content");
		expect(queryAllByDataRole(root, DataRoles.ButtonGroup)).toHaveLength(0);
	});

	test("passes non-element slot entries through unchanged", () => {
		const { container } = render(<ButtonGroupContainer leftSlot={["plain text", ...createSlot("Left", 1)]} />);

		const group = getByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(group).toMatchTextContent("plain text");
		expect(getButtonLabels(group)).toEqual(["Left 1"]);
	});

	test("forwards clicks to the slot buttons and ignores clicks on disabled buttons", async () => {
		const onClick = vi.fn();
		const onDisabledClick = vi.fn();
		const { container } = render(
			<ButtonGroupContainer
				leftSlot={[
					<Button key="enabled" label="Enabled" onClick={onClick} />,
					<Button key="disabled" label="Disabled" onClick={onDisabledClick} disabled />
				]}
			/>
		);

		const root = getRoot(container);
		await userEvent.click(within(root).getByRole("button", { name: "Enabled" }));
		expect(onClick).toHaveBeenCalledTimes(1);

		const disabledButton = within(root).getByRole("button", { name: "Disabled" });
		expect(disabledButton).toBeDisabled();
		fireEvent.click(disabledButton);
		expect(onDisabledClick).not.toHaveBeenCalled();
	});

	test("updates the rendered slot buttons after mount", () => {
		const { container, rerender } = render(<ButtonGroupContainer leftSlot={createSlot("Left", 2)} />);
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);

		rerender(<ButtonGroupContainer leftSlot={createSlot("Changed", 1)} rightSlot={createSlot("Right", 1)} />);
		expect(getVisibleLabels(container)).toEqual(["Changed 1", "Right 1"]);
	});
});

describe("responsive measurement (new API)", () => {
	const originalViewport = { width: window.innerWidth, height: window.innerHeight };

	afterEach(async () => {
		await page.viewport(originalViewport.width, originalViewport.height);
	});

	test("shows every button without a popup trigger when they fit", async () => {
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				leftSlotButtons={createButtons("Left", 3)}
				rightSlotButtons={createButtons("Right", 3)}
				leftSlotProps={{ className: "left" }}
				rightSlotProps={{ className: "right" }}
			/>,
			WIDE_WIDTH
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual([...createLabels("Left", 3), ...createLabels("Right", 3)]);

		const groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups[0]).toHaveClass("left");
		expect(groups[1]).toHaveClass("right");
	});

	test("collapses the leading buttons first and keeps the trailing ones visible (left-to-right)", async () => {
		const allLabels = createLabels("Left", BUTTON_COUNT);
		const { container } = renderInWidth(
			<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", BUTTON_COUNT)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		const visibleLabels = getVisibleLabels(container);
		expect(visibleLabels.length).toBeGreaterThan(0);
		expect(visibleLabels.length).toBeLessThan(allLabels.length);
		expect(visibleLabels).toEqual(allLabels.slice(allLabels.length - visibleLabels.length));

		const trigger = getTrigger(container);
		const firstVisibleButton = within(getRoot(container)).getByRole("button", { name: visibleLabels[0] });
		expect(precedes(trigger, firstVisibleButton)).toBe(true);

		const popupMenu = await openPopup(container);
		expect(getPopupItemLabels(popupMenu)).toEqual(allLabels.slice(0, allLabels.length - visibleLabels.length));
	});

	test("collapses the trailing buttons first and keeps the leading ones visible (right-to-left)", async () => {
		const allLabels = [...createLabels("Left", 3), ...createLabels("Right", 3)];
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				collapsingDirection="right-to-left"
				leftSlotButtons={createButtons("Left", 3)}
				rightSlotButtons={createButtons("Right", 3)}
			/>,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		const visibleLabels = getVisibleLabels(container);
		expect(visibleLabels.length).toBeGreaterThan(0);
		expect(visibleLabels.length).toBeLessThan(allLabels.length);
		expect(visibleLabels).toEqual(allLabels.slice(0, visibleLabels.length));

		const trigger = getTrigger(container);
		const lastVisibleButton = within(getRoot(container)).getByRole("button", {
			name: visibleLabels[visibleLabels.length - 1]
		});
		expect(precedes(lastVisibleButton, trigger)).toBe(true);

		const popupMenu = await openPopup(container);
		expect(getPopupItemLabels(popupMenu)).toEqual(allLabels.slice(visibleLabels.length));
	});

	test("renders the popup inside the right group when only the right slot is set", async () => {
		const { container, rerender } = renderInWidth(
			<ButtonGroupContainer responsive rightSlotButtons={createButtons("Right", BUTTON_COUNT)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		let groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups).toHaveLength(1);
		let trigger = getTrigger(container);
		expect(groups[0]).toContainElement(trigger);
		expect(precedes(trigger, getAllByDataRole(groups[0], DataRoles.Button)[0])).toBe(true);

		rerender(
			<div style={{ width: `${PARTIAL_WIDTH}px` }}>
				<ButtonGroupContainer
					responsive
					collapsingDirection="right-to-left"
					rightSlotButtons={createButtons("Right", BUTTON_COUNT)}
				/>
			</div>
		);

		groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups).toHaveLength(1);
		trigger = getTrigger(container);
		expect(groups[0]).toContainElement(trigger);
		const visibleButtons = getAllByDataRole(groups[0], DataRoles.Button);
		expect(precedes(visibleButtons[visibleButtons.length - 1], trigger)).toBe(true);
	});

	test("forwards clicks from popup items to the button handlers and ignores disabled ones", async () => {
		const onClick = vi.fn();
		const onDisabledClick = vi.fn();
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				leftSlotButtons={[
					{ label: "Disabled", onClick: onDisabledClick, disabled: true },
					{ label: "Enabled", onClick }
				]}
			/>,
			NARROW_WIDTH
		);

		expect(getVisibleLabels(container)).toEqual([]);
		const popupMenu = await openPopup(container);

		fireEvent.click(within(popupMenu).getByText("Disabled"));
		expect(onDisabledClick).not.toHaveBeenCalled();

		await userEvent.click(within(popupMenu).getByText("Enabled"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("re-measures when the slot buttons change after mount", async () => {
		const { container, rerender } = renderInWidth(
			<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", 2)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);

		rerender(
			<div style={{ width: `${PARTIAL_WIDTH}px` }}>
				<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", BUTTON_COUNT)} />
			</div>
		);

		expect(getTrigger(container)).toBeInTheDocument();
		expect(getVisibleLabels(container).length).toBeLessThan(BUTTON_COUNT);

		rerender(
			<div style={{ width: `${PARTIAL_WIDTH}px` }}>
				<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", 2)} />
			</div>
		);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);
	});

	test("switches between the plain and the responsive rendering after mount", () => {
		const buttons = createButtons("Left", BUTTON_COUNT);
		const { container, rerender } = renderInWidth(<ButtonGroupContainer leftSlotButtons={buttons} />, NARROW_WIDTH);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);

		rerender(
			<div style={{ width: `${NARROW_WIDTH}px` }}>
				<ButtonGroupContainer responsive leftSlotButtons={buttons} />
			</div>
		);

		expect(getTrigger(container)).toBeInTheDocument();
		expect(getVisibleLabels(container)).toEqual([]);

		rerender(
			<div style={{ width: `${NARROW_WIDTH}px` }}>
				<ButtonGroupContainer leftSlotButtons={buttons} />
			</div>
		);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);
	});

	test("collapses and expands again when the container is resized", async () => {
		await page.viewport(WIDE_WIDTH, originalViewport.height);
		const { container } = render(
			<div style={{ width: "100%" }}>
				<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", BUTTON_COUNT)} />
			</div>
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);

		await page.viewport(PARTIAL_WIDTH, originalViewport.height);
		await waitFor(() => expect(getTrigger(container)).toBeInTheDocument());
		expect(getVisibleLabels(container).length).toBeLessThan(BUTTON_COUNT);

		await page.viewport(WIDE_WIDTH, originalViewport.height);
		await waitFor(() => expect(queryTrigger(container)).toBeNull());
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);
	});

	test("only uses the width left over by its siblings with fitVisibleContentWidth", async () => {
		const renderNextToSibling = (fitVisibleContentWidth: boolean) => (
			<div style={{ width: "600px" }}>
				<div style={{ width: "560px", height: "10px" }} />
				<ButtonGroupContainer
					responsive
					fitVisibleContentWidth={fitVisibleContentWidth}
					leftSlotButtons={createButtons("Left", BUTTON_COUNT)}
				/>
			</div>
		);

		const { container: fittingContainer } = render(renderNextToSibling(false));
		const { container: sharingContainer } = render(renderNextToSibling(true));
		await waitForInitialMeasurement(fittingContainer);
		await waitForInitialMeasurement(sharingContainer);

		expect(queryTrigger(fittingContainer)).toBeNull();
		expect(getVisibleLabels(fittingContainer)).toHaveLength(BUTTON_COUNT);

		expect(getTrigger(sharingContainer)).toBeInTheDocument();
		expect(getVisibleLabels(sharingContainer).length).toBeLessThan(BUTTON_COUNT);
	});

	test("re-measures when the parent element is resized with fitVisibleContentWidth", async () => {
		await page.viewport(WIDE_WIDTH, originalViewport.height);
		const { container } = render(
			<div style={{ width: "100%" }}>
				<div style={{ width: "200px", height: "10px" }} />
				<ButtonGroupContainer responsive fitVisibleContentWidth leftSlotButtons={createButtons("Left", BUTTON_COUNT)} />
			</div>
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);

		await page.viewport(PARTIAL_WIDTH, originalViewport.height);
		await waitFor(() => expect(getTrigger(container)).toBeInTheDocument());
		expect(getVisibleLabels(container).length).toBeLessThan(BUTTON_COUNT);

		await page.viewport(WIDE_WIDTH, originalViewport.height);
		await waitFor(() => expect(queryTrigger(container)).toBeNull());
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);
	});

	test("uses the custom popup icon for the trigger", () => {
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				leftSlotButtons={createButtons("Left", 3)}
				popupMenuIcon={<span data-testid="custom-icon">custom icon</span>}
			/>,
			NARROW_WIDTH
		);

		expect(getTrigger(container)).toContainElement(within(container).getByTestId("custom-icon"));
	});

	test("labels the popup trigger for assistive technology and toggles it while open", async () => {
		const { container } = renderInWidth(
			<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", 3)} />,
			NARROW_WIDTH
		);

		const trigger = getTrigger(container);
		expect(trigger).toHaveAttribute("title", "Open further options");
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(trigger).toHaveAttribute("aria-haspopup", "true");

		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute("title", "Close further options");
		expect(trigger).toHaveAttribute("aria-expanded", "true");
		expect(getByDataRole(container, DataRoles.Popup.Menu)).toBeInTheDocument();

		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(queryByDataRole(container, DataRoles.Popup.Menu)).toBeNull());
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(trigger).toHaveAttribute("title", "Open further options");
	});

	test("stops reacting to resizes after unmount", async () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
		await page.viewport(WIDE_WIDTH, originalViewport.height);
		const { container, unmount } = render(
			<div style={{ width: "100%" }}>
				<ButtonGroupContainer responsive leftSlotButtons={createButtons("Left", BUTTON_COUNT)} />
			</div>
		);
		await waitForInitialMeasurement(container);
		expect(getVisibleLabels(container)).toHaveLength(BUTTON_COUNT);

		unmount();
		expect(container).toBeEmptyDOMElement();

		await page.viewport(PARTIAL_WIDTH, originalViewport.height);
		// Give a resize notification that might still be delivered the chance to be processed.
		await new Promise((resolve) => requestAnimationFrame(resolve));
		await nextMacrotask();
		await nextMacrotask();

		expect(container).toBeEmptyDOMElement();
		expect(consoleError).not.toHaveBeenCalled();
		consoleError.mockRestore();
	});
});

describe("responsive measurement (legacy API)", () => {
	test("shows every button without a popup trigger when they fit", async () => {
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				leftSlot={createSlot("Left", 3)}
				rightSlot={createSlot("Right", 3)}
				leftSlotProps={{ className: "left" }}
				rightSlotProps={{ className: "right" }}
			/>,
			WIDE_WIDTH
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual([...createLabels("Left", 3), ...createLabels("Right", 3)]);

		const groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups[0]).toHaveClass("left");
		expect(groups[1]).toHaveClass("right");
	});

	test("collapses the leading buttons first and keeps the trailing ones visible (left-to-right)", async () => {
		const allLabels = createLabels("Left", BUTTON_COUNT);
		const { container } = renderInWidth(
			<ButtonGroupContainer responsive leftSlot={createSlot("Left", BUTTON_COUNT)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		const visibleLabels = getVisibleLabels(container);
		expect(visibleLabels.length).toBeGreaterThan(0);
		expect(visibleLabels.length).toBeLessThan(allLabels.length);
		expect(visibleLabels).toEqual(allLabels.slice(allLabels.length - visibleLabels.length));

		const trigger = getTrigger(container);
		const firstVisibleButton = within(getRoot(container)).getByRole("button", { name: visibleLabels[0] });
		expect(precedes(trigger, firstVisibleButton)).toBe(true);

		const popupMenu = await openPopup(container);
		expect(getButtonLabels(popupMenu)).toEqual(allLabels.slice(0, allLabels.length - visibleLabels.length));
	});

	test("collapses the trailing buttons first and keeps the leading ones visible (right-to-left)", async () => {
		const allLabels = [...createLabels("Left", 3), ...createLabels("Right", 3)];
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				collapsingDirection="right-to-left"
				leftSlot={createSlot("Left", 3)}
				rightSlot={createSlot("Right", 3)}
			/>,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		const visibleLabels = getVisibleLabels(container);
		expect(visibleLabels.length).toBeGreaterThan(0);
		expect(visibleLabels.length).toBeLessThan(allLabels.length);
		expect(visibleLabels).toEqual(allLabels.slice(0, visibleLabels.length));

		const trigger = getTrigger(container);
		const lastVisibleButton = within(getRoot(container)).getByRole("button", {
			name: visibleLabels[visibleLabels.length - 1]
		});
		expect(precedes(lastVisibleButton, trigger)).toBe(true);

		const popupMenu = await openPopup(container);
		expect(getButtonLabels(popupMenu)).toEqual(allLabels.slice(visibleLabels.length));
	});

	test("renders the popup inside the right group when only the right slot is set", async () => {
		const { container } = renderInWidth(
			<ButtonGroupContainer responsive rightSlot={createSlot("Right", BUTTON_COUNT)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		const groups = getAllByDataRole(getRoot(container), DataRoles.ButtonGroup);
		expect(groups).toHaveLength(1);
		const trigger = getTrigger(container);
		expect(groups[0]).toContainElement(trigger);
		expect(precedes(trigger, getAllByDataRole(groups[0], DataRoles.Button)[0])).toBe(true);
	});

	test("keeps the button handlers and falls back to the title for icon-only buttons in the popup", async () => {
		const onClick = vi.fn();
		const onDisabledClick = vi.fn();
		const { container } = renderInWidth(
			<ButtonGroupContainer
				responsive
				leftSlot={[
					<Button key="delete" title="Delete" labelHidden icon={<Icon>delete</Icon>} onClick={onClick} />,
					<Button key="disabled" label="Disabled" disabled onClick={onDisabledClick} />
				]}
			/>,
			NARROW_WIDTH
		);

		const popupMenu = await openPopup(container);
		const deleteButton = within(popupMenu).getByRole("button", { name: "Delete" });
		expect(deleteButton).toMatchTextContent("Delete");
		await userEvent.click(deleteButton);
		expect(onClick).toHaveBeenCalledTimes(1);

		const disabledButton = within(popupMenu).getByRole("button", { name: "Disabled" });
		expect(disabledButton).toBeDisabled();
		fireEvent.click(disabledButton);
		expect(onDisabledClick).not.toHaveBeenCalled();
	});

	test("re-measures when the slot elements change after mount", async () => {
		const { container, rerender } = renderInWidth(
			<ButtonGroupContainer responsive leftSlot={createSlot("Left", 2)} />,
			PARTIAL_WIDTH
		);
		await waitForInitialMeasurement(container);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);

		rerender(
			<div style={{ width: `${PARTIAL_WIDTH}px` }}>
				<ButtonGroupContainer responsive leftSlot={createSlot("Left", BUTTON_COUNT)} />
			</div>
		);

		expect(getTrigger(container)).toBeInTheDocument();
		expect(getVisibleLabels(container).length).toBeLessThan(BUTTON_COUNT);

		rerender(
			<div style={{ width: `${PARTIAL_WIDTH}px` }}>
				<ButtonGroupContainer responsive leftSlot={createSlot("Left", 2)} />
			</div>
		);

		expect(queryTrigger(container)).toBeNull();
		expect(getVisibleLabels(container)).toEqual(["Left 1", "Left 2"]);
	});
});
