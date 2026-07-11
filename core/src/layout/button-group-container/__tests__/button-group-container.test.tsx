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

import { render, fireEvent, getByDataRole, getAllByDataRole, within } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

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
