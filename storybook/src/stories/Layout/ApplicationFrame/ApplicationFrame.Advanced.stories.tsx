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

import { useState } from "react";
import styled from "styled-components";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ActionContentbox,
	ApplicationFrame,
	ApplicationHeader,
	Button,
	ContentBoxElements,
	DataRoles,
	Icon,
	TabPanel,
	TabPanelTemplate
} from "@com.mgmtp.a12.widgets/widgets-core";

const MobileFooter = () => (
	<div
		style={{
			backgroundColor: "#2c2c2c",
			color: "#ffffff",
			padding: "12px 24px",
			textAlign: "center",
			fontSize: "14px"
		}}
	>
		&copy; 2026 My Company &mdash; All rights reserved
	</div>
);

const StyledTabPanel = styled(TabPanel)`
	[data-role="${DataRoles.Panel}"] {
		background: #ffffff;
	}
`;

const settingsTabs: TabPanelTemplateProps.TabProps[] = [
	{ icon: <Icon>info</Icon>, value: "information", title: "Information" },
	{ icon: <Icon>search</Icon>, value: "search", title: "Search" },
	{ icon: <Icon>settings</Icon>, value: "settings", title: "Settings" }
];

const tabContent: Record<string, React.ReactNode> = {
	information: (
		<div style={{ padding: "24px" }}>
			<h2 style={{ marginTop: 0 }}>Application Frame Settings</h2>
			<p>The Application Frame Layout can be configured in the application model using layout settings.</p>
			<p>Currently, it supports:</p>
			<ul>
				<li>
					<strong>disableCollapsingSub</strong> – Hide the sidebar toggle button on the sidebar bottom.
				</li>
				<li>
					<strong>initialSubExpanded</strong> – Set to false to initially collapse the sidebar.
				</li>
				<li>
					<strong>initialSubExpandedState</strong> – Configure the initial sub expanded state.
				</li>
			</ul>
		</div>
	),
	search: (
		<div style={{ padding: "24px" }}>
			<h2 style={{ marginTop: 0 }}>Search</h2>
			<p>Search content goes here.</p>
		</div>
	),
	settings: (
		<div style={{ padding: "24px" }}>
			<h2 style={{ marginTop: 0 }}>Settings</h2>
			<p>Settings content goes here.</p>
		</div>
	)
};

const meta: Meta<typeof ApplicationFrame> = {
	title: "Layout/ApplicationFrame/Advanced",
	component: ApplicationFrame,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		viewport: { defaultViewport: "mobile1" }
	},
	render: () => {
		const [tab, setTab] = useState<TabPanelTemplateProps.TabProps | undefined>(settingsTabs[0]);
		const [collapsed, setCollapsed] = useState(false);

		const handleSelect = (selected: TabPanelTemplateProps.TabProps) => {
			if (selected.value === tab?.value) {
				setCollapsed((v) => !v);

				return;
			}

			setTab(selected);
			setCollapsed(false);
		};

		return (
			<ApplicationFrame
				main={<ApplicationHeader leftSlots={<span>App</span>} />}
				sub={
					<StyledTabPanel
						id="app-frame-default-panel"
						orientation="vertical"
						tabs={settingsTabs}
						value={tab?.value}
						onSelect={handleSelect}
					>
						<div style={{ padding: "16px" }}>{tab ? tabContent[tab.value] : null}</div>
					</StyledTabPanel>
				}
				subExpanded={!collapsed}
				content={<div style={{ padding: "16px" }}>Main content area</div>}
				footer={<MobileFooter />}
			/>
		);
	}
};

export const WithSettingsInfoPanel: Story = {
	parameters: {
		viewport: { defaultViewport: "mobile1" }
	},
	render: () => {
		const [tab, setTab] = useState<TabPanelTemplateProps.TabProps | undefined>(settingsTabs[0]);
		const [collapsed, setCollapsed] = useState(false);
		const [maximized, setMaximized] = useState(false);

		const handleSelect = (selected: TabPanelTemplateProps.TabProps) => {
			if (selected.value === tab?.value) {
				setCollapsed((v) => !v);

				return;
			}

			setTab(selected);
			setCollapsed(false);
		};

		const handleClose = () => {
			setCollapsed(true);
		};

		return (
			<ApplicationFrame
				style={{ overflowX: "hidden" }}
				main={
					<ApplicationHeader
						leftSlots={
							<>
								<Button
									icon={<Icon>menu</Icon>}
									title={collapsed ? "Open sidebar" : "Close sidebar"}
									invert
									onClick={() => {
										if (collapsed) {
											if (!tab) {
												setTab(settingsTabs[0]);
											}

											setCollapsed(false);
										} else {
											setCollapsed(true);
										}
									}}
								/>
								<span style={{ cursor: "pointer", marginLeft: "8px" }}>mgm A12 | Dev App</span>
							</>
						}
					/>
				}
				sub={
					<StyledTabPanel
						id="app-frame-settings-panel"
						orientation="vertical"
						tabs={settingsTabs}
						value={tab?.value}
						header={
							<TabPanelTemplate.PanelHeader
								heading={tab?.title}
								suffixes={[
									<Button
										icon={<Icon>{maximized ? "fullscreen_exit" : "fullscreen"}</Icon>}
										invert
										title={maximized ? "Minimize" : "Maximize"}
										onClick={() => setMaximized((v) => !v)}
									/>,
									<Button icon={<Icon>close</Icon>} invert title="Close" onClick={handleClose} />
								]}
							/>
						}
						onSelect={handleSelect}
						onClose={handleClose}
					>
						{tab?.value ? tabContent[tab.value] : null}
					</StyledTabPanel>
				}
				subExpanded={!collapsed}
				subExpandedState={maximized ? "maximized" : "minimized"}
				disableCollapsingSub
				subResizableOptions={{ minWidth: 200, maxWidth: "60%" }}
				content={
					<ActionContentbox headingElements={<ContentBoxElements.Title text="Content" />}>
						<p>Main content area.</p>
					</ActionContentbox>
				}
				footer={<MobileFooter />}
				stickyFooter
			/>
		);
	}
};
