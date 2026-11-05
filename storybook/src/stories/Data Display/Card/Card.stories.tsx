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
import type { ReactElement } from "react";
import { fn } from "storybook/test";
import { styled } from "styled-components";

import type { CardProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Card, Icon, LayoutGrid, Tag, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const { Grid, Row, Column } = LayoutGrid;

/*
 * These stories are assembled from widgets and the library's own utility classes (`-u-*`, shipped
 * with `basic.css`) rather than from bespoke CSS. Only the two surfaces below need theme tokens
 * that no utility class exposes, so they are the only styled components in this file.
 */

/**
 * `Card` deliberately ships without a surface of its own, so the application can place it on any
 * background. Every story paints one from theme tokens — which is what a real integration does.
 *
 * No `overflow: hidden`: the card reserves a hairline of padding for the `Card.ActionArea` focus
 * outline, and clipping the root would cut that ring off.
 */
const StyledCard = styled(Card)`
	background-color: ${({ theme }) => theme.colors.background.primaryBackground};
	border: 1px solid ${({ theme }) => theme.colors.divider.color};
	border-radius: 0.5rem;
	box-shadow: ${({ theme }) => theme.applicationStyles.boxShadow};
`;

/**
 * Detaches a footer of actions from the copy above it. `divisionLineStyles` is not used here:
 * the Base theme deliberately switches those lines off, so the footer reuses the divider color
 * that draws the card border.
 */
const StyledCardFooter = styled.div`
	border-top: 1px solid ${({ theme }) => theme.colors.divider.color};
`;

/** Card width used across the stories; `-u-width-64` is 16rem. */
const CARD_WIDTH = "-u-width-64";

/**
 * `Card.Content` has no padding of its own, so the stories inset it horizontally. The vertical
 * rhythm is left to the `Typography` widgets' own margins rather than stacked on top of them.
 */
const CARD_CONTENT_PADDING = "-u-padding-x-sm";

/**
 * Stand-in for a real image. `Card.Media` centers its child, so the child has to claim the full
 * width itself — otherwise it collapses to the width of its own content, which is the classic way
 * to end up with a thin stripe instead of a media area.
 */
function MediaPlaceholder(props: { glyph: string; height?: string }): ReactElement {
	return (
		<Card.Media className="-u-padding-0 -u-rounded-t-lg -u-overflow-hidden">
			<div
				className={`-u-width-full ${props.height ?? "-u-height-32"} -u-flex -u-items-center -u-justify-center -u-background-grey-light`}
			>
				<Icon className="-u-text-4xl -u-text-grey-dark">{props.glyph}</Icon>
			</div>
		</Card.Media>
	);
}

/**
 * Stories that demo an action take their handler from this extra arg, so clicks land in the
 * Actions panel instead of a browser `alert()`.
 */
type CardStoryArgs = CardProps & { onAction: () => void };

const meta: Meta<CardStoryArgs> = {
	title: "Data Display/Card",
	component: Card,
	args: { onAction: fn() },
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"`Card` groups the content and actions of a single subject. It is a layout shell only — it draws no " +
					"background, border or elevation of its own, so the surrounding application owns the surface. These stories " +
					"paint that surface from theme tokens and compose everything inside it from widgets plus the library's " +
					"`-u-*` utility classes, so they stay correct in every theme."
			}
		}
	},
	argTypes: {
		children: {
			control: false,
			description: "Card sections — compose with `Card.Media`, `Card.Content` and `Card.ActionArea`"
		},
		id: {
			control: "text",
			description: "HTML id attribute of the card root element"
		},
		className: {
			control: "text",
			description: "Additional CSS class for the card root element"
		},
		style: {
			control: "object",
			description: "Inline styles for the card root element"
		},
		onAction: {
			control: false,
			description: "Story-only handler wired to the card's action(s); not a `Card` prop"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		className: CARD_WIDTH,
		children: (
			<Card.Content className={CARD_CONTENT_PADDING}>
				<Typography.Headline level={3}>Quarterly report</Typography.Headline>
				<Typography.Body>
					A card holds everything about one subject: a heading, supporting copy, and the actions that belong to it.
				</Typography.Body>
			</Card.Content>
		)
	},
	render: ({ onAction, ...args }) => <StyledCard {...args} />
};

export const WithMedia: Story = {
	render: () => (
		<StyledCard className={CARD_WIDTH}>
			<MediaPlaceholder glyph="insert_chart" />
			<Card.Content className={CARD_CONTENT_PADDING}>
				<Typography.Headline level={3}>Adoption is up 18%</Typography.Headline>
				<Typography.Body>
					A media area anchors the card visually and gives the eye somewhere to land before it reaches the copy.
				</Typography.Body>
			</Card.Content>
		</StyledCard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`Card.Media` renders a dedicated section for images or videos above `Card.Content`. It centers its child " +
					"and applies a themed inset by default; `-u-padding-0` gives the edge-to-edge look shown here."
			}
		}
	}
};

export const WithActionArea: Story = {
	render: ({ onAction }) => (
		<StyledCard className={CARD_WIDTH}>
			<Card.ActionArea onClick={onAction}>
				<MediaPlaceholder glyph="folder_open" />
				<Card.Content className={CARD_CONTENT_PADDING}>
					<Typography.Headline level={3}>Design system</Typography.Headline>
					<Typography.Body>Tab to this card and press Enter — the whole surface is one control.</Typography.Body>
				</Card.Content>
			</Card.ActionArea>
		</StyledCard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`Card.ActionArea` turns the whole card into a single control: it is keyboard focusable, fires `onClick` on " +
					"Enter, and shows hover, active and focus borders from the theme."
			}
		}
	}
};

