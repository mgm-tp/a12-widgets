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

import { ValidationBar, Icon, Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ValidationBar> = {
	title: "Business Case/ValidationBar",
	component: ValidationBar,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["warning", "error", "info"],
			description: "Severity variant of the validation bar (defaults to `error`)"
		},
		primaryTitle: {
			control: "text",
			description: "Primary title displayed on the header"
		},
		secondaryTitle: {
			control: "text",
			description: "Secondary title displayed below the primary title"
		},
		autoFocus: {
			control: "boolean",
			description: "Focus the bar when it is mounted (defaults to `true`)"
		},
		icon: {
			control: false,
			description: "Icon shown on the header of the validation bar"
		},
		quickAccessMenu: {
			control: false,
			description: "Menu for quick access actions, rendered in the header"
		},
		pagination: {
			control: false,
			description: "Pagination indicator for stepping through validation issues"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		variant: "error",
		primaryTitle: "2 errors found",
		secondaryTitle: "Please fix all errors before submitting",
		icon: <Icon>error</Icon>,
		autoFocus: false
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<ValidationBar
				variant="error"
				primaryTitle="5 errors found"
				secondaryTitle="Correct all errors before submitting"
				icon={<Icon>error</Icon>}
				autoFocus={false}
			/>
			<ValidationBar
				variant="warning"
				primaryTitle="3 warnings found"
				secondaryTitle="Please review the highlighted fields"
				icon={<Icon>warning</Icon>}
				autoFocus={false}
			/>
			<ValidationBar
				variant="info"
				primaryTitle="2 items require attention"
				icon={<Icon>info</Icon>}
				autoFocus={false}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `variant` prop selects the severity styling: `error`, `warning` or `info`. The `secondaryTitle` is optional and renders below the `primaryTitle`."
			}
		}
	}
};

export const WithQuickAccessMenu: Story = {
	name: "With Quick Access Menu",
	args: {
		variant: "error",
		primaryTitle: "4 errors found",
		icon: <Icon>error</Icon>,
		autoFocus: false,
		quickAccessMenu: (
			<ButtonGroup>
				<Button secondary icon={<Icon>navigate_before</Icon>} title="Previous error" />
				<Button secondary icon={<Icon>navigate_next</Icon>} title="Next error" />
			</ButtonGroup>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the `quickAccessMenu` prop to add navigation controls (e.g., previous/next) directly in the validation bar header."
			}
		}
	}
};

export const WithPagination: Story = {
	name: "With Pagination",
	args: {
		variant: "warning",
		primaryTitle: "5 warnings",
		icon: <Icon>warning</Icon>,
		autoFocus: false,
		pagination: <span style={{ fontSize: 12, color: "#666" }}>1 / 5</span>
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the `pagination` prop to display an indicator showing the current position within the list of validation issues."
			}
		}
	}
};

export const WithActions: Story = {
	name: "With Actions",
	args: {
		variant: "error",
		primaryTitle: "2 errors found",
		secondaryTitle: "Please fix all errors before submitting",
		icon: <Icon>error</Icon>,
		autoFocus: false,
		children: (
			<>
				<Button label="View Details" />
				<Button label="Dismiss" />
			</>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					"Action buttons passed as `children` are rendered inside the bar and are reachable via keyboard navigation."
			}
		}
	}
};
