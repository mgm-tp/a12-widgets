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

import { Toggle } from "@com.mgmtp.a12.widgets/widgets-core/lib/toggle/main/toggle.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof Toggle> = {
	title: "Widgets/General/Buttons/ToggleButton",
	component: Toggle,
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState<string>("off");

		return (
			<Toggle value={value} onValueChanged={(v: string) => setValue(v)}>
				<Toggle.Item value="off">Off</Toggle.Item>
				<Toggle.Item value="on">On</Toggle.Item>
			</Toggle>
		);
	}
};

export const WithIcon: Story = {
	render: () => {
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
	}
};

export const WithInteractionHint: Story = {
	render: () => {
		const [value, setValue] = useState<string>("off");

		return (
			<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true } }}>
				<Toggle value={value} onValueChanged={(v: string) => setValue(v)}>
					<Toggle.Item title="Off" value="off">
						Off
					</Toggle.Item>
					<Toggle.Item title="On" value="on">
						On
					</Toggle.Item>
				</Toggle>
			</InteractionHintConfigProvider>
		);
	}
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => {
		const [value, setValue] = useState<string>("off");

		return (
			<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true, followCursor: true } }}>
				<Toggle value={value} onValueChanged={(v: string) => setValue(v)}>
					<Toggle.Item title="Off" value="off">
						Off
					</Toggle.Item>
					<Toggle.Item title="On" value="on">
						On
					</Toggle.Item>
				</Toggle>
			</InteractionHintConfigProvider>
		);
	}
};

export const WithInteractionHintHideArrow: Story = {
	render: () => {
		const [value, setValue] = useState<string>("off");

		return (
			<InteractionHintConfigProvider componentConfigs={{ toggle: { enabled: true, hideArrow: true } }}>
				<Toggle value={value} onValueChanged={(v: string) => setValue(v)}>
					<Toggle.Item title="Off" value="off">
						Off
					</Toggle.Item>
					<Toggle.Item title="On" value="on">
						On
					</Toggle.Item>
				</Toggle>
			</InteractionHintConfigProvider>
		);
	}
};
