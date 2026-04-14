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

import type { ReactElement, MouseEvent, ReactNode } from "react";
import { useCallback, Component } from "react";

import { Button } from "../../button/main/button.view.js";
import { addPrefix, joinClassNames, noop } from "../../common/main/utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import {
	DatePickerFooter,
	DatePickerFooterAction,
	PickerHeaderCloseButton
} from "../../datepicker/main/date-picker.tpl.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { Clock } from "./time-picker.clock.view.js";
import type { PickerProps, TimePickerDialogProps } from "./time-picker.mobile.api.js";
import { TimePickerTpl } from "./time-picker.tpl.view.js";
import type { TimePickerProps } from "./time-picker.api.js";
import {
	StyledTimePickerDialog,
	StyledTimePickerText,
	StyledTimePickerValue,
	StyledTimePickerSetting,
	StyledTimePickerFormatSelection,
	StyledTimePickerBody
} from "./time-picker.styled.js";

const baseClassName = addPrefix("TimePicker");

export function TimePickerDialog(props: TimePickerDialogProps): ReactElement<TimePickerDialogProps> {
	const {
		style,
		id,
		wrapperRef,
		value,
		mode,
		timezone,
		okLabel,
		clearLabel,
		className,
		onClearClick,
		onOkClick,
		onChange,
		pickerAttributes
	} = props;

	const handleClear = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			event.nativeEvent.stopImmediatePropagation();
			onClearClick?.();
		},
		[onClearClick]
	);

	return (
		<StyledTimePickerDialog
			data-role={DataRoles.TimePicker}
			className={joinClassNames(baseClassName, `${baseClassName}--dialog`, className)}
			style={style}
			id={id}
			ref={wrapperRef}
			tabIndex={-1}
			{...pickerAttributes}
		>
			{renderTimePickerHeader(props)}
			<TimePickerDialog.Picker
				initialScreen={value ? undefined : "hour"}
				onChange={onChange}
				value={value}
				mode={mode}
				timezone={timezone}
			/>
			<DatePickerFooter className={`${baseClassName}__footer `} data-role={DataRoles.TimePicker.Footer}>
				<DatePickerFooterAction data-role={DataRoles.TimePicker.Footer.Action} />
				<DatePickerFooterAction data-role={DataRoles.TimePicker.Footer.Action}>
					<Button primary label={okLabel || "ok"} onClick={onOkClick} />
				</DatePickerFooterAction>
				<DatePickerFooterAction data-role={DataRoles.TimePicker.Footer.Action}>
					{value !== undefined && <Button destructive label={clearLabel || "clear"} onClick={handleClear} />}
				</DatePickerFooterAction>
			</DatePickerFooter>
		</StyledTimePickerDialog>
	);
}

TimePickerDialog.displayName = "TimePickerDialog";

function renderTimePickerHeader(props: TimePickerDialogProps): ReactNode {
	if (props.customHeaderElement) {
		const customHeaderElement = props.customHeaderElement;

		if (customHeaderElement instanceof Function) {
			return customHeaderElement(props.value);
		}

		return customHeaderElement;
	}

	const timeFormat = TimeUtils.getTimeFormat(props.mode);
	const displayValue = props.timezone
		? TimeUtils.formatTimezoneTime(props.value, props.timezone, timeFormat)
		: TimeUtils.formatUTCTime(props.value, undefined, timeFormat);

	return (
		<TimePickerTpl.Header
			id={props.id}
			style={props.style}
			className={props.className}
			actionButtons={props.onClose && <PickerHeaderCloseButton onClick={props.onClose} />}
		>
			<StyledTimePickerText as="span" className={`${baseClassName}__header--text`}>
				{props.value ? displayValue : timeFormat}
			</StyledTimePickerText>
		</TimePickerTpl.Header>
	);
}

renderTimePickerHeader.displayName = "renderTimePickerHeader";

export namespace TimePickerDialog {
	export interface PickerState {
		currentScreen: TimePickerProps.Screen;
		hours?: number;
		minutes?: number;
		isAM: boolean;
	}

	export class Picker extends Component<PickerProps, PickerState> {
		static displayName = "TimePickerDialog.Picker";

		private converter = DateTimeUtils.createTimezoneConverter(this.props.timezone).convertDate;

		constructor(props: PickerProps) {
			super(props);

			const valueUTC = this.converter.toUTC(props.value);
			this.state = {
				currentScreen: props.initialScreen || "hour",
				hours: valueUTC ? valueUTC.getUTCHours() : undefined,
				minutes: valueUTC ? valueUTC.getUTCMinutes() : undefined,
				isAM: valueUTC === undefined || valueUTC.getUTCHours() < 12
			};
		}

		private handleClockChange(value: number, isAM: boolean, is12HourMode: boolean): void {
			let hours: number;
			let minutes: number;

			if (this.state.currentScreen === "hour") {
				hours = value;
				minutes = this.state.minutes || 0;

				if (is12HourMode && isAM && hours >= 12) {
					hours = hours - 12;
				} else if (is12HourMode && !isAM && hours < 12) {
					hours = hours + 12;
				}
			} else {
				minutes = value;
				hours = this.state.hours || 0;
			}

			if (this.state.hours !== hours || this.state.minutes !== minutes) {
				this.setState({ hours, minutes }, this.propagateChange);
			}
		}

		private changeScreen(screen: TimePickerProps.Screen, timeout: number): void {
			if (this.state.currentScreen !== screen) {
				setTimeout(() => {
					this.setState({ currentScreen: screen }, () => {
						if (this.props.onScreenChange) {
							this.props.onScreenChange(screen);
						}
					});
				}, timeout);
			}
		}

