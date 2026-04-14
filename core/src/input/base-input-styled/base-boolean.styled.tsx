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

import { StyledTooltipWrapper } from "../../tooltip/main/tooltip.styled.js";
import { active, activeAndHover, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";

import { StyledFieldLabel, StyledFieldLabelWrapper } from "../base/template/base.tpl.view.js";

import { StyledBaseInput } from "./base.styled.js";

export namespace StyledBaseBoolean {
	export const StyledInput = styled.input.withConfig({ displayName: "StyledInput-sc-" })<{
		$checked?: boolean;
		$disabled?: boolean;
		$readonly?: boolean;
	}>(({ theme, $checked, $disabled, $readonly }) => {
		const { baseInput } = theme.components;
		const isInteractive = !$disabled && !$readonly;

		return css`
			margin: 0;
			opacity: 0;
			vertical-align: top;
			// position, width and z-index are to make the input expand
			// all the size of the label and floats over it
			position: absolute;
			width: ${baseInput.boolean.size}px;
			z-index: 1;
			+ label {
				align-items: center;
				cursor: ${isInteractive ? "pointer" : "default"};
				display: inline-flex;
				position: relative;
				text-align: ${baseInput.boolean.textAlign};
				vertical-align: top;

				> span {
					display: inline-block;
					height: ${baseInput.boolean.size}px;
					margin-top: 0;
					position: relative;
					vertical-align: ${baseInput.boolean.vertAlign};
					width: ${baseInput.boolean.size}px;

					${createPseudoElement(
						":before",
						css`
							display: block;
							${!$checked &&
							!$disabled &&
							!$readonly &&
							css`
								border: ${baseInput.boolean.border};
							`}

							${$checked &&
							css`
								border: 1px solid transparent;
							`}
						`
					)}
				}
			}

			${isInteractive &&
			css`
				${activeAndHover(css`
					+ label > span:before {
						inset: -1px;
					}
				`)}
				&:focus, &:focus-within {
					+ label > span:before {
						inset: -1px;
						${darkFocus};
					}
				}
			`}

			${$disabled || $readonly
				? css`
						cursor: default;
						+ label {
							cursor: default;
						}
					`
				: css`
						cursor: pointer;
					`}
			
			${$disabled &&
			css`
				+ label > span {
					background: ${baseInput.boolean.disabled.background};
					border-color: ${baseInput.boolean.disabled.color};
					${active(css`
						border-color: ${baseInput.boolean.disabled.activeColor};
					`)}
					${hover(css`
						border-color: ${baseInput.boolean.disabled.hoverColor};
					`)}
				}
			`}
		`;
	});

	export const StyledFieldGroup = styled.div.withConfig({ displayName: "StyledFieldGroup-sc-" })<{
		$inline?: boolean;
		$touch?: boolean;
	}>(({ theme, $inline, $touch }) => {
		const { field } = theme.components.baseInput;

		return css`
			${$inline &&
			css`
				display: flex;
				flex-wrap: wrap;
				gap: ${field.controlBoolean.inlineGap};
			`}
			${$touch &&
			css`
				background-color: ${field.booleanGroupTouch.background};
				padding: ${field.booleanGroupTouch.padding};

				> * {
					margin: 0;
					padding: ${field.booleanGroupTouch.childrenPadding};
				}
			`}
            ${!$touch &&
			css`
				${StyledBaseInput.StyledFieldHelperText} {
					margin: 0;
				}
			`}
		`;
	});

	export const StyledFieldControl = styled.div.withConfig({ displayName: "StyledFieldControl-sc-" })<{
		$inline?: boolean;
		$hasTooltips?: boolean;
		$isNonInteractive?: boolean;
	}>(({ theme, $hasTooltips, $inline, $isNonInteractive }) => {
		const { checkbox } = theme.components;

		return css`
			align-items: center;
			cursor: default;
			display: flex;
			width: 100%;
			${$inline &&
			css`
				max-width: 100%;
				width: auto;
			`}

			> ${StyledFieldLabelWrapper}, > ${StyledFieldLabel} {
				cursor: ${$isNonInteractive ? "default" : "pointer"};
				margin: 0 0 0
					${theme.spacing.horizontalSpacing.horizWhiteSpacingxs -
					theme.spacing.horizontalSpacing.horizWhiteSpacing3xs}px;
				${StyledFieldLabel} {
					display: inline-block;

					&:empty {
						display: none;
					}
				}
			}

			${$hasTooltips &&
			css`
				${StyledFieldLabel} ~ ${StyledTooltipWrapper} {
					align-items: center;
					display: inline-flex;
					justify-content: flex-end;
					height: ${checkbox.inputHeight};
				}
			`}
		`;
	});
}
