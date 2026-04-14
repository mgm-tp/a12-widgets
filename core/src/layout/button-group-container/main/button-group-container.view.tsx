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

import type { ReactNode } from "react";

import type { ButtonGroupContainerProps } from "./button-group-container.api.js";
import { ButtonGroupContainerNew } from "./button-group-container-new.view.js";
import { ButtonGroupContainerLegacy } from "./button-group-container-legacy.view.js";

/**
 * ButtonGroupContainer wrapper component that delegates to either the new or legacy implementation
 * based on which props are provided for backward compatibility.
 */
export function ButtonGroupContainer(props: ButtonGroupContainerProps): ReactNode {
	// Check if the new API (leftSlotButtons/rightSlotButtons) is being used
	const isUsingNewAPI = props.leftSlotButtons !== undefined || props.rightSlotButtons !== undefined;

	if (isUsingNewAPI) {
		// Use the new component with the new API props
		return (
			<ButtonGroupContainerNew
				{...props}
				leftSlotButtons={props.leftSlotButtons}
				rightSlotButtons={props.rightSlotButtons}
			/>
		);
	} else {
		// Use the legacy component with the deprecated API props
		return <ButtonGroupContainerLegacy {...props} leftSlot={props.leftSlot} rightSlot={props.rightSlot} />;
	}
}

ButtonGroupContainer.displayName = "ButtonGroupContainer";
