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

import { createContext } from "react";

/** Layout and appearance the options inherit from the list they belong to. */
export interface DropdownContextValue {
	horizontal: boolean;
	touch: boolean;
	lightBackground: boolean;
	extended: boolean;

	/**
	 * Whether the list allows more than one option to be selected.
	 *
	 * Optional because the provider is exported and someone outside may be rendering it
	 * with a value object of their own, written before this property existed.
	 */
	multiple?: boolean;
}

export const DEFAULT_CONTEXT_VALUE: DropdownContextValue = {
	horizontal: false,
	touch: false,
	lightBackground: false,
	extended: false,
	multiple: false
};

export const DropdownContext = createContext(DEFAULT_CONTEXT_VALUE);

export const DropdownContextProvider = DropdownContext.Provider;
