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

import { Card, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Card> = {
	title: "Widgets/Data Display/Card",
	component: Card,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card style={{ width: "300px" }}>
			<Card.Content>
				<h3 style={{ margin: "0 0 8px 0" }}>Card Title</h3>
				<p style={{ margin: 0, color: "#666" }}>
					This is a basic card with some content. Cards can contain text, images, and actions.
				</p>
			</Card.Content>
		</Card>
	)
};

export const WithMedia: Story = {
	render: () => (
		<Card style={{ width: "300px" }}>
			<Card.Media>
				<div
					style={{
						height: "140px",
						backgroundColor: "#1976d2",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white"
					}}
				>
					<Icon size="big">image</Icon>
				</div>
			</Card.Media>
			<Card.Content>
				<h3 style={{ margin: "0 0 8px 0" }}>Card with Media</h3>
				<p style={{ margin: 0, color: "#666" }}>This card includes a media section at the top for images or videos.</p>
			</Card.Content>
		</Card>
	)
};

export const WithActionArea: Story = {
	args: {},
	render: () => (
		<Card style={{ width: "300px" }}>
			<Card.ActionArea onClick={() => alert("Card clicked!")}>
				<Card.Media>
					<div
						style={{
							height: "140px",
							backgroundColor: "#4caf50",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white"
						}}
					>
						<Icon size="big">touch_app</Icon>
					</div>
				</Card.Media>
				<Card.Content>
					<h3 style={{ margin: "0 0 8px 0" }}>Clickable Card</h3>
					<p style={{ margin: 0, color: "#666" }}>Click anywhere on this card to trigger an action.</p>
				</Card.Content>
			</Card.ActionArea>
		</Card>
	)
};

export const WithButtons: Story = {
	render: () => (
		<Card style={{ width: "300px" }}>
			<Card.Content>
				<h3 style={{ margin: "0 0 8px 0" }}>Card with Actions</h3>
				<p style={{ margin: "0 0 16px 0", color: "#666" }}>This card has action buttons at the bottom.</p>
				<div style={{ display: "flex", gap: "8px" }}>
					<Button label="Learn More" primary />
					<Button label="Share" />
				</div>
			</Card.Content>
		</Card>
	)
};

export const ProductCard: Story = {
	render: () => (
		<Card style={{ width: "280px" }}>
			<Card.Media>
				<div
					style={{
						height: "180px",
						backgroundColor: "#f5f5f5",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Icon size="big">devices</Icon>
				</div>
			</Card.Media>
			<Card.Content>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
					<div>
						<h3 style={{ margin: "0 0 4px 0" }}>Laptop Pro</h3>
						<p style={{ margin: 0, color: "#666", fontSize: "14px" }}>High performance laptop</p>
					</div>
					<span style={{ fontWeight: "bold", color: "#1976d2" }}>$1,299</span>
				</div>
				<div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
					<Button label="Add to Cart" primary block />
					<Button icon={<Icon>favorite_border</Icon>} title="Add to wishlist" />
				</div>
			</Card.Content>
		</Card>
	)
};

export const ProfileCard: Story = {
	render: () => (
		<Card style={{ width: "300px", textAlign: "center" }}>
			<Card.Content>
				<div
					style={{
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						backgroundColor: "#1976d2",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 16px",
						color: "white"
					}}
				>
					<Icon size="big">person</Icon>
				</div>
				<h3 style={{ margin: "0 0 4px 0" }}>John Doe</h3>
				<p style={{ margin: "0 0 16px 0", color: "#666" }}>Software Engineer</p>
				<div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
					<Button icon={<Icon>mail</Icon>} title="Email" />
					<Button icon={<Icon>phone</Icon>} title="Call" />
					<Button icon={<Icon>chat</Icon>} title="Message" />
				</div>
			</Card.Content>
		</Card>
	)
};

export const CardGrid: Story = {
	render: () => (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "700px" }}>
			{[1, 2, 3, 4, 5, 6].map((num) => (
				<Card key={num}>
					<Card.ActionArea onClick={() => alert(`Card ${num} clicked`)}>
						<Card.Media>
							<div
								style={{
									height: "100px",
									backgroundColor: `hsl(${num * 50}, 70%, 60%)`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white"
								}}
							>
								<Icon>folder</Icon>
							</div>
						</Card.Media>
						<Card.Content>
							<h4 style={{ margin: 0 }}>Card {num}</h4>
						</Card.Content>
					</Card.ActionArea>
				</Card>
			))}
		</div>
	)
};
