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

import type { ContextType, ReactNode, ReactElement } from "react";
import { Component } from "react";

import { bindMethods, addPrefix, joinClassNames } from "../../common/main/utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../icon/main/icon.view.js";
import type { TimePickerProps } from "../../time-picker/main/time-picker.api.js";
import { Button } from "../../button/main/button.view.js";
import { StyledTimePickerInput } from "../../time-picker/main/time-picker.styled.js";
import { PickerHeaderCloseButton } from "../../datepicker/main/date-picker.tpl.view.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import {
	DatePickerScreen,
	DateTimePickerFooter,
	DateTimePickerHeader,
	TimePickerScreen
} from "./date-time-picker.tpl.view.js";
import type { DateTimePickerProps } from "./date-time-picker.api.js";
import { StyledDateTimePickerTimeButton, StyledDateTimePickerTimeDisplay } from "./date-time-picker.styled.js";

const baseClassName = addPrefix("TimePicker");

export interface DateTimePickerState {
	currentScreen: DateTimePickerProps.Screen;
	value?: Date;
	month?: Date;
	timeFilled?: boolean;
}

export class DateTimePicker extends Component<DateTimePickerProps, DateTimePickerState> {
	static displayName = "DateTimePicker";
	declare context: ContextType<typeof DateTimeContext>;
	private screenRef: HTMLElement | null = null;
	private converter = DateTimeUtils.createTimezoneConverter(this.props.timezone).convertDate;

	constructor(props: DateTimePickerProps) {
		super(props);
		const initialValue = this.converter.toUTC(props.value);

		this.state = {
			value: initialValue,
			currentScreen: props.initialScreen || "date",
			timeFilled: !!initialValue,
			month: initialValue ?? this.converter.toUTC(props.month || props.defaultMonth)
		};
		bindMethods(this);
		this.registerCallbacks(props);
	}

	private registerCallbacks(props: DateTimePickerProps) {
		props.clear?.(this.handleClear);
		props.back?.(this.handleBack);
		props.ok?.(this.handleOk);
	}

	private handleDayChange(newDate: Date): void {
		const utcNewDate = this.converter.toUTC(newDate);
		const newDateTime = this.state.value ? DateTimeUtils.combineDateAndTime(utcNewDate, this.state.value) : utcNewDate;

		this.triggerDateTimeChange(newDateTime);
		this.setState({ value: newDateTime, timeFilled: true }, () => {
			if (this.props.timeRequired) {
				setTimeout(() => this.changeScreen("hour"), 200);
			}
		});
	}

	private handleTimeScreenChange(newScreen: TimePickerProps.Screen): void {
		this.changeScreen(newScreen);
	}

	private changeScreen(newScreen: DateTimePickerProps.Screen): void {
		this.setState({ currentScreen: newScreen }, () => {
			this.props.onScreenChange?.(newScreen, this.screenRef);
		});
	}

	private handleTimeChange(newTime?: Date): void {
		const newDate = DateTimeUtils.combineDateAndTime(
			this.state.value ?? this.state.month ?? new Date(),
			this.converter.toUTC(newTime)
		);
		this.setState({ value: newDate, timeFilled: true }, () => {
			this.triggerDateTimeChange(this.state.value);
		});
	}

	private triggerDateTimeChange(date?: Date): void {
		this.props.onChange?.(this.converter.toTimezone(date), this.converter.toTimezone(date));
	}

	private handleBack(): void {
		const previousScreen = this.state.currentScreen === "minute" ? "hour" : "date";
		this.changeScreen(previousScreen);
	}

	private handleOk(): void {
		this.props.onAccept?.(this.converter.toTimezone(this.state.value));
	}

	private handleMonthChange(month: Date): void {
		this.props.onMonthChange?.(month);
		this.setState({ month: this.converter.toUTC(month) });
	}

	private handleClear(): void {
		this.setState(
			{
				value: undefined,
				timeFilled: false,
				currentScreen: "date",
				month: undefined
			},
			() => {
				this.triggerDateTimeChange(undefined);
				this.screenRef?.focus();
			}
		);
	}

