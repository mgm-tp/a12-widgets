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

import { type Locale, enUS } from "date-fns/locale";
import type { ContextType, ReactElement, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { Component } from "react";

import { bindMethods } from "../../../common/main/utils.js";
import { TimeUtils } from "../../../common/main/date-time/time-utils.js";
import { DateTimeUtils } from "../../../common/main/date-time/date-utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { TimePickerInput } from "../../../time-picker/main/time-picker-input.view.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { DateTimeContext } from "../../../common/main/date-time/date-time-context.js";

import { DateTimePickerFooter } from "../date-time-picker.tpl.view.js";
import type { DateTimePickerProps } from "../date-time-picker.api.js";
import { DateTimePicker } from "../date-time-picker.view.js";

import type { DateTimePickerTimeInputProps } from "./date-time-picker.time-input.api.js";

export interface DateTimePickerTimeInputState {
	date?: Date;
	month?: Date;
	time?: Date;
	screen: DateTimePickerProps.Screen;
	timeInputText: string;
	invalidInputValue?: boolean;
}

export class DateTimePickerTimeInput extends Component<DateTimePickerTimeInputProps, DateTimePickerTimeInputState> {
	static displayName = "DateTimePickerTimeInput";
	declare context: ContextType<typeof DateTimeContext>;

	private screenRef: HTMLElement | null = null;
	private inputRef: HTMLInputElement | null = null;
	private datePickerRef: HTMLElement | null = null;
	private dayMouseDownTargetRef: HTMLElement | null = null;
	private isDesktop: boolean = provider.isDesktop();

	private converter = DateTimeUtils.createTimezoneConverter(this.props.timezone).convertDate;

	constructor(props: DateTimePickerTimeInputProps) {
		super(props);

		const valueTZ = this.converter.toUTC(props.value);
		this.state = {
			screen: props.initialScreen || "date",
			date: valueTZ,
			time: valueTZ,
			month: valueTZ ?? this.converter.toUTC(props.month || props.defaultMonth),
			timeInputText: valueTZ ? this.getDisplayTime(valueTZ) : ""
		};
		bindMethods(this);
	}

	private getTime(value?: string): Date | undefined {
		const timeFormat = TimeUtils.getTimeFormat(this.props.timeMode ?? this.context?.timeMode);

		if (!value) {
			return undefined;
		}

		return DateTimeUtils.parseDateTimeUTC(value, timeFormat);
	}

	private getDisplayTime(time: Date): string {
		// This is due to the fact that getDisplayTime is called in constructore where the context is not available yet.
		const locale: Locale = this.context?.locale || enUS;
		const timeFormat = TimeUtils.getTimeFormat(this.props.timeMode ?? this.context?.timeMode);

		return TimeUtils.formatUTCTime(time, locale, timeFormat);
	}

	private handleInputChange(value: string): void {
		if (value.trim().length > 0) {
			const time = this.getTime(value);

			if (time) {
				this.setState(
					{
						invalidInputValue: false,
						time: time,
						timeInputText: this.getDisplayTime(time)
					},
					() => {
						this.props.onChange?.(this.state.date, this.converter.toTimezone(time));
					}
				);
			} else {
				this.setState({ invalidInputValue: true, time: undefined, timeInputText: value });
			}
		} else {
			this.setState({ invalidInputValue: false, time: undefined, timeInputText: "" });
		}
	}

	private getDatePickerRef(ref: HTMLElement | null): void {
		this.datePickerRef = ref;
	}

	private handleClear(event: ReactMouseEvent<HTMLElement, MouseEvent>): void {
		event.nativeEvent.stopImmediatePropagation();
		this.setState(
			{
				date: undefined,
				time: undefined,
				month: undefined,
				timeInputText: "",
				screen: "date",
				invalidInputValue: false
			},
			() => {
				this.datePickerRef?.focus();
			}
		);
	}

	private handleOk(): void {
		if (this.props.onAccept) {
			const time = this.getTime(this.state.timeInputText);
			const datetime = this.getDisplayDateTime(this.state.date, time);
			this.props.onAccept(this.converter.toTimezone(datetime));
		}
	}

	private handleDateTimeChange(date?: Date, time?: Date): void {
		const newTime = this.state.screen === "date" ? this.state.time : this.converter.toUTC(time);

		this.props.onChange?.(date, time);

		this.setState((prevState) => ({
			date: this.converter.toUTC(date),
			time: newTime,
			timeInputText: newTime ? this.getDisplayTime(newTime) : prevState.timeInputText,
			invalidInputValue: newTime ? false : prevState.invalidInputValue
		}));
	}

	private handleMonthChange(month: Date): void {
		this.setState({ month });
	}

	private handleScreenChange(screen: DateTimePickerProps.Screen, screenRef: HTMLElement | null): void {
		this.screenRef = screenRef;
		this.setState({ screen }, () => {
			this.props.onScreenChange?.(screen, this.screenRef);
		});
	}

	private handleBack(event: ReactMouseEvent<HTMLElement, MouseEvent>): void {
		event.nativeEvent.stopImmediatePropagation();
		const previousScreen = this.state.screen === "minute" ? "hour" : "date";
		this.changeScreen(previousScreen);
	}

	private changeScreen(newScreen: DateTimePickerProps.Screen): void {
		this.setState({ screen: newScreen });
	}

	private renderTimeEditInput(): ReactElement {
		const time = this.getTime(this.state.timeInputText);
		const displayValue = time ? this.getDisplayTime(time) : this.state.timeInputText;
		const triggerButtonId = this.props.id && `${this.props.id}-time-button`;

		return (
			<TimePickerInput
				inputRef={(ref) => {
					this.inputRef = ref;
				}}
				errorMessage={this.state.invalidInputValue && this.props.invalidInputMessage}
				placeholder={
					this.props.timeInputPlaceholder || TimeUtils.getTimeFormat(this.props.timeMode ?? this.context.timeMode)
				}
				value={displayValue || ""}
				icon={
					<A11YLanguageContext.Consumer>
						{(a11yContext) => (
							<Button
								id={this.props.id && `${this.props.id}-time-button`}
								icon={<Icon>schedule</Icon>}
								title={a11yContext.pickerTitles?.timePickerTrigger}
								onClick={(event) => {
									event.nativeEvent.stopImmediatePropagation();
									this.changeScreen("hour");
								}}
								buttonAttributes={{
									"aria-labelledby": triggerButtonId ? `${triggerButtonId}` : undefined
								}}
							>
								{a11yContext.pickerTitles?.timePickerTrigger && (
									<HiddenText id={triggerButtonId}>{`, ${a11yContext.pickerTitles.timePickerTrigger}`}</HiddenText>
								)}
							</Button>
						)}
					</A11YLanguageContext.Consumer>
				}
				onChange={(value) => this.handleInputChange(value)}
			/>
		);
	}

	private renderFooter(): ReactNode | DateTimePickerProps.Renderer {
		// Show the clear button when the month is changed, or the initial month value is not the defaultMonth.
		const isShowClearButton =
			!!this.state.date ||
			this.state.timeInputText.length > 0 ||
			(this.state.month && !TimeUtils.isSameTime(this.state.month, this.converter.toUTC(this.props.defaultMonth)));

		return (
			this.props.customFooterElement || (
				<DateTimePickerFooter>
					<DateTimePickerFooter.Action>
						{this.state.screen !== "date" && (
							<Button label={this.props.backLabel || "back"} onClick={this.handleBack} />
						)}
					</DateTimePickerFooter.Action>
					<DateTimePickerFooter.Action>
						<Button primary label={this.props.okLabel || "ok"} onClick={this.handleOk} />
					</DateTimePickerFooter.Action>
					<DateTimePickerFooter.Action>
						{isShowClearButton && (
							<Button destructive label={this.props.clearLabel || "clear"} onClick={this.handleClear} />
						)}
					</DateTimePickerFooter.Action>
				</DateTimePickerFooter>
			)
		);
	}

	private getDisplayDateTime(date?: Date, time?: Date): Date | undefined {
		if (!date) {
			return time;
		}

		const defaultTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));

		return DateTimeUtils.combineDateAndTime(date, time || defaultTime);
	}

	private handleDayMouseDown(event: ReactMouseEvent): void {
		this.dayMouseDownTargetRef = event.target as HTMLElement;

		// prevent focus on day button to focus on time input on desktop
		if (this.inputRef && this.isDesktop) {
			event.preventDefault();
		}
	}

	private handleMouseUp(event: MouseEvent): void {
		const eventTarget = event.target as HTMLElement;

		// The blur event on the Time Input causes the Date Picker to change.
		// When selecting a date, the target when the mouse is pressed down and when it is released is different.
		// As a result, the click event does not fire. We check for that and manually fire the click event
		const isClickEventSkipped =
			eventTarget.isEqualNode(this.dayMouseDownTargetRef) && eventTarget !== this.dayMouseDownTargetRef;

		if (isClickEventSkipped) {
			// Fire the click event on eventTarget if it has not been fired.
			const clickEvent = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window
			});
			eventTarget.dispatchEvent(clickEvent);
			eventTarget.focus();
		}
	}

	componentDidMount(): void {
		document.addEventListener("mouseup", this.handleMouseUp);
	}

	componentDidUpdate(prevProps: DateTimePickerTimeInputProps, prevState: DateTimePickerTimeInputState): void {
		setTimeout(() => {
			if (this.inputRef && this.isDesktop && this.state.date && prevState.date !== this.state.date) {
				this.inputRef.focus();
			}
		});
	}

	componentWillUnmount(): void {
		document.removeEventListener("mouseup", this.handleMouseUp);
	}

	render(): ReactNode {
		const { date, time, screen } = this.state;

		const valueTZ =
			screen === "date"
				? this.converter.toTimezone(date)
				: (time || date) && this.converter.toTimezone(this.getDisplayDateTime(date, time ?? date));

		return (
			<DateTimePicker
				{...this.props}
				customTimeEditElement={this.renderTimeEditInput()}
				customFooterElement={this.renderFooter()}
				initialScreen={screen}
				value={valueTZ}
				onChange={this.handleDateTimeChange}
				onScreenChange={this.handleScreenChange}
				yearRange={this.props.yearRange}
				onDayMouseDown={this.handleDayMouseDown}
				onMonthChange={this.handleMonthChange}
				month={this.state.month}
				wrapperRef={this.getDatePickerRef}
			/>
		);
	}
}

DateTimePickerTimeInput.contextType = DateTimeContext;
