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
import type { ReactNode } from "react";
import { useState } from "react";

import { Button, ButtonGroupContainer, ContentBoxElements, Icon, TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import type { ButtonGroupContainerProps } from "@com.mgmtp.a12.widgets/widgets-core";

type StoryArgs = {
	fitVisibleContentWidth: boolean;
};

function renderDescription(fitVisibleContentWidth: StoryArgs["fitVisibleContentWidth"]): ReactNode {
	if (fitVisibleContentWidth === false) {
		return (
			<>
				<strong>false (default):</strong> The BGC stretches to fill all available width, leaving no room for siblings
				(divider, expand button) to sit next to it.
			</>
		);
	}

	return (
		<>
			<strong>true:</strong> The BGC shrinks to fit only its visible buttons, keeping the divider and expand button in
			view. Resize detection watches the left slot&apos;s parent element.
		</>
	);
}

const leftSlotButtons: ButtonGroupContainerProps["leftSlotButtons"] = [
	{ label: "Add", icon: <Icon>add</Icon>, primary: true },
	{ label: "Export", icon: <Icon>get_app</Icon> },
	{ label: "Import", icon: <Icon>upload</Icon> },
	{ label: "Archive", icon: <Icon>archive</Icon> },
	{ label: "Duplicate", icon: <Icon>content_copy</Icon> }
];

const meta: Meta<StoryArgs> = {
	title: "General/Buttons/ButtonGroupContainer/FitVisibleContentWidth",
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"**`fitVisibleContentWidth`** solves the problem where a responsive `ButtonGroupContainer` " +
					"stretches to fill all available width instead of sitting next to its siblings.\n\n" +
					"When enabled, the container applies `max-width: max-content` so it only occupies " +
					"the space of its currently-visible buttons. Resize detection is delegated to the " +
					"container's `parentElement` so uncollapsing works correctly."
			},
			story: { height: "200px" }
		}
	},
	argTypes: {
		fitVisibleContentWidth: {
			control: "radio",
			options: [false, true],
			description: `
\`false\` — default behavior; container stretches to fill all available width, siblings cannot sit next to it.

\`true\` — container shrinks to visible buttons; parent element used as resize target.
`
		}
	},
	render: (args) => {
		const [searchValue, setSearchValue] = useState("");

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<div
					style={{
						overflow: "hidden",
						resize: "horizontal",
						border: "1px dashed #ccc",
						borderRadius: "4px",
						width: "100%",
						maxWidth: "100%",
						boxSizing: "border-box"
					}}
				>
					<ContentBoxElements.SubHeading>
						<ContentBoxElements.ActionBarGroupArea
							leftSlot={[
								<ButtonGroupContainer
									style={{ flex: 1 }}
									responsive={true}
									fitVisibleContentWidth={args.fitVisibleContentWidth}
									popupListAttributes={{ style: { position: "fixed" } }}
									collapsingDirection="right-to-left"
									leftSlotButtons={leftSlotButtons}
								/>,
								<ContentBoxElements.ActionBarGroupDivider />,
								<ContentBoxElements.ActionBarGroup>
									<Button
										label="Expand functions"
										title="Expand functions"
										labelHidden
										icon={<Icon>unfold_more</Icon>}
									/>
								</ContentBoxElements.ActionBarGroup>
							]}
							rightSlot={[
								<ContentBoxElements.ActionBarGroup>
									<TextField
										value={searchValue}
										placeholder="Search"
										id="story-search"
										suffixes={[<Icon>search</Icon>]}
										onChange={(e) => setSearchValue(e.target.value)}
									/>
									<Button label="Open filter" labelHidden title="Open filter" icon={<Icon>filter_list</Icon>} />
								</ContentBoxElements.ActionBarGroup>
							]}
						/>
					</ContentBoxElements.SubHeading>
				</div>

				<p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{renderDescription(args.fitVisibleContentWidth)}</p>
			</div>
		);
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FitVisibleContentWidth: Story = {
	args: { fitVisibleContentWidth: false }
};
