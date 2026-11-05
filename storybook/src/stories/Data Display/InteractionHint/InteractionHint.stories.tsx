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
import { useRef } from "react";

import type { InteractionHintProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { InteractionHint, Button, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const HintAnchor = ({
	label,
	...hintProps
}: { label: string } & Omit<InteractionHintProps, "referenceElementRef">): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
			<Button label={label} />
			<InteractionHint referenceElementRef={ref} {...hintProps} />
		</div>
	);
};

const meta: Meta<typeof InteractionHint> = {
	title: "Data Display/InteractionHint",
	component: InteractionHint,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		title: {
			control: "text",
			description: "Content shown inside the hint"
		},
		variant: {
			control: "select",
			options: ["hint", "success", "warning", "error"],
			description: "Variant will decide the hint color"
		},
		position: {
			control: "select",
			options: ["left", "right"],
			description: "Position of the hint relative to the reference element"
		},
		focusable: {
			control: "boolean",
			description: "Specifies whether the reference element is focusable"
		},
		followCursor: {
			control: "boolean",
			description: "When enabled, the hint follows the cursor during hover instead of being anchored to the element"
		},
		hideArrow: {
			control: "boolean",
			description: "Hides the arrow pointing at the reference element"
		},
		showDelay: {
			control: { type: "number", min: 0, step: 50 },
			description: "Delay in milliseconds before the hint appears on hover"
		},
		referenceElementRef: {
			control: false,
			description: "Ref to the trigger element the hint is anchored to"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		title: "Helpful information about this action",
		variant: "hint"
	},
	render: function PlaygroundExample(args) {
		const ref = useRef<HTMLDivElement>(null);

		return (
			<InteractionHintConfigProvider>
				<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
					<Button label="Hover me" />
					<InteractionHint {...args} referenceElementRef={ref} />
				</div>
			</InteractionHintConfigProvider>
		);
	}
};

export const Variants: Story = {
	render: () => (
		<InteractionHintConfigProvider>
			<div style={{ display: "flex", gap: "16px" }}>
				<HintAnchor label="Hint" title="This is a hint" variant="hint" />
				<HintAnchor label="Success" title="Field is valid" variant="success" />
				<HintAnchor label="Warning" title="Please review before submitting" variant="warning" />
				<HintAnchor label="Error" title="This action has an error" variant="error" />
			</div>
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `variant` prop selects the hint color: `hint`, `success`, `warning` or `error`. Hover a button to show its hint."
			}
		}
	}
};

export const Position: Story = {
	render: () => (
		<InteractionHintConfigProvider>
			<div style={{ display: "flex", gap: "64px", justifyContent: "center" }}>
				<HintAnchor label="Left hint" title="Shown on the left" variant="hint" position="left" />
				<HintAnchor label="Right hint" title="Shown on the right" variant="hint" position="right" />
			</div>
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`position` aligns the hint to the `left` or `right` edge of the reference element instead of centering it."
			}
		}
	}
};

export const FollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider>
			<HintAnchor label="Move the cursor over me" title="Following the cursor" variant="hint" followCursor />
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"With `followCursor` the hint tracks the mouse pointer during hover instead of staying anchored to the element. The arrow is hidden automatically while following."
			}
		}
	}
};

export const HideArrow: Story = {
	render: () => (
		<InteractionHintConfigProvider>
			<HintAnchor label="Hover me" title="No arrow on this hint" variant="hint" hideArrow />
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`hideArrow` removes the arrow that points at the reference element, giving the hint a plain tooltip look."
			}
		}
	}
};
