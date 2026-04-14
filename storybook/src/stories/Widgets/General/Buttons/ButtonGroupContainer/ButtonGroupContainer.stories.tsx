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

import { ButtonGroupContainer, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof ButtonGroupContainer> = {
	title: "Widgets/General/Buttons/ButtonGroupContainer",
	component: ButtonGroupContainer,
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroupContainer>
			<Button label="Left" />
			<Button label="Center" />
			<Button label="Right" />
		</ButtonGroupContainer>
	)
};

export const WithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true } }}>
			<ButtonGroupContainer>
				<Button title="Left" label="Left" />
				<Button title="Center" label="Center" />
				<Button title="Right" label="Right" />
			</ButtonGroupContainer>
		</InteractionHintConfigProvider>
	)
};

export const WithInteractionHintFollowCursor: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, followCursor: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	render: () => (
		<ButtonGroupContainer>
			<Button title="Left" label="Left" />
			<Button title="Center" label="Center" />
			<Button title="Right" label="Right" />
		</ButtonGroupContainer>
	)
};

export const WithInteractionHintNoArrow: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, hideArrow: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	render: () => (
		<ButtonGroupContainer>
			<Button title="Left" label="Left" />
			<Button title="Center" label="Center" />
			<Button title="Right" label="Right" />
		</ButtonGroupContainer>
	)
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
