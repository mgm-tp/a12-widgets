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
	DefaultRichTextEditor,
	BoldButton,
	ItalicButton,
	UnderlineButton,
	Separator,
	BulletListButton,
	NumberListButton,
	Typography,
	KeyboardNavigationConfigProvider
} from "@com.mgmtp.a12.widgets/widgets-core";

import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";

const meta: Meta<typeof DefaultRichTextEditor> = {
	title: "Data Entry/RichTextEditor/KeyboardNavigation",
	component: DefaultRichTextEditor,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const TOOLBAR = [BoldButton, ItalicButton, UnderlineButton, Separator, BulletListButton, NumberListButton];

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
			<DefaultRichTextEditor
				id="rte-keynav-default"
				label="Notes"
				placeholder="Type your notes here..."
				staticToolbarButtons={TOOLBAR}
			/>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**RichTextEditor — default keyboard navigation.** " +
					"**Tab** moves focus into the toolbar area, then to the editor content area. " +
					"**← / →** move between toolbar buttons when the toolbar is focused. " +
					"Once the editor area is focused, typing inserts content; " +
					"standard rich-text shortcuts apply (Ctrl+B for bold, Ctrl+I for italic, etc.)."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ richTextEditor: "arrow-only" }}>
			<NavContext>
				<DefaultRichTextEditor
					id="rte-keynav-arrow-only"
					label="Notes"
					placeholder="Type your notes here..."
					staticToolbarButtons={TOOLBAR}
				/>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**RichTextEditor — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**← / →** navigate between toolbar buttons when the toolbar is focused. " +
					"**Tab** skips the entire editor and moves focus to the next focusable element outside."
			}
		}
	}
};
