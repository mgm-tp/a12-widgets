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
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApplicationFrame, BulletList, Button, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

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

const contentStyle = { padding: "24px" };

const footerStyle = {
	background: "#f5f5f5",
	borderTop: "1px solid #e0e0e0",
	padding: "12px 24px",
	textAlign: "center" as const,
	color: "#666",
	fontSize: "12px"
};

const meta: Meta<typeof ApplicationFrame> = {
	title: "Layout/ApplicationFrame/Full",
	component: ApplicationFrame,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ApplicationFrame
			main={<div style={headerStyle}>Application with Toolbars</div>}
			sub={
				<div style={sidebarStyle}>
					<Typography.Body style={{ fontWeight: 600 }}>Navigation</Typography.Body>
					<BulletList.Unordered type="none" style={{ margin: 0, padding: 0 }}>
						{["Home", "Explore", "Reports"].map((item) => (
							<BulletList.Item key={item}>{item}</BulletList.Item>
						))}
					</BulletList.Unordered>
				</div>
			}
			subExpanded
			content={<div style={contentStyle}>Main content area</div>}
		/>
	)
};

export const WithContentToolbar: Story = {
	render: () => (
		<ApplicationFrame
			main={<div style={headerStyle}>Application with Toolbars</div>}
			sub={
				<div style={sidebarStyle}>
					<Typography.Body style={{ fontWeight: 600 }}>Navigation</Typography.Body>
					<BulletList.Unordered type="none" style={{ margin: 0, padding: 0 }}>
						{["Home", "Explore", "Reports"].map((item) => (
							<BulletList.Item key={item}>{item}</BulletList.Item>
						))}
					</BulletList.Unordered>
				</div>
			}
			subExpanded
			subToolbar={
				<div style={{ padding: "4px 8px", background: "#e8e8e8", borderBottom: "1px solid #ccc" }}>
					<small>Sidebar toolbar</small>
				</div>
			}
			contentToolbar={
				<div
					style={{
						padding: "4px 16px",
						background: "#e3f2fd",
						borderBottom: "1px solid #90caf9",
						display: "flex",
						gap: "8px",
						alignItems: "center"
					}}
				>
					<Button secondary icon={<Icon>filter_list</Icon>} title="Filter" />
					<Button secondary icon={<Icon>sort</Icon>} title="Sort" />
					<span style={{ flex: 1 }} />
					<Button secondary icon={<Icon>search</Icon>} title="Search" />
				</div>
			}
			content={
				<div style={contentStyle}>
					<Typography.Headline level={2}>Content with Toolbars</Typography.Headline>
					<Typography.Body>Both the sidebar and the content area have dedicated toolbar slots.</Typography.Body>
				</div>
			}
			style={{ height: "100vh" }}
		/>
	)
};

export const FullLayout: Story = {
	render: () => {
		const [subExpanded, setSubExpanded] = useState(true);

		return (
			<ApplicationFrame
				main={
					<div style={headerStyle}>
						<Button icon={<Icon>menu</Icon>} title="Toggle Sidebar" onClick={() => setSubExpanded((prev) => !prev)} />
						<span style={{ marginLeft: "16px" }}>Full Application Layout</span>
					</div>
				}
				sub={
					<div style={sidebarStyle}>
						<Typography.Body style={{ fontWeight: 600, marginTop: 0 }}>Navigation</Typography.Body>
						<BulletList.Unordered type="none" style={{ margin: 0, padding: 0 }}>
							{["Dashboard", "Projects", "Team", "Analytics", "Settings"].map((item) => (
								<BulletList.Item key={item} style={{ borderBottom: "1px solid #e0e0e0" }}>
									{item}
								</BulletList.Item>
							))}
						</BulletList.Unordered>
					</div>
				}
				subExpanded={subExpanded}
				onExpansionChange={(nextExpanded) => setSubExpanded(nextExpanded ?? false)}
				contentToolbar={
					<div
						style={{
							padding: "4px 16px",
							background: "#f5f5f5",
							borderBottom: "1px solid #e0e0e0",
							display: "flex",
							gap: "8px"
						}}
					>
						<Button secondary icon={<Icon>add</Icon>} title="New" />
						<Button secondary icon={<Icon>edit</Icon>} title="Edit" />
						<Button secondary icon={<Icon>delete</Icon>} title="Delete" />
					</div>
				}
				content={
					<div style={contentStyle}>
						<Typography.Headline level={2}>Dashboard</Typography.Headline>
						<Typography.Body>Welcome to the full application layout example.</Typography.Body>
						<Typography.Body>
							This demonstrates the complete ApplicationFrame with header, sidebar, content toolbar, main content and
							footer.
						</Typography.Body>
					</div>
				}
				footer={<div style={footerStyle}>Version 1.0.0 &mdash; Copyright &copy; 2026 mgm technology partners GmbH</div>}
				style={{ height: "100vh" }}
			/>
		);
	}
};