	private handleRef(ref: HTMLElement | null): void {
		this.props.wrapperRef?.(ref);
		this.screenRef = ref;
	}

	private renderTimeEditElement(): ReactNode {
		const customTimeEdit = this.props.customTimeEditElement;

		if (customTimeEdit instanceof Function) {
			return customTimeEdit(this.state.value, this.state.currentScreen);
		}

		return customTimeEdit ?? this.renderDefaultTimeEdit();
	}

	private renderDefaultTimeEdit(): ReactNode {
		const timeFormat = TimeUtils.getTimeFormat(this.props.timeMode ?? this.context?.timeMode);
		const className = joinClassNames(`${baseClassName}__timeDisplay`, {
			[`${baseClassName}__timeDisplay--initial`]: !this.state.timeFilled
		});

		return (
			<StyledTimePickerInput className={baseClassName} data-role={DataRoles.DateTimePicker.EditTime}>
				<StyledDateTimePickerTimeDisplay
					className={className}
					data-role={DataRoles.DateTimePicker.TimeDisplay}
					isInitialized={!this.state.timeFilled}
				>
					{this.state.timeFilled
						? this.props.timezone
							? TimeUtils.formatTimezoneTime(
									this.converter.toTimezone(this.state.value),
									this.props.timezone,
									timeFormat,
									this.context.locale
								)
							: TimeUtils.formatUTCTime(this.state.value, this.context.locale, timeFormat)
						: timeFormat}
				</StyledDateTimePickerTimeDisplay>
				<StyledDateTimePickerTimeButton
					className={`${baseClassName}__editTimeButton`}
					data-role={DataRoles.DateTimePicker.EditTime.Button}
				>
					<A11YLanguageContext.Consumer>
						{(a11yContext) => (
							<Button
								id={this.props.id && `${this.props.id}-time-button`}
								title={a11yContext.pickerTitles?.timePickerTrigger}
								icon={<Icon>schedule</Icon>}
								label={this.props.customTimeEditLabel || "edit time"}
								onClick={(event) => {
									event.nativeEvent.stopImmediatePropagation();
									this.changeScreen("hour");
								}}
							/>
						)}
					</A11YLanguageContext.Consumer>
				</StyledDateTimePickerTimeButton>
			</StyledTimePickerInput>
		);
	}

	private renderFooter(): ReactNode {
		const customFooter = this.props.customFooterElement;

		if (customFooter instanceof Function) {
			return customFooter(
				this.state.value,
				this.state.currentScreen,
				this.state.month && !TimeUtils.isSameTime(this.state.month, this.converter.toUTC(this.props.defaultMonth))
			);
		}

		return customFooter ?? this.renderDefaultFooter();
	}

	private renderDefaultFooter(): ReactNode {
		// Show the clear button when the month is changed, or the initial month value is not the defaultMonth.
		const isShowClearButton =
			!!this.state.value ||
			(this.state.month && !TimeUtils.isSameTime(this.state.month, this.converter.toUTC(this.props.defaultMonth)));

		return (
			<DateTimePickerFooter>
				<DateTimePickerFooter.Action>
					{this.state.currentScreen !== "date" && (
						<Button
							label={this.props.backLabel || "back"}
							onClick={(event) => {
								event.nativeEvent.stopImmediatePropagation();
								this.handleBack();
							}}
						/>
					)}
				</DateTimePickerFooter.Action>
				<DateTimePickerFooter.Action>
					<Button primary label={this.props.okLabel || "ok"} onClick={this.handleOk} />
				</DateTimePickerFooter.Action>
				<DateTimePickerFooter.Action>
					{isShowClearButton && (
						<Button
							destructive
							label={this.props.clearLabel || "clear"}
							onClick={(event) => {
								event.nativeEvent.stopImmediatePropagation();
								this.handleClear();
							}}
						/>
					)}
				</DateTimePickerFooter.Action>
			</DateTimePickerFooter>
		);
	}

	private getTimePickerTitle(): string {
		return DateTimeUtils.formatUTCDateTime(
			this.state.value ?? this.state.month ?? new Date(),
			this.context.locale,
			"dddd, DD/MM/YYYY"
		);
	}

