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

import type { ReactElement, MouseEvent, ContextType, KeyboardEvent, RefObject } from "react";
import { useContext, useCallback, useMemo, createRef, Component } from "react";
import type {
	Modifiers,
	MonthCaptionProps,
	DayButtonProps,
	MonthChangeEventHandler,
	DayEventHandler,
	WeekProps,
	WeekdayProps,
	MonthGridProps,
	ClassNames,
	DayProps
} from "react-day-picker";
import { Day, addToRange, useDayPicker, UI, DayFlag, SelectionState, Week, Weekday, MonthGrid } from "react-day-picker";
import { isEqual } from "lodash-es";
import { Key } from "ts-key-enum";

import { bindMethods, addPrefix, convertToArr, joinClassNames } from "../../common/main/utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Button } from "../../button/main/button.view.js";
import type { YearRange } from "../../input/year-month-selector/year-selector.api.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledDayButton, StyledDatePicker } from "./date-picker.styled.js";
import { DatePickerFooter, DatePickerFooterAction, PickerHeaderNavButton } from "./date-picker.tpl.view.js";
import type { PickerFooter, DatePickerProps } from "./date-picker.api.js";
import type { DateRange } from "./date-range.api.js";
import { DatePickerContext } from "./date-picker.context.js";

const isRangeMatcher = DateTimeUtils.isRangeMatcher;

const baseClassName = addPrefix("DayPicker");

const datePickerClassNames: Partial<ClassNames> = {
	root: `${baseClassName}`,
	[UI.MonthGrid]: `${baseClassName}-Table`,
	[UI.Months]: `${baseClassName}-Months`,
	[UI.Month]: `${baseClassName}-Month`,
	[UI.Weeks]: `${baseClassName}-Body`,
	[UI.WeekNumberHeader]: `${baseClassName}-WeekNumberHeader`,
	[UI.WeekNumber]: `${baseClassName}-WeekNumber`,
	[UI.Weekdays]: `${baseClassName}-Weekdays`,
	[UI.Weekday]: `${baseClassName}-Weekday`,
	[UI.PreviousMonthButton]: "",
	[UI.NextMonthButton]: "",
	[UI.Week]: `${baseClassName}-Week`,
	[UI.DayButton]: `${baseClassName}-Day`,
	[UI.Footer]: `${baseClassName}-Footer`,
	[DayFlag.today]: "",
	[UI.Day]: `${baseClassName}-Day-Cell`,
	[SelectionState.selected]: `${baseClassName}-Day--selected`,
	[DayFlag.disabled]: `${baseClassName}-Day--disabled`,
	[DayFlag.outside]: `${baseClassName}-Day--outside`,
	[SelectionState.range_start]: `${baseClassName}-Day--start`,
	[SelectionState.range_end]: `${baseClassName}-Day--end`
};

const { StyledDatePickerContainer, StyledDatePickerCaption, StyledDatePickerNavBar, StyledDatePickerRoot } =
	StyledDatePicker;

interface DatePickerState {
	month: Date;
	date?: Date;
	range?: DateRange;
}
const CustomCaption = (props: MonthCaptionProps): ReactElement => {
	const { yearRange, mobile, months } = useContext(DatePickerContext);
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.pickerTitles;

	const { dayPickerProps, previousMonth, nextMonth, goToMonth } = useDayPicker();
	const { disableNavigation, month } = dayPickerProps;
	const previousButtonClick = (): void => {
		if (previousMonth) {
			goToMonth(previousMonth);
		}
	};

	const nextButtonClick = (): void => {
		if (nextMonth) {
			goToMonth(nextMonth);
		}
	};

	const handleYearMonthSelectorChange = useCallback(
		(monthProps: number, yearProps: number) => {
			if (disableNavigation) {
				return;
			}

			const newValue = month;

			// Due to different end of month causing shifting if only month is set, I have to reset the day to first day
			if (newValue) {
				newValue.setFullYear(yearProps, monthProps, 1);
				goToMonth(newValue);
			}
		},
		[disableNavigation, goToMonth, month]
	);

	const getYearRange = useCallback((): YearRange | undefined => {
		if (yearRange && month) {
			const year = month.getFullYear();
			const { start, end } = yearRange;

			const shouldUpdateRange = year < start || year > end;
			const range = Math.round((end - start) / 2);

			return {
				start: shouldUpdateRange ? year - range : start,
				end: shouldUpdateRange ? year + range : end
			};
		}

		return undefined;
	}, [month, yearRange]);

	return (
		<StyledDatePickerNavBar id={props.id} data-role={DataRoles.DatePicker.NavBar} $mobile={mobile}>
			<PickerHeaderNavButton disabled={disableNavigation} onClick={previousButtonClick} />
			<StyledDatePickerCaption
				onValueChange={handleYearMonthSelectorChange}
				disabled={disableNavigation}
				month={month?.getMonth()}
				months={months}
				year={month?.getFullYear()}
				yearRange={getYearRange()}
				className={`${baseClassName}-Caption`}
				hiddenLabels={{
					monthLabel: a11yTitles?.monthSelectorLabel,
					yearLabel: a11yTitles?.yearSelectorLabel
				}}
				$mobile={mobile}
			/>
			<PickerHeaderNavButton isNext disabled={disableNavigation} onClick={nextButtonClick} />
		</StyledDatePickerNavBar>
	);
};

