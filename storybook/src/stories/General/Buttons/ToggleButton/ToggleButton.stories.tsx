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
import { useState } from "react";
import { fn } from "storybook/test";

import { Toggle, Icon, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Toggle> = {
	title: "General/Buttons/ToggleButton",
	component: Toggle,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		value: {
			control: "text",
			description: "Value of the currently selected `Toggle.Item`"
		},
		label: {
			control: "text",
			description: "Title label of the widget"
		},
		disabled: {
			control: "boolean",
			description: "Render the whole toggle disabled"
		},
		readOnly: {
			control: "boolean",
			description: "Render the whole toggle read-only"
		},
		block: {
			control: "boolean",
			description: "Make the toggle items fit the parent's width and height"
		},
		showOnlySelectedOption: {
			control: "boolean",
			description: "Only display the selected item while the toggle is not hovered (requires `value`)"
		},
		onValueChanged: {
			description: "Called with the new and old value when the selection changes"
		}
	},
	args: {
		onValueChanged: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		value: "off"
	},
	render: (args) => (
		<Toggle {...args}>
			<Toggle.Item value="off">Off</Toggle.Item>
			<Toggle.Item value="on">On</Toggle.Item>
		</Toggle>
	)
};

export const WithIcon: Story = {
	render: function WithIconExample() {
		const [value, setValue] = useState<string>("on");

		return (
			<Toggle value={value} onValueChanged={(v: string) => setValue(v)}>
				<Toggle.Item value="off">
					<Icon>favorite_border</Icon>
				</Toggle.Item>
				<Toggle.Item value="on">
					<Icon>favorite</Icon>
				</Toggle.Item>
			</Toggle>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`Toggle.Item` accepts arbitrary children, so items can render an `Icon` instead of text."
			}
		}
	}
};

export const DisabledAndReadOnly: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<Toggle label="Disabled" value="off" disabled>
				<Toggle.Item value="off">Off</Toggle.Item>
				<Toggle.Item value="on">On</Toggle.Item>
			</Toggle>
			<Toggle label="Read-only" value="off" readOnly>
				<Toggle.Item value="off">Off</Toggle.Item>
				<Toggle.Item value="on">On</Toggle.Item>
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` and `readOnly` block interaction for the whole widget. Both props are also available on individual `Toggle.Item`s."
			}
		}
	}
};

export const ShowOnlySelectedOption: Story = {
	render: function ShowOnlySelectedOptionExample() {
		const [value, setValue] = useState<string>("visible");

		return (
			<Toggle showOnlySelectedOption value={value} onValueChanged={(v: string) => setValue(v)}>
				<Toggle.Item value="hidden" variant="status1" title="Hidden">
					<Icon>close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" variant="status2" title="Visible">
					<Icon>check</Icon>
				</Toggle.Item>
				<Toggle.Item value="starred" variant="status3" title="Starred">
					<Icon>star</Icon>
				</Toggle.Item>
			</Toggle>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"With `showOnlySelectedOption` only the selected item is displayed until the toggle is hovered. The item-level `variant` (`status1`–`status3`) colors the selected-item overlay."
			}
		}
	}
};

export const InteractionHints: Story = {
	render: function InteractionHintsExample() {
		const [defaultValue, setDefaultValue] = useState<string>("off");
		const [followCursorValue, setFollowCursorValue] = useState<string>("off");
		const [hideArrowValue, setHideArrowValue] = useState<string>("off");

		return (
			<div style={{ display: "flex", gap: "32px" }}>
				<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true } }}>
					<Toggle label="Default" value={defaultValue} onValueChanged={(v: string) => setDefaultValue(v)}>
						<Toggle.Item title="Off" value="off">
							Off
						</Toggle.Item>
						<Toggle.Item title="On" value="on">
							On
						</Toggle.Item>
					</Toggle>
				</InteractionHintConfigProvider>
				<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true, followCursor: true } }}>
					<Toggle
						label="Follow cursor"
						value={followCursorValue}
						onValueChanged={(v: string) => setFollowCursorValue(v)}
					>
						<Toggle.Item title="Off" value="off">
							Off
						</Toggle.Item>
						<Toggle.Item title="On" value="on">
							On
						</Toggle.Item>
					</Toggle>
				</InteractionHintConfigProvider>
				<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true, hideArrow: true } }}>
					<Toggle label="Hidden arrow" value={hideArrowValue} onValueChanged={(v: string) => setHideArrowValue(v)}>
						<Toggle.Item title="Off" value="off">
							Off
						</Toggle.Item>
						<Toggle.Item title="On" value="on">
							On
						</Toggle.Item>
					</Toggle>
				</InteractionHintConfigProvider>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Wrapping the toggle in an `InteractionHintConfigProvider` shows the item `title` as a hover hint. The provider config supports `followCursor` and `hideArrow`."
			}
		}
	}
};
