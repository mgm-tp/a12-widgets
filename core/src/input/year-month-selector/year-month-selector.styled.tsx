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

import { addPrefix } from "../../common/main/utils.js";
import { StyledTooltipWrapper } from "../../tooltip/main/tooltip.styled.js";

import {
	StyledFieldLabel,
	StyledFieldLabelWrapper,
	StyledFieldMessageWrapper
} from "../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../base-input-styled/base.styled.js";
import { NativeSelect } from "../select/main/native-select.view.js";

export const StyledMonthSelector = styled(NativeSelect).withConfig({ displayName: "StyledMonthSelector-sc-" })``;

export const StyledYearSelector = styled(NativeSelect).withConfig({ displayName: "StyledYearSelector-sc-" })``;

export const StyledYearMonthSelector = styled.div.withConfig({ displayName: "StyledYearMonthSelector-sc-" })<{
	$numberOfTooltips?: number;
}>(({ theme, $numberOfTooltips }) => {
	const { yearMonthSelector, baseInput } = theme.components;

	return css`
		&:not(.${addPrefix("DayPicker-Caption")}) {
			${StyledMonthSelector} {
				flex: 2 1 65%;
				min-width: ${yearMonthSelector.month.minWidth};
			}

			${StyledYearSelector} {
				flex: 1 1 35%;
				margin: ${yearMonthSelector.year.margin};
				min-width: ${yearMonthSelector.year.minWidth};
			}

			> ${StyledTooltipWrapper} {
				margin: ${baseInput.input.tooltipInNewLineMargin};
				&:first-of-type {
					width: auto;
				}
			}
		}
		${StyledFieldLabel} {
			display: block;
			margin: ${yearMonthSelector.labelMargin};
		}

		${StyledFieldLabelWrapper} {
			margin: ${yearMonthSelector.labelMargin};

			${StyledFieldLabel} {
				display: block;
			}
		}

		${StyledFieldMessageWrapper} {
			margin: ${yearMonthSelector.messageMargin};
		}

		${$numberOfTooltips && StyledBaseInput.elementWithTooltipStyles($numberOfTooltips)}
	`;
});

export const StyledYearMonthSelectorInner = styled.div.withConfig({ displayName: "StyledYearMonthSelectorInner-sc-" })`
	align-items: center;
	display: flex;
`;
