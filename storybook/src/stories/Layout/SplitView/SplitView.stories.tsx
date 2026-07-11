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
import { useState, useCallback } from "react";

import {
	SplitView,
	ActionContentbox,
	ContentBoxElements,
	Icon,
	Typography,
	BulletList
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SplitView> = {
	title: "Layout/SplitView",
	component: SplitView,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"],
	argTypes: {}
};

export default meta;
type Story = StoryObj<typeof meta>;

const shortText =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const longText =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export const Default: Story = {
	render: () => (
		<SplitView>
			<SplitView.Area>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Left Area" />}>
					{longText}
				</ActionContentbox>
			</SplitView.Area>
			<SplitView.Area>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
					{shortText}
				</ActionContentbox>
			</SplitView.Area>
		</SplitView>
	)
};

export const WithResizableArea: Story = {
	render: () => {
		const ResizableSplitView = () => {
			const [width, setWidth] = useState<number | undefined>(undefined);

			const handleResizeStop = useCallback((_event: MouseEvent, data: { width: number }) => {
				setWidth(data.width);
			}, []);

			return (
				<SplitView>
					<SplitView.Area
						width={width}
						resizableOptions={{ minWidth: 200, maxWidth: "60%", onResizeStop: handleResizeStop }}
					>
						<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Resizable Left Area" />}>
							<Typography.Body>Drag the right edge of this area to resize it.</Typography.Body>
							<Typography.Body>{longText}</Typography.Body>
						</ActionContentbox>
					</SplitView.Area>
					<SplitView.Area>
						<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
							{shortText}
						</ActionContentbox>
					</SplitView.Area>
				</SplitView>
			);
		};

		return <ResizableSplitView />;
	}
};

export const TogglableArea: Story = {
	render: () => {
		const TogglableSplitView = () => {
			const [showRight, setShowRight] = useState(true);
			const [width, setWidth] = useState<number | undefined>(undefined);

			const toggle = useCallback(() => setShowRight((prev) => !prev), []);

			const handleResizeStop = useCallback((_event: MouseEvent, data: { width: number }) => {
				setWidth(data.width);
			}, []);

			return (
				<SplitView>
					<SplitView.Area
						width={width}
						resizableOptions={{ minWidth: 200, maxWidth: "70%", onResizeStop: handleResizeStop }}
					>
						<ActionContentbox
							headingElements={<ContentBoxElements.Title ariaLevel={2} text="Left Area" />}
							headingButtons={
								<ContentBoxElements.HeadingActionButton
									icon={<Icon>menu</Icon>}
									onClick={toggle}
									title={showRight ? "Hide right area" : "Show right area"}
								/>
							}
						>
							{longText}
						</ActionContentbox>
					</SplitView.Area>
					{showRight && (
						<SplitView.Area>
							<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
								{shortText}
							</ActionContentbox>
						</SplitView.Area>
					)}
				</SplitView>
			);
		};

		return <TogglableSplitView />;
	}
};

export const ThreeAreas: Story = {
	render: () => (
		<SplitView>
			<SplitView.Area width={200}>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Navigation" />}>
					<BulletList.Unordered>
						<BulletList.Item>Item 1</BulletList.Item>
						<BulletList.Item>Item 2</BulletList.Item>
						<BulletList.Item>Item 3</BulletList.Item>
					</BulletList.Unordered>
				</ActionContentbox>
			</SplitView.Area>
			<SplitView.Area>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Main Content" />}>
					{longText}
				</ActionContentbox>
			</SplitView.Area>
			<SplitView.Area width={250}>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Details" />}>
					{shortText}
				</ActionContentbox>
			</SplitView.Area>
		</SplitView>
	)
};

export const WithFixedWidth: Story = {
	render: () => (
		<SplitView>
			<SplitView.Area width={280}>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Sidebar (280px)" />}>
					<Typography.Body>This area has a fixed width of 280px.</Typography.Body>
				</ActionContentbox>
			</SplitView.Area>
			<SplitView.Area>
				<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Main Area (flexible)" />}>
					<Typography.Body>This area fills the remaining space.</Typography.Body>
					<Typography.Body>{longText}</Typography.Body>
				</ActionContentbox>
			</SplitView.Area>
		</SplitView>
	)
};
