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

import { TimePicker, DateTimeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import { useTimePickerProps } from "./hooks";

const meta: Meta<typeof TimePicker> = {
	title: "Data Entry/Pickers/TimePicker",
	component: TimePicker,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Whether the time picker is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the time picker is read-only"
		},
		mode: {
			control: "select",
			options: ["12h", "24h"],
			description: "12-hour or 24-hour display mode"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const DefaultExample = () => {
			const pickerProps = useTimePickerProps({ id: "time-picker-default" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker {...pickerProps} label="Time Picker" placeholder="HH:MM AM/PM" />
				</div>
			);
		};

		return <DefaultExample />;
	}
};

export const Basic: Story = {
	name: "Basic",
	render: () => {
		const BasicExample = () => {
			const pickerProps = useTimePickerProps({ id: "time-picker-basic" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker {...pickerProps} label="Time Picker" placeholder="HH:MM AM/PM" />
				</div>
			);
		};

		return <BasicExample />;
	}
};

export const Mode24h: Story = {
	name: "24-hour Mode",
	render: () => {
		const Mode24hExample = () => {
			const pickerProps = useTimePickerProps({ id: "time-picker-24h" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker {...pickerProps} label="Time Picker (24h)" placeholder="HH:MM" mode="24h" />
				</div>
			);
		};

		return <Mode24hExample />;
	}
};

export const Disabled: Story = {
	name: "Disabled",
	render: () => (
		<div style={{ width: 320 }}>
			<TimePicker id="time-picker-disabled" label="Disabled Time Picker" placeholder="HH:MM AM/PM" disabled />
		</div>
	)
};

export const Readonly: Story = {
	name: "Readonly",
	render: () => (
		<div style={{ width: 320 }}>
			<TimePicker id="time-picker-readonly" label="Readonly Time Picker" placeholder="HH:MM AM/PM" readonly />
		</div>
	)
};

export const ContextTimeMode: Story = {
	name: "Context Time Mode",
	render: () => {
		const ContextTimeModeExample = () => {
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
		};

		return <ContextTimeModeExample />;
	}
};
