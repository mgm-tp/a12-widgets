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

import { ModalOverlay, StyledModalOverlayContainer } from "../../modal-overlay/main/modal-overlay.view.js";
import { fadeIn, fadeOut } from "../../theme/base/mixins/_animation.js";

export const StyledPopupMenuModalOverlay = styled(ModalOverlay).withConfig({
	displayName: "StyledPopupMenuModalOverlay-sc-"
})<{
	$transitionTime: number;
	$hasOverlay?: boolean;
	$showModalOverlay?: boolean;
}>(({ $transitionTime, $hasOverlay, $showModalOverlay }) => {
	return css`
		${!$hasOverlay &&
		css`
			background: unset;

			${StyledModalOverlayContainer} {
				height: fit-content;
			}
		`}

		animation-name: ${$showModalOverlay ? fadeIn() : fadeOut()};
		animation-duration: ${$transitionTime}ms;
		opacity: ${$showModalOverlay ? 1 : 0};
		-webkit-animation-name: ${$showModalOverlay ? fadeIn() : fadeOut()};
		-webkit-animation-duration: ${$transitionTime}ms;
	`;
});
