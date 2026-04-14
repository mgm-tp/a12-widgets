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
import merge from "deepmerge";

import { A11yResourceDefinitions } from "./a11y-resources.js";
import type { A11yDefinition, A11yResourceTypeDefinition } from "./a11y-key-definition.api.js";

/**
 * Return an object with type {@link A11yDefinition} containing localized text used for accessibility hidden text.
 * @param locale Currently supporting "en" and "de" out of the box. Creating another {@link A11yDefinition} value and
 * merge it using {@link mergeA11yResource} to provide more locale.
 */
export function getA11yResource(locale: string): A11yDefinition {
	return A11yResourceDefinitions[locale] || {};
}

/**
 * Convenience method to merge custom definition with Widget's default
 * @param customResource Your custom value. This will override Widget's default if the same key is found.
 */
export function mergeA11yResource(customResource: Partial<A11yResourceTypeDefinition>): A11yResourceTypeDefinition {
	return merge(A11yResourceDefinitions, customResource);
}

/**
 * Default context to use inside Widget and provide default text in English. To use another language, pass the
 * language's specific value to its provider. Like :
 * ```
 * return <A11YLanguageContext.Provider value={getA11yResource(CURRENT_LOCALE)}>
 *     <Application>
 * </A11YLanguageContext.Provider>
 * ```
 */
const A11YLanguageContext = createContext<A11yDefinition>(getA11yResource("en"));

export { A11YLanguageContext };