export const WithButtons: Story = {
	render: ({ onAction }) => (
		<StyledCard className={CARD_WIDTH}>
			<Card.Content className={CARD_CONTENT_PADDING}>
				<Typography.Headline level={3}>Invite your team</Typography.Headline>
				<Typography.Body>
					When a card offers several distinct actions, place them in a footer instead of making the surface clickable.
				</Typography.Body>
				<StyledCardFooter className="-u-margin-t-sm -u-padding-t-sm -u-margin-b-sm">
					<ButtonGroup>
						<Button label="Send invites" primary onClick={onAction} />
						<Button label="Copy link" secondary onClick={onAction} />
					</ButtonGroup>
				</StyledCardFooter>
			</Card.Content>
		</StyledCard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Individual actions live inside `Card.Content`, grouped with `ButtonGroup`. Use this instead of " +
					"`Card.ActionArea` whenever the card has more than one meaningful action — nesting controls inside a " +
					"clickable surface makes the click target ambiguous."
			}
		}
	}
};

export const ProductCard: Story = {
	render: ({ onAction }) => (
		<StyledCard className={CARD_WIDTH}>
			<MediaPlaceholder glyph="laptop" />
			<Card.Content className={CARD_CONTENT_PADDING}>
				<Typography.Headline level={3} addons={<span className="-u-font-bold -u-text-lg">&euro;1,299</span>}>
					Laptop Pro 14&#8221;
				</Typography.Headline>
				<Typography.Body>32 GB memory &middot; 1 TB SSD &middot; 3-year warranty</Typography.Body>
				<Tag>In stock</Tag>
				<StyledCardFooter className="-u-margin-t-sm -u-padding-t-sm -u-margin-b-sm">
					<ButtonGroup>
						<Button label="Add to cart" primary onClick={onAction} />
						<Button icon={<Icon>favorite_border</Icon>} title="Add to wishlist" secondary onClick={onAction} />
					</ButtonGroup>
				</StyledCardFooter>
			</Card.Content>
		</StyledCard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"A realistic composition: media, a `Typography.Headline` whose `addons` slot carries the price, the specs as " +
					"body copy, a `Tag` for availability, and a footer of actions."
			}
		}
	}
};

export const ProfileCard: Story = {
	render: ({ onAction }) => (
		<StyledCard className={CARD_WIDTH}>
			<Card.Content className={`${CARD_CONTENT_PADDING} -u-flex -u-flex-col -u-items-center -u-text-center`}>
				<div className="-u-margin-t-sm -u-width-16 -u-height-16 -u-rounded-full -u-flex -u-items-center -u-justify-center -u-background-grey-light">
					<Icon className="-u-text-4xl -u-text-grey-dark">person</Icon>
				</div>
				<Typography.Headline level={3}>Jamie Rivera</Typography.Headline>
				<Typography.Body>Senior Software Engineer</Typography.Body>
				<ButtonGroup className="-u-margin-t-sm -u-margin-b-sm">
					<Button icon={<Icon>mail</Icon>} title="Send an email" secondary onClick={onAction} />
					<Button icon={<Icon>phone</Icon>} title="Start a call" secondary onClick={onAction} />
					<Button icon={<Icon>chat</Icon>} title="Send a message" secondary onClick={onAction} />
				</ButtonGroup>
			</Card.Content>
		</StyledCard>
	),
	parameters: {
		docs: {
			description: {
				story:
					"A centered profile built from `Card.Content` alone, using flex utility classes for the layout. Each " +
					"icon-only `Button` carries a `title`, which the widget turns into its accessible name."
			}
		}
	}
};

const GRID_ITEMS = [
	{ label: "Contracts", meta: "128 documents", glyph: "description" },
	{ label: "Invoices", meta: "412 documents", glyph: "receipt_long" },
	{ label: "Claims", meta: "37 documents", glyph: "assignment" },
	{ label: "Policies", meta: "64 documents", glyph: "policy" },
	{ label: "Archive", meta: "1,204 documents", glyph: "inventory_2" },
	{ label: "Flagged", meta: "9 documents", glyph: "flag" }
];

export const CardGrid: Story = {
	render: ({ onAction }) => (
		<Grid>
			<Row>
				{GRID_ITEMS.map((item) => (
					<Column key={item.label} size={{ sm: 12, md: 6, lg: 4 }}>
						<StyledCard>
							<Card.ActionArea onClick={onAction}>
								<MediaPlaceholder glyph={item.glyph} height="-u-height-24" />
								<Card.Content className={CARD_CONTENT_PADDING}>
									<Typography.Headline level={3}>{item.label}</Typography.Headline>
									<Typography.Body>{item.meta}</Typography.Body>
								</Card.Content>
							</Card.ActionArea>
						</StyledCard>
					</Column>
				))}
			</Row>
		</Grid>
	),
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story:
					"`LayoutGrid` places the cards on the library's responsive 12-column grid — three per row on a desktop, two " +
					"on a tablet, one on a phone. Cards stretch to the full height of their column, so rows line up even when " +
					"the copy differs in length."
			}
		}
	}
};
