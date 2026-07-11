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

import { Wizard, InteractionHintConfigProvider, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Wizard> = {
	title: "Business Case/Wizard/Interactions",
	component: Wizard,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "With Interaction Hints",
	render: () => {
		const WizardWithState = () => {
			const [selectedStep, setSelectedStep] = useState(0);

			const steps = [
				{ label: "Select campaign type", title: "Choose the type of campaign you want to create" },
				{ label: "Create campaign", title: "Enter campaign details and settings" },
				{ label: "Set budget", title: "Define your campaign budget and duration" },
				{ label: "Review and launch", title: "Review all settings before launching" }
			];

			const handlePreviousClick = () => {
				if (selectedStep > 0) {
					setSelectedStep(selectedStep - 1);
				}
			};

			const handleNextClick = () => {
				if (selectedStep < steps.length - 1) {
					setSelectedStep(selectedStep + 1);
				}
			};

			return (
				<InteractionHintConfigProvider componentConfigs={{ wizard: true }}>
					<div style={{ padding: "20px" }}>
						<Wizard>
							<Wizard.PreviousStepButton disabled={selectedStep === 0} onClick={handlePreviousClick} />
							{steps.map((step, index) => (
								<Wizard.Step
									key={index}
									label={step.label}
									title={step.title}
									selected={index === selectedStep}
									finished={index < selectedStep}
									onClick={() => setSelectedStep(index)}
								/>
							))}
							<Wizard.NextStepButton disabled={selectedStep === steps.length - 1} onClick={handleNextClick} />
						</Wizard>
						<div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}>
							<Typography.Headline level={3}>
								Step {selectedStep + 1}: {steps[selectedStep].label}
							</Typography.Headline>
							<Typography.Body>Content for {steps[selectedStep].label}</Typography.Body>
						</div>
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <WizardWithState />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Wizard with interaction hints enabled. Hover over or focus on the wizard steps and navigation buttons to see helpful tooltips explaining each step's purpose."
			}
		}
	}
};

export const ResponsiveWizard: Story = {
	name: "Responsive Wizard",
	render: () => {
		const WizardWithState = () => {
			const [selectedStep, setSelectedStep] = useState(2);

			const steps = [
				{ label: "Account setup", title: "Create your account and verify email" },
				{ label: "Profile information", title: "Add your profile details" },
				{ label: "Preferences", title: "Set your preferences and notifications" },
				{ label: "Security", title: "Configure security settings" },
				{ label: "Payment method", title: "Add your payment information" },
				{ label: "Confirmation", title: "Review and confirm your setup" }
			];

			const handlePreviousClick = () => {
				if (selectedStep > 0) {
					setSelectedStep(selectedStep - 1);
				}
			};

			const handleNextClick = () => {
				if (selectedStep < steps.length - 1) {
					setSelectedStep(selectedStep + 1);
				}
			};

			return (
				<InteractionHintConfigProvider componentConfigs={{ wizard: true }}>
					<div style={{ padding: "20px", maxWidth: "600px" }}>
						<Wizard responsive>
							<Wizard.PreviousStepButton disabled={selectedStep === 0} onClick={handlePreviousClick} />
							{steps.map((step, index) => (
								<Wizard.Step
									key={index}
									label={step.label}
									title={step.title}
									selected={index === selectedStep}
									finished={index < selectedStep}
									onClick={() => setSelectedStep(index)}
								/>
							))}
							<Wizard.NextStepButton disabled={selectedStep === steps.length - 1} onClick={handleNextClick} />
						</Wizard>
						<div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}>
							<Typography.Headline level={3}>
								Step {selectedStep + 1}: {steps[selectedStep].label}
							</Typography.Headline>
							<Typography.Body>Resize the window to see responsive behavior with interaction hints.</Typography.Body>
						</div>
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <WizardWithState />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Responsive wizard that condenses steps when space is limited. The overflow menu (•••) also displays an interaction hint when hovered."
			}
		}
	}
};

export const WithoutInteractionHints: Story = {
	name: "Without Interaction Hints",
	render: () => {
		const WizardWithState = () => {
			const [selectedStep, setSelectedStep] = useState(1);

			const steps = [
				{ label: "Step 1", title: "First step" },
				{ label: "Step 2", title: "Second step" },
				{ label: "Step 3", title: "Third step" }
			];

			return (
				<div style={{ padding: "20px" }}>
					<Wizard>
						<Wizard.PreviousStepButton
							disabled={selectedStep === 0}
							onClick={() => setSelectedStep(Math.max(0, selectedStep - 1))}
						/>
						{steps.map((step, index) => (
							<Wizard.Step
								key={index}
								label={step.label}
								title={step.title}
								selected={index === selectedStep}
								finished={index < selectedStep}
								onClick={() => setSelectedStep(index)}
							/>
						))}
						<Wizard.NextStepButton
							disabled={selectedStep === steps.length - 1}
							onClick={() => setSelectedStep(Math.min(steps.length - 1, selectedStep + 1))}
						/>
					</Wizard>
				</div>
			);
		};

		return <WizardWithState />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Wizard without the InteractionHintConfigProvider. Step titles fall back to the browser's native tooltip via the title attribute."
			}
		}
	}
};
