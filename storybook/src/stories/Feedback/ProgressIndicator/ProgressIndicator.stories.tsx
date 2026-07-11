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

import { ProgressIndicator } from "@com.mgmtp.a12.widgets/widgets-core";

const sampleContent =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

const meta: Meta<typeof ProgressIndicator> = {
	title: "Feedback/ProgressIndicator",
	component: ProgressIndicator,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label displayed below (or beside) the loading circle"
		},
		size: {
			control: "select",
			options: ["small", "medium", "big"],
			description: "Size of the inner overlay"
		},
		type: {
			control: "radio",
			options: ["vertical", "horizontal"],
			description: "Alignment of the label and circle"
		},
		color: {
			control: "color",
			description: "Custom color for the progress indicator"
		},
		hideLoadingCircle: {
			control: "boolean",
			description: "Hide the loading circle, showing only the label"
		},
		useLoadingDots: {
			control: "boolean",
			description: "Show animated loading dots after the label"
		},
		singleOverlay: {
			control: "boolean",
			description: "Display a single overlay instead of inner and outer"
		},
		outerOverlayVariant: {
			control: "select",
			options: ["bright", "transparent"],
			description: "Variant for the outer overlay"
		},
		innerOverlayVariant: {
			control: "select",
			options: ["bright", "transparent"],
			description: "Variant for the inner overlay"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {}
};

export const Basic: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Basic progress indicator overlaying a content area. The indicator covers the container while content loads."
			}
		}
	}
};

export const WithLabel: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {
		label: "Loading",
		size: "big"
	},
	parameters: {
		docs: {
			description: {
				story: "Progress indicator with a label displayed below the spinner."
			}
		}
	}
};

export const WithLoadingDots: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {
		label: "Loading",
		useLoadingDots: true,
		hideLoadingCircle: true
	},
	parameters: {
		docs: {
			description: {
				story: "Progress indicator showing animated loading dots after the label instead of a spinner circle."
			}
		}
	}
};

export const HorizontalLayout: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {
		label: "Loading",
		type: "horizontal",
		size: "medium"
	},
	parameters: {
		docs: {
			description: {
				story: "Progress indicator with label and spinner arranged horizontally side by side."
			}
		}
	}
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "48px" }}>
			{(["small", "medium", "big"] as const).map((size) => (
				<div key={size} style={{ position: "relative", height: "160px", width: "160px", border: "1px solid #ccc" }}>
					<p style={{ margin: "8px", fontSize: "12px" }}>{size}</p>
					<ProgressIndicator label={size} size={size} />
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Comparison of all available sizes: small, medium, and big (default)."
			}
		}
	}
};

export const CustomColor: Story = {
	render: (args) => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator {...args} />
		</div>
	),
	args: {
		label: "Loading",
		color: "#c91d1d"
	},
	parameters: {
		docs: {
			description: {
				story: "Progress indicator with a custom color applied to both the spinner and the label."
			}
		}
	}
};

export const TransparentOverlays: Story = {
	render: () => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator label="Loading" outerOverlayVariant="transparent" innerOverlayVariant="transparent" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Both inner and outer overlays set to transparent — only the spinner and label are visible."
			}
		}
	}
};

export const BrightOverlay: Story = {
	render: () => (
		<div style={{ position: "relative", height: "200px" }}>
			<p style={{ margin: 0 }}>{sampleContent}</p>
			<ProgressIndicator label="Loading" outerOverlayVariant="bright" innerOverlayVariant="bright" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Both overlays set to the bright variant, providing a light-colored blocking overlay."
			}
		}
	}
};
