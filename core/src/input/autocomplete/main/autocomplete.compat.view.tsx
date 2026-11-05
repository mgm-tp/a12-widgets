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

/**
 * Compatibility shims for the two device-specific Autocomplete implementations that a single
 * component replaced in 39.1.0.
 *
 * Both presentations still exist — they are what the `mobileModal` prop selects — so each shim simply
 * pins it, which reproduces the old component exactly. They are functions rather than classes now;
 * the originals exposed no public methods beyond React's lifecycle, so an instance ref could not do
 * anything with them anyway.
 * @module
 */

import type { ReactElement } from "react";

import type { AutocompleteProps } from "./autocomplete.api.js";
import { Autocomplete } from "./autocomplete.view.js";

/**
 * The Autocomplete with its options in a dropdown attached to the field.
 * @deprecated since 39.1.0 — use {@link Autocomplete}, which picks the presentation from the device.
 * Pass `mobileModal={false}` to pin the attached dropdown on every device, as this component does.
 * Will be removed in a future major version.
 */
export function DefaultAutocomplete(props: AutocompleteProps): ReactElement<AutocompleteProps> {
	return <Autocomplete {...props} mobileModal={props.mobileModal ?? false} />;
}

DefaultAutocomplete.displayName = "DefaultAutocomplete";

/**
 * The Autocomplete with its options in a fullscreen dialog.
 * @deprecated since 39.1.0 — use {@link Autocomplete}, which picks the presentation from the device.
 * Pass `mobileModal` to pin the fullscreen dialog on every device, as this component does. Will be
 * removed in a future major version.
 */
export function MobileAutocomplete(props: AutocompleteProps): ReactElement<AutocompleteProps> {
	return <Autocomplete {...props} mobileModal={props.mobileModal ?? true} />;
}

MobileAutocomplete.displayName = "MobileAutocomplete";
