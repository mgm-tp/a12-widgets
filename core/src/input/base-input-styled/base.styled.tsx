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

import { breakWord } from "../../theme/base/mixins/_break-word.js";
import { active, hover, inputDarkFocus } from "../../theme/base/mixins/_interaction.js";
import { StyledTooltipWrapper } from "../../tooltip/main/tooltip.styled.js";
import { StyledContentBoxFooter } from "../../contentbox/main/template/contentbox.tpl.styled.js";
import { SubHeadingElements } from "../../contentbox/main/template/elements/sub-heading.tpl.view.js";
import { StyledButton } from "../../button/main/button.styled.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";
import { shouldForwardProp } from "../../common/main/should-forward-prop.js";
import { DataRoles } from "../../common/main/data-roles.js";

import {
	StyledFieldLabel,
	StyledFieldLabelWrapper,
	StyledFieldMessageWrapper
} from "../base/template/base.tpl.view.js";

export namespace StyledBaseInput {
	/* Reset background color and color of the disabled label and input when helper class is applied */
	export const helperClassInDisabledStyles = css(({ theme }) => {
		const { baseInput } = theme.components;
		const { label } = theme.applicationStyles;

		return css`
			&[class*="h_"] {
				${StyledFieldInput} {
					background-color: ${baseInput.input.disabled.background} !important;
					color: ${baseInput.input.disabled.color} !important;
				}
				${StyledFieldLabel} {
					color: ${label.disabledColor} !important;
				}
			}
		`;
	});

