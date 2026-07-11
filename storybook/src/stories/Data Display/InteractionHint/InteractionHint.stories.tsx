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
import { useRef } from "react";

import { InteractionHint, Button, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof InteractionHint> = {
	title: "Data Display/InteractionHint",
	component: InteractionHint,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"InteractionHint is a tooltip-like overlay anchored to a reference element via `referenceElementRef`. " +
					"Wrap with `InteractionHintConfigProvider` to enable hover-triggered display."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const DefaultExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Hover me" />
						<InteractionHint referenceElementRef={ref} title="Helpful information about this action" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <DefaultExample />;
	}
};

export const HintVariant: Story = {
	render: () => {
		const HintExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Hover me" />
						<InteractionHint referenceElementRef={ref} title="This is a hint" variant="hint" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <HintExample />;
	}
};

export const SuccessVariant: Story = {
	render: () => {
		const SuccessExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Validated" primary />
						<InteractionHint referenceElementRef={ref} title="Field is valid" variant="success" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <SuccessExample />;
	}
};

export const WarningVariant: Story = {
	render: () => {
		const WarningExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Review" />
						<InteractionHint referenceElementRef={ref} title="Please review before submitting" variant="warning" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <WarningExample />;
	}
};

export const ErrorVariant: Story = {
	render: () => {
		const ErrorExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Error" destructive />
						<InteractionHint referenceElementRef={ref} title="This action has an error" variant="error" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <ErrorExample />;
	}
};

export const RightPosition: Story = {
	render: () => {
		const RightExample = () => {
			const ref = useRef<HTMLDivElement>(null);

			return (
				<InteractionHintConfigProvider>
					<div style={{ position: "relative", display: "inline-block" }} ref={ref}>
						<Button label="Right hint" />
						<InteractionHint referenceElementRef={ref} title="Shown on the right" variant="hint" position="right" />
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <RightExample />;
	}
};
