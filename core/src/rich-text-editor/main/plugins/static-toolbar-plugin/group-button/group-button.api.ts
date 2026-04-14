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

import type { DataRole, Identifiable, Styleable } from "../../../../../common/main/base-props.js";
import type { A11yDefinition } from "../../../../../common/main/a11y-localization/a11y-key-definition.api.js";

import type { ButtonType } from "../toolbar-button/toolbar-button.api.js";

export interface ToolbarButtonGroupProps<LanguageContext = A11yDefinition> extends Styleable, Identifiable, DataRole {
	/**
	 * The list of button as group button items.
	 */
	buttons: ButtonType[];

	/**
	 * The title displayed when hovering the group button.
	 */
	title?: string | ((context: LanguageContext) => string | undefined);

	/**
	 * aria-control attribute for the group button.
	 */
	ariaControls?: string;

	/**
	 * aria-describedby attribute for the group button.
	 */
	ariaDescribedby?: string;

	/**
	 * Icon for the button.
	 */
	icon?: ReactNode;

	/**
	 * Specifies the tabIndex attribute for the group button.
	 */
	tabIndex?: number;
}
