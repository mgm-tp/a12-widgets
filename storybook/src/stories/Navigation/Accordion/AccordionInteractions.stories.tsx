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

import {
	InteractionHintConfigProvider,
	A11YLanguageContext,
	getA11yResource,
	Accordion,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Accordion.Container> = {
	title: "Navigation/Accordion/Interactions",
	component: Accordion.Container,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const accordionItems = (
	<div style={{ width: "400px" }}>
		<Accordion.Container>
			<Accordion.Section>
				<Accordion.Summary>Personal Information</Accordion.Summary>
				<Accordion.Details>
					<Typography.Body>Name, contact details, and personal preferences.</Typography.Body>
				</Accordion.Details>
			</Accordion.Section>
			<Accordion.Section>
				<Accordion.Summary>Address Details</Accordion.Summary>
				<Accordion.Details>
					<Typography.Body>Billing and shipping address information.</Typography.Body>
				</Accordion.Details>
			</Accordion.Section>
		</Accordion.Container>
	</div>
);

export const Default: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ accordion: true }}>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHint: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ accordion: true }}>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Accordion with an interaction hint that appears on hover."
			}
		}
	}
};

export const WithInteractionHintPositionRight: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider
				enableInteractionHint
				componentConfigs={{ accordion: { enabled: true, position: "right" } }}
			>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Interaction hint positioned to the right of the element."
			}
		}
	}
};

export const WithInteractionHintPositionLeft: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider
				enableInteractionHint
				componentConfigs={{ accordion: { enabled: true, position: "left" } }}
			>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Interaction hint positioned to the left of the element."
			}
		}
	}
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ accordion: true }}>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Interaction hint that follows the mouse cursor."
			}
		}
	}
};

export const WithInteractionHintHideArrow: Story = {
	render: () => (
		<A11YLanguageContext.Provider value={getA11yResource("en")}>
			<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ accordion: true }}>
				{accordionItems}
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Interaction hint shown without a directional arrow."
			}
		}
	}
};
