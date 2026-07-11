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
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["warning", "error", "info"],
			description: "Visual variant of the validation bar"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "error",
		primaryTitle: "2 errors found",
		secondaryTitle: "Please fix all errors before submitting",
		icon: <Icon>error</Icon>
	}
};

export const Warning: Story = {
	args: {
		variant: "warning",
		primaryTitle: "3 warnings found",
		secondaryTitle: "Please review the highlighted fields",
		icon: <Icon>warning</Icon>
	}
};

export const ErrorVariant: Story = {
	name: "Error",
	args: {
		variant: "error",
		primaryTitle: "5 errors found",
		secondaryTitle: "Correct all errors before submitting",
		icon: <Icon>error</Icon>
	}
};

export const Info: Story = {
	args: {
		variant: "info",
		primaryTitle: "2 items require attention",
		icon: <Icon>info</Icon>
	}
};

export const WithQuickAccessMenu: Story = {
	name: "With Quick Access Menu",
	args: {
		variant: "error",
		primaryTitle: "4 errors found",
		icon: <Icon>error</Icon>,
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
					"Use the quickAccessMenu prop to add navigation controls (e.g., previous/next) directly in the validation bar header."
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
		pagination: <span style={{ fontSize: 12, color: "#666" }}>1 / 5</span>
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the pagination prop to display an indicator showing the current position within the list of validation issues."
			}
		}
	}
};
