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

import { ButtonGroup, Button, Clearfix, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ButtonGroup> = {
	title: "General/Buttons/ButtonGroup",
	component: ButtonGroup,
	argTypes: {
		alignment: {
			control: "select",
			options: ["left", "right"],
			description: "Specify the alignment for the ButtonGroup"
		},
		vertical: {
			control: "boolean",
			description: "Specify whether the buttons are displayed vertically"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		vertical: false
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button label="One" />
			<Button label="Two" />
			<Button label="Three" />
		</ButtonGroup>
	)
};

export const Alignment: Story = {
	render: () => (
		<Clearfix>
			<ButtonGroup alignment="left">
				<Button label="Back" secondary />
			</ButtonGroup>
			<ButtonGroup alignment="right">
				<Button label="Cancel" secondary />
				<Button label="Save" primary />
			</ButtonGroup>
		</Clearfix>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`alignment` positions a group on the `left` or `right` edge of the surrounding `Clearfix`. Place right-aligned groups after left-aligned ones in the DOM so the tab order matches the visual order."
			}
		}
	}
};

export const Vertical: Story = {
	render: () => (
		<ButtonGroup vertical style={{ maxWidth: "200px" }}>
			<Button label="One" />
			<Button label="Two" />
			<Button label="Three" />
		</ButtonGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "`vertical` stacks the buttons in a column and stretches them to equal width."
			}
		}
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true } }}>
				<ButtonGroup>
					<Button title="One" label="One" />
					<Button title="Two" label="Two" />
					<Button title="Three" label="Three" />
				</ButtonGroup>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, followCursor: true } }}>
				<ButtonGroup>
					<Button title="Follows cursor" label="Follow cursor" />
					<Button title="Follows cursor" label="Follow cursor" />
				</ButtonGroup>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, hideArrow: true } }}>
				<ButtonGroup>
					<Button title="No arrow" label="No arrow" />
					<Button title="No arrow" label="No arrow" />
				</ButtonGroup>
			</InteractionHintConfigProvider>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Buttons inside a group can show interaction hints on hover via `InteractionHintConfigProvider`. The rows demonstrate the default hint, `followCursor` and `hideArrow` configurations."
			}
		}
	}
};
