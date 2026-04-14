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

import type { ReactElement, ReactNode } from "react";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Day } from "date-fns";
import {
	addDays,
	differenceInCalendarWeeks,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isSameDay,
	parseISO,
	startOfWeek
} from "date-fns";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTheme } from "styled-components";

import type {
	CalendarDay,
	CalendarInfiniteScrollOptions,
	CalendarMonthViewProps,
	DayDisplay
} from "../../../calendar.api.js";
import { DateTimeContext } from "../../../../../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../../../../../common/main/data-roles.js";
import { getWeekDates } from "../../utils.internal.js";
import { useMonthViewNavigateByKey, WEEK_DAYS_NUM } from "../../calendar-hook.internal.js";
import { CalendarDayCell, PlaceHolderCalendarDayCell } from "../../calendar-day.js";
import { useEffectWithDebounce } from "../../../../../../common/main/hooks.js";
import { getVerticalGap } from "../../../../../../common/main/utils/css-utils.js";

import { CalendarMonthViewHeader } from "../calendar-month-view-header.js";

import {
	StyledCalendarInfiniteMonthViewWrapper,
	StyledCalendarInfiniteScrollContainer,
	StyledCalendarInfiniteViewTable,
	StyledCalendarInfiniteViewWeek
} from "./calendar-infinite-view.styled.js";

const DEFAULT_THRESHOLD = 10;
const WHEEL_SNAP_DEBOUNCE_MS = 500;
const DATA_LOAD_DEBOUNCE_MS = 300;
const RESIZE_END_DEBOUNCE_MS = 500;
const FOCUS_RESTORE_DELAY_MS = 300;

const calculateWeekDateRange = ({
	startIndex,
	endIndex,
	minDate,
	weekStartsOn
}: {
	startIndex: number;
	endIndex: number;
	minDate: Date;
	weekStartsOn: Day;
}): { startDate: Date; endDate: Date } => {
	const startDate = startOfWeek(addDays(minDate, startIndex * 7), {
		weekStartsOn
	});

	const endDate = endOfWeek(addDays(minDate, endIndex * 7), {
		weekStartsOn
	});

	return {
		startDate,
		endDate
	};
};

