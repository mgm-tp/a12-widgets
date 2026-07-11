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
import { fn } from "storybook/test";

import { TagInput } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TagInput> = {
	title: "Data Entry/TagInput",
	component: TagInput,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder text shown inside the tag input area"
		},
		initialTags: {
			control: "object",
			description: "Tags rendered initially when the component mounts"
		},
		popularTags: {
			control: "object",
			description: "Tags shown as suggestions when the user focuses the input"
		},
		popularLabel: {
			control: "text",
			description: "Label shown above the popular tags dropdown"
		},
		suggestionTags: {
			control: "object",
			description: "Suggestion tags shown as the user types"
		},
		suggestionLabel: {
			control: "text",
			description: "Label shown above the suggestions dropdown"
		},
		keys: {
			control: "object",
			description: "Characters that trigger tag creation (defaults to comma)"
		},
		disabled: {
			control: "boolean",
			description: "Whether the tag input is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the tag input is read-only"
		},
		duplicatedTagMessage: {
			control: "text",
			description: "Message shown when the user tries to add a duplicate tag"
		}
	},
	args: {
		onAddedTag: fn(),
		onRemoveTag: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

const KEYS = ["\n", ",", ";"];
const POPULAR_TAGS = ["Android", "iOS", "Windows", "macOS", "Linux", "A12", "mgm"];
const SUGGESTIONS = ["React", "TypeScript", "Storybook", "Vitest", "Playwright", "styled-components"];

export const Default: Story = {
	args: {
		id: "default-tag-input",
		label: "Tag Input",
		placeholder: "Add tags with comma or Enter...",
		keys: KEYS
	}
};

export const WithInitialTags: Story = {
	args: {
		id: "initial-tags-input",
		label: "Tag Input with Initial Tags",
		placeholder: "Add more tags...",
		keys: KEYS,
		initialTags: ["React", "TypeScript", "A12"]
	}
};

export const WithPopularAndSuggestions: Story = {
	args: {
		id: "suggestions-tag-input",
		label: "Tag Input with Popular Tags & Suggestions",
		placeholder: "Start typing to see suggestions...",
		keys: KEYS,
		initialTags: ["A12", "mgm"],
		popularLabel: "Popular tags",
		popularTags: POPULAR_TAGS,
		suggestionLabel: "Suggestions",
		suggestionTags: SUGGESTIONS
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-tag-input",
		label: "Disabled Tag Input",
		placeholder: "This input is disabled",
		keys: KEYS,
		initialTags: ["React", "TypeScript"],
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-tag-input",
		label: "Readonly Tag Input",
		placeholder: "This input is readonly",
		keys: KEYS,
		initialTags: ["React", "TypeScript", "Storybook"],
		readonly: true
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-tag-input",
		label: "Tag Input with Helper Text",
		placeholder: "Add tags...",
		keys: KEYS,
		helperText: "Press comma, semicolon, or Enter to create a new tag.",
		duplicatedTagMessage: "This tag has already been added."
	}
};

export const WithError: Story = {
	args: {
		id: "error-tag-input",
		label: "Tag Input with Error",
		placeholder: "Add tags...",
		keys: KEYS,
		errorMessage: "At least one tag is required."
	}
};
