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

import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useMemo } from "react";

import {
	TimePicker,
	TimePickerTpl,
	TimeUtils,
	PickerHeaderCloseButton,
	DateTimeUtils,
	parseIncompleteTime
} from "@com.mgmtp.a12.widgets/widgets-core";

import { useTimePickerProps } from "./hooks";

const meta: Meta<typeof TimePicker> = {
	title: "Data Entry/Pickers/TimePicker/Advanced",
	component: TimePicker,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomHeader: Story = {
	name: "Custom Header",
	render: () => {
		const CustomHeaderExample = () => {
			const pickerProps = useTimePickerProps({ id: "custom-header" });
			const defaultTimeFormat = TimeUtils.getTimeFormat();

			const customHeaderElement = useCallback(
				(time: Date | undefined, closeHandler: (() => void) | undefined): ReactNode => (
					<TimePickerTpl.Header actionButtons={<PickerHeaderCloseButton title="Close" onClick={closeHandler} />}>
						<strong>{time ? TimeUtils.formatUTCTime(time, undefined, defaultTimeFormat) : defaultTimeFormat}</strong>
					</TimePickerTpl.Header>
				),
				[defaultTimeFormat]
			);

			return (
				<div style={{ width: 320 }}>
					<TimePicker
						{...pickerProps}
						label="Time Picker with custom header"
						customHeaderElement={customHeaderElement}
					/>
				</div>
			);
		};

		return <CustomHeaderExample />;
	}
};

export const Timezone: Story = {
	name: "Timezone",
	render: () => {
		const TimezoneExample = () => {
			const timezone = "America/New_York";

			const defaultValue = useMemo(() => {
				const now = new Date();
				const normalized = DateTimeUtils.normalizeDateValue(now);
				const dateUTC = TimeUtils.convertTimezoneDateToUTC(now, timezone) ?? now;

				normalized.setUTCHours(dateUTC.getUTCHours());
				normalized.setUTCMinutes(dateUTC.getUTCMinutes());
				normalized.setUTCSeconds(0);

				return TimeUtils.convertUTCToTimezoneDate(normalized, timezone);
			}, []);

			const pickerProps = useTimePickerProps({ defaultValue, timezone, id: "timezone-time-picker" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker {...pickerProps} label={`With ${timezone} timezone`} timezone={timezone} />
				</div>
			);
		};

		return <TimezoneExample />;
	}
};

export const CustomFormat: Story = {
	name: "Custom Format",
	render: () => {
		const CustomFormatExample = () => {
			const TIME_FORMAT = "hh.mm A";

			const timeFormatter = useCallback(
				(time?: Date): string => {
					if (!time) {
						return "";
					}

					return TimeUtils.formatUTCTime(time, undefined, TIME_FORMAT);
				},
				[TIME_FORMAT]
			);

			const timeConverter = useCallback((timeString: string): Date | undefined => {
				const timeUTC = parseIncompleteTime(timeString);

				if (!timeUTC) {
					return undefined;
				}

				return DateTimeUtils.normalizeDateValue(timeUTC);
			}, []);

			const pickerProps = useTimePickerProps({ id: "custom-format-time-picker" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker
						{...pickerProps}
						label="Custom Format (hh.mm A)"
						placeholder={TIME_FORMAT}
						timeFormatter={timeFormatter}
						timeConverter={timeConverter}
					/>
				</div>
			);
		};

		return <CustomFormatExample />;
	}
};

export const Accessibility: Story = {
	name: "Accessibility",
	render: () => {
		const AccessibilityExample = () => {
			const pickerProps = useTimePickerProps({ id: "accessibility-time-picker" });

			return (
				<div style={{ width: 320 }}>
					<TimePicker
						{...pickerProps}
						label="Accessible Time Picker"
						desktopPickerAttributes={{ "aria-label": "Desktop Accessible Time Picker" }}
						mobilePickerAttributes={{ "aria-label": "Mobile Accessible Time Picker" }}
					/>
				</div>
			);
		};

		return <AccessibilityExample />;
	}
};
