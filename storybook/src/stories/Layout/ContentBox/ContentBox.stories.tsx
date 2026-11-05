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

import { ActionContentbox, ContentBoxElements, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ActionContentbox> = {
	title: "Layout/ContentBox",
	component: ActionContentbox,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		padding: {
			control: "text",
			description:
				"Padding for the content area. `true` adds default padding (left/right/bottom), `false` removes it, or pass a CSS value such as `12px 24px`"
		},
		embedded: {
			control: "boolean",
			description:
				"Render the content box in embedded (no shadow/border) style, useful when nested inside other containers"
		},
		boxShadow: {
			control: "select",
			options: ["default", "always", "none"],
			description:
				"Controls box-shadow rendering: `default` follows the theme, `always` forces a shadow, `none` removes it"
		},
		listenToWindowSize: {
			control: "boolean",
			description:
				"Listen to the browser window size instead of the parent element to decide between normal and compact rendering"
		},
		ariaLabel: {
			control: "text",
			description: "`aria-label` attribute of the content box"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		padding: true,
		embedded: false,
		boxShadow: "default"
	},
	render: (args) => (
		<ActionContentbox {...args} headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box" />}>
			<p>This is the main content area of the ContentBox.</p>
			<p>It can contain any React content.</p>
		</ActionContentbox>
	)
};

export const WithSubtitle: Story = {
	render: () => (
		<ActionContentbox
			headingElements={
				<>
					<ContentBoxElements.Title ariaLevel={2} key="title" text="Content Box Heading" />
					<ContentBoxElements.Subtitle key="subtitle" text="A descriptive subtitle" />
				</>
			}
		>
			<p>Content box with both a title and subtitle in the heading area.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`headingElements` accepts multiple elements — combine `ContentBoxElements.Title` with `ContentBoxElements.Subtitle` for a descriptive heading."
			}
		}
	}
};

export const WithCloseButton: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Closeable Content Box" />}
			headingButtons={<ContentBoxElements.CloseButton />}
		>
			<p>This content box shows a close button in the heading.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`headingButtons` renders elements as heading suffixes — here a `ContentBoxElements.CloseButton`, typical for overlays and side panels."
			}
		}
	}
};

export const WithBackButton: Story = {
	render: () => (
		<ActionContentbox
			headingPrefixes={<ContentBoxElements.BackButton />}
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Detail View" />}
		>
			<p>A back button prefix is useful in navigation flows or detail views.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`headingPrefixes` renders elements before the heading — here a `ContentBoxElements.BackButton` for navigation flows or detail views."
			}
		}
	}
};

export const WithActionButtons: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Actions" />}
			buttons={[
				{ align: "left", button: <Button label="Delete" destructive /> },
				{ align: "right", button: <Button label="Cancel" /> },
				{ align: "right", button: <Button primary label="Save" /> }
			]}
		>
			<p>
				The action buttons are rendered in an action bar below the heading. In compact mode they collapse into a popup
				menu in the heading.
			</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`buttons` renders an action bar as part of the subheading. Each entry specifies an `align` (`left` or `right`) and a `button` element. When space gets tight, the buttons collapse into a popup menu."
			}
		}
	}
};

export const WithActionBarGroup: Story = {
	render: () => {
		const { ActionBarGroupArea, ActionBarGroup, ActionBarGroupDivider } = ContentBoxElements;

		return (
			<ActionContentbox
				headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Group ActionBar" />}
				subActionBar={
					<ActionBarGroupArea
						leftSlot={[
							<ActionBarGroup key="filter">
								<Button secondary icon={<Icon>filter_list</Icon>} title="Filter" />
							</ActionBarGroup>,
							<ActionBarGroupDivider key="divider" />,
							<ActionBarGroup key="nested">
								<ActionBarGroup role="toolbar">
									<Button secondary icon={<Icon>file_copy</Icon>} title="Copy" />
									<ActionBarGroupDivider />
									<Button secondary label="Action" />
								</ActionBarGroup>
							</ActionBarGroup>
						]}
						rightSlot={[
							<ActionBarGroup key="refresh">
								<Button secondary icon={<Icon>refresh</Icon>} title="Refresh" />
							</ActionBarGroup>
						]}
					/>
				}
			>
				<p>
					A nested action bar group is rendered as a &quot;level 2&quot; group with its own background. Switch the theme
					in the toolbar and switch back — the group background must always follow the selected theme.
				</p>
			</ActionContentbox>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					'`ActionBarGroupArea` arranges `ActionBarGroup`s and `ActionBarGroupDivider`s in a left and a right slot. An `ActionBarGroup` nested inside another one gets the highlighted "level 2" styling.'
			}
		}
	}
};

export const WithFooter: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Footer" />}
			footer={
				<ContentBoxElements.Footer>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
						<Button label="Cancel" />
						<Button primary label="Save" />
					</div>
				</ContentBoxElements.Footer>
			}
		>
			<p>This content box has a footer containing action buttons.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`footer` renders a `ContentBoxElements.Footer` below the content — a common place for confirm/cancel actions."
			}
		}
	}
};

export const Embedded: Story = {
	render: () => (
		<ActionContentbox embedded headingElements={<ContentBoxElements.Title ariaLevel={2} text="Embedded Content Box" />}>
			<p>Embedded mode removes the outer shadow and border, useful when nested inside other containers.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`embedded` removes the outer shadow and border, useful when the content box is nested inside another container."
			}
		}
	}
};

export const WithNotificationArea: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Notification" />}
			notificationArea={
				<div
					style={{
						background: "#fff3cd",
						border: "1px solid #ffc107",
						borderRadius: "4px",
						padding: "8px 12px"
					}}
				>
					<strong>Warning:</strong> Some fields require your attention.
				</div>
			}
		>
			<p>The notification area appears below the heading and above the content.</p>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`notificationArea` renders custom content between the heading and the content area — for example validation messages or hints."
			}
		}
	}
};

export const NoPadding: Story = {
	render: () => (
		<ActionContentbox padding={false} headingElements={<ContentBoxElements.Title ariaLevel={2} text="No Padding" />}>
			<div style={{ background: "#f5f5f5", padding: "24px" }}>
				Content with padding disabled — the content fills edge to edge.
			</div>
		</ActionContentbox>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Setting `padding={false}` removes the default content padding so the content fills the box edge to edge. A custom CSS value such as `padding="12px 24px"` is also supported.'
			}
		}
	}
};
