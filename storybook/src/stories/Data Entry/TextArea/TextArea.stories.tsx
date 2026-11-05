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
import type { ChangeEvent } from "react";
import { useState } from "react";
import { fn } from "storybook/test";

import { TextAreaStateless, Button, HintTooltip, Icon, TextAffix } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TextAreaStateless> = {
	title: "Data Entry/TextArea",
	component: TextAreaStateless,
	parameters: {
		layout: "padded"
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: 480 }}>
				<Story />
			</div>
		)
	],
	argTypes: {
		value: {
			control: "text",
			description: "Current value of the text area"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when the field is empty"
		},
		label: {
			control: "text",
			description: "Label displayed above the text area"
		},
		disabled: {
			control: "boolean",
			description: "Disable user interaction with the text area"
		},
		readonly: {
			control: "boolean",
			description: "Render the text area as read-only"
		},
		error: {
			control: "boolean",
			description: "Show the text area in an error state"
		},
		warning: {
			control: "boolean",
			description: "Show the text area in a warning state"
		},
		autoExpand: {
			control: "boolean",
			description: "Allow the text area height to grow as the user types"
		},
		autoFocus: {
			control: "boolean",
			description: "Automatically focus the text area after rendering"
		},
		textAlignment: {
			control: "select",
			options: ["left", "right"],
			description: "Text alignment inside the field"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the text area"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the text area"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the text area"
		},
		helperText: {
			control: "text",
			description: "Helper text displayed below the text area"
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
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-text-area",
		label: "Description",
		value: "",
		placeholder: "Enter a description..."
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-text-area",
		label: "Bio",
		value: "",
		placeholder: "Tell us about yourself",
		helperText: "This will be shown publicly on your profile."
	},
	parameters: {
		docs: {
			description: {
				story: "`helperText` renders supporting text below the field to guide the user's input."
			}
		}
	}
};

export const DisabledAndReadonly: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextAreaStateless id="disabled-text-area" label="Disabled" value="This content cannot be edited." disabled />
			<TextAreaStateless
				id="readonly-text-area"
				label="Read-only"
				value="By using this service you agree to our terms and conditions."
				readonly
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction with the field, while `readonly` keeps the value selectable and focusable but not editable."
			}
		}
	}
};

export const ValidationMessages: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextAreaStateless id="error-text-area" label="Message" value="" error errorMessage="Message cannot be empty" />
			<TextAreaStateless
				id="warning-text-area"
				label="Message"
				value="Hi"
				warning
				warningMessage="Your message is very short — are you sure?"
			/>
			<TextAreaStateless
				id="info-text-area"
				label="Message"
				value="Hello there"
				infoMessage="Markdown formatting is supported."
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`error` and `warning` switch the field styling, while `errorMessage`, `warningMessage` and `infoMessage` render the corresponding message below the field."
			}
		}
	}
};

export const PrefixesAndSuffixes: Story = {
	render: function PrefixesAndSuffixesExample() {
		const [prefixValue, setPrefixValue] = useState("");
		const [suffixValue, setSuffixValue] = useState("");

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<TextAreaStateless
					id="textarea-with-prefixes"
					label="With prefixes"
					value={prefixValue}
					onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPrefixValue(event.target.value)}
					prefixes={[<Icon key="p1">search</Icon>]}
				/>
				<TextAreaStateless
					id="textarea-with-suffixes"
					label="With suffixes"
					value={suffixValue}
					onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSuffixValue(event.target.value)}
					suffixes={[<Icon key="s1">info</Icon>]}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`prefixes` and `suffixes` place elements such as icons inside the field, before or after the text."
			}
		}
	}
};

export const WithTextAffixAsSuffix: Story = {
	render: function WithTextAffixAsSuffixExample() {
		const [value, setValue] = useState("");
		const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

		return (
			<TextAreaStateless
				id="textarea-with-text-affix-suffix"
				label="Glucose level"
				value={value}
				onChange={handleChange}
				placeholder="Enter a value"
				suffixes={[
					<TextAffix key="unit" id="textarea-with-text-affix-suffix-unit">
						mmol/l
					</TextAffix>
				]}
				ariaDescribedby="textarea-with-text-affix-suffix-unit"
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"A `TextAffix` used as a suffix displays a textual unit. Linking it via `ariaDescribedby` makes the unit available to screen readers."
			}
		}
	}
};

export const WithAddons: Story = {
	render: function WithAddonsExample() {
		const [value, setValue] = useState("");
		const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

		return (
			<TextAreaStateless
				id="textarea-with-addons"
				label="With addons"
				value={value}
				onChange={handleChange}
				addonBefore={[<Button key="b1">A</Button>]}
				addonAfter={[<Button key="a1">B</Button>]}
				placeholder="With leading/trailing addons"
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`addonBefore` and `addonAfter` attach elements such as buttons outside the input wrapper."
			}
		}
	}
};

export const AutoFocus: Story = {
	render: function AutoFocusExample() {
		const [value, setValue] = useState("");
		const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

		return (
			<TextAreaStateless
				id="textarea-autofocus"
				label="Auto focus"
				value={value}
				onChange={handleChange}
				autoFocus
				placeholder="This should receive focus on render"
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`autoFocus` moves keyboard focus into the text area as soon as it renders."
			}
		}
	}
};

export const AutoExpand: Story = {
	render: function AutoExpandExample() {
		const [value, setValue] = useState("");
		const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

		return (
			<TextAreaStateless
				id="auto-expanded-textarea"
				label="Comment"
				value={value}
				onChange={handleChange}
				placeholder="Type or paste multi-line text here..."
				autoExpand
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`autoExpand` lets the field grow vertically with its content instead of showing a scrollbar. Use `onHeightChanged` to react to height changes."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "text-area-message-position",
		label: "Message",
		helperText: "Helper text explaining the field",
		value: "",
		error: true,
		errorMessage: "Message cannot be empty",
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
		id: "text-area-tooltip-position",
		label: "Message",
		helperText: "Helper text explaining the field",
		value: "Example value",
		tooltips: <HintTooltip text="This is a hint" id="text-area-tooltip-position-hint" />,
		ariaDescribedby: "text-area-tooltip-position-hint",
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
