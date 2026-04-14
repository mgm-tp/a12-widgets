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

import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";
import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/language-context";
import { Accordion } from "@com.mgmtp.a12.widgets/widgets-core/lib/accordion/main/accordion.view";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";

const meta: Meta<typeof Accordion.Container> = {
	title: "Widgets/Navigation/Accordion",
	component: Accordion.Container,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		role: {
			control: "text",
			description: "Custom role for the accordion"
		},
		controlled: {
			control: "boolean",
			description: "Determines if the Accordion will be controlled manually"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container>
				<Accordion.Section>
					<Accordion.Summary>Section 1</Accordion.Summary>
					<Accordion.Details>
						<p>Content for section 1. This is some example text to demonstrate the accordion content area.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Section 2</Accordion.Summary>
					<Accordion.Details>
						<p>Content for section 2. You can put any content here including forms, lists, or other components.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Section 3</Accordion.Summary>
					<Accordion.Details>
						<p>Content for section 3. The accordion can have as many sections as needed.</p>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};

export const WithExpandedSection: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container>
				<Accordion.Section expanded>
					<Accordion.Summary>Expanded by Default</Accordion.Summary>
					<Accordion.Details>
						<p>This section is expanded by default when the accordion first renders.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Collapsed Section</Accordion.Summary>
					<Accordion.Details>
						<p>This section starts collapsed.</p>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};

export const WithCustomIcons: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container expandIcon={<Icon>arrow_forward</Icon>} collapseIcon={<Icon>arrow_downward</Icon>}>
				<Accordion.Section>
					<Accordion.Summary>Custom Icons</Accordion.Summary>
					<Accordion.Details>
						<p>This accordion uses custom expand/collapse icons.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Another Section</Accordion.Summary>
					<Accordion.Details>
						<p>Same custom icons are applied to all sections.</p>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};

export const SelectedSection: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container>
				<Accordion.Section selected>
					<Accordion.Summary>Selected Section</Accordion.Summary>
					<Accordion.Details>
						<p>This section is marked as selected, which changes its visual appearance.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Normal Section</Accordion.Summary>
					<Accordion.Details>
						<p>This is a normal, unselected section.</p>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};

export const WithVariants: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container>
				<Accordion.Section>
					<Accordion.Summary variant="info">Info Variant</Accordion.Summary>
					<Accordion.Details>
						<p>This section uses the info variant with a corresponding icon.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="done">Done Variant</Accordion.Summary>
					<Accordion.Details>
						<p>This section uses the done variant.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="warning">Warning Variant</Accordion.Summary>
					<Accordion.Details>
						<p>This section uses the warning variant.</p>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="error">Error Variant</Accordion.Summary>
					<Accordion.Details>
						<p>This section uses the error variant.</p>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};

export const Controlled: Story = {
	render: () => {
		const ControlledAccordion = () => {
			const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

			const toggleSection = (index: number) => {
				setExpandedSections((prev) => {
					const newSet = new Set(prev);

					if (newSet.has(index)) {
						newSet.delete(index);
					} else {
						newSet.add(index);
					}

					return newSet;
				});
			};

			return (
				<div style={{ width: "400px" }}>
					<Accordion.Container controlled>
						{[0, 1, 2].map((index) => (
							<Accordion.Section
								key={index}
								expanded={expandedSections.has(index)}
								onClick={() => toggleSection(index)}
							>
								<Accordion.Summary>Section {index + 1}</Accordion.Summary>
								<Accordion.Details>
									<p>Content for section {index + 1}. This accordion is controlled programmatically.</p>
								</Accordion.Details>
							</Accordion.Section>
						))}
					</Accordion.Container>
				</div>
			);
		};

		return <ControlledAccordion />;
	}
};

