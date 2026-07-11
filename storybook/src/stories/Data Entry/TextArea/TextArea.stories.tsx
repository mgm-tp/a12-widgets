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

import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useRef, useCallback } from "react";
import { fn } from "storybook/test";

import { TextAreaStateless, AttachedPortal, Button, Icon, TextAffix } from "@com.mgmtp.a12.widgets/widgets-core";

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
	tags: ["autodocs"],
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
		}
	},
	args: {
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-text-area",
		label: "Description",
		value: "",
		placeholder: "Enter a description..."
	}
};

export const WithValue: Story = {
	args: {
		id: "prefilled-text-area",
		label: "Notes",
		value: "These are some pre-filled notes about the current record."
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-text-area",
		label: "Bio",
		value: "",
		placeholder: "Tell us about yourself",
		helperText: "This will be shown publicly on your profile."
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-text-area",
		label: "Read-only content",
		value: "This content cannot be edited.",
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-text-area",
		label: "Terms of service",
		value: "By using this service you agree to our terms and conditions.",
		readonly: true
	}
};

export const WithErrorMessage: Story = {
	args: {
		id: "error-text-area",
		label: "Message",
		value: "",
		error: true,
		errorMessage: "Message cannot be empty"
	}
};

export const WithWarningMessage: Story = {
	args: {
		id: "warning-text-area",
		label: "Message",
		value: "Hi",
		warning: true,
		warningMessage: "Your message is very short — are you sure?"
	}
};

export const WithPrefixes: Story = {
	render: () => {
		const Demo = () => {
			const [value, setValue] = useState("");
			const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

			return (
				<TextAreaStateless
					id="textarea-with-prefixes"
					label="With prefixes"
					value={value}
					onChange={handleChange}
					prefixes={[<Icon key="p1">search</Icon>]}
				/>
			);
		};

		return <Demo />;
	}
};

export const WithSuffixes: Story = {
	render: () => {
		const Demo = () => {
			const [value, setValue] = useState("");
			const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value);

			return (
				<TextAreaStateless
					id="textarea-with-suffixes"
					label="With suffixes"
					value={value}
					onChange={handleChange}
					suffixes={[<Icon key="s1">info</Icon>]}
				/>
			);
		};

		return <Demo />;
	}
};

export const WithTextAffixAsSuffix: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};

export const WithAddons: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};

export const AutoFocus: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};
export const AutoExpand: Story = {
	render: () => {
		const Demo = () => {
			const textareaRef = useRef<HTMLTextAreaElement | null>(null);
			const [referenceElement, setReferenceElement] = useState<HTMLTextAreaElement | null>(null);
			const [showPortal, setShowPortal] = useState(false);
			const [value, setValue] = useState("");
			const wrapperRef = useRef<HTMLDivElement | null>(null);

			const setRefs = useCallback((el: HTMLTextAreaElement | null) => {
				textareaRef.current = el;
				setReferenceElement(el);
			}, []);

			const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
				setValue(event.target.value);
				const el = event.target;
				el.style.height = "auto";
				el.style.height = `${el.scrollHeight}px`;
			}, []);

			const handleToggle = useCallback(() => {
				setShowPortal((prev) => !prev);
			}, []);

			return (
				<div style={{ padding: 16, width: 500 }} ref={wrapperRef}>
					<label htmlFor="auto-expanded-textarea" style={{ display: "block", marginBottom: 6 }}>
						Comment
					</label>
					<TextAreaStateless
						id="auto-expanded-textarea"
						label={undefined}
						value={value}
						onChange={handleChange}
						placeholder="Type or paste multi-line text here..."
						autoExpand
						inputRef={setRefs}
					/>

					<Button onClick={handleToggle} style={{ marginTop: 80 }}>
						{showPortal ? "Close" : "Open"} Show Helper Text
					</Button>

					{showPortal && referenceElement && (
						<AttachedPortal
							referenceElement={referenceElement}
							orientation="bottom-start"
							closeOnOutsideClick={false}
							closeOnClickReferenceElement={false}
						>
							<div
								style={{ width: 360, padding: 12, background: "#fffbe6", border: "1px solid #f0c36d", borderRadius: 4 }}
							>
								Helper: Use this field for additional notes; it expands as you type.
							</div>
						</AttachedPortal>
					)}
				</div>
			);
		};

		return <Demo />;
	}
};
