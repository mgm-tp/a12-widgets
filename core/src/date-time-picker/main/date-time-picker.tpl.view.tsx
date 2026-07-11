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

import type { ReactElement, ReactNode, HTMLAttributes } from "react";

import type {
	DatePickerProps,
	DatePickerFooterProps,
	DatePickerFooterActionProps
} from "../../datepicker/main/date-picker.api.js";
import { DatePicker } from "../../datepicker/main/date-picker.view.js";
import {
	DatePickerFooter as DatePickerFooter,
	DatePickerFooterAction as DatePickerFooterAction
} from "../../datepicker/main/date-picker.tpl.view.js";
import type { TimePickerProps } from "../../time-picker/main/time-picker.api.js";
import { TimePickerDialog } from "../../time-picker/main/time-picker.mobile.view.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import type { Ref, Container, Identifiable, Styleable } from "../../common/main/base-props.js";
import {
	StyledTimePickerActions,
	StyledTimePickerHeader,
	StyledTimePickerText
} from "../../time-picker/main/time-picker.styled.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledDateTimePicker } from "./date-time-picker.styled.js";

const baseClassName = addPrefix("TimePicker");

export type DateTimePickerFooterProps = DatePickerFooterProps;

export function DateTimePickerFooter(props: DateTimePickerFooterProps): ReactElement<DateTimePickerFooterProps> {
	const { className, dataRole, ...rest } = props;

	return (
		<DatePickerFooter
			{...rest}
			className={joinClassNames(`${baseClassName}__footer`, props.className)}
			dataRole={dataRole || DataRoles.DateTimePicker.Footer}
		>
			{props.children}
		</DatePickerFooter>
	);
}

DateTimePickerFooter.displayName = "DateTimePickerFooter";

export namespace DateTimePickerFooter {
	export type ActionProps = DatePickerFooterActionProps;

	export function Action(props: ActionProps): ReactElement<ActionProps> {
		const { className, dataRole, ...rest } = props;

		return (
			<DatePickerFooterAction
				{...rest}
				className={joinClassNames(`${baseClassName}__action`, props.className)}
				dataRole={DataRoles.DateTimePicker.Footer.Action}
			>
				{props.children}
			</DatePickerFooterAction>
		);
	}
}

export interface DateTimePickerHeaderProps extends Styleable, Identifiable, Container {
	actionButtons?: ReactNode;
}

export function DateTimePickerHeader(props: DateTimePickerHeaderProps): ReactElement<DateTimePickerHeaderProps> {
	const titleId = props.id ? `${props.id}-title` : undefined;

	return (
		<StyledTimePickerHeader
			className={joinClassNames(`${baseClassName}__header`, props.className)}
			style={props.style}
			id={props.id}
			data-role={DataRoles.DateTimePicker.Header}
		>
			{props.actionButtons && (
				<StyledTimePickerActions
					className={`${baseClassName}__actions`}
					data-role={DataRoles.DateTimePicker.Header.Actions}
				>
					{props.actionButtons}
				</StyledTimePickerActions>
			)}
			<StyledTimePickerText
				id={titleId}
				className={`${baseClassName}__title`}
				data-role={DataRoles.DateTimePicker.Title}
			>
				{props.children}
			</StyledTimePickerText>
		</StyledTimePickerHeader>
	);
}

DateTimePickerHeader.displayName = "DateTimePickerHeader";

export type ScreenProps = Ref;

export interface TimePickerScreenProps extends ScreenProps, Styleable, Identifiable {
	time?: Date;
	dateDisplay?: ReactNode;
	mode?: TimePickerProps.ClockMode;
	initialScreen?: TimePickerProps.Screen;
	headerElement?: ReactNode;
	footerElement?: ReactNode;
	mobileMode?: boolean;
	desktopPickerAttributes?: HTMLAttributes<HTMLDivElement>;
	mobilePickerAttributes?: HTMLAttributes<HTMLDivElement>;

	/**
	 * Timezone database name e.g.: America/New_York
	 * See {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List} for more detail
	 */
	timezone?: string;

	onScreenChange?(newScreen: TimePickerProps.Screen): void;
	onTimeChange?(time?: Date): void;
}

export function TimePickerScreen(props: TimePickerScreenProps): ReactElement<TimePickerScreenProps> {
	const { mobileMode, desktopPickerAttributes, mobilePickerAttributes } = props;

	return (
		<StyledDateTimePicker
			tabIndex={-1}
			data-role={DataRoles.DateTimePicker}
			role="dialog"
			ref={props.wrapperRef}
			id={props.id}
			style={props.style}
			className={joinClassNames(`${addPrefix("DateTimePicker")} ${baseClassName}--dialog`, props.className)}
			isTimeScreen
			{...(mobileMode ? mobilePickerAttributes : desktopPickerAttributes)}
		>
			{props.headerElement}
			<TimePickerDialog.Picker
				id={props.id && `${props.id}-time-screen`}
				initialScreen={props.initialScreen}
				onScreenChange={props.onScreenChange}
				onChange={props.onTimeChange}
				value={props.time}
				mode={props.mode}
				dateDisplay={props.dateDisplay}
				timezone={props.timezone}
			/>
			{props.footerElement}
		</StyledDateTimePicker>
	);
}

TimePickerScreen.displayName = "TimePickerScreen";

export interface DatePickerScreenProps
	extends Omit<DatePickerProps, "onChange" | "value" | "footer" | "onDateRangeChange">, ScreenProps {
	date?: Date;
	timeEditElement?: ReactNode;
	footerElement?: ReactNode;
	headerElement?: ReactNode;
	mobileMode?: boolean;
	desktopPickerAttributes?: HTMLAttributes<HTMLDivElement>;
	mobilePickerAttributes?: HTMLAttributes<HTMLDivElement>;
	onDayChange?(newDate: Date): void;
}

export function DatePickerScreen(props: DatePickerScreenProps): ReactElement<DatePickerScreenProps> {
	const {
		id,
		style,
		wrapperRef,
		date,
		onDayChange,
		className,
		mobileMode,
		headerElement,
		timeEditElement,
		footerElement,
		desktopPickerAttributes,
		mobilePickerAttributes,
		...rest
	} = props;

	return (
		<StyledDateTimePicker
			tabIndex={-1}
			data-role={DataRoles.DateTimePicker}
			role="dialog"
			id={id}
			style={style}
			ref={wrapperRef}
			className={joinClassNames(addPrefix("DateTimePicker"), className)}
			{...(mobileMode ? mobilePickerAttributes : desktopPickerAttributes)}
		>
			{headerElement}
			<DatePicker
				{...rest}
				id={id && `${id}-date-screen`}
				className={mobileMode ? addPrefix("DayPicker--mobile") : ""}
				value={date}
				mobile={mobileMode}
				onChange={onDayChange}
			/>
			{timeEditElement}
			{footerElement}
		</StyledDateTimePicker>
	);
}

DatePickerScreen.displayName = "DatePickerScreen";
