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

import { Counter, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";
import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/language-context.js";

const meta: Meta<typeof Counter> = {
	title: "Widgets/Data Display/Counter",
	component: Counter,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: { type: "number", min: 0, max: 10000 },
			description: "The counter value"
		},
		overflowCount: {
			control: { type: "number", min: 1, max: 9999 },
			description: "Max count to show before displaying overflow indicator"
		},
		title: {
			control: "text",
			description: "Title attribute for the counter"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 5
	}
};

export const WithHighCount: Story = {
	args: {
		value: 42
	}
};

export const WithOverflow: Story = {
	args: {
		value: 150,
		overflowCount: 99
	}
};

export const WithTitle: Story = {
	args: {
		value: 10,
		title: "10 unread messages"
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px" }}>
					<Counter value={8} title="8 new notifications" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: true,
						hideArrow: true
					}
				}}
			>
				<div style={{ padding: "50px" }}>
					<Counter value={25} title="25 items in cart" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintConstructive: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px" }}>
					<Counter value={15} title="15 completed tasks" type="constructive" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintDestructive: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px" }}>
					<Counter value={3} title="3 errors found" type="destructive" interactive />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintAndAddons: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px", display: "flex", gap: "20px", alignItems: "center" }}>
					<Counter value={10} title="10 messages" interactive addonBefore={<Icon>mail</Icon>} />
					<Counter value={5} title="5 notifications" interactive addonAfter={<Icon>notifications</Icon>} />
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const InteractionHintVariations: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: "32px", alignItems: "flex-start", padding: "50px" }}>
				<div>
					<h3>Basic Hint</h3>
					<InteractionHintConfigProvider
						enableInteractionHint={true}
						componentConfigs={{
							counter: {
								enabled: true,
								followCursor: false,
								hideArrow: false
							}
						}}
					>
						<Counter value={12} title="12 notifications" interactive />
					</InteractionHintConfigProvider>
				</div>
				<div>
					<h3>Follow Cursor</h3>
					<InteractionHintConfigProvider
						enableInteractionHint={true}
						componentConfigs={{
							counter: {
								enabled: true,
								followCursor: true,
								hideArrow: false
							}
						}}
					>
						<Counter value={7} title="7 pending items" interactive type="constructive" />
					</InteractionHintConfigProvider>
				</div>
				<div>
					<h3>No Arrow</h3>
					<InteractionHintConfigProvider
						enableInteractionHint={true}
						componentConfigs={{
							counter: {
								enabled: true,
								followCursor: false,
								hideArrow: true
							}
						}}
					>
						<Counter value={99} title="99 unread messages" interactive overflowCount={99} />
					</InteractionHintConfigProvider>
				</div>
			</div>
		</A11YLanguageContext.Provider>
	)
};

export const CounterVariations: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				counterTitles: {
					counterUnit: "items"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					counter: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Small:</span>
						<Counter value={3} />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Medium:</span>
						<Counter value={42} />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Overflow:</span>
						<Counter value={150} overflowCount={99} />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>With Hint:</span>
						<Counter value={10} title="10 active users" interactive />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Constructive:</span>
						<Counter value={8} title="8 completed" type="constructive" interactive />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Destructive:</span>
						<Counter value={2} title="2 failed" type="destructive" interactive />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>Secondary:</span>
						<Counter value={15} title="15 items" secondary interactive />
					</div>
					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<span style={{ width: "120px" }}>With Icon:</span>
						<Counter value={20} title="20 downloads" interactive addonBefore={<Icon>download</Icon>} />
					</div>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};
