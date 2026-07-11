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
import { fn } from "storybook/test";

import { Tag, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Tag> = {
	title: "Data Display/Tag",
	component: Tag,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		removable: {
			control: "boolean",
			description: "Show a remove (×) button on the tag"
		},
		color: {
			control: "color",
			description: "Background color of the tag"
		}
	},
	args: {
		onRemove: fn(),
		onClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Design"
	}
};

export const Removable: Story = {
	args: {
		children: "React",
		removable: true
	}
};

export const WithIcon: Story = {
	args: {
		children: "Priority",
		icon: <Icon>flag</Icon>
	}
};

export const WithColor: Story = {
	args: {
		children: "Approved",
		color: "#4caf50"
	}
};

export const TagList: Story = {
	render: () => {
		const TagListExample = () => {
			const [tags, setTags] = useState(["React", "TypeScript", "Storybook", "A12"]);

			return (
				<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
					{tags.map((tag) => (
						<Tag key={tag} removable onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
							{tag}
						</Tag>
					))}
				</div>
			);
		};

		return <TagListExample />;
	}
};
