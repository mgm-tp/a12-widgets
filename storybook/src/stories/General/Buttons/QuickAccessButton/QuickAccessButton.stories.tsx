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

import { QuickAccessButton, Icon, Button, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const actionItems = [
	{ text: "Save", graphic: <Icon>save</Icon>, meta: <Icon>check</Icon> },
	{ text: "Save and close", graphic: <Icon>save</Icon> }
];

const meta: Meta<typeof QuickAccessButton> = {
	title: "General/Buttons/QuickAccessButton",
	component: QuickAccessButton,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		mainAction: {
			control: false,
			description: "The main action button rendered on the left side"
		},
		actionItems: {
			control: false,
			description: "Action items rendered inside the popup menu of the trigger button"
		},
		menuTriggerIcon: {
			control: false,
			description: "Overrides the icon of the popup menu trigger button"
		},
		primary: {
			control: "boolean",
			description: "Primary button styling for the menu trigger"
		},
		secondary: {
			control: "boolean",
			description: "Secondary button styling for the menu trigger"
		},
		destructive: {
			control: "boolean",
			description: "Destructive button styling for the menu trigger"
		},
		invert: {
			control: "boolean",
			description: "Inverted button styling for the menu trigger"
		},
		disabled: {
			control: "boolean",
			description: "Disables the menu trigger button"
		},
		preserveMainActionStyles: {
			control: "boolean",
			description: "If set to true, the action item keeps its main action styles"
		},
		focusOnTriggerElementAfterClose: {
			control: "boolean",
			description: "Whether focus returns to the trigger button when the popup is closed via mouse click"
		},
		onVisibilityChange: {
			control: false,
			description: "Called when the visibility of the popup changes"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		primary: true,
		mainAction: <Button label="Save" icon={<Icon>save</Icon>} primary />,
		actionItems
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
			<QuickAccessButton primary mainAction={<Button label="Primary" primary />} actionItems={actionItems} />
			<QuickAccessButton secondary mainAction={<Button label="Secondary" secondary />} actionItems={actionItems} />
			<QuickAccessButton
				destructive
				mainAction={<Button label="Destructive" destructive />}
				actionItems={actionItems}
			/>
			<QuickAccessButton disabled mainAction={<Button label="Disabled" disabled />} actionItems={actionItems} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The boolean variant props `primary`, `secondary`, `destructive` and `disabled` style the menu trigger button. Pass a matching `Button` as `mainAction` so both halves share the same appearance."
			}
		}
	}
};

export const CustomTriggerIcon: Story = {
	args: {
		primary: true,
		mainAction: <Button label="Save" icon={<Icon>save</Icon>} primary />,
		actionItems,
		menuTriggerIcon: <Icon>expand_more</Icon>
	},
	parameters: {
		docs: {
			description: {
				story: "`menuTriggerIcon` overrides the default icon of the popup menu trigger button."
			}
		}
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "32px", alignItems: "flex-start", paddingBottom: "48px", flexWrap: "wrap" }}>
			<InteractionHintConfigProvider componentConfigs={{ button: true }}>
				<QuickAccessButton
					primary
					mainAction={<Button label="Default hint" icon={<Icon>save</Icon>} primary />}
					actionItems={actionItems}
				/>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, followCursor: true } }}>
				<QuickAccessButton
					primary
					mainAction={<Button label="Follow cursor" icon={<Icon>save</Icon>} primary />}
					actionItems={actionItems}
				/>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, hideArrow: true } }}>
				<QuickAccessButton
					primary
					mainAction={<Button label="No arrow" icon={<Icon>save</Icon>} primary />}
					actionItems={actionItems}
				/>
			</InteractionHintConfigProvider>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrapping the widget in an `InteractionHintConfigProvider` with `componentConfigs={{ button: ... }}` shows an interaction hint on hover. The config supports `followCursor` and `hideArrow` options."
			}
		}
	}
};
