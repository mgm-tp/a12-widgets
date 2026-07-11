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

import { Accordion, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Accordion.Container> = {
	title: "Navigation/Accordion",
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
						<Typography.Body>
							Content for section 1. This is some example text to demonstrate the accordion content area.
						</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Section 2</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>
							Content for section 2. You can put any content here including forms, lists, or other components.
						</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Section 3</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>Content for section 3. The accordion can have as many sections as needed.</Typography.Body>
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
						<Typography.Body>This section is expanded by default when the accordion first renders.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Collapsed Section</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>This section starts collapsed.</Typography.Body>
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
						<Typography.Body>This accordion uses custom expand/collapse icons.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Another Section</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>Same custom icons are applied to all sections.</Typography.Body>
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
						<Typography.Body>This section is marked as selected, which changes its visual appearance.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary>Normal Section</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>This is a normal, unselected section.</Typography.Body>
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
						<Typography.Body>This section uses the info variant with a corresponding icon.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="done">Done Variant</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>This section uses the done variant.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="warning">Warning Variant</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>This section uses the warning variant.</Typography.Body>
					</Accordion.Details>
				</Accordion.Section>
				<Accordion.Section>
					<Accordion.Summary variant="error">Error Variant</Accordion.Summary>
					<Accordion.Details>
						<Typography.Body>This section uses the error variant.</Typography.Body>
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
									<Typography.Body>
										Content for section {index + 1}. This accordion is controlled programmatically.
									</Typography.Body>
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
