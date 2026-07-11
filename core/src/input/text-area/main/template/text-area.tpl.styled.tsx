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

import { StyledBaseInput } from "../../../base-input-styled/base.styled.js";
import { createBoxShadow } from "../../../../theme/base/mixins/_borderEffects.js";

import StyledFieldInput = StyledBaseInput.StyledFieldInput;

export const StyledTextAreaInputWrapper = styled(StyledBaseInput.StyledFieldInput).withConfig({
	displayName: "StyledTextAreaInputWrapper-sc-"
})(({ theme }) => {
	const { textArea } = theme.components;

	return css`
		height: auto;

		${textArea?.focus?.customBorder &&
		css`
			&${StyledFieldInput}[data-isfocused="true"] {
				${createBoxShadow(textArea.focus.customBorder)}
			}
		`}
	`;
});

export const StyledTextAreaAddon = styled(StyledBaseInput.StyledFieldAddon).withConfig({
	displayName: "StyledTextAreaAddon-sc-"
})(({ theme }) => {
	return css`
		align-items: flex-start;
		line-height: ${theme.components.textArea.minHeight};
	`;
});

export const StyledTextAreaInput = styled(StyledBaseInput.StyledFieldTextInput).withConfig({
	displayName: "StyledTextAreaInput-sc-"
})<{ autoExpand?: boolean }>(({ theme, autoExpand }) => {
	const { textArea, textField } = theme.components;

	return css`
		height: ${autoExpand ? textArea.autoExpand.height : textArea.height};
		overflow-y: ${autoExpand && "hidden"};
		padding: ${textArea.padding};
		resize: ${autoExpand ? "none" : "vertical"};
		max-height: ${!autoExpand && textArea.maxHeight};
		min-height: ${autoExpand ? textArea.autoExpand.minHeight : textArea.minHeight};
		min-width: 0;

		${StyledBaseInput.StyledFieldPrefixWrapper}, ${StyledBaseInput.StyledFieldSuffixWrapper} {
			height: ${textArea.affixHeight};
		}

		${StyledBaseInput.StyledFieldWrapper} ${StyledBaseInput.StyledFieldMobile} ${StyledBaseInput.StyledFieldMain} & {
			font-size: ${textField.mobile?.fontSize};
			height: ${textField.mobile?.height};
		}
	`;
});
