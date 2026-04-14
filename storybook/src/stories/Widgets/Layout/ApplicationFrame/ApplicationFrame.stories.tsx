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
import styled from "styled-components";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ApplicationFrame,
	ApplicationHeader,
	ContentBox,
	MessageBox,
	LayoutGrid,
	Button,
	ButtonGroup,
	MasterDetail,
	Icon,
	TabPanel,
	TabPanelTemplate,
	DataRoles,
	ActionContentbox,
	ContentBoxElements,
	List
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ApplicationFrame> = {
	title: "Widgets/Layout/ApplicationFrame",
	component: ApplicationFrame,
	parameters: {
		layout: "fullscreen"
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

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

const SidebarContent = () => (
	<ContentBox heading={<h2 style={{ marginLeft: "24px" }}>Custom Layout Sidebar</h2>}>
		<p>
			This is an example for a custom layout which always shows the last two views.
			<br />
			In desktop mode it shows the views next to each other, while in mobile mode they are displayed below each other.
		</p>
		<p>
			The sidebar is shown initially, because there is a new activity which contains a sidebar region with at least one
			view.
		</p>
		<MessageBox
			variant="warning"
			label="Switch your device to 'phone' (e.g. Ctrl + Shift + M on the page in Firefox or in the developer tools in Chrome) to see the described behavior."
		/>
	</ContentBox>
);

export const WithSidebar: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1"
		}
	},
	render: () => {
		const [subExpanded, setSubExpanded] = useState(true);

		return (
			<ApplicationFrame
				main={<AppHeader />}
				sub={<SidebarContent />}
				subExpanded={subExpanded}
				onExpansionChange={(v) => setSubExpanded(!!v)}
				useToggleButton
				content={
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 12 }}>
								<ActionContentbox headingElements={<ContentBoxElements.Title text="Custom Layout Content" />}>
									<p>
										This is an example for a custom layout which always shows the last two views.
										<br />
										In desktop mode it shows the views next to each other, while in mobile mode they are displayed below
										each other.
									</p>
								</ActionContentbox>
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				}
			/>
		);
	}
};

const AppHeader = () => (
	<ApplicationHeader leftSlots={<span style={{ cursor: "pointer", marginLeft: "8px" }}>Dev App</span>} />
);

const MasterDetailContent = () => (
	<MasterDetail
		visibleViews={[
			{
				id: "master-detail-example",
				element: (
					<ActionContentbox
						headingElements={<ContentBoxElements.Title text="Master Detail Example" />}
						footer={
							<ButtonGroup alignment="right">
								<Button label="Next" primary title="Go to next step" />
							</ButtonGroup>
						}
					>
						<p>This is an example ui component to demonstrate the configuration of the master detail layout.</p>
						<p>Currently, only the preferred width is configurable.</p>
						<p>
							If two ui components are shown then the preferred width of the view on the right hand side is taken into
							account. The other view on the left hand side takes up the remaining space.
						</p>
						<p>Some dummy text so that the content is longer than the screen and shows a scrollbar:</p>
						<List divider>
							<List.SubHeader>Europe</List.SubHeader>
							<List.Item text="Germany" secondaryText="Capital: Berlin" graphic={<Icon>flag</Icon>} />
							<List.Item text="France" secondaryText="Capital: Paris" graphic={<Icon>flag</Icon>} />
							<List.Item text="Italy" secondaryText="Capital: Rome" graphic={<Icon>flag</Icon>} />
							<List.Item text="Spain" secondaryText="Capital: Madrid" graphic={<Icon>flag</Icon>} />
							<List.Item text="Netherlands" secondaryText="Capital: Amsterdam" graphic={<Icon>flag</Icon>} />
							<List.SubHeader>Asia</List.SubHeader>
							<List.Item text="Japan" secondaryText="Capital: Tokyo" graphic={<Icon>flag</Icon>} />
							<List.Item text="South Korea" secondaryText="Capital: Seoul" graphic={<Icon>flag</Icon>} />
							<List.Item text="Vietnam" secondaryText="Capital: Hanoi" graphic={<Icon>flag</Icon>} />
							<List.Item text="Thailand" secondaryText="Capital: Bangkok" graphic={<Icon>flag</Icon>} />
							<List.Item text="India" secondaryText="Capital: New Delhi" graphic={<Icon>flag</Icon>} />
						</List>
					</ActionContentbox>
				),
				width: 12
			}
		]}
	/>
);

export const WithMasterDetailLayout: Story = {
	parameters: {
		layout: "fullscreen"
	},
	render: () => <ApplicationFrame main={<AppHeader />} content={<MasterDetailContent />} />
};

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
					<strong>disableCollapsingSub</strong> - Set this to true to hide the sidebar toggle button usually shown on
					the bottom of the sidebar
				</li>
				<li>
					<strong>initialSubExpanded</strong> - Set this to false to initially collapse the sidebar. Otherwise, it will
					be expanded initially.
				</li>
				<li>
					<strong>initialSubExpandedState</strong> - This can be used to configure the initial sub expanded state.
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

export const WithSettingsInfoPanel: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1"
		}
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
