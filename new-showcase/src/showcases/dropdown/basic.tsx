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
import { useState } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Checkbox, DropDown, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const items = [
	{ label: "Empty item", isEmptyValue: true },
	{ label: "Armchair" },
	{ label: "Bean bag" },
	{ label: "Disabled item", disabled: true },
	{ label: "Chair" },
	{ label: "Desk" },
	{ label: "Pocker table" },
	{ label: "Rocking chair" },
	{ label: "Sideboard" },
	{ label: "Waterbed" }
].map((item, index) => ({ ...item, tabIndex: 0, value: `value ${index}` }));

export function Basic(): ReactElement {
	const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);
	const [lightBackground, setLightBackground] = useState<boolean>(false);

	return (
		<ConfigurationView
			reportLabel="Basic"
			configuration={
				<Checkbox
					fitToParent={false}
					checked={lightBackground}
					label="Light Background"
					onChange={() => setLightBackground(!lightBackground)}
				/>
			}
			useDarkBackground
		>
			<DropDown
				hint="10 of 10 options shown"
				items={items}
				onSelectedItemChange={setSelectedItem}
				selectedItem={selectedItem}
				lightBackground={lightBackground}
				footer={<Link useAsButton>Load More</Link>}
			/>
		</ConfigurationView>
	);
}
