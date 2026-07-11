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
	ValidationBar,
	Icon,
	Button,
	Typography,
	KeyboardNavigationConfigProvider
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ValidationBar> = {
	title: "Business Case/ValidationBar/KeyboardNavigation",
	component: ValidationBar,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const NavContext = ({ children }: { children: React.ReactNode }) => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable areas on this page.
		</Typography.Body>
		{children}
	</div>
);

export const DefaultMode: Story = {
	render: () => (
		<NavContext>
			<ValidationBar
				variant="error"
				icon={<Icon>error</Icon>}
				primaryTitle="2 errors found"
				secondaryTitle="Please fix all errors before submitting"
				autoFocus={false}
			>
				<Button label="View Details" />
				<Button label="Dismiss" />
			</ValidationBar>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**ValidationBar — default keyboard navigation.** " +
					"**Tab** moves focus into the validation bar, then through each action button (View Details, Dismiss). " +
					"**Enter** / **Space** activates the focused button. " +
					"Note: `autoFocus={false}` is set so the bar does not steal focus on mount in this story."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ validationBar: "arrow-only" }}>
			<NavContext>
				<ValidationBar
					variant="error"
					icon={<Icon>error</Icon>}
					primaryTitle="2 errors found"
					secondaryTitle="Please fix all errors before submitting"
					autoFocus={false}
				>
					<Button label="View Details" />
					<Button label="Dismiss" />
				</ValidationBar>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**ValidationBar — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**← / →** navigate between the action buttons inside the bar. " +
					"**Tab** skips the entire validation bar and moves focus to the next focusable element outside."
			}
		}
	}
};
