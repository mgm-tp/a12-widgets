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

import type { ComponentType, ContextType, ReactNode, ChangeEvent, KeyboardEvent, ReactElement, FC } from "react";
import { Component, useContext, useMemo, useCallback } from "react";
import { Key } from "ts-key-enum";
import { isMatch } from "react-day-picker";

import { bindMethods, convertToArr, inputWithSuffixName, StringUtils } from "../../../common/main/utils.js";
import { TimeUtils } from "../../../common/main/date-time/time-utils.js";
import { DateTimeUtils } from "../../../common/main/date-time/date-utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { DateTimeContext } from "../../../common/main/date-time/date-time-context.js";

import type { DateTimePickerProps } from "../date-time-picker.api.js";
import { StyledDateTimePickerInput } from "../date-time-picker.styled.js";

import type { DateTimePickerInputProps } from "./date-time-picker-input.api.js";
import { DateTimePickerDialog } from "./date-time-picker-dialog.view.js";
import { createDefaultDateTimeConverter, createDefaultDateTimeFormatter } from "./date-time-picker-input.internal.js";

export interface DateTimePickerInputState {
	showPicker: boolean;
	inputValue?: string;
	prevValue?: string;
	selectedDate?: Date;
}

export function DateTimePickerInput<T extends DateTimePickerProps>(
	Picker: ComponentType<T>
): FC<DateTimePickerInputProps<T>> {
	const Dialog = DateTimePickerDialog<T>(Picker);

	type DateTimePickerUTCProps = DateTimePickerInputProps<T> &
		Required<Pick<DateTimePickerInputProps<T>, "dateTimeFormatter" | "dateTimeConverter">>;

	class DateTimePickerInputUTC extends Component<DateTimePickerUTCProps, DateTimePickerInputState> {
		static displayName = "DateTimePickerInputUTC";
		declare context: ContextType<typeof DateTimeContext>;

		buttonPickerRef: HTMLElement | null = null;
		private converter = DateTimeUtils.createTimezoneConverter(this.props.pickerProps?.timezone).convertDate;

		constructor(props: DateTimePickerUTCProps) {
			super(props);
			this.state = {
				inputValue: props.initialText || this.formatDateTime(props.pickerProps?.value),
				showPicker: false,
				selectedDate: props.pickerProps?.value,
				prevValue: ""
			};
			props.clearHandler?.(() => this.handleClearAll());
			bindMethods(this);
		}

		componentDidUpdate(
			prevProps: Readonly<DateTimePickerUTCProps>,
			prevState: Readonly<DateTimePickerInputState>
		): void {
			if (
				prevProps.dateTimeFormatter(this.props.pickerProps?.value) !==
				this.props.dateTimeFormatter(this.props.pickerProps?.value)
			) {
				this.setState({ inputValue: this.props.dateTimeFormatter(this.props.pickerProps?.value) });

				return;
			}

			if (!TimeUtils.isSameTime(this.props.pickerProps?.value, prevProps.pickerProps?.value)) {
				const nextDisplayValue = this.formatDateTime(this.props.pickerProps?.value);

				if (prevState.inputValue !== nextDisplayValue && nextDisplayValue !== "") {
					this.setState({
						inputValue: nextDisplayValue,
						selectedDate: this.props.pickerProps?.value
					});
				}
			}
		}

		render(): ReactNode {
			const {
				pickerProps,
				buttonIcon,
				inputLabel,
				inputErrorMessage,
				inputWarningMessage,
				inputTooltips,
				id,
				...rest
			} = this.props;
			const dateTimeInputFormat =
				this.props.placeholder || DateTimeUtils.getDateTimeFormat(this.props.dateTimeInputFormat, this.context.locale);
			const inputId = inputWithSuffixName(id ?? pickerProps?.id);
			const triggerButtonTitleId = pickerProps?.id && `${pickerProps.id}-trigger-button-title`;

			return (
				<A11YLanguageContext.Consumer>
					{(a11y) => {
						const buttonTriggerTitle = a11y.pickerTitles && a11y.pickerTitles.dateTimePickerTrigger;

						const button = !pickerProps?.hidePickerButton ? (
							<Button
								id={pickerProps?.id && `${pickerProps.id}-trigger-button`}
								icon={buttonIcon || <Icon>event</Icon>}
								title={buttonTriggerTitle}
								onClick={this.handleButtonPress}
								buttonRef={this.getPicketButtonRef}
								block
								disabled={this.props.disabled || this.props.readonly}
								buttonAttributes={{
									"aria-labelledby": StringUtils.join(
										{ [`${inputId}-label`]: inputId && (inputLabel || dateTimeInputFormat) },
										{ [`${triggerButtonTitleId}`]: !!buttonTriggerTitle && triggerButtonTitleId }
									)
								}}
							>
								{buttonTriggerTitle && <HiddenText id={triggerButtonTitleId}>{`, ${buttonTriggerTitle}`}</HiddenText>}
							</Button>
						) : undefined;

						return (
							<>
								<StyledDateTimePickerInput
									{...rest}
									label={inputLabel}
									errorMessage={inputErrorMessage}
									warningMessage={inputWarningMessage}
									addonAfter={inputTooltips}
									placeholder={dateTimeInputFormat}
									value={this.state.inputValue}
									prefixes={button}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
									onKeyDown={this.handleKeyDown}
									id={inputId}
								/>
								{this.buttonPickerRef && this.state.showPicker && (
									<Dialog
										referenceElement={this.buttonPickerRef}
										pickerProps={{
											...(pickerProps || ({} as T)),
											value: !this.props.inputErrorMessage
												? this.converter.toTimezone(this.state.selectedDate)
												: undefined,
											onAccept: this.triggerDateTimeAccept,
											onClose: () => {
												this.setState({ showPicker: false });
											}
										}}
									/>
								)}
							</>
						);
					}}
				</A11YLanguageContext.Consumer>
			);
		}

		private handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
			this.setState((prevState) => ({ inputValue: event.target.value, prevValue: prevState.inputValue }));
		}

		private formatDateTime(value?: Date): string {
			return this.props.dateTimeFormatter(value);
		}

		private handleClearAll(): void {
			this.setState({
				inputValue: undefined,
				selectedDate: undefined,
				prevValue: undefined
			});
			this.props.onInputChange?.("");
			this.props.pickerProps?.onAccept?.(undefined);
		}

		private handleSubmit(): void {
			const value = this.state.inputValue ?? "";
			const isValueChanged = value !== this.state.prevValue;
			const triggerCallback = (cb: () => void): void => {
				if (isValueChanged) {
					cb();
				}
			};

			triggerCallback(() => this.props.onInputChange?.(value));

			if (value.trim()) {
				const convertedDateTime = this.props.dateTimeConverter(value);
				const validDateTime =
					convertedDateTime &&
					(!this.props.pickerProps?.disabled ||
						!isMatch(convertedDateTime, convertToArr(this.props.pickerProps?.disabled)));

				if (validDateTime) {
					this.setState({
						inputValue: this.formatDateTime(convertedDateTime),
						showPicker: false,
						selectedDate: convertedDateTime
					});
				} else {
					this.setState({
						inputValue: value,
						showPicker: false
					});
				}

				triggerCallback(() => {
					if (validDateTime) {
						this.props.pickerProps?.onAccept?.(convertedDateTime);
					} else {
						this.props.onInputValidationError?.(value);
					}
				});
			} else {
				this.setState({ inputValue: undefined, showPicker: false, selectedDate: undefined });
				triggerCallback(() => this.props.pickerProps?.onChange?.(undefined, undefined));
			}

			this.setState({ prevValue: this.state.inputValue });
		}

		private handleInputBlur(): void {
			this.handleSubmit();
		}

		private triggerDateTimeAccept(dateTime?: Date): void {
			const utcDateTime = this.converter.toUTC(dateTime);
			this.setState(
				{ inputValue: this.formatDateTime(utcDateTime), selectedDate: utcDateTime, showPicker: false },
				() => {
					this.props.pickerProps?.onAccept?.(utcDateTime);
					this.props.onInputChange?.(this.state.inputValue ?? "");
				}
			);
		}

		private handleButtonPress(): void {
			this.setState({ showPicker: true });
		}

		private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
			if (event.key === Key.Tab) {
				this.setState({ showPicker: false });
			}

			if (event.key === Key.Enter) {
				this.handleSubmit();
			}
		}

		private getPicketButtonRef(ref: HTMLElement | null): void {
			this.buttonPickerRef = ref;
		}
	}
	DateTimePickerInputUTC.contextType = DateTimeContext;

	const DateTimePickerInput = (props: DateTimePickerInputProps<T>): ReactElement<DateTimePickerInputProps<T>> => {
		const { dateTimeInputFormat, pickerProps, dateTimeConverter, dateTimeFormatter } = props;
		const { locale } = useContext(DateTimeContext);

		const {
			onChange,
			onAccept,
			timezone,
			value: valueTZ,
			customHeaderElement,
			customFooterElement
		} = pickerProps ?? {};

		const { convertDate } = useMemo(() => DateTimeUtils.createTimezoneConverter(timezone), [timezone]);

		const value = useMemo(() => (valueTZ ? convertDate.toUTC(valueTZ) : undefined), [convertDate, valueTZ]);

		const _onChange = useCallback((date: Date) => onChange?.(convertDate.toTimezone(date)), [convertDate, onChange]);

		const _onAccept = useCallback((range: Date) => onAccept?.(convertDate.toTimezone(range)), [convertDate, onAccept]);

		const _customHeaderElement = useMemo(() => {
			if (customHeaderElement instanceof Function) {
				return (datetime?: Date, screen?: DateTimePickerProps.Screen): ReactNode =>
					customHeaderElement(convertDate.toTimezone(datetime), screen);
			}

			return customHeaderElement;
		}, [convertDate, customHeaderElement]);

		const _customFooterElement = useMemo(() => {
			if (customFooterElement instanceof Function) {
				return (datetime?: Date, screen?: DateTimePickerProps.Screen): ReactNode =>
					customFooterElement(convertDate.toTimezone(datetime), screen);
			}

			return customFooterElement;
		}, [convertDate, customFooterElement]);

		const _dateTimeConverter: DateTimePickerProps.DateTimeConverter = useMemo(() => {
			const converter =
				dateTimeConverter ??
				createDefaultDateTimeConverter({
					timezone,
					dateTimeInputFormat,
					locale
				});

			return (inputTZ) => convertDate.toUTC(converter(inputTZ));
		}, [convertDate, dateTimeConverter, dateTimeInputFormat, locale, timezone]);

		const _dateTimeFormatter: DateTimePickerProps.DateTimeFormatter = useMemo(() => {
			const formatter =
				dateTimeFormatter ??
				createDefaultDateTimeFormatter({
					timezone,
					locale,
					dateTimeInputFormat
				});

			return (timeUTC) => formatter(convertDate.toTimezone(timeUTC));
		}, [convertDate, dateTimeFormatter, dateTimeInputFormat, locale, timezone]);

		return (
			<DateTimePickerInputUTC
				{...props}
				pickerProps={{
					...(pickerProps || ({} as T)),
					onChange: _onChange,
					onAccept: _onAccept,
					value,
					customHeaderElement: _customHeaderElement,
					customFooterElement: _customFooterElement
				}}
				dateTimeFormatter={_dateTimeFormatter}
				dateTimeConverter={_dateTimeConverter}
			/>
		);
	};

	DateTimePickerInput.displayName = "DateTimePickerInput";

	return DateTimePickerInput;
}
