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

import { Wizard, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Wizard> = {
	title: "Business Case/Wizard",
	component: Wizard,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		responsive: {
			control: "boolean",
			description: "Collapse steps into left-out steps when the children are wider than the wizard"
		},
		responsiveBehaviour: {
			control: "object",
			description:
				"Configures the responsive collapsing: `focusOnBoundary` keeps start/end steps visible, `nextStepFirst` hides upcoming steps first"
		},
		truncate: {
			control: "boolean",
			description: "Truncate long step labels — set the step `title` prop so labels stay readable"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		responsive: false,
		truncate: false
	},
	render: function PlaygroundExample(args) {
		const [selectedStep, setSelectedStep] = useState(0);

		const steps = [
			{ label: "Step 1", title: "First step" },
			{ label: "Step 2", title: "Second step" },
			{ label: "Step 3", title: "Third step" }
		];

		return (
			<Wizard {...args}>
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
		);
	}
};

export const StepStates: Story = {
	render: () => (
		<Wizard>
			<Wizard.PreviousStepButton disabled />
			<Wizard.Step
				label="Finished step"
				title="This step has been successfully completed"
				finished
				icon={<Icon>check_circle</Icon>}
			/>
			<Wizard.Step label="Selected step" title="You are currently on this step" selected icon={<Icon>edit</Icon>} />
			<Wizard.Step
				label="Warning step"
				title="This step has a warning that requires attention"
				warning
				icon={<Icon>warning</Icon>}
			/>
			<Wizard.Step
				label="Error step"
				title="This step has an error that must be resolved"
				error
				icon={<Icon>error</Icon>}
			/>
			<Wizard.Step label="Disabled step" title="This step cannot be selected yet" disabled />
			<Wizard.Step label="Upcoming step" title="This step is not yet visited" icon={<Icon>schedule</Icon>} />
			<Wizard.NextStepButton />
		</Wizard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Every visual state of `Wizard.Step`: `finished`, `selected`, `warning`, `error`, `disabled` and the plain upcoming state. Steps can carry an additional `icon`, and `title` provides a hint on mouse over."
			}
		}
	}
};

export const TruncatedLabels: Story = {
	render: function TruncatedLabelsExample() {
		const [selectedStep, setSelectedStep] = useState(1);

		const steps = [
			{ label: "Select the campaign type for your marketing initiative", title: "Select campaign type" },
			{ label: "Create the campaign with all required details and settings", title: "Create campaign" },
			{ label: "Review every setting and launch the campaign", title: "Review and launch" }
		];

		return (
			<div style={{ maxWidth: "600px" }}>
				<Wizard truncate>
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"With `truncate`, long step labels are cut off with an ellipsis. Set each step's `title` so the full text stays readable via the tooltip."
			}
		}
	}
};

export const Responsive: Story = {
	render: function ResponsiveExample() {
		const [selectedStep, setSelectedStep] = useState(2);

		const steps = [
			{ label: "Account setup", title: "Create your account and verify email" },
			{ label: "Profile information", title: "Add your profile details" },
			{ label: "Preferences", title: "Set your preferences and notifications" },
			{ label: "Security", title: "Configure security settings" },
			{ label: "Payment method", title: "Add your payment information" },
			{ label: "Confirmation", title: "Review and confirm your setup" }
		];

		return (
			<div style={{ maxWidth: "500px" }}>
				<Wizard responsive responsiveBehaviour={{ focusOnBoundary: true }}>
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"With `responsive`, steps that do not fit the available width are collapsed into a left-out (•••) step. `responsiveBehaviour` tunes the collapsing: `focusOnBoundary` keeps the first and last steps visible in addition to the current one."
			}
		}
	}
};
