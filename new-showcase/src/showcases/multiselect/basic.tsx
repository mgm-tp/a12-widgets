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
import { useState, useMemo } from "react";

import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { provider, noop, Icon, Multiselect } from "@com.mgmtp.a12.widgets/widgets-core";

import { getItems, ITEMS } from "./data.js";

type Item = MultiselectProps.Item;

export function BasicMultiselect(): ReactElement {
	const [selectedItems, setSelectedItems] = useState<Item[]>([ITEMS[2]]);
	const isMobile = provider.isPhone();

	const items = useMemo(() => {
		const selectedIds = selectedItems.map((i) => i.id);

		return getItems(selectedIds);
	}, [selectedItems]);

	return (
		<div className="-u-width-full">
			<Multiselect
				id="multiselect-with-graphic"
				label="Multiselect with a graphic label"
				labelGraphic={<Icon>info</Icon>}
				mobile={isMobile}
				hintTemplate="{count} of {total} options shown"
				selectAllText="All"
				mobileHeadingTitle="Select your options"
				placeholder="Please select or start typing"
				onChange={setSelectedItems}
				items={items}
			/>
			<br />

			<Multiselect
				id="readonly-multiselect"
				label="Readonly"
				mobileHeadingTitle="Select your options"
				placeholder="Please select or start typing"
				mobile={isMobile}
				onChange={noop}
				items={ITEMS}
				readonly
			/>
			<br />

			<Multiselect
				id="disabled-multiselect"
				label="Disabled with value"
				mobileHeadingTitle="Select your options"
				placeholder="Please select or start typing"
				mobile={isMobile}
				onChange={noop}
				items={getItems(["3"])}
				disabled
			/>
		</div>
	);
}
