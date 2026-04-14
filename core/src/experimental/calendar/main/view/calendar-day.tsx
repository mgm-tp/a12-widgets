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

import type { ReactNode, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef } from "react";
import { format, getDay, isSameDay } from "date-fns";
import isEqual from "lodash-es/isEqual.js";
import type { Locale } from "date-fns/locale";

import { DataRoles } from "../../../../common/main/data-roles.js";

import type { CalendarDay, CalendarDayProps, SelectedItem } from "../calendar.api.js";

import {
	StyledCalendarWeekViewDayContent,
	StyledCalendarWeekViewEmptyDay
} from "./calendar-week-view/calendar-week-view.styled.js";
import {
	StyledCalendarMonthViewDayContent,
	StyledCalendarMonthViewDayHeader,
	StyledCalendarMonthViewEmptyDay
} from "./calendar-month-view/calendar-month-view.styled.js";
import { useIsChildHovered } from "./calendar-hook.internal.js";
import {
	StyledCalendarDayContent,
	StyledCalendarDayItem,
	StyledCalendarDayWrapper,
	StyledPlaceholderCalendarDayCell
} from "./calendar-day.styled.js";

const variantComponentMap = {
	week: {
		ContentComponent: StyledCalendarWeekViewDayContent,
		EmptyDay: StyledCalendarWeekViewEmptyDay,
		dataRole: DataRoles.Calendar.WeekView.DayWrapper
	},
	month: {
		ContentComponent: StyledCalendarMonthViewDayContent,
		EmptyDay: StyledCalendarMonthViewEmptyDay,
		dataRole: DataRoles.Calendar.MonthView.Day
	}
};

/** @internal */
export const PlaceHolderCalendarDayCell = (): ReactNode => {
	return <StyledPlaceholderCalendarDayCell data-role={DataRoles.Calendar.MonthView.Infinite.Placeholder} />;
};

export const CalendarDayCell = <T extends CalendarDay<E>, E>({
	variant = "week",
	date = new Date(),
	onDayClick,
	onItemClick,
	selectedItem,
	highlightedWeekends,
	highlightedPublicHolidays,
	items,
	componentRenderers = {
		dayHeaderRenderer: undefined,
		dayContentRenderer: undefined,
		dayItemContentRenderer: undefined,
		dayFooterRenderer: undefined
	},
	publicHolidays,
	selectedDate,
	locale,
	dateFormatter,
	isOutsideDay,
	display,
	getDayStyles,
	getDayClassName
}: CalendarDayProps<T, E> & {
	variant?: "week" | "month";
	locale?: Locale;
}): ReactNode => {
	const { ContentComponent, dataRole, EmptyDay } = variantComponentMap[variant];
	const isWeekVariant = variant === "week";

	const isSelectEvent = (event: MouseEvent | KeyboardEvent): boolean => {
		const nativeEvent = event.nativeEvent;
		const selectByMouse = nativeEvent instanceof MouseEvent;
		const selectByKey = nativeEvent instanceof KeyboardEvent && nativeEvent.key === "Enter";

		return selectByMouse || selectByKey;
	};

	const handleItemSelect = useCallback(
		(event: MouseEvent | KeyboardEvent, selectedItem: SelectedItem<E>) => {
			if (isSelectEvent(event)) {
				onItemClick?.(selectedItem);
			}
		},
		[onItemClick]
	);

	const handleDaySelect = useCallback(
		(event: MouseEvent | KeyboardEvent, selectedDay: { date: Date; items: E[] }) => {
			if (isSelectEvent(event)) {
				onDayClick?.(selectedDay.date, selectedDay.items);
			}
		},
		[onDayClick]
	);

	const isWeekendDay = highlightedWeekends && (getDay(date) === 0 || getDay(date) === 6);
	const isHighlightedAsHolidays =
		highlightedPublicHolidays && publicHolidays?.some((holiday) => isSameDay(holiday, date));
	const isDateSelected = selectedDate && isSameDay(selectedDate, date);

	const dayWrapperRef = useRef<HTMLDivElement | null>(null);

	const isDayWrapperChildHovered = useIsChildHovered(dayWrapperRef);

	const {
		dayHeaderRenderer = (date: Date): ReactNode => (
			<StyledCalendarMonthViewDayHeader data-role={DataRoles.Calendar.MonthView.Day.Header}>
				{dateFormatter?.(date) ?? format(date, "dd-MM", { locale })}
			</StyledCalendarMonthViewDayHeader>
		),
		dayContentRenderer = (date: Date, items?: E[]): ReactNode => {
			return (
				<StyledCalendarDayContent
					data-role={isWeekVariant ? DataRoles.Calendar.WeekView.DayContent : DataRoles.Calendar.MonthView.Day.Content}
					$variant={variant}
				>
					{items?.map((item, index) => {
						const isItemSelected =
							selectedItem && isSameDay(selectedItem?.date, date) && isEqual(item, selectedItem.item);

						return (
							<StyledCalendarDayItem
								key={date?.toString() + index}
								tabIndex={display === "active" ? 0 : -1}
								onClick={(clickEvent: MouseEvent<HTMLElement>) => handleItemSelect(clickEvent, { date, item })}
								onKeyDown={(keyboardEvent: KeyboardEvent) => handleItemSelect(keyboardEvent, { date, item })}
								data-role={
									isWeekVariant
										? DataRoles.Calendar.WeekView.DayContent.Item
										: DataRoles.Calendar.MonthView.Day.Content.Item
								}
								$variant={variant}
								$selected={isItemSelected}
							>
								{componentRenderers.dayItemContentRenderer?.(date, item) ?? ""}
							</StyledCalendarDayItem>
						);
					})}
				</StyledCalendarDayContent>
			);
		},
		dayFooterRenderer
	} = componentRenderers;

	if (display === "none") {
		return <EmptyDay />;
	}

	return (
		<StyledCalendarDayWrapper
			ref={dayWrapperRef}
			data-role={dataRole}
			data-day={format(date, "yyyy-MM-dd")}
			data-outside={isOutsideDay || undefined}
			style={getDayStyles?.(date, items ?? [])}
			className={getDayClassName?.(date, items ?? [])}
			tabIndex={display === "active" ? 0 : -1}
			onClick={(clickEvent: MouseEvent) => handleDaySelect(clickEvent, { date, items: items ?? [] })}
			onKeyDown={(keyboardEvent: KeyboardEvent) => handleDaySelect(keyboardEvent, { date, items: items ?? [] })}
			$variant={variant}
			$isSelected={isDateSelected}
			$isWeekendDay={isWeekendDay}
			$isCurrentDate={isSameDay(new Date(), date)}
			$isPublicHolidays={isHighlightedAsHolidays}
			$isOutsideDay={isOutsideDay}
			$isDisabled={display === "disabled"}
			$isChildHovered={isDayWrapperChildHovered}
		>
			{variant === "month" && dayHeaderRenderer?.(date)}
			<ContentComponent
				tabIndex={display === "disabled" ? -1 : undefined}
				data-role={
					isWeekVariant
						? DataRoles.Calendar.WeekView.DayContent.Wrapper
						: DataRoles.Calendar.MonthView.Day.Content.Wrapper
				}
			>
				{dayContentRenderer(date, items)}
			</ContentComponent>
			{dayFooterRenderer?.(date)}
		</StyledCalendarDayWrapper>
	);
};

CalendarDayCell.displayName = "CalendarDayCell";