/** @internal */
export const CalendarInfiniteView = <T extends CalendarDay<E>, E>({
	date = new Date(),
	calendarDateItems,
	weekStartsOn = 1, // Default to Monday,
	weekDayFormatter,
	outsideDayDisplay = "disabled",
	isDisabledDay,
	dateFormatter,
	onDayClick,
	onItemClick,
	selectedItem,
	highlightedWeekends,
	highlightedPublicHolidays,
	publicHolidays,
	selectedDate,
	getDayStyles,
	getDayClassName,
	getWeekClassName,
	getWeekStyles,
	infiniteScrollOptions,
	...rest
}: CalendarMonthViewProps<T, E> & { infiniteScrollOptions: CalendarInfiniteScrollOptions }): ReactElement => {
	const { locale } = useContext(DateTimeContext);
	const {
		components: {
			calendar: { monthView }
		}
	} = useTheme();

	const {
		displayWeeksCount,
		minDate,
		maxDate,
		threshold = DEFAULT_THRESHOLD,
		loadData,
		onVisibleRangeChange,
		weekScrollSnapType = "none",
		dateLoadingStatus,
		scrollToDate,
		visibleThreshold,
		restoreFocusOnHeightChange = true
	} = infiniteScrollOptions;

	const placeholderRenderer =
		rest.componentRenderers?.placeholderRenderer ?? ((): ReactNode => <PlaceHolderCalendarDayCell />);

	const weekCount =
		differenceInCalendarWeeks(maxDate, minDate, {
			weekStartsOn
		}) + 1;

	const [weekHeight, setWeekHeight] = useState(0);

	const [virtualRange, setVirtualRange] = useState<{ startIndex: number; endIndex: number } | null>(null);
	const [focusOnScrollEndDate, setFocusOnScrollEndDate] = useState<Date | null>(null);

	const calendarTableBodyRef = useRef<HTMLDivElement | null>(null);
	const weekVirtualizerParentRef = useRef<HTMLDivElement | null>(null);
	const isInitialDataLoadedRef = useRef(false);
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isScrollingRef = useRef(false);
	const isSnappingRef = useRef(false);
	const lastFocusedDateRef = useRef<Date | null>(null);

	const preResizeRef = useRef<{
		focusDataDay: string | undefined;
		startIndex: number | undefined;
		endTimer: ReturnType<typeof setTimeout> | null;
	}>({ focusDataDay: undefined, startIndex: undefined, endTimer: null });

	const rowGap = getVerticalGap(monthView.gap);

	const virtualRangeRef = useRef(virtualRange);
	virtualRangeRef.current = virtualRange;

	// Capture the startIndex of the first visible week and focused element before resize and reset them after resize ends in RESIZE_END_DEBOUNCE_MS milliseconds.
	const capturePreResize = useCallback((): void => {
		const container = weekVirtualizerParentRef.current;
		const preResize = preResizeRef.current;

		if (isInitialDataLoadedRef.current && preResize.startIndex === undefined) {
			preResize.startIndex = virtualRangeRef.current?.startIndex;

			const activeEl = document.activeElement;

			if (container?.contains(activeEl)) {
				const dayCell = activeEl?.closest("[data-day]");
				const dayStr = dayCell?.getAttribute("data-day");

				if (dayStr) {
					preResize.focusDataDay = dayStr;
				}
			}
		}

		if (preResize.endTimer !== null) {
			clearTimeout(preResize.endTimer);
		}

		preResize.endTimer = setTimeout(() => {
			preResize.startIndex = undefined;
			preResize.focusDataDay = undefined;
			preResize.endTimer = null;
		}, RESIZE_END_DEBOUNCE_MS);
	}, []);

	// Calculate weekHeight from container height and displayWeeksCount
	useEffect(() => {
		const container = weekVirtualizerParentRef.current;

		if (!container) {
			return;
		}

		const calculateWeekHeight = (): void => {
			const containerHeight = container.clientHeight;
			const totalGapHeight = rowGap * (displayWeeksCount - 1);
			const calculatedWeekHeight = Math.ceil((containerHeight - totalGapHeight) / displayWeeksCount);

			capturePreResize();

			setWeekHeight(calculatedWeekHeight);
		};

		calculateWeekHeight();

		const resizeObserver = new ResizeObserver(() => {
			calculateWeekHeight();
		});

		resizeObserver.observe(container);

		return (): void => {
			resizeObserver.disconnect();
		};
	}, [capturePreResize, displayWeeksCount, rowGap]);

	const getWeekDaysData = (
		weekIndexOffset: number
	): {
		date: Date;
		items: E[];
		display: DayDisplay;
	}[] => {
		const weekDays = getWeekDates(minDate, weekStartsOn, weekIndexOffset * 7);

		return weekDays.map((currentDate) => {
			const items = calendarDateItems.find((day) => day && isSameDay(day.date, currentDate))?.items ?? [];
			const isOutsideDay = (maxDate && isAfter(currentDate, maxDate)) || (minDate && isBefore(currentDate, minDate));
			const display = isDisabledDay?.(currentDate, items) ? "disabled" : isOutsideDay ? outsideDayDisplay : "active";

			return {
				date: currentDate,
				items,
				display,
				isOutsideDay
			};
		});
	};

	const handleLoadData = useCallback(
		(startIndex: number, endIndex: number): void => {
			if (loadData) {
				const { startDate, endDate } = calculateWeekDateRange({ startIndex, endIndex, minDate, weekStartsOn });
				loadData(startDate, endDate);
			}
		},
		[loadData, minDate, weekStartsOn]
	);

	// Store latest callbacks and values in refs to avoid stale closures
	const onVisibleRangeChangeRef = useRef(onVisibleRangeChange);

	useEffect(() => {
		onVisibleRangeChangeRef.current = onVisibleRangeChange;
	}, [onVisibleRangeChange]);

	// Calling onVirtualDateRangeChange should only depend on startIndex and endIndex changes
	useEffect(() => {
		const { startIndex, endIndex } = virtualRange ?? {};

		if (startIndex !== undefined && endIndex !== undefined) {
			if (onVisibleRangeChangeRef.current) {
				const { startDate, endDate } = calculateWeekDateRange({ startIndex, endIndex, minDate, weekStartsOn });
				onVisibleRangeChangeRef.current(startDate, endDate);
			}
		}
	}, [virtualRange, minDate, weekStartsOn]);

	// Reload data when virtualRange changes and date data is not loaded
	useEffectWithDebounce(
		() => {
			const { startIndex, endIndex } = virtualRange ?? {};

			if (startIndex !== undefined && endIndex !== undefined) {
				const { startDate, endDate } = calculateWeekDateRange({ startIndex, endIndex, minDate, weekStartsOn });
				// loop through startDate to endDate week by week and check if data is loaded
				let currentDate = startDate;
				let allDataLoaded = true;

				while (currentDate <= endDate) {
					// Check if data for the week is loaded
					if (dateLoadingStatus(currentDate) !== "loaded") {
						allDataLoaded = false;
						break;
					}

					currentDate = addDays(currentDate, 1);
				}

				if (!allDataLoaded) {
					handleLoadData?.(startIndex - threshold, endIndex + threshold);
				}
			}
		},
		[virtualRange, minDate, weekStartsOn],
		DATA_LOAD_DEBOUNCE_MS
	);

	const onVirtualizerChange = useCallback(
		(virtualizer: Virtualizer<HTMLDivElement, Element>) => {
			// Initial load
			if (!isInitialDataLoadedRef.current) {
				virtualizer.scrollToIndex(differenceInCalendarWeeks(date, minDate, { weekStartsOn }), { align: "start" });
				isInitialDataLoadedRef.current = true;

				return;
			}

			let startIndex: number | undefined;
			let endIndex: number | undefined;

			if (visibleThreshold !== undefined) {
				const scrollTop = virtualizer.scrollOffset ?? 0;
				const containerHeight = weekVirtualizerParentRef.current?.clientHeight ?? 0;
				const scrollBottom = scrollTop + containerHeight;

				// Resolve threshold string to a pixel value per item
				const resolveThresholdPx = (itemSize: number): number => {
					if (visibleThreshold.endsWith("%")) {
						const pct = parseFloat(visibleThreshold) / 100;

						return itemSize * pct;
					}

					return parseFloat(visibleThreshold);
				};

				const visibleItems = virtualizer.getVirtualItems().filter((item) => {
					const visiblePx = Math.min(item.start + item.size, scrollBottom) - Math.max(item.start, scrollTop);

					return visiblePx >= resolveThresholdPx(item.size);
				});

				if (visibleItems.length === 0) {
					return;
				}

				startIndex = visibleItems[0].index;
				endIndex = visibleItems[visibleItems.length - 1].index;
			} else {
				({ startIndex, endIndex } = virtualizer.range ?? {});
			}

			if (startIndex === undefined || endIndex === undefined) {
				return;
			}

			if (startIndex !== virtualRange?.startIndex || endIndex !== virtualRange?.endIndex) {
				setVirtualRange({ startIndex, endIndex });
			}
		},
		[minDate, virtualRange, date, weekStartsOn, visibleThreshold]
	);

	const { measure, scrollToIndex, range, getVirtualItems, getTotalSize, isScrolling, scrollDirection } = useVirtualizer(
		{
			count: weekCount,
			getScrollElement: () => weekVirtualizerParentRef.current,
			estimateSize: () => weekHeight,
			onChange: onVirtualizerChange,
			gap: rowGap
		}
	);

	const focusToDate = useCallback((targetDate: Date): void => {
		const container = weekVirtualizerParentRef.current;

		if (container) {
			const targetDateStr = format(targetDate, "yyyy-MM-dd");
			const dayCell = container.querySelector(
				`[data-role="${DataRoles.Calendar.MonthView.Day}"][data-day="${targetDateStr}"]`
			);

			if (dayCell) {
				(dayCell as HTMLElement).focus();
			}
		}
	}, []);

	const focusRestoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Remeasure virtualizer when weekHeight changes and restore visible position and focus
	useEffect(() => {
		let rafId: ReturnType<typeof requestAnimationFrame> | null = null;

		if (weekHeight > 0) {
			const startIndex = preResizeRef.current.startIndex;
			const focusDataDay = preResizeRef.current.focusDataDay;
			measure();

			if (startIndex !== undefined && isInitialDataLoadedRef.current) {
				const lastIndex = differenceInCalendarWeeks(maxDate, minDate, {
					weekStartsOn
				});
				const differentWeekToMaxDate = lastIndex - startIndex;

				const scrollTargetIndex = differentWeekToMaxDate <= displayWeeksCount ? lastIndex : startIndex;

				rafId = requestAnimationFrame(() => {
					scrollToIndex(scrollTargetIndex, { align: "start", behavior: "auto" });
				});
			}

			if (focusDataDay !== undefined && restoreFocusOnHeightChange) {
				focusRestoreTimeoutRef.current = setTimeout(() => {
					focusToDate(parseISO(focusDataDay));
					focusRestoreTimeoutRef.current = null;
				}, FOCUS_RESTORE_DELAY_MS);
			}
		}

		return (): void => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}

			if (focusRestoreTimeoutRef.current !== null) {
				clearTimeout(focusRestoreTimeoutRef.current);
				focusRestoreTimeoutRef.current = null;
			}
		};
	}, [
		focusToDate,
		measure,
		scrollToIndex,
		weekHeight,
		displayWeeksCount,
		maxDate,
		minDate,
		weekStartsOn,
		restoreFocusOnHeightChange
	]);

	// Implement scrollToDate functionality
	useEffect(() => {
		if (scrollToDate) {
			scrollToDate((targetDate, shouldFocus) => {
				// Calculate the week index in the virtualizer
				const targetWeekIndex = differenceInCalendarWeeks(targetDate, minDate, { weekStartsOn });

				if (targetWeekIndex >= 0 && targetWeekIndex < weekCount) {
					scrollToIndex(targetWeekIndex, {
						align: "start",
						behavior: "smooth"
					});

					// If shouldFocus is true, focus on the specific date
					if (shouldFocus) {
						setFocusOnScrollEndDate(targetDate);
						focusToDate(targetDate);
					}
				}
			});
		}
	}, [scrollToDate, weekCount, date, weekStartsOn, focusToDate, minDate, scrollToIndex]);

	useEffect(() => {
		const scrollContainer = weekVirtualizerParentRef.current;
		const handleScrollEnd = (): void => {
			if (focusOnScrollEndDate) {
				focusToDate(focusOnScrollEndDate);
				setFocusOnScrollEndDate(null);
			}
		};

		scrollContainer?.addEventListener("scrollend", handleScrollEnd);

		return (): void => {
			scrollContainer?.removeEventListener("scrollend", handleScrollEnd);
		};
	}, [focusOnScrollEndDate, focusToDate]);

	// Track the last focused day cell so focus can be restored after data loads
	useEffect(() => {
		const container = weekVirtualizerParentRef.current;

		if (!container) {
			return;
		}

		const onFocusIn = (event: FocusEvent): void => {
			const dataDay = (event.target as HTMLElement)
				.closest(`[data-role="${DataRoles.Calendar.MonthView.Day}"]`)
				?.getAttribute("data-day");

			if (dataDay) {
				lastFocusedDateRef.current = new Date(dataDay);
			}
		};

		container.addEventListener("focusin", onFocusIn);

		return (): void => {
			container.removeEventListener("focusin", onFocusIn);
		};
	}, []);

	// Restore focus to the last focused day cell when calendarDateItems updates (e.g. after async data load)
	useEffect(() => {
		const lastDate = lastFocusedDateRef.current;
		const container = weekVirtualizerParentRef.current;

		if (!lastDate || !container) {
			return;
		}

		if (!container.contains(document.activeElement)) {
			focusToDate(lastDate);
		}
	}, [calendarDateItems, focusToDate]);

	const renderWeek = (virtualRow: VirtualItem): ReactNode => {
		return (
			<StyledCalendarInfiniteViewWeek
				key={virtualRow.index}
				style={{
					...getWeekStyles?.(virtualRow.index),
					height: virtualRow.size,
					transform: `translateY(${virtualRow.start}px)`
				}}
				className={getWeekClassName?.(virtualRow.index)}
				data-role={DataRoles.Calendar.MonthView.Week}
				$columnNum={WEEK_DAYS_NUM}
			>
				{getWeekDaysData(virtualRow.index).map((weekDate) =>
					dateLoadingStatus(weekDate.date) === "loaded" ? (
						<CalendarDayCell
							key={weekDate.date.toDateString()}
							variant="month"
							onDayClick={onDayClick}
							onItemClick={onItemClick}
							selectedItem={selectedItem}
							highlightedWeekends={highlightedWeekends}
							highlightedPublicHolidays={highlightedPublicHolidays}
							componentRenderers={rest.componentRenderers}
							publicHolidays={publicHolidays}
							selectedDate={selectedDate}
							locale={locale}
							dateFormatter={dateFormatter}
							getDayStyles={getDayStyles}
							getDayClassName={getDayClassName}
							{...weekDate}
						/>
					) : (
						<Fragment key={weekDate.date.toDateString()}>{placeholderRenderer()}</Fragment>
					)
				)}
			</StyledCalendarInfiniteViewWeek>
		);
	};

	useEffect(() => {
		isScrollingRef.current = isScrolling;

		// Clear snapping flag when the snap-triggered scroll finishes
		if (!isScrolling && isSnappingRef.current) {
			isSnappingRef.current = false;
		}
	}, [isScrolling]);

	useEffect(() => {
		const container = weekVirtualizerParentRef.current;

		if (!container) {
			return;
		}

		// Handle scrollbar interaction - snap to week based on scroll direction on mouseup
		const snapToNearestWeek = (scrollDirection: "forward" | "backward" | null): void => {
			if (weekScrollSnapType !== "mandatory") {
				return;
			}

			const container = weekVirtualizerParentRef.current;

			if (!container) {
				return;
			}

			// Get current range from virtualizer
			const startIndex = range?.startIndex ?? 0;

			// Calculate target week index based on scroll direction and virtualizer range
			let targetWeekIndex: number;

			if (scrollDirection === "forward") {
				// Scrolling down - use the start index of visible range (first fully visible week)
				targetWeekIndex = startIndex + 1;
			} else if (scrollDirection === "backward") {
				// Scrolling up - use the start index
				targetWeekIndex = startIndex;
			} else {
				// No movement - stay at current start index
				targetWeekIndex = startIndex;
			}

			const targetIndex = Math.max(0, Math.min(targetWeekIndex, weekCount - 1));

			// Already aligned to a week boundary, no need to snap
			const step = weekHeight + rowGap;

			if (step > 0 && container.scrollTop % step < 1) {
				return;
			}

			isSnappingRef.current = true;
			scrollToIndex(targetIndex, {
				align: "start",
				behavior: "smooth"
			});
		};

		const handleScroll = (): void => {
			// Only handle wheel events when weekScrollSnapType is mandatory
			const scrollContainer = weekVirtualizerParentRef.current;

			if (!scrollContainer || weekScrollSnapType !== "mandatory") {
				return;
			}

			// Clear previous timeout
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}

			// Debounce: wait for scrolling to stop, then snap to nearest week in scroll direction
			scrollTimeoutRef.current = setTimeout(() => {
				if (!isScrollingRef.current) {
					snapToNearestWeek(scrollDirection);
				}
			}, WHEEL_SNAP_DEBOUNCE_MS);
		};

		// Skip if this scroll was triggered by our own snap
		if (isScrolling && !isSnappingRef.current) {
			handleScroll();
		}
	}, [
		isScrolling,
		measure,
		range?.startIndex,
		rowGap,
		scrollDirection,
		scrollToIndex,
		weekCount,
		weekHeight,
		weekScrollSnapType
	]);

	useMonthViewNavigateByKey({
		tableBodyRef: calendarTableBodyRef,
		calendarChangedOnNavigate: true
	});

	useEffect(() => {
		window.addEventListener("resize", capturePreResize);

		return (): void => {
			window.removeEventListener("resize", capturePreResize);
		};
	}, [capturePreResize]);

	return (
		<StyledCalendarInfiniteMonthViewWrapper {...rest} data-role={DataRoles.Calendar.MonthView.Wrapper}>
			<CalendarMonthViewHeader locale={locale} weekStartsOn={weekStartsOn} weekDayFormatter={weekDayFormatter} />
			<StyledCalendarInfiniteScrollContainer
				data-role={DataRoles.Calendar.MonthView.Infinite.ScrollContainer}
				ref={weekVirtualizerParentRef}
			>
				<StyledCalendarInfiniteViewTable
					data-role={DataRoles.Calendar.MonthView.Table}
					ref={calendarTableBodyRef}
					style={{ height: getTotalSize() }}
					$rowNum={getTotalSize()}
				>
					{getVirtualItems().map((virtualRow) => renderWeek(virtualRow))}
				</StyledCalendarInfiniteViewTable>
			</StyledCalendarInfiniteScrollContainer>
		</StyledCalendarInfiniteMonthViewWrapper>
	);
};

CalendarInfiniteView.displayName = "CalendarInfiniteView";
