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

import { StyledFieldLabel, StyledFieldLabelWrapper } from "../../base/template/base.tpl.view.js";
import { StyledBaseBoolean } from "../../base-input-styled/base-boolean.styled.js";
import { active, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";

export namespace StyledRadio {
	const radioStates = (border: string, background: string, checkedBG: string, checked?: boolean) => css`
		& + label > span {
			&:before {
				border: ${border};
			}
			${checked &&
			css`
				background-color: ${background};
				&:after {
					background-color: ${checkedBG};
				}
			`}
		}
	`;

	export const StyledField = styled(StyledBaseInput.StyledField).withConfig({ displayName: "StyledField-sc-" })<{
		$touch?: boolean;
	}>(({ theme, $touch }) => {
		const { field } = theme.components.baseInput;

		return css`
			${StyledBaseBoolean.StyledFieldControl} {
				margin: ${$touch ? 0 : field.controlBoolean.margin};
			}
		`;
	});

	export const StyledBox = styled.span.withConfig({ displayName: "StyledBox-sc-" })(({ theme }) => {
		const { radio } = theme.components;

		return css`
			align-self: flex-start;
			display: flex;
			flex-shrink: 0;
			isolation: isolate;
			padding: 0 ${theme.spacing.horizontalSpacing.horizWhiteSpacing3xs}px;
			position: relative;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

			~ ${StyledFieldLabelWrapper} ${StyledFieldLabel}, ~ ${StyledFieldLabel} {
				color: ${radio.label.color};
				font-family: ${radio.label.fontFamily};
				font-size: ${radio.label.fontSize};
				font-weight: ${radio.label.fontWeight};
			}
		`;
	});

	export const StyledInput = styled(StyledBaseBoolean.StyledInput).withConfig({ displayName: "StyledInput-sc-" })<{
		$checked?: boolean;
		$warning?: boolean;
		$error?: boolean;
		$info?: boolean;
	}>(({ theme, $checked, $warning, $error, $info, $disabled, $readonly }) => {
		const { radio } = theme.components;
		const backgroundColor = $disabled
			? radio.disabled.background
			: $readonly
				? radio.readOnly.background
				: $checked
					? radio.checked.background
					: radio.background;

		return css`
			height: ${radio.inputHeight};
			& + label {
				height: ${radio.inputHeight};
			}
			& + label > span {
				border-radius: 50%;
				background-color: ${backgroundColor};
				&:before {
					border-radius: inherit;
					box-sizing: border-box;
				}
			}

			${$checked &&
			css`
				& + label > span {
					border-color: ${radio.checked.background};
					position: relative;
					&:after {
						background: ${radio.checked.background};
						border: ${radio.checked.border};
						border-radius: inherit;
						box-sizing: border-box;
						content: "";
						display: block;
						height: ${radio.checked.size};
						margin: 2px 0 0 2px;
						width: ${radio.checked.size};
					}
				}
			`}

			${!$disabled &&
			!$readonly &&
			css`
				${$info && radioStates(radio.info.border, radio.info.checkedBG, radio.info.checkedBG, $checked)}
				${$warning && radioStates(radio.warning.border, radio.warning.checkedBG, radio.warning.checkedBG, $checked)}
				${$error && radioStates(radio.error.border, radio.error.checkedBG, radio.error.checkedBG, $checked)}
			  	${active(radioStates(radio.active.border, radio.active.background, radio.active.checkedBG, $checked))}
			  	${hover(radioStates(radio.hover.border, radio.hover.background, radio.hover.checkedBG, $checked))}
			  	&:focus {
					${radioStates(radio.focus.border, radio.focus.checkedBG, radio.focus.checkedBG, $checked)}
					& + label > span:before {
						${darkFocus}
					}
				}
			`}
			
			${$readonly &&
			css`
				${radioStates(radio.readOnly.border, radio.readOnly.checkedBG, radio.readOnly.checkedBG, $checked)}
				${$checked &&
				css`
					& + label > span:after {
						border-color: ${radio.readOnly.background};
					}
				`}
			`}
			
			${$disabled &&
			css`
				${radioStates(radio.disabled.border, radio.disabled.checkedBG, radio.disabled.checkedBG, $checked)}
				${$checked &&
				css`
					& + label > span:after {
						border-color: ${radio.disabled.background};
					}
				`}
			`}
		`;
	});
}