CustomCaption.displayName = "CustomCaption";

/**
 * DatePicker widgets.
 *
 * The widget positions itself in the DOM directly below the body element at the given (absolute) position.
 *
 * Set defaultMonth to a date to open the given month. Otherwise, the current month will be displayed.
 *
 * *Important:* Because the actual date picker is rendered outside the hierarchy, the render method always returns
 * null. Use getDatepicker() to obtain the actually rendered date picker.
 */

function CustomDay(props: DayButtonProps): ReactElement<DayButtonProps> {
	const { mobile, showOutsideDays } = useContext(DatePickerContext);

	return !showOutsideDays && props.modifiers.outside ? (
		<StyledDatePicker.StyledGridCell role="gridcell" $mobile={mobile} />
	) : (
		<StyledDayButton {...props} data-role={DataRoles.DatePicker.DayButton} role="gridcell" $mobile={mobile} />
	);
}

CustomDay.displayName = "CustomDay";

function CustomWeek(props: WeekProps): ReactElement<WeekProps> {
	return <Week {...props} data-role={DataRoles.DatePicker.Week} />;
}

function CustomWeekDay(props: WeekdayProps): ReactElement<WeekdayProps> {
	return <Weekday {...props} data-role={DataRoles.DatePicker.Week.Day} />;
}

function CustomMonthGrid(props: MonthGridProps): ReactElement<MonthGridProps> {
	return <MonthGrid {...props} data-role={DataRoles.DatePicker.Month.Grid} />;
}

function CustomDayCell(props: DayProps): ReactElement<MonthGridProps> {
	return <Day {...props} role="presentation" />;
}

export const DatePicker = (props: DatePickerProps): ReactElement<DatePickerProps> => {
	const { timezone, value, month, defaultMonth, onChange, onDateRangeChange, onDayClick, onMonthChange } = props;

	const { convertDate, convertDateRange } = DateTimeUtils.createTimezoneConverter(timezone);

	const selectedRangeMatcher = useMemo(() => convertToArr(props.selected).find(isRangeMatcher), [props.selected]);

	const selectedDays = useMemo(() => {
		if (!props.selected) {
			return undefined;
		}

		return selectedRangeMatcher ? convertDateRange.toUTC(selectedRangeMatcher) : props.selected;
	}, [convertDateRange, props.selected, selectedRangeMatcher]);

	const onAccept: PickerFooter["onAccept"] = useCallback(
		(range: DateRange) => props.footer?.onAccept?.(convertDateRange.toTimezone(range)),
		[convertDateRange, props.footer]
	);

	const onChangeFn: DatePickerProps["onChange"] = useCallback(
		(date: Date) => {
			const selectedDate = convertDate.toTimezone(date);

			if (selectedDate) {
				onChange?.(selectedDate);
			}
		},
		[convertDate, onChange]
	);

	const onDateRangeChangeFn = useCallback(
		(range: DateRange) => onDateRangeChange?.(convertDateRange.toTimezone(range)),
		[convertDateRange, onDateRangeChange]
	);

	const onDayClickFn: DayEventHandler<MouseEvent> = useCallback(
		(day: Date, modifiers: Modifiers, event: MouseEvent) => {
			const selectedDay = convertDate.toTimezone(day);

			if (selectedDay) {
				onDayClick?.(selectedDay, modifiers, event);
			}
		},
		[convertDate, onDayClick]
	);

	const onMonthChangeFn: MonthChangeEventHandler = useCallback(
		(month: Date) => {
			const selectedMonth = convertDate.toTimezone(month);

			if (selectedMonth) {
				onMonthChange?.(selectedMonth);
			}
		},
		[convertDate, onMonthChange]
	);

	return (
		<DatePickerUTC
			{...props}
			value={convertDate.toUTC(value)}
			month={convertDate.toUTC(month)}
			defaultMonth={convertDate.toUTC(defaultMonth)}
			selected={selectedDays}
			footer={{ ...props.footer, onAccept }}
			onChange={onChangeFn}
			onDateRangeChange={onDateRangeChange || selectedRangeMatcher ? onDateRangeChangeFn : undefined}
			onDayClick={onDayClickFn}
			onMonthChange={onMonthChangeFn}
		/>
	);
};

