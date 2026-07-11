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
import DateInputPropsAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/datepicker/main/date-input.api.json" with { type: "json" };
import DatePickerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/datepicker/main/date-picker.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { AdditionalProps } from "./additional-props.js";
import { BasicDatePickerShowcase } from "./basic.js";
import { DateRangePicker } from "./date-range.js";
import { Timezone } from "./timezone.js";
import { AccessibilityDatePickerShowcase } from "./accessibility-date-picker.js";

import additionalPropsCode from "!./additional-props.tsx?raw";
import basicDatePickerCode from "!./basic.tsx?raw";
import dateRangePickerCode from "!./date-range.tsx?raw";
import timezoneCode from "!./timezone.tsx?raw";
import datePickerInputCode from "!./date-picker-input.tsx?raw";
import accessibilityCode from "!./accessibility-date-picker.tsx?raw";

const datePickerInput = { name: "date-picker-input.tsx", code: datePickerInputCode };

const showcases: Showcase[] = [
	{
		label: "Date Picker",
		description: (
			<>
				<p>
					The <strong>Date Picker</strong> Widget is an input component that allows users to select a date. It was built
					on top of the <ExternalLink href="https://react-day-picker.js.org/">react-day-picker</ExternalLink> library.
				</p>
				<p>
					The <strong>Date Picker</strong> uses the <strong>Text Field</strong>, therefore it inherits some general
					features from the Text Field such as states, messages, helper text, etc. Visit the{" "}
					<Link href="#/widgets/data-entry/text-field">Text Field</Link> showcase to see these common features demoed.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicDatePickerShowcase />,
				description: (
					<>
						<p>
							We provide the <strong>DateInput</strong> widget which is enhanced to receive an input in a "smart" way
							that a user can specify a date quickly without using the picker. Besides, a button is also provided to
							open the picker dialog.
						</p>
						<p>
							If users enter a valid value, it will be converted to a date which is handled in the{" "}
							<code>dateConverter</code> and <code>dateFormatter</code>. Otherwise, an <code>errorMessage</code> will be
							displayed.
						</p>
					</>
				),
				code: [{ name: "basic.tsx", code: basicDatePickerCode }, datePickerInput]
			},
			{
				label: "Additional Properties",
				content: <AdditionalProps />,
				description: {
					info: (
						<>
							<p>
								Use the <code>datePickerProps</code> to access the{" "}
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
								In the example below, we've customized the available range of years, and disabled Saturdays/Sundays.
								Disabled days (easily identifiable due to their lighter colors), cannot be selected or interacted with
								via the picker. If you try to enter a disabled date using the input, an error message will be shown.
							</p>
							<p>
								Additionally, with the recent upgrade to <strong>React DayPicker v9</strong>, locale customization now
								requires using <code>DateTimeContext.Provider</code>. This means the <code>locale</code> is no longer
								passed directly via <code>datePickerProps</code>, but must be provided through context using{" "}
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
								our <strong>Date Picker</strong> Widget using these options may not behave as expected and can lead to
								styling issues for date modifiers (e.g., highlighted or booked days, as shown in the example below).
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
				code: [{ name: "additional-props.tsx", code: additionalPropsCode }, datePickerInput]
			},
			{
				label: "Date Range",
				content: <DateRangePicker />,
				description: (
					<>
						<p>
							This example shows how to select a range of days by using the <strong>DateInput</strong> widget. Here are
							some important properties that should be noted:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>useRangePicker</code> to enable this feature.
							</BulletList.Item>
							<BulletList.Item>
								<code>dateConverter</code> to convert the range in string to be a range in your format. It returns an
								object <code>{`{from, to}`}</code> which contains the start date and end date.
							</BulletList.Item>
							<BulletList.Item>
								<code>errorMessage</code> to display a message when the value is invalid.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							If you'd like to implement the Date Range Picker by yourself, use the <strong>DatePicker</strong> widget
							and some main properties below:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>{`selected={{ from, to }}`}</code> to display a range of days as selected.
							</BulletList.Item>
							<BulletList.Item>
								<code>onDateRangeChange(range)</code> with the given selected <code>range</code> as an argument to
								handle the selected range.
							</BulletList.Item>
							<BulletList.Item>
								<code>footer</code> to pass a custom footer or the labels for the submit and clear buttons in the
								default one.
								<p>
									<strong>Note:</strong> On touch devices, we use the <code>DatePickerDialog</code> component, so the{" "}
									<code>footer</code> property will be ignored. Instead, we have the <code>submitButton</code> and{" "}
									<code>clearButton</code> to submit and clear the date. To handle these two functionalities, use the{" "}
									<code>onDateRangeChange</code> mentioned above.
								</p>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							In this example, you can either enter or select a range. The dates selected should not be disabled and the
							range should conform to the following format: <strong>MM/DD/YYYY - MM/DD/YYYY</strong> (e.g. 11/12/2021 -
							11/22/2021). If the entry is invalid, an error message will be shown.
						</p>
					</>
				),
				code: [{ name: "date-range.tsx", code: dateRangePickerCode }, datePickerInput]
			},
			{
				label: "Timezone",
				description: (
					<>
						<p>
							The date will be returned according to the given <code>timezone</code> from the{" "}
							<code>datePickerProps</code>. When using <code>timezone</code>, you should adjust{" "}
							<code>dateFormatter</code> and <code>dateConverter</code> to be consistent with <code>timezone</code>{" "}
							value.
						</p>
						<p>
							The value of the <code>timezone</code> property should be one of those listed in the{" "}
							<ExternalLink href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List">
								Timezone Database Name
							</ExternalLink>
							.
						</p>
						<p>
							<strong>Note:</strong> If the <code>timezone</code> is not specified, the input date will be handled
							according to the Coordinated Universal Time (UTC).
						</p>
					</>
				),
				content: <Timezone />,
				code: [{ name: "timezone.tsx", code: timezoneCode }, datePickerInput]
			},
			{
				label: "Accessibility",
				content: <AccessibilityDatePickerShowcase />,
				description: {
					info: (
						<>
							<p>To ensure proper accessibility for screen readers, you can use:</p>
							<BulletList.Unordered>
								<BulletList.Item>
									On desktop: <code>datePickerProps</code> property. This will apply attributes to{" "}
									<code>data-role="date-picker"</code> element.
								</BulletList.Item>
								<BulletList.Item>
									On mobile: <code>htmlAttributes</code> in <code>datePickerDialogProps</code> property. This will apply
									attributes to the picker's modal overlay container element.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							For desktop, since it uses the <strong>DayPicker</strong> component from the{" "}
							<strong>react-day-picker</strong> library, you can only use the properties which provided in{" "}
							<code>datePickerProps</code> to pass the accessibility attributes.
						</p>
					)
				},
				code: [{ name: "accessibility-date-picker.tsx", code: accessibilityCode }, datePickerInput]
			}
		]
	}
];

export default {
	label: "Date Picker",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: DateInputPropsAPI },
			{
				declaration: DatePickerAPI,
				filter: ["DatePickerProps"]
			}
		],
		themingConfiguration: "datePicker"
	}
};
