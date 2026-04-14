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

import {
	StyledCollapsiblePanelLabel,
	StyledCollapsiblePanelWrapper
} from "../../../collapsible-panel/main/collapsible-panel.view.js";
import { addPrefix } from "../../../common/main/utils.js";
import {
	StyledFieldLabel,
	StyledFieldLabelWrapper,
	StyledFieldMessageWrapper
} from "../../../input/base/template/base.tpl.view.js";
import { StyledAutocompleteWrapper } from "../../../input/autocomplete/main/autocomplete.styled.js";
import { StyledBaseBoolean } from "../../../input/base-input-styled/base-boolean.styled.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledSelectTemplate } from "../../../input/select/main/select.styled.js";
import { StyledTextOutput, StyledTextOutputContent } from "../../../text-output/main/text-output.view.js";
import { StyledMultiselectWrapper } from "../../../multiselect/main/multiselect.styled.js";
import { StyledIconPickerWrapper } from "../../../input/icon-picker/main/icon-picker.styled.js";
import { StyledTimePickerWrapper } from "../../../time-picker/main/time-picker.styled.js";
import { StyledYearMonthSelector } from "../../../input/year-month-selector/year-month-selector.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { baseFormClassName } from "./background-color.js";

const { StyledFieldWrapper, StyledField, StyledFieldHelperWrapper } = StyledBaseInput;
const { StyledFieldSelectControl, StyledSelectInput } = StyledSelectTemplate;
const { StyledFieldControl, StyledFieldGroup } = StyledBaseBoolean;

const textAlignStyle = (val: string) => css`
	${({ theme }) => {
		const { select } = theme.components;

		return css`
			> ${StyledFieldWrapper},
				> ${StyledField},
				> ${StyledAutocompleteWrapper},
				> ${StyledMultiselectWrapper},
				> ${StyledIconPickerWrapper},
				> ${StyledTimePickerWrapper},
				> ${StyledYearMonthSelector} {
				text-align: ${val};

				${StyledFieldMessageWrapper} {
					text-align: left;
				}

				${(val === "right" || val === "center") &&
				css`
					// Input's Label
					${StyledField} > ${StyledFieldLabel}, > ${StyledFieldLabel} {
						margin-inline: ${val === "center" && "auto"};
						margin-left: ${val === "right" && "auto"};
					}

					// Helper Text and label with graphic
					${StyledFieldHelperWrapper}, ${StyledFieldLabelWrapper} {
						justify-content: ${val === "right" ? "flex-end" : "center"};
					}
				`}
			}

			${val === "right" &&
			css`
				> ${StyledField} {
					// Select
					${StyledFieldSelectControl} ${StyledSelectInput} {
						border-right: none;
						padding: ${select.title.rightAlignPadding};
					}
				}
			`}

			${(val === "right" || val === "center") &&
			css`
				// Text Output
				> ${StyledFieldWrapper} {
					${StyledTextOutput} {
						width: 100%;
					}
					${StyledTextOutputContent} {
						justify-content: ${val === "right" ? "flex-end" : "center"};
					}
				}

				// Radio/Checkbox
				> ${StyledField} {
					${StyledFieldGroup}, ${StyledFieldGroup} ${StyledFieldControl}, > ${StyledFieldControl} {
						justify-content: ${val === "right" ? "flex-end" : "center"};
					}
				}

				// Select
				> ${StyledField} ${StyledFieldSelectControl} {
					text-align-last: ${val};
				}

				// 1st/2nd level Section
				&.${baseFormClassName}__multicolumnsection,
					&.${baseFormClassName}__controlgrid,
					&.${baseFormClassName}__repeat,
					&.${baseFormClassName}__section {
					> .${baseFormClassName}__sectionTitle,
						> .${baseFormClassName}__section
						> .${baseFormClassName}__sectionTitle {
						text-align: ${val};
					}
				}

				// Collapsible Panel
				&${StyledCollapsiblePanelWrapper} {
					${StyledCollapsiblePanelLabel} {
						text-align: ${val};
					}
				}

				// Editor Static Toolbar
				& > [data-role="${DataRoles.RichTextEditor.Wrapper}"] [data-role="${DataRoles.RichTextEditor.Toolbar}"] {
					justify-content: ${val === "right" ? "flex-end" : "center"};
				}
			`}
		`;
	}}
`;

export const textAlignHelper = css`
	.${addPrefix("h")} {
		&_leftAlign {
			${textAlignStyle("left")}
		}
		&_centerAlign {
			${textAlignStyle("center")}
		}
		&_rightAlign {
			${textAlignStyle("right")}
		}
	}
`;
