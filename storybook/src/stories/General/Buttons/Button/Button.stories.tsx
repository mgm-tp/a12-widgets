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
import { useState, useEffect } from "react";
import { fn } from "storybook/test";

import { InteractionHintConfigProvider, Icon, Button, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

type StoryFn = () => React.JSX.Element;

const meta: Meta<typeof Button> = {
	title: "General/Buttons/Button",
	component: Button,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		type: {
			control: "select",
			options: ["button", "submit", "reset"],
			description: "Specify the type of the button"
		},
		label: {
			control: "text",
			description: "The label of the button"
		},
		title: {
			control: "text",
			description: "Tooltip shown when hovering the button"
		},
		icon: {
			control: false,
			description: "Additional icon for the button — without a `label`, the button becomes an icon button"
		},
		badge: {
			control: false,
			description: "Badge for the button, only shown on icon buttons"
		},
		primary: {
			control: "boolean",
			description: "Whether the button is a primary button"
		},
		secondary: {
			control: "boolean",
			description: "Whether the button is a secondary button"
		},
		destructive: {
			control: "boolean",
			description: "Whether the button represents a destructive action"
		},
		invert: {
			control: "boolean",
			description: "If true, an inverted color will be set (for dark backgrounds)"
		},
		block: {
			control: "boolean",
			description: "Make the button fit its parent width and height"
		},
		active: {
			control: "boolean",
			description: "Whether the button is activated"
		},
		disabled: {
			control: "boolean",
			description: "Whether the button is disabled"
		},
		vertical: {
			control: "boolean",
			description: "Aligns icon and text vertically at center"
		},
		loading: {
			control: "boolean",
			description: "Shows a progress indicator inside the button"
		},
		processedPercentage: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "The progressed percentage of the loading process"
		},
		labelHidden: {
			control: "boolean",
			description: "Hide the label but keep it for accessibility"
		},
		tabIndex: {
			control: "number",
			description: "The tabIndex attribute for the button"
		}
	},
	args: {
		onClick: fn(),
		onMouseOver: fn(),
		onMouseLeave: fn(),
		onMouseDown: fn(),
		onKeyDown: fn(),
		onKeyUp: fn(),
		onFocus: fn(),
		onBlur: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		label: "Button"
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "120px" }}>Default:</span>
				<Button label="Default" />
				<Button label="Disabled" disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "120px" }}>Primary:</span>
				<Button label="Primary" primary />
				<Button label="Disabled" primary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "120px" }}>Secondary:</span>
				<Button label="Secondary" secondary />
				<Button label="Disabled" secondary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "120px" }}>Destructive:</span>
				<Button label="Destructive" destructive />
				<Button label="Primary" destructive primary />
				<Button label="Disabled" destructive disabled />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The boolean props `primary`, `secondary` and `destructive` select the button style. `destructive` combines with `primary`, and every variant supports `disabled`."
			}
		}
	}
};

export const WithIcon: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
			<Button label="Save" icon={<Icon>save</Icon>} />
			<Button label="Save" icon={<Icon>save</Icon>} primary />
			<Button label="Delete" icon={<Icon>delete</Icon>} destructive />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Use `icon` together with `label` to render an icon next to the button text."
			}
		}
	}
};

export const IconOnly: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
			<Button icon={<Icon>add</Icon>} title="Add" />
			<Button icon={<Icon>add</Icon>} title="Add" primary />
			<Button icon={<Icon>settings</Icon>} title="Settings" secondary />
			<Button icon={<Icon>delete</Icon>} title="Delete" destructive />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When `icon` is set without a `label`, the button is rendered as an icon button. Always provide a `title` so the action stays accessible."
			}
		}
	}
};