	export const StyledFieldAffixText = styled.div.withConfig({ displayName: "StyledFieldAffixText-sc-" })<{
		$truncated?: boolean;
	}>(({ theme, $truncated }) => {
		const { textSuffix } = theme.components.textLine;
		const { input } = theme.applicationStyles;

		return css`
			align-items: center;
			background-color: ${textSuffix.background};
			border-bottom-right-radius: ${input.borderRadius};
			border-top-right-radius: ${input.borderRadius};
			color: inherit;
			display: flex;
			flex-shrink: 0;
			flex-grow: 1;
			font-size: ${textSuffix.fontSize};
			height: 100%;
			justify-content: center;
			min-width: ${textSuffix.minWidth};
			padding: ${textSuffix.padding};
			${$truncated &&
			css`
				width: ${textSuffix.minWidth};

				> * {
					flex-shrink: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			`}
		`;
	});

	export const StyledFieldAddon = styled.div.withConfig({ displayName: "StyledFieldAddon-sc-" })<{
		$position: "before" | "after";
	}>(({ theme, $position }) => {
		const { baseInput } = theme.components;

		return css`
			align-items: center;
			align-self: flex-end;
			display: flex;
			flex-shrink: 0;
			height: ${theme.applicationStyles.input.height};
			margin: ${$position === "after" ? baseInput.input.addon.afterMargin : baseInput.input.addon.beforeMargin};
			justify-content: center;
		`;
	});

	export const StyledFieldHelperText = styled.label.withConfig({ displayName: "StyledFieldHelperText-sc-" })(
		({ theme }) => {
			const { helperText } = theme.components.baseInput.input;

			return css`
				color: ${helperText.color};
				display: block;
				font-family: ${helperText.fontFamily};
				font-size: ${helperText.fontSize};
				line-height: ${helperText.lineHeight};
				margin: ${helperText.margin};
				width: fit-content;
			`;
		}
	);

	export const StyledFieldHelperWrapper = styled.div.withConfig({ displayName: "StyledFieldHelperWrapper-sc-" })<{
		$customWidth?: string | number;
	}>`
		display: flex;
		width: ${({ $customWidth }) => (typeof $customWidth === "number" ? $customWidth + "px" : $customWidth)};

		${StyledFieldAddon} {
			height: auto;
			visibility: hidden;
		}
	`;

	export const StyledFieldPrefixWrapper = styled.div.withConfig({ displayName: "StyledFieldPrefixWrapper-sc-" })<{
		$last?: boolean;
	}>(({ theme, $last }) => {
		const { baseInput } = theme.components;
		const { input } = theme.applicationStyles;

		return css`
			align-items: center;
			background-color: transparent;
			display: flex;
			flex-shrink: 0;
			justify-content: center;
			min-width: ${baseInput.input.prefixMinWidth};

			&:first-child {
				border-bottom-left-radius: ${input.borderRadius};
				border-top-left-radius: ${input.borderRadius};
			}

			${$last &&
			css`
				margin-right: -${baseInput.input.horizontalSpacing};
				position: relative;
			`}
			${StyledFieldAffixText} {
				margin: 0 ${baseInput.input.horizontalSpacing} 0 0;
			}
		`;
	});

	export const StyledFieldSuffixWrapper = styled.div.withConfig({ displayName: "StyledFieldSuffixWrapper-sc-" })<{
		$first?: boolean;
	}>(({ theme, $first }) => {
		const { baseInput } = theme.components;
		const { input } = theme.applicationStyles;

		return css`
			align-items: center;
			background-color: transparent;
			display: flex;
			flex-shrink: 0;
			justify-content: center;
			min-width: ${baseInput.input.prefixMinWidth};

			&:last-child {
				border-bottom-right-radius: ${input.borderRadius};
				border-top-right-radius: ${input.borderRadius};
			}

			${$first &&
			css`
				margin-left: -${baseInput.input.horizontalSpacing};
			`}
			${StyledFieldAffixText} {
				margin: 0 0 0 ${baseInput.input.horizontalSpacing};
			}
		`;
	});

	/**
	 * @deprecated since 37.0.0
	 */
	export const StyledFieldMobile = styled.div.withConfig({ displayName: "StyledFieldMobile-sc-" })``;

	export const StyledFieldTextInput = styled.input.withConfig({
		displayName: "StyledFieldTextInput-sc-",
		shouldForwardProp: (prop, target) => {
			return shouldForwardProp(prop, target) || ["virtualkeyboardpolicy"].includes(prop);
		}
	})<{
		$alignRight?: boolean;
		virtualkeyboardpolicy?: "manual" | "auto";
	}>(({ theme, $alignRight }) => {
		const { input } = theme.components.baseInput;
		const { lineHeight } = theme.baseInputStyles;

		return css`
			background-color: transparent;
			border: ${input.border};
			box-sizing: border-box;
			color: inherit;
			flex-grow: 1;
			font-style: inherit;
			font-weight: inherit;
			font-family: inherit;
			font-size: 100%;
			line-height: ${lineHeight};
			outline: none;
			padding: ${input.padding};
			text-align: ${$alignRight ? "right" : "inherit"};
			text-overflow: ellipsis;
			text-transform: inherit;
			min-width: 0;
			width: 100%;

			&::placeholder {
				font-style: italic;
				color: ${input.placeholderColor};
				opacity: 1;
			}
		`;
	});

	export const StyledFieldInput = styled.div.withConfig({ displayName: "StyledFieldInput-sc-" })<{
		$mobile?: boolean;
		$readonly?: boolean;
		$disabled?: boolean;
		$warning?: boolean;
		$error?: boolean;
		$info?: boolean;
		$noEffect?: boolean;
		$hasFocus?: boolean;
	}>(({ theme, $disabled, $readonly, $warning, $error, $info, $noEffect, $hasFocus }) => {
		const { input } = theme.applicationStyles;
		const { baseInput, contentBox } = theme.components;
		const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;

		return css`
			background-color: ${input.background};
			border: none;
			border-radius: ${input.borderRadius};
			box-shadow: ${input.boxShadow};
			color: ${input.fontColor};
			display: flex;
			font-family: ${input.fontFamily};
			font-size: ${input.fontSize};
			font-weight: ${input.fontWeight};
			outline: 1px solid transparent;
			height: ${theme.applicationStyles.input.height};

			${StyledButton} {
				border-radius: ${input.borderRadius};
			}

			${!$disabled &&
			css`
				${!$readonly &&
				css`
					&& {
						${StyledContentBoxFooter} &,
                  ${SubHeadingElements.StyledSubHeading} & {
							background-color: ${contentBox.subHeading.inputBackground};
						}
					}
					${!$noEffect &&
					css`
						${!$hasFocus &&
						css`
							${active(css`
								box-shadow: ${input.activeBoxShadow};
							`)}
							${hover(css`
								box-shadow: ${input.hoverBoxShadow};
							`)}
						`}
						${$hasFocus &&
						css`
							${createBoxShadow(baseInput.input.customDashedFocus ?? baseInput.input.focusBoxShadow)}
						`}
					`}
				`}
				${$hasFocus &&
				css`
					outline-offset: ${baseInput.input.outlineOffset};
					${inputDarkFocus}
				`}
			`}

			${variant &&
			css`
				box-shadow: ${baseInput.input[variant].boxShadow};
				${!$readonly &&
				!$noEffect &&
				!$disabled &&
				css`
					&& {
						${active(css`
							box-shadow: ${baseInput.input[variant].activeBoxShadow};
						`)};
						${hover(css`
							box-shadow: ${baseInput.input[variant].hoverBoxShadow};
						`)};
						${$hasFocus &&
						css`
							&:before {
								display: none;
							}
							${createBoxShadow(baseInput.input[variant].customDashedFocus ?? baseInput.input[variant].focusBoxShadow)}
						`};
					}
				`}
			`}
			
			${$readonly &&
			css`
				background-color: ${baseInput.input.readonly.background};
				box-shadow: ${baseInput.input.readonly.boxShadow};
			`}
			
			${$disabled &&
			css`
				background-color: ${baseInput.input.disabled.background};
				box-shadow: ${baseInput.input.disabled.boxShadow};
				color: ${baseInput.input.disabled.color};
			`}
		`;
	});

	export const StyledFieldWrapper = styled.div.withConfig({ displayName: "StyledFieldWrapper-sc-" })<{
		$block?: boolean;
		$phone?: boolean;
		$disabled?: boolean;
	}>(({ theme, $block, $phone, $disabled }) => {
		const { textLine } = theme.components;

		return css`
			display: inline-flex;

			${breakWord()}
			flex-direction: column;

			${$phone &&
			css`
				${StyledFieldMain} ${StyledFieldTextInput} {
					// Increase font-size on phone to avoid zooming on focus
					font-size: ${textLine.mobile?.fontSize};
					height: ${textLine.mobile?.height};
				}
			`}

			${$block &&
			css`
				display: flex;
				width: 100%;

				${StyledFieldMain} {
					display: flex;
					width: 100%;
				}
			`}
			* {
				max-width: 100%;
			}

			${$disabled && helperClassInDisabledStyles}
		`;
	});

	export const elementWithTooltipStyles = (numberOfTooltips: number) => css`
		${StyledFieldHelperWrapper}, ${StyledFieldLabel}, ${StyledFieldLabelWrapper}, ${StyledFieldMessageWrapper} {
			margin-right: ${({ theme }) => `calc(${theme.components.baseInput.field.tooltipWidth} * ${numberOfTooltips})`};
		}
	`;

	export const StyledField = styled.div.withConfig({ displayName: "StyledField-sc-" })<{
		$block?: boolean;
		$hasTooltips?: boolean;
		$disabled?: boolean;
		$numberOfTooltips?: number;
	}>(({ theme, $block, $hasTooltips, $numberOfTooltips, $disabled }) => {
		const { input, field } = theme.components.baseInput;
		const { tooltip } = theme.components;

		return css`
			box-sizing: border-box;
			${!$block &&
			css`
				display: inline-block;
			`}
			${$block &&
			css`
				flex-grow: 1;
				width: 100%;
			`}
			> ${StyledTooltipWrapper} {
				margin: ${!$hasTooltips && input.tooltipInNewLineMargin};
			}

			${!$hasTooltips &&
			css`
				${StyledFieldLabel} {
					display: block;
					width: fit-content;
				}
			`}

			${$hasTooltips &&
			css`
				${StyledTooltipWrapper} {
					align-self: center;
					flex-shrink: 0;
					text-align: right;
					width: ${field.tooltipWidth};
				}

				&[data-role="${DataRoles.CheckboxGroup}"],
				&[data-role="${DataRoles.Radio.Group}"],
				&[data-role="${DataRoles.FileUpload}"] {
					${StyledFieldLabel} {
						max-width: 100%;
						vertical-align: middle;

						~ ${StyledTooltipWrapper} {
							margin: ${tooltip.nextToLabelMargin};
						}
					}
				}
			`}

			${$hasTooltips && $numberOfTooltips && elementWithTooltipStyles($numberOfTooltips)}

			${$disabled && helperClassInDisabledStyles}
		`;
	});

	export const StyledFieldMain = styled.div.withConfig({ displayName: "StyledFieldMain-sc-" })`
		display: inline-flex;

		${StyledField} {
			flex-basis: 160px;
			flex-grow: 1;
			flex-shrink: 1;
			max-width: 100%;
		}
	`;
}
