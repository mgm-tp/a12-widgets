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

import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { StyledCounter } from "../../counter/main/counter.view.js";
import { ModalOverlay, StyledModalOverlayContainer } from "../../modal-overlay/main/modal-overlay.view.js";
import { StyledContentBoxContent } from "../../contentbox/main/template/contentbox.tpl.styled.js";
import { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";
import { TextField } from "../../input/text-field/text-field.view.js";

import StyledFieldInput = StyledBaseInput.StyledFieldInput;

export const StyledMultiselectWrapper = styled.div.withConfig({ displayName: "StyledMultiselectWrapper-sc-" })<{
	$disabled?: boolean;
	$readonly?: boolean;
}>(({ theme, $disabled, $readonly }) => {
	const { multiselect } = theme.components;

	return css`
		width: 100%;

		${StyledBaseInput.StyledFieldTextInput} {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		${StyledCounter} {
			color: ${$disabled ? multiselect.disabledCounterColor : $readonly && multiselect.readonlyCounterColor};
		}
	`;
});

export const StyledMultiselectModal = styled(ModalOverlay).withConfig({ displayName: "StyledMultiselectModal-sc-" })(
	({ theme }) => {
		return css`
			${StyledModalOverlayContainer} ${StyledContentBoxContent} {
				padding: ${theme.components.baseInput.input.mobileContentboxPadding};
			}
		`;
	}
);

export const StyledMultiselectDropdown = styled(DropDown).withConfig({ displayName: "StyledMultiselectDropdown-sc-" })`
	margin: ${({ theme }) => theme.components.multiselect.dropdown.margin};
`;

export const StyledMultiselectInput = styled(TextField).withConfig({
	displayName: "StyledMultiselectInput-sc-"
})(({ theme, warning, warningMessage, error, errorMessage, info, infoMessage }) => {
	const { multiselect } = theme.components;
	const { input } = multiselect;

	const isVariant = warning || error || info || !!warningMessage || !!errorMessage || !!infoMessage;

	return css`
		${input?.focus?.customBorder &&
		!isVariant &&
		css`
			${StyledFieldInput}[data-isfocused="true"] {
				${createBoxShadow(input.focus.customBorder)}
			}
		`}
	`;
});
