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

const meta: Meta<typeof QuickAccessButton> = {
	title: "General/Buttons/QuickAccessButton",
	component: QuickAccessButton,
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const mainAction = <Button label="Save" icon={<Icon>save</Icon>} primary />;

		const actionItems = [
			{ text: "Save", graphic: <Icon>save</Icon>, meta: <Icon>check</Icon> },
			{ text: "Save and close", graphic: <Icon>save</Icon> }
		];

		return <QuickAccessButton primary mainAction={mainAction} className="-u-margin-b-xs" actionItems={actionItems} />;
	}
};

export const WithInteractionHint: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ button: true }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	render: () => {
		const mainAction = <Button label="Save" icon={<Icon>save</Icon>} primary />;

		const actionItems = [
			{ text: "Save", graphic: <Icon>save</Icon>, meta: <Icon>check</Icon> },
			{ text: "Save and close", graphic: <Icon>save</Icon> }
		];

		return <QuickAccessButton primary mainAction={mainAction} className="-u-margin-b-xs" actionItems={actionItems} />;
	}
};

export const WithInteractionHintFollowCursor: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, followCursor: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	render: () => {
		const mainAction = <Button label="Save" icon={<Icon>save</Icon>} primary />;

		const actionItems = [
			{ text: "Save", graphic: <Icon>save</Icon>, meta: <Icon>check</Icon> },
			{ text: "Save and close", graphic: <Icon>save</Icon> }
		];

		return <QuickAccessButton primary mainAction={mainAction} className="-u-margin-b-xs" actionItems={actionItems} />;
	}
};

export const WithInteractionHintNoArrow: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ button: { enabled: true, hideArrow: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	render: () => {
		const mainAction = <Button label="Save" icon={<Icon>save</Icon>} primary />;

		const actionItems = [
			{ text: "Save", graphic: <Icon>save</Icon>, meta: <Icon>check</Icon> },
			{ text: "Save and close", graphic: <Icon>save</Icon> }
		];

		return <QuickAccessButton primary mainAction={mainAction} className="-u-margin-b-xs" actionItems={actionItems} />;
	}
};
