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
import { useState, useMemo, useCallback } from "react";

import type { VisibleView, ViewWidth } from "@com.mgmtp.a12.widgets/widgets-core";
import { MasterDetail, Button, Icon, Typography, BulletList, List } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof MasterDetail> = {
	title: "Layout/MasterDetail/Advanced",
	component: MasterDetail,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const paneStyle = (color: string) => ({
	background: color,
	height: "100%",
	padding: "24px",
	display: "flex",
	flexDirection: "column" as const,
	gap: "16px"
});

export const Default: Story = {
	render: () => {
		const visibleViews: VisibleView[] = [
			{
				key: "master",
				element: (
					<div style={paneStyle("#f5f5f5")}>
						<Typography.Headline level={3} style={{ margin: 0 }}>
							Master Pane
						</Typography.Headline>
						<BulletList.Unordered>
							{["Item A", "Item B", "Item C"].map((item) => (
								<BulletList.Item key={item}>{item}</BulletList.Item>
							))}
						</BulletList.Unordered>
					</div>
				),
				width: 4 as ViewWidth
			},
			{
				key: "detail",
				element: (
					<div style={paneStyle("#ffffff")}>
						<Typography.Headline level={3} style={{ margin: 0 }}>
							Detail Pane
						</Typography.Headline>
						<Typography.Body>Select an item from the master pane to see its details here.</Typography.Body>
					</div>
				),
				width: 8 as ViewWidth
			}
		];

		return <MasterDetail title="Two-Pane Layout" visibleViews={visibleViews} style={{ height: "400px" }} />;
	}
};

const items = ["Item A", "Item B", "Item C", "Item D", "Item E"];

export const NavigationBetweenPanes: Story = {
	render: () => {
		const NavigationDemo = () => {
			const [selectedItem, setSelectedItem] = useState<string | null>(null);

			const visibleViews = useMemo<VisibleView[]>(
				() => [
					{
						key: "master",
						element: (
							<div style={paneStyle("#f5f5f5")}>
								<Typography.Headline level={3} style={{ margin: 0 }}>
									Select an Item
								</Typography.Headline>
								<List>
									{items.map((item) => (
										<List.Item
											key={item}
											text={item}
											selected={selectedItem === item}
											onClick={() => setSelectedItem(item)}
										/>
									))}
								</List>
							</div>
						),
						width: 4 as ViewWidth
					},
					{
						key: "detail",
						element: (
							<div style={paneStyle("#ffffff")}>
								{selectedItem ? (
									<>
										<Typography.Headline level={3} style={{ margin: 0 }}>
											{selectedItem}
										</Typography.Headline>
										<Typography.Body>Details for {selectedItem}.</Typography.Body>
									</>
								) : (
									<Typography.Body>Select an item from the master pane to see its details here.</Typography.Body>
								)}
							</div>
						),
						width: 8 as ViewWidth
					}
				],
				[selectedItem]
			);

			return <MasterDetail title="Navigation Between Panes" visibleViews={visibleViews} style={{ height: "400px" }} />;
		};

		return <NavigationDemo />;
	}
};

export const WithAnimation: Story = {
	render: () => {
		const AnimationDemo = () => {
			const [currentView, setCurrentView] = useState<"master" | "detail">("master");
			const [selectedItem, setSelectedItem] = useState<string | null>(null);

			const handleSelectItem = useCallback((item: string) => {
				setSelectedItem(item);
				setCurrentView("detail");
			}, []);

			const handleBack = useCallback(() => {
				setCurrentView("master");
			}, []);

			const visibleViews = useMemo<VisibleView[]>(() => {
				if (currentView === "detail" && selectedItem) {
					return [
						{
							key: "detail",
							element: (
								<div style={paneStyle("#ffffff")}>
									<Button icon={<Icon>arrow_back</Icon>} onClick={handleBack}>
										Back
									</Button>
									<Typography.Headline level={3} style={{ margin: 0 }}>
										{selectedItem}
									</Typography.Headline>
									<Typography.Body>Details for {selectedItem}. Navigate back to see all items.</Typography.Body>
								</div>
							),
							width: 12 as ViewWidth
						}
					];
				}

				return [
					{
						key: "master",
						element: (
							<div style={paneStyle("#f5f5f5")}>
								<Typography.Headline level={3} style={{ margin: 0 }}>
									All Items
								</Typography.Headline>
								<List>
									{items.map((item) => (
										<List.Item key={item} text={item} onClick={() => handleSelectItem(item)} />
									))}
								</List>
							</div>
						),
						width: 12 as ViewWidth
					}
				];
			}, [currentView, selectedItem, handleSelectItem, handleBack]);

			return <MasterDetail title="With Animation" visibleViews={visibleViews} style={{ height: "380px" }} />;
		};

		return <AnimationDemo />;
	}
};
