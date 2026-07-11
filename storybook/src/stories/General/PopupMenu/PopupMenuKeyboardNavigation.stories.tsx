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
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	PopUpMenu,
	List,
	Icon,
	Typography,
	KeyboardNavigationConfigProvider
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof PopUpMenu> = {
	title: "General/PopupMenu/KeyboardNavigation",
	component: PopUpMenu,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const menuItems = (
	<List paddedLeft>
		<List.Item text="Preview" graphic={<Icon>remove_red_eye</Icon>} />
		<List.Item text="Share" graphic={<Icon>share</Icon>} />
		<List.Item text="Get Link" graphic={<Icon>link</Icon>} divider />
		<List.Item text="Remove" graphic={<Icon>delete</Icon>} />
	</List>
);

const NavContext = ({ children }: { children: ReactNode }) => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", maxWidth: "400px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable elements on this page.
		</Typography.Body>
		{children}
	</div>
);

export const DefaultMode: Story = {
	render: () => (
		<NavContext>
			<PopUpMenu>{menuItems}</PopUpMenu>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Default keyboard navigation mode.** " +
					"Tab/Shift+Tab moves focus between the trigger button and surrounding elements. " +
					"Once the menu is open, **↑ / ↓** moves focus between list items. " +
					"**Enter** or **Space** activates the focused item. " +
					"**Escape** closes the menu and returns focus to the trigger button."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ popUpMenu: "arrow-only" }}>
			<NavContext>
				<PopUpMenu>{menuItems}</PopUpMenu>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Arrow-only keyboard navigation mode** (configured via `KeyboardNavigationConfigProvider`). " +
					"While the menu is open, only **↑ / ↓** navigate between items — **Tab** skips over the open menu " +
					"and moves focus to the next focusable element outside. " +
					"**Escape** closes the menu and returns focus to the trigger button."
			}
		}
	}
};