DatePicker.displayName = "DatePicker";

class DatePickerUTC extends Component<DatePickerProps, DatePickerState> {
	static displayName = "DatePickerUTC";
	declare context: ContextType<typeof DateTimeContext>;
	private converter = DateTimeUtils.createTimezoneConverter(this.props.timezone).convertDate;
	private wrapperRef: RefObject<HTMLElement | null> = createRef();

	constructor(props: DatePickerProps) {
		super(props);
		this.state = this.getInitState(props);
		bindMethods(this);
	}

	private getRangeMatcher(): DateRange | undefined {
		return convertToArr(this.props.selected).find(isRangeMatcher);
	}

	private getMonth(month?: Date, defaultMonth?: Date, value?: Date): Date {
		const foundRange = this.getRangeMatcher();
		const UTCDate = value || foundRange?.from || this.getTodayUTC();

		return month || defaultMonth || UTCDate;
	}

	private getInitState(props: DatePickerProps): DatePickerState {
		const { value, month: monthProp, defaultMonth, yearRange } = props;

		const month = this.getMonth(monthProp, defaultMonth, value);

		if (!value && yearRange) {
			const fullYear = month.getFullYear();

			if (fullYear < yearRange.start || fullYear > yearRange.end) {
				month.setFullYear(yearRange.start);
			}
		}

		return { month, date: value };
	}

	private getTodayUTC(): Date {
		return this.converter.toUTC(new Date()) as Date;
	}

	private convertUTCToLocal(date?: Date | null): Date | undefined {
		if (!date) {
			return undefined;
		}

		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	}

	private getSelectedDays(): DateRange | undefined {
		const foundRange = this.getRangeMatcher();

		if (foundRange) {
			return {
				from: this.convertUTCToLocal(foundRange.from),
				to: this.convertUTCToLocal(foundRange.to)
			};
		}

		return undefined;
	}

	private updateRangeState(): void {
		const { selected } = this.props;

		if (!selected) {
			this.setState({ range: { from: undefined, to: undefined } });

			return;
		}

		this.setState({ range: this.getRangeMatcher() });
	}

	private isDateRange(): boolean {
		return this.props.mode === "range" || !!this.props.onDateRangeChange || !!this.getRangeMatcher();
	}

	private handleSubmit(): void {
		const { footer } = this.props;

		if (footer && !footer.customFooter) {
			footer.onAccept?.(this.state.range);
		}
	}

	private handleSelectRange = (range?: DateRange): void => {
		this.setState({ range });
	};

	private handleSelectDate = (date?: Date): void => {
		this.setState({ date });
	};

	private handleClear(): void {
		const { footer, defaultMonth } = this.props;
		const initMonth = defaultMonth ?? this.getTodayUTC();

		this.setState({
			range: undefined,
			month: initMonth
		});

		this.props.onMonthChange?.(initMonth);

		if (footer && !footer.customFooter) {
			footer.onClear?.();
		}
	}

	componentDidMount(): void {
		if (this.isDateRange()) {
			this.updateRangeState();
		}

		const reactDatePicker: HTMLElement | null = document.querySelector(`.${baseClassName}`);

		if (reactDatePicker) {
			this.wrapperRef.current = reactDatePicker;
		}

		if (!this.wrapperRef.current?.getAttribute("data-role")) {
			this.wrapperRef.current?.setAttribute("data-role", DataRoles.DatePicker);
		}
	}

	componentDidUpdate(prevProps: DatePickerProps): void {
		const { onDateRangeChange, selected, value, defaultMonth, month } = this.props;

		if (prevProps.month !== month) {
			this.setState({ month: this.getMonth(month, defaultMonth, value) });
		}

		if (this.isDateRange() && !isEqual(prevProps.selected, selected)) {
			this.updateRangeState();
		}

		if (!this.getRangeMatcher() && !onDateRangeChange && prevProps.value !== value) {
			this.setState({ date: this.props.value });
		}
	}

