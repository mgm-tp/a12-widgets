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

import CalendarAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/experimental/calendar/main/calendar.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { MonthView } from "./month-view.js";
import { WeekView } from "./week-view.js";
import { InfiniteView } from "./infinite-view.js";

import monthViewCode from "!./month-view.tsx?raw";
import infiniteViewCode from "!./infinite-view.js?raw";
import weekViewCode from "!./week-view.tsx?raw";
import dataCode from "!./shared/data.ts?raw";
import styledCode from "!./shared/calendar.styled.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Calendar",
		description: (
			<p>
				A calendar is a tool that displays dates and helps organize events, schedules, and time-related information.
			</p>
		),
		sections: {
			basic: {
				label: "Month View",
				sections: [
					{
						label: "Month View",
						content: <MonthView />,
						description: {
							info: (
								<>
									<p>
										A calendar month view displays all days of a month in a grid format, providing a clear overview to
										easily manage events and schedules. To utilize the calendar month view, set the <code>view</code>{" "}
										property of the <code>Calendar</code> component to "month" or directly use the{" "}
										<code>CalendarMonthView</code> component.
									</p>
									<p>
										The month will be displayed based on the <code>date</code> property provided.
									</p>
									<p>
										You can customize the display of each day using the <code>monthViewComponentRenderers</code>{" "}
										property with the <code>Calendar</code> component, or the <code>componentRenderers</code> property
										with the <code>CalendarMonthView</code> component. Both <code>monthViewComponentRenderers</code> and{" "}
										<code>componentRenderers</code> use the same property to customize each part of the day layout:
									</p>
									<BulletList.Unordered>
										<BulletList.Item>
											<code>dayHeaderRenderer</code>: Renders day's header. By default, it shows the date, which can be
											formatted with <code>dateFormat</code>.
										</BulletList.Item>
										<BulletList.Item>
											<code>dayItemContentRenderer</code>: Renders the content of each item in a day. If not provided,
											the day item will be displayed without any content.
										</BulletList.Item>
										<BulletList.Item>
											<code>dayContentRenderer</code>: Renders the content of each day. If provided, item rendering must
											also be handled here, as <code>dayItemContentRenderer</code> will be ignored.
										</BulletList.Item>
										<BulletList.Item>
											<code>dayFooterRenderer</code>: Renders the footer of each day.
										</BulletList.Item>
									</BulletList.Unordered>
									<p>
										The Calendar <strong>locale</strong> is affected by <code>DateTimeContext</code>, which means you
										can change the <strong>locale</strong> by passing it to the <code>DateTimeContext</code> provider,
										similar to the{" "}
										<Link href="#/widgets/data-entry/pickers/date-picker#additional-properties">Date Picker</Link>.
									</p>
								</>
							)
						},
						fitToSection: false,
						fullSize: true,
						code: [
							{
								name: "month-view.tsx",
								code: monthViewCode
							},
							{
								name: "data.ts",
								code: dataCode
							},
							{
								name: "calendar.styled.tsx",
								code: styledCode
							}
						]
					}
				]
			},
			advanced: {
				label: "Week View",
				sections: [
					{
						label: "Week View",
						content: <WeekView />,
						description: {
							info: (
								<>
									<p>
										A week view calendar displays one week at a time, allowing users to plan and manage daily events
										with more detail and focus. To utilize the calendar week view, set the <code>view</code> property of
										the <code>Calendar</code> component to "week" or directly use the <code>CalendarWeekView</code>{" "}
										component.
									</p>
									<p>
										The week view works just like the month view, except that the <code>Calendar</code> component uses{" "}
										<code>weekViewComponentRenderers</code> for the week view instead of{" "}
										<code>monthViewComponentRenderers</code>, which is used for the month view.
									</p>
								</>
							)
						},
						fitToSection: false,
						fullSize: true,
						code: [
							{
								name: "week-view.tsx",
								code: weekViewCode
							},
							{
								name: "data.ts",
								code: dataCode
							},
							{
								name: "calendar.styled.tsx",
								code: styledCode
							}
						]
					}
				]
			},
			complex: {
				label: "Infinite View",
				sections: [
					{
						label: "Infinite View",
						content: <InfiniteView />,
						description: {
							info: (
								<>
									<p>
										The Calendar Infinite View is an extension of the Month View that allows users to scroll infinitely
										through weeks. To use the infinite view, set the <code>view</code> property of the Calendar
										component to "month", configure the number of visible weeks, and specify the minimum and maximum
										dates for infinite scrolling in the <code>infiniteScrollOptions</code> property.
									</p>
									<p>
										The <code>infiniteScrollOptions</code> property can be used to configure infinite scrolling and
										other settings related to infinite scrolling. Refer to the API tab for detailed information on all
										available options.
									</p>
									<p>Other APIs and customization options are the same as the month view.</p>
									<p>
										As the infinite view is kind of extension of the month view, all the customizations available in the
										month view also apply to the infinite view.
									</p>
								</>
							)
						},
						fitToSection: false,
						fullSize: true,
						code: [
							{
								name: "infinite-view.tsx",
								code: infiniteViewCode
							},
							{
								name: "data.ts",
								code: dataCode
							},
							{
								name: "calendar.styled.tsx",
								code: styledCode
							}
						]
					}
				]
			}
		}
	}
];

export default {
	label: "Calendar",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CalendarAPI }],
		themingConfiguration: "calendar"
	},
	useFullLayoutWithoutRightNav: true
};
