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

import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PopUpMenu, List, Icon, ModalOverlay, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const { Item, SubHeader } = List;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta: Meta<typeof PopUpMenu> = {
	title: "General/PopupMenu",
	component: PopUpMenu,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Disables the trigger button and prevents the menu from opening"
		},
		orientation: {
			control: "select",
			options: ["bottom-left", "bottom-right", "top-left", "top-right"],
			description: "Position of the popup relative to the trigger element"
		},
		closeOnEsc: {
			control: "boolean",
			description: "Whether pressing Escape closes the popup"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "Whether clicking outside the popup closes it"
		},
		focusOnOpen: {
			control: "boolean",
			description: "Whether focus is moved into the popup when it opens"
		}
	},
	args: {
		onVisibilityChange: fn(),
		onTriggerElementClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default — basic list of actions
// ---------------------------------------------------------------------------
export const Default: Story = {
	render: (args) => (
		<PopUpMenu {...args}>
			<List paddedLeft>
				<Item text="Preview" graphic={<Icon>remove_red_eye</Icon>} />
				<Item text="Share" graphic={<Icon>share</Icon>} />
				<Item text="Get Link" graphic={<Icon>link</Icon>} divider />
				<Item text="Remove" graphic={<Icon>delete</Icon>} />
			</List>
		</PopUpMenu>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The default trigger is a three-dot icon button. Clicking it opens a List of actions. " +
					"Press Escape or click outside to close."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// Custom icon that reacts to open/closed state
// ---------------------------------------------------------------------------
export const CustomIcon: Story = {
	render: (args) => {
		function CustomIconDemo() {
			const [active, setActive] = useState(false);

			const onVisibilityChange = useCallback((isVisible: boolean) => {
				setActive(isVisible);
				args.onVisibilityChange?.(isVisible);
			}, []);

			return (
				<PopUpMenu
					{...args}
					icon={<Icon>{active ? "arrow_drop_up" : "arrow_drop_down"}</Icon>}
					onVisibilityChange={onVisibilityChange}
				>
					<List>
						<Item text="Option A" />
						<Item text="Option B" />
						<Item text="Option C" />
					</List>
				</PopUpMenu>
			);
		}

		return <CustomIconDemo />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the `icon` prop to replace the default trigger icon. " +
					"Here the icon toggles between an up- and down-arrow using `onVisibilityChange`."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// Grouped list with sub-headers and dividers
// ---------------------------------------------------------------------------
export const GroupedList: Story = {
	render: (args) => (
		<PopUpMenu {...args}>
			<List paddedLeft>
				<SubHeader fill>File</SubHeader>
				<Item text="New" graphic={<Icon>add</Icon>} />
				<Item text="Open" graphic={<Icon>folder_open</Icon>} divider />
				<SubHeader fill>Edit</SubHeader>
				<Item text="Cut" graphic={<Icon>content_cut</Icon>} />
				<Item text="Copy" graphic={<Icon>content_copy</Icon>} />
				<Item text="Paste" graphic={<Icon>content_paste</Icon>} divider />
				<Item text="Delete" graphic={<Icon>delete</Icon>} />
			</List>
		</PopUpMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Sub-headers and dividers group related actions inside the popup list."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------
export const Disabled: Story = {
	args: {
		disabled: true
	},
	render: (args) => (
		<PopUpMenu {...args}>
			<List>
				<Item text="Option A" />
				<Item text="Option B" />
			</List>
		</PopUpMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "When `disabled` is true the trigger button is non-interactive and the menu cannot be opened."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// Custom trigger button title (accessibility)
// ---------------------------------------------------------------------------
export const CustomTriggerTitle: Story = {
	args: {
		triggerButtonTitle: "Open actions menu",
		triggerButtonCloseTitle: "Close actions menu"
	},
	render: (args) => (
		<PopUpMenu {...args}>
			<List paddedLeft>
				<Item text="Edit" graphic={<Icon>edit</Icon>} />
				<Item text="Duplicate" graphic={<Icon>content_copy</Icon>} />
				<Item text="Archive" graphic={<Icon>archive</Icon>} divider />
				<Item text="Delete" graphic={<Icon>delete</Icon>} />
			</List>
		</PopUpMenu>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Provide `triggerButtonTitle` and `triggerButtonCloseTitle` to give the trigger button " +
					"a meaningful accessible name for screen-reader users."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// A11Y: FitToParent modal opened from popup menu
// ---------------------------------------------------------------------------
export const WithFitToParentModal: Story = {
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story: "Demonstrates focus management when opening a `fitToParent` ModalOverlay from a PopupMenu item."
			}
		}
	},
	render: () => {
		const Demo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<div
					style={{
						position: "relative",
						width: "600px",
						height: "400px",
						border: "2px dashed #aaa",
						borderRadius: "4px",
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "flex-start",
						padding: "16px"
					}}
				>
					<PopUpMenu icon={<Icon>more_vert</Icon>} focusOnTriggerElementAfterClose={false}>
						<List>
							<List.Item text="Open fitToParent modal" onClick={() => setIsOpen(true)} />
						</List>
					</PopUpMenu>
					{isOpen && (
						<ModalOverlay fitToParent closeOnEsc focusBack onClose={() => setIsOpen(false)}>
							<div style={{ padding: "24px", minWidth: "280px" }}>
								<h2 style={{ margin: "0 0 12px 0" }}>FitToParent Modal</h2>
								<p style={{ margin: "0 0 24px 0" }}>
									This modal renders inline within its parent container instead of a Portal.
								</p>
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button label="Close" primary onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</div>
			);
		};

		return <Demo />;
	}
};

export const WithNormalModal: Story = {
	parameters: {
		docs: {
			description: {
				story: "Demonstrates focus management when opening a portal-based ModalOverlay from a PopupMenu item."
			}
		}
	},
	render: () => {
		const Demo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<PopUpMenu icon={<Icon>more_vert</Icon>} focusOnTriggerElementAfterClose={false}>
						<List>
							<List.Item text="Open modal" onClick={() => setIsOpen(true)} />
						</List>
					</PopUpMenu>
					{isOpen && (
						<ModalOverlay closeOnEsc focusBack onClose={() => setIsOpen(false)}>
							<div style={{ padding: "24px", minWidth: "300px" }}>
								<h2 style={{ margin: "0 0 12px 0" }}>Normal Modal</h2>
								<p style={{ margin: "0 0 24px 0" }}>This modal renders via a Portal and covers the entire viewport.</p>
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button label="Close" primary onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <Demo />;
	}
};
