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

import { StyledDropdownWrapper } from "../../../dropdown/main/template/dropdown.tpl.styled.js";
import { StyledModalOverlayContainer, ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import { StyledContentBoxContent } from "../../../contentbox/main/template/contentbox.tpl.styled.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { createBoxShadow } from "../../../theme/base/mixins/_borderEffects.js";

const { helperClassInDisabledStyles, StyledFieldInput } = StyledBaseInput;

export const StyledAutocompleteWrapper = styled.div.withConfig({ displayName: "StyledAutocompleteWrapper-sc-" })<{
	$disabled?: boolean;
}>(({ $disabled, theme }) => {
	const { input } = theme.components.autocomplete;

	return css`
		position: relative;
		width: 100%;

		${$disabled && helperClassInDisabledStyles}

		${input?.focus?.customBorder &&
		css`
			${StyledFieldInput}[data-isfocused="true"] {
				${createBoxShadow(input.focus.customBorder)}
			}
		`}
	`;
});

export const StyledAutocompleteDropdownWrapper = styled.div.withConfig({
	displayName: "StyledAutocompleteDropdownWrapper-sc-"
})<{ isLoading?: boolean }>(({ theme, isLoading }) => {
	const { dropdown } = theme.components.autocomplete;

	return css`
		display: flex;
		outline: 1px solid transparent;
		margin: ${dropdown.margin};
		min-height: ${isLoading && dropdown.loadingMinHeight};

		${StyledDropdownWrapper} {
			min-height: inherit;
		}
	`;
});

export const StyledAutocompleteModal = styled(ModalOverlay).withConfig({ displayName: "StyledAutocompleteModal-sc-" })(
	({ theme }) => {
		const { input } = theme.components.autocomplete;

		return css`
			${StyledModalOverlayContainer} ${StyledContentBoxContent} {
				padding: ${theme.components.baseInput.input.mobileContentboxPadding};
			}

			${input?.focus?.customBorder &&
			css`
				${StyledFieldInput}[data-isfocused="true"] {
					${createBoxShadow(input.focus.customBorder)}
				}
			`}
		`;
	}
);
