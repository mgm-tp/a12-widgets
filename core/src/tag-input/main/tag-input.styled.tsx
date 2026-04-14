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

import { TagGroup } from "../../tag/main/tag-group.view.js";
import { StyledTagContent, Tag } from "../../tag/main/tag/tag.view.js";
import { active, inputDarkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import {
	StyledTextAreaInput,
	StyledTextAreaInputWrapper
} from "../../input/text-area/main/template/text-area.tpl.styled.js";
import { StyledDropdownItem, StyledDropdownWrapper } from "../../dropdown/main/template/dropdown.tpl.styled.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import {
	StyledContentBoxContent,
	StyledContentBoxFooter
} from "../../contentbox/main/template/contentbox.tpl.styled.js";
import { SubHeadingElements } from "../../contentbox/main/template/elements/sub-heading.tpl.view.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";
import { TextAreaStateless } from "../../input/text-area/main/template/text-area.tpl.view.js";

import StyledBaseInputField = StyledBaseInput.StyledFieldInput;
import StyledFieldInput = StyledBaseInput.StyledFieldInput;

const TagInputTagGroupBaseStyle = css`
	align-items: center;
	border-radius: ${({ theme }) => theme.applicationStyles.input.borderRadius};
	display: flex;
	flex-wrap: wrap;
	outline: none;
`;

export const StyledTextAreaStateless = styled(TextAreaStateless).withConfig({
	displayName: "StyledTextAreaStateless-sc-"
})`
	${StyledFieldInput}[data-isfocused="true"]:before {
		display: none;
	}
`;

export const StyledTagInputFieldWrapper = styled(StyledBaseInput.StyledFieldWrapper).withConfig({
	displayName: "StyledTagInputFieldWrapper-sc-"
})`
	outline: none;
	position: relative;

	${StyledBaseInput.StyledField} {
		min-width: ${({ theme }) => theme.components.tagInput.fieldMinWidth}px;
	}
`;

export const StyledTagInputFieldAddon = styled(StyledBaseInput.StyledFieldAddon).withConfig({})`
	align-self: flex-start;
	height: ${({ theme }) => theme.components.tagInput.tagGroup.minHeight};
`;

export const StyledTagInputGroupWrapper = styled.div.withConfig({ displayName: "StyledTagInputGroupWrapper-sc-" })`
	display: flex;

	${StyledBaseInputField} {
		border: none;
	}
`;

export const StyledTagInputTag = styled(Tag).withConfig({ displayName: "StyledTagInputTag-sc-" })<{
	$focus?: boolean;
	$hover?: boolean;
	$disabled?: boolean;
	$readonly?: boolean;
}>(({ theme, $focus, $disabled, $readonly, $hover }) => {
	const { tag, tagInput } = theme.components;

	return css`
		outline-color: transparent;
		max-width: 100%;
		&& {
			//Cascade the style of default TagGroup
			margin: ${tagInput.tag.margin};
		}

		${!$readonly &&
		!$disabled &&
		css`
			${$hover &&
			css`
				${active(css`
					${StyledTagContent} {
						border-color: ${tagInput.tag.activeBorderColor};
						box-shadow: none;
					}
				`)}
				${hover(css`
					${StyledTagContent} {
						border-color: ${tagInput.tag.hoverBorderColor};
						box-shadow: none;
						cursor: pointer;
					}
				`)}
			`}

			${$focus &&
			css`
				${inputDarkFocus}
				${StyledTagContent} {
					border-color: ${tag.content.focusBorderColor};
				}
			`}
		`}

		${$readonly &&
		css`
			background-color: ${tagInput.tag.readonlyBG};

			${StyledTagContent} {
				border-color: transparent;
			}
		`}
		
		${$disabled &&
		css`
			background-color: ${tagInput.tag.disabled.background};

			${StyledTagContent} {
				border-color: transparent;
				color: ${tagInput.tag.disabled.color};
			}
		`}
	`;
});

