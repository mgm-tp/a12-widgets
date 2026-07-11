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

import { BulletList, ExternalLink, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import DateTimePropsAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/date-time-picker/main/date-time-picker.api.json" with { type: "json" };
import DateTimePickerDialogPropsAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/date-time-picker/main/wrapper/date-time-picker-dialog.api.json" with { type: "json" };
import DateTimePickerTimeInputAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/date-time-picker/main/wrapper/date-time-picker.time-input.api.json" with { type: "json" };
import DateTimePickerInputAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/date-time-picker/main/wrapper/date-time-picker-input.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { DateTimePickerInputWithTimezone } from "./date-time-picker-input.timezone.js";
import { SimpleDateTimePicker } from "./date-time-picker.simple.js";
import { DateTimeTimeButton } from "./date-time-picker.time-button.js";
import { DateTimePickerInputWithTimeInput } from "./date-time-picker-input.time-input.js";
import { DateTimePickerInputWithAdditionalProps } from "./date-time-picker-input.additional-props.js";
import { DateTimePickerInputContextTimeModeShowcase } from "./date-time-picker-input.context-time-mode.js";
import { DateTimePickerInputCustomFormat } from "./date-time-picker-input.custom-format.js";
import { AccessibilityDateTimePickerShowcase } from "./accessibility-date-time-picker.js";

import dateTimePickerInputWithTimezoneCode from "!./date-time-picker-input.timezone.tsx?raw";
import simpleDateTimePickerCode from "!./date-time-picker.simple.tsx?raw";
import dateTimeTimeButtonCode from "!./date-time-picker.time-button.tsx?raw";
import dateTimePickerInputWithTimeInputCode from "!./date-time-picker-input.time-input.tsx?raw";
import dateTimePickerInputWithAdditionalPropsCode from "!./date-time-picker-input.additional-props.tsx?raw";
import dateTimePickerInputContextTimeModeCode from "!./date-time-picker-input.context-time-mode.tsx?raw";
import dateTimePickerInputCustomFormatCode from "!./date-time-picker-input.custom-format.tsx?raw";
import accessibilityDateTimePickerCode from "!./accessibility-date-time-picker.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Date Time Picker",
		description: (
			<p>
				The <strong>Date Time Picker</strong> Widget is an input component that extends from the{" "}
				<Link href="#/widgets/data-entry/pickers/date-picker">Date Picker</Link> and{" "}
				<Link href="#/widgets/data-entry/pickers/time-picker">Time Picker</Link> Widgets and allows users to select a
				DateTime value.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <SimpleDateTimePicker />,
				description: (
					<>
						<p>
							The <strong>Date Time Picker</strong> has two modes: touchable (the picker will be shown on full screen)
							and non-touchable (the position of the picker depends on the element which is used to open it).
						</p>
						<div>
							Besides that, there are three wrappers provided for convenience:
							<BulletList.Unordered>
								<BulletList.Item>
									The <strong>DateTimePickerInput</strong> includes a text input and a date time picker.
								</BulletList.Item>
								<BulletList.Item>
									The <strong>DateTimePickerDialog</strong> opens the picker in the portal or modal overlay.
								</BulletList.Item>
								<BulletList.Item>
									The <strong>DateTimePickerTimeInput</strong> uses the text input to enter a time.
								</BulletList.Item>
							</BulletList.Unordered>
						</div>
						<p>
							The lowest level of DateTimePicker shows you how to show a basic DateTimePicker and interact with them on
							different devices.
						</p>
					</>
				),
				code: { name: "date-time-picker.simple.tsx", code: simpleDateTimePickerCode }
			},
			{
				label: "Time Button",
				content: <DateTimeTimeButton />,
				description: (
					<>
						<p>
							In this showcase, we use the <strong>DateTimePickerDialog</strong> wrapper to display the picker in the
							portal or modal overlay.
						</p>
						<p>
							You can also use the <code>pickerProps</code> property to customize the header, footer, and months.
						</p>
					</>
				),
				code: { name: "date-time-picker.time-button.tsx", code: dateTimeTimeButtonCode }
			},
			{
				label: "Time Input",
				description: (
					<p>
						Use <strong>DateTimePickerTimeInput</strong> to display the time input instead of only a button inside the
						date picker so that a user can enter a time value directly without having to open the time picker. If the
						entered value is valid, it will be converted to the time in the format automatically.
					</p>
				),
				content: <DateTimePickerInputWithTimeInput />,
				code: { name: "date-time-picker-input.time-input.tsx", code: dateTimePickerInputWithTimeInputCode }
			},
			{
				label: "Timezone",
				description: (
					<>
						<p>
							The returned date and time will be handled by the <code>timezone</code> passed in the{" "}
							<code>pickerProps</code> property.
						</p>
						<p>
							The value of <code>timezone</code> should be the{" "}
							<Link href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List">
								Timezone Database Name
							</Link>
							.
						</p>
						<p>
							<strong>Note:</strong> If <code>timezone</code> is not specified, the input date time will be handled
							according to the Coordinated Universal Time (UTC).
						</p>
					</>
				),
				content: <DateTimePickerInputWithTimezone />,
				code: { name: "date-time-picker-input.timezone.tsx", code: dateTimePickerInputWithTimezoneCode }
			},
			{
				label: "Additional Properties",
				description: {
					info: (
						<>
							<p>
								Use the <code>pickerProps</code> property to access the{" "}
								<ExternalLink href="https://daypicker.dev/v9/api/type-aliases/DayPickerProps">
									library's properties
								</ExternalLink>
								, such as:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>disabled</code>: to set the days as disabled.
								</BulletList.Item>
								<BulletList.Item>
									<code>modifiers</code>: to modify the aspect of the days, then a user can change the inline-style of
									the cell with <code>modifiersStyles</code> or with <code>modifiersClassNames</code>.
								</BulletList.Item>
								<BulletList.Item>
									<code>yearRange</code>: to modify the range of year.
								</BulletList.Item>
								<BulletList.Item>etc.</BulletList.Item>
							</BulletList.Unordered>
							<p>
								Additionally, with the recent upgrade to <strong>React DayPicker v9</strong>, locale customization now
								requires using <code>DateTimeContext.Provider</code>. This means the <code>locale</code> is no longer
								passed directly via <code>pickerProps</code>, but must be provided through context using{" "}
								<strong>date-fns</strong> locale objects.
							</p>
						</>
					),
					note: (
						<>
							<p>
								Starting from <strong>React DayPicker v9</strong>, <code>modifiersStyles</code> and{" "}
								<code>modifiersClassNames</code> now target the outer table cell (<code>{"<td />"}</code>) instead of
								the inner interactive elements like <code>{"<button />"}</code>. As a result, custom styles applied to
								our <strong>Date Time Picker</strong> Widget using these options may not behave as expected and can lead
								to styling issues for date modifiers (e.g., highlighted or booked days, as shown in the example below).
							</p>
							<p className="-u-margin-b-0">
								To work around this, we recommend continuing to use <code>modifiersClassNames</code>, but target the
								inner interactive elements using CSS selectors.
								<br />
								For example:
							</p>
							<pre className="-u-margin-t-2xs">
								<code>{`.booked-classname > button {
  /* custom styles */
}`}</code>
							</pre>
						</>
					)
				},
				content: <DateTimePickerInputWithAdditionalProps />,
				code: [
					{
						name: "date-time-picker-input.custom-modifiers.tsx",
						code: dateTimePickerInputWithAdditionalPropsCode
					},
					{
						name: "date-time-picker-input.time-input.tsx",
						code: dateTimePickerInputWithTimeInputCode
					}
				]
			},
			{
				label: "Context Time Mode",
				description: (
					<>
						<p>
							Instead of passing <code>timeMode</code> to each <strong>Date Time Picker</strong> individually, you can
							set the time mode globally using <code>DateTimeContext.Provider</code>. All date time-related components
							within the provider will use this mode unless overridden by their own <code>timeMode</code> property.
						</p>
						<p>
							In the example below, <b>DateTimePickerInput</b> is used to display both input and picker screen.
							Therefore, the overridden <code>timeMode</code> is configured through <code>pickerProps</code> property.
						</p>
					</>
				),
				content: <DateTimePickerInputContextTimeModeShowcase />,
				code: { name: "date-time-picker-input.context-time-mode.tsx", code: dateTimePickerInputContextTimeModeCode }
			},
			{
				label: "Custom Format",
				description: (
					<>
						<p>This showcase shows how to customize date time format by using:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>dateTimeFormatter</code> to format a <code>Date</code> object to a desired string representation.
							</BulletList.Item>
							<BulletList.Item>
								<code>dateTimeConverter</code> to convert the user input to the corresponding <code>Date</code> object.
								If the input is invalid, the converter should return <code>undefined</code>.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <DateTimePickerInputCustomFormat />,
				code: { name: "date-time-picker-input.custom-format.tsx", code: dateTimePickerInputCustomFormatCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>To ensure proper accessibility for screen readers, you can use: </p>
						<BulletList.Unordered>
							<BulletList.Item>
								On desktop: <code>desktopPickerAttributes</code> property.
							</BulletList.Item>
							<BulletList.Item>
								On mobile: <code>mobilePickerAttributes</code> property.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							By default, these additional attributes are applied to the <code>data-role="date-time-picker"</code>{" "}
							element. However, when using <strong>DateTimePickerInput</strong> to display the picker, the behavior
							differs on mobile devices. In this case, the attributes are applied to the picker's modal overlay
							container element.
						</p>
						<p>
							In the example below, <strong>DateTimePickerInput</strong> is used. Therefore, additional properties are
							configured through <code>pickerProps</code> via <code>desktopPickerAttributes</code> and{" "}
							<code>mobilePickerAttributes</code>.
						</p>
					</>
				),
				content: <AccessibilityDateTimePickerShowcase />,
				code: { name: "accessibility-date-time-picker.tsx", code: accessibilityDateTimePickerCode }
			}
		]
	}
];

export default {
	label: "Date Time Picker",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: DateTimePropsAPI },
			{ declaration: DateTimePickerTimeInputAPI },
			{ declaration: DateTimePickerDialogPropsAPI },
			{ declaration: DateTimePickerInputAPI }
		],
		themingConfiguration: "dateTimePicker",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Date Time Picker</strong> is a combination of the date and time, it inherits the style
				configuration of the{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/pickers/date-picker#date-picker-theme-configuration">
					Date Picker
				</StyledShowcaseLink>{" "}
				and{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/pickers/time-picker#time-picker-theme-configuration">
					Time Picker
				</StyledShowcaseLink>{" "}
				widgets.
			</p>
		)
	}
};
