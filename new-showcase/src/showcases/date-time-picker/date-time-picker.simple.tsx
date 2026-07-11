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

import type { ReactNode, ReactElement, FocusEvent } from "react";
import { useRef, useState, useCallback, useMemo } from "react";

import {
	ModalOverlay,
	AttachedPortal,
	Icon,
	Button,
	BufferedInput,
	HTMLInputAdapter,
	TextField,
	DateTimePicker,
	inputWithSuffixName,
	StringUtils,
	DateTimeUtils,
	provider,
	HiddenText
} from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "../inputs/year-selector/year-selector-validation.utils.js";

const BufferedStringInput = BufferedInput(HTMLInputAdapter(TextField));
const dateTimeFormat = "MM/DD/YYYY h:mm A";
const id = "date-time-picker-simple";

export function SimpleDateTimePicker(): ReactElement {
	const referenceElement = useRef<HTMLButtonElement | null>(null);
	const updateElementPosition = useRef<(() => void) | undefined>(undefined);

	const [showPicker, setShowPicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [value, setValue] = useState("");
	const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

	const getReferenceElement = useCallback((ref: HTMLButtonElement | null): void => {
		referenceElement.current = ref;
	}, []);

	const onClose = useCallback((): void => {
		setShowPicker(false);
	}, []);

	const handleInputChange = useCallback((value: string): void => {
		if (value !== "") {
			const selectedDate = DateTimeUtils.parseDateTimeUTC(value, dateTimeFormat);
			setSelectedDate(selectedDate);
			setValue(value);
		} else {
			setSelectedDate(undefined);
			setValue("");
		}
	}, []);

	const onAcceptValue = useCallback((value?: Date) => {
		setSelectedDate(value);
		setShowPicker(false);
		setValue("");
	}, []);

	const handleYearBlur = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearErrorMessage(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	const renderPicker = useMemo((): ReactNode => {
		return provider.hasTouch() ? (
			<ModalOverlay preventScroll closeOnOutsideClick={provider.isDesktop()} noGutter onClose={onClose}>
				<DateTimePicker
					id={id}
					mobileMode
					value={selectedDate}
					onAccept={onAcceptValue}
					onClose={onClose}
					dateDisplayInTimePicker={selectedDate ? DateTimeUtils.formatUTCDateTime(selectedDate) : ""}
					onYearSelectorBlur={handleYearBlur}
					yearErrorMessage={yearErrorMessage}
				/>
			</ModalOverlay>
		) : referenceElement.current ? (
			<AttachedPortal
				selfSizing
				fixedOrientation
				closeOnOutsideClick
				adjustPositionToScreen
				focusOnReferenceElementAfterClose
				referenceElement={referenceElement.current}
				orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
				updateElementPosition={(handler) => {
					updateElementPosition.current = handler;
				}}
				onVisibilityChange={(isVisible) => {
					if (!isVisible) {
						setShowPicker(false);
					}
				}}
			>
				<DateTimePicker
					id={id}
					value={selectedDate}
					onAccept={(value) => {
						setSelectedDate(value);
						setShowPicker(false);
						setValue("");
					}}
					onScreenChange={(screen, screenRef) => {
						updateElementPosition.current?.();
						setTimeout(() => {
							screenRef?.focus();
						});
					}}
					onYearSelectorBlur={handleYearBlur}
					yearErrorMessage={yearErrorMessage}
				/>
			</AttachedPortal>
		) : undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onClose, selectedDate, referenceElement.current, handleYearBlur, yearErrorMessage]);

	const errorMessage = useMemo(
		() => value !== "" && !DateTimeUtils.parseDateTimeUTC(value, dateTimeFormat) && `Invalid value: ${value}`,
		[value]
	);

	const chosenDate = DateTimeUtils.toISOString(selectedDate);
	const triggerButtonTitle = "Select a date and time";
	const buttonTitleId = `${id}-trigger-button-title`;

	return (
		<div className="-u-width-full">
			<BufferedStringInput
				id={inputWithSuffixName(id)}
				alwaysSubmit
				prefixes={
					<Button
						id={`${id}-trigger-button`}
						icon={<Icon>event</Icon>}
						onClick={() => setShowPicker(true)}
						buttonRef={getReferenceElement}
						block
						title={triggerButtonTitle}
						buttonAttributes={{
							"aria-labelledby": StringUtils.join(`${inputWithSuffixName(id)}-label`, buttonTitleId)
						}}
					>
						<HiddenText id={buttonTitleId}>, {triggerButtonTitle}</HiddenText>
					</Button>
				}
				value={selectedDate ? DateTimeUtils.formatUTCDateTime(selectedDate, undefined, dateTimeFormat) : value}
				initialValue={selectedDate ? DateTimeUtils.formatUTCDateTime(selectedDate, undefined, dateTimeFormat) : ""}
				errorMessage={errorMessage}
				onValueSubmit={handleInputChange}
				label="Simple Date Time Picker"
				labelGraphic={<Icon>info</Icon>}
				placeholder={dateTimeFormat}
				helperText={
					<>
						{chosenDate ? (
							<>
								Chosen datetime is <em>{chosenDate}</em>
							</>
						) : (
							"You haven't chosen a date and time yet."
						)}
					</>
				}
				submitOnEnter
			/>
			{showPicker && referenceElement && renderPicker}
		</div>
	);
}
