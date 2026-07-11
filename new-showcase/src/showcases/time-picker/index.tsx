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

import TimePickerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/time-picker/main/time-picker.api.json" with { type: "json" };
import { BulletList, ExternalLink, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { BasicShowcase } from "./basic.js";
import { ContextTimeModeShowcase } from "./context-time-mode.js";
import { CustomHeader } from "./custom-header.js";
import { TimezoneShowcase } from "./timezone.js";
import { CustomFormatShowcase } from "./custom-format.js";
import { AccessibilityShowcase } from "./accessibility-time-picker.js";

import basicCode from "!./basic.tsx?raw";
import contextTimeModeCode from "!./context-time-mode.tsx?raw";
import customHeaderCode from "!./custom-header.tsx?raw";
import timezoneCode from "!./timezone.tsx?raw";
import customFormatCode from "!./custom-format.tsx?raw";
import accessibilityCode from "!./accessibility-time-picker.tsx?raw";
import useTimePickerPropsCode from "!./use-time-picker-props.tsx?raw";

const timePickerPropsCode = {
	name: "use-time-picker-props.tsx",
	code: useTimePickerPropsCode
};

const showcases: Showcase[] = [
	{
		label: "Time Picker",
		description: (
			<>
				<p>
					The <strong>Time Picker</strong> Widget is an input component that allows users to select a time.
				</p>
				<p>
					The <strong>Time Picker</strong> uses the <strong>Text Field</strong>, therefore it inherits some general
					features from the Text Field such as states, messages, helper text, etc. Visit the{" "}
					<Link href="#/widgets/data-entry/text-field">Text Field</Link> showcase to see these common features demoed.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							The <strong>Time Picker</strong> has a "smart" behavior that users can specify a time value quickly
							without using the picker, which means the input value can be converted to a valid time input (if
							reasonable). If the value does not fit (hour &gt; 24, minutes &gt; 59), an error message can be displayed.
							Use the <code>{"onValidate({ value, valid })"}</code> to handle the error message based on the returned
							params which are the current input value and the validation result.
						</p>
						<p>
							The <strong>Time Picker</strong> has 12-hour or 24-hour formats. The default is 12-hours. Use the{" "}
							<code>mode</code> property to modify it.
						</p>
					</>
				),
				content: <BasicShowcase />,
				code: [{ name: "basic.tsx", code: basicCode }, timePickerPropsCode]
			},
			{
				label: "Context Time Mode",
				description: (
					<p>
						Instead of passing the <code>mode</code> property to each <strong>Time Picker</strong> individually, you can
						set the time mode globally using <code>DateTimeContext.Provider</code>. All time-related components within
						the provider will use this mode unless overridden by their own <code>mode</code> property.
					</p>
				),
				content: <ContextTimeModeShowcase />,
				code: [{ name: "context-time-mode.tsx", code: contextTimeModeCode }, timePickerPropsCode]
			},
			{
				label: "Custom Header",
				description: (
					<p>
						You can customize the dialog's header by your own custom component. Besides, we provide a renderer function
						so that you can access the chosen <code>time</code> and <code>closeHandler</code> for closing dialog.
					</p>
				),
				content: <CustomHeader />,
				code: [{ name: "custom-header.tsx", code: customHeaderCode }, timePickerPropsCode]
			},
			{
				label: "Timezone",
				description: (
					<>
						<p>
							The time will be returned by the given <code>timezone</code>. The value of the <code>timezone</code>{" "}
							should be one of the listed from the{" "}
							<ExternalLink href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List">
								Timezone Database Name
							</ExternalLink>
							.
						</p>
						<p>
							<strong>Note:</strong> If the <code>timezone</code> is not specified, the input time will be handled
							according to the Coordinated Universal Time (UTC).
						</p>
					</>
				),
				content: <TimezoneShowcase />,
				code: [{ name: "custom-header.tsx", code: timezoneCode }, timePickerPropsCode]
			},
			{
				label: "Custom Format",
				description: (
					<>
						<p>This showcase shows how to customize time format by using:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>timeFormatter</code> to format a <code>Date</code> object to a desired string representation.
							</BulletList.Item>
							<BulletList.Item>
								<code>timeConverter</code> to convert the user input to the corresponding <code>Date</code> object. If
								the input is invalid, the converter should return <code>undefined</code>.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <CustomFormatShowcase />,
				code: [{ name: "custom-header.tsx", code: customFormatCode }, timePickerPropsCode]
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>To ensure proper accessibility for screen readers, you can use:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								On desktop: <code>desktopPickerAttributes</code> property. This will apply attributes to{" "}
								<code>data-role="time-picker"</code> element.
							</BulletList.Item>
							<BulletList.Item>
								On mobile: <code>mobilePickerAttributes</code> property. This will apply attributes to the picker's
								modal overlay container element.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <AccessibilityShowcase />,
				code: [{ name: "accessibility-time-picker.tsx", code: accessibilityCode }, timePickerPropsCode]
			}
		]
	}
];

export default {
	label: "Time Picker",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: TimePickerAPI,
				filter: [
					"TimePickerProps",
					"TimePickerProps.Renderer",
					"TimePickerProps.TimeFormatter",
					"TimePickerProps.TimeConverter"
				]
			}
		],
		themingConfiguration: "timePicker"
	}
};
