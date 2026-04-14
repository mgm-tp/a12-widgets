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

import type { ReactElement } from "react";
import { useRef, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { isDateRange, isMatch } from "react-day-picker";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { Button } from "../../button/main/button.view.js";
import { convertToArr, generateUid, inputWithSuffixName, StringUtils } from "../../common/main/utils.js";
import { DateTimeUtils, isMatcher } from "../../common/main/date-time/date-utils.js";
import { provider } from "../../common/main/device-detector.js";
import { Icon } from "../../icon/main/icon.view.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";

import type { DateInputProps } from "./date-input.api.js";
import { DatePickerDialog } from "./date-picker.mobile.view.js";
import { DatePicker } from "./date-picker.view.js";
import type { DateRange } from "./date-range.api.js";
import { StyledBufferedStringDatePickerInput } from "./date-picker.styled.js";

import isRangeMatcher = DateTimeUtils.isRangeMatcher;

export function DateInput(props: DateInputProps): ReactElement<DateInputProps> {
	const {
		id: dateInputId,
		defaultValue,
		label,
		placeholder,
		pickerButtonTitle,
		hidePickerButton,
		customPickerButtonIcon,
		inputRef,
		buttonRef,
		datePickerDialogProps,
		useRangePicker,
		datePickerProps,
		onInputValidationError,
		onSelectedDayChange,
		onInputChange,
		dateConverter,
		dateFormatter,
		clearHandler,
		errorMessage,
		valueChangeHandler,
		...rest
	} = props;

	const buttonPickerRef = useRef<HTMLElement | null>(null);
	const datePickerRef = useRef<HTMLElement | null>(null);
	const { pickerTitles } = useContext(A11YLanguageContext);

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		isRangeMatcher(defaultValue) ? undefined : defaultValue
	);
	const [newDate, setNewDate] = useState<Date | undefined>(undefined);
	const [month, setMonth] = useState<Date | undefined>(datePickerProps?.month);

	const [range, setRange] = useState<DateRange | undefined>(isRangeMatcher(defaultValue) ? defaultValue : undefined);
	const [newRange, setNewRange] = useState<DateRange | undefined>();

	const [showPicker, setShowPicker] = useState(false);
	const [inputValue, setInputValue] = useState(
		defaultValue && !isRangeMatcher(defaultValue) ? dateFormatter(defaultValue) : ""
	);

	const selectedDays = useMemo(() => {
		return useRangePicker ? newRange : convertToArr(datePickerProps?.selected).filter(isMatcher);
	}, [useRangePicker, newRange, datePickerProps?.selected]);

	const disabledDays = useMemo(() => {
		return convertToArr(datePickerProps?.disabled).filter(isMatcher);
	}, [datePickerProps?.disabled]);

	const getButtonRef = useCallback(
		(ref: HTMLButtonElement | null): void => {
			buttonPickerRef.current = ref;

			buttonRef?.(ref);
		},
		[buttonRef]
	);

	const getDatePickerRef = useCallback(
		(ref: HTMLElement | null): void => {
			datePickerRef.current = ref;
		},
		[datePickerRef]
	);

	const handleDatePickerChange = useCallback(
		(value: Date, usePicker = true): void => {
			if (provider.hasTouch()) {
				setNewDate(value);
			} else {
				setSelectedDate(value);
				setShowPicker(false);
				setInputValue("");

				if (usePicker) {
					buttonPickerRef.current?.focus();
				}

				onSelectedDayChange?.(value);
			}

			onInputChange?.("");
		},
		[onInputChange, onSelectedDayChange]
	);

	const handleDateRangePickerChange = useCallback(
		(value: DateRange | undefined): void => {
			setNewRange(value);
			datePickerProps?.onDateRangeChange?.(value);
		},
		[datePickerProps]
	);

	const handleOpen = useCallback((): void => {
		setShowPicker((prev) => !prev);

		if (useRangePicker && range?.from && range.to) {
			setNewRange(range);
		} else {
			setNewDate(selectedDate);
		}
	}, [useRangePicker, range, selectedDate]);

	const handleClose = useCallback((): void => {
		setShowPicker(false);
		setNewDate(undefined);
		setNewRange(undefined);
	}, []);

	const handleSubmitOnTouch = useCallback((): void => {
		if (useRangePicker) {
			setShowPicker(false);
			setRange(newRange);
			setMonth(newRange?.from);
			datePickerProps?.footer?.onAccept?.(newRange);
			onInputChange?.("");
		} else {
			setSelectedDate(newDate);
			onSelectedDayChange?.(newDate);
		}

		setInputValue("");
		handleClose();
	}, [useRangePicker, handleClose, newRange, datePickerProps?.footer, onInputChange, newDate, onSelectedDayChange]);

	const handleClearOnTouch = useCallback((): void => {
		setNewRange(undefined);
		datePickerRef.current?.focus();
		setMonth(undefined);
	}, []);

	const handlePickerVisibilityChange = useCallback((isVisible: boolean): void => {
		setShowPicker(isVisible);
	}, []);

	const handleInputChange = useCallback(
		(value: string): void => {
			const triggerCallback = (cb: () => void): void => {
				if (value !== inputValue) {
					cb();
				}
			};

			setInputValue(value);
			triggerCallback(() => onInputChange?.(value));

			if (value.trim() === "") {
				setSelectedDate(undefined);
				setRange(undefined);

				onSelectedDayChange?.(undefined);
				datePickerProps?.footer?.onAccept?.(undefined);
				onInputValidationError?.("");

				return;
			}

			if (useRangePicker) {
				const convertedRange = dateConverter(value);
				const fromDate = isDateRange(convertedRange) ? convertedRange?.from : undefined;
				const toDate = isDateRange(convertedRange) ? convertedRange?.to : undefined;
				const validRange = !!(fromDate && toDate && !isMatch(fromDate, disabledDays) && !isMatch(toDate, disabledDays));

				setRange(validRange ? { from: fromDate, to: toDate } : undefined);
				triggerCallback(() =>
					datePickerProps?.footer?.onAccept?.(validRange ? { from: fromDate, to: toDate } : undefined)
				);

				if (!validRange) {
					onInputValidationError?.(value);
				}
			} else {
				const convertedDate = dateConverter(value);
				const returnedDate = convertedDate && !isRangeMatcher(convertedDate) ? convertedDate : undefined;
				const validDate = returnedDate && !isMatch(returnedDate, disabledDays);
				setSelectedDate(validDate ? returnedDate : undefined);
				triggerCallback(() =>
					onSelectedDayChange?.(validDate && !isDateRange(convertedDate) ? returnedDate : undefined)
				);

				if (!validDate) {
					onInputValidationError?.(value);
				}
			}
		},
		[
			useRangePicker,
			inputValue,
			onInputChange,
			onSelectedDayChange,
			datePickerProps?.footer,
			dateConverter,
			disabledDays,
			onInputValidationError
		]
	);

	const onDateRangeAccept = useCallback(
		(value: DateRange, usePicker = true): void => {
			setShowPicker(false);
			setRange(value);
			setNewRange(undefined);
			setMonth(undefined);
			setInputValue("");

			if (usePicker) {
				buttonPickerRef.current?.focus();
				datePickerProps?.footer?.onAccept?.(newRange === undefined ? undefined : value);
			} else {
				datePickerProps?.footer?.onAccept?.(value);
			}

			onInputChange?.("");
		},
		[datePickerProps?.footer, newRange, onInputChange]
	);

	const onDateClear = useCallback((): void => {
		setNewRange(undefined);
		datePickerProps?.footer?.onClear?.();
		datePickerRef.current?.focus();
	}, [datePickerProps?.footer]);

	const handleClearAll = useCallback((): void => {
		setSelectedDate(undefined);
		setRange(undefined);
		setInputValue("");
		onInputChange?.("");
		onSelectedDayChange?.(undefined);
		setMonth(undefined);
		datePickerProps?.onDateRangeChange?.(undefined);
	}, [datePickerProps, onInputChange, onSelectedDayChange]);

	const handleValueChange = useCallback(
		(value: Date | DateRange | undefined): void => {
			if (!value) {
				handleClearAll();
				onInputValidationError?.("");

				if (useRangePicker) {
					datePickerProps?.footer?.onAccept?.(undefined);
				} else {
					onSelectedDayChange?.(undefined);
				}

				return;
			}

			if (isRangeMatcher(value) && value.from && value.to) {
				const displayedRangeString = `${dateFormatter(value.from)} - ${dateFormatter(value.to)}`;
				const convertedDateRange = dateConverter(displayedRangeString);

				if (isRangeMatcher(convertedDateRange)) {
					const validRange =
						convertedDateRange.from &&
						convertedDateRange.to &&
						!isMatch(convertedDateRange.from, disabledDays) &&
						!isMatch(convertedDateRange.to, disabledDays);

					if (validRange) {
						onDateRangeAccept(convertedDateRange, false);
					} else {
						setRange(undefined);
						onInputValidationError?.(displayedRangeString);
					}
				} else {
					// invalid value if convertedDateRange is undefined
					onInputValidationError?.(displayedRangeString);
				}

				setInputValue(displayedRangeString);
			} else if (!isRangeMatcher(value)) {
				const convertedDate = dateConverter(dateFormatter(value));

				if (convertedDate && !isRangeMatcher(convertedDate)) {
					const validDate = !isMatch(convertedDate, disabledDays);

					if (validDate) {
						handleDatePickerChange(convertedDate, false);
					} else {
						setSelectedDate(undefined);
						onInputValidationError?.(dateFormatter(value));
					}
				} else {
					// invalid value if convertedDate is undefined
					onInputValidationError?.(dateFormatter(value));
				}

				setInputValue(dateFormatter(value));
			}
		},
		[
			dateConverter,
			dateFormatter,
			datePickerProps?.footer,
			disabledDays,
			handleClearAll,
			handleDatePickerChange,
			onDateRangeAccept,
			onInputValidationError,
			onSelectedDayChange,
			useRangePicker
		]
	);

	const handleMonthChange = useCallback((month: Date) => {
		setMonth(month);
	}, []);

	useEffect(() => {
		clearHandler?.(handleClearAll);
	}, [clearHandler, handleClearAll]);

	useEffect(() => {
		valueChangeHandler?.(handleValueChange);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Reset states when click outside to close the picker without saving selected range/date.
		if (!showPicker) {
			if (newRange && (!range?.from || !range.to)) {
				setNewRange(undefined);
			}

			if (range?.from) {
				setMonth(range.from);
			} else if (selectedDate) {
				setMonth(selectedDate);
			} else {
				setMonth(datePickerProps?.month);
			}
		}
	}, [newRange, range, errorMessage, showPicker, selectedDate, datePickerProps?.month, useRangePicker]);

	const inputText = useMemo(() => {
		if (useRangePicker && range?.from && range.to) {
			const from = dateFormatter(range?.from ?? range?.from);
			const to = dateFormatter(range?.to ?? range?.to);

			return `${from} - ${to}`;
		}

		return selectedDate ? dateFormatter(selectedDate ?? selectedDate) : inputValue;
	}, [dateFormatter, inputValue, range, selectedDate, useRangePicker]);

	const dialogTitle = useMemo(() => {
		if (datePickerDialogProps?.title) {
			return datePickerDialogProps.title;
		}

		if (newDate) {
			return dateFormatter(newDate ?? newDate);
		}

		if (newRange?.from && newRange.to) {
			return `${dateFormatter(newRange.from)} - ${dateFormatter(newRange.to)}`;
		}

		return "";
	}, [dateFormatter, newDate, newRange?.from, newRange?.to, datePickerDialogProps?.title]);

	const id = useMemo(() => datePickerProps?.id || dateInputId, [datePickerProps?.id, dateInputId]);
	const inputId = inputWithSuffixName(id) ?? generateUid();
	const buttonTitleId = id ? `${id}-trigger-button-title` : undefined;
	const pickerButtonTriggerTitle =
		pickerButtonTitle ?? (customPickerButtonIcon ? undefined : pickerTitles?.datePickerTrigger);

	return (
		<>
			<StyledBufferedStringDatePickerInput
				{...rest}
				id={inputId}
				key="input"
				alwaysSubmit
				inputRef={inputRef}
				value={inputText}
				label={label}
				placeholder={placeholder}
				prefixes={
					props.prefixes ||
					(!hidePickerButton && (
						<Button
							id={id && `${id}-trigger-button`}
							icon={customPickerButtonIcon || <Icon>event</Icon>}
							key="button"
							buttonRef={getButtonRef}
							block
							disabled={props.disabled || props.readonly}
							title={pickerButtonTriggerTitle}
							buttonAttributes={{
								"aria-labelledby": StringUtils.join(
									{ [`${inputId}-label`]: label || placeholder },
									{ [`${buttonTitleId}`]: !!pickerButtonTriggerTitle && buttonTitleId }
								)
							}}
							onClick={handleOpen}
						>
							{pickerButtonTriggerTitle && (
								<HiddenText id={buttonTitleId}>{`, ${pickerButtonTriggerTitle}`}</HiddenText>
							)}
						</Button>
					))
				}
				submitOnEnter
				onValueSubmit={handleInputChange}
				errorMessage={errorMessage}
			/>
			{showPicker &&
				buttonPickerRef.current &&
				(!selectedDate || isFinite(selectedDate.valueOf())) &&
				(provider.hasTouch() ? (
					<DatePickerDialog
						{...datePickerProps}
						disabled={disabledDays}
						id={id}
						title={dialogTitle}
						submitButton={
							datePickerDialogProps?.okLabel && (
								<Button primary label={datePickerDialogProps.okLabel} onClick={handleSubmitOnTouch} />
							)
						}
						clearButton={
							(newRange?.from || month) &&
							datePickerDialogProps?.clearLabel && (
								<Button secondary destructive label={datePickerDialogProps.clearLabel} onClick={handleClearOnTouch} />
							)
						}
						wrapperRef={getDatePickerRef}
						value={!useRangePicker ? newDate : undefined}
						month={month}
						selected={selectedDays}
						onDateRangeChange={useRangePicker ? handleDateRangePickerChange : undefined}
						onChange={!useRangePicker ? handleDatePickerChange : undefined}
						onMonthChange={handleMonthChange}
						onClose={handleClose}
						mode={useRangePicker ? "range" : "single"}
						htmlAttributes={datePickerDialogProps?.htmlAttributes}
					/>
				) : (
					<AttachedPortal
						closeOnClickReferenceElement={false}
						key="picker"
						closeOnOutsideClick
						selfSizing
						referenceElement={buttonPickerRef.current}
						orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
						fixedOrientation
						adjustPositionToScreen
						onVisibilityChange={handlePickerVisibilityChange}
					>
						<DatePicker
							{...datePickerProps}
							disabled={disabledDays}
							id={datePickerProps?.id || dateInputId}
							onChange={!useRangePicker ? handleDatePickerChange : undefined}
							onDateRangeChange={useRangePicker ? handleDateRangePickerChange : undefined}
							value={!useRangePicker ? selectedDate : undefined}
							onMonthChange={handleMonthChange}
							month={month}
							selected={selectedDays}
							footer={
								useRangePicker
									? { ...datePickerProps?.footer, onAccept: onDateRangeAccept, onClear: onDateClear }
									: undefined
							}
							wrapperRef={getDatePickerRef}
							mode={useRangePicker ? "range" : "single"}
						/>
					</AttachedPortal>
				))}
		</>
	);
}

DateInput.displayName = "DateInput";
