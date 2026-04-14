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

import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { StyledFieldLabel, StyledFieldLabelWrapper } from "../../base/template/base.tpl.view.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";
import { checkboxStates } from "../../../theme/base/mixins/components/_input.js";
import { StyledBaseBoolean } from "../../base-input-styled/base-boolean.styled.js";
import { StyledListItemWrapper } from "../../../list/main/list.styled.js";

export namespace StyledCheckbox {
	export const StyledControl = styled(StyledBaseBoolean.StyledFieldControl).withConfig({
		displayName: "StyledControl-sc-"
	})``;

	export const StyledBox = styled.span.withConfig({ displayName: "StyledBox-sc-" })<{ isInteractive?: boolean }>(
		({ theme, isInteractive }) => {
			const { checkbox } = theme.components;

			return css`
				align-self: flex-start;
				display: flex;
				flex-shrink: 0;
				isolation: isolate;
				padding: 0 ${theme.spacing.horizontalSpacing.horizWhiteSpacing3xs}px;
				position: relative;
				-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

				> label {
					height: ${checkbox.inputHeight};
					> span,
					> span:before {
						border-radius: ${checkbox.borderRadius};
					}
				}

				~ ${StyledFieldLabelWrapper} ${StyledFieldLabel}, ~ ${StyledFieldLabel} {
					color: ${checkbox.label.color};
					cursor: ${isInteractive ? "pointer" : "default"};
					font-family: ${checkbox.label.fontFamily};
					font-size: ${checkbox.label.fontSize};
					font-weight: ${checkbox.label.fontWeight};
					max-width: ${checkbox.label.maxWidth};
					vertical-align: ${checkbox.label.verticalAlign};
				}
			`;
		}
	);

	export const StyledField = styled(StyledBaseInput.StyledField).withConfig({ displayName: "StyledField-sc-" })(
		({ theme }) => {
			const { single } = theme.components.checkbox;

			return css`
				min-height: ${single.minHeight};
				padding: ${single.padding};

				${StyledListItemWrapper} & {
					min-height: auto;
				}

				> ${StyledControl} {
					padding: ${single.fieldControlPadding};
				}

				> ${StyledBaseInput.StyledFieldHelperWrapper} > ${StyledBaseInput.StyledFieldHelperText} {
					margin: 0;
				}

				${StyledListItemWrapper} > & {
					min-height: auto;
				}
			`;
		}
	);

	export const StyledCheckboxInput = styled(StyledBaseBoolean.StyledInput).withConfig({
		displayName: "StyledCheckboxInput-sc-"
	})<{
		$checked?: boolean;
		$mixed?: boolean;
		$disabled?: boolean;
		$readonly?: boolean;
		$warning?: boolean;
		$error?: boolean;
		$info?: boolean;
		$hovered?: boolean;
	}>(({ theme, $checked, $disabled, $readonly, $warning, $error, $info }) => {
		const { checkbox, baseInput } = theme.components;

		return css`
			cursor: ${$disabled || $readonly ? "default" : "pointer"};
			height: ${checkbox.inputHeight};
			margin: 0;
			opacity: 0;
			vertical-align: top;

			${checkboxStates(
				$checked ? checkbox.checked.background : checkbox.background,
				$checked ? "none" : baseInput.boolean.border
			)}

			${$checked &&
			css`
				& + label > span:after {
					box-sizing: border-box;
					border: ${checkbox.checked.border};
					border-top: none;
					border-right: none;
					content: "";
					display: block;
					margin: ${checkbox.checked.margin};
					height: ${baseInput.boolean.size / 2}px;
					transform: rotate(-55deg);
					width: ${Math.ceil((baseInput.boolean.size * Math.sqrt(2)) / 2)}px;
				}

				& + label > span:before {
					border: 1px solid transparent;
				}
			`}
			
			${!$disabled &&
			!$readonly &&
			css`
				${$info && checkboxStates($checked ? checkbox.info.checkedBG : undefined, checkbox.info.border)}
				${$warning && checkboxStates($checked ? checkbox.warning.checkedBG : undefined, checkbox.warning.border)}
				${$error && checkboxStates($checked ? checkbox.error.checkedBG : undefined, checkbox.error.border)}
            	&:focus,
            	&:focus-within {
					${checkboxStates($checked ? checkbox.focus.checkedBG : undefined, checkbox.focus.border)}
				}

				${active(checkboxStates($checked ? checkbox.active.checkedBG : undefined, checkbox.active.border))};

				${hover(checkboxStates($checked ? checkbox.hover.checkedBG : undefined, checkbox.hover.border))};
				& + label {
					${hover(css`
						& > span {
							&:after {
								background-color: ${checkbox.hover.checkedBG};
							}
							&:before {
								border: ${checkbox.hover.border};
							}

							${$checked &&
							css`
								background-color: ${checkbox.hover.checkedBG};
							`}
						}
					`)}
				}
			`}
			
			${$readonly &&
			checkboxStates(
				$checked ? checkbox.readOnly.checkedBG : checkbox.readOnly.background,
				checkbox.readOnly.border,
				$checked ? checkbox.readOnly.checkedBorderColor : undefined
			)}
			
			${$disabled &&
			checkboxStates(
				$checked ? checkbox.disabled.checkedBG : checkbox.disabled.background,
				checkbox.disabled.border,
				$checked ? checkbox.disabled.checkedBorderColor : undefined
			)}
		`;
	});

