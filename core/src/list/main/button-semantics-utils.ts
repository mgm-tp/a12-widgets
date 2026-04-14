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

import { css } from "styled-components";
import type { DefaultTheme } from "styled-components";

import { baseStyles } from "../../button/main/button.styled.js";

/**@internal */
export interface ButtonSemantics {
	primary?: boolean;
	secondary?: boolean;
	destructive?: boolean;
	active?: boolean;
	iconOnly?: boolean;
}

/**@internal */
export interface ButtonSemanticsStyleOptions {
	buttonSemantics: ButtonSemantics;
	disabled?: boolean;
	theme: DefaultTheme;
}

const getButtonType = (buttonSemantics: ButtonSemantics): "primary" | "secondary" | "iconButton" | null => {
	if (!buttonSemantics) {
		return null;
	}

	if (buttonSemantics.primary) {
		return "primary";
	}

	if (buttonSemantics.iconOnly) {
		return "iconButton";
	}

	return "secondary";
};

/**@internal */
export const createButtonSemanticStyles = (options: ButtonSemanticsStyleOptions): ReturnType<typeof css> => {
	const { buttonSemantics, disabled = false, theme } = options;

	const buttonType = getButtonType(buttonSemantics);

	if (!buttonType) {
		return css``;
	}

	// Get the base button styles
	const buttonStyles = baseStyles({
		type: buttonType,
		theme,
		disabled,
		active: buttonSemantics.active,
		destructive: buttonSemantics.destructive
	});

	return css`
		${buttonStyles}
		// Prevent jumping text while focusing or hovering
		&:not(:disabled) {
			&:hover,
			&:active,
			&:focus {
				border: none;
				outline: none; // remove double outline in top and button of the list item
			}
		}
	`;
};