	private renderHeader(): ReactNode {
		const customHeader = this.props.customHeaderElement;

		if (customHeader instanceof Function) {
			return customHeader(
				this.converter.toTimezone(this.state.value ?? this.state.month ?? new Date()),
				this.state.currentScreen
			);
		}

		return customHeader ?? this.renderDefaultHeader();
	}

	private renderDefaultHeader(): ReactNode {
		const headerId = this.props.id ? `${this.props.id}-header` : undefined;

		if (this.props.mobileMode) {
			return (
				<DateTimePickerHeader id={headerId} actionButtons={<PickerHeaderCloseButton onClick={this.props.onClose} />}>
					{this.props.customHeaderTitle || "Set Date and Time"}
				</DateTimePickerHeader>
			);
		}

		return <DateTimePickerHeader id={headerId}>{this.getTimePickerTitle()}</DateTimePickerHeader>;
	}

	private renderDatePickerScreen(): ReactElement {
		const { mobileMode, desktopPickerAttributes, mobilePickerAttributes, ...rest } = this.props;

		return (
			<DatePickerScreen
				{...rest}
				date={this.converter.toTimezone(this.state.value)}
				footerElement={this.renderFooter()}
				headerElement={mobileMode && this.renderHeader()}
				mobileMode={mobileMode}
				desktopPickerAttributes={!mobileMode ? desktopPickerAttributes : undefined}
				mobilePickerAttributes={mobileMode ? mobilePickerAttributes : undefined}
				onDayChange={this.handleDayChange}
				timeEditElement={this.renderTimeEditElement()}
				wrapperRef={this.handleRef}
				onMonthChange={this.handleMonthChange}
				month={this.converter.toTimezone(this.state.month)}
			/>
		);
	}

	private renderTimePickerScreen(): ReactElement {
		const {
			className,
			dateDisplayInTimePicker,
			desktopPickerAttributes,
			id,
			mobileMode,
			mobilePickerAttributes,
			style,
			timeMode,
			timezone
		} = this.props;

		return (
			<TimePickerScreen
				className={className}
				dateDisplay={dateDisplayInTimePicker}
				footerElement={this.renderFooter()}
				headerElement={this.renderHeader()}
				id={id}
				initialScreen={this.state.currentScreen !== "date" ? this.state.currentScreen : "hour"}
				mode={timeMode ?? this.context.timeMode}
				mobileMode={mobileMode}
				desktopPickerAttributes={!mobileMode ? desktopPickerAttributes : undefined}
				mobilePickerAttributes={mobileMode ? mobilePickerAttributes : undefined}
				onScreenChange={(newScreen) => this.handleTimeScreenChange(newScreen)}
				onTimeChange={(newTime) => this.handleTimeChange(newTime)}
				style={style}
				time={this.converter.toTimezone(this.state.value)}
				timezone={timezone}
				wrapperRef={this.handleRef}
			/>
		);
	}

	componentDidUpdate(prevProps: Readonly<DateTimePickerProps>): void {
		if (this.props.clear !== prevProps.clear || this.props.back !== prevProps.back || this.props.ok !== prevProps.ok) {
			this.registerCallbacks(this.props);
		}

		const initialScreen = this.props.initialScreen;
		const nextValue = this.converter.toUTC(this.props.value);
		const timeFilled = !!nextValue;

		if (initialScreen && initialScreen !== prevProps.initialScreen && initialScreen !== this.state.currentScreen) {
			this.setState({ currentScreen: initialScreen, value: nextValue, timeFilled }, () => {
				this.props.onScreenChange?.(initialScreen, this.screenRef);
			});
		}

		if (!TimeUtils.isSameTime(prevProps.value, this.props.value)) {
			this.setState({ value: nextValue, timeFilled });
		}

		if (!TimeUtils.isSameTime(prevProps.month, this.props.month)) {
			this.setState({ month: this.converter.toUTC(this.props.month) });
		}
	}

	render(): ReactNode {
		return this.state.currentScreen === "date" ? this.renderDatePickerScreen() : this.renderTimePickerScreen();
	}
}

DateTimePicker.contextType = DateTimeContext;
