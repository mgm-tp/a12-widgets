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

import { InteractionHintConfigProvider, Icon, Button, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Button> = {
	title: "General/Buttons/Button/Variants",
	component: Button,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Default:</span>
				<Button label="Default" />
				<Button label="Disabled" disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Primary:</span>
				<Button label="Primary" primary />
				<Button label="Disabled" primary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Secondary:</span>
				<Button label="Secondary" secondary />
				<Button label="Disabled" secondary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Destructive:</span>
				<Button label="Destructive" destructive />
				<Button label="Primary" destructive primary />
				<Button label="Disabled" destructive disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>With Icon:</span>
				<Button label="Save" icon={<Icon>save</Icon>} />
				<Button label="Save" icon={<Icon>save</Icon>} primary />
				<Button label="Delete" icon={<Icon>delete</Icon>} destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Icon Only:</span>
				<Button icon={<Icon>add</Icon>} title="Add" />
				<Button icon={<Icon>add</Icon>} title="Add" primary />
				<Button icon={<Icon>add</Icon>} title="Add" secondary />
				<Button icon={<Icon>delete</Icon>} title="Delete" destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Loading:</span>
				<Button label="Loading" loading processedPercentage={0} />
				<Button label="Loading" loading primary processedPercentage={0} />
				<Button label="65%" loading processedPercentage={65} />
			</div>
		</div>
	)
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Default:</span>
				<Button label="Default" />
				<Button label="Disabled" disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Primary:</span>
				<Button label="Primary" primary />
				<Button label="Disabled" primary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Secondary:</span>
				<Button label="Secondary" secondary />
				<Button label="Disabled" secondary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Destructive:</span>
				<Button label="Destructive" destructive />
				<Button label="Primary" destructive primary />
				<Button label="Disabled" destructive disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>With Icon:</span>
				<Button label="Save" icon={<Icon>save</Icon>} />
				<Button label="Save" icon={<Icon>save</Icon>} primary />
				<Button label="Delete" icon={<Icon>delete</Icon>} destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Icon Only:</span>
				<Button icon={<Icon>add</Icon>} title="Add" />
				<Button icon={<Icon>add</Icon>} title="Add" primary />
				<Button icon={<Icon>add</Icon>} title="Add" secondary />
				<Button icon={<Icon>delete</Icon>} title="Delete" destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Loading:</span>
				<Button label="Loading" loading processedPercentage={0} />
				<Button label="Loading" loading primary processedPercentage={0} />
				<Button label="65%" loading processedPercentage={65} />
			</div>
		</div>
	)
};

export const ButtonWithBadge: Story = {
	args: {
		label: "Messages",
		icon: <Icon>mail</Icon>,
		badge: <Badge tiny variant="error" />,
		title: "View messages"
	}
};

export const PrimaryButtonWithBadge: Story = {
	args: {
		label: "Notifications",
		icon: <Icon>notifications</Icon>,
		badge: <Badge tiny variant="warning" />,
		primary: true,
		title: "View notifications"
	}
};

export const SecondaryButtonWithBadge: Story = {
	args: {
		label: "Tasks",
		icon: <Icon>assignment</Icon>,
		badge: <Badge tiny variant="info" />,
		secondary: true,
		title: "View tasks"
	}
};

export const DestructiveButtonWithBadge: Story = {
	args: {
		label: "Alerts",
		icon: <Icon>warning</Icon>,
		badge: <Badge tiny variant="error" />,
		destructive: true,
		title: "View alerts"
	}
};

export const IconOnlyButtonWithBadge: Story = {
	args: {
		icon: <Icon>notifications</Icon>,
		badge: <Badge tiny variant="warning" />,
		title: "Notifications"
	}
};

export const IconOnlyPrimaryWithBadge: Story = {
	args: {
		icon: <Icon>mail</Icon>,
		badge: <Badge tiny variant="error" />,
		primary: true,
		title: "Messages"
	}
};

export const ButtonWithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="Hover me" title="This button has an interaction hint" />
				<Button label="Primary" primary title="Primary button with hint" />
				<Button icon={<Icon>settings</Icon>} title="Settings" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithInteractionHintFollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="Follow Cursor" title="This hint follows your cursor" />
				<Button label="Primary" primary title="Hint follows cursor" />
				<Button icon={<Icon>help</Icon>} secondary title="Help" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithInteractionHintNoArrow: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="No Arrow" title="This hint has no arrow" />
				<Button icon={<Icon>info</Icon>} title="Info button" />
				<Button label="Delete" destructive title="Delete action" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithBadgeAndInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<Button
					label="Messages"
					icon={<Icon>mail</Icon>}
					badge={<Badge tiny variant="error" />}
					title="View new messages"
				/>
				<Button
					icon={<Icon>notifications</Icon>}
					badge={<Badge tiny variant="warning" />}
					primary
					title="View notifications"
				/>
				<Button
					label="Alerts"
					icon={<Icon>warning</Icon>}
					badge={<Badge tiny variant="error" />}
					destructive
					title="View alerts"
				/>
			</div>
		</InteractionHintConfigProvider>
	)
};

export const IconButtonWithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ iconButton: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button icon={<Icon>add</Icon>} title="Add item" />
				<Button icon={<Icon>edit</Icon>} primary title="Edit" />
				<Button icon={<Icon>delete</Icon>} destructive title="Delete" />
				<Button icon={<Icon>settings</Icon>} secondary title="Settings" />
			</div>
		</InteractionHintConfigProvider>
	)
};
