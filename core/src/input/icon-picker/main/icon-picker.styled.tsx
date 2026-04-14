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

import { StyledDropdownGraphic, StyledDropdownItem } from "../../../dropdown/main/template/dropdown.tpl.styled.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { createBoxShadow } from "../../../theme/base/mixins/_borderEffects.js";

import StyledFieldInput = StyledBaseInput.StyledFieldInput;

export const StyledIconPickerPreviewIcon = styled(Icon).withConfig({
	displayName: "StyledIconPickerPreviewIcon-sc-"
})``;

export const StyledIconPickerWrapper = styled.div.withConfig({ displayName: "StyledIconPickerWrapper-sc-" })<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { input } = theme.components.iconPicker;

	return css`
		width: 100%;
		${StyledIconPickerPreviewIcon} {
			color: ${$disabled ? "inherit" : theme.components.iconPicker.inputSelectedIconColor};
		}

		${input?.focus?.customBorder &&
		css`
			${StyledFieldInput}[data-isfocused="true"] {
				${createBoxShadow(input.focus.customBorder)}
			}
		`}
	`;
});

export const StyledIconPickerDropdown = styled(DropDown).withConfig({ displayName: "StyledIconPickerDropdown-sc-" })<{
	$saveSpace?: boolean;
}>(({ theme, $saveSpace }) => {
	const { iconPicker } = theme.components;

	return css`
		margin: ${iconPicker.containerMargin};

		${StyledDropdownItem}[aria-selected="true"] {
			color: ${iconPicker.selectedItem.color};

			${StyledDropdownGraphic} {
				background-color: ${iconPicker.selectedItem.icon.backgroundColor};
				border-radius: 50%;
				color: ${iconPicker.selectedItem.icon.color};
			}
		}

		${$saveSpace &&
		css`
			${StyledDropdownItem} {
				padding: ${iconPicker.smallContainerIconPadding};
			}
		`}
	`;
});
