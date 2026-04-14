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
import { useContext } from "react";

import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import type { ButtonProps } from "../../button/main/button.api.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledDatePicker, StyledDatePickerTemplate, StyledPickerHeaderButton } from "./date-picker.styled.js";
import type { DatePickerFooterActionProps, DatePickerFooterProps } from "./date-picker.api.js";
import { DatePickerContext } from "./date-picker.context.js";

const baseClassName = addPrefix("DayPicker");

const { StyledDatePickerFooter, StyledDatePickerFooterAction } = StyledDatePickerTemplate;

export function DatePickerFooter(props: DatePickerFooterProps): ReactElement<DatePickerFooterProps> {
	return (
		<StyledDatePickerFooter
			id={props.id}
			style={props.style}
			className={joinClassNames(addPrefix("picker-footer"), props.className)}
			data-role={props.dataRole || DataRoles.Picker.Footer}
		>
			{props.children}
		</StyledDatePickerFooter>
	);
}

DatePickerFooter.displayName = "DatePickerFooter";

export function DatePickerFooterAction(props: DatePickerFooterActionProps): ReactElement<DatePickerFooterActionProps> {
	return (
		<StyledDatePickerFooterAction
			id={props.id}
			style={props.style}
			className={joinClassNames(addPrefix("picker-footer__action"), props.className)}
			data-role={props.dataRole || DataRoles.Picker.Footer.Action}
		>
			{props.children}
		</StyledDatePickerFooterAction>
	);
}

DatePickerFooterAction.displayName = "DatePickerFooterAction";

/**
 * The style of this button will be adapted according to themes:
 * - DEFAULT theme: inverted style, which similar to the inverted icon button.
 * - FLAT theme: regular style, which similar to the default icon button.
 *
 * NOTE: However, the concept above will ONLY apply when the `invert` prop is `true`. Otherwise, it will inherit the original Button widget.
 * 		e.g. nav button of the date picker on mobile.
 */
export const PickerHeaderButton = StyledPickerHeaderButton;

export function PickerHeaderCloseButton(props: ButtonProps): ReactElement {
	const { pickerTitles } = useContext<A11yDefinition>(A11YLanguageContext);

	return (
		<PickerHeaderButton
			icon={<Icon>close</Icon>}
			{...props}
			buttonAttributes={{ "aria-label": pickerTitles?.headerCloseButtonLabel, ...props.buttonAttributes }}
		/>
	);
}

PickerHeaderCloseButton.displayName = "PickerHeaderCloseButton";

export function PickerHeaderNavButton(props: ButtonProps & { isNext?: boolean }): ReactElement {
	const datePickerContext = useContext(DatePickerContext);
	const { pickerTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const type = props.isNext ? "next" : "prev";

	return (
		<StyledDatePicker.StyledDatePickerNavButton
			invert={!datePickerContext.mobile}
			className={`${baseClassName}-NavButton ${baseClassName}-NavButton--${type}`}
			title={props.isNext ? pickerTitles?.nextMonth : pickerTitles?.previousMonth}
			icon={<Icon size="big">{props.isNext ? "navigate_next" : "navigate_before"}</Icon>}
			dataRole={`${DataRoles.DatePicker.NavBar}-${type}`}
			{...props}
		/>
	);
}

PickerHeaderNavButton.displayName = "PickerHeaderNavButton";