export const WithBadge: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
			<Button label="Messages" icon={<Icon>mail</Icon>} badge={<Badge tiny variant="error" />} title="View messages" />
			<Button icon={<Icon>notifications</Icon>} badge="5" title="Notifications" />
			<Button icon={<Icon>assignment</Icon>} badge={<Badge tiny variant="info" />} secondary title="View tasks" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `badge` prop attaches a count or a tiny `Badge` marker to the button icon — useful for unread or pending indicators."
			}
		}
	}
};

export const Loading: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
			<Button label="Loading..." loading processedPercentage={0} />
			<Button label="Saving..." loading primary processedPercentage={0} />
			<Button label="Downloading..." loading processedPercentage={65} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`loading` shows a progress indicator inside the button. Set `processedPercentage` to visualize determinate progress (e.g. downloads), or leave it at `0` for an indeterminate state."
			}
		}
	}
};

export const AnimatedProgress: Story = {
	render: function AnimatedProgressExample() {
		const [progress, setProgress] = useState(0);
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			if (!isLoading) {
				return;
			}

			const interval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) {
						setIsLoading(false);

						return 100;
					}

					return prev + 5;
				});
			}, 200);

			return () => clearInterval(interval);
		}, [isLoading]);

		const handleReset = () => {
			setProgress(0);
			setIsLoading(true);
		};

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
				<Button
					label={isLoading ? `Uploading... ${progress}%` : "Upload Complete!"}
					loading={isLoading}
					processedPercentage={progress}
					primary
				/>
				{!isLoading && <Button label="Reset" onClick={handleReset} />}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Drive `processedPercentage` from state to animate the progress bar while a long-running action completes."
			}
		}
	}
};

export const Active: Story = {
	args: {
		label: "Active Button",
		active: true
	},
	parameters: {
		docs: {
			description: {
				story: "`active` marks the button as activated by changing its background color, e.g. for toggle-like usage."
			}
		}
	}
};

export const Block: Story = {
	args: {
		label: "Block Button",
		block: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	],
	parameters: {
		docs: {
			description: {
				story: "`block` makes the button fill the width and height of its parent container."
			}
		}
	}
};

export const Vertical: Story = {
	args: {
		label: "Vertical",
		icon: <Icon>home</Icon>,
		vertical: true
	},
	parameters: {
		docs: {
			description: {
				story: "`vertical` stacks the `icon` above the `label` and centers them — only use it when both are present."
			}
		}
	}
};

export const Inverted: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
			<Button label="Inverted Primary" primary invert />
			<Button label="Inverted Secondary" secondary invert />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`invert` switches `primary` and `secondary` buttons to inverted colors for dark backgrounds; secondary buttons get an additional outline."
			}
		}
	}
};

export const HiddenLabel: Story = {
	args: {
		label: "Settings",
		icon: <Icon>settings</Icon>,
		labelHidden: true
	},
	parameters: {
		docs: {
			description: {
				story:
					"`labelHidden` visually hides the `label` while keeping it available for accessibility and responsive button groups."
			}
		}
	}
};

export const InteractionHint: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: true }}>
				<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
					<span style={{ width: "120px" }}>Default:</span>
					<Button label="Hover me" title="This button has an interaction hint" />
					<Button label="Primary" primary title="Primary button with hint" />
					<Button icon={<Icon>settings</Icon>} title="Settings" />
				</div>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ button: true }}>
				<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
					<span style={{ width: "120px" }}>Follow cursor:</span>
					<Button label="Follow Cursor" title="This hint follows your cursor" />
					<Button icon={<Icon>help</Icon>} secondary title="Help" />
				</div>
			</InteractionHintConfigProvider>
			<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ button: true }}>
				<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
					<span style={{ width: "120px" }}>No arrow:</span>
					<Button label="No Arrow" title="This hint has no arrow" />
					<Button label="Delete" destructive title="Delete action" />
				</div>
			</InteractionHintConfigProvider>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrap buttons in an `InteractionHintConfigProvider` to show the `title` as a styled interaction hint on hover. `followCursor` lets the hint track the pointer and `hideArrow` removes the arrow."
			}
		}
	}
};