export const StyledTagInputTagGroup = styled(TagGroup).withConfig({ displayName: "StyledTagInputTagGroup-sc-" })<{
	$disabled?: boolean;
	$readonly?: boolean;
	$noEffect?: boolean;
	$focus?: boolean;
	$tagHover?: boolean;
	$warning?: boolean;
	$error?: boolean;
	$info?: boolean;
}>(({ theme, $disabled, $readonly, $noEffect, $focus, $warning, $error, $info }) => {
	const { tagInput, contentBox, baseInput, tag } = theme.components;
	const { input } = theme.applicationStyles;
	const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;
	const isInteractive = !$disabled && !$readonly;

	return css`
		${TagInputTagGroupBaseStyle};
		height: auto;
		min-height: ${tagInput.tagGroup.minHeight};
		outline: 1px solid transparent;
		padding: ${tagInput.tagGroup.padding};
		width: ${tagInput.tagGroup.width};

		${isInteractive &&
		css`
			background-color: ${tagInput.tagGroup.background};
			box-shadow: ${variant ? tagInput[`${variant}BoxShadow`] : tagInput.tagGroup.boxShadow};

			${!$noEffect &&
			css`
				${active(css`
					box-shadow: ${variant ? baseInput.input[variant].activeBoxShadow : input.activeBoxShadow};
				`)}
				${hover(css`
					box-shadow: ${variant ? baseInput.input[variant].hoverBoxShadow : input.hoverBoxShadow};
				`)}
            	${$focus &&
				css`
					${createBoxShadow(
						variant
							? (baseInput.input[variant].customDashedFocus ?? baseInput.input[variant].focusBoxShadow)
							: (tagInput.input?.focus?.customBorder ?? input.focusCustomBoxShadow ?? input.focusBoxShadow)
					)}
					${inputDarkFocus}
				`}
			`}

			${StyledContentBoxFooter} &,
			${SubHeadingElements.StyledSubHeading} & {
				background-color: ${contentBox.subHeading.inputBackground};
			}
		`}

		${$readonly &&
		css`
			background-color: ${tagInput.readonlyBG};
			box-shadow: none;
		`}
		${$disabled &&
		css`
			background-color: ${tagInput.disabled.background};
			box-shadow: ${tagInput.disabled.boxShadow};
			color: ${tagInput.disabled.color};
		`}
		> ${StyledBaseInput.StyledFieldWrapper} {
			align-items: center;
			flex: 1;
			flex-basis: 0;
			min-width: ${tagInput.fieldMinWidth}px;
			outline: none;
			position: relative;

			${StyledTextAreaInputWrapper} {
				box-shadow: none;
				outline: none;

				${StyledTextAreaInput} {
					${isInteractive &&
					css`
						border-radius: ${tag.borderRadius};
						border: ${tagInput.textArea.border};
					`};
					height: ${tagInput.textArea.height}px;
					line-height: ${tagInput.textArea.lineHeight};
					min-height: ${tagInput.textArea.height}px;
					padding: ${tagInput.textArea.padding};
					min-width: ${tagInput.fieldMinWidth}px;
				}
			}
		}
	`;
});

export const StyledTagInputTouch = styled.div.withConfig({ displayName: "StyledTagInputTouch-sc-" })`
	display: flex;
	flex-direction: column;
	height: 100%;

	${StyledDropdownWrapper} {
		margin-top: 2px;

		${StyledDropdownItem}[data-type="tag-disabled"] {
			pointer-events: auto;
			user-select: auto;
		}
	}
`;

export const StyledTagInputActionContentBox = styled(ActionContentbox).withConfig({
	displayName: "StyledTagInputActionContentBox-sc-"
})`
	&& {
		${StyledContentBoxContent} {
			padding: ${({ theme }) => theme.components.baseInput.input.mobileContentboxPadding};
		}
	}
`;

export const StyledTagInputHiddenSpan = styled.span.withConfig({ displayName: "StyledTagInputHiddenSpan-sc-" })`
	width: auto;
	position: absolute;
	visibility: hidden;
`;
