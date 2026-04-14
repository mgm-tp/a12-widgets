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
import { useCallback, useState } from "react";
import { isSameDay } from "date-fns";

import { Calendar, Status } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DayEvent, SelectedDayEvent } from "./shared/data.js";
import { calendarDays, disabledDays, holidays } from "./shared/data.js";

export const WeekView = () => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedItem, setSelectedItem] = useState<SelectedDayEvent | undefined>(undefined);

	const dayItemContentRenderer = useCallback((date: Date, event?: DayEvent): ReactNode => {
		return event && <WeekViewContent {...event} />;
	}, []);

	return (
		<div className="-u-width-full -u-overflow-x-auto">
			<div style={{ height: 1200, minWidth: 750 }}>
				<Calendar
					view="week"
					weekStartsOn={0}
					date={new Date(2025, 4, 27)}
					highlightedWeekends
					highlightedPublicHolidays
					publicHolidays={holidays}
					calendarDateItems={calendarDays}
					selectedDate={selectedDate}
					onDayClick={setSelectedDate}
					selectedItem={selectedItem}
					onItemClick={setSelectedItem}
					componentRenderers={{
						dayItemContentRenderer
					}}
					isDisabledDay={(date) => !!disabledDays.find((disabled) => isSameDay(disabled, date))}
				/>
			</div>
		</div>
	);
};

const WeekViewContent = ({ id, title, author, status }: DayEvent) => {
	return (
		<div>
			<Status style={{ paddingInline: 5 }} variant={status}>
				{status}
			</Status>
			<p>{`ID: ${id}`}</p>
			<p>{`title: ${title}`}</p>
			<p>
				<span>Host: </span>
				<strong>{author}</strong>
			</p>
		</div>
	);
};