	render(): ReactElement<DatePickerProps> {
		const { footer, defaultMonth } = this.props;
		const { range, date, month } = this.state;
		const isRange = this.isDateRange();

		const isShowClearButton =
			(!isRange && date) ||
			(isRange && range?.from) ||
			(month &&
				!TimeUtils.isSameTime(
					this.convertUTCToLocal(month),
					this.convertUTCToLocal(defaultMonth ?? this.getTodayUTC())
				));

		return isRange ? (
			<StyledDatePickerRoot
				ref={this.props.wrapperRef}
				tabIndex={-1}
				className={`${baseClassName}-root`}
				data-role={DataRoles.DatePicker.Root}
			>
				{this.renderDatePicker()}
				{footer?.customFooter || (
					<DatePickerFooter className={`${baseClassName}-footer`} dataRole={DataRoles.DatePicker.Footer}>
						<DatePickerFooterAction dataRole={DataRoles.DatePicker.Footer.Action} />
						<DatePickerFooterAction dataRole={DataRoles.DatePicker.Footer.Action}>
							<Button
								primary
								label={footer && (footer as PickerFooter).acceptLabel}
								disabled={
									(!isRange && !date) || !!(isRange && ((!range?.from && range?.to) || (range?.from && !range.to)))
								}
								onClick={this.handleSubmit}
							/>
						</DatePickerFooterAction>
						<DatePickerFooterAction dataRole={DataRoles.DatePicker.Footer.Action}>
							{isShowClearButton && (
								<Button destructive label={footer && (footer as PickerFooter).clearLabel} onClick={this.handleClear} />
							)}
						</DatePickerFooterAction>
					</DatePickerFooter>
				)}
			</StyledDatePickerRoot>
		) : (
			this.renderDatePicker()
		);
	}

	private onSelectDay(day: Date, modifiers: Modifiers): void {
		if (!modifiers["disabled"]) {
			if (this.isDateRange()) {
				const from = this.convertUTCToLocal(this.state.range?.from);
				const to = this.convertUTCToLocal(this.state.range?.to);
				const range = addToRange(day, {
					from,
					to
				});

				const zuluRange: DateRange = {
					from: range?.from
						? new Date(Date.UTC(range.from.getFullYear(), range.from.getMonth(), range.from.getDate()))
						: undefined,
					to: range?.to
						? new Date(Date.UTC(range.to.getFullYear(), range.to.getMonth(), range.to.getDate()))
						: undefined
				};
				this.props.onDateRangeChange?.(zuluRange);
				this.handleSelectRange(zuluRange);
			} else {
				const zuluDay = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
				this.props.onChange?.(zuluDay);
				this.handleSelectDate?.(zuluDay);
			}
		}
	}

	private onDayClick(day: Date, modifiers: Modifiers, event: MouseEvent): void {
		this.onSelectDay(day, modifiers);
		this.props.onDayClick?.(day, modifiers, event);
	}

	private onDayKeyDown(day: Date, modifiers: Modifiers, event: KeyboardEvent): void {
		if (event.key === Key.Enter) {
			event.preventDefault();
			this.onSelectDay(day, modifiers);
		}

		this.props.onDayKeyDown?.(day, modifiers, event);
	}

	private handleYearMonthChange(month: Date): void {
		const zuluMonth = new Date(Date.UTC(month.getFullYear(), month.getMonth(), month.getDate()));
		this.setState({ month: zuluMonth });
		this.props.onMonthChange?.(zuluMonth);
	}

	private renderDatePicker(): ReactElement<DatePickerProps> {
		const {
			classNames,
			value: day,
			style,
			month,
			className,
			mobile,
			footer,
			mode,
			disabled = [],
			styles = {},
			components,
			onDayMouseDown,
			fixedWeeks,
			showOutsideDays,
			...rest
		} = this.props;

		const properties = {
			...rest,
			showOutsideDays: fixedWeeks ?? true,
			fixedWeeks: fixedWeeks ?? true,
			locale: this.context.locale,
			disabled,
			classNames: {
				...datePickerClassNames,
				...classNames
			},
			className,
			components: {
				MonthCaption: CustomCaption,
				DayButton: CustomDay,
				Week: CustomWeek,
				Weekday: CustomWeekDay,
				MonthGrid: CustomMonthGrid,
				Day: CustomDayCell,
				...components
			},
			month: this.convertUTCToLocal(this.state.month),
			styles,
			$mobile: mobile,
			onMonthChange: this.handleYearMonthChange,
			onDayClick: this.onDayClick,
			onDayKeyDown: this.onDayKeyDown,
			hideNavigation: true,
			required: false
		};

		return (
			<DatePickerContext.Provider value={this.props}>
				{this.isDateRange() ? (
					<StyledDatePickerContainer
						{...properties}
						mode="range"
						className={joinClassNames(className, `${baseClassName}-Range`)}
						selected={this.getSelectedDays()}
						onSelect={this.handleSelectRange}
					/>
				) : (
					<StyledDatePickerContainer
						{...properties}
						mode="single"
						selected={this.convertUTCToLocal(this.props.value)}
						onSelect={this.handleSelectDate}
					/>
				)}
			</DatePickerContext.Provider>
		);
	}
}

DatePickerUTC.contextType = DateTimeContext;
