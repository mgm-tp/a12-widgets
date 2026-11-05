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

import { HintTooltip, TagInput } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TagInput> = {
	title: "Data Entry/TagInput",
	component: TagInput,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		label: {
			control: "text",
			description: "Label rendered above the tag input"
		},
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
		openOnFocus: {
			control: "boolean",
			description: "Whether the popular tags dropdown opens when the input receives focus"
		},
		focusableRemoveButtons: {
			control: "boolean",
			description: "On desktop, whether each tag's remove button joins the native Tab order"
		},
		disabled: {
			control: "boolean",
			description: "Whether the tag input is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the tag input is read-only"
		},
		helperText: {
			control: "text",
			description: "Helper text rendered below the input"
		},
		errorMessage: {
			control: "text",
			description: "Error message rendered below the input"
		},
		duplicatedTagMessage: {
			control: "text",
			description: "Message shown when the user tries to add a duplicate tag"
		},
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		},
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `true` / `"above"` (default for this widget) on a new line above the control, `false` inline beside the control, `"below"` on a new line below'
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

export const Playground: Story = {
	args: {
		id: "playground-tag-input",
		label: "Tag Input",
		placeholder: "Add tags with comma, semicolon or Enter...",
		keys: KEYS,
		initialTags: ["React", "TypeScript"],
		popularLabel: "Popular tags",
		popularTags: POPULAR_TAGS,
		suggestionLabel: "Suggestions",
		suggestionTags: SUGGESTIONS
	}
};

export const WithInitialTags: Story = {
	args: {
		id: "initial-tags-input",
		label: "Tag Input with Initial Tags",
		placeholder: "Add more tags...",
		keys: KEYS,
		initialTags: ["React", "TypeScript", "A12"]
	},
	parameters: {
		docs: {
			description: {
				story:
					"`initialTags` renders a set of tags as soon as the component mounts. The user can remove them or add further tags."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"`popularTags` are offered in a dropdown when the input is focused, while `suggestionTags` are filtered against the text the user is typing. `popularLabel` and `suggestionLabel` caption the two dropdown sections."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story: "`disabled` prevents any interaction — existing tags cannot be removed and no new tags can be added."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"`readonly` shows the current tags without allowing edits, but unlike `disabled` the widget stays focusable and readable for assistive technology."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"`helperText` renders guidance below the input. `duplicatedTagMessage` replaces the default localized message shown when the user tries to add the same tag twice."
			}
		}
	}
};

export const WithFocusableRemoveButtons: Story = {
	args: {
		id: "focusable-remove-buttons-tag-input",
		label: "Tag Input with Focusable Remove Buttons",
		placeholder: "Add tags...",
		keys: KEYS,
		initialTags: ["React", "TypeScript", "Storybook"],
		focusableRemoveButtons: true
	},
	parameters: {
		docs: {
			description: {
				story:
					"`focusableRemoveButtons` adds each tag's remove button to the native Tab order on desktop (default `false`), so the user can Tab/Shift+Tab through them instead of only reaching them with the mouse."
			}
		}
	}
};

export const WithError: Story = {
	args: {
		id: "error-tag-input",
		label: "Tag Input with Error",
		placeholder: "Add tags...",
		keys: KEYS,
		errorMessage: "At least one tag is required."
	},
	parameters: {
		docs: {
			description: {
				story: "`errorMessage` puts the input into its error state and renders the message below the field."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "tag-input-message-position",
		label: "Tag Input",
		placeholder: "Add tags...",
		keys: KEYS,
		helperText: "Helper text explaining the field",
		errorMessage: "At least one tag is required.",
		messagePosition: "below"
	},
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control.'
			}
		}
	}
};

export const TooltipPosition: Story = {
	args: {
		id: "tag-input-tooltip-position",
		label: "Tag Input",
		placeholder: "Add tags...",
		keys: KEYS,
		initialTags: ["React", "TypeScript"],
		helperText: "Helper text explaining the field",
		tooltips: <HintTooltip text="This is a hint" id="tag-input-tooltip-position-hint" />,
		breakTooltipsToNewLine: "below"
	},
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` to place them inline beside it, or to `"above"` / `true` for a line above, which is the default for this widget.'
			}
		}
	}
};
