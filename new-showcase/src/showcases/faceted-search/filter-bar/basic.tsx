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

import type { ReactElement } from "react";

import { FilterBar, Filter } from "@com.mgmtp.a12.widgets/widgets-core";

export function BasicFilterBarShowcase(): ReactElement {
	return (
		<div className="-u-width-full">
			<FilterBar>
				<Filter id="default-filter" name="Default Filter" options="Inactive" />
				<Filter id="active-filter" name="Active Filter" options={["Option A", "Option B"]} active />
				<Filter id="disabled-filter" name="Disabled Filter" options={["Option A", "Option B"]} disabled />
				<Filter id="non-removable-filter" name="Non-removable Filter" options="Inactive" nonRemovable />
				<Filter
					id="active-non-removable-filter"
					name="Active non-removable Filter"
					options={["Option A", "Option B"]}
					nonRemovable
					active
				/>
				<Filter
					id="disabled-non-removable-filter"
					name="Disabled non-removable Filter"
					options={["Option A", "Option B"]}
					nonRemovable
					disabled
				/>
				<Filter
					id="with-custom-separator-filter"
					name="Filter with custom separator"
					options={["Option A", "Option B"]}
					separator=" + "
				/>
			</FilterBar>
		</div>
	);
}
