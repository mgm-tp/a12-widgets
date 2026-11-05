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
import { enUS } from "date-fns/locale";

import { TimePicker, DateTimeContext, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

import { useTimePickerProps } from "./hooks";

const meta: Meta<typeof TimePicker> = {
	title: "Data Entry/Pickers/TimePicker",
	component: TimePicker,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		label: {
			control: "text",
			description: "Label of the time picker input"
		},
		placeholder: {
			control: "text",
			description: "Placeholder of the time picker input"
		},
		mode: {
			control: "select",
			options: ["12h", "24h"],
			description: "12-hour or 24-hour display mode"
		},
		disabled: {
			control: "boolean",
			description: "Whether the time picker is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the time picker is read-only"
		},
		hidePickerButton: {
			control: "boolean",
			description: "When true, the clock button is hidden"
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
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		label: "Time Picker",
		placeholder: "HH:MM AM/PM",
		mode: "12h",
		disabled: false,
		readonly: false
	},
	render: function PlaygroundExample(args) {
		const pickerProps = useTimePickerProps({ id: "time-picker-playground" });

		return (
			<div style={{ width: 320 }}>
				<TimePicker {...pickerProps} {...args} />
			</div>
		);
	}
};

export const Mode24h: Story = {
	name: "24-hour mode",
	render: function Mode24hExample() {
		const pickerProps = useTimePickerProps({ id: "time-picker-24h" });

		return (
			<div style={{ width: 320 }}>
				<TimePicker {...pickerProps} label="Time Picker (24h)" placeholder="HH:MM" mode="24h" />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: '`mode="24h"` switches the input and the clock face to the 24-hour format.'
			}
		}
	}
};

export const States: Story = {
	name: "Disabled and readonly",
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 320 }}>
			<TimePicker id="time-picker-disabled" label="Disabled Time Picker" placeholder="HH:MM AM/PM" disabled />
			<TimePicker id="time-picker-readonly" label="Readonly Time Picker" placeholder="HH:MM AM/PM" readonly />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction, `readonly` shows the value without allowing edits. In both states the picker cannot be opened."
			}
		}
	}
};

export const ContextTimeMode: Story = {
	name: "Context time mode",
	render: function ContextTimeModeExample() {
		const props24h = useTimePickerProps({ id: "time-picker-context-24h" });
		const propsOverride = useTimePickerProps({ id: "time-picker-prop-override" });

		return (
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 320 }}>
					<TimePicker {...props24h} label="Time Picker using 24h mode from context" />
					<TimePicker {...propsOverride} mode="12h" label="Time Picker with prop override (12h) inside 24h context" />
				</div>
			</DateTimeContext.Provider>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The time mode can be provided application-wide via `DateTimeContext` (`timeMode`). A `mode` prop on an individual picker always wins over the context value."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		label: "Time Picker",
		helperText: "Helper text explaining the field",
		placeholder: "HH:MM AM/PM",
		mode: "12h",
		error: true,
		errorMessage: "Please enter a valid time",
		messagePosition: "below"
	},
	render: function MessagePositionExample(args) {
		const pickerProps = useTimePickerProps({ id: "time-picker-message-position" });

		return (
			<div style={{ width: 320 }}>
				<TimePicker {...pickerProps} {...args} />
			</div>
		);
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
		label: "Time Picker",
		helperText: "Helper text explaining the field",
		placeholder: "HH:MM AM/PM",
		mode: "12h",
		tooltips: <HintTooltip text="This is a hint" id="time-picker-tooltip-position-hint" />,
		ariaDescribedby: "time-picker-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
	render: function TooltipPositionExample(args) {
		const pickerProps = useTimePickerProps({ id: "time-picker-tooltip-position" });

		return (
			<div style={{ width: 320 }}>
				<TimePicker {...pickerProps} {...args} />
			</div>
		);
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