	export const StyledIndeterminateInput = styled(StyledCheckboxInput).withConfig({
		displayName: "StyledIndeterminateInput-sc-"
	})(({ theme, $checked, $mixed, $disabled, $readonly, $hovered }) => {
		const { baseInput, checkbox } = theme.components;
		const interactive = !$disabled && !$readonly;

		return css`
			> button {
				border: none;
				cursor: ${interactive && "pointer"};
				height: 100%;
				padding: 0;
				width: 100%;
			}

			${$mixed &&
			css`
				& + label > span {
					&:after {
						background-color: ${checkbox.indeterminateBackground};
						content: " ";
						height: ${baseInput.boolean.size / 2 - 1}px;
						left: 50%;
						position: absolute;
						top: 50%;
						transform: translate(-50%, -50%);
						width: ${baseInput.boolean.size / 2 - 1}px;
						border: 3px solid transparent;
					}
				}
			`}

			${interactive &&
			$hovered &&
			css`
				${checkboxStates($checked ? checkbox.hover.checkedBG : undefined, checkbox.hover.border)}
				&:focus,
				&:focus-within {
					${checkboxStates($checked ? checkbox.hover.checkedBG : undefined, checkbox.hover.border)}
				}
				&& + label > span {
					&:after {
						background-color: ${checkbox.hover.checkedBG};
					}

					&:before {
						inset: -1px;
					}
				}
				//make focus styles same as hover styles when hovering in label/checkbox
				&:focus,
				&:focus-within {
					${checkboxStates($checked ? checkbox.hover.checkedBG : undefined, checkbox.hover.border)}
					&& + label > span:after {
						background-color: ${checkbox.hover.checkedBG};
					}
				}
			`}

			${interactive &&
			$mixed &&
			css`
				&:focus,
				&:focus-within {
					& + label > span {
						&:after {
							background-color: ${$hovered ? checkbox.hover.checkedBG : checkbox.focus.checkedBG};
						}
					}
				}

				${active(css`
					& + label > span {
						&:after {
							background-color: ${checkbox.active.checkedBG};
						}
					}
				`)}
				${hover(css`
					& + label > span {
						&:after {
							background-color: ${checkbox.hover.checkedBG};
						}
					}
				`)}
			`}
			
			${$readonly &&
			$mixed &&
			css`
				& + label > span {
					&:after {
						background-color: ${checkbox.readOnly.checkedBG};
					}
				}
			`}
			
			${$disabled &&
			$mixed &&
			css`
				& + label > span {
					&:after {
						background-color: ${checkbox.disabled.checkedBG};
					}
				}
			`}
		`;
	});
}
