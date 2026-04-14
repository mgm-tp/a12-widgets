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

import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import { provider } from "../../common/main/device-detector.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { PickerHeaderCloseButton, DatePickerFooterAction } from "../../datepicker/main/date-picker.tpl.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledDatePickerMobile } from "./date-picker.mobile.styled.js";
import type { DatePickerDialogProps } from "./date-picker.mobile.api.js";
import { DatePicker } from "./date-picker.view.js";

const baseClassName = addPrefix("DayPicker");
const {
	StyledDatePickerDialogContainer,
	StyledDatePickerDialogHeader,
	StyledDatePickerDialogTitle,
	StyledDatePickerDialogFooter
} = StyledDatePickerMobile;

export function DatePickerDialog(props: DatePickerDialogProps): ReactElement<DatePickerDialogProps> {
	const { id, className, onClose, closeButton, submitButton, clearButton, title, htmlAttributes, ...rest } = props;

	const headerTitleId = id ? `${id}-header-title` : undefined;

	return (
		<ModalOverlay
			containerAttributes={htmlAttributes}
			closeOnOutsideClick={provider.isDesktop()}
			noGutter
			key="modalOverlay"
			onClose={onClose}
		>
			<StyledDatePickerDialogContainer
				id={id}
				className={joinClassNames(`${baseClassName}__container`, className)}
				data-role={DataRoles.DatePicker.Dialog}
				ref={props.wrapperRef}
				tabIndex={-1}
			>
				<StyledDatePickerDialogHeader
					className={`${baseClassName}__header`}
					data-role={DataRoles.DatePicker.Dialog.Header}
				>
					<StyledDatePickerDialogTitle
						id={headerTitleId}
						className={`${baseClassName}__title`}
						data-role={DataRoles.DatePicker.Dialog.Title}
					>
						{title}
					</StyledDatePickerDialogTitle>
					{closeButton || <PickerHeaderCloseButton onClick={onClose} />}
				</StyledDatePickerDialogHeader>
				<DatePicker {...rest} className={`${baseClassName}--mobile`} footer={{ customFooter: <></> }} mobile />
				<StyledDatePickerDialogFooter
					className={`${baseClassName}-Actions`}
					data-role={DataRoles.DatePicker.Dialog.Actions}
				>
					<DatePickerFooterAction />
					<DatePickerFooterAction>{submitButton}</DatePickerFooterAction>
					<DatePickerFooterAction>{clearButton}</DatePickerFooterAction>
				</StyledDatePickerDialogFooter>
			</StyledDatePickerDialogContainer>
		</ModalOverlay>
	);
}

DatePickerDialog.displayName = "DatePickerDialog";
