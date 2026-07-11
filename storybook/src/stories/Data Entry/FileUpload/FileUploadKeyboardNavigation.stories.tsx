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

import { DefaultFileUpload, Typography, KeyboardNavigationConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof DefaultFileUpload> = {
	title: "Data Entry/FileUpload/KeyboardNavigation",
	component: DefaultFileUpload,
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
			<DefaultFileUpload id="file-upload-keynav-default" label="Upload files" multiple />
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**FileUpload — default keyboard navigation.** " +
					"**Tab** moves focus into the upload area. " +
					"**Enter** / **Space** on the focused upload area opens the file picker. " +
					"Files can also be dropped via drag-and-drop."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ fileUpload: "arrow-only" }}>
			<NavContext>
				<DefaultFileUpload id="file-upload-keynav-arrow-only" label="Upload files" multiple />
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**FileUpload — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**Tab** skips the upload area and moves focus to the next focusable element outside. " +
					"Use **↑ / ↓** to navigate within the component when it has multiple interactive sub-elements."
			}
		}
	}
};
