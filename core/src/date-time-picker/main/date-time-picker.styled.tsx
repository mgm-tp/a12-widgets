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

import { styled, css } from "styled-components";

import { StyledButton } from "../../button/main/button.styled.js";
import { addPrefix } from "../../common/main/utils.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { StyledTimePickerInput } from "../../time-picker/main/time-picker.styled.js";
import { StyledDatePicker } from "../../datepicker/main/date-picker.styled.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";
import { TextField } from "../../input/text-field/text-field.view.js";

import StyledDatePickerContainer = StyledDatePicker.StyledDatePickerContainer;

const datePickerClassName = addPrefix("DayPicker");

export const StyledDateTimePickerInput = styled(TextField)(({ theme }) => {
	const { input } = theme.components.dateTimePicker;

	return css`
		${input?.focus?.customBorder &&
		css`
			[data-isfocused="true"] {
				${createBoxShadow(input?.focus?.customBorder)}
			}
		`}
	`;
});

export const StyledDateTimePicker = styled.div.withConfig({ displayName: "StyledDateTimePicker-sc-" })<{
	isTimeScreen?: boolean;
}>(({ theme, isTimeScreen }) => {
	const { dateTimePicker, datePicker, timePicker } = theme.components;

	return css`
		box-shadow: ${datePicker.wrapper.boxShadow};
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		outline: 1px solid transparent;
		overflow: auto;

		.${datePickerClassName}-Table {
			padding: ${dateTimePicker.dateScreen.datePicker.body.padding};
		}

		.${datePickerClassName}-Weekday {
			padding: ${dateTimePicker.dateScreen.datePicker.weekDay.padding};
		}

		${StyledTimePickerInput} {
			background-color: ${datePicker.month.background};
			flex-direction: row;
			padding: ${dateTimePicker.dateScreen.timePicker.padding};
		}

		${StyledDatePickerContainer} {
			border: none;
		}

		${isTimeScreen &&
		css`
			background-color: ${timePicker.dialog.background};
		`}
	`;
});

export const StyledDateTimePickerTimeDisplay = styled.span.withConfig({
	displayName: "StyledDateTimePickerTimeDisplay-sc-"
})<{ isInitialized?: boolean }>(({ theme, isInitialized }) => {
	const { dateScreen } = theme.components.dateTimePicker;

	return css`
		display: flex;
		flex: 1 0 0;
		padding: ${dateScreen.timePicker.timeDisplay.padding};

		${isInitialized &&
		css`
			font-style: ${dateScreen.timePicker.timeDisplay.fontStyle};
			font-weight: ${dateScreen.timePicker.timeDisplay.fontWeight};
		`}
	`;
});

export const StyledDateTimePickerTimeButton = styled.span.withConfig({ displayName: "DateTimePickerTimeDisplay-sc-" })(
	({ theme }) => {
		const { dateTimePicker } = theme.components;

		return css`
			display: inline-flex;
			flex: 2 0 0;
			justify-content: flex-end;

			& > ${StyledIconWrapper} {
				padding-bottom: 0;
			}

			& > ${StyledButton} {
				height: auto;
				max-width: ${dateTimePicker.dateScreen.timePicker.timeInputMaxWidth};
				text-align: right;
			}
		`;
	}
);
