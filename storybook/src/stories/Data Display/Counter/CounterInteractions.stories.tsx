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
	Counter,
	Icon,
	InteractionHintConfigProvider,
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Counter> = {
	title: "Data Display/Counter/Interactions",
	component: Counter,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "With Interaction Hint",
	render: () => (
		<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), counterTitles: { counterUnit: "items" } }}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ counter: { enabled: true } }}>
				<div style={{ padding: "50px" }}>
					<Counter value={8} title="8 new notifications" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrap Counter in `InteractionHintConfigProvider` with `counter` config to show a tooltip on hover. The `title` prop provides the tooltip text; `interactive` is required."
			}
		}
	}
};

export const FollowCursor: Story = {
	name: "Follow Cursor",
	render: () => (
		<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), counterTitles: { counterUnit: "items" } }}>
			<InteractionHintConfigProvider
				enableInteractionHint
				componentConfigs={{ counter: { enabled: true, followCursor: true, hideArrow: true } }}
			>
				<div style={{ padding: "50px" }}>
					<Counter value={25} title="25 items in cart" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Set followCursor: true to have the tooltip track the mouse position. hideArrow removes the pointer arrow."
			}
		}
	}
};

export const TypeVariants: Story = {
	name: "Type Variants with Hints",
	render: () => (
		<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), counterTitles: { counterUnit: "items" } }}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ counter: { enabled: true } }}>
				<div style={{ display: "flex", gap: 32, alignItems: "center", padding: "50px" }}>
					<Counter value={15} title="15 completed tasks" type="constructive" interactive />
					<Counter value={3} title="3 errors found" type="destructive" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Interaction hints work with all Counter type variants. constructive renders in green; destructive renders in red."
			}
		}
	}
};

export const WithAddons: Story = {
	name: "With Addons and Hints",
	render: () => (
		<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), counterTitles: { counterUnit: "items" } }}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ counter: { enabled: true } }}>
				<div style={{ display: "flex", gap: 32, alignItems: "center", padding: "50px" }}>
					<Counter value={10} title="10 messages" interactive addonBefore={<Icon>mail</Icon>} />
					<Counter value={5} title="5 notifications" interactive addonAfter={<Icon>notifications</Icon>} />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Addons (addonBefore / addonAfter) and interaction hints can be combined."
			}
		}
	}
};

export const AllConfigurations: Story = {
	name: "All Configurations",
	render: () => (
		<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), counterTitles: { counterUnit: "items" } }}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ counter: { enabled: true } }}>
				<div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 20 }}>
					{[
						{ label: "Default", value: 3 },
						{ label: "Overflow", value: 150, overflowCount: 99 },
						{ label: "Constructive", value: 8, type: "constructive" as const },
						{ label: "Destructive", value: 2, type: "destructive" as const },
						{ label: "Secondary", value: 15, secondary: true },
						{ label: "With icon", value: 20, addonBefore: <Icon>download</Icon> }
					].map(({ label, ...props }) => (
						<div key={label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
							<span style={{ width: 120 }}>{label}:</span>
							<Counter title={`${props.value} items`} interactive {...props} />
						</div>
					))}
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story: "Overview of all Counter configurations with interaction hints enabled."
			}
		}
	}
};
