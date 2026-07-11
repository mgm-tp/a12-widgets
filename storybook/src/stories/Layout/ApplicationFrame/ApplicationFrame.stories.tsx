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

import {
	ActionContentbox,
	ApplicationFrame,
	ApplicationHeader,
	BulletList,
	Button,
	ButtonGroup,
	ContentBox,
	ContentBoxElements,
	Icon,
	LayoutGrid,
	List,
	MasterDetail,
	MessageBox,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ApplicationFrame> = {
	title: "Layout/ApplicationFrame",
	component: ApplicationFrame,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"],
	argTypes: {
		subExpanded: {
			control: "boolean",
			description: "Specifies whether the sub (sidebar) area is expanded or collapsed"
		},
		disableCollapsingSub: {
			control: "boolean",
			description: "Disables collapsing the sidebar on desktop devices"
		},
		stickyFooter: {
			control: "boolean",
			description: "Whether the footer should be sticky"
		},
		useToggleButton: {
			control: "boolean",
			description: "Show a toggle button on small screens to open/close the sidebar"
		},
		subExpandedState: {
			control: "select",
			options: ["minimized", "maximized"],
			description: "Controls the expanded state of the sub area (minimized or maximized)"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

const headerStyle = {
	background: "#1976d2",
	color: "white",
	padding: "0 16px",
	height: "56px",
	display: "flex",
	alignItems: "center",
	fontSize: "18px",
	fontWeight: 500
};

const sidebarStyle = {
	background: "#f5f5f5",
	borderRight: "1px solid #e0e0e0",
	padding: "16px",
	height: "100%"
};

const contentStyle = {
	padding: "24px"
};

const footerStyle = {
	background: "#f5f5f5",
	borderTop: "1px solid #e0e0e0",
	padding: "12px 24px",
	textAlign: "center" as const,
	color: "#666",
	fontSize: "12px"
};

const AppHeader = () => (
	<ApplicationHeader leftSlots={<span style={{ cursor: "pointer", marginLeft: "8px" }}>Dev App</span>} />
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

export const Default: Story = {
	render: () => (
		<ApplicationFrame
			main={<div style={headerStyle}>Application Header</div>}
			content={
				<div style={contentStyle}>
					<Typography.Headline level={2}>Main Content Area</Typography.Headline>
					<Typography.Body>This is the primary content area of the ApplicationFrame.</Typography.Body>
					<Typography.Body>The layout adapts to different screen sizes (desktop, tablet, smartphone).</Typography.Body>
				</div>
			}
			style={{ height: "100vh" }}
		/>
	)
};

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

export const WithSidebarBasic: Story = {
	render: () => {
		const [subExpanded, setSubExpanded] = useState(true);

		return (
			<ApplicationFrame
				main={
					<div style={headerStyle}>
						<span style={{ flex: 1 }}>Application with Sidebar</span>
						<Button icon={<Icon>menu</Icon>} title="Toggle Sidebar" onClick={() => setSubExpanded((prev) => !prev)} />
					</div>
				}
				sub={
					<div style={sidebarStyle}>
						<nav>
							<BulletList.Unordered type="none" style={{ margin: 0, padding: 0 }}>
								{["Dashboard", "Users", "Settings", "Reports"].map((item) => (
									<BulletList.Item key={item}>{item}</BulletList.Item>
								))}
							</BulletList.Unordered>
						</nav>
					</div>
				}
				subExpanded={subExpanded}
				onExpansionChange={(nextExpanded) => setSubExpanded(nextExpanded ?? false)}
				content={
					<div style={contentStyle}>
						<Typography.Headline level={2}>Content Area</Typography.Headline>
						<Typography.Body>The sidebar is {subExpanded ? "expanded" : "collapsed"}.</Typography.Body>
						<Typography.Body>Use the menu icon in the header to toggle the sidebar.</Typography.Body>
					</div>
				}
				style={{ height: "100vh" }}
			/>
		);
	}
};

export const WithMasterDetailLayout: Story = {
	parameters: {
		layout: "fullscreen"
	},
	render: () => <ApplicationFrame main={<AppHeader />} content={<MasterDetailContent />} />
};
export const WithFooter: Story = {
	render: () => (
		<ApplicationFrame
			main={<div style={headerStyle}>Application with Footer</div>}
			content={
				<div style={contentStyle}>
					<Typography.Headline level={2}>Content Area</Typography.Headline>
					<Typography.Body>Scroll down to see the footer.</Typography.Body>
				</div>
			}
			footer={<div style={footerStyle}>Copyright &copy; 2026 mgm technology partners GmbH</div>}
			style={{ height: "100vh" }}
		/>
	)
};