export const WithGraphicIcon: Story = {
	render: () => (
		<div style={{ width: "400px" }}>
			<Accordion.Container>
				<Accordion.Section>
					<Accordion.Summary graphic={<Icon>person</Icon>}>Personal Information</Accordion.Summary>
					<Accordion.Details>
						<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
							<div>
								<strong>Name:</strong> John Doe
							</div>
							<div>
								<strong>Email:</strong> john.doe@example.com
							</div>
							<div>
								<strong>Phone:</strong> +1 234 567 890
							</div>
						</div>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary graphic={<Icon>home</Icon>}>Address</Accordion.Summary>
					<Accordion.Details>
						<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
							<div>
								<strong>Street:</strong> 123 Main Street
							</div>
							<div>
								<strong>City:</strong> New York
							</div>
							<div>
								<strong>Country:</strong> USA
							</div>
						</div>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary graphic={<Icon>settings</Icon>}>Preferences</Accordion.Summary>
					<Accordion.Details>
						<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
							<div>
								<strong>Language:</strong> English
							</div>
							<div>
								<strong>Theme:</strong> Light
							</div>
							<div>
								<strong>Notifications:</strong> Enabled
							</div>
						</div>
					</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		</div>
	)
};
// Interaction Hint Stories
export const WithInteractionHint: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				accordionTitles: {
					close: "Close",
					open: "Open"
				}
			}}
		>
			<InteractionHintConfigProvider componentConfigs={{ accordion: true }}>
				<div style={{ width: "400px" }}>
					<Accordion.Container>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>info</Icon>}>Section with Hint</Accordion.Summary>
							<Accordion.Details>
								<p>This accordion has interaction hints enabled. Hover over sections to see hints.</p>
							</Accordion.Details>
						</Accordion.Section>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>help</Icon>}>Another Section</Accordion.Summary>
							<Accordion.Details>
								<p>All sections inherit the interaction hint configuration from the container.</p>
							</Accordion.Details>
						</Accordion.Section>
					</Accordion.Container>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintPositionRight: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				accordionTitles: {
					close: "Close",
					open: "Open"
				}
			}}
		>
			<InteractionHintConfigProvider componentConfigs={{ accordion: { enabled: true, position: "right" } }}>
				<div style={{ width: "400px" }}>
					<Accordion.Container>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>arrow_forward</Icon>}>Right Position</Accordion.Summary>
							<Accordion.Details>
								<p>Hints appear on the right side of the accordion sections.</p>
							</Accordion.Details>
						</Accordion.Section>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>east</Icon>}>Second Section</Accordion.Summary>
							<Accordion.Details>
								<p>The position setting affects all sections in the container.</p>
							</Accordion.Details>
						</Accordion.Section>
					</Accordion.Container>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintPositionLeft: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				accordionTitles: {
					close: "Close",
					open: "Open"
				}
			}}
		>
			<InteractionHintConfigProvider componentConfigs={{ accordion: { enabled: true, position: "left" } }}>
				<div style={{ width: "400px" }}>
					<Accordion.Container>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>arrow_back</Icon>}>Left Position</Accordion.Summary>
							<Accordion.Details>
								<p>Hints appear on the left side of the accordion sections.</p>
							</Accordion.Details>
						</Accordion.Section>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>west</Icon>}>Second Section</Accordion.Summary>
							<Accordion.Details>
								<p>Left positioning can be useful for right-aligned layouts.</p>
							</Accordion.Details>
						</Accordion.Section>
					</Accordion.Container>
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
				accordionTitles: {
					close: "Close",
					open: "Open"
				}
			}}
		>
			<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ accordion: true }}>
				<div style={{ width: "400px" }}>
					<Accordion.Container>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>mouse</Icon>}>Follow Cursor</Accordion.Summary>
							<Accordion.Details>
								<p>The hint follows your cursor movement. Try hovering over this section!</p>
							</Accordion.Details>
						</Accordion.Section>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>touch_app</Icon>}>Interactive</Accordion.Summary>
							<Accordion.Details>
								<p>This creates a more dynamic user experience.</p>
							</Accordion.Details>
						</Accordion.Section>
					</Accordion.Container>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintHideArrow: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				accordionTitles: {
					close: "Close",
					open: "Open"
				}
			}}
		>
			<InteractionHintConfigProvider componentConfigs={{ accordion: { enabled: true, hideArrow: true } }}>
				<div style={{ width: "400px" }}>
					<Accordion.Container>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>visibility_off</Icon>}>Hide Arrow</Accordion.Summary>
							<Accordion.Details>
								<p>The arrow pointing to the element is hidden. The hint appears without an arrow indicator.</p>
							</Accordion.Details>
						</Accordion.Section>
						<Accordion.Section>
							<Accordion.Summary graphic={<Icon>remove</Icon>}>Another Section</Accordion.Summary>
							<Accordion.Details>
								<p>This can provide a cleaner look for the interaction hint.</p>
							</Accordion.Details>
						</Accordion.Section>
					</Accordion.Container>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};
