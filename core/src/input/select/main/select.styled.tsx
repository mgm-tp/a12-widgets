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

import {
	StyledContentBoxContent,
	StyledContentBoxFooter
} from "../../../contentbox/main/template/contentbox.tpl.styled.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { ModalOverlay, StyledModalOverlayContainer } from "../../../modal-overlay/main/modal-overlay.view.js";
import { active, inputDarkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { TextField } from "../../text-field/main/template/text-field.tpl.view.js";
import { SubHeadingElements } from "../../../contentbox/main/template/elements/sub-heading.tpl.view.js";
import { createBoxShadow } from "../../../theme/base/mixins/_borderEffects.js";

const { StyledFieldPrefixWrapper, StyledFieldTextInput, StyledFieldInput } = StyledBaseInput;
export namespace StyledSelectTemplate {
	export const StyledSelectInput = styled.select.withConfig({ displayName: "StyledSelectInput-sc-" })<{
		$readonly?: boolean;
		$disabled?: boolean;
		$isEmptyValue?: boolean;
		$isHidden?: boolean;
	}>(({ theme, $readonly, $disabled, $isEmptyValue, $isHidden }) => {
		const { select, baseInput, contentBox } = theme.components;

		return css`
			appearance: none;
			background-color: inherit;
			-moz-appearance: none;
			border: none;
			border-radius: ${select.title.borderRadius};
			caret-color: transparent;
			color: inherit;
			font-size: inherit;
			flex-grow: 1;
			font-style: inherit;
			font-weight: inherit;
			font-family: inherit;
			height: 100%;
			&&& {
				outline: 1px solid transparent;
			}
			padding: ${baseInput.input.padding};
			padding-right: ${theme.applicationStyles.input.height};
			text-align: inherit;
			text-transform: inherit;
			width: 100%;

			${$isHidden &&
			css`
				position: absolute;
				width: 0;
				height: 0;
				padding: 0;
			`}

			${$isEmptyValue &&
			css`
				color: ${select.empty.color};
				font-style: ${select.empty.fontStyle};
			`}

				&::selection {
				background-color: transparent;
			}

			&::placeholder {
				font-style: italic;
				color: ${baseInput.input.placeholderColor};
				opacity: 1;
			}

			${$readonly &&
			css`
				margin: 0;
				min-width: 5px;
			`}

			${$disabled &&
			css`
				background-color: inherit;
				${StyledBaseInput.StyledField}[class*="h_"] && {
					background-color: inherit !important;
				}
			`}

			${$readonly || $disabled
				? css`
						cursor: default;
						opacity: 1;
					`
				: css`
						cursor: pointer;
						${StyledContentBoxFooter} &,
					${SubHeadingElements.StyledSubHeading} & {
							background-color: ${contentBox.subHeading.inputBackground};
						}
					`}
		`;
	});

	export const StyledFieldSelectControl = styled.div.withConfig({ displayName: "StyledFieldSelectControl-sc-" })<{
		$readonly?: boolean;
		$disabled?: boolean;
	}>(({ theme, $readonly, $disabled }) => {
		const { select, contentBox } = theme.components;

		return css`
			background-color: transparent;
			box-shadow: none;
			border: none;
			border-radius: ${select.borderRadius};
			color: ${select.color};
			display: flex;
			font-family: ${select.fontFamily};
			font-size: ${select.fontSize};
			font-weight: ${select.fontWeight};
			height: ${theme.applicationStyles.input.height};

			&:focus {
				outline: none;
			}

			${$readonly
				? css`
						border-right: none;
						cursor: default;
						min-width: 5px;
					`
				: !$disabled &&
					css`
						${SubHeadingElements.StyledSubHeading} &&& ${StyledSelectInput}, ${StyledContentBoxFooter} &&& ${StyledSelectInput} {
							background-color: ${contentBox.subHeading.inputBackground};
						}
					`}
		`;
	});

	export const StyledFieldSelectWrapper = styled.div.withConfig({ displayName: "StyledFieldSelectWrapper-sc-" })<{
		$error?: boolean;
		$warning?: boolean;
		$info?: boolean;
		$readonly?: boolean;
		$disabled?: boolean;
	}>(({ theme, $error, $warning, $info, $readonly, $disabled }) => {
		const { baseInput, select } = theme.components;
		const { input } = theme.applicationStyles;
		const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;

		return css`
			background-color: ${input.background};
			border-radius: inherit;
			box-shadow: ${input.boxShadow};
			display: flex;
			flex-grow: 1;
			position: relative;

			${variant &&
			css`
				box-shadow: ${baseInput.input[variant].boxShadow};
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

			${!$readonly &&
			!$disabled &&
			css`
				${active(css`
					box-shadow: ${variant ? baseInput.input[variant].activeBoxShadow : input.activeBoxShadow};
				`)}
				${hover(css`
					box-shadow: ${variant ? baseInput.input[variant].hoverBoxShadow : input.hoverBoxShadow};
				`)}
				&:focus-within {
					${createBoxShadow(
						variant
							? (baseInput.input[variant].customDashedFocus ?? baseInput.input[variant].focusBoxShadow)
							: (select.input?.focus?.customBorder ?? input.focusCustomBoxShadow ?? input.focusBoxShadow)
					)}
					outline-offset: ${baseInput.input.outlineOffset};
					${inputDarkFocus}
				}
			`}

			${StyledFieldPrefixWrapper} > ${StyledIconWrapper} {
				color: inherit;
				cursor: default;
			}
		`;
	});

	export const StyledSelectArrow = styled.span.withConfig({ displayName: "StyledSelectArrow-sc-" })<{
		$readonly?: boolean;
		$disabled?: boolean;
	}>(({ theme, $readonly, $disabled }) => {
		const { select } = theme.components;

		return css`
			&:after {
				align-items: center;
				color: ${$disabled ? select.arrowIcon.disabledColor : select.arrowIcon.color};
				content: ${select.arrowIcon.content};
				display: ${$readonly ? "none" : "flex"};
				font-family: "Material Symbols Outlined";
				font-variation-settings:
					"FILL" 1,
					"wght" 400,
					"GRAD" 0,
					"opsz" 24;
				font-size: ${select.arrowIcon.fontSize};
				font-style: normal;
				justify-content: center;
				height: 100%;
				line-height: 0;
				pointer-events: none;
				position: absolute;
				right: 0;
				text-transform: none;
				top: 50%;
				transform: translateY(-50%);
				width: ${theme.applicationStyles.input.height};
				word-wrap: normal;
			}
		`;
	});
}

export namespace StyledNativeSelect {
	export const StyledSelectOption = styled.option.withConfig({ displayName: "StyledSelectOption-sc-" })<{
		$isEmptyValue?: boolean;
	}>(({ theme, disabled, $isEmptyValue }) => {
		const { select } = theme.components;

		return css`
			appearance: none;
			font-style: normal;

			${$isEmptyValue &&
			css`
				color: ${select.empty.color};
				font-style: ${select.empty.fontStyle};
			`}

			${!disabled &&
			!$isEmptyValue &&
			css`
				color: ${select.color};
				font-size: inherit;

				&:focus {
					border: none;
				}

				${active(css`
					background-color: ${select.option.active.backgroundColor};
					color: ${select.option.active.color};
				`)}

				${hover(css`
					background-color: ${select.option.hover.backgroundColor};
					color: ${select.option.hover.color};
				`)}
			`}
		`;
	});
}

export namespace StyledCustomSelect {
	export const StyledSelectModal = styled(ModalOverlay).withConfig({ displayName: "StyledSelectModal-sc-" })(
		({ theme }) => {
			const { input } = theme.components.baseInput;

			return css`
				${StyledModalOverlayContainer} ${StyledContentBoxContent} {
					padding: ${input.mobileContentboxPadding};
				}
			`;
		}
	);

	export const StyledSelectDropdownWrapper = styled.div.withConfig({ displayName: "StyledSelectDropdownWrapper-sc-" })(
		({ theme }) => {
			const { dropdown } = theme.components.select;

			return css`
				display: flex;
				margin: ${dropdown.margin};
			`;
		}
	);

	export const StyledSelectMobileTextField = styled(TextField).withConfig({
		displayName: "StyledSelectMobileTextField-sc-"
	})<{
		$isEmptyValue?: boolean;
	}>(({ theme, $isEmptyValue }) => {
		const { mobile } = theme.components.textField;
		const { input } = theme.applicationStyles;
		const { select } = theme.components;

		return css`
			${StyledFieldTextInput} {
				font-size: ${mobile?.fontSize};
				height: ${mobile?.height};
				pointer-events: none;

				${$isEmptyValue &&
				css`
					color: ${select.empty.color};
					font-style: ${select.empty.fontStyle};
				`}
			}

			${StyledFieldInput} {
				&:focus {
					box-shadow: ${input.focusBoxShadow};
					${inputDarkFocus}
				}

				${StyledFieldPrefixWrapper} > ${StyledIconWrapper} {
					color: inherit;
					cursor: default;
				}
			}
		`;
	});

	export const StyledSelectRichLabelWrapper = styled.div.withConfig({
		displayName: "StyledSelectRichLabelWrapper-sc-"
	})<{ $readonly?: boolean; $disabled?: boolean }>(({ theme, $readonly, $disabled }) => {
		const { baseInput } = theme.components;
		const { input } = theme.applicationStyles;

		return css`
			display: flex;
			width: 100%;
			padding: ${baseInput.input.padding};
			padding-right: ${input.height};
			cursor: ${$readonly || $disabled ? "default" : "pointer"};

			// Make the select control auto-expand to fit the rich label content
			${StyledSelectTemplate.StyledFieldSelectControl}:has(&) {
				height: auto;
				min-height: ${input.height};
			}
		`;
	});

	export const StyledSelectMobileWrapper = styled.div.withConfig({
		displayName: "StyledMobileModalSelect-sc-"
	})<{ $richLabelHeight?: number; $prefixWidth?: number }>(({ theme, $richLabelHeight, $prefixWidth }) => {
		const { input } = theme.applicationStyles;

		return css`
			display: flex;
			flex-direction: column;
			min-height: ${input.height};
			height: auto;
			width: 100%;
			justify-content: center;
			position: relative;

			> ${StyledSelectMobileTextField} {
				${StyledFieldInput} {
					min-height: ${$richLabelHeight}px;

					${StyledFieldTextInput} {
						color: transparent;
					}
				}
			}

			> ${StyledSelectRichLabelWrapper} {
				position: absolute;
				width: auto;
				${$prefixWidth &&
				css`
					left: ${$prefixWidth}px;
					padding-left: 0;
				`}
			}
		`;
	});
}