		private propagateChange(): void {
			if (this.props.onChange) {
				if (this.state.hours !== undefined && this.state.minutes !== undefined) {
					let date = new Date();
					const UTCDate = this.converter.toUTC(date) ?? date;
					date = DateTimeUtils.normalizeDateValue(UTCDate);
					date.setUTCHours(this.state.hours);
					date.setUTCMinutes(this.state.minutes);
					date.setSeconds(0);
					date.setMilliseconds(0);
					this.props.onChange(this.converter.toTimezone(date));
				} else {
					this.props.onChange(undefined);
				}
			}
		}

		setAM(isAM: boolean): void {
			if (isAM && this.state.hours !== undefined && this.state.hours >= 12) {
				this.setState({ hours: this.state.hours - 12, isAM }, this.propagateChange);
			} else if (!isAM && this.state.hours !== undefined && this.state.hours <= 12) {
				this.setState({ hours: this.state.hours + 12, isAM }, this.propagateChange);
			} else {
				this.setState({ isAM });
			}
		}

		private getClockValue(use12HourMode: boolean): number | undefined {
			const { hours, minutes, currentScreen } = this.state;

			if (currentScreen === "minute") {
				return minutes;
			} else if (use12HourMode && hours && hours > 12) {
				return hours - 12;
			} else {
				return hours;
			}
		}

		componentDidUpdate(prevProps: Readonly<PickerProps>): void {
			if (!TimeUtils.isSameTime(this.props.value, prevProps.value)) {
				const valueTZ = this.converter.toUTC(this.props.value);
				this.setState((prevState) => ({
					currentScreen: this.props.initialScreen || prevState.currentScreen,
					hours: valueTZ ? valueTZ.getUTCHours() : undefined,
					minutes: valueTZ ? valueTZ.getUTCMinutes() : undefined,
					isAM: valueTZ === undefined || prevState.isAM
				}));
			} else if (this.props.initialScreen && prevProps.initialScreen !== this.props.initialScreen) {
				this.setState({ currentScreen: this.props.initialScreen });
			}
		}

		render(): ReactElement<PickerProps> {
			const timeFormat = TimeUtils.getTimeFormat(this.props.mode);
			const hourFormat = TimeUtils.getHourFormat(timeFormat) || "H";
			const minuteFormat = TimeUtils.getMinuteFormat(timeFormat) || "mm";
			const { hours, minutes, currentScreen, isAM } = this.state;
			const use12HourMode = hourFormat.startsWith("h");
			const clockValue = this.getClockValue(use12HourMode);

			return (
				<StyledTimePickerBody
					data-role={DataRoles.TimePicker.Body}
					className={joinClassNames(`${baseClassName}__body`, this.props.className)}
					style={this.props.style}
					id={this.props.id}
				>
					{this.props.dateDisplay && (
						<div className={`${baseClassName}__dateDisplay`} data-role={DataRoles.TimePicker.Date}>
							{this.props.dateDisplay}
						</div>
					)}
					<Clock
						timeFormat={timeFormat}
						screen={currentScreen}
						value={clockValue}
						onChange={(value) => this.handleClockChange(value, isAM, use12HourMode)}
						onMouseUp={() => this.changeScreen("minute", 300)}
						onTouchEnd={() => this.changeScreen("minute", 300)}
					/>
					<StyledTimePickerSetting className={`${baseClassName}__setting`} data-role={DataRoles.TimePicker.Setting}>
						<div>
							<StyledTimePickerValue
								className={joinClassNames(
									`${baseClassName}__time`,
									{ [`${baseClassName}__time--selected`]: currentScreen === "hour" },
									{ [`${baseClassName}__time--initial`]: hours === undefined }
								)}
								selected={currentScreen === "hour"}
								initial={hours === undefined}
								onClick={() => this.changeScreen("hour", 0)}
								onKeyDown={noop}
								data-role={DataRoles.TimePicker.Time}
							>
								{hours !== undefined ? TimeUtils.getFormattedHour(hours, hourFormat) : hourFormat}
							</StyledTimePickerValue>
							:
							<StyledTimePickerValue
								selected={currentScreen === "minute"}
								initial={minutes === undefined}
								className={joinClassNames(
									`${baseClassName}__time`,
									{ [`${baseClassName}__time--selected`]: currentScreen === "minute" },
									{ [`${baseClassName}__time--initial`]: minutes === undefined }
								)}
								onClick={() => this.changeScreen("minute", 0)}
								onKeyDown={noop}
								data-role={DataRoles.TimePicker.Time}
							>
								{minutes !== undefined ? TimeUtils.getFormattedMinute(minutes, minuteFormat) : minuteFormat}
							</StyledTimePickerValue>
						</div>
						{use12HourMode
							? [
									<StyledTimePickerFormatSelection
										className={`${baseClassName}__am ` + (isAM ? `${baseClassName}__am--selected` : "")}
										onClick={() => this.setAM(true)}
										selected={isAM}
										onKeyDown={noop}
										key="am"
										timeFormat="am"
										data-role={DataRoles.TimePicker.Am}
									>
										am
									</StyledTimePickerFormatSelection>,
									<StyledTimePickerFormatSelection
										selected={!isAM}
										className={`${baseClassName}__pm ` + (!isAM ? `${baseClassName}__pm--selected` : "")}
										onClick={() => this.setAM(false)}
										onKeyDown={noop}
										key="pm"
										timeFormat="pm"
										data-role={DataRoles.TimePicker.Pm}
									>
										pm
									</StyledTimePickerFormatSelection>
								]
							: undefined}
					</StyledTimePickerSetting>
				</StyledTimePickerBody>
			);
		}
	}
}
