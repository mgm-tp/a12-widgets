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

import { css } from "styled-components";

import { StyledButton } from "../../../button/main/button.styled.js";
import {
	StyledCollapsiblePanelTitle,
	StyledCollapsiblePanelWrapper
} from "../../../collapsible-panel/main/collapsible-panel.view.js";
import { addPrefix } from "../../../common/main/utils.js";
import { StyledFieldLabel, StyledFieldMessageWrapper } from "../../../input/base/template/base.tpl.view.js";
import { StyledAutocompleteWrapper } from "../../../input/autocomplete/main/autocomplete.styled.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledSelectTemplate } from "../../../input/select/main/select.styled.js";
import { StyledLink } from "../../../link/main/link/link.view.js";
import { StyledTextOutputContent } from "../../../text-output/main/text-output.view.js";
import { StyledMultiselectWrapper } from "../../../multiselect/main/multiselect.styled.js";
import { StyledIconPickerWrapper } from "../../../input/icon-picker/main/icon-picker.styled.js";
import { StyledTimePickerWrapper } from "../../../time-picker/main/time-picker.styled.js";
import { StyledYearMonthSelector } from "../../../input/year-month-selector/year-month-selector.styled.js";

import { baseFormClassName } from "./background-color.js";

const { StyledFieldWrapper, StyledField, StyledFieldInput } = StyledBaseInput;
const { StyledFieldSelectControl } = StyledSelectTemplate;

const fontWeightStyle = (val: number) => css`
	&${StyledButton} {
		font-weight: ${val};
	}

	// Text Field, Text Area, Text Output, Time Picker, Autocomplete, Select, Multiselect, Icon Picker, Year and Month Selector, Radio, Checkbox, Checkbox Group
	> ${StyledFieldWrapper},
		> ${StyledField},
		> ${StyledAutocompleteWrapper},
		> ${StyledMultiselectWrapper},
		> ${StyledIconPickerWrapper},
		> ${StyledTimePickerWrapper},
		> ${StyledYearMonthSelector} {
		${StyledFieldLabel}, ${StyledFieldMessageWrapper}, ${StyledFieldInput}, ${StyledFieldSelectControl}, ${StyledTextOutputContent} {
			font-weight: ${val};
		}
	}

	// 1st/2nd level Section
	&.${baseFormClassName}__multicolumnsection,
		&.${baseFormClassName}__controlgrid,
		&.${baseFormClassName}__repeat,
		&.${baseFormClassName}__section {
		> .${baseFormClassName}__sectionTitle, > .${baseFormClassName}__section > .${baseFormClassName}__sectionTitle {
			font-weight: ${val};
		}
	}

	&${StyledCollapsiblePanelWrapper} > ${StyledCollapsiblePanelTitle} {
		font-weight: ${val};
	}

	&${StyledLink} {
		font-weight: ${val};
	}
`;

export const fontWeightHelper = css`
	${({ theme }) => {
		const { fontWeight } = theme.typography;

		return css`
			.${addPrefix("h")} {
				&_lightFontWeight {
					${fontWeightStyle(fontWeight.lightFontWeight)}
				}
				&_regularFontWeight {
					${fontWeightStyle(fontWeight.regularFontWeight)}
				}
				&_semiBoldFontWeight {
					${fontWeightStyle(fontWeight.semiBoldFontWeight)}
				}
				&_boldFontWeight {
					${fontWeightStyle(fontWeight.boldFontWeight)}
				}
			}
		`;
	}}
`;
