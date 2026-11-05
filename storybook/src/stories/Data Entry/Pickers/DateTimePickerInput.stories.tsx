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
import { de } from "date-fns/locale/de";
import { useState, useCallback, useMemo } from "react";

import type { MessagePosition as MessagePositionValue, TooltipLineBreak } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	DateTimePicker,
	DateTimePickerInput,
	DateTimePickerTimeInput,
	DateTimeContext,
	DateTimeUtils,
	HintTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

import { useDateTimePickerState } from "./hooks";

const DateTimePickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);

/**
 * The meta is typed against `DateTimePicker`, whose args feed `pickerProps`. The positioning
 * properties belong on the `DateTimePickerInput` wrapper instead, so the two positioning stories
 * declare their own args type rather than reusing `StoryObj<typeof meta>`.
 */
type PositionArgs = {
	messagePosition?: MessagePositionValue;
	breakTooltipsToNewLine?: TooltipLineBreak;
};

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePickerInput",
	component: DateTimePicker,
	parameters: { layout: "padded" },
	argTypes: {
		timeMode: {
			control: "select",
			options: ["12h", "24h"],
			description: "Whether the clock displays in 12-hour or 24-hour mode. Passed via `pickerProps`."
		},
		timeRequired: {
			control: "boolean",
			description: "Specifies whether the time is mandatory. Passed via `pickerProps`."
		},
		timezone: {
			control: "text",
			description: "Timezone database name, e.g. `America/New_York`. Passed via `pickerProps`."
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		timeMode: "12h"
	},
	render: function PlaygroundExample(args) {
		const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
			useDateTimePickerState();

		return (
			<div style={{ width: 360 }}>
				<DateTimePickerWithTimeInput
					inputLabel="Date & Time"
					placeholder="MM/DD/YYYY h:mm A"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						...args,
						id: "date-time-picker-input-playground",
						value: accepted,
						onAccept: setAccepted
					}}
					inputErrorMessage={inputErrorMessage}
					onInputChange={onInputChange}
					onInputValidationError={onInputValidationError}
					helperText={
						accepted ? `Selected: ${DateTimeUtils.toISOString(accepted)}` : "You haven't chosen a date and time yet."
					}
				/>
			</div>
		);
	}
};

export const TimeInput: Story = {
	render: function TimeInputExample() {
		const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
			useDateTimePickerState();

		return (
			<div style={{ width: 360 }}>
				<DateTimePickerWithTimeInput
					inputLabel="Date Time Picker with Time Input"
					placeholder="MM/DD/YYYY h:mm A"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						id: "date-time-picker-time-input",
						value: accepted,
						invalidInputMessage: "Invalid time",
						onAccept: setAccepted,
						disabled: { dayOfWeek: [0, 6] }
					}}
					inputErrorMessage={inputErrorMessage}
					onInputChange={onInputChange}
					onInputValidationError={onInputValidationError}
					helperText={
						accepted ? `Selected: ${DateTimeUtils.toISOString(accepted)}` : "You haven't chosen a date and time yet."
					}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`DateTimePickerTimeInput` renders a dedicated time input on the time screen. `invalidInputMessage` is shown for invalid typed times, and `disabled` matchers (here weekends) restrict the calendar."
			}
		}
	}
};

export const Timezone: Story = {
	render: function TimezoneExample() {
		const negativeOffsetTimezone = "America/New_York";
		const positiveOffsetTimezone = "Europe/Berlin";

		const [positiveDateTime, setPositiveDateTime] = useState<Date | undefined>(new Date("04/22/2025 11:30 AM"));
		const [negativeDateTime, setNegativeDateTime] = useState<Date | undefined>(new Date("04/22/2025 11:30 AM"));
		const [invalidPositive, setInvalidPositive] = useState("");
		const [invalidNegative, setInvalidNegative] = useState("");

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: 400 }}>
				<DateTimePickerWithTimeInput
					inputLabel={`Timezone: ${positiveOffsetTimezone}`}
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						id: "dt-picker-berlin",
						value: positiveDateTime,
						onAccept: setPositiveDateTime,
						timezone: positiveOffsetTimezone
					}}
					inputErrorMessage={invalidPositive || undefined}
					onInputValidationError={(v) => {
						setInvalidPositive(`Invalid value: ${v}`);
						setPositiveDateTime(undefined);
					}}
					helperText={positiveDateTime ? `ISO: ${DateTimeUtils.toISOString(positiveDateTime)}` : undefined}
				/>
				<DateTimePickerWithTimeInput
					inputLabel={`Timezone: ${negativeOffsetTimezone}`}
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						id: "dt-picker-newyork",
						value: negativeDateTime,
						onAccept: setNegativeDateTime,
						timezone: negativeOffsetTimezone
					}}
					inputErrorMessage={invalidNegative || undefined}
					onInputValidationError={(v) => {
						setInvalidNegative(`Invalid value: ${v}`);
						setNegativeDateTime(undefined);
					}}
					helperText={negativeDateTime ? `ISO: ${DateTimeUtils.toISOString(negativeDateTime)}` : undefined}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `timezone` picker prop (IANA database name) makes the picker interpret and display the value in that zone — compare the displayed times of both inputs with the ISO value in the helper text."
			}
		}
	}
};

