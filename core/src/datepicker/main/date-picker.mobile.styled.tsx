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

import { StyledIconWrapper } from "../../icon/main/icon.view.js";

import { DatePickerFooter } from "./date-picker.tpl.view.js";
import { StyledPickerHeaderButton } from "./date-picker.styled.js";

export namespace StyledDatePickerMobile {
	export const StyledDatePickerDialogContainer = styled.div.withConfig({
		displayName: "StyledDatePickerDialogContainer-sc-"
	})`
		border-radius: ${({ theme }): string => theme.components.datePicker.mobile.container.borderRadius};
		display: flex;
		flex-direction: column;
		margin: 0 auto;
	`;

	export const StyledDatePickerDialogHeader = styled.div.withConfig({
		displayName: "StyledDatePickerDialogHeader-sc-"
	})(({ theme }) => {
		const { header } = theme.components.datePicker.mobile;

		return css`
			align-items: center;
			background-color: ${header.background};
			display: flex;
			height: ${header.height};
			justify-content: space-between;
			padding: ${header.padding};

			${StyledPickerHeaderButton} {
				${StyledIconWrapper} {
					color: ${header.icon.color};
					font-size: ${header.icon.fontSize};
					margin: 0;
					padding: 0;
				}

				&:focus {
					${StyledIconWrapper} {
						color: inherit;
					}
				}
			}
		`;
	});

	export const StyledDatePickerDialogTitle = styled.div.withConfig({ displayName: "StyledDatePickerDialogTitle-sc-" })(
		({ theme }) => {
			const { header } = theme.components.datePicker.mobile;

			return css`
				color: ${header.title.color};
				flex: 1 1 0;
				font-size: ${header.title.fontSize};
				font-weight: ${header.title.fontWeight};
			`;
		}
	);

	export const StyledDatePickerDialogFooter = styled(DatePickerFooter).withConfig({
		displayName: "StyledDatePickerDialogFooter-sc-"
	})(({ theme }) => {
		const { footer } = theme.components.datePicker.mobile;

		return css`
			border-top: ${footer.borderTop};
			display: flex;
			justify-content: center;

			&:focus {
				outline: none;
			}
		`;
	});
}
