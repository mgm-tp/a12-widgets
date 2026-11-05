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

import { ButtonGroupContainer, Button, Icon, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ButtonGroupContainer> = {
	title: "General/Buttons/ButtonGroupContainer",
	component: ButtonGroupContainer,
	argTypes: {
		children: {
			control: false,
			description: "Buttons rendered directly inside the container, as an alternative to the slot props"
		},
		leftSlotButtons: {
			control: false,
			description: "Buttons on the left side, given as `ButtonProps` or `QuickAccessButtonProps`"
		},
		rightSlotButtons: {
			control: false,
			description: "Buttons on the right side, given as `ButtonProps` or `QuickAccessButtonProps`"
		},
		leftSlotProps: {
			control: false,
			description: "Additional `ButtonGroup` props for the left slot"
		},
		rightSlotProps: {
			control: false,
			description: "Additional `ButtonGroup` props for the right slot"
		},
		responsive: {
			control: "boolean",
			description: "Collapses buttons into a popup menu when they do not fit into the container's width"
		},
		collapsingDirection: {
			control: "select",
			options: ["left-to-right", "right-to-left"],
			description: "Direction from which buttons are collapsed into the popup menu"
		},
		preserveSemanticStyles: {
			control: "boolean",
			description: "Preserves semantic button styles (primary, destructive, ...) inside the popup menu"
		},
		popupMenuIcon: {
			control: false,
			description: "Custom icon for the popup menu trigger"
		},
		popupMenuHeaderTitle: {
			control: "text",
			description: "Title of the popup menu header (mobile usage only)"
		},
		popupListAttributes: {
			control: false,
			description: "Additional HTML attributes applied to the popup menu's portal element"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		responsive: true,
		collapsingDirection: "left-to-right",
		preserveSemanticStyles: false,
		popupMenuIcon: <Icon>more_vert</Icon>,
		popupListAttributes: { style: { position: "fixed" } },
		leftSlotButtons: [
			{ label: "Save", icon: <Icon>save</Icon>, primary: true },
			{ label: "Edit", icon: <Icon>edit</Icon> },
			{ label: "Copy", icon: <Icon>content_copy</Icon> }
		],
		rightSlotButtons: [
			{ label: "Export", icon: <Icon>get_app</Icon> },
			{ label: "Delete", icon: <Icon>delete</Icon>, destructive: true }
		]
	},
	render: (args) => (
		<div style={{ width: "100%", maxWidth: 400 }}>
			<ButtonGroupContainer {...args} />
		</div>
	)
};

export const Default: Story = {
	render: () => (
		<ButtonGroupContainer>
			<Button label="Left" />
			<Button label="Center" />
			<Button label="Right" />
		</ButtonGroupContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "Buttons can be passed directly as `children` — the container lays them out as a single group."
			}
		}
	}
};

export const LeftAndRightSlots: Story = {
	render: () => (
		<ButtonGroupContainer
			leftSlotButtons={[{ label: "Save", primary: true }, { label: "Cancel" }]}
			rightSlotButtons={[{ label: "Help" }, { label: "Delete", destructive: true }]}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: "`leftSlotButtons` and `rightSlotButtons` position two button groups at opposite ends of the container."
			}
		}
	}
};

export const Responsive: Story = {
	render: () => (
		<div style={{ width: "300px" }}>
			<ButtonGroupContainer
				responsive={true}
				popupListAttributes={{ style: { position: "fixed" } }}
				leftSlotButtons={[
					{ label: "New", icon: <Icon>add</Icon>, primary: true },
					{ label: "Save", icon: <Icon>save</Icon> },
					{ label: "Edit", icon: <Icon>edit</Icon> },
					{ label: "Copy", icon: <Icon>content_copy</Icon> }
				]}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"With `responsive`, buttons that do not fit into the available width are collapsed into a popup menu. " +
					"The container here is constrained to 300px — click the menu trigger to see the collapsed buttons."
			}
		}
	}
};

export const CollapsingDirection: Story = {
	render: () => (
		<div style={{ width: "300px" }}>
			<ButtonGroupContainer
				responsive={true}
				collapsingDirection="right-to-left"
				popupListAttributes={{ style: { position: "fixed" } }}
				leftSlotButtons={[
					{ label: "New", icon: <Icon>add</Icon>, primary: true },
					{ label: "Save", icon: <Icon>save</Icon> },
					{ label: "Edit", icon: <Icon>edit</Icon> },
					{ label: "Copy", icon: <Icon>content_copy</Icon> }
				]}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`collapsingDirection="right-to-left"` collapses buttons from the right side into the popup menu, ' +
					"keeping the leading buttons visible instead of the trailing ones."
			}
		}
	}
};

export const InteractionHints: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true } }}>
				<ButtonGroupContainer>
					<Button title="Left" label="Left" />
					<Button title="Center" label="Center" />
					<Button title="Right" label="Right" />
				</ButtonGroupContainer>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, followCursor: true } }}>
				<ButtonGroupContainer>
					<Button title="Left" label="Left" />
					<Button title="Center" label="Center" />
					<Button title="Right" label="Right" />
				</ButtonGroupContainer>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, hideArrow: true } }}>
				<ButtonGroupContainer>
					<Button title="Left" label="Left" />
					<Button title="Center" label="Center" />
					<Button title="Right" label="Right" />
				</ButtonGroupContainer>
			</InteractionHintConfigProvider>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`InteractionHintConfigProvider` enables hover hints for the buttons inside the group (using each button's `title`). " +
					"Hover the rows to compare: default hint (top), `followCursor` (middle) and `hideArrow` (bottom)."
			}
		}
	}
};

export const WithCustomPortalPositioning: Story = {
	parameters: {
		layout: "centered",
		docs: {
			description: {
				story:
					"Demonstrates theme-based portal positioning customization. This example uses fixed positioning which is recommended for iframe environments like Storybook to ensure proper positioning. The container is constrained to force buttons into the popup menu - click the menu icon (⋮) to see the popup menu with fixed positioning."
			}
		}
	},
	render: () => {
		return (
			<div style={{ width: "350px" }}>
				<ButtonGroupContainer
					responsive={true}
					popupMenuIcon={<Icon>more_vert</Icon>}
					popupMenuHeaderTitle="Fixed Position Menu (Theme-based)"
					preserveSemanticStyles={true}
					popupListAttributes={{ style: { position: "fixed" } }}
					leftSlotButtons={[
						{ label: "New", icon: <Icon>add</Icon>, primary: true },
						{ label: "Save", icon: <Icon>save</Icon> },
						{ label: "Edit", icon: <Icon>edit</Icon> },
						{ label: "Copy", icon: <Icon>content_copy</Icon> }
					]}
					rightSlotButtons={[
						{ label: "Print", icon: <Icon>print</Icon> },
						{ label: "Export", icon: <Icon>get_app</Icon> },
						{ label: "Settings", icon: <Icon>settings</Icon> },
						{ label: "Delete", icon: <Icon>delete</Icon>, destructive: true }
					]}
				/>
			</div>
		);
	}
};