export const AdditionalProperties: Story = {
	render: function AdditionalPropsExample() {
		const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
			useDateTimePickerState();

		const highlightedDay = useCallback((day: Date) => day.getDate() === 20, []);
		const bookedDays = useCallback((day: Date) => day.getDate() === 23, []);
		const highlightedDayStyle = useMemo(() => ({ backgroundColor: "rgb(255, 181, 128)" }), []);
		const bookedStyle = useMemo(() => ({ border: "2px solid currentColor" }), []);

		return (
			<DateTimeContext.Provider value={{ locale: de }}>
				<div style={{ width: 360 }}>
					<DateTimePickerWithTimeInput
						inputLabel="Custom modifiers"
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "date-time-picker-additional-props",
							value: accepted,
							onAccept: setAccepted,
							disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }],
							modifiers: { highlightedDay, booked: bookedDays },
							modifiersStyles: { booked: bookedStyle, highlightedDay: highlightedDayStyle },
							modifiersClassNames: { booked: "booked-classname" },
							yearRange: { start: 1990, end: 2025 }
						}}
						inputErrorMessage={inputErrorMessage}
						onInputChange={onInputChange}
						onInputValidationError={onInputValidationError}
						helperText={
							accepted
								? `Selected: ${DateTimeUtils.toISOString(accepted)}`
								: "Weekends and past days disabled. Day 20 highlighted, day 23 booked."
						}
					/>
				</div>
			</DateTimeContext.Provider>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Any react-day-picker props pass through `pickerProps`: `disabled` matchers, custom `modifiers` with `modifiersStyles`/`modifiersClassNames`, a restricted `yearRange` — plus a locale (here `de`) from `DateTimeContext`."
			}
		}
	}
};

export const MessagePosition: StoryObj<PositionArgs> = {
	args: {
		messagePosition: "below"
	},
	argTypes: {
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		}
	},
	render: function MessagePositionExample(args) {
		const { accepted, setAccepted, onInputChange, onInputValidationError } = useDateTimePickerState();

		return (
			<div style={{ width: 360 }}>
				<DateTimePickerWithTimeInput
					id="date-time-picker-message-position"
					inputLabel="Date & Time"
					helperText="Helper text explaining the field"
					placeholder="MM/DD/YYYY h:mm A"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						id: "date-time-picker-message-position-calendar",
						value: accepted,
						onAccept: setAccepted
					}}
					error
					inputErrorMessage="Please enter a valid date and time"
					onInputChange={onInputChange}
					onInputValidationError={onInputValidationError}
					messagePosition={args.messagePosition}
				/>
			</div>
		);
	},
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control. The wrapper forwards the error message to its input as `inputErrorMessage`.'
			}
		}
	}
};

export const TooltipPosition: StoryObj<PositionArgs> = {
	args: {
		breakTooltipsToNewLine: "below"
	},
	argTypes: {
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `false` (default) inline beside the control, `true` / `"above"` on a new line above the control, `"below"` on a new line below'
		}
	},
	render: function TooltipPositionExample(args) {
		const { accepted, setAccepted, onInputChange, onInputValidationError } = useDateTimePickerState();

		return (
			<div style={{ width: 360 }}>
				<DateTimePickerWithTimeInput
					id="date-time-picker-tooltip-position"
					inputLabel="Date & Time"
					helperText="Helper text explaining the field"
					placeholder="MM/DD/YYYY h:mm A"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={{
						id: "date-time-picker-tooltip-position-calendar",
						value: accepted,
						onAccept: setAccepted
					}}
					inputTooltips={<HintTooltip text="This is a hint" id="date-time-picker-tooltip-position-hint" />}
					onInputChange={onInputChange}
					onInputValidationError={onInputValidationError}
					breakTooltipsToNewLine={args.breakTooltipsToNewLine}
				/>
			</div>
		);
	},
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` for the default inline placement beside it, or to `"above"` / `true` for a line above. The wrapper forwards the tooltips to its input as `inputTooltips`.'
			}
		}
	}
};
