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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";

import {
	Button,
	Icon,
	KeyboardNavigationConfigProvider,
	List,
	PopUpMenu,
	Switch
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { PopUpMenuCloseReason } from "@com.mgmtp.a12.widgets/widgets-core";

type StoryArgs = {
	focusOnTriggerElementAfterClose: "true" | "false" | "per-reason";
	onItemClick: boolean;
	onOutsideClick: boolean;
	onEscape: boolean;
	onSpace: boolean;
	onTab: boolean;
	onCloseButton: boolean;
	onProgrammatic: boolean;
};

function getFocusOnTriggerElementAfterCloseProp(
	args: StoryArgs
): boolean | Partial<Record<PopUpMenuCloseReason, boolean>> {
	if (args.focusOnTriggerElementAfterClose === "true") {
		return true;
	}

	if (args.focusOnTriggerElementAfterClose === "false") {
		return false;
	}

	return {
		onItemClick: args.onItemClick,
		onOutsideClick: args.onOutsideClick,
		onEscape: args.onEscape,
		onSpace: args.onSpace,
		onTab: args.onTab,
		onCloseButton: args.onCloseButton,
		onProgrammatic: args.onProgrammatic
	};
}

const meta: Meta<StoryArgs> = {
	title: "General/PopupMenu/FocusOnTriggerElementAfterClose",
	parameters: { docs: { story: { height: "300px" } } },
	tags: ["autodocs"],
	argTypes: {
		focusOnTriggerElementAfterClose: {
			control: "radio",
			options: ["true", "false", "per-reason"],
			description:
				"`true` restores focus for all close reasons. `false` disables restoration for all except ESC and Space, which always restore focus. `per-reason` lets you configure each close reason individually below."
		},
		onItemClick: {
			control: "boolean",
			description: "Restore focus after closing via item click.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onOutsideClick: {
			control: "boolean",
			description: "Restore focus after closing via outside click.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onEscape: {
			control: "boolean",
			description: "Restore focus after closing via ESC key.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onSpace: {
			control: "boolean",
			description: "Restore focus after closing via Space key.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onTab: {
			control: "boolean",
			description: 'Restore focus after closing via Tab key (only fires when `keyboardNavMode="arrow-only"`).',
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onCloseButton: {
			control: "boolean",
			description: "Restore focus after closing via close button.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		},
		onProgrammatic: {
			control: "boolean",
			description: "Restore focus after programmatic close.",
			if: { arg: "focusOnTriggerElementAfterClose", eq: "per-reason" }
		}
	},
	render: (args) => {
		const closeRef = useRef<(() => void) | undefined>(undefined);
		const triggerRef = useRef<HTMLElement | null>(null);
		const [arrowOnly, setArrowOnly] = useState(true);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px" }}>
				<Switch
					id="arrow-only-toggle"
					label={`Keyboard navigation mode: ${arrowOnly ? "ARROW ONLY" : "DEFAULT"}`}
					checked={arrowOnly}
					onChange={(checked) => setArrowOnly(checked)}
					helperText='Enable "arrow-only" mode to test the onTab close reason'
				/>
				<p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
					<strong>Note:</strong> Clicking <em>Open &amp; auto-close in 2s</em> opens the popup and schedules a
					programmatic close after 2 seconds.
					<br />
					When <code>onProgrammatic = true</code>, focus returns to the trigger element after the popup auto-closes;
					<br />
					When <code>false</code>, focus is not restored.
				</p>
				<div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
					<KeyboardNavigationConfigProvider mode={arrowOnly ? "arrow-only" : "default"}>
						<PopUpMenu
							icon={<Icon>arrow_drop_down</Icon>}
							triggerElementRef={(element) => {
								triggerRef.current = element;
							}}
							focusOnTriggerElementAfterClose={getFocusOnTriggerElementAfterCloseProp(args)}
							close={(handler: () => void) => {
								closeRef.current = handler;
							}}
						>
							<List>
								<List.Item text="List item 1" />
								<List.Item text="List item 2" />
								<List.Item text="List item 3" />
							</List>
						</PopUpMenu>
					</KeyboardNavigationConfigProvider>
					<Button
						label="Open & auto-close in 2s"
						onClick={() => {
							triggerRef.current?.click();
							setTimeout(() => closeRef.current?.(), 2000);
						}}
					/>
				</div>
			</div>
		);
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PopupMenuFocusOnClose: Story = {
	args: {
		focusOnTriggerElementAfterClose: "true",
		onItemClick: true,
		onOutsideClick: true,
		onEscape: true,
		onSpace: true,
		onTab: true,
		onCloseButton: true,
		onProgrammatic: true
	}
};
